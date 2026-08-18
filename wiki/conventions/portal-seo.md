---
title: Portal SEO (SoftGate Comic)
type: convention
date: 2026-08-10
tags: [seo, meta, softgate]
---

# Portal SEO

Use [`src/components/SEO/SEO.tsx`](../../src/components/SEO/SEO.tsx) on every SoftGate Comic route.

## Rules

- Public pages: indexable title/description/canonical/OG/Twitter + JSON-LD when useful
- Private/auth pages (`/login`, `/library`, `/coins`, `/profile`, `/notifications`, …): `noindex`
- Theme color / brand chrome: SoftGate primary `#0e9494`
- OG fallback image: `/logo/logo.jpg` (crawler-friendly); in-app logo mark may be SVG
- Static discovery: [`public/robots.txt`](../../public/robots.txt), [`public/sitemap.xml`](../../public/sitemap.xml) — public URLs only

## Follow-up (needs SoftGate backend)

- Dynamic sitemaps from live catalog
- Share-landing HTML for social crawlers
- Generated OG images
