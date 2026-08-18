---
title: Polish sweep — tokens, a11y, honesty copy, dead exports
date: 2026-08-13
type: note
impl: 64
tags: [tailwind, a11y, honesty, dead-code]
---

# Impl 64 — Polish sweep

## A. Tailwind classes + tokens

- `--text-2xs: 0.6875rem` + `--text-2xs--line-height: 1rem` defined in `src/index.css` `@theme` — the 7 pre-existing `text-2xs` usages (CreatorsPage, AboutPage, PressPage ×2, ContactPage ×2, PageHeader) now actually render instead of silently no-oping.
- ContactPage: invalid `border-gray-150/60` → `border-gray-200/60` (×2), `dark:text-gray-505` → `dark:text-gray-500` (×2 — the second occurrence on the message label was missed here and fixed as a post-Impl 66 errata).
- NotFoundPage: `font-black` → `font-bold` (type stack only ships 400–700; see [003-softgate-type-stack](../decisions/003-softgate-type-stack.md)).

## B. a11y

- `Button.tsx` defaults `type="button"` (destructured default — explicit `type="submit"` callers unaffected). Test added.
- Focus-visible ring pattern `focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none` (+ `rounded-2xl` where the element had no radius) applied to: Navigation logo link (was `focus:outline-none` with no replacement), desktop + mobile nav links, mobile search / menu icon buttons, notification bell, profile pill, logout buttons, mobile drawer links; LanguageSwitcher button. Footer uses `focus-visible:ring-white` on the dark background.

## C. Honesty copy

- `home.joinDescription` EN/MM rewritten without "thousands of readers" / "ထောင်ပေါင်းများစွာ" — now leads with genre discovery.
- `index.html`: meta description, og:description, twitter:description, JSON-LD description — "thousands of" removed from all 4.

## D. Dead exports removed (grep-verified before deletion)

- `src/lib/engagement`: `getEngagement` (unused wrapper), `episodeProgressPercent` (test-only; function + test block deleted), `clamp01` (now module-internal in `progress.ts`), `readEpisodeNumbersForWebtoon` (deleted in Impl 63).
- `src/lib/comments/index.ts`: `COMMENTS_SCHEMA_VERSION` re-export (storage imports it from `./types` directly).
- i18n: unused `comments.replies` key removed EN/MM (`comments.replyCount_*` is the live one).

## Checkpoint

Button / NotFoundPage / HomePage / engagementProgress suites: 31/31 pass.
