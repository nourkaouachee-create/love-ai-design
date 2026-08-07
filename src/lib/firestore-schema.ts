import type { Timestamp } from "firebase/firestore";

/** Firestore is schemaless — these types define the collection structure in code. */

export const COLLECTIONS = {
  users: "users",
  conversations: "conversations",
  messages: "messages",
} as const;

export type SubscriptionTier = "free" | "premium";
export type AppLanguage = "en" | "ar" | "fr" | "es";
export type MessageRole = "user" | "assistant" | "system";

/** users/{uid} */
export interface UserDoc {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  language: AppLanguage;
  subscription: SubscriptionTier;
  memoryEnabled: boolean;
  dailyMessages: number;
  createdAt: Timestamp;
}

/** conversations/{conversationId} */
export interface ConversationDoc {
  userId: string;
  title: string;
  aiPersonality: string;
  pinned: boolean;
  archived: boolean;
  createdAt: Timestamp;
}

/** messages/{messageId} */
export interface MessageDoc {
  conversationId: string;
  role: MessageRole;
  content: string;
  timestamp: Timestamp;
  model: string | null;
}

export const defaultUserDoc = (
  params: Pick<UserDoc, "uid" | "displayName" | "email" | "photoURL">,
): Omit<UserDoc, "createdAt"> => ({
  ...params,
  language: "en",
  subscription: "free",
  memoryEnabled: true,
  dailyMessages: 0,
});