---
title: Airtable PM Tracker — EDC Thailand AI Commerce
type: reference
date: 2026-07-10
tags: [pm, airtable, qa, phases]
---

# Airtable PM Tracker

Project management phase list for **EDC Thailand AI Commerce Frontend POC**.  
Canonical implementation detail: [implementation-phases.md](../architecture/implementation-phases.md).

## Numbering

| Airtable row | Maps to                                                                  |
| ------------ | ------------------------------------------------------------------------ |
| 1–2          | PM setup only (no implementation phase)                                  |
| 3–34         | Implementation Phase 1–32 (`row # = 2 + Impl Phase`)                     |
| 35           | Documentation Phase 33 (wiki & session summaries)                        |
| 36           | Implementation Phase 34 (integration readiness)                          |
| 37–40        | Implementation Phase 35–38 (immersive UI redesign)                       |
| 41–45        | Implementation Phase 39–43 (immersive polish & sequence)                 |
| 46–73        | Implementation Phase 44–71 (showroom, bubbles, controls, i18n)           |
| 74           | Documentation Phase 34 (immersive product scenarios)                     |
| 75           | Implementation Phase 73 (corner chips, locale toggle, hero scroll)       |
| 76           | Implementation Phase 74 (hero scroll minimal-native, company CTA parity) |
| 77           | Implementation Phase 75 (BubbleCtaButton export hotfix)                  |
| 78           | Implementation Phase 76 (bubble center + typewriter restore)             |
| 79           | Implementation Phase 77 (floating label hover-only + Motion reveal)      |
| 80           | Implementation Phase 78 (label sticky fix + clip-path text reveal)       |
| 81           | Implementation Phase 79 (immersive scenario video wiring)                |
| 82           | Implementation Phase 80 (always typewriter bubble copy)                  |
| 83           | Implementation Phase 81 (3D Virtual Space Phase 1 Lobby)                 |
| 84           | Implementation Phase 82 (lobby layout pass)                              |
| 85           | Implementation Phase 83 (lobby sequence + logo + zones)                  |
| 86           | Implementation Phase 84 (camera-to-zone focus)                           |
| 87           | Implementation Phase 85 (lobby foundation polish Pass 85)                |
| 88           | Implementation Phase 86 (guide avatar Pass 86)                           |
| 89           | Implementation Phase 87 (showroom dressing Pass 87)                      |
| 90           | Implementation Phase 88 (mood + chrome Pass 88)                          |
| 91           | Implementation Phase 89 (lobby QA bugfix)                                |

## Full tracker

| #   | Task                                                                | Status | Priority | Date       | Mapping                                                                   | Notes                                                                   |
| --- | ------------------------------------------------------------------- | ------ | -------- | ---------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| 1   | Analyze UI/UX client requirements                                   | Done   | P0       | 2026-07-06 | PM-only                                                                   | Client PDFs နှင့်အချက်အလက်များ ဆန်းစစ်မှု ပြီးစီး                       |
| 2   | Clone project & Setup asset directories                             | Done   | P0       | 2026-07-06 | PM-only                                                                   | Branch ခွဲခြင်း၊ clientData → `/public` နှင့် `/docs`                   |
| 3   | Phase 1: Setup Zustand store & Design tokens                        | Done   | P0       | 2026-07-06 | [Impl 1](../architecture/implementation-phases.md#impl-phase-1)           | Zustand, EDC tokens in `index.css`, `productCatalog.ts`                 |
| 4   | Phase 2: Main Split-Screen Layout & Localization                    | Done   | P0       | 2026-07-06 | [Impl 2](../architecture/implementation-phases.md#impl-phase-2)           | Desktop split + mobile tabs, EN/MM toggle                               |
| 5   | Phase 3: Showroom Panel & Detail Modal                              | Done   | P0       | 2026-07-06 | [Impl 3](../architecture/implementation-phases.md#impl-phase-3)           | Category tabs, cards, Catalyst Dialog, mock products API                |
| 6   | Phase 4: Avatar Video Player & Chat Interface                       | Done   | P0       | 2026-07-06 | [Impl 4](../architecture/implementation-phases.md#impl-phase-4)           | 5 scenario avatar transitions, chat + quick chips                       |
| 7   | Phase 5: UI Polish, Testing & Clean Up                              | Done   | P0       | 2026-07-06 | [Impl 5](../architecture/implementation-phases.md#impl-phase-5)           | Animations, tests, demo cleanup, commit                                 |
| 8   | Phase 6: UI Layout, Scrolling & Theme Optimizations                 | Done   | P0       | 2026-07-06 | [Impl 6](../architecture/implementation-phases.md#impl-phase-6)           | Layout lock, autogrow, scrollbar utils, dark mode, viewport grid        |
| 9   | Phase 7: Frontend Verification & Manual QA                          | Done   | P0       | 2026-07-06 | [Impl 7](../architecture/implementation-phases.md#impl-phase-7)           | `npm run check`, viewport/scroll/dark/showroom QA                       |
| 10  | Phase 8: CategoryTabs & ProductCard Refinements                     | Done   | P0       | 2026-07-06 | [Impl 8](../architecture/implementation-phases.md#impl-phase-8)           | Pill ring, divider, scroll mask, segmented active                       |
| 11  | Phase 9: ProductDetailModal Layout Enhancements                     | Done   | P0       | 2026-07-06 | [Impl 9](../architecture/implementation-phases.md#impl-phase-9)           | Column gap, hero/spec padding                                           |
| 12  | Phase 10: Component Unit Testing & Quality Check                    | Done   | P0       | 2026-07-06 | [Impl 10](../architecture/implementation-phases.md#impl-phase-10)         | categoryTabs/productCard/modal tests                                    |
| 13  | Phase 11: CategoryTabs Scroll Polish & Modal Backdrop Fix           | Done   | P0       | 2026-07-06 | [Impl 11](../architecture/implementation-phases.md#impl-phase-11)         | rounded-xl, z-[1], scrollbar-none, dialog z-50                          |
| 14  | Phase 12: Final Test Updates & Build Check                          | Done   | P0       | 2026-07-06 | [Impl 12](../architecture/implementation-phases.md#impl-phase-12)         | Test updates, deployment check                                          |
| 15  | Phase 13: Bento Grid Layout & Category Switch Controls              | Done   | P0       | 2026-07-06 | [Impl 13](../architecture/implementation-phases.md#impl-phase-13)         | Chevron scroll, i18n; bento later reverted (Impl 17–18)                 |
| 16  | Phase 14: Final Testing & Production Build Check                    | Done   | P0       | 2026-07-06 | [Impl 14](../architecture/implementation-phases.md#impl-phase-14)         | categoryTabs/productCard tests, build check                             |
| 17  | Phase 15: HeaderToolbar Design & Premium Controls                   | Done   | P0       | 2026-07-06 | [Impl 15](../architecture/implementation-phases.md#impl-phase-15)         | Unified toolbar, ThemeSwitch, LanguageSegment pill                      |
| 18  | Phase 16: Header Toolbar Testing & QA                               | Done   | P0       | 2026-07-06 | [Impl 16](../architecture/implementation-phases.md#impl-phase-16)         | headerToolbar tests, App theme switch test                              |
| 19  | Phase 17: Showroom Grid & ProductCard Redesign                      | Done   | P0       | 2026-07-06 | [Impl 17](../architecture/implementation-phases.md#impl-phase-17)         | Remove bento; 6 separate bordered cards                                 |
| 20  | Phase 18: ProductCard Test Updates & Verification                   | Done   | P0       | 2026-07-06 | [Impl 18](../architecture/implementation-phases.md#impl-phase-18)         | Assert no bento shell, `npm run check`                                  |
| 21  | Phase 19: ProductCard Image Well Refinements                        | Done   | P0       | 2026-07-06 | [Impl 19](../architecture/implementation-phases.md#impl-phase-19)         | border + inset image well, tests                                        |
| 22  | Phase 20: Theme Fallbacks, Session Documentation                    | Done   | P0       | 2026-07-06 | [Impl 20](../architecture/implementation-phases.md#impl-phase-20)         | session summary, light default `theme.ts`, theme tests                  |
| 23  | Phase 21: ChatResponse/AvatarMedia types & API contracts            | Done   | P0       | 2026-07-07 | [Impl 21](../architecture/implementation-phases.md#impl-phase-21)         | Types, store fields, `api-contract.md`                                  |
| 24  | Phase 22: Single source store.products                              | Done   | P0       | 2026-07-07 | [Impl 22](../architecture/implementation-phases.md#impl-phase-22)         | CategoryTabs/Modal from store, load states                              |
| 25  | Phase 23: AvatarDisplay & AvatarVideoPlayer refactor                | Done   | P0       | 2026-07-07 | [Impl 23](../architecture/implementation-phases.md#impl-phase-23)         | Slots, asset registries, `resolveAvatarMedia`                           |
| 26  | Phase 24: Store media wiring & video autoplay                       | Done   | P0       | 2026-07-07 | [Impl 24](../architecture/implementation-phases.md#impl-phase-24)         | Chat media, locale swap, mock `videoUrl`                                |
| 27  | Phase 25: Showroom loading & mobile UX                              | Done   | P0       | 2026-07-07 | [Impl 25](../architecture/implementation-phases.md#impl-phase-25)         | Skeleton/error/empty, modal gallery, highlight UX                       |
| 28  | Phase 26: Project final release & documentation                     | Done   | P0       | 2026-07-07 | [Impl 26](../architecture/implementation-phases.md#impl-phase-26)         | public asset folders, README/wiki/env                                   |
| 29  | Phase 27: Dark surface foundation                                   | Done   | P0       | 2026-07-07 | [Impl 27](../architecture/implementation-phases.md#impl-phase-27)         | Soft dark layers (canvas 800 / surface 700)                             |
| 30  | Phase 28: Dark contrast adjustments                                 | Done   | P0       | 2026-07-07 | [Impl 28](../architecture/implementation-phases.md#impl-phase-28)         | Arrow, badge, CTAs, muted text                                          |
| 31  | Phase 29: Product modal close UX                                    | Done   | P0       | 2026-07-07 | [Impl 29](../architecture/implementation-phases.md#impl-phase-29)         | Header ×, footer outline, advantage line-clamp                          |
| 32  | Phase 30: Myanmar layout & i18n                                     | Done   | P0       | 2026-07-07 | [Impl 30](../architecture/implementation-phases.md#impl-phase-30)         | ShowroomPanel truncate, CategoryTabs min-height, `my.ts`                |
| 33  | Phase 31: Tests & QA checklist                                      | Done   | P0       | 2026-07-07 | [Impl 31](../architecture/implementation-phases.md#impl-phase-31)         | Modal close tests, `npm run check` (50 tests)                           |
| 34  | Phase 32: Category text & toolbar dark fix                          | Done   | P0       | 2026-07-07 | [Impl 32](../architecture/implementation-phases.md#impl-phase-32)         | `slate-200/300` tokens, `edc-blue` accent                               |
| 35  | Phase 33: Architecture Wiki, PM Tracker Mapping & Session Summaries | Done   | P0       | 2026-07-07 | [Doc 33](../architecture/implementation-phases.md#documentation-phase-33) | Master doc Impl 1–32, PM tracker 35 rows, conventions, session split    |
| 36  | Phase 34: API Client, Chat Streaming & Avatar Playback Integration  | Done   | P0       | 2026-07-07 | [Impl 34](../architecture/implementation-phases.md#impl-phase-34)         | apiFetch, manifest.json, session/history, streaming stub, CDN assets    |
| 37  | Phase 35: Immersive opening canvas                                  | Done   | P0       | 2026-07-07 | [Impl 35](../architecture/implementation-phases.md#impl-phase-35)         | UiPhase, VirtualBackground, AvatarCompanion, ImmersiveLayout            |
| 38  | Phase 36: Advisor companion + Fast Questions                        | Done   | P0       | 2026-07-07 | [Impl 36](../architecture/implementation-phases.md#impl-phase-36)         | FastQuestionsRail, video in companion, speech bubble sync               |
| 39  | Phase 37: Modern virtual showroom                                   | Done   | P0       | 2026-07-07 | [Impl 37](../architecture/implementation-phases.md#impl-phase-37)         | VirtualShowroom glass overlay, scenario reveal                          |
| 40  | Phase 38: Mobile, polish, cleanup                                   | Done   | P0       | 2026-07-07 | [Impl 38](../architecture/implementation-phases.md#impl-phase-38)         | Responsive layout, delete CommerceLayout, immersive-ui conventions      |
| 41  | Phase 39: Immersive canvas polish & centered showroom               | Done   | P0       | 2026-07-07 | [Impl 39](../architecture/implementation-phases.md#impl-phase-39)         | Remove ChatInput, vertical FloatingControls, centered VirtualShowroom   |
| 42  | Phase 40: Avatar scaling & greeting sequence integration            | Done   | P0       | 2026-07-07 | [Impl 40](../architecture/implementation-phases.md#impl-phase-40)         | PNG greeting fallback, comic bubble, completeGreetingAndOpenShowroom    |
| 43  | Phase 41: AdvisorDock setup & FloatingControls redesign             | Done   | P0       | 2026-07-07 | [Impl 41](../architecture/implementation-phases.md#impl-phase-41)         | AdvisorDock, reveal sequence, ControlPill, mute wiring                  |
| 44  | Phase 42: Unified useImmersiveSequence & animation timings          | Done   | P0       | 2026-07-07 | [Impl 42](../architecture/implementation-phases.md#impl-phase-42)         | ImmersiveStep, motionTiming, step-gated FloatingControls                |
| 45  | Phase 43: Callback-driven sequences & AdvisorDock DOM refactor      | Done   | P0       | 2026-07-07 | [Impl 43](../architecture/implementation-phases.md#impl-phase-43)         | ImmersiveSequenceContext, single motion.div avatar, greetingExit        |
| 46  | Phase 44: STEMWerlz UI layout & showroom refactoring                | Done   | P0       | 2026-07-08 | [Impl 44](../architecture/implementation-phases.md#impl-phase-44)         | ShowroomHeroCard/Rail/Chrome, ShowroomAnchorContext, ProductSpecSheet   |
| 47  | — (Phase 45 skipped in PM tracker)                                  | —      | —        | —          | —                                                                         | Numbering gap: 44 → 46                                                  |
| 48  | Phase 46: SpeechBubble CTAs, typewriter & refactoring               | Done   | P0       | 2026-07-08 | [Impl 46](../architecture/implementation-phases.md#impl-phase-46)         | BubbleCta, useAvatarBubbleState, SummarySpeechBubble, TypewriterText    |
| 49  | Phase 47: cornerHold step & AvatarBubbleLayer consolidation         | Done   | P0       | 2026-07-08 | [Impl 47](../architecture/implementation-phases.md#impl-phase-47)         | openShowroomFromCorner, catalog before chips, 2200ms moves              |
| 50  | Phase 48: Typewriter gating, CTA link restyling & offsets           | Done   | P0       | 2026-07-08 | [Impl 48](../architecture/implementation-phases.md#impl-phase-48)         | BubbleCtaButton link style, shoulder inset, frozen dockRect             |
| 51  | Phase 49: SVG speech bubble tuning & re-entrance prevention         | Done   | P0       | 2026-07-08 | [Impl 49](../architecture/implementation-phases.md#impl-phase-49)         | Stable bubble keys, instantText on swap                                 |
| 52  | Phase 50: Unified speech bubble dimensions & spacing polish         | Done   | P0       | 2026-07-08 | [Impl 50](../architecture/implementation-phases.md#impl-phase-50)         | SPEECH_BUBBLE_WIDTH/HEIGHT getters, AdvisorPromptsDock min-height       |
| 53  | Phase 51: SVG asset loading & showroom CTA visibility               | Done   | P0       | 2026-07-08 | [Impl 51](../architecture/implementation-phases.md#impl-phase-51)         | speech-bubble.svg, hide enterShowroom CTA at showroomPanel+             |
| 54  | Phase 52: Percentage-based responsive speech bubble insets          | Done   | P0       | 2026-07-08 | [Impl 52](../architecture/implementation-phases.md#impl-phase-52)         | ViewBox insets, word-wrap fixes                                         |
| 55  | Phase 53: Speech bubble CTA delayed reveal animation                | Done   | P0       | 2026-07-08 | [Impl 53](../architecture/implementation-phases.md#impl-phase-53)         | bubbleCtaRevealVariants, ctaVisible after typewriter                    |
| 56  | Phase 54: Grouped bubble layout & instant product intro             | Done   | P0       | 2026-07-08 | [Impl 54](../architecture/implementation-phases.md#impl-phase-54)         | openShowroomFromCorner + showProductIntro sync                          |
| 57  | Phase 55: SVG clip path recalculation & spacing tuning              | Done   | P0       | 2026-07-08 | [Impl 55](../architecture/implementation-phases.md#impl-phase-55)         | INK_INSET_VIEWBOX from clip path, no default product CTAs               |
| 58  | Phase 56: Phased staggered fade transitions & spacing cleanup       | Done   | P0       | 2026-07-08 | [Impl 56](../architecture/implementation-phases.md#impl-phase-56)         | Avatar out → snap → in → bubble fade-in                                 |
| 59  | Phase 57: SVG asset export & showroom size compensation             | Done   | P0       | 2026-07-08 | [Impl 57](../architecture/implementation-phases.md#impl-phase-57)         | getShowroomCompensatedBubbleSizePx, 375 viewBox                         |
| 60  | Phase 58: Dynamic fontSize compensation & font parity               | Done   | P0       | 2026-07-08 | [Impl 58](../architecture/implementation-phases.md#impl-phase-58)         | text-base 16px unified across breakpoints                               |
| 61  | Phase 59: Height-aware speech bubble vertical alignment             | Done   | P0       | 2026-07-08 | [Impl 59](../architecture/implementation-phases.md#impl-phase-59)         | getBubbleWrapperTopPx height-aware                                      |
| 62  | Phase 60: Ratio-based coordinates & 2D tail alignment               | Done   | P0       | 2026-07-08 | [Impl 60](../architecture/implementation-phases.md#impl-phase-60)         | getBubbleWrapperMarginLeftPx, overflow-visible AdvisorDock              |
| 63  | Phase 61: Clamped viewport boundaries & spacing polish              | Done   | P0       | 2026-07-08 | [Impl 61](../architecture/implementation-phases.md#impl-phase-61)         | getClampedBubbleWrapperTopPx, beside-head placement                     |
| 64  | Phase 62: Showroom category navigation & back chips                 | Done   | P0       | 2026-07-08 | [Impl 62](../architecture/implementation-phases.md#impl-phase-62)         | ShowroomProductRail w-fit, categoryBack i18n                            |
| 65  | Phase 63: Combined ControlPill & custom theme toggles               | Done   | P0       | 2026-07-08 | [Impl 63](../architecture/implementation-phases.md#impl-phase-63)         | FloatingControlButton, unified ControlPill stack                        |
| 66  | Phase 64: ControlPill spacing & icon polish                         | Done   | P0       | 2026-07-08 | [Impl 64](../architecture/implementation-phases.md#impl-phase-64)         | size-11 controls, LanguageIcon, size-6 icons                            |
| 67  | Phase 65: Speech bubble speaking top & avatar spacing nudge         | Done   | P0       | 2026-07-08 | [Impl 65](../architecture/implementation-phases.md#impl-phase-65)         | BUBBLE_SPEAKING_TOP_PX, BUBBLE_AVATAR_GAP_PX                            |
| 68  | Phase 66: Shoulder tail-anchoring & alignment fix                   | Done   | P0       | 2026-07-08 | [Impl 66](../architecture/implementation-phases.md#impl-phase-66)         | Tail-anchor rewrite, no viewport clamp                                  |
| 69  | Phase 67: Shoulder-based 2D tail anchoring ratio tuning             | Done   | P0       | 2026-07-08 | [Impl 67](../architecture/implementation-phases.md#impl-phase-67)         | AVATAR_SHOULDER_TAIL_ANCHOR_RATIO 0.43                                  |
| 70  | Phase 68: Hero card expansion & avatar auto-fade choreography       | Done   | P0       | 2026-07-08 | [Impl 68](../architecture/implementation-phases.md#impl-phase-68)         | heroExpanded, scrollbar-hint, Heroicons theme icons                     |
| 71  | Phase 69: Transition gating & scrollbar styling polish              | Done   | P0       | 2026-07-08 | [Impl 69](../architecture/implementation-phases.md#impl-phase-69)         | catalogBubbleVisibility, CTA layout reserve, scrollbar-hint WebKit      |
| 72  | Phase 70: Real-time i18n speech bubble re-localization              | Done   | P0       | 2026-07-08 | [Impl 70](../architecture/implementation-phases.md#impl-phase-70)         | bubbleCopy tags, relocalizeBubbleMessages (125 tests)                   |
| 73  | Phase 71: Instant i18n swap & typewriter replay prevention          | Done   | P0       | 2026-07-08 | [Impl 71](../architecture/implementation-phases.md#impl-phase-71)         | hasPresentedCopyRef, showInstant (126 tests); superseded by Impl 76     |
| 74  | Phase 72: Immersive product scenarios documentation                 | Done   | P0       | 2026-07-08 | [Doc 34](../architecture/implementation-phases.md#documentation-phase-34) | docs/immersive-product-scenarios.md Scenario 1/2/3                      |
| 75  | Phase 73: Corner chips, locale toggle & hero scroll bugfixes        | Done   | P0       | 2026-07-08 | [Impl 73](../architecture/implementation-phases.md#impl-phase-73)         | openShowroomFromCorner routing, chip bubbleCopy i18n, scrollbar-glass   |
| 76  | Phase 74: Hero scroll minimal-native & company chip CTA parity      | Done   | P0       | 2026-07-09 | [Impl 74](../architecture/implementation-phases.md#impl-phase-74)         | scrollbar-minimal, CTA pin, disabled company CTA, EN/MM copy align      |
| 77  | Phase 75: BubbleCtaButton export hotfix & Vite cache recovery       | Done   | P0       | 2026-07-09 | [Impl 75](../architecture/implementation-phases.md#impl-phase-75)         | `onExecute` prop, delete `node_modules/.vite`                           |
| 78  | Phase 76: Bubble vertical center + typewriter restore               | Done   | P0       | 2026-07-09 | [Impl 76](../architecture/implementation-phases.md#impl-phase-76)         | dual layout, `hasPresentedRef`, store → `AvatarBubbleLayer`             |
| 79  | Phase 77: Floating label hover-only + Motion reveal                 | Done   | P0       | 2026-07-09 | [Impl 77](../architecture/implementation-phases.md#impl-phase-77)         | remove focus-within stick; `floatingLabelVariants` slide-out            |
| 80  | Phase 78: Label sticky fix + clip-path text reveal                  | Done   | P0       | 2026-07-09 | [Impl 78](../architecture/implementation-phases.md#impl-phase-78)         | `labelHidden`/`labelVisible`; clip-path wipe; pointer hover (142)       |
| 81  | Phase 79: Immersive scenario video wiring                           | Done   | P0       | 2026-07-09 | [Impl 79](../architecture/implementation-phases.md#impl-phase-79)         | `resolveImmersiveVideoSrc`; journeyState playback; no convention 404    |
| 82  | Phase 80: Always typewriter bubble copy                             | Done   | P0       | 2026-07-09 | [Impl 80](../architecture/implementation-phases.md#impl-phase-80)         | remove sticky instant + showroom blanket; every copyKey typewrites      |
| 83  | Phase 81: 3D Virtual Space Phase 1 Lobby                            | Done   | P0       | 2026-07-10 | [Impl 81](../architecture/implementation-phases.md#impl-phase-81)         | R3F warm-timber lobby; world Fast Q; ?legacy=1 / ?mood=gallery (155)    |
| 84  | Phase 82: Lobby layout pass                                         | Done   | P0       | 2026-07-10 | [Impl 82](../architecture/implementation-phases.md#impl-phase-82)         | back-wall logo; far door; counter Fast Q; Company/Support panels (157)  |
| 85  | Phase 83: Lobby sequence + logo + zones                             | Done   | P0       | 2026-07-10 | [Impl 83](../architecture/implementation-phases.md#impl-phase-83)         | lobby-native order; logo fix; left bay / right Products; hint (158)     |
| 86  | Phase 84: Camera-to-zone focus                                      | Done   | P0       | 2026-07-10 | [Impl 84](../architecture/implementation-phases.md#impl-phase-84)         | focusZone infoBay/products; auto-return; Products clickable (163)       |
| 87  | Phase 85: Lobby foundation polish (Pass 85)                         | Done   | P0       | 2026-07-10 | [Impl 85](../architecture/implementation-phases.md#impl-phase-85)         | logo uplights; logo-first seq; vertical Fast Q; bubble hide (164)       |
| 88  | Phase 86: Guide avatar (Pass 86)                                    | Done   | P0       | 2026-07-10 | [Impl 86](../architecture/implementation-phases.md#impl-phase-86)         | avatar zone travel; choice chips; no auto-return (164)                  |
| 89  | Phase 87: Showroom dressing (Pass 87)                               | Done   | P0       | 2026-07-10 | [Impl 87](../architecture/implementation-phases.md#impl-phase-87)         | vignettes; slide door + plaque; baseboards/soft light (165)             |
| 90  | Phase 88: Mood + chrome (Pass 88)                                   | Done   | P0       | 2026-07-10 | [Impl 88](../architecture/implementation-phases.md#impl-phase-88)         | mood toggle; glass; diegetic Products; CTA hierarchy (169)              |
| 91  | Phase 89: Lobby QA bugfix                                           | Done   | P0       | 2026-07-10 | [Impl 89](../architecture/implementation-phases.md#impl-phase-89)         | Enter foreshadow; thinking bubble; append hint; mood icon (172)         |
| 92  | Phase 90: Lobby HMR white-screen fix                                | Done   | P0       | 2026-07-10 | [Impl 90](../architecture/implementation-phases.md#impl-phase-90)         | context HMR full reload; StandInHumanoid store theme                    |
| 93  | Phase 91: Lobby logo, timing, lights                                | Done   | P0       | 2026-07-10 | [Impl 91](../architecture/implementation-phases.md#impl-phase-91)         | SVG bake; dolly/logo beat; brass spots; counter hotspot gone            |
| 94  | Phase 92: Lobby sequence + Fast Q polish                            | Done   | P0       | 2026-07-10 | [Impl 92](../architecture/implementation-phases.md#impl-phase-92)         | slower pacing; plaque+label fade; controlsIn flash fix                  |
| 95  | Phase 93: Lobby Fast Q beats + logo edge                            | Done   | P0       | 2026-07-10 | [Impl 93](../architecture/implementation-phases.md#impl-phase-93)         | plaques→labels+hint→chat→controls; soft panel edge                      |
| 96  | Phase 94: Welcome bubble cold-load ordering fix                     | Done   | P0       | 2026-07-13 | [Impl 94](../architecture/implementation-phases.md#impl-phase-94)         | gate opening seq on scene+logo ready; onSceneReady wired; safety caps   |
| 97  | Phase 95: Lobby opening choreography restore                        | Done   | P0       | 2026-07-13 | [Impl 95](../architecture/implementation-phases.md#impl-phase-95)         | remove init fast-path; lobbyOpeningBeatMs; dolly+typewriter+avatar fade |
| 98  | Phase 96: Side panel label gating at counter                        | Done   | P0       | 2026-07-13 | [Impl 96](../architecture/implementation-phases.md#impl-phase-96)         | shouldShowSidePanelLabels; zone-focus reveal; geometry silhouette kept  |

## Session evidence by date

| Work date  | Phases covered                                        | Local session log                                          |
| ---------- | ----------------------------------------------------- | ---------------------------------------------------------- |
| 2026-07-06 | Impl 1–20                                             | `docs/sessions/2026-07-06-session-summary.md` (gitignored) |
| 2026-07-07 | Impl 21–43, Doc 33                                    | `docs/sessions/2026-07-07-session-summary.md` (gitignored) |
| 2026-07-08 | Impl 44–71, Doc 34, Impl 73–76 (+77)                  | `docs/sessions/2026-07-08-session-summary.md` (gitignored) |
| 2026-07-09 | Impl 78–80 (labels, video, typewriter)                | `docs/sessions/2026-07-09-session-summary.md` (gitignored) |
| 2026-07-10 | Impl 81–93 (3D lobby → Fast Q beats)                  | `docs/sessions/2026-07-10-session-summary.md` (gitignored) |
| 2026-07-13 | Impl 94–96 (scene-ready + choreography + side labels) | `docs/sessions/2026-07-13-session-summary.md` (gitignored) |
