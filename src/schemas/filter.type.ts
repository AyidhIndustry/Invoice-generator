export type Mode = 'all' | 'date' | 'month'
export type FilterType =
  | { type: 'all' }
  | { type: 'date'; date: Date }
  | { type: 'month'; year: number; month: number }