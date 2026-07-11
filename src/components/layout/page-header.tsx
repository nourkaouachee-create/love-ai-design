import { type ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="px-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          {eyebrow && (
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary/80">
              {eyebrow}
            </p>
          )}
          <h1 className="font-display mt-1 text-4xl leading-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}