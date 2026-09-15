import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp, { type Sharp } from 'sharp'
import { JOBS, MANIFEST_PATH, sourceFilesIn, type VariantManifest } from './imageVariants.config.js'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(dirname, '../public')

const FORMATS = [
  { ext: 'avif', apply: (p: Sharp) => p.avif({ quality: 55, effort: 6 }) },
  { ext: 'webp', apply: (p: Sharp) => p.webp({ quality: 78 }) },
] as const

const kb = (bytes: number) => `${Math.round(bytes / 1024)}kB`

const hashFile = (file: string) => createHash('sha256').update(readFileSync(file)).digest('hex')

async function main() {
  const manifest: VariantManifest = {}
  let total = 0

  for (const job of JOBS) {
    const sourceRoot = path.join(publicDir, job.sourceDir)
    const outRoot = path.join(publicDir, job.outDir)
    if (!existsSync(sourceRoot)) {
      console.warn(`skip ${job.sourceDir}: directory not found`)
      continue
    }
    mkdirSync(outRoot, { recursive: true })

    const sources = sourceFilesIn(readdirSync(sourceRoot))
    let sourceBytes = 0
    let largest = 0

    for (const name of sources) {
      const sourcePath = path.join(sourceRoot, name)
      sourceBytes += statSync(sourcePath).size
      const stem = name.replace(/\.[^.]+$/, '')

      for (const width of job.widths) {
        const resize = job.aspect
          ? {
              width,
              height: Math.round((width * job.aspect[1]) / job.aspect[0]),
              fit: 'cover' as const,
            }
          : { width, withoutEnlargement: true }

        for (const format of FORMATS) {
          const outPath = path.join(outRoot, `${stem}-${width}.${format.ext}`)
          await format.apply(sharp(sourcePath).resize(resize)).toFile(outPath)
          largest = Math.max(largest, statSync(outPath).size)
          total += 1
        }
      }

      manifest[`${job.sourceDir}/${name}`] = hashFile(sourcePath)
    }

    console.log(
      `${job.sourceDir}: ${sources.length} sources (${kb(sourceBytes)}) -> ${sources.length * job.widths.length * FORMATS.length} variants, largest ${kb(largest)}`
    )
  }

  writeFileSync(path.join(publicDir, MANIFEST_PATH), `${JSON.stringify(manifest, null, 2)}\n`)
  console.log(`${total} variants written; manifest covers ${Object.keys(manifest).length} sources`)
}

await main()
