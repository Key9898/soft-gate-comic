---
title: Implementation Phases 1–83
type: architecture
date: 2026-07-10
tags: [phases, qa, frontend, edc, immersive]
---

# Implementation Phases 1–83

Master record of all frontend implementation work on branch `kokey` through Impl Phase 89.
PM tracker (Airtable rows 1–91): [pm-tracker-airtable.md](../references/pm-tracker-airtable.md).

## Who reads this

| Audience  | Use                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------- |
| Teammates | What shipped, in what order, which files                                                        |
| QA        | What to verify per phase; consolidated checklist below                                          |
| AI agents | Do not redo rejected approaches — see [what-not-to-redo.md](../conventions/what-not-to-redo.md) |

## Status legend

- **Done** — implemented and in codebase
- **QA Pass** — manual verification passed
- **QA Fixed** — failed initially, fixed in later phase

## Quick index

| Impl                              | Airtable # | Date       | Title                           |
| --------------------------------- | ---------- | ---------- | ------------------------------- |
| [1](#impl-phase-1)                | 3          | 2026-07-06 | Zustand & design tokens         |
| [2](#impl-phase-2)                | 4          | 2026-07-06 | Split layout & localization     |
| [3](#impl-phase-3)                | 5          | 2026-07-06 | Showroom & detail modal         |
| [4](#impl-phase-4)                | 6          | 2026-07-06 | Avatar & chat interface         |
| [5](#impl-phase-5)                | 7          | 2026-07-06 | UI polish & testing             |
| [6](#impl-phase-6)                | 8          | 2026-07-06 | Layout, scroll & theme          |
| [7](#impl-phase-7)                | 9          | 2026-07-06 | Verification & manual QA        |
| [8](#impl-phase-8)                | 10         | 2026-07-06 | CategoryTabs & ProductCard      |
| [9](#impl-phase-9)                | 11         | 2026-07-06 | Modal layout enhancements       |
| [10](#impl-phase-10)              | 12         | 2026-07-06 | Component unit tests            |
| [11](#impl-phase-11)              | 13         | 2026-07-06 | Category scroll & modal z-index |
| [12](#impl-phase-12)              | 14         | 2026-07-06 | Final tests & build             |
| [13](#impl-phase-13)              | 15         | 2026-07-06 | Bento grid & scroll arrow       |
| [14](#impl-phase-14)              | 16         | 2026-07-06 | Production build check          |
| [15](#impl-phase-15)              | 17         | 2026-07-06 | HeaderToolbar redesign          |
| [16](#impl-phase-16)              | 18         | 2026-07-06 | Header toolbar tests            |
| [17](#impl-phase-17)              | 19         | 2026-07-06 | Individual product cards        |
| [18](#impl-phase-18)              | 20         | 2026-07-06 | ProductCard test updates        |
| [19](#impl-phase-19)              | 21         | 2026-07-06 | Image well refinements          |
| [20](#impl-phase-20)              | 22         | 2026-07-06 | Light theme default             |
| [21](#impl-phase-21)              | 23         | 2026-07-07 | API contract & types            |
| [22](#impl-phase-22)              | 24         | 2026-07-07 | Single source products          |
| [23](#impl-phase-23)              | 25         | 2026-07-07 | Avatar & video slots            |
| [24](#impl-phase-24)              | 26         | 2026-07-07 | Media wiring & autoplay         |
| [25](#impl-phase-25)              | 27         | 2026-07-07 | Showroom loading & mobile UX    |
| [26](#impl-phase-26)              | 28         | 2026-07-07 | Release & documentation         |
| [27](#impl-phase-27)              | 29         | 2026-07-07 | Dark surface foundation         |
| [28](#impl-phase-28)              | 30         | 2026-07-07 | Dark contrast                   |
| [29](#impl-phase-29)              | 31         | 2026-07-07 | Modal close UX                  |
| [30](#impl-phase-30)              | 32         | 2026-07-07 | Myanmar layout & i18n           |
| [31](#impl-phase-31)              | 33         | 2026-07-07 | Tests & QA gate                 |
| [32](#impl-phase-32)              | 34         | 2026-07-07 | Token & toolbar dark fix        |
| [34](#impl-phase-34)              | 36         | 2026-07-07 | API client & avatar integration |
| [Doc 33](#documentation-phase-33) | 35         | 2026-07-07 | Wiki, PM tracker & sessions     |

---

## Impl Phase 1 {#impl-phase-1}

**Airtable row 3** | **Done** | 2026-07-06

Setup Zustand store & design tokens.

- Installed `zustand`; created `commerceStore.ts`
- EDC brand tokens in `src/index.css` `@theme`
- `productCatalog.ts` from `public/productsImages/` assets
- Mock API adapter layer (`src/lib/api/`)
- `.env.example` for `VITE_USE_MOCK_API`

**Key files:** `src/stores/commerceStore.ts`, `src/index.css`, `src/data/productCatalog.ts`, `src/lib/api/`

---

## Impl Phase 2 {#impl-phase-2}

**Airtable row 4** | **Done** | 2026-07-06

Main split-screen layout & localization.

- `CommerceLayout`: desktop 42%/58% split; mobile tab navigation
- `AvatarPanel`, `ChatPanel`, `ShowroomPanel` scaffold
- EN/MM i18n (`src/lib/i18n/locales/`), `LanguageToggle`

**Key files:** `src/layouts/CommerceLayout.tsx`, `src/lib/i18n/`, `src/components/LanguageToggle.tsx`

---

## Impl Phase 3 {#impl-phase-3}

**Airtable row 5** | **Done** | 2026-07-06

Showroom panel & detail modal.

- `CategoryTabs`, `ProductCard`, `ShowroomPanel`
- `ProductDetailModal` via Catalyst `Dialog`
- Mock products API wired through store

**Key files:** `src/features/showroom/`, `src/lib/api/mock/products.ts`

---

## Impl Phase 4 {#impl-phase-4}

**Airtable row 6** | **Done** | 2026-07-06

Avatar video player & chat interface.

- Avatar scenario placeholders (5 scenarios)
- `ChatInput`, `ChatMessageList`, `QuickResponseChips`
- Mock chat API with product highlight support

**Key files:** `src/features/chat/`, `src/features/avatar/`, `src/lib/api/mock/chat.ts`

---

## Impl Phase 5 {#impl-phase-5}

**Airtable row 7** | **Done** | 2026-07-06

UI polish, testing & clean up.

- UI transition animations (Framer Motion on cards)
- Initial test suite; demo Catalyst files removed from app entry
- Chat textarea visible text color fix; auto-grow textarea

**Key files:** `src/features/chat/ChatInput.tsx`, `src/test/App.test.tsx`

---

## Impl Phase 6 {#impl-phase-6}

**Airtable row 8** | **Done** | 2026-07-06

UI layout, scrolling & theme optimizations.

- `CommerceLayout`: `h-dvh overflow-hidden` — internal scroll only
- Chat: auto-grow textarea, fixed message list scroll, `scrollbar-subtle`
- Dark mode: `@custom-variant dark`, `theme.ts`, `ThemeToggle`
- Viewport-fit showroom grid (`showroomGrid.ts`)
- Modal internal scroll; body overflow hidden when open

**Key files:** `src/layouts/CommerceLayout.tsx`, `src/index.css`, `src/lib/theme.ts`, `src/features/showroom/showroomGrid.ts`

---

## Impl Phase 7 {#impl-phase-7}

**Airtable row 9** | **Done** | 2026-07-06

Frontend verification & manual QA.

- `npm run check` PASS (39 tests at session end)
- Manual QA: viewports, scroll, dark mode, showroom grid

---

## Impl Phase 8 {#impl-phase-8}

**Airtable row 10** | **Done** | 2026-07-06

CategoryTabs & ProductCard refinements.

- Segmented category bar; sticky All Products + divider
- Horizontal scroll zone; navy active pill
- ProductCard: white mat, `object-contain`, hidden grid description

**Key files:** `src/features/showroom/CategoryTabs.tsx`, `ProductCard.tsx`

---

## Impl Phase 9 {#impl-phase-9}

**Airtable row 11** | **Done** | 2026-07-06

ProductDetailModal layout enhancements.

- Wider column gaps (`lg:gap-10`, `xl:gap-12`)
- Hero image `object-contain` in white mat; spec column padding

**Key files:** `src/features/showroom/ProductDetailModal.tsx`

---

## Impl Phase 10 {#impl-phase-10}

**Airtable row 12** | **Done** | 2026-07-06

Component unit testing.

- `categoryTabs.test.tsx`, `productCard.test.tsx`, `productDetailModal.test.tsx`

---

## Impl Phase 11 {#impl-phase-11}

**Airtable row 13** | **Done** | 2026-07-06

CategoryTabs scroll polish & modal backdrop fix.

- `rounded-xl` bar, `scrollbar-none`, `isolate` + `z-[1]` (not `z-10`)
- `dialog.tsx`: `z-50` — modal covers category bar

**Key files:** `CategoryTabs.tsx`, `src/components/catalyst/dialog.tsx`

---

## Impl Phase 12 {#impl-phase-12}

**Airtable row 14** | **Done** | 2026-07-06

Final test updates & build check.

- CategoryTabs + modal z-index tests; ResizeObserver guarded in jsdom
- `npm run check` deployment validation

---

## Impl Phase 13 {#impl-phase-13}

**Airtable row 15** | **Done** | 2026-07-06

Bento grid layout & category switch controls.

- Typographic `|` divider; right chevron scroll (`scrollCategoriesNext` i18n)
- Bento grid shell attempted — **reverted in Impl 17–18** (see [what-not-to-redo.md](../conventions/what-not-to-redo.md))

**Key files:** `CategoryTabs.tsx`, `ShowroomPanel.tsx` (bento reverted later)

---

## Impl Phase 14 {#impl-phase-14}

**Airtable row 16** | **Done** | 2026-07-06

Final testing & production build check.

- categoryTabs & productCard unit test updates
- `npm run check` final validation

---

## Impl Phase 15 {#impl-phase-15}

**Airtable row 17** | **Done** | 2026-07-06

HeaderToolbar design & premium controls.

- `HeaderToolbar.tsx`: unified `rounded-xl ring-1` shell
- `ThemeSwitch`: Headless.Switch, sun/moon thumb, EDC navy track
- `LanguageSegment`: Framer `layoutId="lang-pill"` sliding pill
- `headerControlsLabel` i18n

**Key files:** `HeaderToolbar.tsx`, `ThemeToggle.tsx`, `LanguageToggle.tsx`

---

## Impl Phase 16 {#impl-phase-16}

**Airtable row 18** | **Done** | 2026-07-06

Header toolbar testing & QA.

- `headerToolbar.test.tsx`; App theme test uses `getByRole('switch')`
- `npm run check`

---

## Impl Phase 17 {#impl-phase-17}

**Airtable row 19** | **Done** | 2026-07-06

Showroom grid & ProductCard redesign.

- **Reverted** bento grid (`gap-px`, outer ring shell)
- `ShowroomPanel`: `gap-2 lg:gap-3` — 6 separate bordered cards

**Key files:** `ShowroomPanel.tsx`, `ProductCard.tsx`

---

## Impl Phase 18 {#impl-phase-18}

**Airtable row 20** | **Done** | 2026-07-06

ProductCard test updates & verification.

- Tests assert no `gap-px` bento shell
- `npm run check`

---

## Impl Phase 19 {#impl-phase-19}

**Airtable row 21** | **Done** | 2026-07-06

ProductCard image well refinements.

- `ring-1` → `border`; inset image well `overflow-hidden rounded-lg`
- Highlight: `border-edc-red border-2`
- Unit test updates

**Key files:** `ProductCard.tsx`, `productCard.test.tsx`

---

## Impl Phase 20 {#impl-phase-20}

**Airtable row 22** | **Done** | 2026-07-06

Theme fallbacks & session documentation.

- `getPreferredTheme()`: **light** when no `localStorage` (no OS `prefers-color-scheme`)
- `docs/sessions/2026-07-06-session-summary.md` created
- `src/test/theme.test.ts` added
- See also [light-theme-default.md](../notes/2026-07-06-light-theme-default.md)

**Key files:** `src/lib/theme.ts`, `src/test/theme.test.ts`

---

## Impl Phase 21 {#impl-phase-21}

**Airtable row 23** | **Done** | 2026-07-07

ChatResponse/AvatarMedia types & API contracts.

- Extended `ChatResponse` (`videoUrl`, `avatarUrl`, `audioUrl`)
- `AvatarMedia` type; store fields `avatarMedia`, `productsLoadStatus`, `productsError`
- [api-contract.md](../references/api-contract.md) for backend

**Key files:** `src/types/`, `src/stores/commerceStore.ts`, `wiki/references/api-contract.md`

---

## Impl Phase 22 {#impl-phase-22}

**Airtable row 24** | **Done** | 2026-07-07

Single source `store.products`.

- `CategoryTabs` + `ProductDetailModal` use `store.products`
- `src/lib/products.ts` helpers
- `loadProducts` loading/error states + tests

**Key files:** `src/lib/products.ts`, `CategoryTabs.tsx`, `ProductDetailModal.tsx`

---

## Impl Phase 23 {#impl-phase-23}

**Airtable row 25** | **Done** | 2026-07-07

AvatarDisplay & AvatarVideoPlayer refactor.

- Static avatar slot + video-only slot
- `avatarAssets.ts`, `videoAssets.ts`, `resolveAvatarMedia.ts`

**Key files:** `src/features/avatar/`, `src/config/`

---

## Impl Phase 24 {#impl-phase-24}

**Airtable row 26** | **Done** | 2026-07-07

Store media wiring & video autoplay.

- `sendMessage` / `setLocale` update `avatarMedia`
- Mock chat returns `videoUrl`; muted video autoplay on source change

**Key files:** `src/stores/commerceStore.ts`, `src/lib/api/mock/chat.ts`

---

## Impl Phase 25 {#impl-phase-25}

**Airtable row 27** | **Done** | 2026-07-07

Showroom loading states & mobile UX.

- Loading skeleton, error retry, empty state
- Modal gallery section; gutter products in catalog
- Product highlight → mobile showroom tab + `scrollIntoView`

**Key files:** `ShowroomPanel.tsx`, `ProductDetailModal.tsx`, `ProductCard.tsx`

---

## Impl Phase 26 {#impl-phase-26}

**Airtable row 28** | **Done** | 2026-07-07

Project final release & documentation.

- `public/avatar/`, `public/videos/` gitkeep folders
- README, wiki overview, `.env.example` updated
- `npm run check` (48 tests at phase end)

---

## Impl Phase 27 {#impl-phase-27}

**Airtable row 29** | **Done** | 2026-07-07

Dark surface foundation.

- Page canvas: `dark:bg-edc-slate-800`; panels: `dark:bg-edc-slate-700`
- Modal: `dialog.tsx` EDC tokens (not `zinc-900`)
- See [dark-mode-surfaces.md](../conventions/dark-mode-surfaces.md)

**Key files:** `CommerceLayout.tsx`, `index.css`, `dialog.tsx`, `AvatarDisplay.tsx`, `ProductCard.tsx`, `CategoryTabs.tsx`, `HeaderToolbar.tsx`, `ChatInput.tsx`

---

## Impl Phase 28 {#impl-phase-28}

**Airtable row 30** | **Done** | 2026-07-07

Dark contrast adjustments.

- Category arrow: `dark:text-edc-slate-100`
- Badge zinc variant; EDC CTA buttons (`edc-navy` / `dark:edc-blue`)
- Muted text: `dark:text-slate-300` sweep

**Key files:** `CategoryTabs.tsx`, `badge.tsx`, `ChatInput.tsx`, `ProductDetailModal.tsx`

---

## Impl Phase 29 {#impl-phase-29}

**Airtable row 31** | **Done** | 2026-07-07 | **QA Pass**

Product modal close UX.

- Header × button (`aria-label` close)
- Footer `outline` close button
- Advantage labels: `line-clamp-2`

**Key files:** `ProductDetailModal.tsx`

---

## Impl Phase 30 {#impl-phase-30}

**Airtable row 32** | **Done** | 2026-07-07

Myanmar layout & i18n optimizations.

- `ShowroomPanel`: `min-w-0` + `flex-1 truncate` on subtitle
- `CategoryTabs`: `min-h-9`, tab `py-1.5` for long MM labels
- Shortened strings in `my.ts`

**Key files:** `ShowroomPanel.tsx`, `CategoryTabs.tsx`, `src/lib/i18n/locales/my.ts`

---

## Impl Phase 31 {#impl-phase-31}

**Airtable row 33** | **Done** | 2026-07-07

Tests & QA checklist validation.

- `productDetailModal.test.tsx`: close button assertions
- `categoryTabs.test.tsx`: arrow contrast class
- `npm run check` PASS — **50 tests**

---

## Impl Phase 32 {#impl-phase-32}

**Airtable row 34** | **Done** | 2026-07-07 | **QA Fixed**

Category inactive text & toolbar dark mode fix.

- Root cause: `edc-slate-300/400/500` not in `@theme` — classes had no effect
- Inactive tabs: `dark:text-slate-200`; active: `dark:bg-edc-blue`
- Toolbar: `dark:bg-edc-slate-800`, theme/language `edc-blue` accent
- See [edc-slate-tokens.md](../conventions/edc-slate-tokens.md)

**Key files:** `CategoryTabs.tsx`, `HeaderToolbar.tsx`, `ThemeToggle.tsx`, `LanguageToggle.tsx`

---

## Impl Phase 34 {#impl-phase-34}

**Airtable row 36** | **Done** | 2026-07-07

API Client, Chat Streaming & Avatar Playback Integration.

- `src/lib/api/http/base.ts` — `resolveApiUrl`, `apiFetch`, `ApiError`; production `VITE_API_BASE_URL`
- Extended `ChatRequest` (`sessionId`, `history`) and `ChatResponse` (`sessionId`, `audioUrl`)
- Optional streaming: `chatStream.ts` + `appendAvatarReplyDelta` + `isStreaming` chat UI
- `public/avatar/manifest.json` + `avatarManifest.ts` — designer drop-in registry
- `useAvatarPlayback` — unmute after interaction; separate `<audio>` for `audioUrl`
- `resolveAssetUrl` — CDN prefix for product images
- `npm run check` PASS — **64 tests**

**Key files:** `src/lib/api/http/`, `commerceStore.ts`, `avatarManifest.ts`, `useAvatarPlayback.ts`, `resolveAssetUrl.ts`, [api-contract.md](../references/api-contract.md), [avatar-manifest.md](../references/avatar-manifest.md)

---

## Impl Phase 35 {#impl-phase-35}

**Airtable row 37** | **Done** | 2026-07-07

Immersive opening canvas — sticky virtual background, avatar descend, greeting bubble, advisor corner.

- `UiPhase` in `commerceStore` (`landing` → `descend` → `greeting` → `advisor` → `showroom`)
- `src/features/immersive/` — `VirtualBackground`, `AvatarCompanion`, `SpeechBubble`, `motionVariants`, `useOpeningSequence`
- `ImmersiveLayout` replaces `CommerceLayout` in `App.tsx`
- `FloatingControls` (theme + language), floating `ChatInput` after advisor phase
- Placeholder assets under `public/immersive/`

**Key files:** `src/layouts/ImmersiveLayout.tsx`, `src/features/immersive/*`, `src/types/ui.ts`, `commerceStore.ts`

---

## Impl Phase 36 {#impl-phase-36}

**Airtable row 38** | **Done** | 2026-07-07

Advisor companion + Fast Questions.

- `FastQuestionsRail` — glass pills anchored near avatar head (replaces in-layout `QuickResponseChips` on main path)
- `AvatarVideoPlayer` logic integrated in `AvatarCompanion` (welcome video on greeting)
- `SpeechBubble` syncs with latest avatar message + streaming indicator

**Key files:** `FastQuestionsRail.tsx`, `AvatarCompanion.tsx`, `ImmersiveLayout.tsx`

---

## Impl Phase 37 {#impl-phase-37}

**Airtable row 39** | **Done** | 2026-07-07

Modern virtual showroom overlay.

- `VirtualShowroom` — glass bottom/side panel, category pills, staggered product grid
- Reveals when `uiPhase === 'showroom'` (highlights or recommendation/category chat)
- `ProductDetailModal` embedded in showroom overlay

**Key files:** `VirtualShowroom.tsx`, `motionVariants.ts` (`showroomVariants`)

---

## Impl Phase 38 {#impl-phase-38}

**Airtable row 40** | **Done** | 2026-07-07

Mobile polish, cleanup, conventions.

- Responsive avatar scale (`sm:` breakpoints), showroom `max-h` sheet on mobile
- `CommerceLayout.tsx` deleted
- `prefers-reduced-motion` shortcuts in opening sequence
- [immersive-ui.md](../conventions/immersive-ui.md) convention doc
- `npm run check` PASS

**Key files:** `ImmersiveLayout.tsx`, `AvatarCompanion.tsx`, `wiki/conventions/immersive-ui.md`

---

## Impl Phase 39 {#impl-phase-39}

**Airtable row 41** | **Done** | 2026-07-07

Immersive canvas polish & centered showroom.

- Renamed `virtual-bg.webp` → `.jpg`; updated `IMMERSIVE_ASSETS` config
- Removed floating center SVG logo from `VirtualBackground.tsx`
- Polished `AvatarCompanion` sizing, transparent styling, bubble/chip offsets
- Removed `ChatInput` from `ImmersiveLayout` (Fast Questions only)
- Refactored `FloatingControls` & `LanguageSegment` for vertical stack layout
- Repositioned `VirtualShowroom` to centered glass modal overlay (all breakpoints)
- Updated `App.test.tsx`; `npm run check` PASS; [immersive-ui.md](../conventions/immersive-ui.md) updated

**Key files:** `VirtualBackground.tsx`, `ImmersiveLayout.tsx`, `FloatingControls.tsx`, `VirtualShowroom.tsx`, `src/types/ui.ts`

---

## Impl Phase 40 {#impl-phase-40}

**Airtable row 42** | **Done** | 2026-07-07

Avatar scaling & greeting sequence integration.

- `getManifestVideoExplicit` + PNG-only greeting fallback (no SVG poster)
- Removed advisor scale shrink; larger avatar frame; layout offset adjustments
- `completeGreetingAndOpenShowroom` store trigger + i18n wiring
- Comic `SummarySpeechBubble` with custom tail (left/top directions)
- Compact EN/MM `LanguageSegment` within `FloatingControls` only
- Unit tests, wiki conventions, `npm run check` PASS

**Key files:** `commerceStore.ts`, `SummarySpeechBubble.tsx`, `avatarManifest.ts`, `AvatarCompanion.tsx`

---

## Impl Phase 41 {#impl-phase-41}

**Airtable row 43** | **Done** | 2026-07-07

AdvisorDock setup & FloatingControls redesign.

- `AdvisorDock` — avatar motion, larger frames, vertical Fast-Q column
- `showroomRevealStage` in store + `useShowroomRevealSequence` hook
- Chip stagger & slide animations; `FastQuestionsRail` / `VirtualShowroom` right dock
- `FloatingControls` redesign: `ControlPill`, `LocaleToggleButton`, Login/Logout stub, Mute
- `isAvatarMuted` wired to `useAvatarPlayback`; mute disabled when no audio source
- App/store/reveal-sequence unit tests; wiki logs; `npm run check` PASS

**Key files:** `AdvisorDock.tsx`, `useShowroomRevealSequence.ts`, `FloatingControls.tsx`, `commerceStore.ts`

---

## Impl Phase 42 {#impl-phase-42}

**Airtable row 44** | **Done** | 2026-07-07

Unified `useImmersiveSequence` hook & animation timings.

- `ImmersiveStep` enum + `motionTiming` constants in store/types
- Unified `useImmersiveSequence` chain replacing older sequence hooks
- Fade-in avatar for `AdvisorDock`; `SpeechBubbleAnchor` tuning; step-gated visibility
- `FloatingControls` delayed until correct sequence step + slide-left entrance
- `VirtualShowroom` reverted to centered, height-auto, content-fit panel with fade entrance
- `motionVariants` updates; `ImmersiveLayout` wiring; unit tests; `npm run check` PASS

**Key files:** `useImmersiveSequence.ts`, `motionTiming.ts`, `ImmersiveLayout.tsx`, `motionVariants.ts`, `types/ui.ts`

---

## Impl Phase 43 {#impl-phase-43}

**Airtable row 45** | **Done** | 2026-07-07

Callback-driven immersive sequences & AdvisorDock DOM refactoring.

- `avatarLayout.ts` constants; `greetingExit` sequence step; `motionTiming` updates
- `SpeechBubbleAnchor` absolute positioning + `AnimatePresence` enter/exit
- `AdvisorDock` single fixed `motion.div` with animated coordinates (no center/corner DOM swap)
- `useImmersiveSequence` callback-driven advance + `ImmersiveSequenceContext`
- `ImmersiveLayout` provides context; smooth corner transition without `GREETING_HOLD_MS`
- Unit tests (`greetingExit` step); wiki logs; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `AdvisorDock.tsx`, `ImmersiveSequenceContext.tsx`, `useImmersiveSequence.ts`

---

## Impl Phase 44 {#impl-phase-44}

**Airtable row 46** | **Done** | 2026-07-08

STEMWerlz UI layout integration & showroom refactoring.

- Glass utility classes in `index.css` + `glassStyles.ts` with dark variants
- `ShowroomHeroCard`, `ShowroomProductRail`, `ShowroomChrome`; rewrite `VirtualShowroom` layout
- `ShowroomAnchorContext` — `heroRef`, `ResizeObserver`, media query hooks
- Extended `avatarLayout` & `motionVariants` for dock positioning + bubble placement to main card
- `FastQuestionsRail` moved from `AdvisorDock` to `ShowroomChrome` bottom rail (horizontal)
- Gate `showroomPanel` → `ready` on panel & avatar dock callbacks; mobile auto-skip in sequence
- `AdvisorPromptsDock`; hero expand/collapse; `ProductSpecSheet` (deprecate `ProductDetailModal` on main path)
- Selected-card active indicators; `AnimatePresence` crossfades; tests; wiki; `npm run check` PASS

**Key files:** `VirtualShowroom.tsx`, `ShowroomHeroCard.tsx`, `ShowroomProductRail.tsx`, `ShowroomAnchorContext.tsx`, `ProductSpecSheet.tsx`, `glassStyles.ts`

---

## Impl Phase 46 {#impl-phase-46}

**Airtable row 48** | **Done** | 2026-07-08

SpeechBubble CTAs, typewriter effects & refactoring.

- `BubbleCta` types, `useAvatarBubbleState` hook, store CTA execution logic
- `SummarySpeechBubble` (SVG), `ThinkingBubble` (SVG), `TypewriterText`, `BubbleCtaButton`
- Bubble placements in showroom zones; layout height scroll/max-h cleanup
- CTA consumption across `AdvisorDock`, `ImmersiveLayout`, `VirtualShowroom`
- Mock API CTA payloads; unit/integration tests; wiki logs; `npm run check` PASS

**Note:** PM Phase 45 was skipped in the tracker (44 → 46).

**Key files:** `types/chat.ts`, `useAvatarBubbleState.ts`, `SummarySpeechBubble.tsx`, `commerceStore.ts`, `lib/api/mock/chat.ts`

---

## Impl Phase 47 {#impl-phase-47}

**Airtable row 49** | **Done** | 2026-07-08

`cornerHold` sequence step & consolidated `AvatarBubbleLayer`.

- `cornerHold` step; reorder `useImmersiveSequence` (catalog before chips); avatar moves 2200ms
- Catalog CTA `enterShowroom` + `openShowroomFromCorner`; defer `VirtualShowroom` display
- Removed redundant `ShowroomBubbleLayer`; scale-aware `AvatarBubbleLayer` on `AdvisorDock`
- Gate `catalogBubble` on typewriter completion; trigger product intro appropriately
- Sequence/CTA unit tests; [immersive-ui.md](../conventions/immersive-ui.md); `npm run check` PASS

**Key files:** `useImmersiveSequence.ts`, `commerceStore.ts`, `AvatarBubbleLayer.tsx`, `AdvisorDock.tsx`

---

## Impl Phase 48 {#impl-phase-48}

**Airtable row 50** | **Done** | 2026-07-08

Typewriter gating, CTA link restyling & offset alignment.

- Gate `greetingBubble` on typewriter completion; wire `catalogBubble` triggers in `AdvisorDock`
- `BubbleCtaButton` restyled to colored underlined text link
- `getBubbleShoulderInsetPx` in `avatarLayout`; negative margin offsets for positioning
- Freeze `dockRect` in `ShowroomAnchorContext`; expand showroom bubble widths outside hero
- `avatarLayout` unit tests; wiki logs; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `BubbleCtaButton.tsx`, `ShowroomAnchorContext.tsx`, `AdvisorDock.tsx`

---

## Impl Phase 49 {#impl-phase-49}

**Airtable row 51** | **Done** | 2026-07-08

SVG speech bubble tuning & re-entrance prevention.

- `fastQuestions` step handling; stable summary keys in `AvatarBubbleLayer` (skip re-entrance loops)
- Recalibrated `SummarySpeechBubble` SVG path coordinates (straighten left edge, lower tail)
- Increased `SHOWROOM_DOCK_BUBBLE_WIDTH_PX`; `instantText` rendering on swap
- Unit tests; wiki logs; `npm run check` PASS

**Key files:** `SummarySpeechBubble.tsx`, `AvatarBubbleLayer.tsx`, `avatarLayout.ts`

---

## Impl Phase 50 {#impl-phase-50}

**Airtable row 52** | **Done** | 2026-07-08

Unified speech bubble dimensions & spacing polish.

- `SPEECH_BUBBLE_WIDTH/HEIGHT` getters in `avatarLayout`; unified sizes globally
- `SummarySpeechBubble` SVG paths — compound bottom-left tail, fixed heights, text paddings
- Removed redundant showroom-only width/height overrides in `AdvisorDock`
- `AdvisorPromptsDock` min-height constraint; softened motion timings (no double-entrance glitches)
- Unit tests; wiki logs; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `SummarySpeechBubble.tsx`, `AdvisorPromptsDock.tsx`

---

## Impl Phase 51 {#impl-phase-51}

**Airtable row 53** | **Done** | 2026-07-08

SVG speech bubble asset loading & showroom CTA visibility.

- `speechBubble` in `IMMERSIVE_ASSETS` typings (`src/types/ui.ts`)
- `SummarySpeechBubble` loads static `speech-bubble.svg` + inset text padding
- `SPEECH_BUBBLE_CONTENT_INSET` in `avatarLayout.ts`
- `ThinkingBubble` standardized width/height wrapper
- Hide `enterShowroom` CTA when `immersiveStep >= showroomPanel`
- Unit tests; wiki conventions; `npm run check` PASS

**Key files:** `SummarySpeechBubble.tsx`, `avatarLayout.ts`, `types/ui.ts`, `public/immersive/speech-bubble.svg`

---

## Impl Phase 52 {#impl-phase-52}

**Airtable row 54** | **Done** | 2026-07-08

Percentage-based responsive speech bubble insets.

- `SPEECH_BUBBLE_HEIGHT_PX` 1:1 with width; ViewBox constants
- `getSpeechBubbleContentInset` — percentage-based responsive paddings
- `SummarySpeechBubble` word-wrapping fixes (`min-w-0`, `break-words`)
- Unit tests; wiki logs; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `SummarySpeechBubble.tsx`

---

## Impl Phase 53 {#impl-phase-53}

**Airtable row 55** | **Done** | 2026-07-08

Speech bubble CTA delayed reveal animation.

- `BUBBLE_CTA_FADE_MS` + `bubbleCtaRevealVariants` in motion config
- `SummarySpeechBubble` split text/CTA layouts; `ctaVisible` fade after typewriter completes
- Removed `mt-2` from `BubbleCtaButton` for parent CTA slot alignment
- Unit tests (delayed vs instant CTA); wiki logs; `npm run check` PASS

**Key files:** `SummarySpeechBubble.tsx`, `motionVariants.ts`, `BubbleCtaButton.tsx`

---

## Impl Phase 54 {#impl-phase-54}

**Airtable row 56** | **Done** | 2026-07-08

Grouped speech bubble layout & instant product intro.

- Rebalanced `SPEECH_BUBBLE_INK_INSET_VIEWBOX` vertical offsets in `avatarLayout`
- `SummarySpeechBubble` grouped center layout with inline CTA below text
- `openShowroomFromCorner` calls `showProductIntro` immediately
- `VirtualShowroom` `handleSelectProduct` triggers `showProductIntro` at showroom steps
- Unit tests; wiki logs; `npm run check` PASS

**Key files:** `SummarySpeechBubble.tsx`, `commerceStore.ts`, `VirtualShowroom.tsx`

---

## Impl Phase 55 {#impl-phase-55}

**Airtable row 57** | **Done** | 2026-07-08

SVG clip path recalculation & spacing tuning.

- `SPEECH_BUBBLE_INK_INSET_VIEWBOX` from SVG clip path coordinates (38/90/337.5/285)
- Vertically center left-aligned text in ink box; `mt-2` for CTA
- `showProductIntro` without default CTAs; strip `expandHero` from bubble resolver
- Unit tests; wiki logs; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `SummarySpeechBubble.tsx`, `useAvatarBubbleState.ts`

---

## Impl Phase 56 {#impl-phase-56}

**Airtable row 58** | **Done** | 2026-07-08

Phased staggered fade transitions & spacing cleanup.

- `SummarySpeechBubble` explicit ink bounds + `w-full justify-center` alignment
- Inner `px-2 py-2` safe padding; CTA styling rules
- Phased fade animation (avatar out → snap coordinates → avatar in → bubble fade-in)
- Showroom transition unit tests; wiki logs; manual QA on greeting/corner/dock
- `npm run check` PASS

**Key files:** `SummarySpeechBubble.tsx`, `AdvisorDock.tsx`, `motionVariants.ts`

---

## Impl Phase 57 {#impl-phase-57}

**Airtable row 59** | **Done** | 2026-07-08

SVG asset export & showroom size compensation.

- Verified exported SVG viewBox 375×375; `public/immersive/speech-bubble.svg`
- Precise coordinates `{37.8, 37.5, 108.3, 151.9}` in `avatarLayout.ts`
- `getShowroomCompensatedBubbleSizePx()` for showroom dock bubble bounds
- Text padding `px-2 py-2` → `px-1 py-1` in `SummarySpeechBubble`
- Unit tests; [immersive-ui.md](../conventions/immersive-ui.md); manual QA all 6 product intro bubbles
- `npm run check` PASS

**Key files:** `avatarLayout.ts`, `SummarySpeechBubble.tsx`, `public/immersive/speech-bubble.svg`

---

## Impl Phase 58 {#impl-phase-58}

**Airtable row 60** | **Done** | 2026-07-08

Dynamic speech bubble fontSize compensation & font parity.

- `getShowroomCompensatedFontSizePx()` + `getBubbleAvatarGapPx()` in `avatarLayout`
- Pass `isShowroomDock` & dynamic `fontSize` through `AvatarBubbleLayer` to CTA buttons
- Unified bubble copy `text-base` (16px) across breakpoints
- Unit tests; wiki conventions; visual QA greeting/corner/showroom typography
- `npm run check` PASS

**Key files:** `avatarLayout.ts`, `AvatarBubbleLayer.tsx`, `SummarySpeechBubble.tsx`

---

## Impl Phase 59 {#impl-phase-59}

**Airtable row 61** | **Done** | 2026-07-08

Height-aware speech bubble vertical alignment.

- Tail tip SVG coordinate constants; `getBubbleWrapperTopPx` helpers
- `AvatarBubbleLayer` height-aware dynamic offsets (`getBubbleWrapperTopPx(bubbleHeight)`)
- Unit tests for tail offsets & wrapper top; wiki conventions
- Visual QA all sequence steps; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `AvatarBubbleLayer.tsx`

---

## Impl Phase 60 {#impl-phase-60}

**Airtable row 62** | **Done** | 2026-07-08

Ratio-based speech bubble coordinates & 2D tail alignment.

- Dynamic frame-height ratios; `getBubbleWrapperMarginLeftPx` helpers
- 2D vector tail anchors in `AvatarBubbleLayer`; `overflow-visible` on `AdvisorDock` wrapper
- `avatarLayout` unit tests; [immersive-ui.md](../conventions/immersive-ui.md)
- Visual QA vector coordinates; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `AvatarBubbleLayer.tsx`, `AdvisorDock.tsx`

---

## Impl Phase 61 {#impl-phase-61}

**Airtable row 63** | **Done** | 2026-07-08

Clamped speech bubble viewport boundaries & spacing polish.

- `getBubbleBesideHeadTopPx`, `getClampedBubbleWrapperTopPx` in `avatarLayout`
- Wire `dockTopPx`, clamped top, gap `marginLeft` across `AvatarBubbleLayer` & `AdvisorDock`
- Unit tests; wiki conventions for conversational beside placement
- Visual QA — no top clipping on viewports; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `AvatarBubbleLayer.tsx`, `AdvisorDock.tsx`

---

## Impl Phase 62 {#impl-phase-62}

**Airtable row 64** | **Done** | 2026-07-08

Showroom category navigation & back chips.

- `ShowroomProductRail` `w-fit`; centered rail wrapper in `VirtualShowroom`
- Back chip loads full category catalog when `activeCategoryId` set
- `categoryBack` i18n (EN + Myanmar) in locale files
- `ShowroomProductRail` unit tests; wiki docs; `npm run check` PASS

**Key files:** `ShowroomProductRail.tsx`, `VirtualShowroom.tsx`, `lib/i18n/locales/en.ts`, `my.ts`

---

## Impl Phase 63 {#impl-phase-63}

**Airtable row 65** | **Done** | 2026-07-08

Combined floating ControlPill & custom theme toggles.

- `FloatingControlButton` — `size-10` bounds, EDC glassmorphic hover labels
- `ThemeIconButton`; Auth, Locale, Mute as icon-only wrappers
- Unified `ControlPill` stack (Login → Locale → Theme → Mute)
- `FloatingControls` / `ControlPill` unit tests; wiki notes; `npm run check` PASS

**Key files:** `FloatingControlButton.tsx`, `ControlPill.tsx`, `FloatingControls.tsx`, `ThemeIconButton.tsx`

---

## Impl Phase 64 {#impl-phase-64}

**Airtable row 66** | **Done** | 2026-07-08

Floating ControlPill spacing & icon polish.

- `FLOATING_CONTROL_SIZE` → `size-11`; labels `text-sm`; export icon dimensions
- `LanguageIcon` replaces `GlobeIcon`; all control icons `size-6`
- `ControlPill` padding offsets; mute disabled contrast styling
- Unit test assertions; wiki logs; `npm run check` PASS

**Key files:** `FloatingControls.tsx`, `ControlPill.tsx`, `LocaleToggleButton.tsx`

---

## Impl Phase 65 {#impl-phase-65}

**Airtable row 67** | **Done** | 2026-07-08

Speech bubble speaking top & avatar spacing nudge.

- `BUBBLE_SPEAKING_TOP_PX` & `BUBBLE_AVATAR_GAP_PX` in `avatarLayout`
- `avatarLayout.test.ts` expectations updated (64/12/48 values)
- [immersive-ui.md](../conventions/immersive-ui.md) head placement docs
- Visual QA greeting/corner/showroom; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `avatarLayout.test.ts`

---

## Impl Phase 66 {#impl-phase-66}

**Airtable row 68** | **Done** | 2026-07-08

Shoulder tail-anchoring & alignment fix.

- Shoulder tail-anchor constants; rewrite `getBubbleWrapperTopPx` & `getBubbleWrapperMarginLeftPx`
- `AvatarBubbleLayer` passes exact bubble dimensions; removed viewport clamping
- `avatarLayout.test.ts` tail-anchoring expectations
- Wiki logs; `npm run check` PASS

**Key files:** `avatarLayout.ts`, `AvatarBubbleLayer.tsx`

---

## Impl Phase 67 {#impl-phase-67}

**Airtable row 69** | **Done** | 2026-07-08

Shoulder-based 2D tail anchoring ratio tuning.

- `getAvatarShoulderTailAnchorXPx`; Y-axis ratio 0.43 for mouth alignment
- `getBubbleWrapperMarginLeftPx` shoulder-based horizontal anchors (-96 / -117 offsets)
- `avatarLayout.test.ts`; [immersive-ui.md](../conventions/immersive-ui.md) 2D tail anchors
- `npm run check` PASS

**Key files:** `avatarLayout.ts`, `AvatarBubbleLayer.tsx`

---

## Impl Phase 68 {#impl-phase-68}

**Airtable row 70** | **Done** | 2026-07-08

Hero card expansion & avatar auto-fade choreography.

- `heroExpanded` / `setHeroExpanded` in `ShowroomAnchorContext`; `VirtualShowroom` toggles
- `AdvisorDock` fades avatar + bubble when `heroExpanded`; restore on collapse
- `.scrollbar-hint` CSS + `ShowroomHeroCard` scroll viewport with `pr-4`
- `ThemeToggle` Heroicons 24 solid sun/moon icons
- `VirtualShowroom.test.tsx`; wiki notes; `npm run check` PASS

**Key files:** `ShowroomAnchorContext.tsx`, `AdvisorDock.tsx`, `ShowroomHeroCard.tsx`, `index.css`, `ThemeIconButton.tsx`

---

## Impl Phase 69 {#impl-phase-69}

**Airtable row 71** | **Done** | 2026-07-08

Transition gating & scrollbar styling polish.

- Reserve static CTA layouts in `SummarySpeechBubble`; `scrollbar-none` on ink scroller
- `catalogBubbleVisibility.ts` — gate bubble to `showroomDockPhase === 'ready'` on desktop; `instantExit` on transitions
- `index.css` — hide native scrollbar buttons/corners for `.scrollbar-hint`
- Wiki logs; `npm run check` PASS

**Key files:** `SummarySpeechBubble.tsx`, `catalogBubbleVisibility.ts`, `AdvisorDock.tsx`, `index.css`

---

## Impl Phase 70 {#impl-phase-70}

**Airtable row 72** | **Done** | 2026-07-08

Real-time i18n speech bubble re-localization.

- `bubbleCopy` on `ChatMessage` types; tag scripted dialogue in `commerceStore`
- `relocalizeBubbleMessages.ts` wired into `setLocale`
- `SummarySpeechBubble` resets `revealedCopyKey` on `copyKey` change
- Unit tests (`relocalizeBubbleMessages.test.ts`, `commerceStore.test.ts`); wiki notes
- `npm run check` PASS — **125 tests**

**Key files:** `types/chat.ts`, `commerceStore.ts`, `relocalizeBubbleMessages.ts`, `SummarySpeechBubble.tsx`

---

## Impl Phase 71 {#impl-phase-71}

**Airtable row 73** | **Done** | 2026-07-08

Instant i18n swapping & typewriter replay prevention.

- `hasPresentedCopyRef` + `showInstant` in `SummarySpeechBubble` for locale swaps
- Unit test: text changes do not replay typewriter after first presentation
- Wiki locale guidelines updated
- `npm run check` PASS — **126 tests**

**Key files:** `SummarySpeechBubble.tsx`, `wiki/conventions/immersive-ui.md`

---

## Impl Phase 73 {#impl-phase-73}

**Airtable row 75** | **Done** | 2026-07-08

Corner chips, locale toggle & hero scroll — combined bugfix batch (post-71).

- **Roofing fast chip:** `isCornerPhase()` in `types/ui.ts`; `applyChatResponse` routes corner recommendations through `openShowroomFromCorner` (avatar dock choreography) instead of `highlightProducts` + `skipToImmersiveReady`; legacy `highlightProducts` CTA in `executeBubbleCta` also routes to `openShowroomFromCorner` when in corner phase
- **Chip locale:** `bubbleCopy` kinds `chipCompany` | `chipThanks` | `chipRoofing`; i18n strings in `en.ts` / `my.ts`; mock chat uses shared relocalize helpers; `relocalizeBubbleMessages` updates chip reply text + CTA labels on `setLocale`
- **Hero scroll:** `.scrollbar-glass` in `index.css` (transparent track, hover thumb); `ShowroomHeroCard` expanded panel + bottom fade mask
- Unit tests: `commerceStore.test.ts`, `relocalizeBubbleMessages.test.ts`, `ShowroomHeroCard.test.tsx`
- `npm run check` PASS — **134 tests**

**Key files:** `types/ui.ts`, `types/chat.ts`, `commerceStore.ts`, `relocalizeBubbleMessages.ts`, `mock/chat.ts`, `index.css`, `ShowroomHeroCard.tsx`

---

## Impl Phase 74 {#impl-phase-74}

**Airtable row 76** | **Done** | 2026-07-09

Hero scroll minimal-native + company chip EN/MM parity (follow-up to Impl 73).

- **Hero scroll:** `.scrollbar-minimal` replaces `.scrollbar-glass` — 4px thumb, transparent track, no arrow buttons, `scrollbar-gutter: auto`; `ShowroomHeroCard` expanded panel
- **Company chip copy:** EN `chipReplyCompany` aligned to MM (single sentence); CTA label **"Read more about EDC"** / **"EDC အကြောင်း ပိုမိုဖတ်ရန်"**
- **Bubble layout:** CTA pinned outside ink scroll region in `SummarySpeechBubble` — EN CTA no longer clipped
- **Disabled CTA:** `BubbleCta.disabled`; company chip mock returns `disabled: true`; greyed non-clickable button
- Unit tests: `ShowroomHeroCard.test.tsx`, `SummarySpeechBubble.test.tsx`, `commerceStore.test.ts`, `relocalizeBubbleMessages.test.ts`
- `npm run check` PASS — **135 tests**

**Key files:** `index.css`, `ShowroomHeroCard.tsx`, `SummarySpeechBubble.tsx`, `BubbleCtaButton.tsx`, `types/chat.ts`, `en.ts`, `mock/chat.ts`

---

## Impl Phase 75 {#impl-phase-75}

**Airtable row 77** | **Done** | 2026-07-09

BubbleCtaButton export hotfix — white-screen regression after Phase 74.

- **Root cause:** `BubbleCtaButton` imported `useCommerceStore` but export/name mismatch broke Vite HMR graph (`does not provide an export named 'BubbleCtaButton'`)
- **Fix:** Remove store from leaf; add `onExecute` callback prop; wire via `SummarySpeechBubble` (interim — store still in bubble until Impl 76)
- **Dev recovery:** delete `node_modules/.vite`, restart `npm run dev`
- `npm run check` PASS — **135 tests**

**Key files:** `BubbleCtaButton.tsx`, `SummarySpeechBubble.tsx`

---

## Impl Phase 76 {#impl-phase-76}

**Airtable row 78** | **Done** | 2026-07-09

Bubble vertical center + typewriter restore (Canva-aligned; post-Phase 74 regression fix).

- **Dual ink layout:** Mode A (`!showCtaSlot`) — `justify-center` + inner `shrink-0`; Mode B (`showCtaSlot`) — `flex-1` text at ink top + pinned CTA
- **Typewriter contract:** `hasPresentedRef` + `presentedCopyKeyRef`; ref set only when typewriter actually finishes (not on instant locale swap); mount `useEffect` bug removed
- **Store boundary:** `useCommerceStore` moved `SummarySpeechBubble` → `AvatarBubbleLayer` (`onExecuteCta` prop)
- Regression tests: first-mount animation, mid-rerender survival, layout class assertions
- `npm run check` PASS — **137 tests**

**Key files:** `SummarySpeechBubble.tsx`, `AvatarBubbleLayer.tsx`, `SummarySpeechBubble.test.tsx`, `immersive-ui.md`

---

## Impl Phase 77 {#impl-phase-77}

**Airtable row 79** | **Done** | 2026-07-09

Floating control hover labels — sticky-after-click fix + Motion reveal.

- **Bug:** `group-focus-within` kept glass labels visible after click until blur elsewhere
- **Fix:** hover-only via Motion `whileHover` on `FloatingControlButton`; removed CSS `group-focus-within` / `group-hover` show-hide
- **Motion:** `floatingLabelVariants` — label slides outward from button (`x: 10 → 0`) + fade/scale (~220ms in / ~180ms out); `getFloatingLabelVariants()` respects `prefers-reduced-motion`
- Tests: FloatingControls hover-only contract; motionVariants `floatingLabelVariants` x/opacity
- `npm run check` PASS

**Key files:** `FloatingControlButton.tsx`, `motionVariants.ts`, `motionTiming.ts`, `FloatingControls.test.tsx`, `immersive-ui.md`

---

## Impl Phase 78 {#impl-phase-78}

**Airtable row 80** | **Done** | 2026-07-09

Floating control labels — sticky accumulation fix + Clip Path Text Reveal.

- **Bug:** after hover leave, toolbar `animate="visible"` re-applied shared `hidden`/`visible` keys → labels stuck and accumulated across controls
- **Fix:** rename variants to `labelHidden` / `labelVisible`; plain `div` + pointer enter/leave → `animate` (no `whileHover` on shared keys)
- **Motion:** clip-path wipe `inset(0 0 0 100%)` → `inset(0 0 0 0)` from button edge outward left; opacity + small `x`; `FLOATING_LABEL_MS` 360 / exit 240; reduced-motion skips wipe
- Tests: leave clears `data-hovered`; no A+B accumulation; clipPath contract; **142 tests**
- `npm run check` PASS

**Key files:** `FloatingControlButton.tsx`, `motionVariants.ts`, `motionTiming.ts`, `FloatingControls.test.tsx`, `immersive-ui.md`

---

## Impl Phase 79 {#impl-phase-79}

**Airtable row 81** | **Done** | 2026-07-09

Immersive scenario video wiring — play current `journeyState` clip (not welcome-only).

- **Bug:** `AdvisorDock` hard-wired `getManifestVideoExplicit('welcome')` + `uiPhase === 'greeting'` gate → company / category / recommendation / closing never played after designer fills manifest
- **Fix:** `resolveImmersiveVideoSrc(scenario, locale, mediaVideoSrc)` — HTTPS API/CDN override, else explicit manifest; ignore relative convention paths (no 404 video when assets missing)
- **UI:** `showVideo = Boolean(videoSrc)`; follows `useAvatarScenario().journeyState`; portrait when URL undefined
- Tests: `resolveImmersiveVideoSrc` + `AdvisorDock.video.test.tsx`; `npm run check` PASS

**Key files:** `avatarManifest.ts`, `AdvisorDock.tsx`, `avatarManifest.test.ts`, `AdvisorDock.video.test.tsx`, `immersive-ui.md`

---

## Impl Phase 80 {#impl-phase-80}

**Airtable row 82** | **Done** | 2026-07-09

Always typewriter bubble copy — Fast Q + showroom product intros.

- **Bug:** sticky `hasPresentedRef` made chip replies instant after catalog intro; AdvisorDock `instantText={showroomPanel+}` forced all dock product copy instant
- **Fix:** `showInstant = Boolean(instantText)` only; remount `TypewriterText` with `key={copyKey}`; reset CTA on copy change; remove AdvisorDock catalog `instantText`
- **Contract:** every new `copyKey` typewrites (including locale swap); `instantText` prop = explicit override only; reduced motion still instant in `TypewriterText`
- Tests: copy-change + catalog→company chip sequence typewrite; `npm run check` PASS

**Key files:** `SummarySpeechBubble.tsx`, `AdvisorDock.tsx`, `SummarySpeechBubble.test.tsx`, `immersive-ui.md`

---

## Impl Phase 81 {#impl-phase-81}

**Airtable row 83** | **Done** | 2026-07-10

3D Virtual Space — Phase 1 Lobby (Samara-like feel, not clone).

- **Stack:** `three` + `@react-three/fiber@8` + `@react-three/drei@9` (React 18 peer-compatible)
- **Default stage:** code-built warm-timber lobby (PBR floor/walls/counter/logo/door) + fixed cinematic camera + stand-in `AvatarPresenter`
- **QA:** `?mood=gallery` → clean gallery materials; `?legacy=1` → prior 2D immersive (video avatar + VirtualShowroom)
- **UI:** world-space Fast Questions (`Html`); screen-space bubbles + chat + FloatingControls; no VirtualShowroom on default path
- **Out of scope:** door open, product room, Designer GLB clips, click-to-move
- Tests: `lobby3d.test.ts`, `LobbyImmersiveShell.test.tsx`, App lobby assertions; **155** tests; `npm run check` PASS

**Key files:** `src/features/lobby3d/*`, `ImmersiveLayout.tsx`, `immersive-ui.md`

---

## Impl Phase 82 {#impl-phase-82}

**Airtable row 84** | **Done** | 2026-07-10

Lobby layout pass — brand wall, far-right door, counter Fast Q, side panels.

- **Logo:** removed counter plaque; large clean mark on warm timber **back feature wall** (alpha + anisotropy + backlight)
- **Door:** far-right corridor, visible only; emissive pulse on Enter Showroom
- **Fast Q:** Company / Support / Enter Showroom on **counter-face 3D panels** + stagger motion; legacy 2D keeps Company / Roofing / Thanks
- **Sides:** left Company + right Support wall plaques
- Enter Showroom → `openShowroomFromCorner` + door pulse; **no** VirtualShowroom on 3D path
- Tests: **157**; `npm run check` PASS

**Key files:** `LobbyEnvironment.tsx`, `ReceptionCounter.tsx`, `PortalDoor.tsx`, `FastQuestionsWorld.tsx`, `LobbySidePanels.tsx`, `getFastQuestionChips.ts`, i18n locales

---

## Impl Phase 83 {#impl-phase-83}

**Airtable row 85** | **Done** | 2026-07-10

Lobby-native sequence + logo fix + side zone relayout.

- **Sequence:** `useLobbySequence` — logo beat → greeting → Fast Q → controls (skip corner/catalog); legacy path unchanged
- **Controls gate:** `sequenceVariant: 'lobby'` so Fast Q step does not show FloatingControls early
- **Logo:** `meshBasicMaterial` + forward z + no aggressive alphaTest
- **Guidance:** `lobbyFastQHint` bubble without View-products CTA
- **Zones:** left Company/Support bay; right Products destination plaque (visual only)
- Tests: **158**; `npm run check` PASS

**Key files:** `useLobbySequence.ts`, `LobbyAdvisorChrome.tsx`, `LobbyEnvironment.tsx`, `LobbySidePanels.tsx`, `ImmersiveSequenceContext.tsx`, `FloatingControls.tsx`

---

## Impl Phase 84 {#impl-phase-84}

**Airtable row 86** | **Done** | 2026-07-10

Camera-to-zone cinematic focus on the 3D lobby.

- **Presets:** `counter` / `infoBay` / `products` in `lobbyLayout.ts`
- **API:** `focusZone` + auto-return (~900ms ease + 2.8s hold) via `LobbySceneContext`
- **Camera:** entrance dolly then position+lookAt lerp; reduced-motion snaps
- **Triggers:** Company/Support → left bay; Enter Showroom / Products plaque → right; door pulse unchanged; no VirtualShowroom
- Tests: **163**; `npm run check` PASS

**Key files:** `LobbyCamera.tsx`, `LobbySceneContext.tsx`, `lobbyLayout.ts`, `FastQuestionsWorld.tsx`, `LobbySidePanels.tsx`

---

## Impl Phase 85 {#impl-phase-85}

**Airtable row 87** | **Done** | 2026-07-10

Lobby Pass 85 Foundation (A1–A5).

- **Logo:** client PNG flush on timber; gray backing removed; soft uplights
- **Sequence:** logo-only `background` beat → avatar → greeting → hold → Fast Q
- **Fast Q:** vertical timber plaques on counter; no glass/cream ghost bleed
- **Camera:** reframed `infoBay` / `products` for room + door context
- **Bubble:** `LobbyFocusContext` shell-level; hide off-counter; strip followUp Read-more on lobby
- Out of scope: avatar travel, slide door, mood UI
- Tests: **164**; `npm run check` PASS

**Key files:** `LobbyEnvironment.tsx`, `useLobbySequence.ts`, `LobbyFocusContext.tsx`, `FastQuestionsWorld.tsx`, `LobbyAdvisorChrome.tsx`, `lobbyLayout.ts`

---

## Impl Phase 86 {#impl-phase-86}

**Airtable row 88** | **Done** | 2026-07-10

Pass 86 — Guide avatar (zone travel + choice chips).

- Avatar lerps with `cameraZone` (`AVATAR_ZONE_POS`)
- No timed auto-return; `zoneGuidePhase` idle/explaining/choosing
- Bubble visible at all zones with CSS offsets; choice chips after explain
- i18n: back / products / company-support / products arrive hint
- Out of scope: slide door, mood UI, decorated props
- Tests: **164**; `npm run check` PASS

**Key files:** `AvatarPresenter.tsx`, `LobbyFocusContext.tsx`, `LobbyAdvisorChrome.tsx`, `LobbyZoneChoiceChips.tsx`, `lobbyLayout.ts`

---

## Impl Phase 87 {#impl-phase-87}

**Airtable row 89** | **Done** | 2026-07-10

Pass 87 — Showroom dressing (C1–C3).

- Left wall: Company + Support **vignettes** with timber alcove + primitive props; timber hit labels
- Right: commercial **double slide door** (aluminum frame + frosted glass); Products plaque **beside** door
- Door pulse foreshadow only — no leaf open / no VirtualShowroom
- Atmosphere: softer light, baseboards, counter toe-kick / under-glow
- Out of scope: mood UI (Pass 88), avatar/choice logic, Designer GLB
- Tests: **165**; `npm run check` PASS

**Key files:** `LobbySidePanels.tsx`, `PortalDoor.tsx`, `LobbyEnvironment.tsx`, `ReceptionCounter.tsx`, `lobbyLayout.ts`

---

## Impl Phase 88 {#impl-phase-88}

**Airtable row 90** | **Done** | 2026-07-10

Pass 88 — Mood + chrome (D1–D2 + #3).

- FloatingControls: lobby mood toggle `warmTimber` ↔ `cleanGallery`; light/dark removed on lobby path (kept on legacy)
- Live `lobbyMood` in store; `?mood=gallery` seeds once
- Stronger HUD glass; diegetic Products plaque label; primary/secondary choice chips
- Out of scope: door open, VirtualShowroom, Designer GLB
- Tests: **169**; `npm run check` PASS

**Key files:** `commerceStore.ts`, `FloatingControls.tsx`, `LobbyMoodToggleButton.tsx`, `LobbySidePanels.tsx`, `LobbyZoneChoiceChips.tsx`, `index.css`

---

## Impl Phase 89 {#impl-phase-89}

**Airtable row 91** | **Done** | 2026-07-10

Lobby QA bugfix (Pass 85–88 follow-up).

- Enter Showroom foreshadow: `focusZone` + `pulseDoor` + `showLobbyProductsArriveHint` (no `openShowroomFromCorner` / silent `showroomPanel`)
- Zone thinking bubble visible (`showHint` allows `mode === 'thinking'`)
- Products arrive hint **appends** messages; Fast Q hint still replaces
- Mood warm icon = timber bars (not sun)
- Tests: **172**; `npm run check` PASS

**Key files:** `FastQuestionsWorld.tsx`, `LobbyAdvisorChrome.tsx`, `commerceStore.ts`, `LobbyMoodToggleButton.tsx`

---

## Impl Phase 90 {#impl-phase-90}

**Airtable row 92** | **Done** | 2026-07-10

Lobby white-screen fix (Vite HMR + React context).

- Root cause: HMR re-ran `createContext()` in `LobbySceneContext` while some consumers kept the old context → `useLobbyScene` null → ErrorBoundary / WebGL context lost
- Fix: `import.meta.hot.accept` → full `window.location.reload()` on `LobbySceneContext` + `LobbyFocusContext`
- `StandInHumanoid` theme from zustand `lobbyMood` + `getLobbyTheme` (no scene context)
- Verified: post-fix logs show store theme path; no `useLobbyScene NULL`

**Key files:** `LobbySceneContext.tsx`, `LobbyFocusContext.tsx`, `StandInHumanoid.tsx`

---

## Impl Phase 91 {#impl-phase-91}

**Airtable row 93** | **Done** | 2026-07-10

Lobby logo sharpness, opening timing, diegetic spot fixtures.

- SVG → 2048 canvas bake for wall logo (no fake 3D letters); static plane
- Dolly **800 ms** + start z **5.9**; logo beat **2800 ms**; `initialize` keeps `background` (legacy kicks `avatarFadeIn`)
- Remove counter front under-glow (Fast Q hotspot)
- Five warm-brass counter-rear spot fixtures aiming logo; remove invisible logo pointLights

**Key files:** `loadLobbyLogoTexture.ts`, `LobbyEnvironment.tsx`, `LogoSpotFixtures.tsx`, `ReceptionCounter.tsx`, `lobbyLayout.ts`, `commerceStore.ts`, `useImmersiveSequence.ts`

---

## Impl Phase 92 {#impl-phase-92}

**Airtable row 94** | **Done** | 2026-07-10

Lobby sequence pacing + Fast Q polish.

- Slower post-avatar lobby timing (`LOBBY_AVATAR_FADE_MS` 1800, greeting hold 1400, chip stagger/fade, controls 1200, typewriter 34ms/char)
- Fast Q plaque + label opacity-synced entrance (no text-only rise); wider one-line company label
- Fast Q + chat stay mounted through `controlsIn` (`isLobbyFastQSurfaceVisible` / `isLobbyChatVisible`)
- Avatar waist framing deferred (designer GLB)

**Key files:** `lobbyLayout.ts`, `FastQuestionsWorld.tsx`, `LobbyAdvisorChrome.tsx`, `ImmersiveSequenceContext.tsx`, `TypewriterText.tsx`, `motionTiming.ts`

---

## Impl Phase 93 {#impl-phase-93}

**Airtable row 95** | **Done** | 2026-07-10

Lobby Fast Q reveal beats + logo panel soft edge.

- Beats: plaques → labels+hint → chat → controls (`lobbyFastQBeat`; greeting no longer fires hint early)
- Soft contact strips + timber panel inset for logo wall edge
- Avatar waist still deferred (designer GLB)

**Key files:** `commerceStore.ts`, `useLobbySequence.ts`, `FastQuestionsWorld.tsx`, `LobbyAdvisorChrome.tsx`, `LobbyEnvironment.tsx`, `lobbyLayout.ts`

---

## Impl Phase 94 {#impl-phase-94}

**Airtable row 96** | **Done** | 2026-07-13

Welcome bubble cold-load ordering bugfix — gate opening sequence on 3D scene readiness.

- Bug: on cold/slow load the welcome bubble rendered before the 3D lobby + logo (worse under `prefers-reduced-motion`, where beat timers collapse to 0ms). Confirmed with `performance.now()` runtime logs: `welcomeBubbleVisible` fired before `onCreated`/`logoBaked` every run.
- Fix: wire the previously-unused `onSceneReady`; `LobbyImmersiveShell` holds `sceneReady` and gates `useLobbySequence({ sceneReady })`; `LobbyScene` fires `onReady` from a one-shot `useFrame` only after the first painted frame **and** the logo bake resolves.
- Safety caps: `LOBBY_SCENE_READY_SAFETY_MS` (4000), `LOBBY_LOGO_READY_SAFETY_MS` (2500) so the gate can never hang.
- Verified order: `onCreated → logoBaked → sceneReady → backgroundBeatStart → greetingReached → welcomeBubbleVisible`. Type-check clean; `useLobbySequence` tests 5/5.

**Key files:** `LobbyImmersiveShell.tsx`, `useLobbySequence.ts`, `LobbyCanvas.tsx`, `lobbyLayout.ts`

---

## Impl Phase 95 {#impl-phase-95}

**Airtable row 97** | **Done** | 2026-07-13

Lobby opening choreography restore — decouple staged reveal from `prefers-reduced-motion`.

- Bug: with Windows Animation effects / `prefers-reduced-motion: reduce`, the lobby opening felt rushed ("အလောတကြီး") — logo, avatar, welcome bubble, Fast Q plaques, chat, and controls appeared together instead of staged over ~10s.
- Root cause (3 layers): (1) **`commerceStore.initialize()`** jumped straight to `immersiveStep: 'ready'` after `loadProducts()` — entire sequence bypassed (critical, missed in prior beat-timer fix); (2) beat timers had collapsed to 0ms under reduced motion (Impl 38 shortcut); (3) camera entrance dolly + opening typewriter skipped under reduced motion.
- Fix: remove init fast-path; add `lobbyChoreography.ts` with `lobbyOpeningBeatMs()` guard on all opening beats; always run entrance camera dolly; `TypewriterText.forceAnimate` for lobby opening steps via `AvatarBubbleLayer`; 3D avatar opacity fade during `avatarFadeIn` beat (`LOBBY_AVATAR_FADE_MS`).
- Regression tests: `commerceStore.initialize.test.ts` (reduced motion → stays `background`); `useLobbySequence` reduced-motion timer tests; `lobbyChoreography.test.ts`.
- Verified: `npx tsc -b` clean; **185** tests pass (was 180).

**Key files:** `commerceStore.ts`, `lobbyChoreography.ts`, `useLobbySequence.ts`, `LobbyAdvisorChrome.tsx`, `FastQuestionsWorld.tsx`, `LobbyCanvas.tsx`, `LobbyCamera.tsx`, `AvatarPresenter.tsx`, `TypewriterText.tsx`, `AvatarBubbleLayer.tsx`

---

## Impl Phase 96 {#impl-phase-96}

**Airtable row 98** | **Done** | 2026-07-13

Side panel label gating — counter-first focal, zone-focus reveal.

- Bug: at counter home camera, left Company/Support and right Products Html labels peeked at frame edges with unreadable partial text ("Pro…"), competing with counter Fast Q plaques + hint bubble.
- Fix: `shouldShowSidePanelLabels()` in `lobbyChoreography.ts` — hide Html labels during opening beats and at `cameraZone === 'counter'`; reveal only when camera focuses `infoBay` or `products`. 3D alcove geometry (silhouette) stays visible for spatial depth.
- Tests: visibility matrix in `lobbyChoreography.test.ts` (6 tests total in file).
- Verified: `npx tsc -b` clean; **189** tests pass.

**Key files:** `lobbyChoreography.ts`, `LobbySidePanels.tsx`, `wiki/conventions/immersive-ui.md`

---

## Consolidated manual QA (2026-07-07)

| Check                                               | Result               |
| --------------------------------------------------- | -------------------- |
| Dark canvas vs panels (not black wall)              | Pass                 |
| EN/MM text, buttons, chips, arrow (no hover needed) | Pass (after Impl 32) |
| Category inactive tab labels readable               | QA Fixed (Impl 32)   |
| Toolbar bg/ring matches dark header                 | QA Fixed (Impl 32)   |
| Modal × + footer close                              | Pass                 |
| Light theme regression                              | Pass                 |
| Category scroll arrow on overflow                   | Pass                 |

## Related conventions

- [edc-slate-tokens.md](../conventions/edc-slate-tokens.md)
- [dark-mode-surfaces.md](../conventions/dark-mode-surfaces.md)
- [what-not-to-redo.md](../conventions/what-not-to-redo.md)
- [immersive-ui.md](../conventions/immersive-ui.md)

## Documentation Phase 33 {#documentation-phase-33}

**Airtable row 35** | **Done** | 2026-07-07

Architecture wiki, PM tracker mapping, and session summaries — committed knowledge base for teammates, QA, and AI agents. No application source changes.

- Created `wiki/architecture/implementation-phases.md` — full Impl Phases 1–32 with key files, QA notes, anchors
- Created `wiki/references/pm-tracker-airtable.md` — 35 Airtable rows mapped to Impl 1–32 + Doc 33
- Added convention docs: `edc-slate-tokens.md`, `dark-mode-surfaces.md`, `what-not-to-redo.md`
- Slimmed `wiki/notes/2026-07-07-phase-32-dark-token-fix.md` → pointer to conventions + master doc
- Split session logs by date: Jul 6 (Impl 1–20), Jul 7 (Impl 21–32 + Doc 33)
- Updated wiki index: `README.md`, `00-overview.md`, `02-workflow.md` (dual-track convention)

**Key files:** `wiki/architecture/implementation-phases.md`, `wiki/references/pm-tracker-airtable.md`, `wiki/conventions/*.md`, `docs/sessions/2026-07-06-session-summary.md`, `docs/sessions/2026-07-07-session-summary.md`

---

## Documentation Phase 34 {#documentation-phase-34}

**Airtable row 74** | **Done** | 2026-07-08

Immersive product scenarios architectural documentation (user PM Phase 72). No application source changes.

- Created `docs/immersive-product-scenarios.md` — Scenario 1/2/3 definitions, gap analysis, phased roadmap A/B/C, mermaid flowcharts
- Product direction: guided funnel (Scenario 1) vs conversational commerce (Scenario 2) vs mobile layout variants (Scenario 3)
- Documents technical debt: `highlightProducts` / `skipToImmersiveReady` bypass `showroomPanel` choreography
- Cross-links to `wiki/conventions/immersive-ui.md`, `commerceStore.ts`, `useImmersiveSequence.ts`

**Key files:** `docs/immersive-product-scenarios.md` (gitignored local reference)

---

## Local session evidence

| Date       | Phases                         | File                                          |
| ---------- | ------------------------------ | --------------------------------------------- |
| 2026-07-06 | Impl 1–20                      | `docs/sessions/2026-07-06-session-summary.md` |
| 2026-07-07 | Impl 21–43, Doc 33             | `docs/sessions/2026-07-07-session-summary.md` |
| 2026-07-08 | Impl 44–71, Doc 34, Impl 73–77 | `docs/sessions/2026-07-08-session-summary.md` |
| 2026-07-09 | Impl 78–80                     | `docs/sessions/2026-07-09-session-summary.md` |
| 2026-07-10 | Impl 81–89                     | `docs/sessions/2026-07-10-session-summary.md` |
