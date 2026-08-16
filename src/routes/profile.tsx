import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Check,
  Crown,
  Globe,
  Loader2,
  LogOut,
  MessageCircleHeart,
  Pencil,
  Shield,
  Sparkles,
  Trash2,
} from "lucide-react";
import { MobileShell } from "@/components/layout/mobile-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/hooks/use-auth";
import {
  clearUserMemories,
  deleteUserMemory,
  listUserMemories,
  type MemoryItem,
} from "@/lib/memory-store";
import {
  deleteUserAccount,
  fetchUserProfile,
  updateUserProfile,
  type UserProfile,
} from "@/lib/user-store";
import type { AppLanguage } from "@/lib/firestore-schema";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — Love AI" },
      {
        name: "description",
        content:
          "Manage your Love AI profile: display name, language, memory, subscription and account settings.",
      },
      { property: "og:title", content: "Profile & Settings — Love AI" },
      {
        property: "og:description",
        content: "Personalize Love AI — your name, language, memory and plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

const LANGUAGES: { code: AppLanguage; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "fr", label: "French", native: "Français" },
  { code: "ar", label: "Arabic", native: "العربية" },
];

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-6 pb-6">
      <h2 className="mb-3 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {title}
      </h2>
      <div className="overflow-hidden rounded-3xl border border-white/70 bg-gradient-card shadow-soft backdrop-blur-xl">
        {children}
      </div>
    </section>
  );
}

function ProfilePage() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [memoriesLoading, setMemoriesLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setMemoriesLoading(true);
    listUserMemories(user.uid)
      .then((m) => !cancelled && setMemories(m))
      .catch(() => undefined)
      .finally(() => !cancelled && setMemoriesLoading(false));
    return () => {
      cancelled = true;
    };
  }, [user]);

  const removeMemory = async (id: string) => {
    if (!user) return;
    const previous = memories;
    setMemories((m) => m.filter((x) => x.id !== id));
    try {
      await deleteUserMemory(user.uid, id);
    } catch {
      setMemories(previous);
      setError("We couldn't delete that memory. Please try again.");
    }
  };

  const clearMemories = async () => {
    if (!user) return;
    const previous = memories;
    setMemories([]);
    try {
      await clearUserMemories(user.uid);
      setNotice("All memories cleared.");
    } catch {
      setMemories(previous);
      setError("We couldn't clear your memories. Please try again.");
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchUserProfile(user.uid)
      .then((p) => {
        if (cancelled) return;
        setProfile(p);
        setNameDraft(p?.displayName ?? user.displayName ?? "");
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("We couldn't load your profile. Please try again.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  const patch = useCallback(
    async (
      values: Partial<Pick<UserProfile, "displayName" | "language" | "memoryEnabled">>,
      successMessage: string,
    ) => {
      if (!user || !profile) return;
      const previous = profile;
      setProfile({ ...profile, ...values });
      setSaving(true);
      setError(null);
      setNotice(null);
      try {
        await updateUserProfile(user.uid, values);
        setNotice(successMessage);
      } catch {
        setProfile(previous);
        setError("We couldn't save that change. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [user, profile],
  );

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate({ to: "/auth" });
    } catch {
      setError("Sign out failed. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setDeleting(true);
    setError(null);
    try {
      await deleteUserAccount(user.uid);
      navigate({ to: "/auth" });
    } catch {
      setError(
        "We couldn't delete your account. For security, please sign in again and retry.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const displayName =
    profile?.displayName ?? user?.displayName ?? (user?.isAnonymous ? "Guest" : "Friend");
  const email = profile?.email ?? user?.email ?? (user?.isAnonymous ? "Guest session" : "—");
  const photoURL = profile?.photoURL ?? user?.photoURL ?? null;
  const initial = (displayName || "L").trim().charAt(0).toUpperCase();
  const isPremium = profile?.subscription === "premium";

  if (!authLoading && !user) {
    return (
      <MobileShell>
        <PageHeader eyebrow="You" title="Profile" subtitle="Sign in to manage your Love AI." />
        <div className="px-6">
          <Button className="w-full" onClick={() => navigate({ to: "/auth" })}>
            Sign in
          </Button>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell>
      <PageHeader
        eyebrow="You"
        title="Profile"
        subtitle="Preferences, language, and account settings."
      />

      {/* Header card */}
      <div className="px-6 pb-6">
        <div className="rounded-[2rem] border border-white/70 bg-gradient-card p-5 shadow-elegant backdrop-blur-xl">
          {loading || authLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="size-16 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={`${displayName}'s profile photo`}
                  className="size-16 rounded-full border border-white/80 object-cover shadow-soft"
                />
              ) : (
                <div className="flex size-16 items-center justify-center rounded-full bg-gradient-primary text-2xl font-semibold text-white shadow-glow">
                  {initial}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-display truncate text-2xl leading-tight text-foreground">
                  {displayName}
                </p>
                <p className="truncate text-sm text-muted-foreground">{email}</p>
              </div>
              {!editing && (
                <Button
                  variant="soft"
                  size="sm"
                  className="shrink-0"
                  onClick={() => {
                    setNameDraft(displayName === "Friend" ? "" : displayName);
                    setEditing(true);
                  }}
                >
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
              )}
            </div>
          )}

          {editing && (
            <div className="mt-5 space-y-3 border-t border-white/70 pt-5">
              <label htmlFor="displayName" className="text-xs font-medium text-muted-foreground">
                Display name
              </label>
              <Input
                id="displayName"
                value={nameDraft}
                maxLength={40}
                placeholder="Your name"
                onChange={(e) => setNameDraft(e.target.value)}
                className="rounded-2xl bg-white/80"
              />
              <p className="text-xs text-muted-foreground">
                Photo uploads arrive with cloud storage — for now your Google photo is used
                automatically.
              </p>
              <div className="flex gap-2">
                <Button
                  className="flex-1"
                  disabled={saving || !nameDraft.trim()}
                  onClick={async () => {
                    await patch({ displayName: nameDraft.trim() }, "Profile updated.");
                    setEditing(false);
                  }}
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                  Save
                </Button>
                <Button variant="ghost" className="flex-1" onClick={() => setEditing(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(error || notice) && (
        <div className="px-6 pb-4">
          <p
            className={cn(
              "rounded-2xl px-4 py-3 text-sm",
              error
                ? "bg-destructive/10 text-destructive"
                : "bg-accent/60 text-accent-foreground",
            )}
            role="status"
          >
            {error ?? notice}
          </p>
        </div>
      )}

      {/* Subscription */}
      <Section title="Subscription">
        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isPremium ? "Premium Plan" : "Free Plan"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {isPremium
                  ? "Thank you for supporting Love AI."
                  : "Everyday coaching with gentle limits."}
              </p>
            </div>
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-primary text-white shadow-soft">
              <Crown className="size-5" />
            </span>
          </div>
          {!isPremium && (
            <div className="mt-4 rounded-2xl bg-white/70 p-4">
              <p className="font-display text-lg text-foreground">Unlock Love AI Premium</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Unlimited chats, the full compatibility report, and deeper analysis.
              </p>
              <Button className="mt-3 w-full" disabled>
                <Sparkles className="size-4" />
                Upgrade — coming soon
              </Button>
            </div>
          )}
        </div>
      </Section>

      {/* Usage */}
      <Section title="Usage">
        <div className="flex items-center justify-between p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-accent/60 text-accent-foreground">
              <MessageCircleHeart className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">Messages today</p>
              <p className="text-xs text-muted-foreground">Resets every day</p>
            </div>
          </div>
          {loading ? (
            <Skeleton className="h-7 w-10 rounded-lg" />
          ) : (
            <p className="font-display text-3xl text-foreground">{profile?.dailyMessages ?? 0}</p>
          )}
        </div>
      </Section>

      {/* Settings */}
      <Section title="Settings">
        <div className="divide-y divide-white/70">
          <div className="p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-accent/60 text-accent-foreground">
                <Globe className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Language</p>
                <p className="text-xs text-muted-foreground">
                  Love AI will reply in your preferred language.
                </p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => {
                const active = (profile?.language ?? "en") === lang.code;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    disabled={saving || loading}
                    onClick={() => patch({ language: lang.code }, `Language set to ${lang.label}.`)}
                    className={cn(
                      "rounded-2xl border px-2 py-3 text-xs font-medium transition-all",
                      active
                        ? "border-transparent bg-gradient-primary text-white shadow-soft"
                        : "border-white/70 bg-white/70 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="block">{lang.label}</span>
                    <span className="block text-[10px] opacity-70">{lang.native}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent/60 text-accent-foreground">
                <Sparkles className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Memory</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  Love AI can remember useful details from your conversations to make future chats
                  more personalized.
                </p>
              </div>
            </div>
            <Switch
              aria-label="Memory"
              checked={profile?.memoryEnabled ?? true}
              disabled={saving || loading}
              onCheckedChange={(checked) =>
                patch({ memoryEnabled: checked }, checked ? "Memory on." : "Memory off.")
              }
            />
          </div>

          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-accent/60 text-accent-foreground">
                <Bell className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Notifications</p>
                <p className="text-xs text-muted-foreground">Gentle reminders and check-ins.</p>
              </div>
            </div>
            <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] text-muted-foreground">
              Coming soon
            </span>
          </div>

          <div className="flex items-center justify-between gap-4 p-5">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-2xl bg-accent/60 text-accent-foreground">
                <Shield className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">Privacy</p>
                <p className="text-xs text-muted-foreground">Your conversations stay yours.</p>
              </div>
            </div>
            <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] text-muted-foreground">
              Coming soon
            </span>
          </div>
        </div>
      </Section>

      {/* Account */}
      <Section title="Account">
        <div className="divide-y divide-white/70">
          <button
            type="button"
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 p-5 text-left transition-colors hover:bg-white/50"
          >
            <span className="flex size-10 items-center justify-center rounded-2xl bg-accent/60 text-accent-foreground">
              <LogOut className="size-5" />
            </span>
            <span className="text-sm font-medium text-foreground">Sign out</span>
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="flex w-full items-center gap-3 p-5 text-left transition-colors hover:bg-destructive/5"
              >
                <span className="flex size-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
                  <Trash2 className="size-5" />
                </span>
                <span className="text-sm font-medium text-destructive">Delete account</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-3xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-destructive" />
                  Delete your account?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This is permanent. Your Love AI account and profile will be removed and you'll be
                  signed out. Saved conversations may remain until they are cleared.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="rounded-2xl">Keep my account</AlertDialogCancel>
                <AlertDialogAction
                  className="rounded-2xl bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  disabled={deleting}
                  onClick={handleDelete}
                >
                  {deleting ? <Loader2 className="size-4 animate-spin" /> : null}
                  Delete permanently
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Section>
    </MobileShell>
  );
}
