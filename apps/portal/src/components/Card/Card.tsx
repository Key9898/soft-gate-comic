import { forwardRef, type HTMLAttributes } from 'react'
import { CARD_CLASS, PANEL_CLASS } from './cardClasses'

/**
 * `card` is the shared content card at `rounded-2xl`; `panel` is a large section
 * shell at `rounded-3xl`. Both radii are prescribed by
 * `wiki/conventions/border-radius.md` — a panel is not a card with a bigger corner,
 * it is a different role in the hierarchy.
 */
export type CardVariant = 'card' | 'panel'

export interface CardProps extends HTMLAttributes<HTMLElement> {
  variant?: CardVariant
  /** Adds the standard inner padding. Off by default so media can bleed to the edge. */
  padded?: boolean
  interactive?: boolean
  as?: 'div' | 'section' | 'article' | 'li'
}

const VARIANTS: Record<CardVariant, string> = {
  card: CARD_CLASS,
  panel: PANEL_CLASS,
}

const INTERACTIVE = 'transition-all duration-200 hover:border-gray-300 hover:shadow-md'

const Card = forwardRef<HTMLElement, CardProps>(
  (
    { variant = 'card', padded = false, interactive = false, as = 'div', className = '', ...props },
    ref
  ) => {
    const Tag = as
    return (
      <Tag
        ref={ref as never}
        className={[
          VARIANTS[variant],
          padded ? 'p-5' : '',
          interactive ? INTERACTIVE : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'

export default Card
