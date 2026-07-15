---
title: Lobby side panel label gating at counter
type: note
date: 2026-07-13
tags: [lobby3d, ux, side-panels, counter, focal]
---

# Side panel label gating — counter-first focal

## Problem

At the counter home camera (`LOBBY_CAMERA_ZONES.counter`, `fov: 42`), left
Company/Support and right Products Html labels peeked at frame edges with
unreadable partial text ("Pro…", "the", "ort"). This competed with the intended
primary CTA — counter Fast Q plaques and the hint bubble ("Choose a question on
the counter").

## Design decision (Option C)

| Layer                                        | Counter / opening           | Zone focused             |
| -------------------------------------------- | --------------------------- | ------------------------ |
| 3D geometry (alcove, vignettes, plaque wood) | Always visible (silhouette) | Same                     |
| Html labels                                  | Hidden                      | Visible on matching zone |
| Click targets                                | Not in DOM when hidden      | Interactive              |

No camera FOV change — label gating alone fixes unreadable edge text without
re-framing logo/counter regressions.

## Implementation

`shouldShowSidePanelLabels(immersiveStep, cameraZone, panel)` in
`lobbyChoreography.ts`:

- Opening beats (`background` → `cornerHold`): labels off
- Post-opening at `cameraZone === 'counter'`: labels off
- `focusZone('infoBay')`: Company + Support labels on
- `focusZone('products')`: Products label on

`LobbySidePanels.tsx` conditionally renders Html labels; 3D meshes unchanged.

## Verification

- `lobbyChoreography.test.ts` visibility matrix (6 tests)
- Manual: counter home shows wood silhouette only; zone focus reveals labels

## Key files

- `src/features/lobby3d/lobbyChoreography.ts`
- `src/features/lobby3d/LobbySidePanels.tsx`
- `wiki/conventions/immersive-ui.md`
