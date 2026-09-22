import type { Webtoon } from '@softgate/shared'

export type HeroBackdrop =
  { kind: 'keyArt'; src: string } | { kind: 'cover'; src: string } | { kind: 'banner' }

/**
 * The Home hero backdrop rotates with the slide (issue #39). Landscape `keyArt` renders
 * sharp; a slide with only a portrait `coverImage` renders as a blurred wash, because
 * cover sources are 1024px square and stretching one across the hero is visibly soft.
 */
export function heroBackdrop(slide: Webtoon | undefined): HeroBackdrop {
  if (slide?.keyArt) return { kind: 'keyArt', src: slide.keyArt }
  if (slide?.coverImage) return { kind: 'cover', src: slide.coverImage }
  return { kind: 'banner' }
}
