---
title: Lobby camera-to-zone focus Impl 84
type: note
date: 2026-07-10
tags: [lobby3d, camera, impl-84]
---

# Camera-to-zone focus (Impl 84)

## Behavior

- `focusZone('infoBay' | 'products' | 'counter')` via `LobbySceneContext`
- Company/Support (counter or left bay) → left info bay + `sendMessage`
- Enter Showroom → products framing + door pulse + `openShowroomFromCorner` (no VirtualShowroom)
- Products plaque → products framing only
- Ease ~900ms → hold ~2.8s → auto-return to counter; retarget interrupts
- Reduced motion: snap; HUD stays screen-fixed

## Key files

- `lobbyLayout.ts` — `LOBBY_CAMERA_ZONES`
- `LobbyCamera.tsx` — dolly then zone lerp
- `LobbySceneContext.tsx` — `focusZone` + auto-return
- `FastQuestionsWorld.tsx`, `LobbySidePanels.tsx`
