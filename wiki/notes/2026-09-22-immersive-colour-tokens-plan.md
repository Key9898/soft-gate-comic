# Immersive colour tokens implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hardcoded dark literals on Webtoon Detail's hub hero and throughout the Reader with a semantic token set that re-binds under `data-theme="immersive"`.

**Architecture:** Semantic variables live in the `@theme` block with their light values; a `[data-theme='immersive']` rule re-binds them. Detail's hub hero sets the attribute statically; the Reader sets it from the existing `darkMode` preference. The 37 `darkMode ? ... : ...` class ternaries then collapse into single utility names.

**Tech Stack:** Tailwind v4, React 19, TypeScript, Vitest + React Testing Library.

**Design spec:** `wiki/notes/2026-09-22-immersive-colour-tokens-design.md` — read it before Task 1. Its token table is the contract.

## Global Constraints

- TDD: write the failing test, run it, watch it fail, then implement.
- The Home hero overlay is OUT OF SCOPE. It belongs to PR #49, still in review. Do not touch `HeroSpotlight.tsx`, `HeroBackdrop.tsx` or `HeroBanner.tsx`.
- Light pages outside the Reader must be pixel-identical. The Reader's light-mode deltas are the enumerated list in the design spec and nothing else.
- `--color-muted` and `--color-muted-strong` already exist in `index.css` and serve the whole portal. Do not redefine them, and do not put them inside the immersive scope.
- Source files under 800 lines; functions under 50 lines; nesting under 4 levels. No mutation.
- Commit messages conventional, ending with exactly:
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`
- Run `pnpm check` before the final commit.

## Prerequisite

```bash
pnpm install --frozen-lockfile   # only if the worktree has no node_modules
```

Targeted test runs:

```bash
apps/portal/node_modules/.bin/vitest run <path> --root apps/portal
```

## File structure

| File                                                     | Responsibility                                      |
| -------------------------------------------------------- | --------------------------------------------------- |
| `apps/portal/src/index.css`                              | the token declarations and the immersive scope rule |
| `apps/portal/src/features/webtoon/WebtoonDetailPage.tsx` | hub hero converted (lines ~291-446 only)            |
| `apps/portal/src/features/reader/**`                     | reader surfaces converted                           |
| `apps/portal/src/components/**`                          | reader-shared components converted                  |
| `wiki/decisions/014-immersive-theme-scope.md`            | the ADR                                             |
| `wiki/conventions/reader-chrome.md`                      | records the new theming mechanism                   |
| `apps/portal/src/test/immersiveTokens.test.ts`           | token and scope tests                               |

---

### Task 1: Declare the tokens and the immersive scope

**Files:**

- Modify: `apps/portal/src/index.css`
- Test: `apps/portal/src/test/immersiveTokens.test.ts`

**Interfaces:**

- Consumes: nothing.
- Produces: the twelve tokens in the design spec's table, plus a `[data-theme='immersive']` rule that re-binds them. No component consumes them yet.

- [ ] **Step 1: Establish the real colour values**

Do NOT copy hex values from memory or from this plan. The design spec's table names Tailwind palette steps (`gray-950`, `white/5`, `red-500/10`). Get their actual values from what this project's Tailwind build emits, then write them explicitly.

```bash
apps/portal/node_modules/.bin/vite build --outDir /tmp/token-value-check
grep -o "\-\-color-gray-[0-9]*:[^;]*" /tmp/token-value-check/assets/*.css | sort -u | head -20
```

Record in your report the value you are using for every step the table names. Alpha variants (`white/5`, `gray-900/60`, `red-500/10`) have no palette variable — express them as explicit `rgb(R G B / A)`.

- [ ] **Step 2: Write the failing test**

Create `apps/portal/src/test/immersiveTokens.test.ts`. It reads the BUILT stylesheet, not source — the pattern `apps/portal/src/test/ChipRadiusWeight.test.tsx` already uses for `--radius-chip`, because a token that never reaches the output is invisible to a source grep. Read that file first and follow how it locates the build.

```ts
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import path from 'node:path'

const TOKENS = [
  'base',
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

const css = () => readFileSync(path.resolve(__dirname, '../index.css'), 'utf8')

describe('immersive colour tokens', () => {
  it('declares every semantic token in the theme block', () => {
    const theme = css().slice(css().indexOf('@theme {'))
    for (const token of TOKENS) {
      expect(theme).toContain(`--color-${token}:`)
    }
  })

  it('re-binds every one of them in the immersive scope', () => {
    const scope = css().slice(css().indexOf("[data-theme='immersive']"))
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
```

- [ ] **Step 3: Run it and watch it fail**

```bash
apps/portal/node_modules/.bin/vitest run src/test/immersiveTokens.test.ts --root apps/portal
```

Expected: FAIL — no such tokens.

- [ ] **Step 4: Implement**

Add the twelve tokens to the existing `@theme` block in `index.css` with their LIGHT values, each with a short comment naming its role. Then add a scope rule re-binding all twelve to their immersive values. Put the scope rule near the other component-layer rules, not inside `@theme` — `@theme` is for the default binding.

Comment the scope rule with why it exists: Detail's hub hero is always dark, the Reader's dark is a user preference, and both now drive CSS rather than branching in markup.

- [ ] **Step 5: Prove the tokens survive the build**

A token declared in source but dropped from the output is the failure this task most plausibly ships. Build and confirm, and put the command and its output in your report:

```bash
apps/portal/node_modules/.bin/vite build --outDir /tmp/token-build-check
grep -c "\-\-color-surface\b" /tmp/token-build-check/assets/*.css
```

If a token is absent because nothing uses its utility yet, say so — Tailwind only emits utilities that are referenced, and that is expected at this stage. The variables themselves should still be present.

- [ ] **Step 6: Run the test and commit**

```bash
apps/portal/node_modules/.bin/vitest run src/test/immersiveTokens.test.ts --root apps/portal
git add apps/portal/src/index.css apps/portal/src/test/immersiveTokens.test.ts
git commit -m "feat: add the Immersive semantic colour tokens (#35)

Issue #35. Twelve semantic tokens with their light values in @theme, re-bound under
[data-theme='immersive']. No consumer yet: Detail's hub hero and the Reader follow.

The portal-wide --color-muted and --color-muted-strong are deliberately left out of the
scope - they serve pages this issue does not touch, and changing them from inside a
reader change is how a regression reaches an untested surface.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 2: ADR 014

**Files:**

- Create: `wiki/decisions/014-immersive-theme-scope.md`

- [ ] **Step 1: Read two existing ADRs**

`wiki/decisions/012-development-branch.md` and `013-generated-assets-not-purged.md`. Match their frontmatter keys, their Status / Context / Decision / Consequences headings and their terse voice. The ADRs run to 013; this is 014.

- [ ] **Step 2: Write it**

Content the ADR must carry:

- **Context:** three surfaces hardcoded their dark colours per page. Detail's hub hero is always dark; the Reader's dark is a user preference in `softgate_reader_prefs_v1`, threaded through 18 files and branched in 37 ternaries. A single mechanism has to serve both.
- **Decision:** semantic tokens in `@theme` holding light values, re-bound by a `[data-theme='immersive']` attribute on a subtree root. Detail's hero sets it statically; the Reader sets it from the `darkMode` pref. Pages that do not set it are unaffected.
- **Alternatives considered and rejected:** a `dark:` variant strategy, which would tie the Reader's per-device preference to the OS colour scheme and cannot express "this section is always dark"; and redefining the existing portal-wide `--color-muted`, which would silently change pages outside this issue's scope.
- **Consequences:** the `darkMode` prop stops being needed for class selection and survives only where it picks a component variant; light pages outside the Reader are unchanged; the Reader's light mode gains the deltas the design spec enumerates, three of which correct values that `index.css`'s own palette comment documents as failing AA.

- [ ] **Step 3: Commit**

```bash
git add wiki/decisions/014-immersive-theme-scope.md
git commit -m "docs: ADR 014 for the immersive theme scope (#35)

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Convert Webtoon Detail's hub hero

**Files:**

- Modify: `apps/portal/src/features/webtoon/WebtoonDetailPage.tsx`
- Modify: `apps/portal/src/test/WebtoonDetailHub.test.tsx`

**Interfaces:**

- Consumes: the tokens from Task 1.
- Produces: nothing new.

- [ ] **Step 1: Read before you touch**

The dark literals are confined to the hub hero `<section data-testid="hub-hero">`, roughly lines 291-446. **Below that the page is a legitimately light surface** — `bg-white`, `bg-gray-100`, `text-gray-900`, `border-gray-100` around line 562 onward are correct and must not change. Establish the section's real boundary by reading, and state it in your report.

Note also that many of the hero's values are whites over artwork (`bg-white/10`, `text-white/50`, `ring-offset-gray-900`), not semantic surfaces. Those that express "a chip floating on the key art" are not `bg-raised`; decide per site and justify anything you leave as a literal.

- [ ] **Step 2: Write the failing test**

Append to `apps/portal/src/test/WebtoonDetailHub.test.tsx`, reusing its existing render helper:

```tsx
it('scopes the hub hero to the immersive theme', () => {
  renderHub()
  const hero = screen.getByTestId('hub-hero')
  expect(hero).toHaveAttribute('data-theme', 'immersive')
  expect(hero.className).not.toMatch(/\bbg-gray-900\b/)
})
```

`renderHub` is that file's existing helper — check its real name and signature first.

- [ ] **Step 3: Run it, watch it fail, then convert**

```bash
apps/portal/node_modules/.bin/vitest run src/test/WebtoonDetailHub.test.tsx --root apps/portal
```

Then put `data-theme="immersive"` on the hero section and replace its dark literals with the token utilities. Leave everything below the section alone.

- [ ] **Step 4: Verify the light half did not move**

```bash
git diff apps/portal/src/features/webtoon/WebtoonDetailPage.tsx
```

Read your own diff and confirm no hunk touches a line below the hero section. Put that confirmation in your report.

- [ ] **Step 5: Run and commit**

```bash
apps/portal/node_modules/.bin/vitest run src/test/WebtoonDetailHub.test.tsx src/test/WebtoonDetailMobileOverview.test.tsx --root apps/portal
git add apps/portal/src
git commit -m "feat: put Webtoon Detail's hub hero on the immersive tokens (#35)

Issue #35. The hero is always dark and now says so with data-theme rather than with
literal gray classes. The rest of the page is a light surface and is untouched.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: Drive the Reader's theme from the preference

**Files:**

- Modify: `apps/portal/src/features/reader/ReaderPage.tsx`
- Modify: `apps/portal/src/test/ReaderChrome.test.tsx`

**Interfaces:**

- Consumes: the tokens from Task 1.
- Produces: `data-theme="immersive"` present on the reader root when `darkMode` is on.

This task adds the attribute and changes NO classes. The ternaries keep working exactly as they do now; Task 5 collapses them. Keeping these separate means a rendering regression in Task 5 cannot be confused with a mechanism bug here.

- [ ] **Step 1: Write the failing test**

Append to `apps/portal/src/test/ReaderChrome.test.tsx`, reusing its existing render helper and its reader-prefs seeding. Read how that file seeds `softgate_reader_prefs_v1` before writing this.

```tsx
it('scopes the reader to the immersive theme when dark mode is on', async () => {
  seedPrefs({ darkMode: true })
  renderReader('/read/1/1')
  expect(await screen.findByTestId('reader-root')).toHaveAttribute('data-theme', 'immersive')
})

it('drops the immersive scope in light mode', async () => {
  seedPrefs({ darkMode: false })
  renderReader('/read/1/1')
  expect(await screen.findByTestId('reader-root')).not.toHaveAttribute('data-theme')
})
```

If the reader root has no testid, add one as part of this task.

- [ ] **Step 2: Run it, watch it fail, then implement**

Set the attribute from the existing `darkMode` state. It is already in scope in `ReaderPage.tsx`; do not add a new source of truth for it.

- [ ] **Step 3: Run and commit**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderChrome.test.tsx src/test/ReaderGuestNudge.test.tsx --root apps/portal
git add apps/portal/src
git commit -m "feat: scope the Reader to the immersive theme from its dark preference (#35)

Issue #35. Attribute only - no class changes yet, so a later rendering regression cannot
be mistaken for a mechanism bug.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Collapse the Reader's class ternaries

**Files:**

- Modify: reader feature files and the reader-shared components under `apps/portal/src/components/`
- Modify: the reader test files that assert on dark classes

**Interfaces:**

- Consumes: Tasks 1 and 4.
- Produces: no new exports. The `darkMode` prop disappears from components that used it only to pick classes.

This is the large one. Work in small commits — one per file or per small group — rather than a single sweeping change.

- [ ] **Step 1: Produce the inventory**

```bash
grep -rn "darkMode ?" apps/portal/src/features/reader apps/portal/src/components
```

For each of the 37 sites, write down which token the pair maps to, using the design spec's table. Put this inventory in your report BEFORE changing anything. Three cases need a decision rather than a lookup, and the spec covers them:

- `darkMode ? 'text-muted' : 'text-muted'` — identical branches. Delete the branching; it has been doing nothing.
- `darkMode ? 'hero' : 'page'` and `darkMode ? 'dark' : 'light'` — these pass component _variant_ props, not classes. They are not tokens and stay.
- Sites where the light value is `text-gray-500` or `text-gray-400` in a muted role move to `--color-ink-muted` (gray-600). The spec lists these as deliberate contrast corrections, not regressions.

- [ ] **Step 2: Convert, then remove the prop**

Replace each pair with its token utility. When a component's `darkMode` prop then has no remaining reader, remove it from the props type and from every call site. Do not leave a prop that is threaded but unused.

- [ ] **Step 3: Update the tests that asserted on dark classes**

Some reader tests assert literal dark classes. Those assertions are now wrong by construction. Replace each with an assertion about the token utility or about the `data-theme` scope — do not delete one and leave the behaviour uncovered.

- [ ] **Step 4: Run the full reader suite**

```bash
apps/portal/node_modules/.bin/vitest run src/test/ReaderChrome.test.tsx src/test/ReaderGuestNudge.test.tsx src/test/ReaderCelebration.test.tsx src/test/ReaderCommentsPanel.test.tsx src/test/ReaderCompleteCard.test.tsx --root apps/portal
```

- [ ] **Step 5: Commit**

Conventional message, ending with the required trailer, describing what the prop removal actually accomplished.

---

### Task 6: Sweep, verify, document

**Files:**

- Modify: `apps/portal/src/test/immersiveTokens.test.ts`
- Modify: `wiki/conventions/reader-chrome.md`

- [ ] **Step 1: Write the sweep test**

Extend `immersiveTokens.test.ts` with a source sweep asserting the converted files carry no dark literal — `bg-gray-950`, `bg-gray-900`, `text-gray-400`, `border-white/10` and the rest of the set your inventory replaced. Model it on `apps/portal/src/test/SmallTypeWeight.test.tsx`, which already enforces a convention this way, including how it keeps an explicit allowlist for legitimate exceptions.

**Scope the sweep precisely.** `WebtoonDetailPage.tsx` legitimately uses light-surface grays below its hero, and the Home hero files are out of scope entirely. A sweep that fails on those is wrong.

- [ ] **Step 2: Measure the contrast claim**

The design spec claims `--color-ink-muted` clears 4.5:1 on `--color-base` in both modes. Verify rather than assume: compute the ratio from the actual token values you shipped in Task 1 and report both numbers. If either misses, raise the muted value until it passes and say what you changed.

- [ ] **Step 3: Update the convention**

`wiki/conventions/reader-chrome.md` has a Prefs section describing the reader's light/dark handling. Record that the theme is now applied by `data-theme="immersive"` driven by the same preference, and link ADR 014. Change only what this work invalidates.

- [ ] **Step 4: Full check**

```bash
pnpm check
```

If it fails on `apps/portal/src/test/imageVariants.test.ts` about missing generated `.avif`/`.webp` variants, that is a known build-ordering race in this monorepo — run `pnpm run generate:images` from `apps/portal` and rerun.

- [ ] **Step 5: Commit**

Conventional message ending with the required trailer.

---

## Self-review

**Spec coverage.** Token set — Task 1. Switching mechanism and ADR — Tasks 1, 2 and 4. Webtoon Detail — Task 3. Reader — Tasks 4 and 5. The enumerated light-mode deltas — Task 5, Step 1. The no-op ternary — Task 5, Step 1. The sweep and the contrast claim — Task 6. The deferred hero overlay needs no task by definition, and is guarded by a Global Constraint.

**Type consistency.** The twelve token names in Task 1's test array are the same twelve in the design spec's table and the same ones Tasks 3 and 5 consume as utilities. `data-theme="immersive"` is the single attribute name across Tasks 1, 3, 4 and 6.

**Known risks.** Two, both with a step that addresses them rather than a hope. Task 3 could bleed into Webtoon Detail's light half, so it requires reading the diff and confirming the boundary. Task 5 is a 37-site change where the mapping is a judgement per site, so it requires the inventory to be written down before any edit.
