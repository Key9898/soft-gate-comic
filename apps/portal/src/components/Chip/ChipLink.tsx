import { forwardRef } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { chipClasses, type ChipTone } from './chipClasses'

export interface ChipLinkProps extends Omit<LinkProps, 'className'> {
  selected: boolean
  tone?: ChipTone
  className?: string
}

/** A chip that navigates. Same measurements and tones as `Chip`. */
const ChipLink = forwardRef<HTMLAnchorElement, ChipLinkProps>(
  ({ selected, tone = 'filter', className = '', ...props }, ref) => (
    <Link
      ref={ref}
      aria-current={selected ? 'page' : undefined}
      className={chipClasses(selected, tone, className)}
      {...props}
    />
  )
)

ChipLink.displayName = 'ChipLink'

export default ChipLink
