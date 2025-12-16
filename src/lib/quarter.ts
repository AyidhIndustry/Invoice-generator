export type Quarter = 1 | 2 | 3 | 4

export function getQuarterRange(year: number, quarter: Quarter) {
  switch (quarter) {
    case 1: return { start: new Date(year, 0, 1), end: new Date(year, 3, 1) }
    case 2: return { start: new Date(year, 3, 1), end: new Date(year, 6, 1) }
    case 3: return { start: new Date(year, 6, 1), end: new Date(year, 9, 1) }
    case 4: return { start: new Date(year, 9, 1), end: new Date(year + 1, 0, 1) }
  }
}
