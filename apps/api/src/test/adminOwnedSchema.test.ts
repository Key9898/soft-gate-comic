import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const PRISMA_DIR = join(process.cwd(), 'prisma')
const SCHEMA_PATH = join(PRISMA_DIR, 'schema.prisma')
const MIGRATIONS_DIR = join(PRISMA_DIR, 'migrations')

const BEGIN_MARKER = '// BEGIN ADMIN-OWNED TABLES'
const END_MARKER = '// END ADMIN-OWNED TABLES'

/**
 * These tables live in Admin's schema and are copied here so the website can
 * read them. The website never writes them and must never migrate them, so a
 * generated migration that creates one is a mistake — see prisma/README.md.
 */
const ADMIN_OWNED_MODELS = [
  'AboutHistory',
  'AboutTeamMember',
  'AboutTeamMeta',
  'PressMeta',
  'PressNews',
  'PressStill',
  'FaqMeta',
  'FaqItem',
  'CookieMeta',
  'CookieStorageRow',
  'PrivacyMeta',
  'PrivacySection',
  'TermsMeta',
  'TermsSection',
]

const schema = readFileSync(SCHEMA_PATH, 'utf8')

function adminOwnedBlock(): string {
  const begin = schema.indexOf(BEGIN_MARKER)
  const end = schema.indexOf(END_MARKER)
  expect(begin, `${BEGIN_MARKER} is missing from schema.prisma`).toBeGreaterThan(-1)
  expect(end, `${END_MARKER} is missing from schema.prisma`).toBeGreaterThan(begin)
  return schema.slice(begin, end)
}

function migrationSql(): { file: string; sql: string }[] {
  let entries: string[]
  try {
    entries = readdirSync(MIGRATIONS_DIR)
  } catch {
    return []
  }
  const files: { file: string; sql: string }[] = []
  for (const entry of entries) {
    const path = join(MIGRATIONS_DIR, entry)
    if (!statSync(path).isDirectory()) continue
    const sqlPath = join(path, 'migration.sql')
    try {
      files.push({ file: entry, sql: readFileSync(sqlPath, 'utf8') })
    } catch {
      // A migration directory without migration.sql is not ours to police.
    }
  }
  return files
}

describe('Admin-owned schema copy', () => {
  it('keeps every Admin-owned model inside the marked block', () => {
    const block = adminOwnedBlock()
    const missing = ADMIN_OWNED_MODELS.filter((name) => !block.includes(`model ${name} {`))
    expect(missing).toEqual([])
  })

  it('does not leave a website-owned model inside the marked block', () => {
    const block = adminOwnedBlock()
    const declared = [...block.matchAll(/^model (\w+) \{/gm)].map((match) => match[1]!)
    expect(declared.sort()).toEqual([...ADMIN_OWNED_MODELS].sort())
  })

  it('never migrates an Admin-owned table', () => {
    const offenders: string[] = []
    for (const { file, sql } of migrationSql()) {
      for (const model of ADMIN_OWNED_MODELS) {
        // Prisma quotes table names, so "AboutHistory" will not match AboutHistoryFoo.
        if (sql.includes(`"${model}"`)) offenders.push(`${file} touches ${model}`)
      }
    }
    expect(offenders).toEqual([])
  })
})
