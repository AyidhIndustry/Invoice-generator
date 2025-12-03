// src/lib/format-timestamp.ts

export function formatTimestamp(value: any): string {
  if (!value && value !== 0) return "—";

  let date: Date | null = null;

  // 1) Firestore Timestamp (has toDate())
  if (typeof value?.toDate === "function") {
    try {
      date = value.toDate();
    } catch {
      date = null;
    }
  }

  // 2) Protobuf style { seconds, nanoseconds }
  else if (
    typeof value === "object" &&
    (typeof value.seconds === "number" || typeof value.seconds === "string")
  ) {
    const seconds = Number(value.seconds);
    const nanos = Number(value.nanoseconds || 0);
    const ms = seconds * 1000 + Math.floor(nanos / 1e6);

    if (Number.isFinite(ms)) date = new Date(ms);
  }

  // 3) Number: could be milliseconds OR seconds
  else if (typeof value === "number") {
    if (value > 1e12) date = new Date(value);          // definitely ms
    else if (value > 1e10) date = new Date(value);     // likely ms
    else if (value > 1e9) date = new Date(value * 1000); // seconds
    else date = new Date(value);
  }

  // 4) ISO string
  else if (typeof value === "string") {
    const parsed = Date.parse(value);
    if (!isNaN(parsed)) date = new Date(parsed);
  }

  // 5) Already a Date
  else if (value instanceof Date) {
    date = value;
  }

  if (!date || isNaN(date.getTime())) return "—";

  // Formatting as "29th Nov, 2025"
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month}, ${year}`;
}
