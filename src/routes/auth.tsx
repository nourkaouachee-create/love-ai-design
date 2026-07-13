import { createFileRoute, Link } from "@tanstack/react-router";
import { Apple, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import pixelHeart from "@/assets/pixel-heart.png";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.2S8.7 5.8 12 5.8c1.9 0 3.2.8 3.9 1.5l2.7-2.6C16.9 3.2 14.7 2.2 12 2.2 6.5 2.2 2.2 6.5 2.2 12S6.5 21.8 12 21.8c6.9 0 9.4-4.8 9.4-8.5 0-.6-.06-1-.14-1.5H12z"
      />
    </svg>
  );
}

function AuthPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lavender/40 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-blush/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-6 pt-16">
        <div className="flex flex-col items-center text-center animate-fade-in">
          <div className="rounded-3xl bg-white/70 p-4 shadow-soft backdrop-blur-xl">
            <img src={pixelHeart} alt="Love AI" className="h-16 w-16" />
          </div>
          <h1 className="mt-6 font-display text-4xl tracking-tight text-foreground">
            Welcome to Love AI
          </h1>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Sign in to start your journey toward healthier relationships.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-3 animate-fade-in [animation-delay:150ms]">
          <Button
            asChild
            variant="outline"
            className="h-14 rounded-2xl border-border/70 bg-white/80 text-[15px] font-semibold text-foreground shadow-soft backdrop-blur-xl hover:bg-white"
          >
            <Link to="/">
              <GoogleIcon className="mr-1 size-5" />
              Continue with Google
            </Link>
          </Button>

          <Button
            asChild
            className="h-14 rounded-2xl bg-foreground text-[15px] font-semibold text-background shadow-soft hover:bg-foreground/90"
          >
            <Link to="/">
              <Apple className="mr-1 size-5" />
              Continue with Apple
            </Link>
          </Button>

          <Button
            asChild
            className="h-14 rounded-2xl bg-gradient-primary text-[15px] font-semibold text-white shadow-elegant hover:opacity-95"
          >
            <Link to="/">
              <Mail className="mr-1 size-5" />
              Continue with Email
            </Link>
          </Button>

          <div className="my-2 flex items-center gap-3">
            <span className="h-px flex-1 bg-border/70" />
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              or
            </span>
            <span className="h-px flex-1 bg-border/70" />
          </div>

          <Button
            asChild
            variant="ghost"
            className="h-12 rounded-2xl text-[14px] font-medium text-muted-foreground hover:bg-white/60 hover:text-foreground"
          >
            <Link to="/">
              <UserRound className="mr-1 size-4" />
              Continue as Guest
            </Link>
          </Button>
        </div>

        <div className="mt-auto pb-[max(2rem,env(safe-area-inset-bottom))] pt-10">
          <p className="text-center text-[12px] leading-relaxed text-muted-foreground">
            By continuing you agree to our{" "}
            <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
              Terms
            </a>{" "}
            &{" "}
            <a href="#" className="font-medium text-foreground underline-offset-4 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}