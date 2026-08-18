---
title: Mechanical theme sweep — dark strip, text-2xs, sepia tokens, radial wash
date: 2026-08-13
impl: 74
type: note
tags: [theme, cleanup, tokens, dark-mode, sweep]
---

# Mechanical theme sweep (Impl 74)

Batch 5 of the six-batch audit overhaul. Zero intended visual change; full suite (233 tests) green
with no test text edits.

## What changed

- **~250 legacy `dark:` utility classes stripped** from portal (light-only) files: LibraryPage,
  ProfilePage + FloatingInput/WeeklyReadingChart/AchievementsBadgeCenter, CategoriesPage, info
  cluster (Contact/About/FAQ/Press/Privacy/Terms/Cookies + LegalTocSidebar/ReadabilityControls/
  useLegalReadability), PageHeader, Breadcrumb, LibraryEmptyState, LibraryDeleteConfirmDialog,
  CoinPackageCard, TransactionHistoryRow. These never fired (portal has no `.dark` ancestor —
  `@custom-variant dark` in index.css) — pure dead weight.
  - Verify: `rg 'dark:' src --glob '!index.css'` → only `Skeleton.tsx` (`dark:` TS record key for
    the tone prop) remains.
- **Reader kept truthful**: its dark mode is state-driven (`darkMode ?` ternaries). The one real
  `dark:bg-gray-700` (brightness slider track) → `darkMode ? 'bg-gray-700' : 'bg-gray-200'` — the
  slider track now actually changes with reader theme.
- **`text-[10px]` → `text-2xs` repo-wide** (10 files, ~27 occurrences; Coins already done in
  Impl 72). Decorative `text-[8px]/[9px]` card-art sizes kept.
- **Radius drift fixes**: WebtoonDetailSkeleton badge `rounded-full` → `rounded-2xl`,
  `SkeletonText` `rounded-md` → `rounded-lg`, PressPage format tag `rounded-lg` → `rounded-2xl`
  (Soft-Expressive scale).
- **Sepia tokens**: `--color-sepia-50/200/900` in `@theme` (already landed in index.css); legal
  `LEGAL_THEME_CLASSES.sepia` hex classes (`bg-[#fcf8f2]` etc.) → `bg-sepia-50 text-sepia-900
border-sepia-200`; dead `dark:` sepia variants dropped.
- **`.radial-wash-primary` utility** in index.css (color-mix on `--color-primary-600` @ 8%)
  replaces the hand-written `bg-[radial-gradient(...rgba(14,148,148,0.08)...)]` classes on
  About / Press / Contact / Creators mastheads.
- **Convention codified**: [brand-color-tokens.md](../conventions/brand-color-tokens.md) gains a
  semantic-palette table (emerald=success, amber=warning/demo, sky=info, red=danger, Achievements
  rainbow = gamification art, vendor hexes fixed, sepia legal-only) — remaining raw colors are now
  documented decisions, not drift.

## Files

- 22 portal files (dark strip) + `ReaderPage.tsx` (ternary) + 10 files (`text-2xs`)
- `src/index.css` (radial-wash utility; sepia tokens pre-existing), `useLegalReadability.ts`,
  `Skeleton.tsx`, `WebtoonDetailSkeleton.tsx`, `PressPage.tsx`
- `wiki/conventions/brand-color-tokens.md`

## Verify

`npm run test:run` 233/233 with zero test edits; `npm run check` green; visual spot-check of
Library/Profile/Categories/info pages shows no change (light rendering identical).
