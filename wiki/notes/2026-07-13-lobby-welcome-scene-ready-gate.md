---
title: Lobby welcome bubble gated on scene readiness
type: note
date: 2026-07-13
tags: [lobby3d, sequence, r3f, loading, bugfix]
---

# Lobby welcome bubble — scene-ready gate

## Problem

On a cold localhost load the welcome bubble appeared **before** the 3D lobby /
logo panel. Warm reloads looked fine. Runtime logs (`performance.now()`) proved
`welcomeBubbleVisible` fired before `onCreated` and `logoBaked` on every run.

## Root cause

The opening sequence was purely timer-driven and the existing `onSceneReady`
plumbing was never wired. With `prefers-reduced-motion` the beat timers collapse
to `0ms`, so the DOM bubble rendered at mount — long before WebGL + the async
logo bake.

## Fix

- `LobbyImmersiveShell`: `sceneReady` state, wire `LobbyCanvas onSceneReady`,
  pass `useLobbySequence({ sceneReady })`; `LOBBY_SCENE_READY_SAFETY_MS = 4000`
  fallback opens the gate if the scene never signals.
- `useLobbySequence({ sceneReady = true })`: gates the logo/background beat.
  Default `true` keeps tests/legacy callers unchanged.
- `LobbyScene`: `onReady` fires from a one-shot `useFrame` only after the first
  painted frame **and** the logo bake resolved (`LOBBY_LOGO_READY_SAFETY_MS = 2500`).

## Verified order

`onCreated → logoBaked → sceneReady → backgroundBeatStart → greetingReached → welcomeBubbleVisible`
