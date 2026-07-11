import { createFileRoute } from "@tanstack/react-router";
import { LineChart } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze — Love AI" },
      { name: "description", content: "Analyze conversations and relationship signals." },
    ],
  }),
  component: AnalyzePage,
});

function AnalyzePage() {
  return (
    <MobileShell>
      <PageHeader eyebrow="Insights" title="Analyze" subtitle="Conversation and relationship insights." />
      <EmptyState
        icon={LineChart}
        title="Nothing to analyze yet"
        description="Once you start using Love AI, insights will appear here."
      />
    </MobileShell>
  );
}