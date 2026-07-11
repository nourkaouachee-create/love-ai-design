import { createFileRoute } from "@tanstack/react-router";
import { MessageCircleHeart } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chat — Love AI" },
      { name: "description", content: "Have gentle, meaningful conversations with Love AI." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  return (
    <MobileShell>
      <PageHeader
        eyebrow="Conversation"
        title="Chat"
        subtitle="A quiet space for meaningful conversation."
      />
      <EmptyState
        icon={MessageCircleHeart}
        title="Say hello, softly"
        description="Your conversations with Love AI will appear here once we connect the assistant."
      />
    </MobileShell>
  );
}