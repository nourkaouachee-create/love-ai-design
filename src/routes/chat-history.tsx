import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, History, Loader2, MessageCircleHeart, Trash2 } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  deleteConversation,
  listConversations,
  relativeTime,
  type ConversationListItem,
} from "@/lib/chat-store";

export const Route = createFileRoute("/chat-history")({
  head: () => ({
    meta: [
      { title: "Chat History — Love AI" },
      { name: "description", content: "Review your past Love AI conversations." },
    ],
  }),
  component: ChatHistoryPage,
});

function ChatHistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [chats, setChats] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async (uid: string) => {
    setLoading(true);
    setError(null);
    try {
      setChats(await listConversations(uid));
    } catch (e) {
      const err = e as { code?: string; message?: string };
      setError(err.code ?? err.message ?? "Couldn't load your conversations.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setChats([]);
      setLoading(false);
      return;
    }
    void load(user.uid);
  }, [authLoading, user, load]);

  const remove = async (id: string) => {
    setDeletingId(id);
    setError(null);
    try {
      await deleteConversation(id);
      setChats((c) => c.filter((x) => x.id !== id));
    } catch (e) {
      const err = e as { code?: string; message?: string };
      setError(err.code ?? err.message ?? "Couldn't delete this conversation.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <MobileShell>
      <div className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))] animate-fade-in">
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="icon" className="rounded-full bg-white/70 backdrop-blur">
            <Link to="/chat" aria-label="Back to chat">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary shadow-soft backdrop-blur">
            <History className="size-3" /> History
          </span>
          <div className="size-9" />
        </div>

        <header className="mt-4 text-center">
          <h1 className="font-display text-3xl leading-tight text-foreground">Chat History</h1>
          <p className="mx-auto mt-2 max-w-[20rem] text-sm text-muted-foreground">
            Your recent conversations with Love AI.
          </p>
        </header>

        {error && (
          <p className="mt-6 rounded-2xl bg-destructive/10 px-4 py-3 text-center text-[12px] text-destructive">
            {error}
          </p>
        )}

        {loading || authLoading ? (
          <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" /> Loading conversations…
          </div>
        ) : !user ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Sign in to see your conversations.
          </p>
        ) : chats.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            No conversations yet — start chatting with Love AI.
          </p>
        ) : (
          <ul className="mt-6 space-y-3">
            {chats.map((c, i) => (
              <li
                key={c.id}
                className="rounded-3xl border border-white/70 bg-gradient-card p-4 shadow-soft backdrop-blur animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-start gap-3">
                  <Link
                    to="/chat"
                    search={{ c: c.id }}
                    className="flex min-w-0 flex-1 items-start gap-3"
                  >
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-soft">
                      <MessageCircleHeart className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {relativeTime(c.updatedAt)}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-[12px] text-muted-foreground">
                        {c.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </Link>
                  <button
                    type="button"
                    aria-label={`Delete ${c.title}`}
                    disabled={deletingId === c.id}
                    onClick={() => remove(c.id)}
                    className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition hover:bg-white/70 hover:text-destructive active:scale-95"
                  >
                    {deletingId === c.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </MobileShell>
  );
}