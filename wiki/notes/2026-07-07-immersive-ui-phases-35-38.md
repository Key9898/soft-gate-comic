---
title: Immersive UI Phases 35–38 session
type: note
date: 2026-07-07
tags: [immersive, session, phases-35-38]
---

# Immersive UI — Impl Phases 35–38

## Delivered

- Replaced split `CommerceLayout` with single `ImmersiveLayout` (sticky virtual BG + motion layers)
- `UiPhase` store field drives opening sequence separate from `journeyState`
- Opening flow: BG fade → avatar descend → greeting (video or text) → upper-left advisor
- `FastQuestionsRail` + floating `ChatInput` after advisor phase
- `VirtualShowroom` glass overlay on product scenarios
- `CommerceLayout.tsx` removed; convention doc `wiki/conventions/immersive-ui.md`

## QA

- `npm run check` PASS — **67 tests**
- Placeholder assets: `public/immersive/` (designer swaps paths only)

## Follow-up

- Designer final `virtual-bg.webp` + transparent avatar PNG/MP4
- Manual QA on real mobile viewports

## Polish pass (same day)

- Fixed `virtual-bg.jpg` (was JPEG mislabeled as `.webp`)
- Removed center logo overlay on `VirtualBackground`
- Removed bottom `ChatInput` — Fast Questions only
- Vertical `FloatingControls`; centered `VirtualShowroom`
- Full-body avatar framing in `AvatarCompanion`

## UX refinement (same day)

- Fixed giant logo: `getManifestVideoExplicit` — PNG-only greeting, no SVG poster
- Larger avatar frames; removed advisor motion scale shrink
- Greeting → `completeGreetingAndOpenShowroom` (catalog intro + all products highlighted)
- Comic speech bubble with tail; compact **EN** / **MM** language labels

## Continued work (Impl 39–71)

Phases 39–43 (same day) and 44–71 (2026-07-08) are recorded in:

- [implementation-phases.md](../architecture/implementation-phases.md) — Impl Phase 39 through 71
- [2026-07-08 session summary](../../docs/sessions/2026-07-08-session-summary.md) (gitignored local evidence)
- [immersive-product-scenarios.md](../../docs/immersive-product-scenarios.md) — Scenario 1/2/3 product direction (Doc Phase 34)
