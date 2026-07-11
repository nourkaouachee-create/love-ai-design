import { createFileRoute } from "@tanstack/react-router";
import { Bell, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <MobileShell>
      <PageHeader
        eyebrow="Welcome back"
        title="Love AI"
        subtitle="Your calm, intelligent companion — designed with care."
        action={
          <Button variant="outline" size="icon" aria-label="Notifications">
            <Bell />
          </Button>
        }
      />
      <EmptyState
        icon={Sparkles}
        title="Your journey starts here"
        description="This is the foundation of Love AI. Screens will come alive as we build features together."
      />
    </MobileShell>
  );
}
