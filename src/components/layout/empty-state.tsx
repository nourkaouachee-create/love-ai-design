import { type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="mx-6 mt-4 rounded-3xl border border-white/70 bg-gradient-card p-8 shadow-soft backdrop-blur">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
        <Icon className="size-7 text-white" strokeWidth={2} />
      </div>
      <h2 className="mt-5 text-center text-lg font-semibold text-foreground">{title}</h2>
      <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}