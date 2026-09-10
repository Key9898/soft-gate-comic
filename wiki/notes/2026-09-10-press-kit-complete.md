---
title: Impl 209 — Complete Press kit (real ZIP + Demo IA)
type: note
date: 2026-09-10
tags: [press, info, media-kit, zip, prelaunch, softgate]
impl: 209
---

# Impl 209 — Complete Press kit (real ZIP + Demo IA)

`/press` stays a press-kit hub, not a live newsroom CMS. It now meets the prelaunch bar: a real ZIP, complete IA with honest Demo slots, and About-class chrome. Numbers **205–208** were not used for this page; next is **210**.

## What shipped

- Real pack at `apps/portal/public/press-kit/softgate-comic-press-kit.zip` (URL `/press-kit/…` so it never collides with the `/press` SPA/SSR rewrite). Archive root is exactly `logo.svg`, `logo.png`, `icon-512.png` — same bytes as `public/logo/` and `public/favicon/icon-512.png`. Not `favicon.svg`. ZIP is the primary CTA; three singles stay secondary.
- Guest-open Demo stills `still-home.png`, `still-hub.png`, `still-reader.png`. Live `:5173` had an empty published catalog, so hub/Reader captures used always-on `/about` and `/creators` instead of a 404 or login wall. Cards stay labeled Home / Series hub / Reader with a Demo / client-swap note.
- `PressPage`: no page-root `overflow-hidden`; wash wrapper only. Jump TOC, fact sheet website link, Demo news row (no fabricated headline/MAU), brand hex swatches, expanded Do/Don’t + trademark, founder media-desk card, left-aligned media contact, Yangon hours with no SLA, one `aria-live` copy control with visible fallback on clipboard failure.
- Organization JSON-LD keeps existing fields and adds a `ContactPoint` email `press@softgatecomic.com` (not a person). SEO title `static.pressTitle`, description `info.deck.press`.
- EN/MM `press.*` including MM `mediaKit`. `press.updated` is 10 September 2026. `LEGAL_EFFECTIVE_DATE` unchanged.

## Out

- No fake press releases, coverage logos, empty ZIP, or Canva tab icon as a brand download.
- No new env, API, Admin git, or `isMockApi` invert.
- Do not invent Impl **205–207** rows.

## Verify

`pnpm check`. Browser `/press`: ZIP downloads three files; singles still work; TOC jumps; Copy; EN/MM; desktop + a mobile width. Do not kill `:5173`.
