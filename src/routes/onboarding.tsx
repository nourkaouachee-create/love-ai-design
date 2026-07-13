import { useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, Heart, LineChart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
});

const slides = [
  {
    icon: Heart,
    title: "AI Relationship Coach",
    description: "Receive personalized relationship guidance anytime.",
    accent: "from-lavender to-blush",
  },
  {
    icon: LineChart,
    title: "Analyze Conversations",
    description:
      "Understand emotions, communication style, and relationship patterns.",
    accent: "from-blush to-lavender",
  },
  {
    icon: Sparkles,
    title: "Grow Healthier Relationships",
    description:
      "Build trust, improve communication, and become your best self.",
    accent: "from-lavender-soft to-blush-soft",
  },
] as const;

function OnboardingPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const slide = slides[index];
  const Icon = slide.icon;

  const next = () => {
    if (isLast) navigate({ to: "/auth" });
    else setIndex((i) => i + 1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 right-0 h-64 w-64 rounded-full bg-lavender/30 blur-3xl" />
        <div className="absolute bottom-0 -left-16 h-72 w-72 rounded-full bg-blush/30 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[480px] flex-col px-6 pt-6">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
            <span className="mx-1 opacity-40">/</span>
            {String(slides.length).padStart(2, "0")}
          </div>
          <Link
            to="/auth"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip
          </Link>
        </div>

        <div
          key={index}
          className="mt-10 flex flex-1 flex-col items-center justify-center text-center animate-fade-in"
        >
          <div
            className={cn(
              "relative flex h-64 w-64 items-center justify-center rounded-[2.5rem] bg-gradient-to-br shadow-elegant",
              slide.accent,
            )}
          >
            <div className="absolute inset-3 rounded-[2rem] bg-white/60 backdrop-blur-xl" />
            <div className="relative rounded-3xl bg-white p-6 shadow-soft">
              <Icon className="size-14 text-lavender-deep" strokeWidth={1.6} />
            </div>
          </div>

          <h1 className="mt-10 font-display text-4xl leading-tight tracking-tight text-foreground">
            {slide.title}
          </h1>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            {slide.description}
          </p>
        </div>

        <div className="mb-2 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index
                  ? "w-8 bg-gradient-primary"
                  : "w-1.5 bg-lavender/60 hover:bg-lavender",
              )}
            />
          ))}
        </div>

        <div className="pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
          <Button
            onClick={next}
            className="h-14 w-full rounded-2xl bg-gradient-primary text-base font-semibold text-white shadow-elegant hover:opacity-95"
          >
            {isLast ? "Get Started" : "Continue"}
            <ArrowRight className="ml-1 size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}