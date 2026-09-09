import http from 'node:http'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer as createViteServer } from 'vite'

type RenderPage = (template: string, url: string) => Promise<{ html: string; status: number }>

const dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(dirname, '..')
const port = Number(process.env.PORT ?? 5173)

const vite = await createViteServer({
  root,
  server: { middlewareMode: true },
  appType: 'custom',
})

const server = http.createServer((req, res) => {
  vite.middlewares(req, res, () => {
    void (async () => {
      const url = req.url ?? '/'
      try {
        if (url === '/sitemap.xml') {
          const sitemapMod = (await vite.ssrLoadModule('/src/lib/seo/sitemap.ts')) as {
            buildSitemapXml: () => string
          }
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/xml; charset=utf-8')
          res.end(sitemapMod.buildSitemapXml())
          return
        }
        const raw = readFileSync(path.join(root, 'index.html'), 'utf8')
        const template = await vite.transformIndexHtml(url, raw)
        const mod = (await vite.ssrLoadModule('/src/entry-server.tsx')) as {
          renderPage: RenderPage
        }
        const { html, status } = await mod.renderPage(template, url)
        res.statusCode = status
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(html)
      } catch (error) {
        if (error instanceof Error) vite.ssrFixStacktrace(error)
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(error instanceof Error ? (error.stack ?? error.message) : String(error))
      }
    })()
  })
})

server.listen(port, () => {
  console.log(`SSR dev server running at http://localhost:${port}`)
})
