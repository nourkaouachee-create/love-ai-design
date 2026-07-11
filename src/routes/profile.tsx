import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/layout/empty-state";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Love AI" },
      { name: "description", content: "Your Love AI profile and preferences." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <MobileShell>
      <PageHeader
        eyebrow="You"
        title="Profile"
        subtitle="Preferences, language, and account settings."
      />
      <EmptyState
        icon={User}
        title="Your profile, in bloom"
        description="Settings, language selection, and personalization will live here."
      />
    </MobileShell>
  );
}