import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const TOKENS = [
  'canvas',
  'surface',
  'surface-nested',
  'raised',
  'track',
  'ink',
  'ink-secondary',
  'ink-muted',
  'edge',
  'edge-subtle',
  'danger-surface',
  'danger-edge',
] as const

const SRC = path.resolve(__dirname, '..')

const css = () => readFileSync(path.resolve(__dirname, '../index.css'), 'utf8')

const themeBlock = () => {
  const contents = css()
  const start = contents.indexOf('@theme {')
  expect(start).toBeGreaterThan(-1)
  return contents.slice(start, contents.indexOf('\n}', start))
}

const immersiveScope = () => {
  const contents = css()
  const start = contents.indexOf("[data-theme='immersive']")
  expect(start).toBeGreaterThan(-1)
  return contents.slice(start, contents.indexOf('\n}', start))
}

describe('immersive colour tokens', () => {
  it('declares every semantic token in the theme block', () => {
    const theme = themeBlock()
    for (const token of TOKENS) {
      expect(theme).toContain(`--color-${token}:`)
    }
  })

  it('re-binds every one of them in the immersive scope', () => {
    const scope = immersiveScope()
    for (const token of TOKENS) {
      expect(scope).toContain(`--color-${token}:`)
    }
  })

  it('leaves the portal-wide muted tokens out of the immersive scope', () => {
    const start = css().indexOf("[data-theme='immersive']")
    const scope = css().slice(start, css().indexOf('}', start))
    expect(scope).not.toContain('--color-muted')
  })
})

// ── Contrast verification ──────────────────────────────────────────────────
//
// The design note claims `--color-ink-muted` clears 4.5:1 on `--color-canvas` in both
// modes. Computed from the actual shipped `rgb(...)` values below, per WCAG 2.x's
// relative-luminance formula, rather than assumed from the note's prose.

type Rgb = readonly [number, number, number]

const extractOpaqueRgb = (block: string, varName: string): Rgb => {
  const match = block.match(new RegExp(`${varName}:\\s*rgb\\((\\d+)\\s+(\\d+)\\s+(\\d+)\\)`))
  if (!match) {
    throw new Error(`expected an opaque rgb(...) value for ${varName}`)
  }
  return [Number(match[1]), Number(match[2]), Number(match[3])]
}

const relativeLuminance = ([r, g, b]: Rgb): number => {
  const linearise = (channel: number): number => {
    const c = channel / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * linearise(r) + 0.7152 * linearise(g) + 0.0722 * linearise(b)
}

const contrastRatio = (a: Rgb, b: Rgb): number => {
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (lighter + 0.05) / (darker + 0.05)
}

const AA_NORMAL_TEXT_CONTRAST = 4.5

describe('ink-muted on canvas contrast', () => {
  it('clears 4.5:1 in light mode', () => {
    const theme = themeBlock()
    const canvas = extractOpaqueRgb(theme, '--color-canvas')
    const inkMuted = extractOpaqueRgb(theme, '--color-ink-muted')
    expect(contrastRatio(canvas, inkMuted)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT_CONTRAST)
  })

  it('clears 4.5:1 in the immersive scope', () => {
    const scope = immersiveScope()
    const canvas = extractOpaqueRgb(scope, '--color-canvas')
    const inkMuted = extractOpaqueRgb(scope, '--color-ink-muted')
    expect(contrastRatio(canvas, inkMuted)).toBeGreaterThanOrEqual(AA_NORMAL_TEXT_CONTRAST)
  })
})

// ── Source sweep: no unconverted dark literal survives in the converted surfaces ──
//
// Tasks 3 and 5 replaced every gray/white/red literal standing in for the twelve tokens
// above, across Webtoon Detail's hub hero and the Reader's chrome. This sweep guards
// against that regressing: a literal reappearing where a token utility used to be.
//
// Scope matches what was actually converted, not "everything" and not "one file":
// - Webtoon Detail: only the hub hero JSX, sliced from `data-testid="hub-hero"` to the
//   "MOBILE OVERVIEW" comment (the same boundary Task 3 declared and audited). Below
//   that boundary the page legitimately uses light-surface grays (episode list, rating,
//   comments, related sections) and must not be swept. The `statusConfig` object sits
//   above the boundary, outside the hero JSX, and is an explicit, documented descope
//   (see the design note's "Status badge family" section) rather than a regression
//   target — it is intentionally not covered here.
// - The Reader: Task 5's inventory (the six top-level Reader files) plus every file in
//   `features/reader/components/complete/` — the chapter-end card and everything it
//   renders. That directory was under-covered after Task 5: four of its ten files were
//   in the original inventory and six were not, even though they render inside the same
//   `data-theme="immersive"` scope and carry the same literal-gray risk. `Comments/*`,
//   `SeriesRatingControl.tsx`, and the Home hero files were never part of this
//   conversion (see the design note's "Out of scope") and are not scanned — sweeping
//   them would fail on code this issue deliberately left alone.
//
// `black` is excluded from the watched colour set: the brightness dimmer and the modal
// backdrop scrim use literal black regardless of theme, and were never one of the
// twelve light/dark token pairs.
//
// The prefix list includes `ring-offset` ahead of (in addition to) `ring`: `ring-offset-`
// is a distinct Tailwind utility family from `ring-`, not a variant of it, so a colour
// glued directly to `ring-offset-` (e.g. `ring-offset-gray-900`, the literal Task 3
// replaced with `ring-offset-canvas` at three sites in WebtoonDetailPage.tsx) would
// otherwise slip past a sweep that only recognises `ring-`. Widening does not
// false-fail `ring-offset-canvas` or `ring-offset-2`: `canvas` is not one of the watched
// literal colour names, and `2` is a spacing value, not a colour, so neither reaches the
// colour alternation below.
const COLOR_LITERAL =
  /\b(?:bg|text|border|ring-offset|ring|from|via|to)-(?:gray-(?:50|100|200|300|400|500|600|700|800|900|950)(?:\/\d{1,3})?|white(?:\/\d{1,3})?|red-(?:50|200|500\/10|500\/40))\b/g

type LiteralException = { file: string; literal: string; reason: string }

const READER_FILES = [
  'features/reader/ReaderPage.tsx',
  'features/reader/components/ReaderSheet.tsx',
  'features/reader/components/ReaderEpisodeSheet.tsx',
  'features/reader/components/ReaderSettingsSheet.tsx',
  'features/reader/components/ReaderSkeleton.tsx',
  'features/reader/components/ReaderAdSlot.tsx',
  'features/reader/components/complete/GuestNudge.tsx',
  'features/reader/components/complete/EpisodeReactions.tsx',
  'features/reader/components/complete/ReaderCompleteCard.tsx',
  'features/reader/components/complete/CompleteComments.tsx',
  'features/reader/components/complete/CreatorNote.tsx',
  'features/reader/components/complete/NextUpRow.tsx',
  'features/reader/components/complete/EndOfSeries.tsx',
  'features/reader/components/complete/RelatedList.tsx',
  'features/reader/components/complete/ReportControl.tsx',
  'features/reader/components/complete/RatingControl.tsx',
]

const HERO_FILE = 'features/webtoon/WebtoonDetailPage.tsx'
const HERO_START_MARKER = 'data-testid="hub-hero"'
const HERO_END_MARKER = '═══════ MOBILE OVERVIEW ═══════'

/**
 * Every literal Tailwind class this sweep would otherwise flag, that is legitimately
 * still there. Each one is a "no token (stays)" site from Task 3 or Task 5's review, or
 * a pre-existing literal that was never part of a `darkMode` ternary in the first place
 * (and so was never in scope for this issue). Removing a line here without also removing
 * the literal it names is a real regression; the "allowlist cannot go stale" test below
 * catches the opposite mistake.
 */
const EXCEPTIONS: LiteralException[] = [
  // ReaderPage.tsx — chrome bars: translucent bg + shadow, no token equivalent (Task 5
  // review). Only the border half of these sites tokenised to border-edge.
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'bg-gray-950/75',
    reason: 'chrome bar bg, no token match (Task 5)',
  },
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'bg-white/75',
    reason: 'chrome bar bg, no token match (Task 5)',
  },
  // ReaderPage.tsx — floating nav-button chrome: opacity levels and ring don't match
  // any token (Task 5 review). Only the text half tokenised to text-ink.
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'bg-gray-950/80',
    reason: 'floating nav chrome, no token match (Task 5)',
  },
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'bg-white/90',
    reason: 'floating nav chrome, no token match (Task 5)',
  },
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'ring-white/15',
    reason: 'floating nav chrome, no token match (Task 5)',
  },
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'ring-gray-900/10',
    reason: 'floating nav chrome, no token match (Task 5)',
  },
  // ReaderPage.tsx — reading-progress track: a static 20%-opacity fill that never
  // branched on darkMode, so it was never in Task 5's inventory.
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'bg-gray-200/20',
    reason: 'progress track, pre-existing, not theme-conditional',
  },
  // ReaderPage.tsx — age-gate Modal body copy: a static, non-reader-chrome surface.
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'text-gray-600',
    reason: 'age-gate modal text, unrelated to darkMode',
  },
  // ReaderPage.tsx — broken-image fallback: pre-existing, never behind a darkMode
  // ternary; Task 5's report flagged this in passing as known and unfixed.
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'bg-gray-900',
    reason: 'broken-image fallback, pre-existing, out of scope',
  },
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'bg-white',
    reason: 'broken-image retry button, pre-existing, out of scope',
  },
  {
    file: 'features/reader/ReaderPage.tsx',
    literal: 'text-gray-900',
    reason: 'broken-image retry button, pre-existing, out of scope',
  },

  // ReaderSkeleton.tsx mirrors ReaderPage.tsx's header/footer chrome bars and progress
  // track for the loading state.
  {
    file: 'features/reader/components/ReaderSkeleton.tsx',
    literal: 'bg-gray-950/75',
    reason: 'mirrored chrome bar bg, no token match (Task 5)',
  },
  {
    file: 'features/reader/components/ReaderSkeleton.tsx',
    literal: 'bg-white/75',
    reason: 'mirrored chrome bar bg, no token match (Task 5)',
  },
  {
    file: 'features/reader/components/ReaderSkeleton.tsx',
    literal: 'bg-gray-200/20',
    reason: 'progress track, pre-existing, not theme-conditional',
  },

  // ReaderSettingsSheet.tsx / ReaderEpisodeSheet.tsx — jump-button hover-border: no
  // hover-border token exists (Task 5 review).
  {
    file: 'features/reader/components/ReaderSettingsSheet.tsx',
    literal: 'border-white/20',
    reason: 'hover-border, no token match (Task 5)',
  },
  {
    file: 'features/reader/components/ReaderSettingsSheet.tsx',
    literal: 'border-gray-300',
    reason: 'hover-border, no token match (Task 5)',
  },
  {
    file: 'features/reader/components/ReaderEpisodeSheet.tsx',
    literal: 'border-white/20',
    reason: 'hover-border, no token match (Task 5)',
  },
  {
    file: 'features/reader/components/ReaderEpisodeSheet.tsx',
    literal: 'border-gray-300',
    reason: 'hover-border, no token match (Task 5)',
  },

  // complete/ — static uppercase eyebrow labels, six instances across four files. These
  // are pre-existing `text-gray-500` labels that were never behind a `darkMode` ternary
  // — unlike the rest of this file's exceptions, they were never dark/light pairs with a
  // dropped branch, just a literal that sat outside Task 5's original inventory. (An
  // earlier version of this comment claimed EpisodeReactions.tsx and
  // ReaderCompleteCard.tsx "never received a `darkMode` prop" — both do, for other class
  // sites; the accurate distinction is that this specific label was never a ternary,
  // not that the component never saw the prop.) Left as-is rather than tokenised or
  // ternary'd: the correct fix is out of scope for issue #35's conversion.
  {
    file: 'features/reader/components/complete/EpisodeReactions.tsx',
    literal: 'text-gray-500',
    reason: 'static eyebrow label, pre-existing, never a darkMode ternary',
  },
  {
    file: 'features/reader/components/complete/ReaderCompleteCard.tsx',
    literal: 'text-gray-500',
    reason: 'static eyebrow label, pre-existing, never a darkMode ternary',
  },
  {
    file: 'features/reader/components/complete/CreatorNote.tsx',
    literal: 'text-gray-500',
    reason: 'static eyebrow label, pre-existing, never a darkMode ternary',
  },
  {
    file: 'features/reader/components/complete/NextUpRow.tsx',
    literal: 'text-gray-500',
    reason:
      'static eyebrow label + locked/waiting meta text, pre-existing, never a darkMode ternary',
  },

  // CompleteComments.tsx — the comment-composer textarea's fill. `bg-surface-nested` (Task
  // 5's first pass) matched its own container 1:1 in light mode (gray-50 on gray-50), a
  // real regression: the container and the input inside it became visually
  // indistinguishable. No existing token holds "white in light, white/5 in immersive" —
  // that pair is `--color-surface-nested`'s exact immersive value but not its light one —
  // and this is the only Reader site that needs it, so it stays a literal `darkMode`
  // ternary rather than a thirteenth token (see the design note's "The comment composer's
  // textarea fill" section for the full reasoning).
  {
    file: 'features/reader/components/complete/CompleteComments.tsx',
    literal: 'bg-white',
    reason: 'input-fill ternary, light branch, one-off (Task 5 review)',
  },
  {
    file: 'features/reader/components/complete/CompleteComments.tsx',
    literal: 'bg-white/5',
    reason: 'input-fill ternary, immersive branch, one-off (Task 5 review)',
  },

  // WebtoonDetailPage.tsx hub hero — decorative glass chrome. Task 3 checked each of
  // these against the token table on role (hover/pressed fill vs. static badge), not
  // just on value, and rejected all of them; none is a canvas/surface/ink/edge site.
  {
    file: HERO_FILE,
    literal: 'ring-white',
    reason: 'fixed accessibility focus ring, not a token (Task 3)',
  },
  {
    file: HERO_FILE,
    literal: 'bg-white/20',
    reason: 'static avatar/pill chrome, not a hover or pressed fill (Task 3)',
  },
  {
    file: HERO_FILE,
    literal: 'text-white/40',
    reason: 'divider glyph, no token opacity step matches (Task 3)',
  },
  {
    file: HERO_FILE,
    literal: 'bg-white/10',
    reason: 'glassmorphic chip/stat-card chrome, not a hover or pressed fill (Task 3)',
  },
  {
    file: HERO_FILE,
    literal: 'text-white/90',
    reason: 'static genre-pill text, not a canvas/ink role (Task 3)',
  },
]

const readSource = (relativePath: string): string =>
  readFileSync(path.join(SRC, relativePath), 'utf8')

const heroSlice = (): string => {
  const full = readSource(HERO_FILE)
  const start = full.indexOf(HERO_START_MARKER)
  const end = full.indexOf(HERO_END_MARKER)
  expect(start).toBeGreaterThan(-1)
  expect(end).toBeGreaterThan(start)
  return full.slice(start, end)
}

const unexpectedLiterals = (file: string, source: string): string[] => {
  const allowed = new Set(
    EXCEPTIONS.filter((exception) => exception.file === file).map((exception) => exception.literal)
  )
  return [...source.matchAll(COLOR_LITERAL)]
    .map((match) => match[0])
    .filter((literal) => !allowed.has(literal))
}

describe('immersive conversion sweep', () => {
  it('leaves no unconverted dark literal in the Reader chrome files', () => {
    const violations = READER_FILES.flatMap((file) =>
      unexpectedLiterals(file, readSource(file)).map((literal) => `${file}: ${literal}`)
    )
    expect(violations).toEqual([])
  })

  it("leaves no unconverted dark literal in Webtoon Detail's hub hero", () => {
    expect(unexpectedLiterals(HERO_FILE, heroSlice())).toEqual([])
  })

  it('keeps every documented exception genuinely present, so the allowlist cannot go stale', () => {
    for (const exception of EXCEPTIONS) {
      const source = exception.file === HERO_FILE ? heroSlice() : readSource(exception.file)
      expect(source).toContain(exception.literal)
    }
  })
})
