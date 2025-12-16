// src/lib/normalize-date.ts
export function normalizeToDate(value: any): Date | null {
  if (!value && value !== 0) return null

  // Firestore Timestamp
  if (typeof value?.toDate === 'function') {
    try {
      return value.toDate()
    } catch {
      return null
    }
  }

  // Protobuf { seconds, nanoseconds }
  if (
    typeof value === 'object' &&
    (typeof value.seconds === 'number' || typeof value.seconds === 'string')
  ) {
    const seconds = Number(value.seconds)
    const nanos = Number(value.nanoseconds || 0)
    const ms = seconds * 1000 + Math.floor(nanos / 1e6)
    return Number.isFinite(ms) ? new Date(ms) : null
  }

  // Number
  if (typeof value === 'number') {
    if (value > 1e12) return new Date(value)        // ms
    if (value > 1e9) return new Date(value * 1000)  // seconds
    return new Date(value)
  }

  // String
  if (typeof value === 'string') {
    const parsed = Date.parse(value)
    return isNaN(parsed) ? null : new Date(parsed)
  }

  // Date
  if (value instanceof Date) return value

  return null
}
