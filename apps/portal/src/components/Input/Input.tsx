import { forwardRef, useId, useState, type InputHTMLAttributes, type ReactNode } from 'react'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

/**
 * `stacked` puts the label above the field; `floating` lifts it into the border on
 * focus. Two presentations of one control — the portal previously shipped them as
 * two unrelated components (`Input` and profile's `FloatingInput`) that had drifted
 * apart on ids, ARIA and icon set.
 */
export type InputVariant = 'stacked' | 'floating'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string
  variant?: InputVariant
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = '',
      label,
      variant = 'stacked',
      error,
      hint,
      leftIcon,
      rightIcon,
      type = 'text',
      id,
      value,
      disabled,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const { t } = useTranslation()
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)
    const autoId = useId()
    const messageId = useId()
    // Never derive the id from the label: two fields both labelled "Password" then
    // share an id, and every `htmlFor` points at whichever rendered first.
    const inputId = id ?? autoId
    const isPassword = type === 'password'
    const describedBy = error || hint ? messageId : undefined

    const passwordToggle = isPassword ? (
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
        className="text-muted focus-visible:ring-primary-500 absolute right-1.5 top-1/2 flex min-h-11 min-w-11 -translate-y-1/2 items-center justify-center rounded-2xl transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2"
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" aria-hidden="true" />
        ) : (
          <Eye className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    ) : null

    const sharedInputProps = {
      ref,
      id: inputId,
      type: isPassword && showPassword ? 'text' : type,
      value,
      disabled,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy,
      onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true)
        onFocus?.(e)
      },
      onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false)
        onBlur?.(e)
      },
      ...props,
    }

    const message = (
      <>
        {error ? (
          <p
            id={messageId}
            role="alert"
            className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500"
          >
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            {error}
          </p>
        ) : null}
        {hint && !error ? (
          <p id={messageId} className="text-muted mt-1.5 text-sm">
            {hint}
          </p>
        ) : null}
      </>
    )

    if (variant === 'floating') {
      const lifted = isFocused || String(value ?? '').length > 0
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
            {leftIcon ? (
              <div className="left-4.5 text-muted absolute top-1/2 -translate-y-1/2">
                {leftIcon}
              </div>
            ) : null}

            {label ? (
              <label
                htmlFor={inputId}
                className={`left-4.5 pointer-events-none absolute origin-top-left transition-all duration-200 ${
                  leftIcon ? 'left-11' : ''
                } ${
                  lifted
                    ? 'text-primary-500 text-2xs top-2 font-semibold'
                    : 'text-muted top-1/2 -translate-y-1/2 text-sm font-semibold'
                }`}
              >
                {label}
              </label>
            ) : null}

            <input
              {...sharedInputProps}
              className={`px-4.5 min-h-11 w-full bg-transparent text-sm font-semibold text-gray-950 transition-all duration-200 focus:outline-none ${
                leftIcon ? 'pl-11' : ''
              } ${lifted ? 'pt-6.5 pb-2' : 'py-4'} ${className}`}
            />

            {passwordToggle}

            {rightIcon && !isPassword ? (
              <div className="right-4.5 text-muted absolute top-1/2 -translate-y-1/2">
                {rightIcon}
              </div>
            ) : null}
          </div>

          <AnimatePresence>
            {error ? (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                id={messageId}
                role="alert"
                className="ml-2 mt-1.5 flex items-center gap-1 text-xs font-semibold text-red-500"
              >
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {error}
              </motion.p>
            ) : null}
          </AnimatePresence>
          {hint && !error ? (
            <p id={messageId} className="text-muted ml-2 mt-1.5 text-xs">
              {hint}
            </p>
          ) : null}
        </motion.div>
      )
    }

    return (
      <div className="w-full">
        {label ? (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700">
            {label}
          </label>
        ) : null}
        <div className="relative">
          {leftIcon ? (
            <div className="text-muted absolute left-3 top-1/2 -translate-y-1/2">{leftIcon}</div>
          ) : null}
          <input
            {...sharedInputProps}
            className={`placeholder:text-muted focus:ring-primary-500/20 min-h-11 w-full rounded-2xl border bg-white px-4 py-2.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'focus:border-primary-500 border-gray-300'
            } ${leftIcon ? 'pl-10' : ''} ${isPassword || rightIcon ? 'pr-12' : ''} ${className}`}
          />
          {passwordToggle}
          {rightIcon && !isPassword ? (
            <div className="text-muted absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>
          ) : null}
        </div>
        {message}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
