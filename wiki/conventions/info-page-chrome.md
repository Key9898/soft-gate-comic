---
title: Info page chrome (breadcrumb + PageHeader)
type: convention
date: 2026-08-11
tags: [info, breadcrumb, page-header, softgate, impl-17]
---

# Info page chrome

Applies to SoftGate Comic static/info routes under `src/features/info/` (About, Creators, Press, Help, FAQ, Contact, Privacy, Terms, Cookies).

## Banned

- Fake **Back → Home** controls (`Link to="/"` + `ArrowLeft` + `common.back`) on info pages.
- daisyUI (or any new CSS component library) for breadcrumbs/headers — SoftGate stays Tailwind v4 utilities + Soft-Expressive tokens.

## Required chrome

1. **Breadcrumb** — location trail `Home › Section › Page`
   - Home = link to `/`
   - Section (`Company` / `Support` / `Legal`) = **non-link** `<span>` (no section index routes)
   - Current page = last crumb with `aria-current="page"` (text, not a link)
   - Labels: `nav.home`, `footer.company|support|legal`, page titles
2. **PageHeader** — single `<h1>`; eyebrow is never a heading

| Tier    | Pages                   | Header variant                                                 |
| ------- | ----------------------- | -------------------------------------------------------------- |
| Company | About, Creators, Press  | `masthead` (+ soft radial wash where present)                  |
| Support | Help, FAQ, Contact      | `compact` (Help/FAQ: search as `children`; Contact: deck only) |
| Legal   | Privacy, Terms, Cookies | `document` + `legal.lastUpdated` meta; TOC/body below          |

## Container standard (Impl 56)

- Info pages use the **`max-w-7xl` shell** (`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`) so section left edges align with the Navigation logo and Footer.
- Long-form text stays readable via **narrow, left-aligned inner columns** (`max-w-3xl`, no `mx-auto`) inside the shell — do not center a narrow page container like the retired Careers-style `max-w-3xl` shell.
- Grids (step cards, spec panels) may use the full shell width.
- Migrated so far: About (Impl 55), Creators (Impl 56), Press (Impl 57), Help/FAQ/Contact + 404 (Impl 58). Legal pages already ship the 7xl shell.
- **App task pages follow the same standard (Impl 59)**: Profile (7xl shell, `lg:grid-cols-4` grid fills it), Notifications (7xl shell + left-aligned `max-w-3xl` inner column), Coins (7xl shell + left-aligned `max-w-4xl` inner column; fixed-position confetti/modal/snackbar stay outside the inner column).
- **Intentional exclusions — do not migrate**: Reader (`max-w-2xl` vertical-strip reading measure inside ReaderLayout, which has no nav to align with) and Auth pages (AuthLayout centered card is the point). Home already uses the 7xl shell.

## Press page is a press-kit hub (Impl 57)

`/press` ships real media resources, not an empty state: boilerplate (`press.boilerplate*`), brand asset downloads (real files under `public/logo/` only — never fake ZIP/PDF links), honest fact sheet (`press.fact*`), and media contact (`mailto:press@softgatecomic.com`, email wrapped in `translate="no"`). No fake press releases or metrics — see [discovery-honesty.md](discovery-honesty.md).

## 404 recovery page (Impl 58)

`path="*"` renders `src/features/info/NotFoundPage.tsx` **inside MainLayout** so nav + footer stay visible (recovery-flow pattern). Structure: decorative `404` + `notFound.*` title/desc + primary Home `Link`, Search CTA, popular-links row (Categories / Library / Contact). All actions are client-side `Link`s with hover + focus-visible states; SEO uses `noindex`. Never hardcode 404 copy inline in `App.tsx`.

## Source of truth

- Route map: `src/lib/info/pageMeta.ts` (`INFO_PAGES`, `buildInfoBreadcrumbs`, `getInfoPageMeta`)
- Components: `src/components/Breadcrumb/`, `src/components/PageHeader/`

## Related

- Impl note: [2026-08-11-info-page-headers.md](../notes/2026-08-11-info-page-headers.md)
- Soft-Expressive radius: [border-radius.md](border-radius.md)
