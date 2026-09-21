# Reader end-of-episode card implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the in-flow end-of-episode card for issue #42 — reactions, an episode thumb and access state on next-up, an inline comments composer, related x3, and Back to series always visible.

**Architecture:** `ReaderCompletePortal.tsx` splits into `features/reader/components/complete/`, one file per block, with a thin shell that owns only the block order. Reaction storage is a pure module in `lib/reader/`, mirroring `episodeReports.ts`. No new API surface: everything is device-local or already wired through `ReaderPage`.

**Tech Stack:** React 19, TypeScript, Tailwind v4, react-i18next, react-router-dom, Vitest + React Testing Library.

**Design spec:** `wiki/notes/2026-09-22-reader-end-of-episode-card-design.md`

## Global Constraints

- TDD is mandatory: write the failing test, run it, watch it fail, then implement. Never write implementation first.
- Source files stay under 800 lines; functions under 50 lines; nesting under 4 levels.
- No mutation. Build new objects and arrays rather than editing in place.
- `font-bold` is banned on `text-xs`, `text-2xs` and any size at or under 12px outside the cover-overlay exception — `wiki/conventions/type-weight-scale.md`. Eyebrows and labels use `font-semibold`. `apps/portal/src/test/SmallTypeWeight.test.tsx` enforces this and will fail the build otherwise.
- Every new i18n key must exist in **both** `apps/portal/src/lib/i18n/locales/en/translation.json` and `.../mm/translation.json`. `apps/portal/src/test/I18nSweep.test.tsx` enforces parity.
- Every interactive control clears the 44pt touch floor (`min-h-11`).
- The reader server-renders. Never read `localStorage` in a `useState` initializer — initialize to the empty value and hydrate in `useEffect`, or the server and client passes disagree.
- Commit messages are conventional (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`) and end with `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`.
- Run `pnpm check` before the final commit of the branch.

## Prerequisite

This worktree has no `node_modules`. Before Task 1:

```bash
pnpm install --frozen-lockfile
```

Targeted test runs in this plan use the portal's own binary:

```bash
apps/portal/node_modules/.bin/vitest run <path> --root apps/portal
```

## File structure

| File                                                                         | Responsibility                              |
| ---------------------------------------------------------------------------- | ------------------------------------------- |
| `apps/portal/src/lib/reader/reactions.ts`                                    | pure reaction storage and count seed        |
| `apps/portal/src/lib/reader/index.ts`                                        | re-export the new module                    |
| `apps/portal/src/features/reader/components/complete/ReaderCompleteCard.tsx` | shell, block order, shared dark-mode tokens |
| `.../complete/EpisodeReactions.tsx`                                          | emoji row                                   |
| `.../complete/NextUpRow.tsx`                                                 | thumb, access state, navigation             |
| `.../complete/CompleteComments.tsx`                                          | teaser plus composer                        |
| `.../complete/RelatedList.tsx`                                               | related x3                                  |
| `.../complete/EndOfSeries.tsx`                                               | existing end-of-series block, moved         |
| `.../complete/ReportControl.tsx`                                             | existing report states, moved               |
| `apps/portal/src/features/reader/components/ReaderCompletePortal.tsx`        | thin re-export of the card                  |
| `apps/portal/src/test/readerReactions.test.ts`                               | reaction helper unit tests                  |
| `apps/portal/src/test/ReaderCompleteCard.test.tsx`                           | rendered card behaviour                     |
| `wiki/conventions/reader-chrome.md`                                          | chapter-end section updated                 |

---

### Task 1: Split the card into `complete/` with no behaviour change

Pure move. The existing reader tests are the proof that nothing changed.

**Files:**

- Create: `apps/portal/src/features/reader/components/complete/ReaderCompleteCard.tsx`
- Create: `apps/portal/src/features/reader/components/complete/EndOfSeries.tsx`
- Create: `apps/portal/src/features/reader/components/complete/ReportControl.tsx`
- Create: `apps/portal/src/features/reader/components/complete/RelatedList.tsx`
- Modify: `apps/portal/src/features/reader/components/ReaderCompletePortal.tsx` (becomes a re-export)

**Interfaces:**

- Consumes: nothing from earlier tasks.
- Produces: `ReaderCompleteCard`, default export, taking exactly the `ReaderCompletePortalProps` that `ReaderCompletePortal` takes today. `EndOfSeries`, `ReportControl` and `RelatedList` are internal to `complete/`.

- [ ] **Step 1: Capture the current behaviour as the baseline**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderChrome.test.tsx src/test/ReaderGuestNudge.test.tsx src/test/ReaderCelebration.test.tsx src/test/ReaderCommentsPanel.test.tsx --root apps/portal
```

Expected: PASS. If it fails here, stop — the branch is broken before your change.

- [ ] **Step 2: Move the end-of-series branch into its own file**

Create `complete/EndOfSeries.tsx` holding the `data-testid="reader-end-of-series"` block exactly as it appears in `ReaderCompletePortal.tsx` today, with this prop type:

```tsx
import { useTranslation } from 'react-i18next'
import type { Episode } from '@softgate/shared'
import Button, { ButtonLink } from '../../../../components/Button'
import UpcomingDropMeta from '../../../../components/UpcomingDropMeta'

export type EndOfSeriesProps = {
  darkMode: boolean
  lang: 'mm' | 'en'
  nextDrop?: Episode
  now: number
  seriesHref: string
  isSubscribed: boolean
  onSubscribe: () => void
  nested: string
  muted: string
  onStop: (e: { stopPropagation: () => void }) => void
}
```

Keep the JSX identical — same classes, same `data-testid`, same translation keys.

- [ ] **Step 3: Move the report control into its own file**

Create `complete/ReportControl.tsx` with the `reported` / `reportConfirm` / default three-way branch exactly as written today:

```tsx
export type ReportControlProps = {
  reported: boolean
  reportConfirm: boolean
  onAskReport: () => void
  onCancelReport: () => void
  onConfirmReport: () => void
  nested: string
  muted: string
}
```

- [ ] **Step 4: Move the related list into its own file**

Create `complete/RelatedList.tsx` with the existing `<ul>` of related links, unchanged, behind:

```tsx
export type RelatedListProps = {
  related: Webtoon[]
  lang: 'mm' | 'en'
  nested: string
  titleClass: string
}
```

Do **not** change the cap or the render condition in this task — that is Task 6.

- [ ] **Step 5: Create the shell and re-export**

`complete/ReaderCompleteCard.tsx` holds the wrapper `<div onClick={stop}>`, the heading, the shared `cardBg` / `muted` / `nested` / `titleClass` strings, and renders the blocks in today's order using the three new components. `ReaderCompletePortal.tsx` becomes:

```tsx
export { default } from './complete/ReaderCompleteCard'
export type { ReaderCompletePortalProps } from './complete/ReaderCompleteCard'
```

- [ ] **Step 6: Prove nothing changed**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderChrome.test.tsx src/test/ReaderGuestNudge.test.tsx src/test/ReaderCelebration.test.tsx src/test/ReaderCommentsPanel.test.tsx src/test/SmallTypeWeight.test.tsx --root apps/portal
```

Expected: PASS, same count as Step 1.

- [ ] **Step 7: Commit**

```bash
git add apps/portal/src/features/reader/components
git commit -m "refactor: split the reader complete card into one file per block

Pure move ahead of issue #42. The card is about to gain reactions, a composer and
access states, and at 234 lines in one file that lands well past the 800-line
ceiling. No behaviour change: the existing reader tests are the proof.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: Reaction storage helpers

**Files:**

- Create: `apps/portal/src/lib/reader/reactions.ts`
- Modify: `apps/portal/src/lib/reader/index.ts`
- Test: `apps/portal/src/test/readerReactions.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces:
  - `REACTIONS: readonly Reaction[]` — the five emoji in display order
  - `type Reaction = (typeof REACTIONS)[number]`
  - `EPISODE_REACTIONS_KEY: 'softgate_episode_reactions_v1'`
  - `episodeReactionKey(webtoonId: string, episodeNumber: number): string`
  - `readReaction(webtoonId: string, episodeNumber: number): Reaction | undefined`
  - `toggleReaction(webtoonId: string, episodeNumber: number, reaction: Reaction): Reaction | undefined` — returns the new pick, `undefined` when cleared
  - `reactionCount(webtoonId: string, episodeNumber: number, reaction: Reaction, picked: boolean): number`

- [ ] **Step 1: Write the failing test**

Create `apps/portal/src/test/readerReactions.test.ts`. The `installStorage` helper is copied from `src/test/episodeReports.test.ts`, the established pattern in this repo:

```ts
import { describe, expect, it, beforeEach } from 'vitest'
import {
  EPISODE_REACTIONS_KEY,
  REACTIONS,
  reactionCount,
  readReaction,
  toggleReaction,
} from '../lib/reader'

const store = new Map<string, string>()

function installStorage() {
  store.clear()
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value)
      },
      removeItem: (key: string) => {
        store.delete(key)
      },
      clear: () => store.clear(),
      length: 0,
      key: () => null,
    },
  })
}

describe('episode reactions', () => {
  beforeEach(() => {
    installStorage()
  })

  it('starts with no pick and stores one per episode', () => {
    expect(readReaction('1', 1)).toBeUndefined()
    expect(toggleReaction('1', 1, '🔥')).toBe('🔥')
    expect(readReaction('1', 1)).toBe('🔥')
    expect(readReaction('1', 2)).toBeUndefined()
  })

  it('replaces the pick rather than accumulating', () => {
    toggleReaction('1', 1, '🔥')
    expect(toggleReaction('1', 1, '😭')).toBe('😭')
    expect(readReaction('1', 1)).toBe('😭')
  })

  it('clears the pick when the same reaction is chosen again', () => {
    toggleReaction('1', 1, '🔥')
    expect(toggleReaction('1', 1, '🔥')).toBeUndefined()
    expect(readReaction('1', 1)).toBeUndefined()
  })

  it('persists with the schema version', () => {
    toggleReaction('1', 1, '😂')
    const raw = JSON.parse(store.get(EPISODE_REACTIONS_KEY) ?? '{}') as {
      schemaVersion: number
      picks: Record<string, string>
    }
    expect(raw.schemaVersion).toBe(1)
    expect(raw.picks).toEqual({ '1:1': '😂' })
  })

  it('reads a corrupt payload as no picks', () => {
    store.set(EPISODE_REACTIONS_KEY, 'not json')
    expect(readReaction('1', 1)).toBeUndefined()
    store.set(EPISODE_REACTIONS_KEY, JSON.stringify({ schemaVersion: 99, picks: { '1:1': '🔥' } }))
    expect(readReaction('1', 1)).toBeUndefined()
  })

  it('gives every reaction a stable Demo count inside the published range', () => {
    for (const reaction of REACTIONS) {
      const first = reactionCount('1', 1, reaction, false)
      expect(first).toBe(reactionCount('1', 1, reaction, false))
      expect(first).toBeGreaterThanOrEqual(12)
      expect(first).toBeLessThanOrEqual(480)
    }
  })

  it('adds the reader own pick to the count', () => {
    const base = reactionCount('1', 1, '🔥', false)
    expect(reactionCount('1', 1, '🔥', true)).toBe(base + 1)
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/readerReactions.test.ts --root apps/portal
```

Expected: FAIL — `readReaction` and friends are not exported from `../lib/reader`.

- [ ] **Step 3: Implement the module**

Create `apps/portal/src/lib/reader/reactions.ts`:

```ts
export const EPISODE_REACTIONS_KEY = 'softgate_episode_reactions_v1'
export const EPISODE_REACTIONS_SCHEMA = 1 as const

/** Fixed set, in display order. A constant rather than a prop so a stored pick keeps
 *  meaning across episodes. */
export const REACTIONS = ['😍', '😭', '😂', '😱', '🔥'] as const
export type Reaction = (typeof REACTIONS)[number]

type ReactionStore = {
  schemaVersion: typeof EPISODE_REACTIONS_SCHEMA
  picks: Record<string, Reaction>
}

const COUNT_MIN = 12
const COUNT_SPAN = 469

function emptyStore(): ReactionStore {
  return { schemaVersion: EPISODE_REACTIONS_SCHEMA, picks: {} }
}

export function episodeReactionKey(webtoonId: string, episodeNumber: number): string {
  return `${webtoonId}:${episodeNumber}`
}

function isReaction(value: unknown): value is Reaction {
  return typeof value === 'string' && (REACTIONS as readonly string[]).includes(value)
}

function readStore(): ReactionStore {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = window.localStorage.getItem(EPISODE_REACTIONS_KEY)
    if (!raw) return emptyStore()
    const parsed = JSON.parse(raw) as unknown
    if (!parsed || typeof parsed !== 'object') return emptyStore()
    const obj = parsed as Partial<ReactionStore>
    if (obj.schemaVersion !== EPISODE_REACTIONS_SCHEMA || !obj.picks) return emptyStore()
    const picks: Record<string, Reaction> = {}
    for (const [key, value] of Object.entries(obj.picks)) {
      if (isReaction(value)) picks[key] = value
    }
    return { schemaVersion: EPISODE_REACTIONS_SCHEMA, picks }
  } catch {
    return emptyStore()
  }
}

function writeStore(store: ReactionStore): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(EPISODE_REACTIONS_KEY, JSON.stringify(store))
}

export function readReaction(webtoonId: string, episodeNumber: number): Reaction | undefined {
  return readStore().picks[episodeReactionKey(webtoonId, episodeNumber)]
}

export function toggleReaction(
  webtoonId: string,
  episodeNumber: number,
  reaction: Reaction
): Reaction | undefined {
  const key = episodeReactionKey(webtoonId, episodeNumber)
  const store = readStore()
  const cleared = store.picks[key] === reaction
  const picks = { ...store.picks }
  if (cleared) {
    delete picks[key]
  } else {
    picks[key] = reaction
  }
  writeStore({ schemaVersion: EPISODE_REACTIONS_SCHEMA, picks })
  return cleared ? undefined : reaction
}

/** FNV-1a. The reader server-renders, so the Demo count has to be a pure function of the
 *  episode and emoji — a random seed would differ between the server and client passes
 *  and produce a hydration mismatch. */
function hash(value: string): number {
  let h = 2166136261
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function reactionCount(
  webtoonId: string,
  episodeNumber: number,
  reaction: Reaction,
  picked: boolean
): number {
  const seed = hash(`${webtoonId}:${episodeNumber}:${reaction}`)
  return COUNT_MIN + (seed % COUNT_SPAN) + (picked ? 1 : 0)
}
```

Append to `apps/portal/src/lib/reader/index.ts`:

```ts
export {
  EPISODE_REACTIONS_KEY,
  EPISODE_REACTIONS_SCHEMA,
  REACTIONS,
  episodeReactionKey,
  reactionCount,
  readReaction,
  toggleReaction,
  type Reaction,
} from './reactions'
```

- [ ] **Step 4: Run the test and watch it pass**

```bash
apps/portal/node_modules/.bin/vitest run src/test/readerReactions.test.ts --root apps/portal
```

Expected: PASS, 7 tests.

- [ ] **Step 5: Commit**

```bash
git add apps/portal/src/lib/reader apps/portal/src/test/readerReactions.test.ts
git commit -m "feat: add device-local episode reaction storage

Issue #42. One pick per episode, cleared by choosing it again, in
softgate_episode_reactions_v1 — the same device-local family as episode reports, no
API. Counts are an FNV-1a seed of (webtoonId, episodeNumber, emoji) folded into
12-480: the reader server-renders, so a random Demo count would differ between the
server and client passes and break hydration.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Reactions row in the card

**Files:**

- Create: `apps/portal/src/features/reader/components/complete/EpisodeReactions.tsx`
- Modify: `apps/portal/src/features/reader/components/complete/ReaderCompleteCard.tsx`
- Modify: `apps/portal/src/lib/i18n/locales/en/translation.json`
- Modify: `apps/portal/src/lib/i18n/locales/mm/translation.json`
- Test: `apps/portal/src/test/ReaderCompleteCard.test.tsx`

**Interfaces:**

- Consumes: `REACTIONS`, `Reaction`, `readReaction`, `toggleReaction`, `reactionCount` from Task 2.
- Produces: `EpisodeReactions`, default export, props `{ webtoonId: string; episodeNumber: number; darkMode: boolean; nested: string }`.

- [ ] **Step 1: Write the failing test**

Create `apps/portal/src/test/ReaderCompleteCard.test.tsx`. The provider stack is copied from `src/test/ReaderGuestNudge.test.tsx`, which is how reader surfaces are tested in this repo. `/read/1/1` is the demo episode with four panels.

```tsx
import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from '../context/AuthContext'
import { DataProvider } from '../context/DataContext'
import { SettingsProvider } from '../context/SettingsContext'
import { LibraryProvider } from '../context/LibraryContext'
import { WalletProvider } from '../context/WalletContext'
import { EngagementProvider } from '../context/EngagementContext'
import ReaderPage from '../features/reader/ReaderPage'

const renderReader = (path: string) =>
  render(
    <HelmetProvider>
      <DataProvider>
        <MemoryRouter initialEntries={[path]}>
          <SettingsProvider>
            <AuthProvider>
              <LibraryProvider>
                <WalletProvider>
                  <EngagementProvider>
                    <Routes>
                      <Route path="/read/:webtoonId/:episodeNumber" element={<ReaderPage />} />
                    </Routes>
                  </EngagementProvider>
                </WalletProvider>
              </LibraryProvider>
            </AuthProvider>
          </SettingsProvider>
        </MemoryRouter>
      </DataProvider>
    </HelmetProvider>
  )

afterEach(() => {
  vi.mocked(window.localStorage.getItem).mockImplementation(() => null)
})

describe('reader reactions', () => {
  it('offers every reaction with a Demo count', async () => {
    renderReader('/read/1/1')
    const row = await screen.findByTestId('reader-reactions')
    expect(row).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Love it' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles a reaction on and back off', async () => {
    const user = userEvent.setup()
    renderReader('/read/1/1')
    const fire = await screen.findByRole('button', { name: 'Fire' })
    await user.click(fire)
    expect(screen.getByRole('button', { name: 'Fire' })).toHaveAttribute('aria-pressed', 'true')
    await user.click(screen.getByRole('button', { name: 'Fire' }))
    expect(screen.getByRole('button', { name: 'Fire' })).toHaveAttribute('aria-pressed', 'false')
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderCompleteCard.test.tsx --root apps/portal
```

Expected: FAIL — no element with `data-testid="reader-reactions"`.

- [ ] **Step 3: Add the translation keys**

In `en/translation.json`, inside the `readerPage` object:

```json
"reactions": "Reactions",
"reactionLove": "Love it",
"reactionSad": "Made me cry",
"reactionFunny": "Made me laugh",
"reactionShock": "Shocking",
"reactionFire": "Fire"
```

In `mm/translation.json`, inside the same object:

```json
"reactions": "တုံ့ပြန်မှုများ",
"reactionLove": "အရမ်းကြိုက်တယ်",
"reactionSad": "ငိုချင်စရာ",
"reactionFunny": "ရယ်ရတယ်",
"reactionShock": "အံ့အားသင့်စရာ",
"reactionFire": "မီးလောင်နေတယ်"
```

- [ ] **Step 4: Implement the component**

Create `complete/EpisodeReactions.tsx`:

```tsx
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  REACTIONS,
  reactionCount,
  readReaction,
  toggleReaction,
  type Reaction,
} from '../../../../lib/reader'

const LABEL_KEY: Record<Reaction, string> = {
  '😍': 'readerPage.reactionLove',
  '😭': 'readerPage.reactionSad',
  '😂': 'readerPage.reactionFunny',
  '😱': 'readerPage.reactionShock',
  '🔥': 'readerPage.reactionFire',
}

export type EpisodeReactionsProps = {
  webtoonId: string
  episodeNumber: number
  darkMode: boolean
  nested: string
}

const EpisodeReactions = ({
  webtoonId,
  episodeNumber,
  darkMode,
  nested,
}: EpisodeReactionsProps) => {
  const { t } = useTranslation()
  // Never seed from localStorage: the reader server-renders and the server has no store.
  const [picked, setPicked] = useState<Reaction | undefined>(undefined)

  useEffect(() => {
    setPicked(readReaction(webtoonId, episodeNumber))
  }, [webtoonId, episodeNumber])

  return (
    <div
      data-testid="reader-reactions"
      className={`mt-6 w-full max-w-md rounded-2xl border p-4 text-left ${nested}`}
    >
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {t('readerPage.reactions')}
      </p>
      <ul className="flex flex-wrap gap-2">
        {REACTIONS.map((reaction) => {
          const isPicked = picked === reaction
          return (
            <li key={reaction}>
              <button
                type="button"
                aria-pressed={isPicked}
                aria-label={t(LABEL_KEY[reaction])}
                onClick={() => setPicked(toggleReaction(webtoonId, episodeNumber, reaction))}
                className={`flex min-h-11 items-center gap-1.5 rounded-2xl border px-3 text-sm transition-colors ${
                  isPicked
                    ? 'border-primary-500 text-primary-600'
                    : darkMode
                      ? 'border-white/10 text-gray-300'
                      : 'border-gray-200 text-gray-700'
                }`}
              >
                <span aria-hidden="true">{reaction}</span>
                <span className="text-xs font-semibold tabular-nums">
                  {reactionCount(webtoonId, episodeNumber, reaction, isPicked)}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
      <span className="text-primary-500 mt-2 inline-block text-xs font-semibold">
        {t('common.demo')}
      </span>
    </div>
  )
}

export default EpisodeReactions
```

Render it in `ReaderCompleteCard.tsx` directly after the `SeriesRatingControl` block:

```tsx
<EpisodeReactions
  webtoonId={webtoonId}
  episodeNumber={episodeNumber}
  darkMode={darkMode}
  nested={nested}
/>
```

`episodeNumber` is a new prop on the card. Add it to the props type and pass it from `ReaderPage.tsx` at the `<ReaderCompletePortal` call site as `episodeNumber={episodeNum}`.

- [ ] **Step 5: Run the tests and watch them pass**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderCompleteCard.test.tsx src/test/I18nSweep.test.tsx src/test/SmallTypeWeight.test.tsx --root apps/portal
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/portal/src
git commit -m "feat: add the episode reactions row to the reader complete card

Issue #42. Five fixed emoji with Demo counts, one pick per episode. The pick hydrates
in an effect rather than a useState initializer because the reader server-renders.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Next-up thumb and access state

**Files:**

- Create: `apps/portal/src/features/reader/components/complete/NextUpRow.tsx`
- Modify: `apps/portal/src/features/reader/components/complete/ReaderCompleteCard.tsx`
- Modify: `apps/portal/src/features/reader/ReaderPage.tsx` (call site only)
- Modify: `apps/portal/src/test/ReaderCompleteCard.test.tsx`

**Interfaces:**

- Consumes: `episodeThumbSrc`, `formatWaitFreeAt` and `hasWaitSchedule` from `lib/catalog`.
- Produces: `NextUpRow`, default export, props `{ episode?: Episode; episodeNumber: number; locked: boolean; seriesCover?: string; lang: 'mm' | 'en'; nested: string; titleClass: string; onNext: () => void }`.

- [ ] **Step 1: Confirm which demo episode is premium**

```bash
grep -n "isPremium" packages/shared/src/data.ts | head
```

Note the series and episode number whose _successor_ is premium. The test below assumes reading episode 2 of series 1 puts a premium episode in next-up. If that is not what the data says, use the path that does and say so in the commit message.

- [ ] **Step 2: Write the failing test**

Append to `src/test/ReaderCompleteCard.test.tsx`:

```tsx
describe('reader next-up', () => {
  it('shows the next episode with its thumb', async () => {
    renderReader('/read/1/1')
    const row = await screen.findByTestId('reader-next-up')
    expect(row.querySelector('img')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument()
  })

  it('marks a locked next episode and still routes to it', async () => {
    const user = userEvent.setup()
    renderReader('/read/1/2')
    const row = await screen.findByTestId('reader-next-up')
    expect(row).toHaveTextContent('Unlock this episode for')
    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(await screen.findByText('Premium Episode')).toBeInTheDocument()
  })
})
```

- [ ] **Step 3: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderCompleteCard.test.tsx --root apps/portal
```

Expected: FAIL — no `reader-next-up` testid.

- [ ] **Step 4: Implement the row**

Create `complete/NextUpRow.tsx`:

```tsx
import { Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { Episode } from '@softgate/shared'
import Button from '../../../../components/Button'
import { episodeThumbSrc, formatWaitFreeAt, hasWaitSchedule } from '../../../../lib/catalog'

export type NextUpRowProps = {
  episode?: Episode
  episodeNumber: number
  locked: boolean
  seriesCover?: string
  lang: 'mm' | 'en'
  nested: string
  titleClass: string
  onNext: () => void
}

const NextUpRow = ({
  episode,
  episodeNumber,
  locked,
  seriesCover,
  lang,
  nested,
  titleClass,
  onNext,
}: NextUpRowProps) => {
  const { t } = useTranslation()
  const thumb = episode ? episodeThumbSrc(episode, seriesCover) : seriesCover
  const waiting = episode && hasWaitSchedule(episode) && episode.freeAt

  return (
    <div data-testid="reader-next-up" className="mt-6 w-full max-w-md">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {t('readerPage.nextChapter')}
      </p>
      <div className={`flex items-center justify-between gap-3 rounded-2xl border p-4 ${nested}`}>
        <div className="flex min-w-0 items-center gap-3">
          {thumb ? (
            <img
              src={thumb}
              alt=""
              loading="lazy"
              decoding="async"
              className="aspect-[202/142] h-14 w-auto shrink-0 rounded-2xl object-cover"
            />
          ) : null}
          <div className="min-w-0 text-left">
            <span className="text-primary-500 block text-xs font-semibold">
              {t('readerPage.episodeN', { n: episodeNumber })}
            </span>
            <span className={`block truncate text-sm font-semibold ${titleClass}`}>
              {episode ? episode.title[lang] : ''}
            </span>
            {locked ? (
              <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-gray-500">
                <Lock className="h-3 w-3" aria-hidden="true" />
                {t('readerPage.unlockFor', { coins: episode?.coinPrice ?? 0 })}
              </span>
            ) : null}
            {waiting ? (
              <span className="mt-1 block text-xs text-gray-500">
                {t('readerPage.waitFreeWhen', { when: formatWaitFreeAt(episode.freeAt) })}
              </span>
            ) : null}
          </div>
        </div>
        <Button size="sm" onClick={onNext}>
          {t('readerPage.nextEpisode')}
        </Button>
      </div>
    </div>
  )
}

export default NextUpRow
```

Replace the existing inline next-up block in `ReaderCompleteCard.tsx` with `<NextUpRow ... />`, keeping the `hasNext ? ... : <EndOfSeries ... />` shape.

- [ ] **Step 5: Pass the two new props from `ReaderPage`**

At the `<ReaderCompletePortal` call site, add:

```tsx
nextEpisodeLocked={
  nextEpisode
    ? isEpisodeLocked(
        nextEpisode,
        typeof webtoonId === 'string' && isEpisodeUnlocked(webtoonId, nextEpisode.episodeNumber)
      )
    : false
}
seriesCover={webtoon?.coverImage}
```

Both helpers are already in scope in `ReaderPage.tsx` — `isEpisodeLocked` from `lib/catalog` and `isEpisodeUnlocked` from `useWallet()`.

- [ ] **Step 6: Run the tests and watch them pass**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderCompleteCard.test.tsx src/test/ReaderChrome.test.tsx --root apps/portal
```

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add apps/portal/src
git commit -m "feat: give reader next-up an episode thumb and its access state

Issue #42. The row now shows the episode thumb, and a locked next episode carries a
lock and its coin price while a wait-for-free one shows when it opens. The button
still navigates to the episode: the locked reader page already renders the paywall,
and a second unlock control here would have to track its balance states.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Inline comments composer

**Files:**

- Create: `apps/portal/src/features/reader/components/complete/CompleteComments.tsx`
- Modify: `apps/portal/src/features/reader/components/complete/ReaderCompleteCard.tsx`
- Modify: `apps/portal/src/features/reader/ReaderPage.tsx` (call site only)
- Modify: `apps/portal/src/lib/i18n/locales/en/translation.json`, `.../mm/translation.json`
- Modify: `apps/portal/src/test/ReaderCompleteCard.test.tsx`

**Interfaces:**

- Consumes: `CommentsTeaser` (existing), and `add(content: string, spoiler: boolean): void` from the `CommentsThreadController` that `ReaderPage` already holds as `commentsThread`.
- Produces: `CompleteComments`, default export, props `{ comments: StoredComment[]; onOpen: () => void; onAdd: (content: string, spoiler: boolean) => void; isAuthenticated: boolean; darkMode: boolean; nested: string }`.

- [ ] **Step 1: Write the failing test**

Add the `seedSession` helper at the top of `src/test/ReaderCompleteCard.test.tsx`, copied from `src/test/ReaderGuestNudge.test.tsx`:

```tsx
import { SESSION_STORAGE_KEY } from '../lib/auth/types'

const seedSession = () => {
  vi.mocked(window.localStorage.getItem).mockImplementation((key: string) =>
    key === SESSION_STORAGE_KEY
      ? JSON.stringify({ id: 'u_test', email: 'test@example.com', username: 'tester' })
      : null
  )
}
```

Then append:

```tsx
describe('reader comments composer', () => {
  it('is hidden for a guest', async () => {
    renderReader('/read/1/1')
    await screen.findByTestId('reader-reactions')
    expect(screen.queryByTestId('reader-comment-composer')).not.toBeInTheDocument()
  })

  it('posts a comment that shows up in the teaser', async () => {
    const user = userEvent.setup()
    seedSession()
    renderReader('/read/1/1')
    const box = await screen.findByTestId('reader-comment-composer')
    const field = box.querySelector('textarea') as HTMLTextAreaElement
    await user.type(field, 'Great episode')
    await user.click(screen.getByRole('button', { name: 'Post' }))
    expect(await screen.findByText('Great episode')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderCompleteCard.test.tsx --root apps/portal
```

Expected: FAIL — no `reader-comment-composer`.

- [ ] **Step 3: Add the translation keys**

`en`, inside `readerPage`:

```json
"commentPlaceholder": "Say something about this episode",
"commentSpoiler": "Mark as spoiler",
"commentPost": "Post"
```

`mm`, inside `readerPage`:

```json
"commentPlaceholder": "ဤအပိုင်းအကြောင်း ရေးပါ",
"commentSpoiler": "အကြောင်းအရာ ဖော်ပြချက်အဖြစ် မှတ်ပါ",
"commentPost": "တင်မည်"
```

- [ ] **Step 4: Implement the component**

Create `complete/CompleteComments.tsx`:

```tsx
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommentsTeaser from '../../../../components/Comments/CommentsTeaser'
import Button from '../../../../components/Button'
import type { StoredComment } from '../../../../lib/comments'

export type CompleteCommentsProps = {
  comments: StoredComment[]
  onOpen: () => void
  onAdd: (content: string, spoiler: boolean) => void
  isAuthenticated: boolean
  darkMode: boolean
  nested: string
}

const CompleteComments = ({
  comments,
  onOpen,
  onAdd,
  isAuthenticated,
  darkMode,
  nested,
}: CompleteCommentsProps) => {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')
  const [spoiler, setSpoiler] = useState(false)
  const canPost = draft.trim().length > 0

  const submit = () => {
    if (!canPost) return
    onAdd(draft.trim(), spoiler)
    setDraft('')
    setSpoiler(false)
  }

  return (
    <>
      <CommentsTeaser comments={comments} onOpen={onOpen} darkMode={darkMode} />
      {isAuthenticated ? (
        <div
          data-testid="reader-comment-composer"
          className={`mt-3 w-full max-w-md rounded-2xl border p-4 text-left ${nested}`}
        >
          <label className="sr-only" htmlFor="reader-comment-draft">
            {t('readerPage.commentPlaceholder')}
          </label>
          <textarea
            id="reader-comment-draft"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t('readerPage.commentPlaceholder')}
            rows={3}
            className={`w-full rounded-2xl border p-3 text-sm ${
              darkMode ? 'border-white/10 bg-white/5 text-gray-100' : 'border-gray-200 bg-white'
            }`}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={spoiler}
                onChange={(event) => setSpoiler(event.target.checked)}
              />
              {t('readerPage.commentSpoiler')}
            </label>
            <Button size="sm" onClick={submit} disabled={!canPost}>
              {t('readerPage.commentPost')}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default CompleteComments
```

In `ReaderCompleteCard.tsx`, replace the bare `<CommentsTeaser ... />` with `<CompleteComments ... />`, and pass a new `onAddComment` prop through from `ReaderPage.tsx`:

```tsx
onAddComment={commentsThread.add}
```

- [ ] **Step 5: Run the tests and watch them pass**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderCompleteCard.test.tsx src/test/ReaderCommentsPanel.test.tsx src/test/I18nSweep.test.tsx --root apps/portal
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/portal/src
git commit -m "feat: add an inline comment composer to the reader complete card

Issue #42. Posts through the same thread controller the teaser reads, so a new
comment appears without extra plumbing. Auth-gated, matching commenting everywhere
else in the portal; guests keep the nudge that is already in the card.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Related x3 and Back to series, always

**Files:**

- Modify: `apps/portal/src/features/reader/components/complete/RelatedList.tsx`
- Modify: `apps/portal/src/features/reader/components/complete/ReaderCompleteCard.tsx`
- Modify: `apps/portal/src/features/reader/components/complete/EndOfSeries.tsx`
- Modify: `apps/portal/src/test/ReaderCompleteCard.test.tsx`

**Interfaces:**

- Consumes: `RelatedList` from Task 1.
- Produces: no new exports. `RelatedList` caps at 3 internally via `RELATED_MAX`.

- [ ] **Step 1: Write the failing test**

Append to `src/test/ReaderCompleteCard.test.tsx`:

```tsx
describe('reader related and back to series', () => {
  it('shows at most three related series alongside a next episode', async () => {
    renderReader('/read/1/1')
    const list = await screen.findByTestId('reader-related')
    expect(list.querySelectorAll('li').length).toBeLessThanOrEqual(3)
    expect(screen.getByTestId('reader-next-up')).toBeInTheDocument()
  })

  it('offers Back to series even when a next episode exists', async () => {
    renderReader('/read/1/1')
    expect(await screen.findByRole('link', { name: 'Back to Webtoon' })).toBeInTheDocument()
  })
})
```

Check the exact copy for `reader.backToWebtoon` in `en/translation.json` first and query that string — do not change the translation to fit the test.

- [ ] **Step 2: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderCompleteCard.test.tsx --root apps/portal
```

Expected: FAIL — related renders only at end of series, and Back to series only lives in `EndOfSeries`.

- [ ] **Step 3: Cap the related list and give it a testid**

In `RelatedList.tsx`:

```tsx
const RELATED_MAX = 3
```

Add `data-testid="reader-related"` to the `<ul>` and render `related.slice(0, RELATED_MAX)`.

- [ ] **Step 4: Render it unconditionally and lift Back to series**

In `ReaderCompleteCard.tsx`, change the related condition from `!hasNext && related.length > 0` to `related.length > 0`, and add a Back to series link to the footer beside the report control:

```tsx
<div className="mt-6 flex w-full max-w-md flex-col items-center gap-2">
  <ButtonLink size="sm" variant="surface" to={seriesHref} onClick={stop}>
    {t('reader.backToWebtoon')}
  </ButtonLink>
  <ReportControl ... />
</div>
```

Remove the now-duplicated `ButtonLink` from `EndOfSeries.tsx`, leaving its subscribe button in place.

- [ ] **Step 5: Run the tests and watch them pass**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderCompleteCard.test.tsx src/test/ReaderChrome.test.tsx src/test/ReaderCelebration.test.tsx --root apps/portal
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add apps/portal/src
git commit -m "feat: show related x3 and Back to series on every reader complete card

Issue #42. Related used to appear only once a series had ended, which left the most
common case — finishing an episode mid-series — with nowhere to go but next. Back to
series moves out of the end-of-series branch into the card footer.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Lock the block order and update the convention

**Files:**

- Modify: `apps/portal/src/features/reader/components/complete/ReaderCompleteCard.tsx`
- Modify: `wiki/conventions/reader-chrome.md`
- Modify: `apps/portal/src/test/ReaderCompleteCard.test.tsx`

**Interfaces:**

- Consumes: every component from Tasks 1 and 3-6.
- Produces: nothing new.

- [ ] **Step 1: Write the failing test**

Append to `src/test/ReaderCompleteCard.test.tsx`:

```tsx
describe('reader complete card order', () => {
  it('renders the blocks in the specified order', async () => {
    renderReader('/read/1/1')
    const card = await screen.findByTestId('reader-complete-card')
    const ids = Array.from(card.querySelectorAll('[data-testid]'))
      .map((node) => node.getAttribute('data-testid'))
      .filter(
        (id): id is string =>
          id !== null && ['reader-reactions', 'reader-next-up', 'reader-related'].includes(id)
      )
    expect(ids).toEqual(['reader-reactions', 'reader-next-up', 'reader-related'])
  })
})
```

- [ ] **Step 2: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderCompleteCard.test.tsx --root apps/portal
```

Expected: FAIL — the card has no `reader-complete-card` testid.

- [ ] **Step 3: Add the testid and confirm the order**

Add `data-testid="reader-complete-card"` to the card's outer `<div>`, and make sure the children read in this order: rating, `EpisodeReactions`, `NextUpRow` or `EndOfSeries`, creator note, `CompleteComments`, `RelatedList`, guest nudge, Back to series + `ReportControl`.

- [ ] **Step 4: Update the convention**

In `wiki/conventions/reader-chrome.md`, replace the Chapter-end paragraph's block list with:

```
Rating, reactions (Demo counts, device-local), next episode with its thumb and access
state, creator-note Demo, comments teaser + composer, same-genre related (hub filter,
max 3, hide when empty), guest nudge, Back to series, episode report. Related shows
alongside a next episode, not only at end of series.
```

- [ ] **Step 5: Run the whole check**

```bash
pnpm check
```

Expected: lint, format, all tests and both builds pass.

- [ ] **Step 6: Verify in the browser**

Start the dev server with the `portal` launch config and confirm the issue's acceptance criteria at `/read/1/1`: the card appears in flow after the ad slot, reactions toggle, next-up shows a thumb, and a guest sees the nudge. Then check that next-up into a premium episode lands on the paywall.

- [ ] **Step 7: Commit**

```bash
git add apps/portal/src wiki/conventions/reader-chrome.md
git commit -m "feat: lock the reader complete card block order (#42)

Issue #42. A test pins the DOM order of reactions, next-up and related so the card
cannot drift back out of the designed sequence. reader-chrome.md is updated in the
same commit: chapter-end now specifies next episode AND related x3, where it used to
say one or the other.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Self-review

**Spec coverage.** Reactions — Tasks 2 and 3. Next-up thumb and the three access states — Task 4. Locked next-up navigating into the existing paywall — Task 4, tested. Comments composer, auth-gated — Task 5. Related x3 shown alongside a next episode — Task 6. Back to series always — Task 6. Block order — Task 7. File split — Task 1. Convention update — Task 7. The spec's "already true" section needs no task by definition.

**Type consistency.** `Reaction`, `REACTIONS`, `readReaction`, `toggleReaction` and `reactionCount` keep the same names and signatures in Tasks 2 and 3. `nested`, `muted` and `titleClass` are the shell's shared strings, passed as props to every block from Task 1 onward. The card's new props — `episodeNumber` (Task 3), `nextEpisodeLocked` and `seriesCover` (Task 4), `onAddComment` (Task 5) — are each added at the `ReaderPage` call site in the task that introduces them.

**Known risk.** Task 4's locked-episode test depends on which demo episode is premium. Step 1 of that task confirms it with a grep before the test is written, rather than guessing.
