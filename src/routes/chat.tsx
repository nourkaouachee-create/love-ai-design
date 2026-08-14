import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import {
  ArrowLeft,
  MoreHorizontal,
  Mic,
  Paperclip,
  Send,
  Plus,
  History,
  Trash2,
  Download,
  Settings,
} from "lucide-react";
import {
  Conversation,
  ConversationContent,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import pixelHeart from "@/assets/pixel-heart.png";
import { useAuth } from "@/hooks/use-auth";
import {
  addMessage,
  createConversation,
  listMessages,
  titleFromMessage,
} from "@/lib/chat-store";
import { generateLoveAiReply } from "@/lib/chat-ai.functions";

export const Route = createFileRoute("/chat")({
  validateSearch: (search: Record<string, unknown>): { c?: string } =>
    typeof search.c === "string" && search.c ? { c: search.c } : {},
  head: () => ({
    meta: [
      { title: "Chat — Love AI" },
      {
        name: "description",
        content: "Talk with your Love AI relationship coach.",
      },
    ],
  }),
  component: ChatPage,
});

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Hi! I'm Love AI, your personal relationship coach. How can I help you today?",
  },
];

const suggestions = [
  "My partner ignores me",
  "We argue a lot",
  "Breakup advice",
  "Trust issues",
  "Long-distance relationship",
];

function ChatPage() {
  const router = useRouter();
  const navigate = useNavigate();
  const { c: conversationId } = Route.useSearch();
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const convIdRef = useRef<string | undefined>(conversationId);

  useEffect(() => {
    convIdRef.current = conversationId;
  }, [conversationId]);

  // Load an existing conversation's messages from Firestore.
  useEffect(() => {
    let cancelled = false;
    if (!conversationId || !user) {
      if (!conversationId) setMessages(initialMessages);
      return;
    }
    setLoadingHistory(true);
    setError(null);
    listMessages(conversationId)
      .then((stored) => {
        if (cancelled) return;
        setMessages([
          ...initialMessages,
          ...stored
            .filter((m) => m.role !== "system")
            .map((m) => ({
              id: m.id,
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
        ]);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(readableError(e));
      })
      .finally(() => {
        if (!cancelled) setLoadingHistory(false);
      });
    return () => {
      cancelled = true;
    };
  }, [conversationId, user]);

  const send = useCallback(
    async (text: string) => {
      const value = text.trim();
      if (!value) return;
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "user", content: value },
      ]);
      setInput("");
      setIsTyping(true);
      setError(null);

      const reply =
        "Thank you for sharing. I'm here to listen — this is a placeholder response while we build the AI.";

      try {
        if (user) {
          let id = convIdRef.current;
          if (!id) {
            id = await createConversation(user.uid, titleFromMessage(value));
            convIdRef.current = id;
            navigate({ to: "/chat", search: { c: id }, replace: true });
          }
          await addMessage({
            conversationId: id,
            userId: user.uid,
            role: "user",
            content: value,
          });
          await new Promise((r) => window.setTimeout(r, 1400));
          await addMessage({
            conversationId: id,
            userId: user.uid,
            role: "assistant",
            content: reply,
          });
        } else {
          await new Promise((r) => window.setTimeout(r, 1400));
        }
      } catch (e) {
        setError(readableError(e));
      }

      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "assistant", content: reply },
      ]);
      setIsTyping(false);
    },
    [navigate, user],
  );

  const reset = () => {
    convIdRef.current = undefined;
    setError(null);
    setMessages(initialMessages);
    navigate({ to: "/chat", search: {}, replace: true });
  };

  return (
    <div className="relative min-h-[100dvh] bg-gradient-hero">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/60 bg-white/70 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.history.back()}
              className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-foreground shadow-soft ring-1 ring-white transition active:scale-95"
              aria-label="Back"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-soft ring-1 ring-lavender-soft">
                <img
                  src={pixelHeart}
                  alt=""
                  width={512}
                  height={512}
                  className="size-6 object-contain"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px] font-semibold text-foreground">
                  Love AI
                </p>
                <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.400)]" />
                  AI Coach · Online
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Chat menu"
                  className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-foreground shadow-soft ring-1 ring-white transition active:scale-95"
                >
                  <MoreHorizontal className="size-5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl border-white/70 bg-white/95 p-1.5 shadow-elegant backdrop-blur-xl"
              >
                <DropdownMenuItem asChild className="rounded-xl">
                  <Link to="/chat-history">
                    <History className="size-4" />
                    Chat History
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl" onSelect={reset}>
                  <Trash2 className="size-4" />
                  Clear Chat
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-xl">
                  <Download className="size-4" />
                  Export Chat
                  <span className="ml-auto rounded-full bg-accent px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-accent-foreground">
                    Premium
                  </span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="rounded-xl">
                  <Settings className="size-4" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Transcript */}
        <Conversation className="relative flex-1">
          <ConversationContent className="space-y-4 px-4 pb-40 pt-6">
            {messages.map((m, i) => (
              <div
                key={m.id}
                className="animate-fade-in"
                style={{ animationDelay: `${Math.min(i, 4) * 60}ms` }}
              >
                <Message
                  from={m.role}
                  className={cn(
                    "max-w-[85%]",
                    m.role === "assistant" && "items-start",
                  )}
                >
                  <MessageContent
                    className={cn(
                      "text-[15px] leading-relaxed",
                      m.role === "user"
                        ? "group-[.is-user]:rounded-[22px] group-[.is-user]:rounded-br-md group-[.is-user]:bg-gradient-primary group-[.is-user]:px-4 group-[.is-user]:py-2.5 group-[.is-user]:text-white group-[.is-user]:shadow-soft"
                        : "rounded-[22px] rounded-bl-md border border-white/70 bg-white/90 px-4 py-2.5 text-foreground shadow-soft backdrop-blur",
                    )}
                  >
                    {m.content}
                  </MessageContent>
                </Message>

                {/* Suggestion chips under the very first assistant message */}
                {i === 0 && m.role === "assistant" && (
                  <div className="mt-3 flex flex-wrap gap-2 pl-1">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="rounded-full border border-white/80 bg-white/80 px-3.5 py-1.5 text-[13px] font-medium text-foreground shadow-soft backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white hover:shadow-elegant active:scale-95"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <Message from="assistant">
                <MessageContent className="rounded-[22px] rounded-bl-md border border-white/70 bg-white/90 px-4 py-3 shadow-soft backdrop-blur">
                  <TypingDots />
                </MessageContent>
              </Message>
            )}

            {(loadingHistory || (authLoading && conversationId)) && (
              <p className="pt-2 text-center text-[12px] text-muted-foreground">
                Loading conversation…
              </p>
            )}

            {error && (
              <p className="rounded-2xl bg-destructive/10 px-4 py-3 text-center text-[12px] text-destructive">
                {error}
              </p>
            )}
          </ConversationContent>
        </Conversation>

        {/* Floating New Conversation */}
        <button
          type="button"
          onClick={reset}
          className="pointer-events-auto fixed bottom-32 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/90 px-4 py-2.5 text-[13px] font-semibold text-primary shadow-elegant ring-1 ring-white backdrop-blur-xl transition-all duration-300 hover:-translate-x-1/2 hover:-translate-y-0.5 hover:shadow-glow active:scale-95"
        >
          <Plus className="size-4" />
          New Conversation
        </button>

        {/* Composer */}
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-white/60 bg-white/80 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
          <div className="mx-auto max-w-[480px]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-end gap-2 rounded-[26px] border border-white/80 bg-white/90 p-1.5 pl-3 shadow-elegant"
            >
              <button
                type="button"
                aria-label="Add attachment"
                className="flex size-10 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-lavender-soft hover:text-foreground active:scale-95"
              >
                <Paperclip className="size-5" />
              </button>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Message Love AI…"
                rows={1}
                className="max-h-32 min-h-[24px] flex-1 resize-none bg-transparent py-2.5 text-[15px] leading-snug text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              {input.trim() ? (
                <button
                  type="submit"
                  aria-label="Send"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-white shadow-soft transition active:scale-95"
                >
                  <Send className="size-4" />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Voice message"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-white shadow-soft transition active:scale-95"
                >
                  <Mic className="size-5" />
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return <TypingDotsInner />;
}

function readableError(e: unknown): string {
  const err = e as { code?: string; message?: string };
  if (err?.code === "permission-denied")
    return "You don't have access to this conversation.";
  return err?.code ?? err?.message ?? "Something went wrong. Please try again.";
}

function TypingDotsInner() {
  return (
    <div className="flex items-center gap-1.5 py-0.5" aria-label="Love AI is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="inline-block size-2 rounded-full bg-gradient-primary"
          style={{
            animation: "loveai-bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes loveai-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.55; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}