import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { Button } from "@/components/ui/button";
import pixelHeart from "@/assets/pixel-heart.png";
import article1 from "@/assets/article-1.jpg";
import article2 from "@/assets/article-2.jpg";
import article3 from "@/assets/article-3.jpg";

export const Route = createFileRoute("/")({
  component: HomePage,
});

const features = [
  { emoji: "❤️", title: "Compatibility Test", tag: "Premium" },
  { emoji: "💬", title: "Conversation Analyzer" },
  { emoji: "🚩", title: "Red & Green Flags" },
  { emoji: "📚", title: "Articles & Tips" },
  { emoji: "🎯", title: "Daily Challenge" },
  { emoji: "📓", title: "Relationship Journal" },
] as const;

const articles = [
  {
    img: article1,
    tag: "Connection",
    title: "5 gentle ways to reconnect after a busy week",
    read: "4 min read",
  },
  {
    img: article2,
    tag: "Rituals",
    title: "The morning coffee ritual that changes everything",
    read: "3 min read",
  },
  {
    img: article3,
    tag: "Love language",
    title: "Words of affirmation, written softly",
    read: "5 min read",
  },
] as const;

function HomePage() {
  return (
    <MobileShell>
      {/* Top brand section */}
      <section className="px-6 pt-[max(1.75rem,env(safe-area-inset-top))] pb-2 text-center animate-fade-in">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-white/70 shadow-soft backdrop-blur-xl ring-1 ring-white/80">
          <img
            src={pixelHeart}
            alt="Love AI pixel heart logo"
            width={512}
            height={512}
            className="size-14 object-contain drop-shadow-[0_6px_16px_rgba(236,153,193,0.45)]"
          />
        </div>
        <h1 className="font-display mt-5 text-[2.75rem] leading-none text-foreground">
          Love <span className="bg-gradient-primary bg-clip-text text-transparent italic">AI</span>
        </h1>
        <p className="mx-auto mt-3 max-w-[18rem] text-[15px] leading-relaxed text-muted-foreground">
          Your Personal AI Relationship Coach
        </p>
      </section>

      {/* Hero card */}
      <section className="px-5 pt-6 animate-fade-in">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-primary p-6 shadow-elegant">
          <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/30 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 size-44 rounded-full bg-white/20 blur-3xl" />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur">
              <Sparkles className="size-3" />
              New
            </span>
            <h2 className="font-display mt-4 text-3xl leading-tight text-white">
              AI Relationship Coach
            </h2>
            <p className="mt-2 max-w-[18rem] text-sm leading-relaxed text-white/90">
              Talk with an AI relationship coach anytime and receive personalized guidance.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 rounded-full bg-white px-6 text-primary shadow-soft hover:bg-white"
            >
              <Link to="/chat">
                Start Chat
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <section className="px-5 pt-8">
        <div className="mb-3 flex items-baseline justify-between px-1">
          <h3 className="text-base font-semibold tracking-tight text-foreground">Explore</h3>
          <span className="text-xs text-muted-foreground">6 tools</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {features.map((f) => (
            <button
              key={f.title}
              type="button"
              className="group relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-card p-4 text-left shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant active:scale-[0.98]"
            >
              <div className="flex size-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-soft ring-1 ring-lavender-soft">
                <span aria-hidden>{f.emoji}</span>
              </div>
              <p className="mt-4 text-sm font-semibold leading-snug text-foreground">
                {f.title}
              </p>
              {f.tag && (
                <span className="mt-2 inline-flex rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                  {f.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Recommended articles */}
      <section className="px-5 pt-8">
        <div className="mb-3 flex items-baseline justify-between px-1">
          <h3 className="text-base font-semibold tracking-tight text-foreground">
            Recommended Articles
          </h3>
          <button className="text-xs font-medium text-primary" type="button">
            See all
          </button>
        </div>
        <ul className="space-y-3">
          {articles.map((a) => (
            <li key={a.title}>
              <article className="flex gap-3 rounded-3xl border border-white/70 bg-white/80 p-3 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-elegant">
                <img
                  src={a.img}
                  alt=""
                  loading="lazy"
                  width={800}
                  height={600}
                  className="size-20 shrink-0 rounded-2xl object-cover"
                />
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                    {a.tag}
                  </span>
                  <p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                    {a.title}
                  </p>
                  <span className="mt-1 text-[11px] text-muted-foreground">{a.read}</span>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </section>
    </MobileShell>
  );
}
