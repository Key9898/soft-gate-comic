import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { INFO_SECTION_HEADING, INFO_SECTION_RULE } from '../features/info/components/infoStyles'

const SRC = path.resolve(__dirname, '..')
const HOME = 'features/info/components/infoStyles.ts'
const SOURCE_FILE = /\.tsx?$/

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === 'test' ? [] : sourceFiles(full)
    return SOURCE_FILE.test(entry.name) ? [full] : []
  })

/** Files that spell the class string out instead of importing the constant. */
const copiesOf = (literal: string): string[] =>
  sourceFiles(SRC)
    .filter((file) => readFileSync(file, 'utf8').includes(literal))
    .map((file) => path.relative(SRC, file))
    .filter((relative) => relative !== HOME)

/**
 * The info pages share one editorial section rhythm — a rule, a wide-tracked heading and
 * a white panel — and `infoStyles.ts` exists so that rhythm has a single home. Five pages
 * import it; three files kept a byte-identical copy of the literal instead. That is the
 * failure mode that produced the `font-bold` eyebrow drift: the constant gets corrected
 * and the copies silently keep the old value.
 */
describe('info section styles', () => {
  it('declares the section heading in one place', () => {
    expect(copiesOf(INFO_SECTION_HEADING)).toEqual([])
  })

  it('declares the section rule in one place', () => {
    expect(copiesOf(INFO_SECTION_RULE)).toEqual([])
  })
})
