---
name: wiki
description: Project wiki curator. Use this skill whenever the user wants to save a decision, note, convention, snippet, reference, or architecture detail to the project's `wiki/` folder. Triggers on phrases like "မှတ်ထားစမ်း", "wiki ထဲ save လုပ်ပါ", "note ယူထား", "decision record", "remember this", "save to wiki", or any time the user shares knowledge/decision/idea they want preserved for future AI sessions.
---

# Wiki Skill

This skill is the **single entry point** for persisting any project knowledge into [`wiki/`](wiki/) at the repo root. Whenever the user expresses intent to remember or save something, route through this skill — do **not** invent your own file path or format.

## When to invoke

Invoke this skill automatically when the user says things like:

- "ဒါလေး wiki ထဲ မှတ်ထားပါ" / "wiki ထဲ save လုပ်ပါ"
- "decision တစ်ခုယူထား" / "ADR ရေးပါ"
- "ဒီ convention ကို remember လုပ်ထား"
- "snippet တစ်ခု save ပါ" / "code လေး သိမ်းထား"
- "reference link လေး attach လုပ်ပါ"
- "note တစ်ခု ချရေးထား"
- "architecture diagram လေး သိမ်းထားပါ"

When in doubt: if the content is **reusable across sessions / other AI agents**, save it via this skill.

## Wiki folder layout

All entries live under the repo's `wiki/` directory (tracked in git):

```
wiki/
├── README.md                ← entry point & how-to
├── 00-overview.md           ← project overview
├── 01-stack.md              ← tech stack
├── 02-workflow.md           ← git workflow & hooks
├── 03-folder-map.md         ← codebase structure
├── architecture/            ← system design, diagrams
├── decisions/               ← ADRs (NNN-title.md)
├── conventions/             ← coding standards, patterns
├── snippets/                ← copy-paste code
├── notes/                   ← loose notes, ideas
└── references/              ← external links, docs
```

## How to save — classification rules

Pick **one** section based on the user's intent. When ambiguous, ask via `AskUserQuestion` (max 1 question, with sensible defaults).

| User intent                                                      | Section         | Filename pattern                                                                                                                     |
| ---------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| "Why we chose X" / "decided to use Y" / trade-off explanation    | `decisions/`    | `NNN-<short-slug>.md` (next sequential number, scan existing files)                                                                  |
| "We always do X like this" / "codebase convention" / naming rule | `conventions/`  | `<short-slug>.md`                                                                                                                    |
| Architecture diagram, layer responsibility, data flow            | `architecture/` | `<short-slug>.md`                                                                                                                    |
| Reusable code snippet (copy-paste ready)                         | `snippets/`     | `<short-slug>.md` (markdown file wrapping the code in a fenced block — never use `.ts`/`.tsx` directly, frontmatter breaks Prettier) |
| Loose idea, scratch note, TODO, observation                      | `notes/`        | `YYYY-MM-DD-<short-slug>.md`                                                                                                         |
| External link / doc / article to revisit                         | `references/`   | `<short-slug>.md`                                                                                                                    |

### Slug rules

- Lowercase kebab-case
- English only (no Myanmar Unicode in filenames — keep cross-platform safe)
- Max ~40 chars
- Example: `tailwind-v4-dark-mode.md`

## Required file frontmatter

Every saved entry **must** start with a YAML frontmatter block:

```markdown
---
title: <Human-readable title>
type: <decision | convention | architecture | snippet | note | reference>
date: YYYY-MM-DD
tags: [<tag1>, <tag2>]
---
```

## ADR template (decisions/ only)

```markdown
---
title: <Decision title>
type: decision
date: YYYY-MM-DD
tags: [<relevant-area>]
---

# <Decision title>

## Status

Accepted (or Proposed / Deprecated / Superseded by ADR-NNN)

## Context

What is the issue / driver?

## Decision

What did we choose?

## Consequences

Positive, negative, neutral consequences.

## Alternatives considered

- Alt A — why rejected
- Alt B — why rejected
```

## Snippet template

**Always `.md` file** — wrap the actual code in a fenced block:

```markdown
---
title: <Snippet title>
type: snippet
date: YYYY-MM-DD
tags: [<react>, <tailwind>, <vite>, ...]
language: <ts | tsx | js | css | sh | ...>
---

# <Snippet title>

<One-line description of when to use>

\`\`\`<language>
<the actual code goes here, copy-paste ready>
\`\`\`
```

**Why `.md` only:** Prettier (and lint-staged) parse every staged file. A `.tsx` file starting with YAML frontmatter (`---`) is invalid JS/TS and breaks the pre-commit hook. Markdown wraps the same code safely.

## Index update rule

After creating a new entry:

1. If the entry is a top-level doc (like `04-...md` at wiki root), add a link to `wiki/README.md` index section.
2. If the entry is a section file, append a one-line entry to the corresponding `wiki/<section>/README.md` (create if absent).

## Workflow

1. **Classify** the user's content into one of the 6 sections (above table).
2. **Check existing files** in that folder — avoid duplicates, update if superseding.
3. **Compute filename** — slug + sequence number for decisions.
4. **Compose content** with required frontmatter + appropriate template.
5. **Write file** using `Write` tool with absolute path under `wiki/`.
6. **Update index** if top-level or section README.
7. **Confirm** to user with the file path so they can review/edit.

## Critical rules

- **Never** skip the frontmatter — future AI agents rely on `type`/`tags` for retrieval.
- **Never** save **wiki skill entries** into `src/`, `docs/` (outside wiki), or root — always `wiki/<section>/`.
- **Always** use absolute paths in tool calls.
- **Always** preserve git-tracked status — `wiki/` must remain committed.
- If the user gives **code**, wrap in a fenced block with language tag.
- If the user gives **Burmese/Myanmar** text, keep the content in Burmese but filename in English slug.

## Dual-track documentation

This project uses **two tracks**. Do not conflate them.

| Track       | Path             | Git                                  | Purpose                                                        |
| ----------- | ---------------- | ------------------------------------ | -------------------------------------------------------------- |
| **Wiki**    | `wiki/`          | Committed                            | Long-term knowledge — skill entries with full YAML frontmatter |
| **Session** | `docs/sessions/` | Gitignored (`docs/` in `.gitignore`) | Local daily evidence — detail mirror after implementation work |

- **Wiki skill save targets** are only under `wiki/`. Session files are **not** classified via this skill.
- Session files use a **lighter session template** (see Cursor rule `06-documentation-hygiene.mdc`), not wiki section classification.
- After implementation work, both tracks are **mandatory companions** — see **Post-implementation checklist** below. Do not skip because the user did not say "မှတ်ထား".

## Post-implementation checklist

Run even without wiki trigger phrases:

| If changed                | Update                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------- |
| New Impl phase            | `wiki/architecture/implementation-phases.md` + `wiki/references/pm-tracker-airtable.md` |
| UI / convention behavior  | relevant `wiki/conventions/*.md`                                                        |
| Any impl batch            | `wiki/notes/YYYY-MM-DD-<slug>.md` (committed summary + frontmatter)                     |
| Same batch                | `docs/sessions/YYYY-MM-DD-session-summary.md` (gitignored detail)                       |
| Phase count / index drift | `wiki/README.md`, `wiki/02-workflow.md`, session evidence tables                        |

## After writing

Reply concisely:

> Saved → `wiki/<section>/<filename>>`
> Type: `<type>` | Tags: `<tags>`

Optionally suggest 1 related entry if obvious ("Also worth saving as a snippet: ...").

## Examples

**User:** "Tailwind v4 dark mode အကြောင်း မှတ်ထားစမ်း"
**Skill action:** save to `wiki/notes/2026-07-06-tailwind-v4-dark-mode.md` (note — observation, not a hard decision)

**User:** "useEffect dependency array မှာ object pass မလုပ်ရဘူးဆိုတာ convention သတ်မှတ်ထား"
**Skill action:** save to `wiki/conventions/react-hook-deps.md`

**User:** "Stripe သုံးဖို့ decision ယူထား"
**Skill action:** save to `wiki/decisions/001-use-stripe.md` (ADR)

**User:** "React + Tailwind button component snippet သိမ်းထား"
**Skill action:** save to `wiki/snippets/button.tsx` (+ `.md` explainer)
