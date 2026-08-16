import { collection, deleteDoc, doc, getDocs, limit, query, type Timestamp } from "firebase/firestore";
import { getDb } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firestore-schema";

export type MemoryItem = {
  id: string;
  content: string;
  category: string;
  updatedAt: Date | null;
};

const toDate = (v: unknown): Date | null =>
  v && typeof (v as Timestamp).toDate === "function" ? (v as Timestamp).toDate() : null;

const memoriesRef = (uid: string) =>
  collection(getDb(), COLLECTIONS.users, uid, COLLECTIONS.memories);

export async function listUserMemories(uid: string): Promise<MemoryItem[]> {
  const snap = await getDocs(query(memoriesRef(uid), limit(50)));
  return snap.docs
    .map((d) => {
      const data = d.data();
      return {
        id: d.id,
        content: (data.content as string) ?? "",
        category: (data.category as string) ?? "general",
        updatedAt: toDate(data.updatedAt) ?? toDate(data.createdAt),
      };
    })
    .sort((a, b) => (b.updatedAt?.getTime() ?? 0) - (a.updatedAt?.getTime() ?? 0));
}

export async function deleteUserMemory(uid: string, memoryId: string) {
  await deleteDoc(doc(getDb(), COLLECTIONS.users, uid, COLLECTIONS.memories, memoryId));
}

export async function clearUserMemories(uid: string) {
  const snap = await getDocs(memoriesRef(uid));
  await Promise.all(snap.docs.map((d) => deleteDoc(d.ref)));
}