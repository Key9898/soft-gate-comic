import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useScrollLock from '../../../hooks/useScrollLock'
import useFocusTrap from '../../../hooks/useFocusTrap'

interface ReaderSheetProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

const ReaderSheet = ({ isOpen, onClose, title, children }: ReaderSheetProps) => {
  const { t } = useTranslation()
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const [desktopDrawer, setDesktopDrawer] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 768px)').matches
  )

  useScrollLock(isOpen)
  useFocusTrap(panelRef, isOpen)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const sync = () => setDesktopDrawer(media.matches)
    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={desktopDrawer ? { x: '100%' } : { y: '100%' }}
            animate={desktopDrawer ? { x: 0 } : { y: 0 }}
            exit={desktopDrawer ? { x: '100%' } : { y: '100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="bg-canvas text-ink absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-3xl shadow-xl md:inset-y-0 md:left-auto md:right-0 md:max-h-none md:w-full md:max-w-lg md:rounded-none md:rounded-l-3xl"
          >
            <div className="border-edge flex items-center justify-between border-b px-4 py-3">
              <h2 id={titleId} className="text-lg font-semibold">
                {title}
              </h2>
              <button
                type="button"
                title={t('common.close')}
                aria-label={t('common.close')}
                onClick={onClose}
                className="text-ink-muted hover:bg-raised flex min-h-11 min-w-11 items-center justify-center rounded-2xl"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}

export default ReaderSheet
