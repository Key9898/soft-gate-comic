---
title: Library bookmarks (client persistence)
type: convention
date: 2026-08-11
tags: [library, bookmarks, localStorage, auth]
impl: 25
---

# Library bookmarks

## Scope (Impl 25)

Persist **bookmarks only**. Library History and Likes tabs stay mock-seeded until a later Impl. Bookmarks tab is the honest Save destination for Home / Detail / Reader.

## Storage

- Key: `softgate_library_v1`
- Shape: `{ schemaVersion: 1, byUserId: Record<userId, BookmarkRecord[]> }`
- `BookmarkRecord`: `{ webtoonId, addedAt }` — hydrate display from `useData().webtoons`
- Guests cannot save; storage is namespaced by authenticated `user.id`

Helpers: `src/lib/library/` (`listBookmarks`, `isBookmarked`, `toggleBookmark`, `removeBookmark`, `removeBookmarks`).

## UI wiring

- `LibraryProvider` + `useLibrary()` next to Auth under the router
- Guest `toggleBookmark` → `/login` with `state.from` (same pattern as `ProtectedRoute`)
- Login success → `navigate(from.pathname + search || '/')`
- Surfaces: Home secondary Save CTA, Detail Save, Reader bookmark, Library bookmarks tab + bulk delete

## Out of scope

Server sync, reading history from progress, likes heart persistence.
