import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, History, MessageCircleHeart } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/chat-history")({
  head: () => ({
    meta: [
      { title: "Chat History — Love AI" },
      { name: "description", content: "Review your past Love AI conversations." },
    ],
  }),
  component: ChatHistoryPage,
});

const placeholderChats = [
  { title: "Reconnecting after a busy week", preview: "You: I've been feeling distant lately…", time: "Today" },
  { title: "Handling small arguments", preview: "Love AI: Try naming the emotion first…", time: "Yesterday" },
  { title: "Planning a thoughtful date", preview: "You: Any ideas for a calm evening?", time: "2 days ago" },
] as const;

function ChatHistoryPage() {
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

        <ul className="mt-6 space-y-3">
          {placeholderChats.map((c, i) => (
            <li
              key={c.title}
              className="rounded-3xl border border-white/70 bg-gradient-card p-4 shadow-soft backdrop-blur animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-soft">
                  <MessageCircleHeart className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{c.title}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">{c.time}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-[12px] text-muted-foreground">{c.preview}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </MobileShell>
  );
}