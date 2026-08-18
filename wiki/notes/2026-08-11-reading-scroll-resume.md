---
title: Reading scroll-depth resume
type: note
date: 2026-08-11
tags: [reader, engagement, continue, scroll]
impl: 41
---

# Impl 41 — SoftGate Comic reading scroll resume

## What shipped

- `HistoryRecord.scrollRatio` + `ENGAGEMENT_SCHEMA_VERSION = 2`; v1→v2 migrate-in-place (`scrollRatio: 0`)
- `updateReadingProgress` in engagement store + `EngagementContext`
- Reader: throttled (~1s) persist + flush on `visibilitychange` hidden / unmount / episode change; no writes when premium-locked
- Reader restore when matching episode `scrollRatio > 0.02`
- Home Continue + Library History use `blendedProgressPercent`; complete series hidden via `isSeriesCompleteForContinue`
- Pure scroll metric helpers + unit tests (migrate, blend, metrics)

## Manual QA

1. Sign in → open an episode → scroll mid-way → leave Reader
2. Home Continue bar should be partial (not episode-only jump)
3. Re-open same episode → land near the same scroll depth

## Verify

`npm run check`

## Next Impl

**42**
