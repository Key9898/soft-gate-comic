---
title: Account hub to hand-off bar
type: note
date: 2026-08-19
tags: [profile, notifications, coins, library, auth, prefs, softgate]
impl: 142
---

# Impl 142 — Account hub to hand-off bar

Planning called this “140”; 140/141 already shipped (Subscribe + 18+, Categories `/ranking`). This is the next free number.

Signed-in cluster to the prelaunch hand-off bar. Mock/localStorage only. No live mail, PSP, push, or cross-device sync.

## What shipped

- Password min 8 (`MIN_PASSWORD_LENGTH`). Forms + `register` / `changePassword`. Login **context** does not length-check leftover 6-char stored passwords; Login **form** still blocks under 8. Reset/Forgot/Login text links: `focus-visible` + `from` on Reset.
- Notification prefs `softgate_notif_prefs_v1`. Profile Settings matrix (in-app toggles; email/push locked). Account/security always on, not persisted. `setNotifPrefs` on EngagementContext so the nav bell updates in the same tab.
- Profile Preferences writes `softgate_reader_prefs_v1` (same device key as the reader). No portal dark mode.
- Inbox empty-first (`[]`, no seed). Row = destination link; delete sibling. Filters All / Unread / Updates / Activity / Promo. Prefs applied in lib. `newEpisode: false` skips subscribe sync.
- Coins header Demo/this-browser copy; how-it-works; unlocked list from `unlockedEpisodeKeys`. Wizard unchanged.
- Library History Continue → `/read/:id/:episode` (fallback 1). Cover still hub. Hidden on Subscribed/Likes.

## Verify

`npm run check`

Manual: register 8-char password; Profile settings toggles; empty inbox then bookmark + new episode (unmute); Coins header Demo; Library history Continue opens reader.

## Next

Impl **144** (143 is Categories chart chrome, shipped in parallel).
