import { useEffect, useId, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import Button from '../../../components/Button'
import useScrollLock from '../../../hooks/useScrollLock'
import useFocusTrap from '../../../hooks/useFocusTrap'

export interface LibraryDeleteConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  cancelLabel: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
}

const LibraryDeleteConfirmDialog = ({
  isOpen,
  title,
  message,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
}: LibraryDeleteConfirmDialogProps) => {
  const panelRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useScrollLock(isOpen)
  useFocusTrap(panelRef, isOpen, cancelRef)

  useEffect(() => {
    if (!isOpen) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onCancel])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 id={titleId} className="text-lg font-bold text-gray-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed font-medium text-gray-500">{message}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-gray-50 pt-4">
              <Button ref={cancelRef} variant="ghost" onClick={onCancel} className="px-4 py-2">
                {cancelLabel}
              </Button>
              <Button
                variant="danger"
                onClick={onConfirm}
                className="px-5 py-2 font-bold shadow-lg shadow-red-500/15"
              >
                {confirmLabel}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default LibraryDeleteConfirmDialog
