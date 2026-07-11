import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LineChart, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/analyze")({
  head: () => ({
    meta: [
      { title: "Analyze — Love AI" },
      { name: "description", content: "Analyze conversations and relationship signals." },
    ],
  }),
  component: AnalyzePage,
});

const MAX_CHARS = 5000;

const placeholderResults = [
  {
    emoji: "❤️",
    title: "Emotional Tone",
    value: "Calm, Caring, Frustrated",
    tone: "mixed",
  },
  {
    emoji: "🚩",
    title: "Red Flags",
    value: ["Defensiveness", "Poor Communication"],
    variant: "red" as const,
  },
  {
    emoji: "🟢",
    title: "Green Flags",
    value: ["Respect", "Honesty", "Willingness to solve problems"],
    variant: "green" as const,
  },
  {
    emoji: "💬",
    title: "Communication Score",
    value: "82 / 100",
    score: 82,
  },
  {
    emoji: "😊",
    title: "Emotion Detection",
    value: "Joy 45% · Concern 30% · Hope 25%",
  },
];

function AnalyzePage() {
  const [text, setText] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const chars = text.length;
  const nearLimit = chars > MAX_CHARS * 0.9;
  const overLimit = chars > MAX_CHARS;

  const analyze = () => {
    if (!text.trim() || overLimit) return;
    setIsAnalyzing(true);
    window.setTimeout(() => {
      setIsAnalyzing(false);
      setAnalyzed(true);
    }, 1200);
  };

  return (
    <MobileShell>
      <PageHeader
        eyebrow="Insights"
        title="Conversation Analyzer"
        subtitle="Paste your conversation and let Love AI analyze it."
      />

      {/* Input section */}
      <section className="px-5 pt-2 animate-fade-in">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-4 shadow-soft backdrop-blur">
          <label htmlFor="conversation" className="sr-only">
            Paste your conversation
          </label>
          <textarea
            id="conversation"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (analyzed) setAnalyzed(false);
            }}
            placeholder="Paste your conversation here..."
            rows={8}
            className="w-full resize-none rounded-2xl border border-white/60 bg-lavender-soft/40 p-4 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground/70 focus:border-primary/30 focus:bg-white/60 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          <div className="mt-3 flex items-center justify-between">
            <span
              className={cn(
                "text-xs font-medium tabular-nums transition-colors",
                overLimit
                  ? "text-destructive"
                  : nearLimit
                    ? "text-rose"
                    : "text-muted-foreground",
              )}
            >
              {chars} / {MAX_CHARS}
            </span>
            {overLimit && (
              <span className="text-xs font-medium text-destructive">
                Limit exceeded
              </span>
            )}
          </div>
          <Button
            onClick={analyze}
            disabled={!text.trim() || overLimit || isAnalyzing}
            size="lg"
            className="mt-4 w-full rounded-2xl bg-gradient-primary text-white shadow-elegant hover:shadow-glow disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Analyze Conversation
              </>
            )}
          </Button>
        </div>
      </section>

      {/* Results section */}
      <section className="px-5 pt-8 animate-fade-in">
        <div className="mb-3 flex items-center gap-2 px-1">
          <LineChart className="size-4 text-primary" />
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Analysis Results
          </h3>
        </div>

        {!analyzed ? (
          <div className="rounded-[2rem] border border-white/70 bg-gradient-card p-8 shadow-soft backdrop-blur">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
              <LineChart className="size-7 text-white" strokeWidth={2} />
            </div>
            <h2 className="mt-5 text-center text-lg font-semibold text-foreground">
              Ready to analyze
            </h2>
            <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
              Paste a conversation above and tap Analyze to see emotional tone, flags, and communication score.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {placeholderResults.map((result, i) => (
              <div
                key={result.title}
                className="rounded-3xl border border-white/70 bg-gradient-card p-4 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant animate-fade-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-xl shadow-soft ring-1 ring-lavender-soft">
                    <span aria-hidden>{result.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {result.title}
                    </p>
                    {"score" in result && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-display font-semibold text-foreground">
                            {result.value}
                          </span>
                          <span className="text-xs font-medium text-muted-foreground">
                            Good
                          </span>
                        </div>
                        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-lavender-soft/60">
                          <div
                            className="h-full rounded-full bg-gradient-primary transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min(result.score ?? 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    {"variant" in result && Array.isArray(result.value) ? (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {result.value.map((item) => (
                          <li
                            key={item}
                            className={cn(
                              "rounded-full px-2.5 py-1 text-xs font-medium",
                              result.variant === "red"
                                ? "bg-rose/15 text-rose"
                                : "bg-emerald-500/15 text-emerald-600",
                            )}
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      !("score" in result) && (
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {Array.isArray(result.value)
                            ? result.value.join(" · ")
                            : result.value}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </MobileShell>
  );
}
