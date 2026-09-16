---
title: Figma redesign — design system, screen reviews and fixes
type: note
date: 2026-09-15
tags: [figma, design, portal, redesign, softgate]
---

# 2026-09-15 — Figma redesign: design system + 8 key screens

## What was done

Design-only session. No portal source changed. Output is a new Figma file in khaing's team drafts:

- **File:** https://www.figma.com/design/LVKj1gSCm9gvcClv3HGFaZ — "SoftGate Comic — Portal Redesign 2026"
- **Direction chosen (user):** refine, keep brand (teal / magenta / spark, Inter, Soft-Expressive radii), system + 8 key screens, new file.

### Audit (from the live app, dev branch, Hono API on :3100)

1. Mobile Home hero crops its own headline; cover pushed below the fold.
2. Mobile Webtoon Detail: cover then ~700px empty dark space before content.
3. Home = 7 rails using one identical card; no rhythm.
4. Light portal vs dark detail/reader are two hardcoded worlds; no shared surface tokens.
5. Radius scale is flat (button/input/chip/card all 16).
6. Chips ship `text-xs font-bold` — banned by `type-weight-scale.md` but still in `chipClasses.ts`.
7. Categories grid rows uneven (deck copy + skeleton mismatch).
8. Single family carries all hierarchy; hero title has no voice against art.

### Figma structure

- **Variables:** Primitives (43) · Color (43 semantic, modes Light / Immersive) · Spacing (15) · Radius (8) · Size (12) · Typography (26). All scoped; WEB code syntax maps to the Tailwind v4 `@theme` CSS vars.
- **Styles:** 18 text styles (Inter ramp bound to variables), 6 effect styles (card, card-hover, book, book-hover, floating, glass blur).
- **Components:** Icons (32 Lucide), Button (8×3) + Button/State, Chip, Badge, Input, Search Field, Cover, Book Card (sm/md/lg/Row), Rail Header, Weekday, Surface (Card/Panel), Episode Row, Coin Package, Empty State, Stat Tile, Top Nav (desktop guest/signed-in, mobile), Tab Bar (new, mobile), Reader Chrome, Footer.
- **Screens:** Home (desktop + mobile), Categories, Search, Webtoon Detail (desktop + mobile), Reader (desktop + mobile + end-of-episode), Library, Coins, Auth (desktop + mobile).
- **Docs pages:** Cover, Audit & Direction (findings table + Keep/Change/Do-not contract), Foundations ×3.

### Design decisions that would need code follow-up (not done here)

- `radius/chip` = 12px (new step below `rounded-2xl`); chips move to 12px/600.
- Immersive colour mode = the honest token structure for Webtoon Detail / Reader / hero overlays; today these are per-page hardcoded.
- Book Card tiles drop the deck; title + "Genre · views" only.
- Mobile bottom Tab Bar (Home / Browse / Library / Coins / Profile).
- Footer moves to the ink surface.
- End-of-episode card with auto-advance in the Reader.

## Files changed

- `.claude/launch.json` — new, dev-server launch config for the in-app browser (portal on :5173). Tooling only. Not committed.
- `docs/sessions/2026-09-15-session-summary.md` — this file (gitignored).

## Local env notes

- API `.env` has `CLIENT_URL=http://localhost:5177` but portal Vite binds :5173 → CORS `ERR_FAILED` on `/api/catalog`. Worked around with `CLIENT_URL=http://localhost:5173 PORT=3100 pnpm dev:api` for the session; nothing edited.
- Cover assets uploaded to Figma were downscaled copies (`/tmp/sg-assets`), not the repo PNGs.

## Verify

- Open the Figma file; check Foundations / Color in both modes, Book Card set, Home / Desktop hero.
- `pnpm check` not run — no source changed.

## Follow-ups

- Decide whether to adopt the Immersive mode tokens in `index.css` (`@theme` additions) and the chip radius step (would be a new Impl + ADR).
- Fix `apps/api/.env` `CLIENT_URL` port drift or document it in `wiki/notes`.
- Mobile Webtoon Detail void (finding 2) is a live defect worth its own Impl regardless of the redesign.

## Addendum — Reader critique + fixes (same day)

Applied in Figma after a design critique of the Reader page:

- Tokens: Immersive `brand/primary` family now aliases teal/600–800 (was teal/500; white label failed 4.5:1). `bg/reader` Light mode = gray/50 so the reader light theme has a surface.
- Reader Chrome component: scrim-gradient bars (no fake glass), 1-line truncation on title/series, Next = `Button/Primary sm` instance, new props `Show prev`, `Show next`, `Episode label`, `Show comment count` (hides "0").
- Reader frames: strip 672 (`max-w-2xl`), gap-0 panels, Prev hidden on Ep. 1, hint pill relabelled as first-visit toast, mobile 34px home-indicator inset, "38% read" scroll label.
- End of episode rebuilt in-flow per `reader-chrome.md`: last panel → Demo end-ad slot → complete card with rating, reactions, next-up (episode thumb), creator note, comments teaser + composer, related ×3, guest nudge, Back to series + Report. Auto-advance removed.
- New state frames: Locked premium paywall (wait-or-pay), Reader Light, Skeleton (50dvh loading chrome), Episode sheet (mobile), Display settings drawer (desktop), Comments sheet (mobile).

## Addendum 2 — Home critique + fixes

- Hero (desktop + mobile): pager moved under the CTAs per `hero-spotlight.md` — `rounded-2xl` ticks with 44px hit areas → Pause/Play → right arrow only; left arrow removed. Stable `h1` line added above the eyebrow. Veil raised (mid-stop 0.82) + radial behind the copy so banner lettering stops competing. HeroOutline Subscribe gets a 28% ink fill. Mobile hero grows to fit (482).
- View all hidden on Start here, Rising, Daily (spec). Daily cards: countdown lip on cover, `Ep. n · time MMT` meta, no rating/age, rail named "not links · cap 6 · Asia/Yangon".
- Badge `Type=Rank` → white lip (Impl 127).
- Mobile: overflow chevron well on the genre strip, edge fades on every rail scroller.
- New frames: View-all six-pack dialog (Impl 208), Signed-in Home (Continue reading with blended progress bars, For You rail without View all, no join panel), Skeleton (Impl 210), Empty catalog (Impl 196), Load fail (Impl 198).
- Not done: Myanmar-locale Home frame; `Book Card / Layout=Daily` as a real variant (lips are absolute overlays for now).

## Addendum 3 — Webtoon Detail critique + fixes

- `Episode Row` component: landscape 202/142 thumb, `Access=Free / Premium (coins + freeAt) / FreeNow / Locked (lock + coins)`, new `Read` boolean badge.
- Desktop (signed-in): Continue · Ep. 3 primary, Latest · Ep. 5, Subscribed + `notify-mute`, Like, Share, "Start over" link; author chip → /author/1; tags row → /search; Published/Updated in stats; `hub-next-drop` strip replaces the Continue bar and the banned cadence line; per-episode access + read states; sidebar trimmed (no comments teaser, card radius); inline Series discussion after the list; Other works rail; Related renamed "You may also like" (no View all).
- New desktop frames: Guest (Start primary, Subscribe accent, sign-in to rate/post), 18+ title hub (Blood Moon, notice, "Read · confirms 18+"), Reader 18+ age-gate dialog, Skeleton.
- Mobile: genre chips replace eyebrow, Continue primary + Subscribed, tags, dates, secondary CTAs, Next drop, episode states, discussion, rate, You may also like + Other works scrollers, About; tab bar stays last.

## Addendum 4 — Coins critique + fixes

- Desktop rebuilt to `client-wallet.md`: Demo wallet header (`headerDemo` / `headerLocalCredit`), **Demo Top-up** CTA with `demoTopUpBadge`, Redeem code removed, six packs from `coinData.ts` (50 → 3,000, Popular / Best Value, per-coin line), "How coins work" (seed 150 / demo top-up / unlock + wait-free), Buy / History tabs, ledger typed `spend / demo_topup / bonus` with the 150 seed, Unlocked episodes list. False promise cards (refund-safe, never-expire, 7-day wait) deleted.
- Checkout flow (5 frames): Select Payment Method (MMQR / KBZ / Wave / A+ / CB / Cards + `demoCheckoutNote`), MMQR scan (QR, timer, demo transaction id, copy merchant), Cards with locked pre-filled demo card (`cardDemoLocked`), Processing (`Crediting local Demo balance…`, Escape suppressed), Success (`demoTopUpSuccess`, new balance).
- Top-up context frame (from locked Ep. 5, balance 2): `topUpContext` banner, `topUpNeed`, smallest covering pack highlighted, `topUpReturn`; guest annotation (ProtectedRoute → /login?from=/coins).
- Mobile Coins frame added (2-up packs, tabs, ledger, unlocked). Stray "Head" frame deleted.

## Addendum 5 — Library critique + fixes

- Old single stacked frame (Continue-as-tab, invented stats 12/4/38, "Liked episodes", hiatus/40-ep statuses, "Manage") replaced by tab states matching `LibraryPage.tsx`: **Subscribed / History / Likes** underline tabs (`role=tablist`), "My Library · Manage your reading collection", search-in-library, grid/list view toggle, Edit.
- Subscribed: 6-up grid with Up flags and per-item `notify-mute` bell (muted state), hidden in edit mode. History: rows with blended progress (gray-200 track / primary-600 fill / 3px), `Ep. n/total · %`, Last Read, **Continue** → `/read/:id/:lastEp` (stopPropagation), chevron to hub. Likes: webtoon grid.
- Edit mode: Done, "3 selected", Select All, Remove from Collection, checkbox overlays; `LibraryDeleteConfirmDialog` frame (Cancel / Remove, toast note).
- Per-tab empty states (`emptyBookmarks / emptyHistory / emptyLiked` + `emptyExplore`), search no-match (`noSearchMatch / noSearchMatchWhy / clearSearch`).
- Mobile Library (History tab) with `Tab Bar Active=Library`.

## Addendum 6 — Auth critique + fixes

- Login rebuilt to `client-auth.md`: heading `Continue in this browser`, `signInToAccount` + `demoAccountNote`, room copy `Pick up where the story stopped.` (was register's title), jobs row, guest note; invented "nothing is sent to a server" and "Browse without an account" removed. Split annotated as AuthSplitCard (both forms mounted, only photo slides). Login error state (`loginFailed`, role=alert).
- Register desktop (form on the right 50%): username / email / password / confirm, Terms + Privacy checkbox gating submit, `registerLead`, `Sign in instead`.
- Forgot: 3-step stepper Email → Code (`otpMockNote`, 000000) → New password (`resetPrepared`), plain white card + `radial-wash-primary`, no split. Reset: incomplete-link shell, HTTP set-new-password, success (no auto-login).
- Mobile Login/Register: active form first, atmosphere copy + photo after (spec order), no slide.
- Asset gap: no reading-room photo in the Assets page — photo panes use the banner as a stand-in with an on-canvas note.

## Addendum 7 — Categories + Search critique + fixes

- Categories rebuilt to `categories-browse.md`: Browse (`/categories`, unranked `<div>` grid, h1 Browse by Genre, count line `{n} Webtoons · genre · status`, single-row genre rail + reserved `genre-rail-chevron-slot`, status wrap row, sticky band annotated as sibling of results, catalog tiles with description/category/views/date, no pager under 24, invented Age filter removed); Popular chart (`/ranking`, masthead `radial-wash-primary`, `rankingEyebrow`, `<ol>` RankMark tiles, pager 1–24 of 100); empty filters (Search + Go here + Clear filters); skeleton (8 genre bones, inert chevron slot); mobile Browse.
- Search rebuilt to `in-app-search.md`: results Webtoons (closed field with `defaultQuery`, tabs with counts, status + genre chips + sort on Webtoons only, count line, catalog tile; invented "Readers who searched this also read" removed), Authors tab (rows → `/author/:id`), Episodes tab, No results, Empty `/search` destination (h1, Recent + Clear, **Demo searches** labelled fixed list, Browse genres as links, Most read / New rails, guest Go here), Autocomplete-open state (≥2 chars, sections, keyboard hint), mobile results.

## Addendum 8 — Final pass

- Assets: `public/auth/reading-room-lg.jpg` + `reading-room-sm.jpg` uploaded to the Figma Assets page; Auth photo panes (desktop `.auth-split-bg`, mobile atmosphere) now use them; stand-in notes removed.
- Categories: genre 404 frame (NotFound variant=genre, search + three Go here).
- Home: Myanmar-locale desktop sample (Padauk stands in for Noto Sans Myanmar; real `locales/mm` strings; 1.7–1.8 line-height; annotation on lang=mm rules).
- New pages: **Profile** (Profile tab with honest stats, Profile Information, Reading Insights, Achievements; Settings tab with one-switch-per-category prefs and In-app/Email/Push follow copy, Account & security locked, push enable, language + reader dark; Security tab with change password and delete account type-to-confirm), **Notifications** (inbox with unread dot rows as links + sibling delete, filters with counts, Mark all read / Clear all read, all-caught-up empty with settings link, filter-empty, mobile), **Author** (`/author/:id` guest Follow, Following, empty works, author 404, mobile; no follower counts, followDemo line).
