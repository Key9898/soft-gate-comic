---
title: Lobby sequence pass Impl 83
type: note
date: 2026-07-10
tags: [lobby3d, sequence, impl-83]
---

# Lobby sequence + logo + zones (Impl 83)

## Sequence

`useLobbySequence`: avatarFadeIn → greetingBubble → fastQuestions → controlsIn → cornerHold

Skips avatarCorner / catalogIntro / early controls. Legacy `useImmersiveSequence` unchanged.

## Other

- Back-wall logo visibility fix (`meshBasicMaterial`, forward z)
- Left Company/Support bay; right Products plaque (destination only)
- `lobbyFastQHint` guidance without enterShowroom CTA
- FloatingControls lobby gate via `sequenceVariant`

## Verification

- **158** tests; `npm run check` PASS
