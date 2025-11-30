// lib/firebase/purchases.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client"; 
import { Quotation } from "@/schemas/quotation.schema";

export async function getQuotationById(id: string): Promise<Quotation> {
  const ref = doc(db, "quotations", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Quotation not found");
  }

  return { id: snap.id, ...snap.data() } as Quotation;
}
