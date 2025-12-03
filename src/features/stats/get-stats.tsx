import { db } from '@/lib/firebase-client';
import { collection, getDocs, Timestamp } from 'firebase/firestore';

const now = new Date();
const currentYear = now.getFullYear();
const month = now.getMonth(); // 0-index

let quarterStart: Date;
let quarterEnd: Date;

if (month < 3) {
  quarterStart = new Date(currentYear, 0, 1);
  quarterEnd = new Date(currentYear, 3, 1);
} else if (month < 6) {
  quarterStart = new Date(currentYear, 3, 1);
  quarterEnd = new Date(currentYear, 6, 1);
} else if (month < 9) {
  quarterStart = new Date(currentYear, 6, 1);
  quarterEnd = new Date(currentYear, 9, 1);
} else {
  quarterStart = new Date(currentYear, 9, 1);
  quarterEnd = new Date(currentYear + 1, 0, 1);
}

function toDateFromCreatedAt(value: unknown): Date | null {
  if (!value) return null;
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  const s = String(value);
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function isWithinCurrentQuarter(createdAt: unknown) {
  const d = toDateFromCreatedAt(createdAt);
  if (!d) return false;
  return d >= quarterStart && d < quarterEnd;
}

export async function getInvoiceStats() {
  try {
    const snap = await getDocs(collection(db, 'invoices'));
    let count = 0;
    snap.forEach((doc) => {
      const createdAt = doc.data()?.createdAt;
      if (isWithinCurrentQuarter(createdAt)) count++;
    });
    return { invoiceCount: count };
  } catch (err) {
    throw new Error(`getInvoiceStats failed: ${(err as Error).message ?? String(err)}`);
  }
}

export async function getQuotationStats() {
  try {
    const snap = await getDocs(collection(db, 'quotations'));
    let count = 0;
    snap.forEach((doc) => {
      const createdAt = doc.data()?.createdAt;
      if (isWithinCurrentQuarter(createdAt)) count++;
    });
    return { quotationCount: count };
  } catch (err) {
    throw new Error(`getQuotationStats failed: ${(err as Error).message ?? String(err)}`);
  }
}

export async function getPurchaseStats() {
  try {
    const snap = await getDocs(collection(db, 'purchases'));
    let count = 0;
    let totalTax = 0;
    snap.forEach((doc) => {
      const data = doc.data();
      const createdAt = data?.createdAt;
      if (isWithinCurrentQuarter(createdAt)) {
        count++;
        const taxRaw = data?.taxTotal ?? 0;
        const tax = typeof taxRaw === 'number' ? taxRaw : parseFloat(String(taxRaw)) || 0;
        totalTax += tax;
      }
    });
    // round to 2 decimals
    totalTax = Math.round(totalTax * 100) / 100;
    return { purchaseCount: count, totalTaxPaid: totalTax };
  } catch (err) {
    throw new Error(`getPurchaseStats failed: ${(err as Error).message ?? String(err)}`);
  }
}

export async function getStats() {
  const [i, q, p] = await Promise.all([
    getInvoiceStats(),
    getQuotationStats(),
    getPurchaseStats(),
  ]);
  return {
    ...i,
    ...q,
    ...p,
  };
}