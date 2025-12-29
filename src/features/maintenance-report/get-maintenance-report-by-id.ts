// lib/firebase/purchases.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase-client"; 
import { Invoice } from "@/schemas/invoice.schema";

export async function getMaintenanceReportById(id: string): Promise<Invoice> {
  const ref = doc(db, "maintenance-reports", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    throw new Error("Maintenance report not found");
  }

  return { id: snap.id, ...snap.data() } as Invoice;
}
