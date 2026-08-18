---
title: Reader celebration truth — real title, real time, i18n
date: 2026-08-13
impl: 69
type: note
tags: [reader, honesty, i18n, celebration]
---

# Reader celebration truth (Impl 69)

Batch 1 of the six-batch audit overhaul. The Chapter Complete celebration portal in
`src/features/reader/ReaderPage.tsx` showed fake data; all four issues fixed.

## What changed

| Issue              | Before                                                                | After                                                                                                                                               |
| ------------------ | --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Next episode title | Hardcoded `Chapter Continuation`                                      | `nextEpisode.title[lang]` (`episodes.find(... episodeNumber + 1)`)                                                                                  |
| Title contrast     | Fixed `text-gray-100` (invisible on light card)                       | `darkMode ? 'text-gray-100' : 'text-gray-900'`                                                                                                      |
| Reading time       | Hardcoded `3 mins`                                                    | `totalEstMinutes` computed in the scroll effect from `scrollHeight` (same 3000px/min model as the HUD estimator), rendered via `readerPage.minutes` |
| Hardcoded strings  | `Episode {n}`, `Ep. {n}`, `You have reached the end of this webtoon!` | `readerPage.episodeN` / `epShort` / `endOfSeries` (EN + MM)                                                                                         |

## Files

- `src/features/reader/ReaderPage.tsx` — `nextEpisode` lookup, `totalEstMinutes` state, 4 render fixes
- `src/lib/i18n/locales/en/translation.json`, `mm/translation.json` — `readerPage.episodeN/epShort/minutes/endOfSeries`
- `src/test/ReaderCelebration.test.tsx` — new (real next title rendered, no "Chapter Continuation", computed minutes, endOfSeries key resolves in both locales)

## Verify

`npm run check` — all green. Manually: read a free episode to the end → celebration card shows the actual next episode title in both locales.
