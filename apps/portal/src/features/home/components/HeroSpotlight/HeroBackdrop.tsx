import { useEffect, useRef, useState } from 'react'
import type { Webtoon } from '@softgate/shared'
import {
  heroBackdrop,
  type HeroBackdrop as HeroBackdropDescriptor,
} from '../../../../lib/images/heroBackdrop'
import { coverSources } from '../../../../lib/images/responsiveImage'
import HeroBanner from './HeroBanner'

export interface HeroBackdropProps {
  slide?: Webtoon
  /** True only for the first slide: this is Home's LCP element. */
  priority: boolean
  /** From `prefers-reduced-motion`: cuts the crossfade to an instant swap. */
  reducedMotion: boolean
}

/** Matches `duration-400` in Tailwind: the crossfade fades over 400ms. */
const CROSSFADE_MS = 400

const backdropKey = (backdrop: HeroBackdropDescriptor): string =>
  backdrop.kind === 'banner' ? 'banner' : backdrop.src

interface HeroBackdropImageProps {
  backdrop: HeroBackdropDescriptor
  priority: boolean
}

const HeroBackdropImage = ({ backdrop, priority }: HeroBackdropImageProps) => {
  if (backdrop.kind === 'banner') return null

  const sources = coverSources(backdrop.src)
  const blurred = backdrop.kind === 'cover'

  return (
    <picture>
      {sources ? <source type="image/avif" srcSet={sources.avif} sizes="100vw" /> : null}
      {sources ? <source type="image/webp" srcSet={sources.webp} sizes="100vw" /> : null}
      <img
        src={sources ? sources.fallback : backdrop.src}
        alt=""
        decoding="async"
        loading={priority ? undefined : 'lazy'}
        {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
        className={`h-full w-full object-cover ${
          /* scale-110 still leaves a visible darker band within ~20-30px of the
             top/bottom edge on short (mobile) hero heights, measured by rasterizing
             the actual filtered/transformed element: the CSS filter's edge falloff
             reaches further than a 10% overscan absorbs. scale-125 pushes that
             falloff far enough outside the clipped box to be imperceptible at every
             hero height from 22rem to 36rem (still true at blur-[40px]: a smaller
             blur radius only shrinks the falloff further).

             opacity-65 + blur-[40px] replaces the original opacity-45 + blur-[60px]
             (wiki/notes/2026-09-22-home-hero-full-bleed-design.md's original values):
             stacked with the pre-existing HeroSpotlight scrim, those values rasterized
             to a near-flat dark slab with no discernible cover art. Rasterizing the
             rendered composite across the demo catalog put the worst-case deck-text
             contrast at 5.32:1 and title contrast at 6.25:1 with this pairing (WCAG AA
             needs 4.5:1 / 3:1) — see HeroSpotlight.tsx's scrim comment for the other
             half of the fix. */
          blurred ? 'scale-125 object-center opacity-65 blur-[40px]' : 'object-right'
        }`}
      />
    </picture>
  )
}

interface HeroBackdropCrossfadeProps {
  backdrop: HeroBackdropDescriptor
  priority: boolean
  reducedMotion: boolean
}

/**
 * Crossfades the backdrop image between slides. A `key` on the wrapper would replace
 * the element outright instead of transitioning it, so this keeps the outgoing image
 * mounted underneath while the incoming one fades in over it (issue #39, Task 3). Under
 * reduced motion the swap is instant: no outgoing layer, no transition classes.
 */
const HeroBackdropCrossfade = ({
  backdrop,
  priority,
  reducedMotion,
}: HeroBackdropCrossfadeProps) => {
  const key = backdropKey(backdrop)
  const mountedKeyRef = useRef(key)
  const mountedBackdropRef = useRef(backdrop)
  const [outgoing, setOutgoing] = useState<HeroBackdropDescriptor | null>(null)
  const [entered, setEntered] = useState(true)

  useEffect(() => {
    if (mountedKeyRef.current === key) return
    const previous = mountedBackdropRef.current
    mountedKeyRef.current = key
    mountedBackdropRef.current = backdrop

    if (reducedMotion) {
      setOutgoing(null)
      setEntered(true)
      return
    }
    setOutgoing(previous)
    setEntered(false)
  }, [key, backdrop, reducedMotion])

  useEffect(() => {
    if (entered) return
    const raf = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(raf)
  }, [entered])

  useEffect(() => {
    if (!entered || !outgoing) return
    const timeout = window.setTimeout(() => setOutgoing(null), CROSSFADE_MS)
    return () => window.clearTimeout(timeout)
  }, [entered, outgoing])

  return (
    <div
      data-testid="hero-backdrop-crossfade"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-gray-950"
      aria-hidden="true"
    >
      {outgoing ? (
        <div data-testid="hero-backdrop-outgoing" className="absolute inset-0">
          <HeroBackdropImage backdrop={outgoing} priority={false} />
        </div>
      ) : null}
      <div
        data-testid="hero-backdrop"
        className={`absolute inset-0 ${
          reducedMotion
            ? ''
            : `duration-400 transition-opacity ${entered ? 'opacity-100' : 'opacity-0'}`
        }`}
      >
        <HeroBackdropImage backdrop={backdrop} priority={priority} />
      </div>
    </div>
  )
}

const HeroBackdrop = ({ slide, priority, reducedMotion }: HeroBackdropProps) => {
  const backdrop = heroBackdrop(slide)

  if (backdrop.kind === 'banner') {
    return (
      <div data-testid="hero-backdrop-banner" className="absolute inset-0">
        <HeroBanner />
      </div>
    )
  }

  return (
    <HeroBackdropCrossfade backdrop={backdrop} priority={priority} reducedMotion={reducedMotion} />
  )
}

export default HeroBackdrop
