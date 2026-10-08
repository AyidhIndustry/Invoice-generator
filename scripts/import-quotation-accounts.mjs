/**
 * One-off import: creates an account for every customer found on quotations.
 *
 * Customers are matched by company name, ignoring case, spacing and
 * punctuation, so a company quoted many times becomes one account, and
 * companies that already have an account are skipped. Misspelled names listed
 * in NAME_ALIASES are merged into the correct name. For each field, the newest
 * quotation that has a value wins. Safe to run again: it only adds companies
 * that are still missing.
 *
 * Preview:  node --env-file=.env scripts/import-quotation-accounts.mjs --dry-run
 * Import:   node --env-file=.env scripts/import-quotation-accounts.mjs
 */
import {
  collection,
  doc,
  getDocs,
  runTransaction,
  serverTimestamp,
  terminate,
} from 'firebase/firestore'
import { canonicalName, clean, db, FIELDS, nameKey } from './account-names.mjs'

const dryRun = process.argv.includes('--dry-run')

const toMillis = (value) =>
  typeof value?.toMillis === 'function' ? value.toMillis() : 0

/** Creates one account, reserving its ID from the same counter as the app. */
async function createAccount(data) {
  return runTransaction(db, async (transaction) => {
    const counterRef = doc(db, 'counters', 'account')
    const counterSnap = await transaction.get(counterRef)
    const next = counterSnap.exists() ? Number(counterSnap.data().last) + 1 : 1
    const id = `ACC-${String(next).padStart(5, '0')}`
    const accountRef = doc(db, 'accounts', id)

    if ((await transaction.get(accountRef)).exists()) {
      throw new Error(`${id} already exists. The account counter is out of sync.`)
    }

    transaction.set(counterRef, { last: next })
    transaction.set(accountRef, { ...data, id, createdAt: serverTimestamp() })
    return id
  })
}

const [quotationSnap, accountSnap] = await Promise.all([
  getDocs(collection(db, 'quotations')),
  getDocs(collection(db, 'accounts')),
])

const existing = new Set(
  accountSnap.docs.map((d) => nameKey(canonicalName(d.data().name))),
)

// Newest first, so the latest details of each company are kept.
const quotations = quotationSnap.docs
  .map((d) => d.data())
  .sort(
    (a, b) =>
      toMillis(b.createdAt ?? b.date) - toMillis(a.createdAt ?? a.date),
  )

const companies = new Map()
const spellings = new Map()
for (const { customer } of quotations) {
  const rawName = clean(customer?.name)
  const name = canonicalName(rawName)
  const key = nameKey(name)
  if (!key || existing.has(key)) continue

  const company = companies.get(key) ?? { name }
  for (const field of FIELDS) {
    if (!company[field] && clean(customer[field])) {
      company[field] = clean(customer[field])
    }
  }
  companies.set(key, company)

  if (!spellings.has(key)) spellings.set(key, new Set())
  spellings.get(key).add(rawName)
}

console.log(
  `${quotations.length} quotations, ${existing.size} existing accounts, ` +
    `${companies.size} new companies${dryRun ? ' (dry run, nothing written)' : ''}`,
)

for (const [key, company] of companies) {
  const id = dryRun ? 'would create' : await createAccount(company)
  console.log(`${id}: ${company.name}`)

  const merged = [...spellings.get(key)].filter((n) => n !== company.name)
  if (merged.length) console.log(`    merged from: ${merged.join(' | ')}`)
}

await terminate(db)
