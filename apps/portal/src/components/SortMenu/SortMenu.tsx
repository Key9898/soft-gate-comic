import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, ListFilter } from 'lucide-react'

export interface SortMenuOption<T extends string> {
  value: T
  label: string
}

export interface SortMenuProps<T extends string> {
  options: readonly SortMenuOption<T>[]
  value: T
  onChange: (value: T) => void
  /** Names the menu for assistive tech. The trigger keeps its visible text as its
   *  accessible name, so an aria-label here must not be put on the button. */
  label: string
  className?: string
}

/**
 * One sort menu for Categories and Search. The two pages shipped visually identical
 * menus with different behaviour: Categories had `aria-haspopup`, `aria-expanded`,
 * `aria-controls`, Escape-to-close with focus restore and an outside-click catcher;
 * Search had none of them. Neither supported arrow-key roving, which a `role="menu"`
 * promises to a screen-reader user.
 */
function SortMenu<T extends string>({
  options,
  value,
  onChange,
  label,
  className = '',
}: SortMenuProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])
  const menuId = useId()

  const activeLabel = options.find((option) => option.value === value)?.label ?? label

  const close = (restoreFocus = true) => {
    setIsOpen(false)
    if (restoreFocus) buttonRef.current?.focus()
  }

  useEffect(() => {
    if (!isOpen) return
    const index = Math.max(
      0,
      options.findIndex((option) => option.value === value)
    )
    setActiveIndex(index)
    // Focus lands on the current selection, not the top of the list: a roving menu
    // that always starts at index 0 makes the user re-find where they were.
    const frame = requestAnimationFrame(() => itemRefs.current[index]?.focus())
    return () => cancelAnimationFrame(frame)
  }, [isOpen, options, value])

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen])

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') return
    e.preventDefault()
    const last = options.length - 1
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? last
          : e.key === 'ArrowDown'
            ? (activeIndex + 1) % options.length
            : (activeIndex - 1 + options.length) % options.length
    setActiveIndex(next)
    itemRefs.current[next]?.focus()
  }

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        className="px-4.5 focus-visible:ring-primary-500 flex min-h-11 items-center gap-2 rounded-2xl border border-gray-200 bg-white py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-800 shadow-sm transition-all hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2"
      >
        <ListFilter className="text-primary-500 h-4.5 w-4.5" aria-hidden="true" />
        <span>{activeLabel}</span>
        <ChevronDown
          className={`text-muted h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent"
          aria-hidden="true"
          onClick={() => close()}
        />
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            role="menu"
            aria-label={label}
            onKeyDown={onMenuKeyDown}
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-2xl border border-gray-100 bg-white p-2 shadow-xl"
          >
            <div className="space-y-1">
              {options.map((option, index) => {
                const isSelected = option.value === value
                return (
                  <button
                    key={option.value}
                    ref={(node) => {
                      itemRefs.current[index] = node
                    }}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isSelected}
                    tabIndex={index === activeIndex ? 0 : -1}
                    onClick={() => {
                      onChange(option.value)
                      close()
                    }}
                    className={`focus-visible:ring-primary-500 flex min-h-11 w-full items-center justify-between rounded-2xl px-3.5 py-3 text-left text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 ${
                      isSelected
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span>{option.label}</span>
                    {isSelected && (
                      <Check className="text-primary-600 h-4 w-4 stroke-[3]" aria-hidden="true" />
                    )}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SortMenu
