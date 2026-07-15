---
title: Lobby opening choreography restore
type: note
date: 2026-07-13
tags: [lobby3d, sequence, reduced-motion, choreography, bugfix]
---

# Lobby opening choreography — prefers-reduced-motion decoupling

## Problem

With Windows **Animation effects** enabled (`prefers-reduced-motion: reduce`), the
lobby cold-open felt rushed — logo, avatar, welcome bubble, Fast Q plaques, chat
input, and corner controls appeared together instead of staged over ~10 seconds.

## Root cause (3 layers)

1. **CRITICAL:** `commerceStore.initialize()` — after `loadProducts()`, if
   `getReducedMotion()` → set `immersiveStep: 'ready'`, `lobbyFastQBeat: 'ready'`,
   start greeting + catalog. Entire choreography bypassed. This raced with
   `useLobbySequence` logo beat (Phase 94 scene-ready gate could not fix this).
2. **Beat timers:** Impl 38 shortcut collapsed logo/avatar/greeting/Fast Q beat
   timers to 0ms under reduced motion (partially fixed in prior debug session).
3. **Visual polish:** `LobbyCanvas` camera started at home (no dolly);
   `LobbyCamera.dollyDone` initialized `true` under reduced motion; opening
   bubbles used instant typewriter.

## Fix (Impl Phase 95)

- Remove `initialize()` reduced-motion fast-path — always `uiPhase: 'greeting'`,
  stay on `background`.
- `lobbyChoreography.ts`: `lobbyOpeningBeatMs()`, `isLobbyOpeningStep()` — guard
  against re-introducing `getReducedMotion() ? 0` on opening beats.
- Camera: always start at `LOBBY_CAMERA_START`; entrance dolly always runs.
- `TypewriterText.forceAnimate` for lobby opening steps via `AvatarBubbleLayer`.
- `AvatarPresenter`: opacity 0→1 rAF fade during `avatarFadeIn` beat.

## Regression tests

- `commerceStore.initialize.test.ts` — reduced motion → `background`, not `ready`.
- `useLobbySequence.test.tsx` — logo beat + greeting hold full ms with reduced motion.
- `lobbyChoreography.test.ts` — guard helpers.

## Verification

- `npx tsc -b` clean; 185 tests pass.
- Manual: hard reload → logo ~2.8s → avatar fade ~1.8s → welcome typewriter →
  plaques stagger → labels → chat → controls (~10s total).

## Key files

- `src/stores/commerceStore.ts`
- `src/features/lobby3d/lobbyChoreography.ts`
- `src/features/lobby3d/useLobbySequence.ts`
- `src/features/lobby3d/LobbyAdvisorChrome.tsx`
- `src/features/lobby3d/FastQuestionsWorld.tsx`
- `src/features/lobby3d/LobbyCanvas.tsx`
- `src/features/lobby3d/LobbyCamera.tsx`
- `src/features/lobby3d/AvatarPresenter.tsx`
- `src/features/immersive/bubbles/TypewriterText.tsx`
- `src/features/immersive/AvatarBubbleLayer.tsx`
