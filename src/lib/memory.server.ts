import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { PROJECT_ID } from "./user-language.server";

export type StoredMemory = { id: string; content: string; category: string };

export const MAX_MEMORIES = 50;

const base = (uid: string) =>
  `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${encodeURIComponent(uid)}/memories`;

const auth = (idToken: string) => ({
  Authorization: `Bearer ${idToken}`,
  "Content-Type": "application/json",
});

/** Reads the caller's own memories (Firestore rules still apply). */
export async function listMemories(uid: string, idToken: string): Promise<StoredMemory[]> {
  try {
    const res = await fetch(`${base(uid)}?pageSize=${MAX_MEMORIES}`, {
      headers: auth(idToken),
    });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      documents?: Array<{
        name: string;
        fields?: { content?: { stringValue?: string }; category?: { stringValue?: string } };
      }>;
    };
    return (json.documents ?? [])
      .map((d) => ({
        id: d.name.split("/").pop() ?? "",
        content: d.fields?.content?.stringValue ?? "",
        category: d.fields?.category?.stringValue ?? "general",
      }))
      .filter((m) => m.id && m.content);
  } catch {
    return [];
  }
}

async function createMemory(uid: string, idToken: string, m: { content: string; category: string }) {
  const now = new Date().toISOString();
  await fetch(base(uid), {
    method: "POST",
    headers: auth(idToken),
    body: JSON.stringify({
      fields: {
        content: { stringValue: m.content },
        category: { stringValue: m.category },
        createdAt: { timestampValue: now },
        updatedAt: { timestampValue: now },
      },
    }),
  });
}

async function updateMemory(
  uid: string,
  idToken: string,
  id: string,
  m: { content: string; category: string },
) {
  const url = `${base(uid)}/${encodeURIComponent(id)}?updateMask.fieldPaths=content&updateMask.fieldPaths=category&updateMask.fieldPaths=updatedAt`;
  await fetch(url, {
    method: "PATCH",
    headers: auth(idToken),
    body: JSON.stringify({
      fields: {
        content: { stringValue: m.content },
        category: { stringValue: m.category },
        updatedAt: { timestampValue: new Date().toISOString() },
      },
    }),
  });
}

const EXTRACT_PROMPT = `You maintain a small long-term memory store for a relationship-coaching assistant.
From the latest exchange, extract ONLY durable, useful, non-sensitive facts that would improve future conversations
(e.g. partner's name, relationship length, recurring goals, communication style, stated preferences).

NEVER store: passing emotions, one-time situations, small talk, advice you gave, or highly sensitive data
(health conditions, sexual details, finances, addresses, religion, exact identifiers).

If an existing memory covers the same topic, return it with its "id" and a merged, updated "content" instead of a duplicate.
Return STRICT JSON only: {"memories":[{"id":"<existing id or empty>","content":"short factual sentence","category":"partner|relationship|goal|preference|general"}]}
Return {"memories":[]} when nothing is worth storing. Never return more than 3 items.`;

/**
 * Extracts and persists memories after a successful exchange. Best-effort:
 * any failure is swallowed so chat is never impacted.
 */
export async function updateMemoriesFromExchange(params: {
  uid: string;
  idToken: string;
  userMessage: string;
  assistantMessage: string;
  existing: StoredMemory[];
}): Promise<void> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return;
  try {
    const gateway = createLovableAiGatewayProvider(apiKey);
    const { text } = await generateText({
      model: gateway("google/gemini-3.6-flash"),
      system: EXTRACT_PROMPT,
      prompt: `Existing memories (JSON):\n${JSON.stringify(
        params.existing.map((m) => ({ id: m.id, content: m.content, category: m.category })),
      )}\n\nUser: ${params.userMessage}\n\nAssistant: ${params.assistantMessage}`,
    });

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return;
    const parsed = JSON.parse(match[0]) as {
      memories?: Array<{ id?: string; content?: string; category?: string }>;
    };
    const items = (parsed.memories ?? []).slice(0, 3);
    let count = params.existing.length;

    for (const item of items) {
      const content = (item.content ?? "").trim().slice(0, 400);
      if (!content) continue;
      const category = (item.category ?? "general").trim().slice(0, 40) || "general";
      const existing = item.id ? params.existing.find((m) => m.id === item.id) : undefined;
      if (existing) {
        await updateMemory(params.uid, params.idToken, existing.id, { content, category });
      } else if (count < MAX_MEMORIES) {
        await createMemory(params.uid, params.idToken, { content, category });
        count += 1;
      }
    }
  } catch (error) {
    console.error("Memory extraction failed", error);
  }
}
