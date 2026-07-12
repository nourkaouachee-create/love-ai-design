import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Lock,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  FileText,
  Heart,
  MessageCircle,
  Shield,
  Flame,
  Flag,
  Crown,
} from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/compatibility")({
  head: () => ({
    meta: [
      { title: "Compatibility Test — Love AI" },
      {
        name: "description",
        content:
          "An AI-powered premium assessment that reveals how compatible you and your partner really are.",
      },
    ],
  }),
  component: CompatibilityPage,
});

type Step = "intro" | "quiz" | "result";

const features = [
  { icon: Sparkles, label: "Approximately 50 questions" },
  { icon: FileText, label: "Personalized AI Report" },
  { icon: Heart, label: "Relationship Strength Score" },
  { icon: MessageCircle, label: "Communication Analysis" },
  { icon: Flame, label: "Love Languages" },
  { icon: Shield, label: "Conflict Resolution Style" },
  { icon: Flag, label: "Green & Red Flags" },
  { icon: FileText, label: "PDF Report" },
] as const;

const questions = [
  {
    q: "When disagreements happen, how do you usually react?",
    a: ["I stay calm", "I need some time alone", "I become emotional", "I avoid conflict"],
  },
  {
    q: "How do you prefer to receive affection?",
    a: ["Kind words", "Quality time", "Physical touch", "Small gifts"],
  },
  {
    q: "How often do you check in with your partner emotionally?",
    a: ["Every day", "A few times a week", "Only when needed", "Rarely"],
  },
] as const;

const TOTAL_QUESTIONS = 50;

function CompatibilityPage() {
  const [step, setStep] = useState<Step>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const current = questions[index % questions.length];
  const progress = ((index + 1) / TOTAL_QUESTIONS) * 100;

  const goNext = () => {
    if (index + 1 >= TOTAL_QUESTIONS) {
      setStep("result");
      return;
    }
    setIndex((i) => i + 1);
  };

  const goPrev = () => {
    if (index === 0) return;
    setIndex((i) => i - 1);
  };

  return (
    <MobileShell hideNav={step !== "intro"}>
      {step === "intro" && <IntroScreen onStart={() => setStep("quiz")} />}
      {step === "quiz" && (
        <QuizScreen
          index={index}
          progress={progress}
          question={current.q}
          answers={current.a}
          selected={answers[index]}
          onSelect={(i) => setAnswers((a) => ({ ...a, [index]: i }))}
          onPrev={goPrev}
          onNext={goNext}
          onExit={() => setStep("intro")}
        />
      )}
      {step === "result" && <ResultScreen onRestart={() => { setStep("intro"); setIndex(0); setAnswers({}); }} />}
    </MobileShell>
  );
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))] animate-fade-in">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="icon" className="rounded-full bg-white/70 backdrop-blur">
          <Link to="/" aria-label="Back to home">
            <ArrowLeft className="size-5" />
          </Link>
        </Button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary shadow-soft backdrop-blur">
          <Crown className="size-3" /> Premium
        </span>
      </div>

      <section className="mt-4 text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-gradient-primary shadow-elegant">
          <Lock className="size-9 text-white" strokeWidth={2.2} />
        </div>
        <h1 className="font-display mt-5 text-[2.25rem] leading-tight text-foreground">
          Compatibility Test
        </h1>
        <p className="mx-auto mt-2 max-w-[22rem] text-sm leading-relaxed text-muted-foreground">
          Discover how compatible you are with your partner through an AI-powered relationship assessment.
        </p>
      </section>

      <section className="mt-6">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-card p-6 shadow-elegant backdrop-blur-xl">
          <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-14 size-52 rounded-full bg-rose/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Clock className="size-4" />
              Estimated time · 8–10 minutes
            </div>

            <ul className="mt-5 space-y-2.5">
              {features.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2.5 ring-1 ring-white/80"
                >
                  <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-soft">
                    <Icon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{label}</span>
                  <Check className="ml-auto size-4 text-primary/70" />
                </li>
              ))}
            </ul>

            <Button
              size="lg"
              onClick={onStart}
              className="mt-6 w-full rounded-full bg-gradient-primary py-6 text-base font-semibold text-white shadow-elegant hover:opacity-95"
            >
              <Sparkles className="size-4" />
              Start Premium Test
            </Button>
            <p className="mt-3 text-center text-[11px] text-muted-foreground">
              Cancel anytime · Secure & private
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuizScreen({
  index,
  progress,
  question,
  answers,
  selected,
  onSelect,
  onPrev,
  onNext,
  onExit,
}: {
  index: number;
  progress: number;
  question: string;
  answers: readonly string[];
  selected: number | undefined;
  onSelect: (i: number) => void;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] animate-fade-in">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onExit}
          className="rounded-full bg-white/70 backdrop-blur"
          aria-label="Exit test"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Question {index + 1} of {TOTAL_QUESTIONS}
        </span>
        <div className="size-9" />
      </div>

      <div className="mt-4">
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/80 ring-1 ring-white/70">
          <div
            className="h-full rounded-full bg-gradient-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        key={index}
        className="mt-6 rounded-[2rem] border border-white/70 bg-gradient-card p-6 shadow-elegant backdrop-blur-xl animate-fade-in"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
          Relationship reflex
        </p>
        <h2 className="font-display mt-2 text-2xl leading-snug text-foreground">
          “{question}”
        </h2>

        <ul className="mt-5 space-y-2.5">
          {answers.map((a, i) => {
            const active = selected === i;
            return (
              <li key={a}>
                <button
                  type="button"
                  onClick={() => onSelect(i)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-sm font-medium transition-all",
                    active
                      ? "border-transparent bg-gradient-primary text-white shadow-elegant"
                      : "border-white/80 bg-white/80 text-foreground hover:-translate-y-0.5 hover:shadow-soft",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold",
                      active ? "bg-white/25 text-white" : "bg-lavender-soft text-primary",
                    )}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{a}</span>
                  {active && <Check className="size-4" />}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto flex items-center gap-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-6">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={index === 0}
          className="h-12 flex-1 rounded-full border-white/80 bg-white/70 backdrop-blur"
        >
          <ArrowLeft className="size-4" />
          Previous
        </Button>
        <Button
          onClick={onNext}
          className="h-12 flex-1 rounded-full bg-gradient-primary font-semibold text-white shadow-soft hover:opacity-95"
        >
          Next
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

const resultCards = [
  { emoji: "💪", title: "Strengths", value: "Emotional openness · Shared values" },
  { emoji: "⚠️", title: "Challenges", value: "Handling stress · Boundaries" },
  { emoji: "💬", title: "Communication", value: "Balanced · Actively listening" },
  { emoji: "🔒", title: "Trust", value: "High mutual trust" },
  { emoji: "🔥", title: "Intimacy", value: "Warm & consistent" },
  { emoji: "🕊️", title: "Conflict Style", value: "Cooperative problem-solvers" },
  { emoji: "💗", title: "Love Languages", value: "Quality time · Words of affirmation" },
  { emoji: "🌱", title: "Relationship Advice", value: "Protect your weekly ritual" },
] as const;

function ResultScreen({ onRestart }: { onRestart: () => void }) {
  const score = 87;
  const circumference = 2 * Math.PI * 54;
  const dash = (score / 100) * circumference;

  return (
    <div className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-10 animate-fade-in">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onRestart}
          className="rounded-full bg-white/70 backdrop-blur"
          aria-label="Restart"
        >
          <ArrowLeft className="size-5" />
        </Button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary shadow-soft backdrop-blur">
          <Crown className="size-3" /> Premium
        </span>
      </div>

      <section className="mt-4 text-center">
        <p className="text-2xl">🎉</p>
        <h1 className="font-display mt-1 text-3xl text-foreground">Congratulations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here is your AI-powered compatibility snapshot.
        </p>
      </section>

      <section className="mt-6 flex justify-center">
        <div className="relative flex size-56 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-gradient-primary opacity-20 blur-2xl" />
          <svg viewBox="0 0 120 120" className="size-56 -rotate-90">
            <defs>
              <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="oklch(0.85 0.08 305)" />
                <stop offset="100%" stopColor="oklch(0.82 0.1 355)" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="oklch(0.94 0.02 320)"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#scoreGradient)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${dash} ${circumference}`}
              className="transition-[stroke-dasharray] duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-5xl text-foreground">{score}%</span>
            <span className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Compatibility Score
            </span>
          </div>
        </div>
      </section>

      <section className="mt-8 grid grid-cols-2 gap-3">
        {resultCards.map((c, i) => (
          <div
            key={c.title}
            className="rounded-3xl border border-white/70 bg-gradient-card p-4 shadow-soft backdrop-blur animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-xl shadow-soft ring-1 ring-lavender-soft">
              <span aria-hidden>{c.emoji}</span>
            </div>
            <p className="mt-3 text-sm font-semibold text-foreground">{c.title}</p>
            <p className="mt-1 text-[12px] leading-snug text-muted-foreground">{c.value}</p>
          </div>
        ))}
      </section>

      <section className="mt-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-6 shadow-elegant">
          <div className="pointer-events-none absolute -right-10 -top-10 size-36 rounded-full bg-white/30 blur-2xl" />
          <div className="relative flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-white/25 backdrop-blur">
              <Crown className="size-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-display text-xl leading-tight text-white">
                Unlock the full AI report
              </h3>
              <p className="mt-1 text-sm text-white/90">
                Detailed breakdown, personalized advice, and shareable PDF.
              </p>
            </div>
          </div>
          <Button
            size="lg"
            className="mt-5 w-full rounded-full bg-white py-6 text-base font-semibold text-primary shadow-soft hover:bg-white"
          >
            <Lock className="size-4" />
            Unlock Full AI Report
          </Button>
        </div>
      </section>
    </div>
  );
}