import { bannerSources } from '../../../../lib/images/responsiveImage'

/**
 * The hero backdrop is an `img`, not a CSS `background-image`. Backgrounds
 * cannot carry `srcset`/`sizes`, so every visitor downloaded the full 10667px
 * source for a band at most 576px tall — and this is Home's LCP element, which
 * a background also cannot hint with `fetchpriority`.
 */
const HeroBanner = () => {
  const sources = bannerSources()

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden bg-gray-950"
      aria-hidden="true"
    >
      <picture>
        <source type="image/avif" srcSet={sources.avif} sizes="100vw" />
        <source type="image/webp" srcSet={sources.webp} sizes="100vw" />
        <img
          src={sources.fallback}
          alt=""
          decoding="async"
          {...({ fetchpriority: 'high' } as Record<string, string>)}
          className="h-full w-full object-cover object-center"
        />
      </picture>
    </div>
  )
}

export default HeroBanner
