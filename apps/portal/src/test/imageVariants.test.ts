import { describe, it, expect } from 'vitest'
import { createHash } from 'node:crypto'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import path from 'node:path'
import {
  JOBS,
  MANIFEST_PATH,
  FORMAT_EXTENSIONS,
  sourceFilesIn,
} from '../../scripts/imageVariants.config'
import { coverSources, bannerSources, COVER_SIZES } from '../lib/images/responsiveImage'
import { mockWebtoons } from '@softgate/shared'

const publicDir = path.resolve(__dirname, '../../public')
const manifestFile = path.join(publicDir, MANIFEST_PATH)

const hashFile = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex')

// `draft-story.png` sat here for weeks referenced by nothing: 486kB copied into
// dist on every build, generating eight variants, for an image no route could
// reach — and carrying a baked "Comming Soon" typo and an unfilled
// `[Author Name]` nobody could see to report. An orphan is a shipping cost and a
// place for defects to hide.
describe('every committed cover is actually used', () => {
  it('has no cover the catalog never references', () => {
    const referenced = new Set(
      mockWebtoons
        .map((webtoon) => webtoon.coverImage)
        .filter((src): src is string => Boolean(src?.startsWith('/webtoon-covers/')))
        .map((src) => src.slice('/webtoon-covers/'.length))
    )
    const onDisk = sourceFilesIn(readdirSync(path.join(publicDir, 'webtoon-covers')))
    const orphans = onDisk.filter((name) => !referenced.has(name))
    expect(orphans, `unreferenced cover(s): ${orphans.join(', ')}`).toEqual([])
  })
})

describe('generated image variants stay in step with their sources', () => {
  it('has a manifest', () => {
    expect(existsSync(manifestFile)).toBe(true)
  })

  // The variants themselves are build output and gitignored, and `test:run`
  // only dependsOn `^build`, so on a fresh clone this runs alongside the build
  // that generates them. Absent output means "not built yet", not a defect —
  // the manifest test below is the one that must hold unconditionally.
  it('has every variant every source is supposed to produce, once built', () => {
    for (const job of JOBS) {
      const sourceRoot = path.join(publicDir, job.sourceDir)
      if (!existsSync(sourceRoot) || !existsSync(path.join(publicDir, job.outDir))) continue
      for (const name of sourceFilesIn(readdirSync(sourceRoot))) {
        const stem = name.replace(/\.[^.]+$/, '')
        for (const width of job.widths) {
          for (const ext of FORMAT_EXTENSIONS) {
            const variant = path.join(publicDir, job.outDir, `${stem}-${width}.${ext}`)
            expect(existsSync(variant), `missing ${job.outDir}/${stem}-${width}.${ext}`).toBe(true)
          }
        }
      }
    }
  })

  // Existence alone would not catch the case this pipeline exists for: #4
  // replaces the placeholder artwork in place, keeping every filename. Without
  // a content hash the stale variants would ship and the new art would never
  // reach a visitor.
  it('regenerates when the source artwork is replaced in place', () => {
    const manifest: Record<string, string> = JSON.parse(readFileSync(manifestFile, 'utf8'))
    for (const job of JOBS) {
      const sourceRoot = path.join(publicDir, job.sourceDir)
      if (!existsSync(sourceRoot)) continue
      for (const name of sourceFilesIn(readdirSync(sourceRoot))) {
        const key = `${job.sourceDir}/${name}`
        expect(
          manifest[key],
          `${key} is not in the manifest — run pnpm generate:images`
        ).toBeTruthy()
        expect(
          manifest[key],
          `${key} changed since its variants were built — run pnpm generate:images`
        ).toBe(hashFile(path.join(sourceRoot, name)))
      }
    }
  })
})

describe('responsive source building', () => {
  it('builds an ascending width-descriptor srcset for a local cover', () => {
    const sources = coverSources('/webtoon-covers/shadow-knight.png')
    expect(sources).not.toBeNull()
    expect(sources?.avif).toBe(
      '/webtoon-covers/r/shadow-knight-192.avif 192w, /webtoon-covers/r/shadow-knight-288.avif 288w, /webtoon-covers/r/shadow-knight-384.avif 384w, /webtoon-covers/r/shadow-knight-576.avif 576w'
    )
    expect(sources?.fallback).toBe('/webtoon-covers/shadow-knight.png')
  })

  // A live catalog serves covers from R2. Deriving variant URLs for those would
  // 404 every source and drop the card back to its fallback for no reason.
  it('passes remote and foreign covers through untouched', () => {
    expect(coverSources('https://cdn.example.com/cover.png')).toBeNull()
    expect(coverSources('/about/our-story-splash.jpg')).toBeNull()
    expect(coverSources('/webtoon-covers/nested/cover.png')).toBeNull()
    expect(coverSources(undefined)).toBeNull()
  })

  // Same caveat as above: skipped until the generators have run, so that a
  // fresh clone testing in parallel with its first build is not a red gate.
  const built = (dir: string) => existsSync(path.join(publicDir, dir))

  it('names a real generated file in every cover srcset entry, once built', () => {
    if (!built('webtoon-covers/r')) return
    const sources = coverSources('/webtoon-covers/shadow-knight.png')
    for (const entry of sources?.avif.split(', ') ?? []) {
      const [url] = entry.split(' ')
      expect(existsSync(path.join(publicDir, url.replace(/^\//, ''))), `missing ${url}`).toBe(true)
    }
  })

  it('names a real generated file in every banner srcset entry, once built', () => {
    if (!built('banner/r')) return
    const sources = bannerSources()
    for (const entry of [...sources.avif.split(', '), ...sources.webp.split(', ')]) {
      const [url] = entry.split(' ')
      expect(existsSync(path.join(publicDir, url.replace(/^\//, ''))), `missing ${url}`).toBe(true)
    }
  })

  it('describes the widest cover slot it can actually be asked for', () => {
    // max-w-7xl with xl:grid-cols-6 and gap-6 leaves 183px; a sizes hint below
    // the real slot ships a blurry cover on every desktop.
    expect(COVER_SIZES).toContain('183px')
  })
})
