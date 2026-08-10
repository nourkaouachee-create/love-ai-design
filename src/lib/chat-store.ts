import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type Timestamp,
} from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { COLLECTIONS, type MessageRole } from "@/lib/firestore-schema";

export type ConversationListItem = {
  id: string;
  userId: string;
  title: string;
  lastMessage: string;
  createdAt: Date | null;
  updatedAt: Date | null;
};

export type StoredMessage = {
  id: string;
  conversationId: string;
  userId: string;
  role: MessageRole;
  content: string;
  createdAt: Date | null;
};

const toDate = (v: unknown): Date | null =>
  v && typeof (v as Timestamp).toDate === "function" ? (v as Timestamp).toDate() : null;

/** Simple title from the first user message. */
export function titleFromMessage(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (!clean) return "New conversation";
  return clean.length > 60 ? `${clean.slice(0, 57)}…` : clean;
}

export async function createConversation(userId: string, title: string) {
  const ref = await addDoc(collection(getDb(), COLLECTIONS.conversations), {
    userId,
    title,
    aiPersonality: "coach",
    pinned: false,
    archived: false,
    lastMessage: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listConversations(userId: string): Promise<ConversationListItem[]> {
  const snap = await getDocs(
    query(
      collection(getDb(), COLLECTIONS.conversations),
      where("userId", "==", userId),
      limit(100),
    ),
  );
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        userId: data.userId,
        title: data.title ?? "Conversation",
        lastMessage: data.lastMessage ?? "",
        createdAt: toDate(data.createdAt),
        updatedAt: toDate(data.updatedAt) ?? toDate(data.createdAt),
      };
    })
    .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
}

export async function getConversation(id: string) {
  const snap = await getDoc(doc(getDb(), COLLECTIONS.conversations, id));
  return snap.exists() ? { id: snap.id, ...(snap.data() as Record<string, unknown>) } : null;
}

export async function addMessage(params: {
  conversationId: string;
  userId: string;
  role: MessageRole;
  content: string;
}): Promise<string> {
  const ref = await addDoc(collection(getDb(), COLLECTIONS.messages), {
    conversationId: params.conversationId,
    userId: params.userId,
    role: params.role,
    content: params.content,
    model: null,
    createdAt: serverTimestamp(),
    timestamp: serverTimestamp(),
  });
  await updateDoc(doc(getDb(), COLLECTIONS.conversations, params.conversationId), {
    lastMessage: params.content.slice(0, 160),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function listMessages(conversationId: string): Promise<StoredMessage[]> {
  const snap = await getDocs(
    query(
      collection(getDb(), COLLECTIONS.messages),
      where("conversationId", "==", conversationId),
      limit(500),
    ),
  );
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        conversationId: data.conversationId,
        userId: data.userId,
        role: (data.role ?? "assistant") as MessageRole,
        content: data.content ?? "",
        createdAt: toDate(data.createdAt) ?? toDate(data.timestamp),
      };
    })
    .sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0));
}

/** Deletes the conversation and all of its messages. */
export async function deleteConversation(conversationId: string) {
  const snap = await getDocs(
    query(
      collection(getDb(), COLLECTIONS.messages),
      where("conversationId", "==", conversationId),
    ),
  );
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
  await deleteDoc(doc(getDb(), COLLECTIONS.conversations, conversationId));
}

export function relativeTime(date: Date | null): string {
  if (!date) return "";
  const diff = Date.now() - date.getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min}m ago`;
  const hours = Math.round(min / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString();
}
