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
});

export const generateLoveAiReply = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const { runLoveAiChat } = await import("./love-ai.server");
    return runLoveAiChat(data.messages);
  });
