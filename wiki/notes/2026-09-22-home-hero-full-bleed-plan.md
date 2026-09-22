# Home hero full-bleed implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the Home hero backdrop rotate with the spotlight slide - sharp `keyArt` when a series has it, a blurred cover wash when it does not - and retire the Home hero book.

**Architecture:** A pure resolver decides which of three backdrops a slide gets. One `HeroBackdrop` component renders that decision and replaces `HeroBanner` at both call sites in `HeroSpotlight.tsx`. The book and its Home-only enter system are removed last, once the backdrop is proven.

**Tech Stack:** React 19, TypeScript, Tailwind v4, Vitest + React Testing Library.

**Design spec:** `wiki/notes/2026-09-22-home-hero-full-bleed-design.md`

## Global Constraints

- TDD is mandatory: write the failing test, run it, watch it fail, then implement.
- Source files under 800 lines; functions under 50 lines; nesting under 4 levels. No mutation.
- `font-bold` is banned on `text-xs`, `text-2xs` and any size at or under 12px outside the cover-overlay exception. `apps/portal/src/test/SmallTypeWeight.test.tsx` enforces it.
- New user-facing strings need keys in BOTH `apps/portal/src/lib/i18n/locales/en/translation.json` and `.../mm/translation.json`. `I18nSweep.test.tsx` enforces parity. This work should need none - say so if you find otherwise.
- The hero is Home's LCP element. Only the first slide's backdrop is eager with `fetchpriority="high"`; the rest are lazy.
- The hero must not enter the tab order. Keyboard reaches the hub through Start Reading.
- `prefers-reduced-motion: reduce` cuts the crossfade to an instant swap. Never slow it instead.
- Commit messages are conventional and end with exactly:
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- Run `pnpm check` before the final commit.

## Prerequisite

Targeted test runs use the portal's own binary:

```bash
apps/portal/node_modules/.bin/vitest run <path> --root apps/portal
```

If the worktree has no `node_modules`, run `pnpm install --frozen-lockfile` first.

## File structure

| File                                                                      | Responsibility                                        |
| ------------------------------------------------------------------------- | ----------------------------------------------------- |
| `packages/shared/src/types.ts`                                            | `keyArt?: string` on `Webtoon`                        |
| `apps/portal/src/lib/images/heroBackdrop.ts`                              | pure resolver: slide to backdrop kind                 |
| `apps/portal/src/features/home/components/HeroSpotlight/HeroBackdrop.tsx` | renders the resolved backdrop                         |
| `.../HeroSpotlight/HeroBanner.tsx`                                        | stays; becomes the `banner` branch's renderer         |
| `.../HeroSpotlight/HeroSpotlight.tsx`                                     | swaps `HeroBanner` for `HeroBackdrop`; loses the book |
| `apps/portal/src/index.css`                                               | `.hero-book-enter` rules deleted                      |
| `apps/portal/src/test/heroBackdrop.test.ts`                               | resolver unit tests                                   |
| `apps/portal/src/test/HeroSpotlight.test.tsx`                             | backdrop rotation, LCP, book removal                  |
| `wiki/conventions/hero-spotlight.md`                                      | the spec change                                       |
| `wiki/conventions/forced-product-motion.md`                               | drops the Home book enter                             |

---

### Task 1: The backdrop resolver

**Files:**

- Modify: `packages/shared/src/types.ts`
- Create: `apps/portal/src/lib/images/heroBackdrop.ts`
- Test: `apps/portal/src/test/heroBackdrop.test.ts`

**Interfaces:**

- Consumes: `Webtoon` from `@softgate/shared`.
- Produces:
  - `type HeroBackdrop = { kind: 'keyArt'; src: string } | { kind: 'cover'; src: string } | { kind: 'banner' }`
  - `heroBackdrop(slide: Webtoon | undefined): HeroBackdrop`

- [ ] **Step 1: Write the failing test**

Create `apps/portal/src/test/heroBackdrop.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import type { Webtoon } from '@softgate/shared'
import { heroBackdrop } from '../lib/images/heroBackdrop'

const slide = (over: Partial<Webtoon>): Webtoon => ({ id: '1', ...over }) as Webtoon

describe('hero backdrop', () => {
  it('prefers key art when the slide has it', () => {
    expect(heroBackdrop(slide({ keyArt: '/key/1.png', coverImage: '/c/1.png' }))).toEqual({
      kind: 'keyArt',
      src: '/key/1.png',
    })
  })

  it('falls back to the cover when there is no key art', () => {
    expect(heroBackdrop(slide({ coverImage: '/c/1.png' }))).toEqual({
      kind: 'cover',
      src: '/c/1.png',
    })
  })

  it('falls back to the banner when the slide has neither', () => {
    expect(heroBackdrop(slide({}))).toEqual({ kind: 'banner' })
  })

  it('falls back to the banner when there is no slide at all', () => {
    expect(heroBackdrop(undefined)).toEqual({ kind: 'banner' })
  })

  it('treats an empty string as absent rather than a usable src', () => {
    expect(heroBackdrop(slide({ keyArt: '', coverImage: '/c/1.png' }))).toEqual({
      kind: 'cover',
      src: '/c/1.png',
    })
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/heroBackdrop.test.ts --root apps/portal
```

Expected: FAIL - the module does not exist.

- [ ] **Step 3: Implement**

Add to the `Webtoon` interface in `packages/shared/src/types.ts`, directly beneath `coverImage?: string`:

```ts
  /** Landscape hero art, >= 1600x600, focal point right. Falls back to a blurred
   *  `coverImage` wash when absent - see wiki/conventions/hero-spotlight.md. */
  keyArt?: string
```

Create `apps/portal/src/lib/images/heroBackdrop.ts`:

```ts
import type { Webtoon } from '@softgate/shared'

export type HeroBackdrop =
  { kind: 'keyArt'; src: string } | { kind: 'cover'; src: string } | { kind: 'banner' }

/**
 * The Home hero backdrop rotates with the slide (Impl 39). Landscape `keyArt` renders
 * sharp; a slide with only a portrait `coverImage` renders as a blurred wash, because
 * cover sources are 1024px square and stretching one across the hero is visibly soft.
 */
export function heroBackdrop(slide: Webtoon | undefined): HeroBackdrop {
  if (slide?.keyArt) return { kind: 'keyArt', src: slide.keyArt }
  if (slide?.coverImage) return { kind: 'cover', src: slide.coverImage }
  return { kind: 'banner' }
}
```

- [ ] **Step 4: Run the test and watch it pass**

```bash
apps/portal/node_modules/.bin/vitest run src/test/heroBackdrop.test.ts --root apps/portal
```

Expected: PASS, 5 tests.

- [ ] **Step 5: Commit**

```bash
git add packages/shared/src/types.ts apps/portal/src/lib/images/heroBackdrop.ts apps/portal/src/test/heroBackdrop.test.ts
git commit -m "feat: add the Home hero backdrop resolver (#39)

Issue #39. Three-step resolution - landscape keyArt sharp, portrait coverImage as a
blurred wash, banner when a slide has neither. The cover step exists because the
landscape art this pattern wants does not exist yet and cover sources are 1024px
square; blurring hides the upscale until real art lands.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: The backdrop component

**Files:**

- Create: `apps/portal/src/features/home/components/HeroSpotlight/HeroBackdrop.tsx`
- Modify: `apps/portal/src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- Modify: `apps/portal/src/test/HeroSpotlight.test.tsx`

**Interfaces:**

- Consumes: `heroBackdrop` from Task 1; `coverSources(coverImage: string | undefined): ResponsiveSources | null` and `bannerSources(): ResponsiveSources` from `apps/portal/src/lib/images/responsiveImage`; the existing `HeroBanner` component.
- Produces: `HeroBackdrop`, default export, props `{ slide?: Webtoon; priority: boolean }`.

- [ ] **Step 1: Write the failing test**

Append to `apps/portal/src/test/HeroSpotlight.test.tsx`. Read the file's existing render helper first and reuse it - do not write a second one.

```tsx
describe('hero backdrop', () => {
  it('paints the first slide cover as the backdrop, eager and high priority', () => {
    const { container } = renderHero()
    const backdrop = container.querySelector('[data-testid="hero-backdrop"] img')
    expect(backdrop).toBeInTheDocument()
    expect(backdrop).toHaveAttribute('fetchpriority', 'high')
    expect(backdrop).not.toHaveAttribute('loading', 'lazy')
  })

  it('keeps banner chrome when there are no slides', () => {
    const { container } = renderHero([])
    expect(container.querySelector('[data-testid="hero-backdrop-banner"]')).toBeInTheDocument()
  })
})
```

`renderHero` is this file's existing helper; check its signature and how it passes slides before writing the second test.

- [ ] **Step 2: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/HeroSpotlight.test.tsx --root apps/portal
```

Expected: FAIL - no `hero-backdrop` testid.

- [ ] **Step 3: Implement the component**

Create `HeroBackdrop.tsx`:

```tsx
import type { Webtoon } from '@softgate/shared'
import { heroBackdrop } from '../../../../lib/images/heroBackdrop'
import { coverSources } from '../../../../lib/images/responsiveImage'
import HeroBanner from './HeroBanner'

export interface HeroBackdropProps {
  slide?: Webtoon
  /** True only for the first slide: this is Home's LCP element. */
  priority: boolean
}

const HeroBackdrop = ({ slide, priority }: HeroBackdropProps) => {
  const backdrop = heroBackdrop(slide)

  if (backdrop.kind === 'banner') {
    return (
      <div data-testid="hero-backdrop-banner" className="absolute inset-0">
        <HeroBanner />
      </div>
    )
  }

  const sources = coverSources(backdrop.src)
  const blurred = backdrop.kind === 'cover'

  return (
    <div
      data-testid="hero-backdrop"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-gray-950"
      aria-hidden="true"
    >
      <picture>
        {sources ? <source type="image/avif" srcSet={sources.avif} sizes="100vw" /> : null}
        {sources ? <source type="image/webp" srcSet={sources.webp} sizes="100vw" /> : null}
        <img
          src={sources ? sources.fallback : backdrop.src}
          alt=""
          decoding="async"
          loading={priority ? undefined : 'lazy'}
          {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
          className={`h-full w-full object-cover ${
            blurred ? 'scale-110 object-center opacity-45 blur-[60px]' : 'object-right'
          }`}
        />
      </picture>
    </div>
  )
}

export default HeroBackdrop
```

`scale-110` exists so the blur does not reveal transparent edges where the filter samples past the image bounds.

- [ ] **Step 4: Swap it in at both call sites**

In `HeroSpotlight.tsx`, replace `<HeroBanner />` with `<HeroBackdrop slide={current} priority={index === 0} />` in the slide branch, and with `<HeroBackdrop priority />` in the `if (!current)` branch. Drop the now-unused `HeroBanner` import from that file - `HeroBackdrop` owns it. Leave the existing scrim `div` beneath it exactly as it is; it is the desktop left-to-right scrim the design keeps.

- [ ] **Step 5: Run the tests and watch them pass**

```bash
apps/portal/node_modules/.bin/vitest run src/test/HeroSpotlight.test.tsx src/test/HomePage.test.tsx --root apps/portal
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/portal/src
git commit -m "feat: rotate the Home hero backdrop with the slide (#39)

Issue #39. The backdrop is now per-slide rather than the static banner, reversing
hero-spotlight.md's old rule. Only the first slide is eager and high priority, because
the hero backdrop is Home's LCP element.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Crossfade, cut under reduced motion

**Files:**

- Modify: `apps/portal/src/features/home/components/HeroSpotlight/HeroBackdrop.tsx`
- Modify: `apps/portal/src/test/HeroSpotlight.test.tsx`

**Interfaces:**

- Consumes: `HeroBackdrop` from Task 2.
- Produces: no new exports. `HeroBackdropProps` gains `reducedMotion: boolean`.

- [ ] **Step 1: Write the failing test**

`HeroSpotlight.tsx` already tracks `prefersReducedMotion` in state - read how it is set before writing this, and drive the test through the same `matchMedia` mock the file's existing reduced-motion tests use.

```tsx
it('cuts the backdrop crossfade under reduced motion', () => {
  const { container } = renderHeroReducedMotion()
  const backdrop = container.querySelector('[data-testid="hero-backdrop"]')
  expect(backdrop?.className).not.toMatch(/transition/)
})

it('crossfades the backdrop when motion is allowed', () => {
  const { container } = renderHero()
  const backdrop = container.querySelector('[data-testid="hero-backdrop"]')
  expect(backdrop?.className).toMatch(/duration-400/)
})
```

Name the helper to match whatever the file already uses for its reduced-motion cases.

- [ ] **Step 2: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/HeroSpotlight.test.tsx --root apps/portal
```

Expected: FAIL - no transition classes either way.

- [ ] **Step 3: Implement**

Give the backdrop wrapper a `key={backdrop.kind === 'banner' ? 'banner' : backdrop.src}` so React swaps the element per slide, and apply the fade:

```tsx
className={`pointer-events-none absolute inset-0 overflow-hidden bg-gray-950 ${
  reducedMotion ? '' : 'transition-opacity duration-400'
}`}
```

Add `duration-400` to the theme if Tailwind does not emit it - check `apps/portal/src/index.css` for the existing duration scale before inventing a token, and prefer an existing step if one is already 400ms.

Pass `reducedMotion={prefersReducedMotion}` from `HeroSpotlight.tsx` at both call sites.

- [ ] **Step 4: Run the tests and watch them pass**

```bash
apps/portal/node_modules/.bin/vitest run src/test/HeroSpotlight.test.tsx --root apps/portal
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/portal/src
git commit -m "feat: crossfade the Home hero backdrop between slides (#39)

Issue #39. 400ms crossfade, cut to an instant swap under prefers-reduced-motion rather
than slowed.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Retire the Home hero book

**Files:**

- Modify: `apps/portal/src/features/home/components/HeroSpotlight/HeroSpotlight.tsx`
- Modify: `apps/portal/src/index.css`
- Modify: `apps/portal/src/test/HeroSpotlight.test.tsx`

**Interfaces:**

- Consumes: nothing new.
- Produces: nothing. This task only removes.

- [ ] **Step 1: Find every Home-only book reference**

```bash
grep -n "hero-book" apps/portal/src/index.css
grep -rn "hero-book-enter" apps/portal/src
```

`.hero-book-enter` and its axis-switch rules are Home-only and go. `.hero-book-scene`, `.hero-book`, `.hero-book-motion` and the hover-straighten rules are shared with the detail page and **stay**. If a rule's selector mixes both, split it rather than deleting the shared half. List what you plan to delete in your report before deleting it.

- [ ] **Step 2: Delete the book's tests, watch the suite go red where it should**

Remove the enter-shell structure assertions in `apps/portal/src/test/HeroSpotlight.test.tsx` - around lines 272-293, which assert `.hero-book-enter` wraps `.hero-book-scene`. The assertions at the file's earlier `hero-book-cover-link` cases need judgement: the ones asserting the book is **absent** in empty and load-fail states become vacuous once the book is gone from Home entirely. Replace each with an assertion about the backdrop that state should now show, rather than deleting it and leaving the state uncovered.

- [ ] **Step 3: Remove the render and the CSS**

In `HeroSpotlight.tsx`, delete the `<div className="relative z-0 mx-auto block w-56 ...">` wrapper and the `<HeroBook3D ... />` inside it, and drop the `HeroBook3D` import. Then delete the `.hero-book-enter` rules from `index.css`.

Do not touch `apps/portal/src/components/HeroBook3D/` - the detail page renders it.

- [ ] **Step 4: Run the suite**

```bash
apps/portal/node_modules/.bin/vitest run src/test/HeroSpotlight.test.tsx src/test/HomePage.test.tsx src/test/WebtoonDetailHub.test.tsx src/test/AboutPage.test.tsx --root apps/portal
```

Expected: PASS. `WebtoonDetailHub` and `AboutPage` are in this list because they exercise the book that must survive - if either breaks, a shared rule was deleted.

- [ ] **Step 5: Commit**

```bash
git add apps/portal/src
git commit -m "refactor: retire the Home hero book and its enter animation (#39)

Issue #39. A full-bleed backdrop with copy over a scrim leaves nowhere for the 3D book,
so Home stops rendering it and the Home-only .hero-book-enter system goes with it rather
than staying as rules describing a render that no longer happens. The detail page keeps
the book and its hover-straighten.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Update the conventions and verify

**Files:**

- Modify: `wiki/conventions/hero-spotlight.md`
- Modify: `wiki/conventions/forced-product-motion.md`

- [ ] **Step 1: Rewrite the Content rule**

In `hero-spotlight.md`, replace:

> Static SoftGate `/banner/banner.png` + gradient - background does **not** rotate.

with a rule describing the three-step resolution from the design spec: `keyArt` sharp with the focal point right, `coverImage` as a `blur(60px)` wash at 45% opacity, banner when a slide has neither. Keep the sentences either side about Home loading and empty slides - they still hold, because those states have no slide and so resolve to the banner.

Update the "Rotating layer" line to read title, deck, Start Reading / Save, backdrop.

- [ ] **Step 2: Remove the retired motion rules**

Delete the Impl 83 / 84 / 86 / 99 bullets from the Motion section - they describe the Home enter and nothing else. **Keep** Impl 52, Impl 88 / 90 / 92 / 99 and Impl 182: those constrain `HeroBook3D` wherever it renders, and the detail page still renders it.

Update `forced-product-motion.md` wherever it describes the Home book enter, so no convention describes a render that no longer happens. Read it first; change only what this work invalidates.

- [ ] **Step 3: Run the whole check**

```bash
pnpm check
```

Expected: lint, format, all tests and both builds pass. If it fails on `imageVariants.test.ts` about missing generated `.avif`/`.webp` variants, that is a known build-ordering race - run `pnpm run generate:images` and rerun.

- [ ] **Step 4: Commit**

```bash
git add wiki/conventions
git commit -m "docs: hero-spotlight.md now says the backdrop rotates (#39)

Issue #39. The convention said the background does not rotate; it now describes the
three-step backdrop resolution and drops the Home-only book enter bullets.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Self-review

**Spec coverage.** `keyArt` field and three-step resolution - Task 1. Blurred cover treatment at the spec's opacity and blur - Task 2. LCP rule, first slide only - Task 2. Crossfade and the reduced-motion cut - Task 3. Book and enter-CSS removal - Task 4. Both convention files - Task 5. The design's "hero is pointer-only to the hub" is **already true** in the shipped code via `coverTabbable={false}` on the book; with the book gone, Task 4's report must state whether any pointer path to the hub survives, because the design assumes one does.

**Type consistency.** `HeroBackdrop` is both the resolver's return type (Task 1, in `lib/images/heroBackdrop.ts`) and the component name (Task 2, in the HeroSpotlight folder). They live in different modules and are imported under different names at the use site - if that reads badly in practice, rename the component to `HeroBackdropLayer` and say so.

**Known risk.** Task 4 deletes CSS whose selectors are shared with the detail page. Step 1 requires listing the deletions before making them, and Step 4 runs the detail and About suites as the guard.
