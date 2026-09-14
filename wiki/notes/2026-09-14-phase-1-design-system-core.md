---
title: Impl 215 — Phase 1 design-system core (Button, Card, SortMenu, SearchField)
type: note
date: 2026-09-14
tags: [design-system, buttons, cards, a11y, tokens, portal, softgate]
impl: 215
---

# Impl 215 — Phase 1 design-system core

First tranche of Phase 1 from the [UI/UX improvement plan](2026-09-14-uiux-improvement-plan.md), tracked as GitHub epic #18 and issue #11. This lands the shared primitives and the token cleanup. The bulk migration work that depends on them — 138 raw `<button>` elements, 221 `min-h` patches, the three input systems, the eleven skeleton files — is **not** in this note.

## What shipped

### `Button` gains a touch floor, and links can finally be buttons

`components/Button/buttonClasses.ts` is now the single class builder. Every size clears 44pt:

| Size | Before | Now        |
| ---- | ------ | ---------- |
| `sm` | ~30px  | `min-h-11` |
| `md` | ~36px  | `min-h-11` |
| `lg` | ~44px  | `min-h-12` |

`components/Button/ButtonLink.tsx` adds `ButtonLink` (a router `Link`) and `ButtonAnchor` (a plain `<a>`, for `mailto:`, downloads and hashes), both built from the same builder. This was the actual reason CTA class strings kept being hand-rolled: `Button` only rendered a `<button>`, so every navigating CTA re-derived the classes and drifted.

Two further changes inside `Button`:

- A new `surface` variant — a bordered white control (`border-gray-200 bg-white text-gray-700`). It had been hand-written in a dozen places because no variant matched it; `secondary` is a grey fill, not a bordered white one.
- `focus:ring` became `focus-visible:ring`, so a mouse click no longer leaves a persistent ring. That was inconsistent with every link in `Navigation` and `ReaderCompletePortal`.

### The CTA constants collapse into one editorial module

`features/info/components/infoStyles.ts` now owns the info-page voice. `PRIMARY_CTA` had existed in **three mutually incompatible forms** across six files (`min-h-11` against `min-h-[44px]`, `flex` against `inline-flex`, `text-sm font-medium` against `text-xs font-bold uppercase`).

The important finding is that this was **not** pure drift. The info pages speak in a genuinely different register — small uppercase labels with wide tracking — from the sentence-case app CTA. So the module keeps that voice as `EDITORIAL_VOICE` and takes sizing, focus and the touch floor from `buttonClasses`, rather than flattening seven surfaces onto one look.

Exports: `INFO_PRIMARY_CTA`, `INFO_SECONDARY_CTA`, `INFO_TOC_LINK`, `DESTINATION_TILE`, `INFO_SECTION_HEADING`, `INFO_SECTION_RULE`, `INFO_CARD`. Consumers: About, Help, FAQ, Press, Creators, Maintenance, NotFound, Author, Categories.

Byte-identical duplicate definitions of the card/heading/rule strings: **5 → 0**.

### `Card` exists, because the convention already assumed it

`wiki/conventions/border-radius.md` names `Card.tsx` in its component table, but no such component existed. `components/Card` now provides `card` (`rounded-2xl`, the shared content card) and `panel` (`rounded-3xl`, a large section shell), plus `CARD_CLASS` / `PANEL_CLASS` for the places that style an existing element rather than render a wrapper.

### One `SortMenu`, and it is now keyboard-operable

Categories and Search shipped visually identical menus with different behaviour. Categories had `aria-haspopup`, `aria-expanded`, `aria-controls`, Escape-to-close with focus restore and an outside-click catcher; Search had none of them. **Neither** supported arrow-key roving, which `role="menu"` promises to a screen-reader user.

`components/SortMenu` replaces both. It adds:

- `role="menuitemradio"` + `aria-checked` per option (was an unchecked `menuitem`)
- arrow-key roving with wrap, plus Home / End
- opening focus on the **current selection**, not index 0
- Escape and outside-click, both restoring focus to the trigger
- `min-h-11` on every option row

One thing deliberately left off the trigger: an `aria-label`. Adding one overrode the visible selection text as the accessible name, which broke "label in name" — and a test caught it.

Covered by `src/test/SortMenu.test.tsx` (7 tests).

### One `SearchField`

`components/SearchField` replaces the filled search input. Help and FAQ carried byte-identical copies of the markup; Library had a third variant. Sizes `md` and `lg` match the two real uses.

### `index.css` token cleanup

- **Eleven dead component classes deleted**: `.btn-primary`, `.btn-secondary`, `.btn-outline`, `.input-base`, `.card`, `.card-hover`, `.tag`, `.tag-primary`, `.tag-accent`, `.tag-spark`, `.container-app`. All were unreferenced repo-wide; verified per class before deleting.
- **Brand and grey literals replaced with tokens.** `#0e9494` appeared five times where `--color-primary-600` already existed, plus once in a `-webkit-text-stroke`. Grey text literals (`#9ca3af`, `#6b7280`, `#374151`, `#111827`) now use the theme vars — `#9ca3af` became `var(--color-muted)`, the same 2.85:1 fix as Phase 0's `text-gray-400` sweep, which the CSS had been quietly duplicating.
- The slate literals in `.hero-book-pages` and `.book-media` are **kept**, with a comment. They model paper and board; they are a material, not brand colour, and forcing them onto theme tokens would be wrong.

## A correction to the plan

The audit reported **63 radius violations**, counting all 46 `rounded-3xl` uses. That is wrong. `wiki/conventions/border-radius.md` explicitly assigns `rounded-3xl` to "Modal, hero/marketing shells, large section panels". Those 46 are correct usage.

The real violations are the 15 remaining `rounded-sm` / `rounded-lg` / `rounded-xl` / `rounded-full` uses, which the convention does ban. Issue #11 and the plan have been corrected.

## Not in this tranche

Deliberately left, because each is a bulk migration that depends on the primitives above:

- 138 raw `<button>` elements in `features/` and `components/`
- 221 `min-h-11` / `min-h-[44px]` / `min-w-11` patches — these can only be stripped once their element is a `Button`, and they are load-bearing until then
- 10 remaining raw copies of the primary-CTA class string
- Three input systems (`Input`, `FloatingInput`, 20 raw `<input>`) collapsing to one
- Eleven skeleton files / 1284 lines
- The 15 genuine radius violations
- Weight hierarchy: `font-bold` (332) outnumbers `font-medium` (111) three to one

## Verification

`pnpm check` green: 0 lint errors (16 pre-existing warnings), prettier clean, 736 portal + 153 API tests, both builds.

## Note on tooling

`npx tsc -p apps/portal --noEmit` checks nothing — the root `tsconfig.json` is a solution file with only project references, so it exits 0 on any error. The real typecheck is `npx tsc -b apps/portal`, which is what `pnpm build` runs. Use `-b`.

---

## Second tranche — `Chip`, tab semantics, and the touch floor (same Impl)

### `Chip` / `ChipLink`

`components/Chip` is the selectable filter chip for Categories, Search, Library and Home. The duplication here was the SortMenu story again: identical-looking chips, different correctness. Categories chips were `min-h-11` with `aria-pressed`; the visually identical Search chips were `min-h-[38px]` with **no state exposed at all**, so a screen-reader user could not tell which filter was active and a thumb had a 38px target.

`Chip` takes `selected`, a `tone` (`filter` — the ringed primary-50 look; `genre` — the solid primary-600 look), and `semantics` (`toggle` → `aria-pressed`, `radio` → `role="radio"` + `aria-checked` for use inside a `radiogroup`). `ChipLink` is the navigating form, matching `ButtonLink`.

Migrated: Search tabs, status chips and genre chips; Categories genre and status chips; Home genre chips; the daily-board weekday chips. The Categories genre chip keeps its `layoutId` sliding highlight.

Covered by `src/test/Chip.test.tsx` (4 tests).

### Library tabs became real tabs

`LibraryPage` tabs conveyed selection by colour alone. They are now a proper `role="tablist"` / `role="tab"` with `aria-selected`, roving `tabIndex`, and — importantly — an actual `role="tabpanel"` wired through `aria-controls` / `aria-labelledby`. Adding tab roles without a panel would have been a half-promise to assistive tech.

The grid/list view toggle became a `role="group"` with `aria-pressed` on each control, and both controls went from a 36px box to `min-h-11 min-w-11`.

### Touch floor, measured

`GenreRailChevron`'s `sm` size was `38x38` — the only control on a horizontal rail, below the minimum, on exactly the device that needs it. Both sizes are now `min-h-11 min-w-11`. The Home Continue-Reading chevron, the search-panel close button (28x28) and the footer links (17px tall, padding supplied by `space-y-2` on the list rather than the link itself) were all raised.

Measured live at 375px with `getBoundingClientRect`, before and after:

| Route  | Interactive elements under 44px |
| ------ | ------------------------------- |
| Home   | 17 of 86 → **3 of 85**          |
| Search | 12 of 48 → **3 of 48**          |

The three that remain are the wordmark lockup (40px tall, 343px wide) and two footer text links that are 44px tall but narrower than 44px. Width below 44 on an inline text link is not a defect; padding them out to a 44px square would look wrong.

### Still open

`<button>` count is 138 → 132, which understates the work: the migrated controls were the duplicated, incorrect ones. Most of the remainder are genuinely bespoke — reader chrome, comment actions, accordion headers, card overlays — and several are inside skeletons that deliberately keep live chrome per the Impl 210 convention, so they are not candidates for a blanket sweep.

The 221 `min-h` patches also stay for now: they remain load-bearing on every element that is still a raw `<button>`.
