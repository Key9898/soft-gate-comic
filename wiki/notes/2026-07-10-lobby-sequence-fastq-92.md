---
title: Lobby sequence Fast Q polish Impl 92
type: note
date: 2026-07-10
tags: [lobby3d, sequence, fast-questions, impl-92]
---

# Lobby sequence + Fast Q polish — Impl 92

## Shipped

- Post-avatar pacing slowed (lobby-first): avatar fade 1800 ms, greeting hold 1400 ms, chip fade/stagger, controls slide 1200 ms, typewriter 34 ms/char
- Fast Q: plaque mesh opacity + label opacity synced; no text-only `y` rise
- Wider plaques + `whitespace-nowrap` for company label on large screens
- Fast Q + chat stay through `controlsIn` via `isLobbyFastQSurfaceVisible` / `isLobbyChatVisible`
- Avatar waist framing deferred for designer GLB

## Manual QA

1. Avatar → greeting feels a bit slower than Impl 91
2. Fast Q plaques fade in with labels together (no floating text)
3. “Tell me about the company” one line on desktop
4. Corner controls appear without Fast Q / chat blink
