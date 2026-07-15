---
title: Lobby Fast Q beats logo edge Impl 93
type: note
date: 2026-07-10
tags: [lobby3d, sequence, fast-questions, lighting, impl-93]
---

# Lobby Fast Q beats + logo edge — Impl 93

## Shipped

- `lobbyFastQBeat`: `plaques` → `labelsHint` → `chat` → `ready` / `controlsIn`
- Greeting hold advances to Fast Q **without** early `showLobbyFastQHint`
- Labels + “Choose a question” together; then chat; then corner controls
- Timber logo panel inset (`z≈-3.12`) so wall/panel coplanar hairline is gone
- Edge contact: **canvas alpha-gradient** strips on wall face (`z≈-3.088`), narrow (~0.1), peak α≈0.2 — not flat opaque planes (those read as a dark sticker band)

## Manual QA

1. Greeting → empty plaques stagger top→bottom
2. Then labels fade + hint bubble (no chat yet)
3. Then Type your message → then right-corner buttons
4. Logo panel left edge: soft contact shadow only — no hairline, no thick dark falloff band
