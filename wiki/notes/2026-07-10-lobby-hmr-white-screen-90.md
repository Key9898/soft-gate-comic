---
title: Lobby HMR white-screen fix Impl 90
type: note
date: 2026-07-10
tags: [lobby3d, bugfix, hmr, react-context, impl-90]
---

# Lobby HMR white-screen fix — Impl 90

## Symptom

White screen before logo; console `useLobbyScene must be used within LobbySceneProvider` from `StandInHumanoid`, then `THREE.WebGLRenderer: Context Lost`.

## Root cause

Vite HMR re-evaluated `LobbySceneContext.tsx`, creating a **new** `createContext()` while some R3F consumers still held the previous context object. Provider appeared in the React tree, but `useContext` returned `null`.

## Fix

1. `LobbySceneContext` / `LobbyFocusContext`: on HMR accept → `window.location.reload()`
2. `StandInHumanoid`: theme from `lobbyMood` store + `getLobbyTheme` (avoids scene context on the crash path)

## Note

Long-lived `npm run dev` + many lobby edits increases HMR drift risk; full reload on context modules is intentional.
