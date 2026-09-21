import type { MotionProps } from 'framer-motion'

/**
 * The shared entrance transition for hero and rail copy.
 *
 * Framer Motion writes `initial` straight into the server-rendered markup — an
 * `initial` of `{ opacity: 0 }` ships as `style="opacity:0"` — and it drives the
 * transition to the `animate` state with requestAnimationFrame. Browsers park
 * requestAnimationFrame in a hidden tab, so whenever no frame runs the element stays
 * at its initial value: present in the DOM and the accessibility tree, and invisible.
 *
 * That bites on background-tab opens, on headless capture such as the OG image
 * script, and on any visit where the bundle is slow or never arrives (issue #46).
 *
 * So the entrance moves and never fades. Content that never gets a frame is then
 * merely offset by a few pixels, which nobody notices, rather than hidden. Stripping
 * opacity here instead of at each call site means a new caller cannot reintroduce it.
 */
export function entranceMotionProps(
  initial: MotionProps['initial'],
  animate: MotionProps['animate'],
  transition: MotionProps['transition'],
  prefersReducedMotion: boolean | null = false
): MotionProps {
  if (prefersReducedMotion) {
    return { initial: false, animate, transition: { duration: 0 } }
  }
  return { initial: withoutOpacity(initial), animate, transition }
}

function withoutOpacity(initial: MotionProps['initial']): MotionProps['initial'] {
  const isPlainTarget = Boolean(initial) && typeof initial === 'object' && !Array.isArray(initial)
  if (!isPlainTarget) return initial

  const target = initial as Record<string, unknown>
  if (!('opacity' in target)) return initial

  const rest = { ...target }
  delete rest.opacity
  return rest as MotionProps['initial']
}
