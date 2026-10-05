export type Mode = 'all' | 'date' | 'month'

/**
 * List filter. The date and month variants may be incomplete while the user
 * is still picking a value; an incomplete filter lists everything.
 */
export type FilterType =
  | { type: 'all' }
  | { type: 'date'; date?: Date }
  | { type: 'month'; year?: number; month?: number }
