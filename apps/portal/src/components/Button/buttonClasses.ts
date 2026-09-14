export type ButtonVariant =
  'primary' | 'secondary' | 'surface' | 'outline' | 'ghost' | 'danger' | 'heroOutline' | 'accent'

export type ButtonSize = 'sm' | 'md' | 'lg'

const BASE =
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500 active:bg-primary-800',
  secondary:
    'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500 active:bg-gray-300',
  // A bordered white control. It reads as secondary on white and grey page backgrounds
  // alike, which is why it had been hand-rolled in a dozen places.
  surface:
    'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:ring-primary-500 active:bg-gray-100',
  outline:
    'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus-visible:ring-primary-500 active:bg-primary-100',
  ghost: 'text-gray-700 hover:bg-gray-100 focus-visible:ring-gray-500 active:bg-gray-200',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500 active:bg-red-800',
  accent:
    'bg-accent-600 text-white hover:bg-accent-700 focus-visible:ring-accent-500 active:bg-accent-700',
  heroOutline:
    'border-2 border-white text-white hover:bg-white/10 focus-visible:ring-white active:bg-white/20',
}

/**
 * Every size clears the 44pt touch floor. Before these minimums existed, `sm`
 * landed near 30px and `md` near 36px, which is why 58 files carried hand-written
 * `min-h-11` patches: the component was unusable for touch as shipped.
 */
const SIZES: Record<ButtonSize, string> = {
  sm: 'min-h-11 px-3 py-1.5 text-sm rounded-2xl gap-1.5',
  md: 'min-h-11 px-4 py-2 text-sm rounded-2xl gap-2',
  lg: 'min-h-12 px-6 py-3 text-base rounded-2xl gap-2',
}

export interface ButtonClassOptions {
  variant?: ButtonVariant
  size?: ButtonSize
  /** Square control sized for a single icon; pairs with an aria-label. */
  iconOnly?: boolean
  className?: string
}

export function buttonClasses({
  variant = 'primary',
  size = 'md',
  iconOnly = false,
  className = '',
}: ButtonClassOptions = {}): string {
  const square = iconOnly ? (size === 'lg' ? 'min-w-12 px-0' : 'min-w-11 px-0') : ''
  return [BASE, VARIANTS[variant], SIZES[size], square, className].filter(Boolean).join(' ')
}
