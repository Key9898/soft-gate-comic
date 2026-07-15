---
title: Immersive UI Phases 73–76
type: note
date: 2026-07-09
tags: [immersive, bubble, typewriter, i18n, hero-scroll]
---

# Immersive UI Phases 73–76

Committed summary of the post-Impl-71 immersive bugfix batch. Full detail (gitignored): `docs/sessions/2026-07-08-session-summary.md`.

## Phase table

| Impl | Airtable | Date       | Focus                                                             | Tests   |
| ---- | -------- | ---------- | ----------------------------------------------------------------- | ------- |
| 73   | 75       | 2026-07-08 | Corner chips, locale toggle, `.scrollbar-glass`                   | 134     |
| 74   | 76       | 2026-07-09 | `.scrollbar-minimal`, company CTA pin + disabled                  | 135     |
| 75   | 77       | 2026-07-09 | `BubbleCtaButton` export hotfix (`onExecute` prop)                | 135     |
| 76   | 78       | 2026-07-09 | Dual ink layout + typewriter restore; store → `AvatarBubbleLayer` | **137** |

## Key outcomes

- Corner roofing chip uses `openShowroomFromCorner` via `isCornerPhase`.
- Chip replies re-localize (`chipCompany` / `chipThanks` / `chipRoofing`).
- Hero expanded scroll: `.scrollbar-minimal` (replaces `.scrollbar-glass`).
- Company CTA always visible, `disabled: true` in PoC.
- Bubble leaf components must not subscribe to zustand (typewriter contract).
- Text-only bubbles: `justify-center` + `shrink-0`; CTA bubbles: `flex-1` + pinned CTA.

## Canonical wiki

- [implementation-phases.md](../architecture/implementation-phases.md) — Impl 73–76 sections
- [pm-tracker-airtable.md](../references/pm-tracker-airtable.md) — rows 75–78
- [immersive-ui.md](../conventions/immersive-ui.md) — typewriter + dual layout + troubleshooting

## Documentation hygiene (same day)

Dual-track doctrine installed: always-on rule `06-documentation-hygiene.mdc`; wiki skill + `05-wiki.mdc` updated; legacy index frontmatter backfilled; agents must update `wiki/` + `docs/sessions/` after every impl batch without user asking.
