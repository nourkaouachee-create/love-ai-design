import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";

export const Route = createFileRoute("/discover")({
  head: () => ({
    meta: [
      { title: "Discover — Love AI" },
      { name: "description", content: "Explore curated moments and ideas inside Love AI." },
    ],
  }),
  component: DiscoverPage,
});

function DiscoverPage() {
  return (
    <MobileShell>
      <PageHeader
        eyebrow="Explore"
        title="Discover"
        subtitle="Curated inspiration will live here."
      />
      <EmptyState
        icon={Compass}
        title="Nothing to discover yet"
        description="Content and personalized suggestions will appear once features are added."
      />
    </MobileShell>
  );
}