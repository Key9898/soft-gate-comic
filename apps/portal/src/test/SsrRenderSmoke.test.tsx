// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { render, renderPage } from '../entry-server'

const PUBLIC_ROUTES = [
  '/',
  '/ranking',
  '/categories',
  '/categories/romance',
  '/search',
  '/webtoon/1',
  '/webtoon/does-not-exist',
  '/author/1',
  '/read/1/1',
  '/about',
  '/creators',
  '/press',
  '/help',
  '/contact',
  '/faq',
  '/privacy',
  '/terms',
  '/cookies',
  '/maintenance',
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
  '/this-route-does-not-exist',
  '/mm',
  '/mm/categories',
  '/mm/webtoon/1',
  '/mm/read/1/1',
] as const

const TEMPLATE =
  '<html><head><!--app-head--></head><body><div id="root"><!--app-html--></div></body></html>'

describe('SSR render smoke (node, no DOM)', () => {
  it.each(PUBLIC_ROUTES)('renders %s to non-empty HTML on the server', async (url) => {
    const { html } = await render(url)
    expect(html.length).toBeGreaterThan(0)
  })

  it('renders real home content on the server, not a skeleton', async () => {
    const { html, status } = await render('/')
    expect(status).toBe(200)
    expect(html).toContain('<main')
    expect(html).toContain('Trending Now')
  })

  it('renders the series hub content on the server', async () => {
    const { html, status } = await render('/webtoon/1')
    expect(status).toBe(200)
    expect(html).toContain('The Last Horizon')
    expect(html).toContain('hub-comments')
  })

  it('returns 404 for unknown routes and unknown entities', async () => {
    expect((await render('/this-route-does-not-exist')).status).toBe(404)
    expect((await render('/webtoon/does-not-exist')).status).toBe(404)
  })

  it('renderPage injects helmet head and app html into the template', async () => {
    const page = await renderPage(TEMPLATE, '/webtoon/1')
    expect(page.status).toBe(200)
    expect(page.html).toContain('The Last Horizon')
    expect(page.html).toContain('<title')
    expect(page.html).not.toContain('<!--app-html-->')
    expect(page.html).not.toContain('<!--app-head-->')
  })

  it('renderPage keeps the 404 status for missing pages', async () => {
    expect((await renderPage(TEMPLATE, '/nope')).status).toBe(404)
  })

  it('emits ComicSeries and BreadcrumbList JSON-LD on the series hub', async () => {
    const { html } = await renderPage(TEMPLATE, '/webtoon/1')
    expect(html).toContain('"@type":"ComicSeries"')
    expect(html).toContain('"@type":"BreadcrumbList"')
    expect(html).toContain('rel="canonical" href="https://softgatecomic.com/webtoon/1"')
  })

  it('emits WebSite SearchAction and Organization JSON-LD on home', async () => {
    const { html } = await renderPage(TEMPLATE, '/')
    expect(html).toContain('"@type":"WebSite"')
    expect(html).toContain('"@type":"SearchAction"')
    expect(html).toContain('"@type":"Organization"')
  })

  it('marks the reader noindex,follow with no JSON-LD and no canonical', async () => {
    const { html } = await renderPage(TEMPLATE, '/read/1/1')
    expect(html).toContain('content="noindex, follow"')
    expect(html).not.toContain('application/ld+json')
    expect(html).not.toContain('rel="canonical"')
  })

  it('renders the MM home with Myanmar html lang, canonical, and og:locale', async () => {
    const page = await renderPage(TEMPLATE, '/mm')
    expect(page.status).toBe(200)
    expect(page.html).toContain('lang="my"')
    expect(page.html).toContain('rel="canonical" href="https://softgatecomic.com/mm"')
    expect(page.html).toContain('content="my_MM"')
  })

  it('emits hreflang alternates on the EN series hub', async () => {
    const { html } = await renderPage(TEMPLATE, '/webtoon/1')
    expect(html).toContain('hreflang="en" href="https://softgatecomic.com/webtoon/1"')
    expect(html).toContain('hreflang="my" href="https://softgatecomic.com/mm/webtoon/1"')
    expect(html).toContain('hreflang="x-default" href="https://softgatecomic.com/webtoon/1"')
  })

  it('renders the MM series hub with self canonical, MM links, and 200', async () => {
    const page = await renderPage(TEMPLATE, '/mm/webtoon/1')
    expect(page.status).toBe(200)
    expect(page.html).toContain('rel="canonical" href="https://softgatecomic.com/mm/webtoon/1"')
    expect(page.html).toContain('The Last Horizon')
    expect(page.html).toContain('href="/mm/categories"')
    expect(page.html).toContain('hub-comments')
  })

  it('returns 404 for unknown MM routes', async () => {
    expect((await render('/mm/no-such-page')).status).toBe(404)
  })
})
