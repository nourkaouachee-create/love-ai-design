/**
 * Server-side lookup of the authenticated user's stored language preference.
 * The client sends only a Firebase ID token; the language itself is never
 * accepted from the client, so it cannot be overridden.
 */

const PROJECT_ID = "love-ai-b5e26";
const FIREBASE_API_KEY = "AIzaSyC25_myzSkpjkYaR28RA0CmqfJzHiGI8rQ";

export type LoveAiLanguage = "en" | "fr" | "ar";

const LANGUAGES: LoveAiLanguage[] = ["en", "fr", "ar"];

export const LANGUAGE_INSTRUCTIONS: Record<LoveAiLanguage, string> = {
  en: "Always write your replies in English, regardless of the language the user writes in. Understand the user's message in whatever language they use.",
  fr: "Écris toujours tes réponses en français, quelle que soit la langue utilisée par l'utilisateur. Comprends le message de l'utilisateur quelle que soit sa langue.",
  ar: "اكتب دائمًا ردودك باللغة العربية الفصحى المبسّطة، مهما كانت اللغة التي يكتب بها المستخدم. افهم رسالة المستخدم بأي لغة يكتبها.",
};

/** Verify a Firebase ID token and return its uid, or null when invalid. */
async function verifyIdToken(idToken: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as { users?: Array<{ localId?: string }> };
    return json.users?.[0]?.localId ?? null;
  } catch {
    return null;
  }
}

/**
 * Reads users/{uid}.language via the Firestore REST API using the caller's own
 * token (Firestore rules still apply). Falls back to "en" on any problem.
 */
export async function getUserLanguage(idToken?: string): Promise<LoveAiLanguage> {
  if (!idToken) return "en";
  const uid = await verifyIdToken(idToken);
  if (!uid) return "en";

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/${encodeURIComponent(uid)}`,
      { headers: { Authorization: `Bearer ${idToken}` } },
    );
    if (!res.ok) return "en";
    const json = (await res.json()) as {
      fields?: { language?: { stringValue?: string } };
    };
    const value = json.fields?.language?.stringValue;
    return LANGUAGES.includes(value as LoveAiLanguage) ? (value as LoveAiLanguage) : "en";
  } catch {
    return "en";
  }
}
