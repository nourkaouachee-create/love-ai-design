import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().max(6000),
      }),
    )
    .min(1)
    .max(30),
  idToken: z.string().max(8192).optional(),
});

export const generateLoveAiReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { runLoveAiChat } = await import("./love-ai.server");
    const { getUserSettings } = await import("./user-language.server");
    const { listMemories, updateMemoriesFromExchange } = await import("./memory.server");

    const { uid, language, memoryEnabled } = await getUserSettings(data.idToken);
    const useMemory = Boolean(uid && data.idToken && memoryEnabled);
    const memories = useMemory ? await listMemories(uid!, data.idToken!) : [];

    const result = await runLoveAiChat(
      data.messages,
      language,
      memories.map((m) => m.content),
    );

    if (useMemory) {
      const lastUser = [...data.messages].reverse().find((m) => m.role === "user");
      if (lastUser) {
        await updateMemoriesFromExchange({
          uid: uid!,
          idToken: data.idToken!,
          userMessage: lastUser.content,
          assistantMessage: result.text,
          existing: memories,
        });
      }
    }

    return result;
  });
