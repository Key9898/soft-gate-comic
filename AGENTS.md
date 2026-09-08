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
- Verify: `pnpm check`
- Follow-up: <next step or "none">
=== LARK TASK — COPY UNTIL ABOVE THIS LINE ===
```

Provide the block as plain text in a fenced code block so the user can triple-click / Ctrl+A inside the fenced region to copy the whole thing in one shot. The `=== ===` delimiter lines exist exactly so single-click selection inside the fence grabs the full task content.

**Checklist formatting:** do NOT use `[x]` or `[ ]` in Lark paste lists — use plain `-` bullets so the user can copy and track manually.

Never abbreviate the block. Never skip it. The user pastes it into Lark manually.

## 3. Quality bar

Treat every change against a production-ready bar:

- **No placeholder-first code.** If a spec is unknowable, ship the most honest real implementation and mark gaps with precise `TODO` + a wiki/session note — never fake the surface.
- **Prelaunch quality bar.** The portal is not public yet. Meet international webtoon-site standard and **beat** current webtoon sites on layout, information completeness, and UI/UX. Incomplete client data, pre-public status, and live upload/monetization on other sites are **not** reasons to ship a thin page. Complete IA with honest Demo / client-swap slots. Do not fake working publisher tools or fabricated MAU. Canonical: [`wiki/conventions/prelaunch-quality-bar.md`](wiki/conventions/prelaunch-quality-bar.md). Always-on: `.cursor/rules/07-prelaunch-quality-bar.mdc`.
- **`pnpm check` must pass** before declaring done. This runs lint + prettier check + vitest run + tsc + build. Fix failures, never skip with `|| true` or `--no-verify`.
- **Strict TypeScript, strict ESLint.** Prefer real types; avoid `any`.
- **Tailwind v4 discipline.** Theme tokens only via `apps/portal/src/index.css` `@theme {}`. No `tailwind.config.js`. Brand colors via `primary-*` / `accent-*` (see `wiki/conventions/brand-color-tokens.md`).
- **Forced product motion.** Animations we add (HeroBook3D enter, straighten-then-come-forward hover, and future product motion) must play for every visitor, including Windows Animation effects off. Do not wrap them in `prefers-reduced-motion: no-preference`. Do not `animation: none` / `transition: none` those selectors in reduce blocks. Autoplay-off and skeleton pulse/spin may still respect reduce. See `wiki/conventions/forced-product-motion.md`.
- **No comments unless asked.** Self-documenting code only. The wiki carries the rationale, not the source.
- **Never commit secrets.** No API keys, tokens, or auth values. `.env.example` stays stub-only.
- **Never run `git commit` or `git push` yourself** unless the user explicitly asks. Let the user review staged/modified files and commit/push manually. Pre-push hook (`pnpm check`) blocks bad pushes — let it.

## Quick orientation

- Entry chain: `apps/portal/index.html` (placeholders) → `apps/portal/src/entry-client.tsx` (hydrate) → `src/App.tsx` → layouts (`MainLayout` / `AuthLayout` / `ReaderLayout`). Local `pnpm dev` is Vite SPA; production public routes stay SSR via `src/entry-server.tsx` + `apps/portal/server/` + Vercel `api/ssr.ts` (Impl 178–181, `wiki/conventions/portal-seo-ssr.md`). Local SSR check: `pnpm dev:ssr`.
- Features live under `apps/portal/src/features/` (home, categories, webtoon, reader, library, coins, profile, auth, info, …).
- Shared package: `packages/shared` (`@softgate/shared`) for catalog types/mock data. Contracts: `packages/contracts` (`@softgate/contracts`). API: `apps/api` (`@softgate/api`) — `GET /health`, `GET /api/catalog`, `GET /api/settings`, reader `/api/auth/*`, `/api/wallet/*`, `/api/library/*`, `/api/notifications/*`, and `/api/prefs/*` when portal mock is off (Impl 174–175, 187–192). Named Prisma/R2/Brevo env slots (Impl 176); Prisma persist when `DATABASE_URL` is set (Impl 185); R2 put helper under `portal/` when core slots are set (Impl 186); Brevo HTML forgot/reset when key+from are set (Impl 187). Portal catalog/auth/wallet/library/notifications/prefs is mock unless `VITE_USE_MOCK_API=false` (`isMockApi` unset stays mock). Committed `apps/portal/.env.example` is `false`; Vite does not load the example. Local `pnpm dev` HTTP needs gitignored `.env.development.local` plus `pnpm dev:api`. Profile writers are cookie POSTs in HTTP mode (Impl 188). Library Subscribe/History/Likes are cookie persist in HTTP mode (Impl 190). Notifications inbox is cookie persist in HTTP mode (Impl 191). Notif toggles and reader display prefs are cookie persist in HTTP mode (Impl 192). Git: `main` is product/UI and Vercel; `development` is the leader-dev integration track (local gitignored env only).
- i18n: `apps/portal/src/lib/i18n/` — locales `en` (default) and `mm`; LanguageSwitcher persists `i18nextLng`.
- Portal UI is **light-only** (see `wiki/conventions/portal-light-and-i18n-defaults.md`).
- Storybook: `pnpm storybook` (port 6006).

## Verification commands

| Check                | Command         |
| -------------------- | --------------- |
| Full gate (pre-push) | `pnpm check`    |
| Dev server           | `pnpm dev`      |
| Lint + fix           | `pnpm lint:fix` |
| Format               | `pnpm format`   |
| Test watch           | `pnpm test`     |
| Test run             | `pnpm test:run` |
| Test UI              | `pnpm test:ui`  |
| Build                | `pnpm build`    |
