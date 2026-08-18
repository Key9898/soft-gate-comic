# AGENTS.md — Project Operating Rules

This file is the mandatory operating contract for AI agents (and human collaborators) working on the **SoftGate Comic** user portal. Read it before doing anything. These rules are **non-negotiable**.

## 1. Documentation dual-track — update EVERY change

Every code edit (feature, fix, refactor, a11y tweak — anything beyond a typo) MUST be mirrored in BOTH documentation tracks. Do not let them drift.

### Track A — `wiki/` (committed knowledge base)

The AI-assisted project knowledge base. Update when the change is structural, fact-based, or reusable:

- `wiki/architecture/implementation-phases.md` — SoftGate Comic **Impl N** master index (append next free number; do not reuse [legacy immersive log](wiki/architecture/implementation-phases-legacy.md)).
- `wiki/notes/YYYY-MM-DD-short-slug.md` — one dated note per change session; include `impl: N` in frontmatter when numbered.
- `wiki/references/` — if an API contract or reference doc changed, edit the relevant file.
- `wiki/decisions/` — add an ADR if a non-obvious decision was made (`NNN-short-slug.md`).
- `wiki/conventions/` — if a new UI/code convention is established.
- `wiki/README.md` — update the live note index when notes are added.
- `wiki/03-folder-map.md` — update if a new folder/module was created or removed.

### Track B — `docs/sessions/` (gitignored session log)

The per-session working log for the Lark Task hand-off. After every work block create:

- `docs/sessions/YYYY-MM-DD-session-summary.md` — what was done, what files changed, what to verify, follow-ups.

The `wiki/notes/` mirror is the cleaned-up committed version of the same session; the `docs/sessions/` file is the raw hand-off artifact.

**Do not commit one without the other.** If a change is too small to be worth a session note, it is too small to push. `docs/` is gitignored — local only.

## 2. Lark Task hand-off block — emit on every summary

At the end of every work summary, produce a **copy-ready** block for the Lark Task tracker. The block must contain:

1. A concise **Title** (one line). For numbered SoftGate Comic work: `Impl N — <short summary>`.
2. A **Notes/Gist** body — what changed, files touched, verification command, follow-ups.

Format:

```
=== LARK TASK — COPY FROM BELOW THIS LINE ===
Title: <Impl N — short imperative summary, or plain summary if unnumbered>

Notes:
- <bullet of what was changed>
- <bullet of files touched>
- Verify: `npm run check`
- Follow-up: <next step or "none">
=== LARK TASK — COPY UNTIL ABOVE THIS LINE ===
```

Provide the block as plain text in a fenced code block so the user can triple-click / Ctrl+A inside the fenced region to copy the whole thing in one shot. The `=== ===` delimiter lines exist exactly so single-click selection inside the fence grabs the full task content.

**Checklist formatting:** do NOT use `[x]` or `[ ]` in Lark paste lists — use plain `-` bullets so the user can copy and track manually.

Never abbreviate the block. Never skip it. The user pastes it into Lark manually.

## 3. Quality bar

Treat every change against a production-ready bar:

- **No placeholder-first code.** If a spec is unknowable, ship the most honest real implementation and mark gaps with precise `TODO` + a wiki/session note — never fake the surface.
- **`npm run check` must pass** before declaring done. This runs lint + prettier check + vitest run + tsc + build. Fix failures, never skip with `|| true` or `--no-verify`.
- **Strict TypeScript, strict ESLint.** Prefer real types; avoid `any`.
- **Tailwind v4 discipline.** Theme tokens only via `src/index.css` `@theme {}`. No `tailwind.config.js`. Brand colors via `primary-*` / `accent-*` (see `wiki/conventions/brand-color-tokens.md`).
- **Forced product motion.** Animations we add (HeroBook3D enter, straighten-then-come-forward hover, and future product motion) must play for every visitor, including Windows Animation effects off. Do not wrap them in `prefers-reduced-motion: no-preference`. Do not `animation: none` / `transition: none` those selectors in reduce blocks. Autoplay-off and skeleton pulse/spin may still respect reduce. See `wiki/conventions/forced-product-motion.md`.
- **No comments unless asked.** Self-documenting code only. The wiki carries the rationale, not the source.
- **Never commit secrets.** No API keys, tokens, or auth values. `.env.example` stays stub-only.
- **Never run `git commit` or `git push` yourself** unless the user explicitly asks. Let the user review staged/modified files and commit/push manually. Pre-push hook (`npm run check`) blocks bad pushes — let it.

## Quick orientation

- Entry chain: `index.html` → `src/main.tsx` → `src/App.tsx` → layouts (`MainLayout` / `AuthLayout` / `ReaderLayout`).
- Features live under `src/features/` (home, categories, webtoon, reader, library, coins, profile, auth, info, …).
- Shared package: `packages/shared` (`@softgate/shared`) for shared types/mock data with the admin sibling.
- i18n: `src/lib/i18n/` — locales `en` (default) and `mm`; LanguageSwitcher persists `i18nextLng`.
- Portal UI is **light-only** (see `wiki/conventions/portal-light-and-i18n-defaults.md`).
- Storybook: `npm run storybook` (port 6006).

## Verification commands

| Check                | Command            |
| -------------------- | ------------------ |
| Full gate (pre-push) | `npm run check`    |
| Dev server           | `npm run dev`      |
| Lint + fix           | `npm run lint:fix` |
| Format               | `npm run format`   |
| Test watch           | `npm run test`     |
| Test run             | `npm run test:run` |
| Test UI              | `npm run test:ui`  |
| Build                | `npm run build`    |
