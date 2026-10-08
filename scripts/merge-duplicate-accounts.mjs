/**
 * Merges accounts that are the same company spelled differently.
 *
 * Accounts are the same company when their names match (ignoring case,
 * spacing and punctuation, plus NAME_ALIASES) or they share a valid VAT
 * number (see vatKey). In each group
 * the lowest ID is kept, renamed to the correct spelling, and given any
 * details it is missing from the others; the other accounts are deleted.
 * Invoices and quotations keep their own copy of the customer, so deleting
 * an account never changes an existing document.
 *
 * Preview:  node --env-file=.env scripts/merge-duplicate-accounts.mjs --dry-run
 * Merge:    node --env-file=.env scripts/merge-duplicate-accounts.mjs
 */
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  terminate,
  writeBatch,
} from 'firebase/firestore'
import {
  canonicalName,
  clean,
  db,
  FIELDS,
  groupAccounts,
  vatKey,
} from './account-names.mjs'

const dryRun = process.argv.includes('--dry-run')

const snap = await getDocs(collection(db, 'accounts'))
const accounts = snap.docs
  .map((d) => ({ ...d.data(), id: d.id }))
  .sort((a, b) => a.id.localeCompare(b.id))

const groups = groupAccounts(accounts)

let changed = 0
let deleted = 0
for (const [keep, ...duplicates] of groups) {
  const merged = { name: canonicalName(keep.name) }
  for (const account of [keep, ...duplicates]) {
    for (const field of FIELDS.filter((f) => f !== 'name')) {
      if (!merged[field] && clean(account[field])) {
        merged[field] = clean(account[field])
      }
    }
  }

  const needsUpdate = FIELDS.some(
    (field) => (merged[field] ?? '') !== (keep[field] ?? ''),
  )
  if (!needsUpdate && duplicates.length === 0) continue

  changed++
  deleted += duplicates.length
  console.log(`${keep.id}: ${merged.name}`)
  if (merged.name !== keep.name) console.log(`    renamed from: ${keep.name}`)
  for (const d of duplicates) {
    const byVat =
      vatKey(d.VATNumber) && vatKey(d.VATNumber) === vatKey(keep.VATNumber)
    console.log(
      `    delete ${d.id}: ${d.name}${byVat ? ` (same VAT ${vatKey(d.VATNumber)})` : ''}`,
    )
  }

  if (dryRun) continue

  // One batch per company: the update and its deletes succeed or fail together.
  const batch = writeBatch(db)
  batch.update(doc(db, 'accounts', keep.id), {
    ...merged,
    updatedAt: serverTimestamp(),
  })
  for (const d of duplicates) batch.delete(doc(db, 'accounts', d.id))
  await batch.commit()
}

console.log(
  `${accounts.length} accounts → ${groups.length} after merging ` +
    `(${changed} updated, ${deleted} deleted)` +
    (dryRun ? ' (dry run, nothing written)' : ''),
)

await terminate(db)
