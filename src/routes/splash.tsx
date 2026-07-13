import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import pixelHeart from "@/assets/pixel-heart.png";

export const Route = createFileRoute("/splash")({
  component: SplashPage,
});

function SplashPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => {
      navigate({ to: "/onboarding" });
    }, 2200);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -left-16 h-72 w-72 rounded-full bg-lavender/40 blur-3xl" />
        <div className="absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-blush/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col items-center justify-center px-6 text-center">
        <div className="animate-scale-in">
          <div className="rounded-[2rem] bg-white/70 p-6 shadow-elegant backdrop-blur-xl">
            <img
              src={pixelHeart}
              alt="Love AI"
              className="h-24 w-24 animate-[pulse_2.4s_ease-in-out_infinite]"
            />
          </div>
        </div>

        <div className="mt-8 animate-fade-in [animation-delay:200ms]">
          <h1 className="font-display text-5xl leading-none tracking-tight text-foreground">
            Love AI
          </h1>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            Your Personal AI Relationship Coach
          </p>
        </div>

        <div className="absolute bottom-14 flex gap-1.5 animate-fade-in [animation-delay:600ms]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lavender-deep/60" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose/60 [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lavender-deep/60 [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}