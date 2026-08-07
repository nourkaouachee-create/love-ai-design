import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDb, getFirebaseAuth } from "@/lib/firebase";
import { COLLECTIONS, defaultUserDoc } from "@/lib/firestore-schema";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

async function ensureUserDoc(user: User) {
  const ref = doc(getDb(), COLLECTIONS.users, user.uid);
  const snap = await getDoc(ref);
  if (snap.exists()) return;
  await setDoc(ref, {
    ...defaultUserDoc({
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    }),
    createdAt: serverTimestamp(),
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(getFirebaseAuth(), (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsub;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      signInWithGoogle: async () => {
        const cred = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
        await ensureUserDoc(cred.user);
      },
      signInWithEmail: async (email, password) => {
        const cred = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
        await ensureUserDoc(cred.user);
      },
      signUpWithEmail: async (email, password) => {
        const cred = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
        await ensureUserDoc(cred.user);
      },
      signInAsGuest: async () => {
        const cred = await signInAnonymously(getFirebaseAuth());
        await ensureUserDoc(cred.user);
      },
      signOut: async () => {
        await fbSignOut(getFirebaseAuth());
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}