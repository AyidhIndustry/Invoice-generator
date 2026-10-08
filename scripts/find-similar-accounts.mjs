/**
 * Lists accounts whose names look like the same company, without changing
 * anything.
 *
 * Each group is tagged:
 *   [will merge]  merge-duplicate-accounts.mjs already treats these as one
 *                 company (same name ignoring case/punctuation, NAME_ALIASES,
 *                 or the same valid VAT number).
 *   [check]       spelled similarly but NOT merged. If they are the same
 *                 company, add the variants to NAME_ALIASES in account-names.mjs.
 *
 * Run:  node --env-file=.env scripts/find-similar-accounts.mjs
 *       node --env-file=.env scripts/find-similar-accounts.mjs --names names.txt
 *       (the second form checks a file of names, one per line, offline)
 *
 * Each account's VAT number is shown so you can compare them.
 */
import { readFileSync } from 'fs'
import { collection, getDocs, terminate } from 'firebase/firestore'
import { clean, db, groupAccounts, vatKey } from './account-names.mjs'

/** How alike two names must be (0–1) to be flagged. */
const THRESHOLD = 0.6

/** Words that say nothing about which company it is. */
const FILLER = new Set([
  'company', 'co', 'ltd', 'limited', 'llc', 'll', 'l', 'est', 'establishment',
  'the', 'and', 'of', 'for', 'group', 'branch', 'services', 'service',
  'industries', 'industrial', 'trading', 'contracting', 'cont', 'arabia',
  'saudi', 'arabian', 'international', 'commercial', 'holding', 'let',
])

const coreName = (name) =>
  clean(name)
    .toLowerCase()
    .replace(/&/g, ' ')
    .split(/[^\p{L}\p{N}]+/u)
    .filter((word) => word && !FILLER.has(word))
    .join('')

function levenshtein(a, b) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const row = [i]
    for (let j = 1; j <= b.length; j++) {
      row[j] = Math.min(
        prev[j] + 1,
        row[j - 1] + 1,
        prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
    prev = row
  }
  return prev[b.length]
}

function looksAlike(a, b) {
  if (a.merge === b.merge) return true
  const [x, y] = [a.core, b.core]
  if (!x || !y) return false
  if (x.length >= 6 && y.length >= 6 && (x.includes(y) || y.includes(x))) {
    return true
  }
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length) >= THRESHOLD
}

const namesFile = process.argv[process.argv.indexOf('--names') + 1]
const accounts = process.argv.includes('--names')
  ? readFileSync(namesFile, 'utf8')
      .split('\n')
      .filter((line) => line.trim())
      .map((name, i) => ({ id: `#${i + 1}`, name }))
  : (await getDocs(collection(db, 'accounts'))).docs
      .map((d) => ({
        id: d.id,
        name: d.data().name,
        VATNumber: d.data().VATNumber,
      }))
      .sort((a, b) => a.id.localeCompare(b.id))

// Accounts the merge script will combine share a `merge` group number.
const mergeGroup = new Map()
groupAccounts(accounts).forEach((group, i) => {
  for (const account of group) mergeGroup.set(account.id, i)
})

const items = accounts.map((account) => ({
  ...account,
  merge: mergeGroup.get(account.id),
  core: coreName(account.name),
}))

// Union-find, so A~B and B~C end up in one group.
const parent = items.map((_, i) => i)
const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
for (let i = 0; i < items.length; i++) {
  for (let j = i + 1; j < items.length; j++) {
    if (looksAlike(items[i], items[j])) parent[find(i)] = find(j)
  }
}

const groups = new Map()
items.forEach((item, i) => {
  const root = find(i)
  if (!groups.has(root)) groups.set(root, [])
  groups.get(root).push(item)
})

const flagged = [...groups.values()].filter((group) => group.length > 1)
for (const group of flagged) {
  const mergedTogether = new Set(group.map((item) => item.merge)).size === 1
  console.log(mergedTogether ? '[will merge]' : '[check]')
  for (const item of group) {
    const vat = clean(item.VATNumber)
    const note = vat ? `VAT ${vat}${vatKey(vat) ? '' : ' (invalid, ignored)'}` : 'no VAT'
    console.log(`    ${item.id}: ${clean(item.name)}  [${note}]`)
  }
}

console.log(
  `\n${accounts.length} accounts, ${flagged.length} groups of similar names ` +
    `(${flagged.filter((g) => new Set(g.map((i) => i.merge)).size > 1).length} need checking)`,
)

await terminate(db)
