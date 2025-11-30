// lib/firebase/purchases.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client"; 
import { Purchase } from "@/schemas/purchase.schema";

export async function getPurchaseById(id: string): Promise<Purchase> {
  const ref = doc(db, "purchases", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Purchase not found");
  }

  return { id: snap.id, ...snap.data() } as Purchase;
}
