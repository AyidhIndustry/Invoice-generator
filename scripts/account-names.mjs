/** Firebase connection and company-name matching shared by the account scripts. */
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const env = process.env

export const db = getFirestore(
  initializeApp({
    apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }),
)

export const FIELDS = ['name', 'VATNumber', 'address', 'email', 'phoneNumber']

/**
 * Correct company name → misspellings found on quotations. Variants that only
 * differ in case, spacing or punctuation are already matched automatically.
 */
export const NAME_ALIASES = {
  'Saudi Arabian Trading and Construction Company (SATCO)': [
    'Saudi Arabia Trading and Contraction company (SATCO)',
    'Saudi Arabia Trading and Construction company (SATCO)',
    'Saudi Arabia Trading and Construction Company',
    'Saudi Arabia Trading and Contraction Company',
  ],
  'Abdulaziz Hamad Suleiman Al-Khonaini Est. Catering': [
    'Abdulaziz Hamad Suleiman Al - Khonaini Est Catring',
  ],
  'Khalid Saleem Al-Ahmedi Company': [
    'Khalid Saleem Al Ahamedi Company',
    'Khalid Salem Al Ahmadi',
  ],
  'MAKANA Industries & Services Co. Ltd.': [
    'Makana industries Co ltd',
    'MAKANA industries Services Co . Ltd',
  ],
  'Innovation Equipment Rentals': ['Innovation Equipment Rentais'],
  'ADVANCED SOLUTION': ['ADVANCWD SOLUTION'],
  'GULF Oil Performance Co': ['GULF Oil Perfomance Co'],
  'SEMA ALOULA GENERAL CONTRACTING EST. (SMA)': [
    'SEMA ALOULA GEWERAL CONTRACTING EST . (SMA)',
  ],
}

const decodeEntities = (value) =>
  value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
export const clean = (value) =>
  typeof value === 'string'
    ? decodeEntities(value).trim().replace(/\s+/g, ' ')
    : ''
/** Matching key: letters and digits only, so spacing and punctuation don't matter. */
export const nameKey = (name) =>
  clean(name).toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')

const canonicalNames = new Map()
for (const [correct, variants] of Object.entries(NAME_ALIASES)) {
  for (const name of [correct, ...variants]) {
    canonicalNames.set(nameKey(name), correct)
  }
}

/** The correct spelling of a company name, after cleaning. */
export const canonicalName = (name) => {
  const cleaned = clean(name)
  return canonicalNames.get(nameKey(cleaned)) ?? cleaned
}

/**
 * A VAT number usable for matching: a Saudi VAT number (15 digits, starting
 * and ending with 3), ignoring spaces and dashes. Placeholders like
 * 300000000000003 and malformed numbers return '' so they never match.
 */
export const vatKey = (vat) => {
  const digits = clean(vat).replace(/[\s-]/g, '')
  if (!/^3\d{13}3$/.test(digits) || /^30{13}3$/.test(digits)) return ''
  return digits
}

/**
 * Groups accounts that are the same company: same name (see nameKey and
 * NAME_ALIASES) or same valid VAT number. Returns arrays sorted by ID.
 */
export function groupAccounts(accounts) {
  const parent = accounts.map((_, i) => i)
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
  const firstWith = new Map()

  accounts.forEach((account, i) => {
    const keys = [`name:${nameKey(canonicalName(account.name))}`]
    const vat = vatKey(account.VATNumber)
    if (vat) keys.push(`vat:${vat}`)

    for (const key of keys) {
      if (firstWith.has(key)) parent[find(i)] = find(firstWith.get(key))
      else firstWith.set(key, i)
    }
  })

  const groups = new Map()
  accounts.forEach((account, i) => {
    const root = find(i)
    if (!groups.has(root)) groups.set(root, [])
    groups.get(root).push(account)
  })
  return [...groups.values()].map((group) =>
    group.sort((a, b) => a.id.localeCompare(b.id)),
  )
}
