import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSitemapXml } from '../src/lib/seo/sitemap'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const outPath = path.resolve(dirname, '../dist/client/sitemap.xml')

writeFileSync(outPath, buildSitemapXml())
console.log(`sitemap.xml written to ${outPath}`)
