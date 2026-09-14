import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { chipClasses, type ChipTone } from './chipClasses'

export interface ChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  selected: boolean
  tone?: ChipTone
  /**
   * `toggle` reports state with `aria-pressed`; `radio` with `aria-checked` and
   * `role="radio"`, for chips that live inside a `role="radiogroup"` where exactly
   * one is chosen.
   */
  semantics?: 'toggle' | 'radio'
}

/**
 * The selectable filter chip used by Categories, Search, Library and Home.
 *
 * Every copy of this control looked the same and behaved differently: Categories
 * chips were `min-h-11` and carried `aria-pressed`, the visually identical Search
 * chips were `min-h-[38px]` with no state exposed at all — so a screen-reader user
 * could not tell which filter was active, and a thumb had a 38px target.
 */
const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ selected, tone = 'filter', semantics = 'toggle', className = '', ...props }, ref) => {
    const aria =
      semantics === 'radio'
        ? ({ role: 'radio', 'aria-checked': selected } as const)
        : ({ 'aria-pressed': selected } as const)

    return (
      <button
        ref={ref}
        type="button"
        {...aria}
        className={chipClasses(selected, tone, className)}
        {...props}
      />
    )
  }
)

Chip.displayName = 'Chip'

export default Chip
