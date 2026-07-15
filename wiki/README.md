---
title: Project Wiki Index
type: reference
date: 2026-07-09
tags: [wiki, index]
---

# Project Wiki

AI assistants နှင့် developers များ အတွက် project knowledge base။
User က အရာတစ်ခုခု (decision, snippet, note, ref) ထည့်လိုက်တိုင်း wiki skill က ဒီ folder ထဲ auto-save လုပ်ပေးပါမယ်။

## Structure

| Folder                                                                                           | ရည်ရွယ်ချက်                                         |
| ------------------------------------------------------------------------------------------------ | --------------------------------------------------- |
| [architecture/](architecture/)                                                                   | System design, data flow, **implementation phases** |
| [decisions/](file:///Users/pyaephyomaung/Development/Project/Outsources/ai-poc/wiki/decisions)   | Architecture Decision Records (ADR)                 |
| [conventions/](file:///Users/pyaephyomaung/Development/Outsources/ai-poc/wiki/conventions)       | Coding standards, naming, patterns                  |
| [snippets/](file:///Users/pyaephyomaung/Development/Project/Outsources/ai-poc/wiki/snippets)     | Reusable code snippets                              |
| [notes/](file:///Users/pyaephyomaung/Development/Project/Outsources/ai-poc/wiki/notes)           | Loose notes, ideas, TODOs                           |
| [references/](file:///Users/pyaephyomaung/Development/Project/Outsources/ai-poc/wiki/references) | External links, docs, research                      |

## Index

- [00-overview.md](00-overview.md) — project overview, stack, scripts
- [01-stack.md](01-stack.md) — tech stack details & versions
- [02-workflow.md](02-workflow.md) — git workflow, hooks, documentation dual-track
- [03-folder-map.md](03-folder-map.md) — codebase folder responsibilities
- [architecture/implementation-phases.md](architecture/implementation-phases.md) — **Impl Phases 1–96** + [Doc Phases 33–34](architecture/implementation-phases.md#documentation-phase-33) (master record)
- [references/pm-tracker-airtable.md](references/pm-tracker-airtable.md) — Airtable PM tracker (rows 1–98)
- [references/api-contract.md](references/api-contract.md) — frontend ↔ backend API contract (v2)
- [references/avatar-manifest.md](references/avatar-manifest.md) — designer avatar manifest schema
- [notes/2026-07-09-immersive-phases-73-76.md](notes/2026-07-09-immersive-phases-73-76.md) — Immersive UI Phases 73–76 summary
- [notes/2026-07-10-lobby3d-phase1.md](notes/2026-07-10-lobby3d-phase1.md) — 3D lobby Phase 1 (Impl 81)
- [notes/2026-07-10-lobby-layout-pass.md](notes/2026-07-10-lobby-layout-pass.md) — Lobby layout pass (Impl 82)
- [notes/2026-07-10-lobby-sequence-pass.md](notes/2026-07-10-lobby-sequence-pass.md) — Lobby sequence pass (Impl 83)
- [notes/2026-07-10-lobby-camera-zone.md](notes/2026-07-10-lobby-camera-zone.md) — Camera-to-zone focus (Impl 84)
- [notes/2026-07-10-lobby-pass-85.md](notes/2026-07-10-lobby-pass-85.md) — Lobby foundation polish (Impl 85)
- [notes/2026-07-10-lobby-pass-86.md](notes/2026-07-10-lobby-pass-86.md) — Guide avatar (Impl 86)
- [notes/2026-07-10-lobby-pass-87.md](notes/2026-07-10-lobby-pass-87.md) — Showroom dressing (Impl 87)
- [notes/2026-07-10-lobby-pass-88.md](notes/2026-07-10-lobby-pass-88.md) — Mood + chrome (Impl 88)
- [notes/2026-07-10-lobby-qa-bugfix-89.md](notes/2026-07-10-lobby-qa-bugfix-89.md) — Lobby QA bugfix (Impl 89)
- [notes/2026-07-10-lobby-hmr-white-screen-90.md](notes/2026-07-10-lobby-hmr-white-screen-90.md) — Lobby HMR white-screen fix (Impl 90)
- [notes/2026-07-10-lobby-logo-timing-lights-91.md](notes/2026-07-10-lobby-logo-timing-lights-91.md) — Lobby logo, timing, lights (Impl 91)
- [notes/2026-07-10-lobby-sequence-fastq-92.md](notes/2026-07-10-lobby-sequence-fastq-92.md) — Lobby sequence + Fast Q polish (Impl 92)
- [notes/2026-07-10-lobby-fastq-beats-logo-93.md](notes/2026-07-10-lobby-fastq-beats-logo-93.md) — Lobby Fast Q beats + logo edge (Impl 93)
- [notes/2026-07-13-lobby-welcome-scene-ready-gate.md](notes/2026-07-13-lobby-welcome-scene-ready-gate.md) — Welcome bubble scene-ready gate (Impl 94)
- [notes/2026-07-13-lobby-opening-choreography-fix.md](notes/2026-07-13-lobby-opening-choreography-fix.md) — Lobby opening choreography restore (Impl 95)
- [notes/2026-07-13-lobby-side-panel-label-gating.md](notes/2026-07-13-lobby-side-panel-label-gating.md) — Side panel label gating at counter (Impl 96)

## How to add an entry

User က "Tailwind v4 dark mode အကြောင်း မှတ်ထားစမ်း" လိုမျိုး ပြောလိုက်ရုံပါပဲ။ Wiki skill က သင့်တော်ရာ section မှာ auto-create/save လုပ်ပေးပါမယ်။

After implementation work, agents also update wiki + `docs/sessions/` per rule `06-documentation-hygiene` (user need not ask).
