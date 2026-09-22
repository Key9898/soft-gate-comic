const COVER_PREFIX = '/webtoon-covers/'
const COVER_WIDTHS = [192, 288, 384, 576, 768]
const BANNER_WIDTHS = [640, 960, 1280, 1920, 2560]

/**
 * Slot widths, measured against the card grids rather than guessed: max-w-7xl
 * with `xl:grid-cols-6` and `gap-6` leaves 183px per cover, and the 2-column
 * mobile case is ~44vw. `sizes` is a hint the browser resolves before layout,
 * so erring slightly wide is safe and erring narrow ships a blurry cover.
 */
export const COVER_SIZES =
  '(min-width: 1280px) 183px, (min-width: 1024px) 224px, (min-width: 768px) 31vw, (min-width: 640px) 29vw, 44vw'

/**
 * `HeroBook3D`'s own ladder: `w-56 sm:w-72 lg:w-80 xl:w-96` on the detail page.
 * It is a fixed-width column, not a grid cell, so these are exact rather than
 * viewport-relative. Home steps one rung smaller, which this over-estimates by
 * a single breakpoint — safe, since an over-estimate costs bytes and an
 * under-estimate ships a soft cover on the largest surface the art appears on.
 */
export const HERO_COVER_SIZES =
  '(min-width: 1280px) 384px, (min-width: 1024px) 320px, (min-width: 640px) 288px, 224px'

/**
 * The Home hero's blurred `coverImage` backdrop (HeroBackdrop.tsx): full-bleed at
 * `object-cover`, so its real on-screen size is ~100vw, but it also renders at 65%
 * opacity under a 40px blur - a treatment that makes every rung in `COVER_WIDTHS`
 * visually indistinguishable (see the opacity/blur comment in HeroBackdrop.tsx).
 * Deliberately understating the display size to the browser's srcset selection
 * pins it to the smallest rung (192w) at 1x and keeps it off the 768w top of the
 * ladder through 2x, instead of the ~768w every visitor gets from `100vw` today.
 * The sharp `keyArt` branch does not use this - it genuinely wants full width.
 */
export const HERO_BACKDROP_BLUR_SIZES = '192px'

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
