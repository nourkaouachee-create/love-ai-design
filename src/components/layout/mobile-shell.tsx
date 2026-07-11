import { type ReactNode } from "react";
import { BottomNav } from "./bottom-nav";

interface MobileShellProps {
  children: ReactNode;
  hideNav?: boolean;
}

export function MobileShell({ children, hideNav }: MobileShellProps) {
  return (
    <div className="relative min-h-screen bg-gradient-hero">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col">
        <main className="flex-1 pb-28">{children}</main>
        {!hideNav && <BottomNav />}
      </div>
    </div>
  );
}