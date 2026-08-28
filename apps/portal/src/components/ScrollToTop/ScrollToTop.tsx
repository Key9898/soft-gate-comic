import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'

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
    <button
      type="button"
      onClick={handleClick}
      aria-label={t('a11y.scrollToTop')}
      className="bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shape-circle fixed right-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-40 flex min-h-11 min-w-11 items-center justify-center text-white shadow-md ring-1 ring-black/5 transition focus:ring-2 focus:ring-offset-2 focus:outline-none"
    >
      <ChevronUp className="h-5 w-5" aria-hidden />
    </button>
  )
}

export default ScrollToTop
