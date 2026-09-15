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
 * Card slots are at most ~183px wide (max-w-7xl, xl:grid-cols-6, gap-6), so 576
 * covers a 3x screen there. `HeroBook3D` is the wider consumer — up to 384px on
 * the detail page — which needs 768 at 2x.
 *
 * 768 is also the ceiling the sources allow: they are 1024 square, and 1024 tall
 * at 3:4 is 768 wide, so anything beyond it would be upscaling. New artwork is
 * briefed at 1152x1536, which would raise that ceiling.
 *
 * The ladder is pre-cropped to 3/4 because that is what every surface renders —
 * cropping here means the browser never downloads pixels `object-cover` is
 * about to discard.
 *
 * The banner keeps its native aspect: it is a full-bleed backdrop and the crop
 * is whatever `object-cover` decides at the visitor's viewport.
 */
export const JOBS: VariantJob[] = [
  {
    sourceDir: 'webtoon-covers',
    outDir: 'webtoon-covers/r',
    widths: [192, 288, 384, 576, 768],
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
