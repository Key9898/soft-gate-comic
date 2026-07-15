---
title: Immersive UI conventions
type: convention
date: 2026-07-10
tags: [immersive, ui, motion, layout, glass, bubble, lobby3d, r3f]
---

# Immersive UI conventions

## Single layout entry

- `App.tsx` renders **`ImmersiveLayout`** only — no split header/grid shell.
- **Default (Impl 81):** 3D lobby via `LobbyImmersiveShell` (`src/features/lobby3d/`)
- **QA rollback:** `?legacy=1` restores 2D path (`VirtualBackground` + `AdvisorDock` video + `VirtualShowroom`)
- **QA mood:** `?mood=gallery` seeds `lobbyMood` once; FloatingControls toggles live `warmTimber` ↔ `cleanGallery`

## 3D lobby (Impl 81–89)

| Piece                    | Behavior                                                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Opening sequence (lobby) | Logo-only beat (no avatar) → avatar → greeting → hold → vertical Fast Q → controls                                                                     |
| Logo                     | Client PNG flush on timber + soft uplights (no gray backing)                                                                                           |
| Fast Q                   | Vertical timber plaques — Company / Support / Enter Showroom (**foreshadow**: pulse + products hint, not showroomPanel)                                |
| Info bay (left)          | Company + Support **vignettes** (alcove + props); timber hit labels → `infoBay` focus — **labels hidden at counter/opening**, revealed on zone focus   |
| Products (right)         | Commercial **slide door** (pulse only) + diegetic Products plaque beside door — **label hidden at counter/opening**, revealed on `products` zone focus |
| Atmosphere               | Soft key/ambient; baseboards; counter toe-kick + under-glow                                                                                            |
| Mood                     | FloatingControls toggles `warmTimber` ↔ `cleanGallery` (no light/dark on lobby path)                                                                   |
| HUD chrome               | Stronger glass; choice chips primary (navy) / secondary (glass); thinking bubble off-counter                                                           |
| Camera zones             | `LobbyFocusContext`; no timed auto-return — choice chips drive next focus                                                                              |
| Avatar                   | Travels with zone (`AVATAR_ZONE_POS`); bubble zone-safe CSS offsets                                                                                    |
| Zone choices             | After explain: Back to counter / Go to Products (or Company & Support)                                                                                 |
| Guidance                 | `lobbyFastQHint` after greeting hold — no View-products CTA                                                                                            |
| Controls gate            | `sequenceVariant: 'lobby'` — hidden during Fast Q                                                                                                      |
| Legacy                   | `?legacy=1` keeps 2D order + light/dark ThemeIconButton + Company/Roofing/Thanks                                                                       |

## UiPhase vs immersiveStep

| Field           | Purpose                                                     |
| --------------- | ----------------------------------------------------------- |
| `uiPhase`       | Layout mode (`landing` → `greeting` → `showroom`)           |
| `immersiveStep` | Opening choreography state machine (`background` → `ready`) |
| `journeyState`  | API/avatar scenario (`welcome`, `recommendation`, …)        |

Orchestrator: `useImmersiveSequence` + `ImmersiveSequenceContext` — components call `onStepComplete(step)` when their animation finishes.

## Immersive avatar video (legacy 2D path only)

- Applies when `?legacy=1` — `AdvisorDock` video companion
- **Source:** `resolveImmersiveVideoSrc(journeyState, locale, avatarMedia.videoSrc)` — HTTPS/CDN API URL wins; else `getManifestVideoExplicit` for the **current** scenario (not welcome-only)
- **Never** mount convention `/videos/{scenario}-{locale}.mp4` in immersive when manifest is null (avoids 404 `<video>`)
- **Show:** `Boolean(videoSrc)` — no `uiPhase === 'greeting'` gate so chip replies (company / closing / …) can play after greeting
- **Fallback:** static portrait / placeholder when URL undefined
- Legacy `AvatarVideoPlayer` may still use convention paths; immersive companion does not
- **3D lobby default:** MP4 is not the primary avatar — stand-in / future Designer GLB

## Opening choreography (`immersiveStep`)

1. `background` — virtual background only
2. `avatarFadeIn` — avatar fades in at center (2200ms corner/dock moves elsewhere)
3. `greetingBubble` — welcome summary bubble beside head; **typewriter completes** → next step
4. `controlsIn` — top-right `FloatingControls` stack slides in (Login → Language → Theme → Mute); uniform `size-11` icon buttons (`size-6` icons) with EDC glass hover labels (`text-sm`) to the left — **hover-only** via pointer state (`data-hovered`); Motion `floatingLabelVariants` uses **`labelHidden` / `labelVisible`** (never toolbar `hidden`/`visible`) with **clip-path text reveal** from button edge (`inset(0 0 0 100%)` → `inset(0 0 0 0)`, ~360ms); leave clears label (no accumulation); no `group-focus-within`; theme uses Heroicons 24 solid sun/moon (`ThemeIconButton`)
5. `greetingExit` — greeting bubble fades out
6. `avatarCorner` — avatar moves to top-left corner (~2200ms); then catalog intro message
7. `catalogBubble` — company/products summary + **View products** CTA (text link); typewriter completes → next step
8. `fastQuestions` — chips stagger below avatar
9. `cornerHold` — avatar waits at corner; user must tap CTA to open showroom
10. `showroomPanel` — hero fades in; frozen `dockRect` captured; avatar **fade out** at corner → snap → **fade in** at dock (no slide); product bubble **fade in after** avatar enter
11. `ready` — full interactive state

`VirtualShowroom` mounts only from `showroomPanel` onward (not during corner phase).

## Avatar speech bubbles

| Mode       | Component             | When                                   |
| ---------- | --------------------- | -------------------------------------- |
| `thinking` | `ThinkingBubble`      | `isChatLoading` awaiting reply         |
| `summary`  | `SummarySpeechBubble` | Greeting, catalog, product intro, chat |
| `hidden`   | —                     | No bubble context                      |

- **Asset:** `IMMERSIVE_ASSETS.speechBubble` (`/immersive/speech-bubble.svg`) — Canva export with bottom-left tail; `thinking-bubble.svg` not wired yet
- **Typewriter (Impl 80):** ~28ms/char; **every new `copyKey` typewrites** (Fast Q replies, product intro, locale EN↔MM swap); no sticky `hasPresentedRef` / `presentedCopyKeyRef`; AdvisorDock must **not** pass `instantText` (no showroom blanket instant); `instantText` prop = explicit override only (tests); `prefers-reduced-motion` still instant inside `TypewriterText` **except** lobby opening steps (`isLobbyOpeningStep` → `forceAnimate` via `AvatarBubbleLayer`); remount via `key={copyKey}`; CTA resets on copy change until typewriter completes; greeting/catalog steps still advance after typewriter; **no zustand in bubble leaf** (`SummarySpeechBubble`, `TypewriterText`, `BubbleCtaButton`) — store subscription lives in `AvatarBubbleLayer` via `onExecuteCta`
- **Placement:** always **`AvatarBubbleLayer`** child of `AdvisorDock` motion div — moves with avatar
- **Text layout:** Canva-measured ink insets (`SPEECH_BUBBLE_INK_INSET_VIEWBOX`: left 37.8, right 37.5, top 108.3, bottom 151.9 on 375 viewBox); **no CTA:** outer `justify-center` + inner `shrink-0` scroller (vertical center); **with CTA:** `flex-1` text region at ink top + `shrink-0` CTA slot below; text-left `w-full` copy + `px-1 py-1` safe padding; CTA margin under last line after typewriter (`getBubbleCtaMarginTopPx`); ink scroller uses `scrollbar-none` (no visible bar)
- **Typography:** `BUBBLE_COPY_FONT_PX` (16) via `text-base` on greeting/corner; showroom dock uses `getShowroomCompensatedFontSizePx()` (`16 / AVATAR_SHOWROOM_SCALE`) so copy stays 16px visual after parent `scale(0.45)`
- **Showroom dock motion:** `AdvisorDock` phased fade (`exiting` → snap → `entering` → `ready`); catalog bubble gated via `catalogBubbleVisibility.ts` — on desktop, bubble shows only when `showroomDockPhase === 'ready'`; `instantExit` on dock transition; no `left/top` slide tween
- **Product intro:** `showProductIntro` sets description only (no bubble CTA); `openShowroomFromCorner` + rail `onSelectProduct` sync copy at `showroomPanel+`
- **CTA reveal:** CTA row reserved in layout during typewriter (`invisible`); fades in (`bubbleCtaRevealVariants`, 400ms) after `TypewriterText` completes; `instantText` / reduced motion shows immediately
- **Size:** unified square `SPEECH_BUBBLE_WIDTH_PX` × `SPEECH_BUBBLE_HEIGHT_PX` (320/360); showroom dock uses `getShowroomCompensatedBubbleSizePx()` (`base / AVATAR_SHOWROOM_SCALE`) so visual size matches corner after parent `scale(0.45)`; `ThinkingBubble` uses the same outer box
- **Persistence:** catalog bubble stays visible through `fastQuestions` and `cornerHold` (no unmount flicker)
- **Locale:** scripted bubble messages carry `bubbleCopy` (`welcome` | `catalogIntro` | `productIntro` | `chipCompany` | `chipThanks` | `chipRoofing`); `setLocale` calls `relocalizeBubbleMessages()` for tagged copy + showroom CTA labels; chip replies re-localize on EN ↔ MM toggle; company chip CTA pinned below ink scroll (always visible); company CTA `disabled: true` in PoC; locale swap changes `copyKey` → typewrites again (Impl 80); untagged free-form chat replies are not re-translated
- **Head placement:** 2D tail-anchored at avatar shoulder — `getBubbleWrapperTopPx(height)` aligns tail tip Y to `AVATAR_SHOULDER_TAIL_ANCHOR_RATIO` (0.43); `getBubbleWrapperMarginLeftPx(isShowroomDock, width)` aligns tail tip X to `getAvatarShoulderTailAnchorXPx()` (`frameWidth - BUBBLE_SHOULDER_INSET_PX`, minus `BUBBLE_TAIL_SHOULDER_GAP_PX`); negative `marginLeft` is intentional; corner uses same tail anchor (no viewport clamp); bubble top may clip slightly at viewport edge
- **Dock target:** `ShowroomAnchorContext.dockRect` frozen when hero entrance completes (no mid-fade rect drift)
- **CTA:** text link (`underline`, `text-edc-navy`, `text-left`); `enterShowroom` → `openShowroomFromCorner()` — visible only at corner (`catalogBubble` through `cornerHold`); `enterShowroom` and `expandHero` hidden from `showroomPanel` onward via `resolveBubbleCta()`

## Motion timing (`motionTiming.ts`)

| Constant                  | Value | Use                                |
| ------------------------- | ----- | ---------------------------------- |
| `CORNER_MOVE_MS`          | 2200  | Center → corner                    |
| `AVATAR_SHOWROOM_DOCK_MS` | 2200  | Corner → hero dock                 |
| Typewriter delay          | 0.028 | Per character (not in timing file) |

## Virtual Showroom

- **Bottom rail:** `ShowroomProductRail` — `w-fit max-w-full`, centered in `VirtualShowroom` (`flex justify-center`); category drill-down shows **Back** chip (returns to All Products) instead of "All Products" label when filtered
- **Hero:** expandable in-place; `ProductSpecSheet` for heavy images; **View details** sets `heroExpanded` in `ShowroomAnchorContext` — avatar + bubble fade out; **Show less** restores showroom dock; expanded scroll panel uses `.scrollbar-minimal` (transparent track, 4px hover thumb, bottom fade mask) — no classic arrow/track gutter where OS allows
- **Fast questions:** `AdvisorPromptsDock` reserves `FAST_QUESTIONS_SLOT_MIN_HEIGHT_PX` from `catalogBubble`; chips fade+slide gently (`CHIP_STAGGER_S` 0.16); roofing recommendation at corner uses `openShowroomFromCorner` (same choreography as **View products in showroom** CTA) via `isCornerPhase` in `applyChatResponse`

## Reuse

- Store: `showCatalogIntro`, `showProductIntro`, `openShowroomFromCorner`, `executeBubbleCta`, `pendingShowroomAction`; corner-phase recommendations route through `openShowroomFromCorner` (not `highlightProducts` + `skipToImmersiveReady`)
- Locale: `stores/relocalizeBubbleMessages.ts` — re-tag scripted `bubbleCopy` messages on `setLocale`
- Visibility: `catalogBubbleVisibility.ts` — showroom dock bubble gating
- Layout: `avatarLayout.ts` — `SPEECH_BUBBLE_*` dimensions, shoulder inset, dock position, fast-questions slot
- Legacy `ProductDetailModal` for `ShowroomPanel` only

## Troubleshooting

- **White screen after bubble CTA changes:** delete `node_modules/.vite`, restart `npm run dev` — Vite HMR can cache stale module graphs after export renames (see Impl 75)
- **Typewriter skips mid-sequence:** bubble leaf components (`SummarySpeechBubble`, `TypewriterText`, `BubbleCtaButton`) must not import zustand — store subscription lives in `AvatarBubbleLayer` via `onExecuteCta` (see Impl 76)
- **Typewriter dumps on chip / showroom product:** do not reintroduce sticky `hasPresentedRef` or AdvisorDock `instantText={showroomPanel+}` — every new copy must typewrite (Impl 80)
