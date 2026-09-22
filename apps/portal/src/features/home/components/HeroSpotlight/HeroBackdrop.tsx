import type { Webtoon } from '@softgate/shared'
import { heroBackdrop } from '../../../../lib/images/heroBackdrop'
import { coverSources } from '../../../../lib/images/responsiveImage'
import HeroBanner from './HeroBanner'

export interface HeroBackdropProps {
  slide?: Webtoon
  /** True only for the first slide: this is Home's LCP element. */
  priority: boolean
}

const HeroBackdrop = ({ slide, priority }: HeroBackdropProps) => {
  const backdrop = heroBackdrop(slide)

  if (backdrop.kind === 'banner') {
    return (
      <div data-testid="hero-backdrop-banner" className="absolute inset-0">
        <HeroBanner />
      </div>
    )
  }

  const sources = coverSources(backdrop.src)
  const blurred = backdrop.kind === 'cover'

  return (
    <div
      data-testid="hero-backdrop"
      className="pointer-events-none absolute inset-0 overflow-hidden bg-gray-950"
      aria-hidden="true"
    >
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
               hero height from 22rem to 36rem. */
            blurred ? 'scale-125 object-center opacity-45 blur-[60px]' : 'object-right'
          }`}
        />
      </picture>
    </div>
  )
}

export default HeroBackdrop
