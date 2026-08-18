---
title: Source layering and hybrid imports
type: convention
date: 2026-08-11
tags: [structure, imports, context, features, softgate]
impl: 19
---

# Source layering and hybrid imports

SoftGate Comic portal structure standard (Phase A structure hygiene).

## Layers

| Layer                | Location                              | Rule                                              |
| -------------------- | ------------------------------------- | ------------------------------------------------- |
| Pages                | `src/features/<domain>/`              | Route pages live here; no cross-feature imports   |
| App-wide React state | `src/context/`                        | `DataContext`, `AuthContext`                      |
| Domain logic         | `src/lib/<domain>/`                   | Barrel `index.ts` when multi-file                 |
| Reusable UI          | `src/components/<Name>/` + `index.ts` | Shared across features                            |
| Feature-only UI      | `src/features/<domain>/components/`   | Create only when extracting presentational pieces |
| Package types/data   | `@softgate/shared`                    | No portal `src/types` shim                        |

Auth pages stay under `features/auth/`. Implementation of auth state lives in `src/context/AuthContext.tsx`. `features/auth/useAuth.tsx` is a thin re-export safety net for feature-local imports.

## Imports (hybrid)

| Kind                                                   | Style                                                  |
| ------------------------------------------------------ | ------------------------------------------------------ |
| Colocated / same feature                               | `./` or `../`                                          |
| Cross-tree (`components`, `lib`, `context`, `layouts`) | Prefer `@/...` on **touched** files; relative still OK |
| Shared package                                         | `@softgate/shared`                                     |

**Do not** mass-codemod all relatives to `@/` in one Impl. Apply hybrid style when editing a file.

## Explicit non-goals (parking lot)

Do not do as “structure cleanup”:

- Mass `@/` rewrite across `src/`
- Coins payment-wizard file split
- Reader header/footer/scroll system split
- ~~Wiring a shared Comments component into Reader~~ — done Impl 34 (`softgate_comments_v1`)
- Inventing a live `ROUTES` constants module from stale stubs
- Pre-creating empty `features/*/components/` folders before an extract Impl

## Related

- [03-folder-map.md](../03-folder-map.md)
- Phase B presentational splits: one page family per Impl after this convention
