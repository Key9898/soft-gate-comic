---
title: Immersive scenario video wiring (Impl 79)
type: note
date: 2026-07-09
tags: [immersive, avatar, video, manifest, journeyState]
---

# Immersive scenario video wiring (Impl 79)

Committed summary. Full detail (gitignored): `docs/sessions/2026-07-09-session-summary.md`.

## Outcome

- `AdvisorDock` no longer hard-wires welcome-only video or `uiPhase === 'greeting'` gate.
- `resolveImmersiveVideoSrc` — HTTPS/CDN API URL, else explicit manifest for current `journeyState`; relative convention paths ignored (no 404 video when assets missing).
- Portrait fallback when URL undefined — safe until designer fills `manifest.json`.

## Canonical wiki

- [implementation-phases.md](../architecture/implementation-phases.md) — Impl 79
- [pm-tracker-airtable.md](../references/pm-tracker-airtable.md) — row 81
- [immersive-ui.md](../conventions/immersive-ui.md) — Immersive avatar video section
- [avatar-manifest.md](../references/avatar-manifest.md) — designer deliverables
