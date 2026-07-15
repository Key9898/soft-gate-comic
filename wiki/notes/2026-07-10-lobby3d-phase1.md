---
title: 3D Virtual Space Phase 1 Lobby
type: note
date: 2026-07-10
tags: [lobby3d, r3f, immersive, impl-81]
---

# 3D Virtual Space — Phase 1 Lobby (Impl 81)

Shipped a Samara-inspired (not cloned) **warm-timber 3D lobby** as the default immersive stage.

## Decisions locked

- Camera: fixed / soft cinematic; click-to-move deferred
- Mood: `warmTimber` default; `cleanGallery` via QA `?mood=gallery`
- Fast Q: world-space Html labels; chat/bubbles/controls: screen-space
- Avatar: `AvatarPresenter` + stand-in; Designer GLB later; no MP4 primary on 3D path
- Rollback: `?legacy=1` → 2D immersive
- Product showroom / door open: Phase 2+

## Key paths

- `src/features/lobby3d/` — scene, theme, QA params, AvatarPresenter, FastQuestionsWorld
- `src/layouts/ImmersiveLayout.tsx` — default vs legacy branch
- Shared chips: `getFastQuestionChips` used by 2D rail + 3D world

## Verification

- **155** tests; `npm run check` PASS
- Manual: cold load lobby, Fast Q send, `?mood=gallery`, `?legacy=1`
