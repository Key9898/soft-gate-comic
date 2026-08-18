---
title: Categories browse (genre + status)
type: convention
date: 2026-08-11
tags: [categories, genres, softgate]
---

# Categories browse

## Genre matching

Never filter with `genre.name[lang]` alone. Use [`src/lib/categories/matchGenre.ts`](../../src/lib/categories/matchGenre.ts):

- Match if any `webtoon.genres[]` equals the genre’s `name.mm`, `name.en`, or `slug` (case-insensitive).
- Mock catalog stores **Myanmar** labels aligned to `Genre.name.mm`.
- Cards resolve display language via `resolveGenreLabel`.

## URL

| Form                                 | Meaning                                                       |
| ------------------------------------ | ------------------------------------------------------------- |
| `/categories`                        | All genres                                                    |
| `/categories/:slug`                  | Genre by slug (preferred for deep links / search suggestions) |
| `/categories?genre=:slug`            | Also accepted                                                 |
| `?status=ongoing\|completed\|hiatus` | Status chip filter                                            |
| `?sort=popular\|new\|…`              | Sort                                                          |

Public browse always excludes `draft`.

## Genre filter row chrome (Impl 24 + 26 + 43)

On `/categories` (and `/categories/:slug`) **and** Home `Genres:` strip (Impl 43):

- Genre pills stay on **one horizontal row** (`flex-nowrap` + `overflow-x-auto`).
- Native scrollbar is **hidden** via `scrollbar-hide` (scroll still works: touch, trackpad, Shift+wheel).
- When more genres exist to the right, show a **reserved right-slot chevron** beside the scroll rail (`useOverflowScrollX` → `canScrollRight`) — never an absolute/z-index overlay over chips; hide and reclaim space at end.
- Home keeps a fixed `Genres:` label outside the scroll rail; Categories has no label.
- On Categories, status chips remain a separate wrap row below and share genre **size** metrics (`min-h-[38px] px-4.5 py-2.5`, `rounded-2xl`).

Do not reintroduce multi-line wrap for the genre strip or overlay chevrons without revisiting this convention.
