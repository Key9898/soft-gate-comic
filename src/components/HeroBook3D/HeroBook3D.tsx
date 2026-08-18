import { type ReactNode, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

type HeroBook3DBase = {
  coverImage?: string
  coverColor?: string
  title: string
  description?: string
  className?: string
}

export type HeroBook3DProps =
  | (HeroBook3DBase & { href: string; ctaLabel: string })
  | (HeroBook3DBase & { href?: undefined; ctaLabel?: undefined })

const HeroBook3D = (props: HeroBook3DProps) => {
  const { coverImage, coverColor = 'bg-primary-700', title, className = '' } = props
  const { t } = useTranslation()
  const [imgFailed, setImgFailed] = useState(false)
  const isLinked = 'href' in props && typeof props.href === 'string'

  const coverArt = (
    <div className={`hero-book-cover-art ${coverColor}`}>
      {coverImage && !imgFailed ? (
        <img
          src={coverImage}
          alt=""
          className="h-full w-full object-cover"
          draggable={false}
          onError={() => setImgFailed(true)}
        />
      ) : (
        <span className="text-sm text-white/60">{t('common.coverImage')}</span>
      )}
      <span className="book-spine-overlay" aria-hidden="true" />
    </div>
  )

  let coverFace: ReactNode
  if (isLinked) {
    coverFace = (
      <Link
        to={props.href}
        className="hero-book-cover-link"
        aria-label={`${title}. ${props.ctaLabel}`}
        data-testid="hero-book-cover-link"
      >
        {coverArt}
      </Link>
    )
  } else {
    coverFace = <div className="hero-book-cover-link">{coverArt}</div>
  }

  return (
    <div
      className={`hero-book-scene group w-full ${className}`}
      aria-hidden={isLinked ? undefined : true}
    >
      <div className="hero-book-float-shadow" aria-hidden="true" />
      <div className="hero-book">
        <div className="hero-book-pages" aria-hidden="true" />
        <div className="hero-book-back" aria-hidden="true" />
        <div className="hero-book-cover">{coverFace}</div>
      </div>
    </div>
  )
}

export default HeroBook3D
