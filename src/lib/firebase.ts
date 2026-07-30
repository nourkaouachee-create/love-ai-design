import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Firebase web config values are publishable (safe in client code).
// The API key is read from VITE_FIREBASE_API_KEY so it can be swapped per environment.
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
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

export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}