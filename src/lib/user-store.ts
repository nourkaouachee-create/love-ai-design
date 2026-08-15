import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { COLLECTIONS, type UserDoc } from "@/lib/firestore-schema";

export type UserProfile = Omit<UserDoc, "createdAt" | "lastLoginAt"> & {
  createdAt: Date | null;
  lastLoginAt: Date | null;
};

const toDate = (v: unknown): Date | null =>
  v && typeof (v as { toDate?: () => Date }).toDate === "function"
    ? (v as { toDate: () => Date }).toDate()
    : null;

/** Read users/{uid}. Returns null when the doc does not exist yet. */
export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(getDb(), COLLECTIONS.users, uid));
  if (!snap.exists()) return null;
  const d = snap.data() as Record<string, unknown>;
  return {
    uid,
    displayName: (d.displayName as string | null) ?? null,
    email: (d.email as string | null) ?? null,
    photoURL: (d.photoURL as string | null) ?? null,
    language: (d.language as UserDoc["language"]) ?? "en",
    subscription: (d.subscription as UserDoc["subscription"]) ?? "free",
    memoryEnabled: (d.memoryEnabled as boolean) ?? true,
    dailyMessages: (d.dailyMessages as number) ?? 0,
    createdAt: toDate(d.createdAt),
    lastLoginAt: toDate(d.lastLoginAt),
  };
}

/** Patch only the given fields — never overwrites unrelated data. */
export async function updateUserProfile(
  uid: string,
  patch: Partial<Pick<UserDoc, "displayName" | "photoURL" | "language" | "memoryEnabled">>,
) {
  await updateDoc(doc(getDb(), COLLECTIONS.users, uid), patch);
}

/** Delete users/{uid} document then the auth account. */
export async function deleteUserAccount(uid: string) {
  const [{ deleteDoc }, { getFirebaseAuth }, { deleteUser }] = await Promise.all([
    import("firebase/firestore"),
    import("@/lib/firebase"),
    import("firebase/auth"),
  ]);
  await deleteDoc(doc(getDb(), COLLECTIONS.users, uid)).catch(() => undefined);
  const current = getFirebaseAuth().currentUser;
  if (current) await deleteUser(current);
}
