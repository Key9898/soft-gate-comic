import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { buttonClasses, type ButtonSize, type ButtonVariant } from './buttonClasses'

interface SharedProps {
  variant?: ButtonVariant
  size?: ButtonSize
  iconOnly?: boolean
  className?: string
  children?: React.ReactNode
}

export interface ButtonLinkProps
  extends SharedProps, Omit<LinkProps, 'className' | 'children' | 'to'> {
  to: LinkProps['to']
}

export interface ButtonAnchorProps
  extends SharedProps, Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children'> {
  href: string
}

/**
 * A link that looks and measures like a Button. Links were the reason CTA class
 * strings kept getting hand-rolled: `Button` only rendered a `<button>`, so every
 * navigating CTA re-derived the same classes and drifted.
 */
const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  ({ variant = 'primary', size = 'md', iconOnly = false, className = '', ...props }, ref) => (
    <Link ref={ref} className={buttonClasses({ variant, size, iconOnly, className })} {...props} />
  )
)

ButtonLink.displayName = 'ButtonLink'

/** Same treatment for a plain `<a>`: external links, `mailto:`, downloads, hashes. */
export const ButtonAnchor = forwardRef<HTMLAnchorElement, ButtonAnchorProps>(
  ({ variant = 'primary', size = 'md', iconOnly = false, className = '', ...props }, ref) => (
    <a ref={ref} className={buttonClasses({ variant, size, iconOnly, className })} {...props} />
  )
)

ButtonAnchor.displayName = 'ButtonAnchor'

export default ButtonLink
