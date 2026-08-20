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
   - About (Impl 103): footer + breadcrumb stay **About Us**; masthead H1 is **Who we are** (`about.whoWeAre`). Do not change `pageMeta` `titleKey` for the crumb.
   - Creators (Impl 107): footer + breadcrumb stay **Publish with Us** (`static.creatorsTitle`); eyebrow is **Creators** (`info.eyebrow.creators`). SEO title stays `static.creatorsTitle`. Do not change `pageMeta` `titleKey` for the crumb.

| Tier    | Pages                   | Header variant                                                                                       |
| ------- | ----------------------- | ---------------------------------------------------------------------------------------------------- |
| Company | About, Creators, Press  | `masthead` (+ soft radial wash where present)                                                        |
| Support | Help, FAQ, Contact      | `compact` (Help **and** FAQ: search as `children`; Contact: deck + Try Help above the form)          |
| Legal   | Privacy, Terms, Cookies | `document` + `legal.lastUpdated` meta; TOC/body below; `radial-wash-primary` like Support (Impl 126) |

## Container standard (Impl 56)

- Info pages use the **`max-w-7xl` shell** (`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8`) so section left edges align with the Navigation logo and Footer.
- Long-form text stays readable via **narrow, left-aligned inner columns** (`max-w-3xl`, no `mx-auto`) inside the shell — do not center a narrow page container like the retired Careers-style `max-w-3xl` shell.
- Grids (step cards, spec panels) may use the full shell width.
- Migrated so far: About (Impl 55), Creators (Impl 56), Press (Impl 57), Help/FAQ/Contact + 404 (Impl 58). Legal pages already ship the 7xl shell.
- **App task pages follow the same standard (Impl 59)**: Profile (7xl shell, `lg:grid-cols-4` grid fills it), Notifications (7xl shell + left-aligned `max-w-3xl` inner column), Coins (7xl shell + left-aligned `max-w-4xl` inner column; fixed-position confetti/modal/snackbar stay outside the inner column).
- **Intentional exclusions — do not migrate**: Reader (`max-w-2xl` vertical-strip reading measure inside ReaderLayout, which has no nav to align with). Auth (Impl 136, split-card Impl 146) uses `AuthLayout` (portal wash + login/register split card), not info breadcrumbs. Home already uses the 7xl shell.

## Creators page is editorial intake (Impl 56, updated 107, polish 110)

`/creators` is a curated pitch landing (Lezhin-shaped), not a Canvas uploader. Stack: fact chips → jump TOC → why (3 cards) → how it works (3) → demo 3:4 cover examples → format handbook (visual 3:4 + 800px strip, then 800px default specs) → pitch checklist → look for + do not send → after you send → rights/earnings + other platforms → always-visible FAQ `<dl>` → **Send your pitch** (`#creators-cta`) to `/contact?intent=submit` plus a **fixed** bottom bar (`z-30`, pad clear of ScrollToTop). No page-root `overflow-hidden` (wash wrapper only). No fake Upload, no fabricated payout %, no `creators@` inbox — Contact still opens `support@softgatecomic.com` (`translate="no"` on the CTA line). Default `/contact` has no extra labeled pitch fields (Impl 111). **`intent=submit` uses labeled pitch fields (Impl 112)**; finished-episode count **min 3**, matching handbook / do-not-send (Impl 116). After-you-send is Demo copy with **no published reply SLA** (aligned with Contact `hours`). See [prelaunch-quality-bar.md](prelaunch-quality-bar.md).

## Support funnel (Impl 108, updated 111, pitch 112, align 116, hub 120)

Three routes, three jobs. Footer Support names all three: **Help Center + FAQ + Contact**. Help remains the front door; FAQ is the catalog; Contact is last-step mailto.

1. **`/help`** — front door. Compact left header + `max-w-3xl` search (do not center). Hub **body fills the 7xl shell**. Search filters `src/lib/info/faqCatalog.ts` (2+ characters) and links to `/faq#qN`. Six topic cards: Getting Started / Payments / Account Security → `/faq?cat=`; Library → `/faq#q16`; Safety → `/faq#q18`; Contact → `/contact`. Browse-all-questions row → `/faq`. Popular row uses `/faq#q2` … `#q14`. Creators + Need More sit in a 2-col grid (`lg:grid-cols-2`; mobile stacks). Creators line to `/creators`. Need More copy matches the `/contact` CTA (not a fake mailto sentence). Topic, popular, browse-all, and Need More targets are `min-h-11`.
2. **`/faq`** — answer library. 7xl shell + **inner `max-w-3xl`** (reading measure — do not widen to 7xl). Stable hashes `#q1`–`#q20` open the item (`aria-expanded` / `aria-controls`), switch category so it is visible, and `scrollIntoView`. `?cat=` sets the tab (still four categories). Related links stay on already-shipped routes (`/library`, `/notifications` included). `q14` related stays `/creators` (never `intent=submit`). `a14`: no in-portal upload; format and Send your pitch are on Publish with Us (Impl 116). Always-on **Still need help** → `/contact`. Thumbs are local-only (this page / this browser; we do not receive votes). Accordion, tabs, and thumbs are `min-h-11`. Coins answers match demo top-up (no live payment method / not live purchases).
3. **`/contact`** — last step. Honest mailto form. Clickable `mailto:support@softgatecomic.com` (`translate="no"`, `min-h-11`). Deck: Help and FAQ first; the form opens the email app. Try Help first → `/help` and `/faq`. Path cards: reader stays `support@`; Creators → `/creators`; Press → `/press`. HQ `Insein, Yangon, Myanmar` (no street number). Reader checklist (what you were doing / which page or series / language) is display-only — **no extra form fields** on default `/contact`. **`intent=submit` uses labeled pitch fields (Impl 112)** (title, genre, episode count **min 3**, synopsis, 3:4 cover checkbox, optional platforms/notes); subject prefills `Series submission`; reader checklist is hidden; handbook `Link` to `/creators#creators-specs` (default Contact does not show it) (Impl 116). Inbox hours (Demo): weekdays, Yangon time — studio replaces (Impl 113). Yangon time, no SLA, no phone, no chat, no ticket IDs.

No page-root `overflow-hidden` on Help / FAQ / Contact (wash wrapper only). Support sections use About-style `SECTION_RULE` + heading dot, copied locally (no shared chrome module). Footer Support is **Help Center + FAQ + Contact**. Keep the `/faq` route and `public/sitemap.xml` FAQ loc. Help and FAQ share Contact chrome: `max-w-7xl` + `radial-wash-primary`. Legal (Privacy / Terms / Cookies) uses the same wash via `LegalPageShell` (Impl 126); see [legal-pages.md](legal-pages.md).

## Press page is a press-kit hub (Impl 57, updated 102)

`/press` is a press-kit hub (Impl 57, IA expanded Impl 102): boilerplate with copy, honest fact sheet, brand asset downloads (`/logo/logo.svg`, `/logo/logo.png`, `/favicon/icon-512.png` — never fake ZIP/PDF or JPG), Do/Don’t usage, News / product images / spokesperson as honest empty copy (no fake coverage or broken images), media contact (`mailto:press@softgatecomic.com`, `translate="no"`). Canva `favicon.svg` is the site tab icon only — not a press download. No fake press releases or metrics — see [discovery-honesty.md](discovery-honesty.md).

## 404 recovery page (Impl 58, updated 118, polish 121)

`path="*"` renders `src/features/info/NotFoundPage.tsx` **inside MainLayout** so nav + footer stay visible. Missing `/webtoon/:id` reuses the same recovery without embedding chrome. Missing `/author/:id` uses `variant="author"`. Missing `/read/...` passes `withSiteChrome` so skip link + Navigation + Footer match the site 404 (live reader stays on `ReaderLayout`; broken URL stays in the bar — no `/not-found` or homepage redirect). Variants: page / series / episode / author. Stack: decorative `404` + variant `h1` + Search heading (`search.title`) + `SearchAutocomplete` + Home (and Back to series when the series exists) + guest-safe Go here (Categories / Popular / New — not Library, not Help/Contact) + demo 3:4 `BookCard` tiles + Still need help (Help + Contact). Inner shell is `bg-gray-50` without `min-h-screen`. SEO: `noindex`, no JSON-LD, no canonical, no keywords, no `og:image`, no Twitter tags. Unknown path shapes return HTTP 404 on Vercel (`404.html`); catalog id misses stay 200 + React recovery. Never hardcode 404 copy inline in `App.tsx`.

## Source of truth

- Route map: `src/lib/info/pageMeta.ts` (`INFO_PAGES`, `buildInfoBreadcrumbs`, `getInfoPageMeta`)
- Components: `src/components/Breadcrumb/`, `src/components/PageHeader/`

## Related

- Impl note: [2026-08-11-info-page-headers.md](../notes/2026-08-11-info-page-headers.md)
- Soft-Expressive radius: [border-radius.md](border-radius.md)
