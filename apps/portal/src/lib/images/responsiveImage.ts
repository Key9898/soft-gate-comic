const COVER_PREFIX = '/webtoon-covers/'
const COVER_WIDTHS = [192, 288, 384, 576]
const BANNER_WIDTHS = [640, 960, 1280, 1920, 2560]

/**
 * Slot widths, measured against the card grids rather than guessed: max-w-7xl
 * with `xl:grid-cols-6` and `gap-6` leaves 183px per cover, and the 2-column
 * mobile case is ~44vw. `sizes` is a hint the browser resolves before layout,
 * so erring slightly wide is safe and erring narrow ships a blurry cover.
 */
export const COVER_SIZES =
  '(min-width: 1280px) 183px, (min-width: 1024px) 224px, (min-width: 768px) 31vw, (min-width: 640px) 29vw, 44vw'

export interface ResponsiveSources {
  avif: string
  webp: string
  fallback: string
}

const srcSet = (dir: string, stem: string, ext: string, widths: number[]) =>
  widths.map((width) => `${dir}/${stem}-${width}.${ext} ${width}w`).join(', ')

/**
 * Only local catalog covers have generated variants. A cover served from R2 or
 * any other origin passes through as `null` so the caller renders a plain `img`
 * — inventing variant URLs for a remote file would 404 every source.
 */
export function coverSources(coverImage: string | undefined): ResponsiveSources | null {
  if (!coverImage?.startsWith(COVER_PREFIX)) return null
  const name = coverImage.slice(COVER_PREFIX.length)
  if (name.includes('/')) return null
  const stem = name.replace(/\.[^.]+$/, '')
  if (!stem || stem === name) return null
  const dir = `${COVER_PREFIX}r`
  return {
    avif: srcSet(dir, stem, 'avif', COVER_WIDTHS),
    webp: srcSet(dir, stem, 'webp', COVER_WIDTHS),
    fallback: coverImage,
  }
}

export function bannerSources(): ResponsiveSources {
  return {
    avif: srcSet('/banner/r', 'banner', 'avif', BANNER_WIDTHS),
    webp: srcSet('/banner/r', 'banner', 'webp', BANNER_WIDTHS),
    fallback: '/banner/banner.png',
  }
}
