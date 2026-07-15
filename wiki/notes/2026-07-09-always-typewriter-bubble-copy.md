---
title: Always typewriter bubble copy (Impl 80)
type: note
date: 2026-07-09
tags: [immersive, bubble, typewriter, fast-questions]
---

# Always typewriter bubble copy (Impl 80)

Committed summary. Full detail (gitignored): `docs/sessions/2026-07-09-session-summary.md`.

## Outcome

- Removed sticky `hasPresentedRef` / `presentedCopyKeyRef` that made Fast Q replies dump instantly after catalog intro.
- Removed AdvisorDock showroom blanket `instantText={showroomPanel+}` that forced product intro copy instant.
- Contract: every new `copyKey` typewrites; `instantText` prop = explicit override only; remount via `key={copyKey}`.

## Canonical wiki

- [implementation-phases.md](../architecture/implementation-phases.md) — Impl 80
- [pm-tracker-airtable.md](../references/pm-tracker-airtable.md) — row 82
- [immersive-ui.md](../conventions/immersive-ui.md) — Typewriter (Impl 80) contract
