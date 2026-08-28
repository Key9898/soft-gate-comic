import { readFileSync } from 'node:fs'
import path from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'

type RenderPage = (template: string, url: string) => { html: string; status: number }

let cached: { template: string; renderPage: RenderPage } | null = null

const loadRenderer = async (): Promise<{ template: string; renderPage: RenderPage }> => {
  if (cached) return cached
  const template = readFileSync(
    path.join(process.cwd(), 'apps/portal/dist/client/template.html'),
    'utf8'
  )
  const mod = (await import('../apps/portal/dist/server/entry-server.js')) as {
    renderPage: RenderPage
  }
  cached = { template, renderPage: mod.renderPage }
  return cached
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  try {
    const { template, renderPage } = await loadRenderer()
    const { html, status } = renderPage(template, req.url ?? '/')
    res.statusCode = status
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    res.end(html)
  } catch (error) {
    res.statusCode = 500
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.end(error instanceof Error ? error.message : 'SSR render failed')
  }
}
