import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

type RenderPage = (template: string, url: string) => { html: string; status: number }

const dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDir = path.resolve(dirname, '../dist/client')
const serverEntry = path.resolve(dirname, '../dist/server/entry-server.js')
const port = Number(process.env.PORT ?? 4173)

const template = readFileSync(path.join(clientDir, 'template.html'), 'utf8')
const { renderPage } = (await import(pathToFileURL(serverEntry).href)) as {
  renderPage: RenderPage
}

const staticRoot = path.relative(process.cwd(), clientDir).split(path.sep).join('/')
const STATIC_PREFIXES = [
  '/assets',
  '/favicon',
  '/webtoon-covers',
  '/about',
  '/auth',
  '/banner',
  '/logo',
  '/og',
]

const app = new Hono()
for (const prefix of STATIC_PREFIXES) {
  app.use(`${prefix}/*`, serveStatic({ root: staticRoot }))
}
app.use('/robots.txt', serveStatic({ root: staticRoot }))
app.use('/sitemap.xml', serveStatic({ root: staticRoot }))

app.get('*', (c) => {
  const { html, status } = renderPage(template, new URL(c.req.url).pathname)
  return c.html(html, status as ContentfulStatusCode)
})

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`SSR preview server running at http://localhost:${info.port}`)
})
