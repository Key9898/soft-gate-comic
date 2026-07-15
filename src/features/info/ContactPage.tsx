import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'
import Button from '../../components/Button'

// ═══════════════ LOCAL FLOATING INPUT COMPONENT ═══════════════
interface FloatingInputProps {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

const ContactFloatingInput = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
}: FloatingInputProps) => {
  const [isFocused, setIsFocused] = useState(false)
  const hasValue = value.length > 0

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
              ? 'border-primary-500 ring-primary-500/20 bg-white ring-2 dark:bg-gray-900'
              : 'border-gray-200 bg-gray-50/50 dark:border-white/5 dark:bg-white/5'
        }`}
      >
        <label
          className={`pointer-events-none absolute left-4.5 origin-top-left transition-all duration-200 ${
            isFocused || hasValue
              ? 'text-primary-500 dark:text-primary-400 top-2 text-[10px] font-black'
              : 'top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 dark:text-gray-500'
          }`}
        >
          {label}
        </label>
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent px-4.5 text-sm font-bold text-gray-950 transition-all duration-200 focus:outline-none dark:text-white ${
            isFocused || hasValue ? 'pt-6.5 pb-2' : 'py-4'
          }`}
        />
      </div>
      {error && (
        <p className="mt-1 ml-2 flex items-center gap-1 text-[10px] font-bold text-red-500">
          {error}
        </p>
      )}
    </motion.div>
  )
}

// ═══════════════ MAIN CONTACT PAGE ═══════════════
const ContactPage = () => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!name.trim()) {
      errs.name = 'Name is required'
    } else if (name.trim().length < 3) {
      errs.name = 'Must be at least 3 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      errs.email = 'Email is required'
    } else if (!emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address'
    }

    if (!subject.trim()) {
      errs.subject = 'Subject is required'
    }

    if (!message.trim()) {
      errs.message = 'Message text is required'
    } else if (message.trim().length < 10) {
      errs.message = 'Must be at least 10 characters'
    }

    setErrors(errs)

    if (Object.keys(errs).length === 0) {
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
      }, 2500)
    }
  }

  const contactChannels = [
    {
      icon: Mail,
      title: t('contact.email'),
      value: 'support@webpad.com',
      color: 'bg-white text-emerald-500 border-gray-150/60 dark:bg-gray-900 dark:border-white/5',
      iconColor: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400',
    },
    {
      icon: Phone,
      title: t('contact.phone'),
      value: '+95 9 123 456 789',
      color: 'bg-white text-blue-500 border-gray-150/60 dark:bg-gray-900 dark:border-white/5',
      iconColor: 'bg-blue-50 text-blue-500 dark:bg-blue-950/20 dark:text-blue-400',
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      value: 'Yangon, Myanmar',
      color: 'bg-white text-purple-500 border-gray-150/60 dark:bg-gray-900 dark:border-white/5',
      iconColor: 'bg-purple-50 text-purple-500 dark:bg-purple-950/20 dark:text-purple-400',
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 pb-20 transition-colors duration-300 dark:bg-gray-950">
      {/* Immersive background soft radial glow overlay */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[450px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.06),transparent_65%)] dark:bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.03),transparent_65%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 text-left sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/"
          className="hover:text-primary-600 mb-8 inline-flex items-center gap-2 text-xs font-black tracking-wider text-gray-500 uppercase transition-colors dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>

        {/* ═══════════════ SECTION 1: HERO HEADER ═══════════════ */}
        <header className="pt-8 pb-8 sm:pt-12 sm:pb-12">
          <span className="text-primary-500 dark:text-primary-400 text-xs font-black tracking-widest uppercase">
            Contact Support
          </span>
          <h1 className="mt-2.5 text-3xl font-black tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            {t('static.contactTitle')}
          </h1>
        </header>

        {/* ═══════════════ SECTION 2: ASYMMETRICAL SPLIT GRID ═══════════════ */}
        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN: STANDALONE CONTACT DETAILS CARDS (SPAN 5) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-wider text-gray-900 uppercase dark:text-white">
                <span className="bg-primary-500 h-2.5 w-2.5 rounded-full" />
                {t('contact.getInTouch')}
              </h2>
              <p className="pr-2 text-sm leading-relaxed font-semibold text-gray-500 dark:text-gray-400">
                {t('contact.getInTouchDesc')}
              </p>
            </div>

            {/* Standalone floating detail card feed */}
            <div className="space-y-4 pt-2">
              {contactChannels.map((ch) => (
                <motion.div
                  key={ch.title}
                  whileHover={{ scale: 1.02, y: -3 }}
                  className={`flex items-center gap-4.5 rounded-3xl border bg-white p-5 shadow-md transition-all duration-300 hover:shadow-xl ${ch.color}`}
                >
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${ch.iconColor} shadow-sm`}
                  >
                    <ch.icon className="h-5.5 w-5.5 stroke-[2.2]" />
                  </div>
                  <div>
                    <p className="text-2xs dark:text-gray-505 font-black tracking-widest text-gray-400 uppercase">
                      {ch.title}
                    </p>
                    <p className="mt-1 text-sm font-black text-gray-900 dark:text-white">
                      {ch.value}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: HIGH-CONTRAST MESSAGE FORM CARD (SPAN 7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-gray-200/60 bg-white p-6 shadow-xl sm:p-8 dark:border-white/5 dark:bg-gray-900">
              <div className="mb-6">
                <h2 className="flex items-center gap-2 text-lg font-black tracking-wider text-gray-900 uppercase dark:text-white">
                  <span className="bg-primary-500 h-2 w-2 rounded-full" />
                  {t('contact.sendMessage')}
                </h2>
                <p className="text-2xs mt-1 font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
                  Fill fields to dispatch an official ticket
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center rounded-2xl border-2 border-dashed border-emerald-100 bg-emerald-500/5 py-12 text-center dark:border-emerald-950/30"
                  >
                    <CheckCircle2 className="mb-4 h-14 w-14 stroke-[2.5] text-emerald-500" />
                    <h4 className="text-sm font-black text-gray-900 dark:text-white">
                      Message Dispatched!
                    </h4>
                    <p className="mt-2 pr-6 pl-6 text-xs leading-relaxed font-bold text-gray-500 dark:text-gray-400">
                      We have received your ticket and will write back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <ContactFloatingInput
                      label={t('contact.name')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={errors.name}
                    />

                    <ContactFloatingInput
                      label={t('auth.email')}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={errors.email}
                    />

                    <ContactFloatingInput
                      label={t('contact.subject')}
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      error={errors.subject}
                    />

                    {/* Message textarea field with error shake */}
                    <motion.div
                      animate={{ x: errors.message ? [-10, 10, -10, 10, 0] : 0 }}
                      className="space-y-2 text-left"
                    >
                      <label className="dark:text-gray-505 pl-1 text-xs font-black tracking-wider text-gray-400 uppercase">
                        {t('contact.message')}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder={t('contact.messagePlaceholder')}
                        className={`w-full resize-none rounded-2xl border-2 px-4.5 py-3.5 text-sm font-bold transition focus:outline-none dark:bg-gray-800 dark:text-white ${
                          errors.message
                            ? 'border-red-500 bg-red-500/5'
                            : 'focus:border-primary-500 focus:ring-primary-500 border-gray-200 focus:ring-1 dark:border-white/5'
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1 ml-2 text-[10px] font-bold text-red-500">
                          {errors.message}
                        </p>
                      )}
                    </motion.div>

                    <Button
                      type="submit"
                      className="mt-2 min-h-[44px] w-full rounded-2xl text-xs font-black tracking-wider uppercase"
                    >
                      <Send className="h-4 w-4 stroke-[2.2]" />
                      {t('contact.send')}
                    </Button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage
