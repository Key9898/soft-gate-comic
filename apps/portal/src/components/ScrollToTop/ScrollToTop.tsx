import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../Button'

const DEFAULT_THRESHOLD = 300

export interface ScrollToTopProps {
  threshold?: number
}

const ScrollToTop = ({ threshold = DEFAULT_THRESHOLD }: ScrollToTopProps) => {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > threshold)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  if (!visible) return null

  const handleClick = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return (
    <Button
      iconOnly
      onClick={handleClick}
      aria-label={t('a11y.scrollToTop')}
      // A circular FAB: the colour, focus ring and touch floor come from Button; the
      // shape and fixed placement are this component's own.
      className="shape-circle fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-6 z-40 shadow-md ring-1 ring-black/5"
    >
      <ChevronUp className="h-5 w-5" aria-hidden />
    </Button>
  )
}

export default ScrollToTop
