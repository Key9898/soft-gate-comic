import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import {
  INFO_PRIMARY_CTA,
  INFO_SECONDARY_CTA,
  INFO_TOC_LINK,
  INFO_SECTION_HEADING,
} from '../features/info/components/infoStyles'

const SRC = path.resolve(__dirname, '..')

/**
 * `wiki/conventions/type-weight-scale.md` allows `font-bold` at small sizes only for
 * text drawn on top of cover artwork, where the weight is fighting an image for
 * legibility rather than expressing hierarchy. These are those surfaces.
 */
const COVER_OVERLAYS = [
  'components/BookCard/CatalogBookCard.tsx',
  'components/ContentRatingBadge.tsx',
  'components/SeriesRating/RatingChip.tsx',
  'features/home/components/DailyDropCard.tsx',
]

const SOURCE_FILE = /\.tsx?$/
const CLASS_STRING = /"[^"]*"|'[^']*'|`[^`]*`/gs
const BOLD = /\bfont-bold\b/
/** `text-xs`, `text-2xs` and any arbitrary size at or under 12px. */
const SMALL = /\btext-(?:xs|2xs)\b|\btext-\[(?:[1-9]|1[0-2])px\]/
/** A 14px eyebrow: uppercase, and therefore a label rather than body copy. */
const SMALL_EYEBROW = /\btext-sm\b(?=[^]*\buppercase\b)|\buppercase\b(?=[^]*\btext-sm\b)/

const sourceFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === 'test' ? [] : sourceFiles(full)
    return SOURCE_FILE.test(entry.name) ? [full] : []
  })

const boldSmallType = (file: string): string[] => {
  const text = readFileSync(file, 'utf8')
  const relative = path.relative(SRC, file)
  return [...text.matchAll(CLASS_STRING)]
    .filter(
      (match) => BOLD.test(match[0]) && (SMALL.test(match[0]) || SMALL_EYEBROW.test(match[0]))
    )
    .map((match) => `${relative}:${text.slice(0, match.index).split('\n').length}`)
}

const violations = () =>
  sourceFiles(SRC)
    .filter((file) => !COVER_OVERLAYS.includes(path.relative(SRC, file)))
    .flatMap(boldSmallType)

/**
 * The info pages (About, Creators, Press, Help, Contact) speak in an editorial voice:
 * a small uppercase eyebrow with wide tracking. It shipped as `text-xs font-bold`,
 * which the weight scale bans outside the cover-overlay exception — an eyebrow on a
 * white page is not fighting an image, and the scale lists eyebrows under
 * `font-semibold`.
 */
describe('info editorial voice', () => {
  it('sets the eyebrow at semibold, not bold', () => {
    for (const cta of [INFO_PRIMARY_CTA, INFO_SECONDARY_CTA, INFO_TOC_LINK]) {
      expect(cta).toContain('font-semibold')
      expect(cta).not.toContain('font-bold')
    }
  })

  it('leaves the section heading bold so the eyebrow still sits below it', () => {
    expect(INFO_SECTION_HEADING).toContain('font-bold')
    expect(INFO_SECTION_HEADING).toContain('text-xl')
  })
})

describe('small type weight', () => {
  it('keeps font-bold off small text outside the cover-overlay exception', () => {
    expect(violations()).toEqual([])
  })

  it('leaves the cover overlays bold, because they fight an image for legibility', () => {
    for (const overlay of COVER_OVERLAYS) {
      expect(readFileSync(path.join(SRC, overlay), 'utf8')).toMatch(BOLD)
    }
  })
})
