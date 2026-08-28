import { useId, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// ═══════════════ FLOATING LABEL INPUT COMPONENT ═══════════════
interface FloatingInputProps {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const FloatingInput = ({
  label,
  type = 'text',
  value,
  onChange,
  disabled,
  error,
  leftIcon,
  rightIcon,
}: FloatingInputProps) => {
  const { t } = useTranslation()
  const inputId = useId()
  const errorId = useId()
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0
  const isPassword = type === 'password'
  const [showPassword, setShowPassword] = useState(false)

  return (
    <motion.div
      animate={{ x: error ? [-10, 10, -10, 10, 0] : 0 }}
      transition={{ duration: 0.4 }}
      className="w-full text-left"
    >
      <div
        className={`relative rounded-2xl border-2 transition-all duration-300 ${
          error
            ? 'border-red-500 bg-red-500/5'
            : isFocused
              ? 'border-primary-500 ring-primary-500/20 bg-white ring-2'
              : 'border-gray-200 bg-gray-50/50'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {leftIcon && (
          <div className="absolute top-1/2 left-4.5 -translate-y-1/2 text-gray-400">{leftIcon}</div>
        )}

        <label
          htmlFor={inputId}
          className={`pointer-events-none absolute left-4.5 origin-top-left transition-all duration-200 ${
            leftIcon ? 'left-11' : ''
          } ${
            isFocused || hasValue
              ? 'text-primary-500 text-2xs top-2 font-semibold'
              : 'top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400'
          }`}
        >
          {label}
        </label>

        <input
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent px-4.5 text-sm font-bold text-gray-950 transition-all duration-200 focus:outline-none ${
            leftIcon ? 'pl-11' : ''
          } ${isFocused || hasValue ? 'pt-6.5 pb-2' : 'py-4'}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            className="absolute top-1/2 right-4.5 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}

        {rightIcon && !isPassword && (
          <div className="absolute top-1/2 right-4.5 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            id={errorId}
            role="alert"
            className="mt-1.5 ml-2 flex items-center gap-1 text-xs font-bold text-red-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3.5 w-3.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default FloatingInput
