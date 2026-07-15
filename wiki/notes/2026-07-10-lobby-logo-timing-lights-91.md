---
title: Lobby logo timing lights Impl 91
type: note
date: 2026-07-10
tags: [lobby3d, logo, lighting, timing, impl-91]
---

# Lobby logo, timing, lights — Impl 91

## Shipped

- Wall logo: SVG baked to 2048-wide `CanvasTexture` (static plane; no letter meshes)
- Opening: dolly **800 ms** (start z 5.9); logo-only hold **2800 ms**; `initialize` stays on `background`
- Legacy `?legacy=1`: `useImmersiveSequence` kicks `avatarFadeIn` from `background`
- Counter front under-glow `pointLight` removed (Fast Q hotspot)
- Five warm counter-rear `spotLight`s aiming logo; old logo `pointLight`s removed
- Visible brass fixture meshes removed (lights-only; props deferred until a proper asset)

## Manual QA

1. Open site — camera approaches ~0.8s, logo sharp, no avatar ~2.8s
2. Avatar appears after logo beat only
3. Fast Q face has no circular hotspot
4. No funnel/glow fixture props on counter rear; warm logo uplight still present
