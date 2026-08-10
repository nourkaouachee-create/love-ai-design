import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// Firebase web config values are publishable (safe in client code).
// TODO: migrate to VITE_* env vars later.
// 👇 Paste your Firebase Web API key here (from Firebase Console → Project settings → General → Your apps).
const FIREBASE_API_KEY = "AIzaSyC25_myzSkpjkYaR28RA0CmqfJzHiGI8rQ";

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "love-ai-b5e26.firebaseapp.com",
  projectId: "love-ai-b5e26",
  storageBucket: "love-ai-b5e26.firebasestorage.app",
  messagingSenderId: "1036722506034",
  appId: "1:1036722506034:web:5c53de2fa54ae5df79ef2b",
  measurementId: "G-LM2NWDXXFS",
};

// Lazy singletons: nothing initializes during SSR, only on first browser use.
export function getFirebaseApp(): FirebaseApp {
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

/**
 * Firebase Storage is NOT required by the app (Spark plan has it disabled).
 * Kept ready for later: the SDK is only loaded when this is actually called.
 */
export async function getFirebaseStorage() {
  const { getStorage } = await import("firebase/storage");
  return getStorage(getFirebaseApp());
}
