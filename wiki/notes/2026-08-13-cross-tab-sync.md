---
title: Cross-tab sync via storage events
date: 2026-08-13
type: note
impl: 65
tags: [localStorage, sync, hooks, contexts]
---

# Impl 65 — Cross-tab sync (storage event)

Tab A မှာ login/logout, top-up, like, bookmark, comment လုပ်ရင် Tab B က UI အဟောင်းအတိုင်း ကျန်နေတဲ့ ပြဿနာကို browser-native `storage` event နဲ့ ဖြေရှင်း။

## Design

- New hook `src/hooks/useStorageSync.ts`: `useStorageSync(keys, onChange)` — `window.addEventListener('storage', ...)`, matches `e.key === null` (`localStorage.clear()`) or `keys.includes(e.key)`.
- **Same-tab double-update မဖြစ်** — spec အရ `storage` event က write လုပ်တဲ့ tab ကိုယ်တိုင်မှာ မ fire; ရှိပြီးသား setState-after-mutation logic အတိုင်းဆက်သွား။
- Callers pass **module-scope const key arrays** + `useCallback` handlers so the listener effect stays stable.
- `storageArea` filter မထည့် — app က sessionStorage မသုံး; jsdom test dispatch လည်း လွယ်။

## Wiring

| Consumer              | Keys                                              | Refresh                                                                                                                    |
| --------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `AuthContext`         | `softgate_user`                                   | `setUser(readSession())` — logout/login/profile-change propagate; downstream contexts reload via existing `userId` effects |
| `EngagementContext`   | `softgate_engage_v1`, `softgate_notifications_v1` | load effect extracted to `refresh` callback (logged-out reset branch preserved)                                            |
| `WalletContext`       | `softgate_wallet_v1`                              | same extraction pattern                                                                                                    |
| `LibraryContext`      | `softgate_library_v1`                             | same extraction pattern                                                                                                    |
| `ReaderCommentsPanel` | `softgate_comments_v1`                            | `setComments(listComments(episodeKey))`                                                                                    |

`softgate_accounts_v1` ကို deliberately မ subscribe — profile/email update တိုင်း session key ပါ ရေးလို့ session listener က cover ပြီးသား (password change က UI-visible state မဟုတ်)။

## Notes

- Reader tab က scroll progress ~1s throttle write လုပ်လို့ တခြား tab မှာ engagement refresh ခဏခဏဖြစ်နိုင် — JSON parse သက်သက်မို့ demo scale မှာ acceptable, debounce မထည့်။
- jsdom မှာ localStorage write က storage event auto-fire မဖြစ် — tests က `fireEvent(window, new StorageEvent('storage', { key }))` manual dispatch pattern သုံး။
- BroadcastChannel/SharedWorker မလို — localStorage demo scale မှာ storage event လုံလောက်။

## Tests

New `src/test/CrossTabSync.test.tsx` (5 cases): session clear → logged out; wallet top-up → balance; like toggle → likes list; comment post → panel; unrelated key → no refresh. Checkpoint 19/19 (with useAuth + ReaderCommentsPanel suites).
