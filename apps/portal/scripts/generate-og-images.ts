import { existsSync, mkdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { mockWebtoons } from '@softgate/shared'

const WIDTH = 1200
const HEIGHT = 630
const COVER_HEIGHT = 510
const COVER_WIDTH = 340
const COVER_X = 70
const COVER_Y = Math.round((HEIGHT - COVER_HEIGHT) / 2)
const COVER_RADIUS = 20
const LOGO_WIDTH = 320

const dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(dirname, '../public')
const outDir = path.join(publicDir, 'og')

const roundedMask = Buffer.from(
  `<svg width="${COVER_WIDTH}" height="${COVER_HEIGHT}"><rect x="0" y="0" width="${COVER_WIDTH}" height="${COVER_HEIGHT}" rx="${COVER_RADIUS}" ry="${COVER_RADIUS}" fill="#fff"/></svg>`
)

const darkOverlay = Buffer.from(
  `<svg width="${WIDTH}" height="${HEIGHT}"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#062a2a" stop-opacity="0.82"/><stop offset="1" stop-color="#0e9494" stop-opacity="0.55"/></linearGradient></defs><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/></svg>`
)

async function composeOgImage(coverPath: string, outPath: string, logoPath: string) {
  const background = await sharp(coverPath)
    .resize(WIDTH, HEIGHT, { fit: 'cover' })
    .blur(28)
    .toBuffer()

  const cover = await sharp(coverPath)
    .resize(COVER_WIDTH, COVER_HEIGHT, { fit: 'cover' })
    .composite([{ input: roundedMask, blend: 'dest-in' }])
    .png()
    .toBuffer()

  const logo = await sharp(logoPath).resize({ width: LOGO_WIDTH }).png().toBuffer()
  const logoMeta = await sharp(logo).metadata()
  const logoHeight = logoMeta.height ?? 80

  await sharp(background)
    .composite([
      { input: darkOverlay, top: 0, left: 0 },
      { input: cover, top: COVER_Y, left: COVER_X },
      {
        input: logo,
        top: Math.round((HEIGHT - logoHeight) / 2),
        left: COVER_X + COVER_WIDTH + Math.round((WIDTH - COVER_X - COVER_WIDTH - LOGO_WIDTH) / 2),
      },
    ])
    .png()
    .toFile(outPath)
}

async function main() {
  mkdirSync(outDir, { recursive: true })
  const logoPath = path.join(publicDir, 'logo/logo.png')

  const published = mockWebtoons.filter((webtoon) => webtoon.status !== 'draft')
  let generated = 0
  for (const webtoon of published) {
    if (!webtoon.coverImage) continue
    const coverPath = path.join(publicDir, webtoon.coverImage.replace(/^\//, ''))
    if (!existsSync(coverPath)) {
      console.warn(`skip ${webtoon.id}: cover not found at ${coverPath}`)
      continue
    }
    const outPath = path.join(outDir, `${webtoon.id}.png`)
    await composeOgImage(coverPath, outPath, logoPath)
    generated += 1
    console.log(`og/${webtoon.id}.png generated for "${webtoon.title.en}"`)
  }
  console.log(`${generated} OG images written to ${outDir}`)
}

await main()
