export interface VariantJob {
  sourceDir: string
  outDir: string
  widths: number[]
  aspect?: [number, number]
}

export type VariantManifest = Record<string, string>

export const MANIFEST_PATH = 'image-variants.json'

export const FORMAT_EXTENSIONS = ['avif', 'webp'] as const

/**
 * Cover slots are at most ~183px wide (max-w-7xl, xl:grid-cols-6, gap-6), so
 * 576 covers a 3x screen with nothing wasted. The ladder is pre-cropped to 3/4
 * because that is what `BookCard` renders — cropping here means the browser
 * never downloads pixels `object-cover` is about to discard.
 *
 * The banner keeps its native aspect: it is a full-bleed backdrop and the crop
 * is whatever `object-cover` decides at the visitor's viewport.
 */
export const JOBS: VariantJob[] = [
  {
    sourceDir: 'webtoon-covers',
    outDir: 'webtoon-covers/r',
    widths: [192, 288, 384, 576],
    aspect: [3, 4],
  },
  {
    sourceDir: 'banner',
    outDir: 'banner/r',
    widths: [640, 960, 1280, 1920, 2560],
  },
]

export const sourceFilesIn = (names: string[]) =>
  names.filter((name) => /\.(png|jpe?g)$/i.test(name))
