---
title: Portal UI/UX improvement plan (six phases)
type: note
date: 2026-09-14
tags: [uiux, design-system, accessibility, portal, plan, softgate]
---

# Portal UI/UX improvement plan (six phases)

Plan only. No code shipped under this note. Each phase becomes its own `Impl N` when it is picked up; this document is the backlog those numbers draw from.

## How this was produced

Four independent read-only assessments of `apps/portal`, run in parallel and kept isolated from each other until synthesis:

- **A1 — discovery surfaces:** Home, Categories, Search, `BookCard`, `HeroBook3D`, catalog panels, skeletons, `index.css`.
- **A2 — conversion and consumption:** Webtoon detail, Reader and its sheets, Coins, Auth, Comments, layouts.
- **A3 — account, info, and design-system audit:** Library, Profile, Notifications, Author, all info pages, shared chrome components, plus grep-counted token/component/i18n violations across the whole of `apps/portal/src`.
- **B — mechanical and live evidence:** the Impeccable detector, plus a real browser pass over eleven routes at 1440x900 and 375x812 with in-page `getBoundingClientRect` / `getComputedStyle` measurement.

Design standards applied: Impeccable critique protocol, `frontend-design`, `taste-skill-v1`, `ui-ux-pro-max`.

## Design health baseline

Nielsen heuristics, scored 0–4, all ten applicable (the portal is an Operate-mode product surface).

| #         | Heuristic                       | Score     | Key issue                                                                                                                                                                                         |
| --------- | ------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | Visibility of system status     | 2         | Coin unlock has no pending or success state; the live reader's `role="progressbar"` ships without `aria-valuenow` while the skeleton has it; the detail hero renders blank for over three seconds |
| 2         | Match system / real world       | 3         | 1302 `t()` calls and honest copy, but `"John Doe"` / `"johndoe"` placeholders on a Burmese portal, and a hardcover-book metaphor applied to vertical-scroll webtoons                              |
| 3         | User control and freedom        | 2         | Insufficient coins ejects the reader to `/coins` mid-sentence; profile edit has no Cancel; the episode-change swipe has no undo                                                                   |
| 4         | Consistency and standards       | 1         | 23 hand-rolled CTA class constants across 14 files, 15 independent copies of the primary CTA, three parallel input systems, two divergent sort menus                                              |
| 5         | Error prevention                | 1         | Account deletion is one click with no confirm, while deleting three bookmarks gets a focus-trapped modal; the demo checkout collects real card numbers                                            |
| 6         | Recognition rather than recall  | 2         | Coin balance is `hidden lg:flex` and icon-only, so it is invisible on mobile at every moment it matters; the episode sheet always opens at episode 1                                              |
| 7         | Flexibility and efficiency      | 1         | No keyboard path to toggle reader chrome or exit the reader; the autocomplete listbox has roles but no arrow/Enter/Escape handling; no episode number-jump                                        |
| 8         | Aesthetic and minimalist design | 1         | `/webtoon/:id` hero overflows to `left:-250, right:625` in a 375px viewport, clipped and unreachable; nine peer sections on Home; a seven-control reader toolbar                                  |
| 9         | Error recovery                  | 1         | One failed catalog fetch renders the identical error panel eight times down Home; a network failure in the reader is misdiagnosed as a deleted series                                             |
| 10        | Help and documentation          | 3         | Genuinely strong: Help hub, searchable FAQ, a 404 with search and real destinations, persistent demo-honesty banners                                                                              |
| **Total** |                                 | **17/40** | Poor band                                                                                                                                                                                         |

The band label overstates the situation. This is not a broken foundation; it is a well-engineered app carrying a concentrated cluster of P0 defects. Phase 0 and Phase 1 alone should move the score to roughly 28–30 without touching the visual world.

## Design specificity verdict

The one genuinely authored asset is `.book-media` (`index.css:192-262`) and the 3D fore-edge (`index.css:305-445`): repeating 1.5px/2.5px paper striations revealed only after `rotateY(90deg)`, a spine light-catch modelled at 0.6–2.8% of width, a float shadow that scales in sequence with the lift. The execution is award-level. The object is wrong — webtoons are vertical-scroll digital comics, not Western bound hardcovers — and it appears nowhere outside catalog cards, so the product's only piece of visual authorship is confined to one component.

Everything else would drop unchanged into an unrelated product: teal and magenta tokens, a `bg-gray-50` body, Lucide icons, pill chips, 3:4 cover grids, chevron rails. Exactly three things in the codebase are authored for Myanmar: the `'Noto Sans Myanmar'` fallback, the `html[lang='mm']` line-height block, and one tagline string.

Radius carries no hierarchy. `rounded-2xl` is applied to a 6px bullet, a range-slider track, and a 20px checkbox that consequently renders as a circle (`RegisterPage.tsx:230`). The repo has 343 compliant uses against 15 real violations. (Corrected 2026-09-14: an earlier draft counted 63 by treating all 46 `rounded-3xl` uses as violations. `wiki/conventions/border-radius.md` explicitly assigns `rounded-3xl` to modals, hero shells and large section panels, so those are correct.)

The Impeccable detector returned four findings on the whole tree, three of them false positives (a `side-tab` match on a pull-quote deck, two `gray-on-color` matches that pair hover variants which never co-occur). The single genuine finding is `@utility progress-bar { transition: width }` at `index.css:770`, which should animate `transform: scaleX`. A near-clean mechanical scan over a 17/40 surface is itself informative: the defects here are structural and behavioural, below what any pattern matcher detects.

## What is already working

Three things are worth protecting through every phase below.

1. **Anti-dark-pattern copy discipline.** Rail decks disclaim their own scope, `highestRatedDesc` explicitly states "not paid placement", search chips are labelled as example queries against a demo catalog, and `auth.resetNotSaved` appears both before and after the fake reset. Very few products do this.
2. **Sheet infrastructure is correct.** `ReaderSheet` and `CommentsSheet` pair a focus trap, scroll lock, Escape handling, `aria-labelledby`, and a responsive bottom-sheet-to-right-drawer that re-evaluates on `matchMedia` change. `useScrollLock` restores scroll position on release.
3. **`NotFoundPage` is the strongest surface in the app** — variant copy, search, three destinations, real recommendations, correct SSR 404. It should become the template for the Library and Notifications empty states, which currently share none of it.

Also worth keeping: staged preference hydration with no flash of the wrong theme, `tabular-nums` on every mutating number, `min-h-2lh` reserving description height, and the 200ms `skeleton-appear` delay that suppresses flash-of-skeleton on fast loads.

---

## Phase 0 — Ship blockers

Estimated one week. Nothing else should be prioritised while these are live. Can run in parallel with Phase 1.

| #   | Item                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Primary location                                                                                  |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| 0.1 | Collapse the detail hero to `flex-col md:flex-row`. Measured at 375px the hero text column sits at `left=-250, right=625` while `document.scrollWidth` stays 375, so the title, synopsis, meta chips and CTA row are clipped and unreachable rather than scrollable. Several meta chips measure `left=-296, right=-168` and are entirely invisible.                                                                                                            | `features/webtoon/WebtoonDetailPage.tsx`                                                          |
| 0.2 | Remove shipped placeholder content: strip the baked-in wordmarks from `banner.png` (the live hero overlay currently renders on top of the words "YOUR DAILY ESCAPE,"), replace reader panels containing the literal string `[AUTHOR NAME] \| ART BY [ARTIST NAME]`, and give each episode its own thumbnail — all three Shadow Knight thumbnails are currently identical and show art from unrelated series.                                                   | assets, `features/reader/`                                                                        |
| 0.3 | Rebuild insufficient-coins as a recovery path. `ReaderPage.tsx:607-612` sets `unlockError` and calls `navigate('/coins')` on the next line, so the error is written and immediately discarded. Render inline instead: the shortfall (`coinPrice - balance`), the smallest pack that covers it, and a top-up link carrying `state={{ from, needCoins }}`. `/coins` reads that state for a context strip and a "Back to Episode N" return.                       | `features/reader/ReaderPage.tsx`, `features/coins/CoinsPage.tsx`                                  |
| 0.4 | Make spending coins legible. Put the price on the CTA (`Unlock · {coins}`), add `isLoading` to the button during the await, announce the new balance through `role="status"`, and add a lightweight confirm on first purchase.                                                                                                                                                                                                                                 | `features/reader/ReaderPage.tsx:591-615, 823-831`                                                 |
| 0.5 | Correct the destructive-confirmation policy, which is currently inverted against severity: deleting three bookmarks gets a focus-trapped modal, deleting an account is a single click. Promote `LibraryDeleteConfirmDialog` to a shared `ConfirmDialog`, require type-to-confirm for account deletion, and add an undo toast for notification delete and clear-read.                                                                                           | `features/profile/ProfilePage.tsx:503-509`, `features/notifications/NotificationsPage.tsx`        |
| 0.6 | Neutralise the card-entry form. A working PAN/expiry/CVV form with a 3D flip card collects real card numbers for an app that does nothing with them, contradicting the amber honesty banner directly above it. Make the inputs `readOnly` and pre-filled with an obvious mock value, or drop the card method. If it stays live, it needs `inputMode="numeric"`, `autocomplete="cc-number"`, and a `try/catch` around the unguarded `navigator.clipboard` call. | `features/coins/CoinsPage.tsx:944-1098, 178-182`                                                  |
| 0.7 | Retire `text-gray-400` as a text colour. At 2.85:1 on white it fails AA at any size, and 57 of its 127 occurrences are at 11–12px. Introduce `--color-muted` mapped to `gray-500` (4.6:1) and fix it in `PageHeader` and `Breadcrumb` rather than at 127 call sites.                                                                                                                                                                                           | `index.css`, `components/PageHeader/PageHeader.tsx:49`, `components/Breadcrumb/Breadcrumb.tsx:29` |
| 0.8 | Add `.hero-book`, `.hero-book-motion`, `.hero-book-float-shadow` and `.hero-book-enter` to the reduced-motion block, which currently covers only `animate-pulse`, `animate-spin` and `skeleton-appear`. The forced-product-motion convention is defensible for a modal the user chose to open; it is not defensible for a large 3D rotation fired by `Tab` through `:focus-within`.                                                                            | `index.css:398-417, 425-445, 983-993`                                                             |

## Phase 1 — Design-system consolidation

Estimated one and a half weeks. Highest leverage in the plan, and a prerequisite for phases 2 through 5 — running those first means re-migrating the same 58 files.

The root cause is one missing token. `components/Button/Button.tsx:46-50` defines `sm`, `md` and `lg` with no `min-h`, so `sm` lands near 30px and `md` near 36px, both below the 44pt floor. Because the component is unusable for touch as shipped, the codebase routed around it.

Measured debt:

| Violation                                                     | Count                                        |
| ------------------------------------------------------------- | -------------------------------------------- |
| Hand-written `min-h-11` / `min-h-[44px]` / `min-w-11` patches | 227 across 58 files                          |
| Hand-rolled CTA and card class-string constants               | 23 across 14 files                           |
| Independent re-implementations of the primary CTA             | 15 in 15 files                               |
| Raw `<button>` in `features/` and `components/`               | 139, against 47 uses of `<Button>`           |
| Raw `<input>`                                                 | 20, against 13 uses of `<Input>` (auth only) |
| Arbitrary Tailwind values `x-[...]`                           | 176                                          |
| Radius violations of the documented radius map                | 15                                           |
| Hardcoded hex in `index.css` bypassing `@theme`               | 37, plus 71 literal `rgb()`/`rgba()`         |
| Dead component classes declared in `index.css`                | 9 of 11, zero references repo-wide           |
| Skeleton files                                                | 11 files, 1284 lines                         |

`PRIMARY_CTA` already exists in three mutually incompatible forms across `NotFoundPage.tsx:26`, `AboutPage.tsx:36`, `HelpPage.tsx:29`, `FAQPage.tsx:20`, `PressPage.tsx:19` and `CreatorsPage.tsx:33` — `min-h-11` against `min-h-[44px]`, `flex` against `inline-flex`, `text-sm font-medium` against `text-xs font-bold uppercase`. The drift is already measurable.

Work items:

1. Give `Button` real `min-h` tokens (`sm` 40, `md` 44, `lg` 48) and add a `LinkButton` or `asChild` escape hatch. Then delete the 23 constants, migrate the 139 raw buttons, and strip the 227 patches.
2. Extract one `Card` / `Panel` primitive, retiring the five duplicate `CARD` constants and the 46 `rounded-3xl` violations.
3. Extract one `SortMenu`. The Categories implementation already has `aria-haspopup`, `aria-expanded`, `aria-controls`, Escape-to-close with focus restore and an outside-click catcher; the visually identical Search implementation has none of them. Neither has arrow-key roving.
4. Extract one `SearchField`. Help, FAQ, Library and 404 each ship a different implementation, two of them byte-identical.
5. Collapse three input systems — `Input` (auth only), `FloatingInput` (profile only) and 20 raw `<input>` — into one.
6. Delete the nine dead classes in `index.css` (`.btn-primary`, `.btn-secondary`, `.btn-outline`, `.input-base`, `.card-hover`, `.tag-primary`, `.tag-accent`, `.tag-spark`, `.container-app`); `.card` and `.tag` are also unreferenced.
7. Replace hardcoded hex with tokens. `#0e9494` appears five times in `index.css` where `--color-primary-600` already exists, and once more inside a `-webkit-text-stroke` in `RankMark.tsx:17`.
8. Collapse the skeleton layer. `LibraryPageSkeleton.tsx:19-73` re-implements roughly sixty lines of `LibraryPage.tsx:288-392` verbatim, and `ProfilePageSkeleton` has already drifted from its page (`py-8/gap-8` against `py-6/gap-6`).
9. Fix the 15 genuine radius violations (`rounded-sm` / `lg` / `xl` / `full`). Follow `wiki/conventions/border-radius.md`, which bans `rounded-full` outright and uses `.shape-circle` for avatars and dots — an earlier draft of this line wrongly recommended `full` for pills. The 20px checkbox that renders as a circle (`RegisterPage.tsx:230`) is the clearest case.
10. Restore weight as a hierarchy signal. `font-bold` outnumbers `font-medium` three to one across 332 occurrences; when everything is bold, nothing is.

## Phase 2 — Funnel and retention

Estimated one week.

1. Surface the coin balance as a numeric pill in the nav at every breakpoint, and in the reader header when the series has premium episodes. It is currently rendered only on `/coins` and on the paywall for authenticated users, behind a `hidden lg:flex` icon-only nav link.
2. Add a pre-flight to locked episode rows on the detail hub: cost and current balance shown _before_ entering the reader, not after.
3. Give guests one consistent answer. The paywall routes to `/login` (`ReaderPage.tsx:595`) while the end-card routes to register (`ReaderCompletePortal.tsx:896-899`). Pick one, and show what the account is _for_ — "Sign in to unlock Ep. 12" rather than a generic headline. The `from` path is already carried and never displayed.
4. Rebuild the end-of-series moment. It is currently one line of pink text (`ReaderCompletePortal.tsx:107`) followed by a Report button, even though `nextDropForSeries` and `UpcomingDropMeta` already exist and are used on the hub. This is the product's peak-end.
5. Split every empty state into "nothing yet" and "filter matched nothing". Searching a 40-item library for an unowned title currently reports "Your library is empty" (`LibraryPage.tsx:655-663`), and filtering notifications to Promotions with 20 unread episode alerts reports "All caught up" (`NotificationsPage.tsx:127-148`). Both CTAs are labelled with the bare noun "Webtoons"; give them verbs. Use `NotFoundPage` as the model.
6. Make the episode sheet find the reader's place: `scrollIntoView({ block: 'center' })` on the current row when opened, plus a number-jump field. On a 150-episode series it currently always opens at episode 1.
7. Reduce the reader's decision surface. The bottom bar packs seven controls and the end card stacks seven co-equal blocks (rating, comments teaser, creator note, next, related, guest CTA, report).

## Phase 3 — Accessibility floor

Estimated one week.

1. Add `aria-valuenow` to the live reader progressbar; `ReaderSkeleton.tsx:88-95` already supplies it.
2. Give the reader a keyboard path. Chrome toggling is bound to `onClick` on `<main>` with no role and no key binding, and the toolbar otherwise only reappears on upward scroll, so a keyboard user who scrolls down can never recover it. Add an explicit toggle key and Escape-to-exit.
3. Complete `SearchAutocomplete`. It declares `role="listbox"` and `role="option"` but ships no `aria-activedescendant`, no arrow/Enter/Escape handling, and hardcodes `aria-selected={false}` on every option. This is the primary entry point on both Search and the Categories no-results state.
4. Add `role="radiogroup"` and `aria-checked` to reader settings, library tabs, the grid/list toggle and notification filters, all of which convey selection by colour alone. `ReadabilityControls.tsx:71-105` already does this correctly and should be copied.
5. Fix `ReaderSettingsSheet`: two `<label>` elements currently wrap nothing, the toggle groups have no accessible name, and the label colour is `text-gray-400` on white.
6. Raise contrast on cover-overlay badges to `bg-black/75` (white text on `bg-black/60` over a light cover lands near 3.6:1 at 12px bold), fix the 404 numeral (`rgb(170,228,230)` on white at 96px is roughly 1.4:1), and fix Footer `text-gray-500` on `gray-900` (roughly 3.4:1).
7. Restore focus rings on the library tabs (`LibraryPage.tsx:325` sets `focus:outline-none` with no replacement) and on the five inputs that rely on a JS-driven parent border change.
8. Raise the legal reading floor. `useLegalReadability.ts:8-13` defaults to 14px on mobile with a 12px smallest step, applied to Privacy, Terms and Cookies body copy in Burmese. Floor mobile at 16px, drop or raise the smallest step, and rename the "Contrast" group, which offers Default and Sepia and changes no contrast.
9. Stop the daily board's 1s interval from re-announcing card labels: `DailyDropCard.tsx:34-39` rebuilds its `aria-label` every tick, so an assistive-technology user focused on a card hears it continuously.
10. Add an `isComposing` guard to the comment composer, which currently posts on bare Enter and will fire mid-composition for any IME user.
11. Raise the remaining sub-44px targets. Measured live at 375px: 17 of 86 interactive elements on Home (the hero's "Start Reading" is 150x36), and 16 of 27 in the reader (ten half-star rating buttons at 24x44, "Next" at 55x32).

## Phase 4 — Information architecture and discovery

Estimated one week.

1. Collapse the rail taxonomy. Popular, Trending, Updated, New Releases, Start Here and For You are six near-synonymous buckets rendered in visually identical `text-xl` sections, and four of them require _negative_ descriptions to be told apart ("not all-time reads", "not new series", "not new episodes", "not weekly views"). Reduce to three visually distinct surfaces — a ranked chart, a time board, a personal shelf — and move the rest into the Categories sort control, which already supports every one of them.
2. Delete the radial "View all" modal from Home. Rails are capped at six items and `HomePage.tsx:413-415` passes the identical arrays into the modal, so "View all" shows the same six items one at a time — strictly less information behind an extra interaction. Search already routes correctly to `/ranking` and `/categories?sort=new`.
3. Let `CatalogStatus` own the failure message. A single failed fetch currently renders the same panel eight times down Home.
4. Split not-found from load-error in the reader. `ReaderPage.tsx:419-421` renders `NotFoundPage variant="series"` on a failed catalog fetch, misdiagnosing a network error as a deleted series, with `retry` from `useData` already in scope and unused.
5. Fix the `/faq` desktop layout, which confines the entire surface to a ~425px column and leaves roughly 950px of a 1440px viewport empty.
6. Decide what `HomeCatalogRail` is. It is named a rail and renders a grid (three stacked rows per section at 375px, roughly 21 rows before the CTA), while Continue Reading is an actual horizontal rail. Two scroll models in visually identical sections.
7. Fix the genre chip rail, which clips mid-word at both desktop and mobile with the next-arrow overlapping the clipped chip, and offers no left/back direction while the global scrollbar is hidden.

## Phase 5 — Visual identity

Estimated one and a half weeks. This is the phase that decides whether the portal beats the sites it is benchmarked against.

1. **Replace the object metaphor.** The hardcover craft is excellent and semantically wrong. The physical analogue of a vertical-scroll webtoon is a strip, a scroll, or a stacked panel run — not a bound Western book. Port the same rigour (real light modelling, real material, real physics) onto the right object, and use it in the reader and coins rather than only on catalog cards.
2. **Give the brand a typeface.** Inter is currently the app's entire type identity. A display face for titles, rails and the hero, paired with Inter for UI and Noto Sans Myanmar for body, would do more for perceived quality than any layout change. It must be selected against Burmese from the start — the `html[lang='mm']` 1.8 line-height block means the pairing cannot be retrofitted.
3. Fix the inverted hero heading semantics: the site tagline is an `<h1>` at `text-sm` while the series title, the actual visual headline, is an `<h2>` at `text-6xl`, and the empty-state branch uses a third treatment, so the page's H1 changes role with the data state.
4. **Decide on dark mode.** A vertical-scroll reading product that is light-only is unusual. The reader already carries a dark preference; nothing else does. Either commit to a full dark theme or make the reader's dark mode a deliberate, designed exception — and document which.
5. Introduce a Myanmar-specific visual layer that goes beyond a font fallback and a line-height override.
6. Give the unused `--color-spark-*` tokens a job or delete them.

## Phase 6 — Motion and polish

Estimated three days.

1. Replace `CatalogBusyPanel`, a single 64px pulsing circle standing in for a six-card grid across seven Home sections and three other skeletons. `SkeletonBookCard` and `SkeletonDailyDropCard` already exist, correctly reserve the grid shape, and are unused everywhere.
2. Fix the staggered reveal, which at mobile leaves orphan badge rectangles floating over roughly 700px of blank white for several seconds, and the detail hero, which renders blank for over three seconds and reads as a load failure.
3. Change the progress bar from `transition: width` to `transform: scaleX` (`index.css:770`) — the detector's one genuine finding.
4. Add `width` and `height` to the 19 images missing them and `loading="lazy"` to the 11 without it. `BookCard.tsx:81` is in both lists and is the primary card component.
5. Fix the `fetchPriority` casing warning, which fires once per reader panel image.
6. Fix the brightness scrim z-order: the scrim sits at `z-40` under chrome at `z-50`, so at 25% brightness the toolbars stay fully bright over a near-black page and read as a rendering fault.
7. Fix `w-[${progress}%]` in `LibraryPage.tsx:66` — an interpolated Tailwind class the JIT never emits, so that fallback bar always renders zero-width.
8. Keep chrome out of document flow in the reader: the current tap-to-toggle flips `pt-20 pb-16` to `pt-2 pb-2`, moving the page roughly 72px under the user's finger.
9. Separate the reader's gesture stack. Horizontal swipe changes episode while pinch-zoom, pan, double-tap-reset and tap-to-toggle share the same handler chain, so a right-swipe starting near the left edge is both an iOS back gesture and a previous-episode command. Exclude a ~24px edge gutter, raise the horizontal threshold, and add an undo affordance — episode change currently also discards scroll position with `behavior: 'instant'`.

---

## Sequencing

Phase 1 must land before phases 2 through 5. Phase 0 runs in parallel with Phase 1. Phases 2, 3 and 4 are independent of each other and can be interleaved. Phase 5 depends on Phase 1's token work. Phase 6 is last.

## Smaller items not assigned to a phase

Two font-size preference systems with different scales and storage keys (`useLegalReadability.ts:6` against `lib/reader/prefs`), so enlarging text in the reader has no effect on legal pages. Two sources of truth for the support email (`LegalPageShell.tsx:28` hardcodes it, `MaintenancePage.tsx:13` reads `useSettings()`). `PageHeader`'s `compact` and `document` variants render identically. `LanguageSwitcher` has a hardcoded English `aria-label` on the app's own i18n control, hides its visible label below 1280px, and calls `window.location.assign()`, discarding scroll and app state. `ProtectedRoute` and `MaintenanceGate` both flash a blank grey screen before every route's purpose-built skeleton. `hover:bg-gray-50` on non-clickable notification rows is a false affordance. The bio `<label>` has no `htmlFor`, its `<textarea>` no `id`, and its placeholder is the comment-box copy. `AuthorPage` has no breadcrumb despite the component being used on every info page. `CoinPackageCard` consults `prefersReducedMotion` for its shimmer but not its hover transform. The persisted reader `fontSize` preference has no control anywhere in the UI. `Modal` sets `aria-labelledby` only when `title` is passed, so title-less modals ship with no accessible name. The auth split card scrolls the six-field register form inside a fixed-height card on a non-scrolling page, so the submit button can sit below the inner fold with no scroll affordance. The global scrollbar is hidden on a roughly 21-screen Home page, removing the only scroll-position cue. Maintenance page renders `t('common.demo')` as the eyebrow of its outage card and offers five flat, undifferentiated CTAs with no expected return time.

## Environment finding

The committed dev default points at `localhost:3100` with `VITE_USE_MOCK_API=false`. With no API running, every catalog surface renders as a failure state and service-worker registration throws on each load, so a fresh clone's first impression is a broken app. Worth either shipping a mock-first default for `pnpm dev` or documenting the required `.env.development.local` prominently in the README.

## Out of scope for this plan

Admin CMS surfaces, API contracts, SSR and SEO behaviour, the notification delivery pipeline, and anything under `apps/api`. This plan covers `apps/portal` UI and UX only.
