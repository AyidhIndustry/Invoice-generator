// lib/firebase/purchases.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client"; 
import { DeliveryNote } from "@/schemas/delivery-note.schema";

export async function getDeliveryNoteById(id: string): Promise<DeliveryNote> {
  const ref = doc(db, "delivery-notes", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Delivery note not found");
  }

  return { id: snap.id, ...snap.data() } as DeliveryNote;
}
