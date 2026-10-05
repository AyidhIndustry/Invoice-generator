type TimestampLike = { toDate: () => Date }
type SecondsLike = { seconds: number | string; nanoseconds?: number | string }

function isTimestampLike(value: object): value is TimestampLike {
  return typeof (value as TimestampLike).toDate === 'function'
}

function isSecondsLike(value: object): value is SecondsLike {
  const { seconds } = value as Partial<SecondsLike>
  return typeof seconds === 'number' || typeof seconds === 'string'
}

/**
 * Converts any stored date representation to a `Date`: a Firestore
 * Timestamp, a serialized `{ seconds, nanoseconds }` object, epoch seconds or
 * milliseconds, an ISO string, or a `Date`. Returns null if it is not valid.
 */
export function parseToDate(value: unknown): Date | null {
  let date: Date | null = null

  if (value instanceof Date) {
    date = value
  } else if (typeof value === 'object' && value !== null) {
    if (isTimestampLike(value)) {
      try {
        date = value.toDate()
      } catch {
        date = null
      }
    } else if (isSecondsLike(value)) {
      const seconds = Number(value.seconds)
      const nanos = Number(value.nanoseconds || 0)
      const ms = seconds * 1000 + Math.floor(nanos / 1e6)

      if (Number.isFinite(ms)) date = new Date(ms)
    }
  } else if (typeof value === 'number') {
    // Values above 1e10 are milliseconds; between 1e9 and 1e10, seconds.
    date =
      value > 1e10 || value <= 1e9 ? new Date(value) : new Date(value * 1000)
  } else if (typeof value === 'string') {
    const parsed = Date.parse(value)
    if (!isNaN(parsed)) date = new Date(parsed)
  }

  if (!date || isNaN(date.getTime())) return null
  return date
}

// ZATCA TLV tag 3 requires an ISO 8601 UTC timestamp, e.g. "2024-05-01T13:45:30Z"
export function toZatcaTimestamp(value: unknown): string {
  const date = parseToDate(value) ?? new Date()
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z')
}

/** Formats a stored date as e.g. "29th Nov, 2025", or "—" if missing. */
export function formatTimestamp(value: unknown): string {
  const date = parseToDate(value)
  if (!date) return '—'

  const day = date.getDate()
  const month = date.toLocaleString('en-US', { month: 'short' })
  const year = date.getFullYear()

  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th'

  return `${day}${suffix} ${month}, ${year}`
}
