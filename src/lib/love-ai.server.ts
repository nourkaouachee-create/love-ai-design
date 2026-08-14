import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { LOVE_AI_SYSTEM_PROMPT } from "./love-ai-prompt.server";

export type LoveAiTurn = { role: "user" | "assistant"; content: string };

/** Errors thrown here are already user-safe: no provider details, no key material. */
export async function runLoveAiChat(messages: LoveAiTurn[]): Promise<{ text: string }> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) {
    console.error("LOVABLE_API_KEY is not configured");
    throw new Error("Love AI is unavailable right now. Please try again in a moment.");
  }

  const gateway = createLovableAiGatewayProvider(apiKey);

  try {
    const result = streamText({
      model: gateway("google/gemini-3.6-flash"),
      system: LOVE_AI_SYSTEM_PROMPT,
      messages,
    });

    const text = (await result.text).trim();
    if (!text) {
      throw new Error("Love AI couldn't find the words just now. Please try again.");
    }
    return { text };
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode
      ?? (error as { status?: number })?.status;
    console.error("Love AI gateway error", error);
    if (status === 429) {
      throw new Error("Love AI is a little busy. Please try again in a moment.");
    }
    if (status === 402) {
      throw new Error("Love AI is temporarily unavailable. Please try again later.");
    }
    throw new Error("Love AI couldn't respond right now. Please try again.");
  }
}
