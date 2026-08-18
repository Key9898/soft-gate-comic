import { useEffect, useId, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useScrollLock from '../../hooks/useScrollLock'
import useFocusTrap from '../../hooks/useFocusTrap'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) => {
  const { t } = useTranslation()
  const modalRef = useRef<HTMLDivElement>(null)
  const titleId = useId()

  useScrollLock(isOpen)
  useFocusTrap(modalRef, isOpen)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, closeOnEscape])

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-4xl',
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeOnOverlayClick ? onClose : undefined}
          />
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className={`relative w-full ${sizes[size]} overflow-hidden rounded-3xl bg-white shadow-xl`}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                {title && (
                  <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    type="button"
                    title={t('common.close')}
                    aria-label={t('common.close')}
                    onClick={onClose}
                    className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                )}
              </div>
            )}
            <div className="max-h-[calc(85dvh-4rem)] overflow-y-auto overscroll-contain p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default Modal
