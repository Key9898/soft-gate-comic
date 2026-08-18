import { useId, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, MapPin, Send, CheckCircle2 } from 'lucide-react'
import Button from '../../components/Button'
import SEO from '../../components/SEO/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import { getInfoPageMeta } from '../../lib/info/pageMeta'

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
  const inputId = useId()
  const errorId = useId()
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
              ? 'border-primary-500 ring-primary-500/20 bg-white ring-2'
              : 'border-gray-200 bg-gray-50/50'
        }`}
      >
        <label
          htmlFor={inputId}
          className={`pointer-events-none absolute left-4.5 origin-top-left transition-all duration-200 ${
            isFocused || hasValue
              ? 'text-primary-500 text-2xs top-2 font-semibold'
              : 'top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400'
          }`}
        >
          {label}
        </label>
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent px-4.5 text-sm font-bold text-gray-950 transition-all duration-200 focus:outline-none ${
            isFocused || hasValue ? 'pt-6.5 pb-2' : 'py-4'
          }`}
        />
      </div>
      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-2xs mt-1 ml-2 flex items-center gap-1 font-bold text-red-500"
        >
          {error}
        </p>
      )}
    </motion.div>
  )
}

// ═══════════════ MAIN CONTACT PAGE ═══════════════
const ContactPage = () => {
  const { t } = useTranslation()
  const page = getInfoPageMeta('contact', t)
  const messageId = useId()
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
      errs.name = t('contact.errors.nameRequired')
    } else if (name.trim().length < 3) {
      errs.name = t('contact.errors.nameMin')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      errs.email = t('contact.errors.emailRequired')
    } else if (!emailRegex.test(email)) {
      errs.email = t('contact.errors.emailInvalid')
    }

    if (!subject.trim()) {
      errs.subject = t('contact.errors.subjectRequired')
    }

    if (!message.trim()) {
      errs.message = t('contact.errors.messageRequired')
    } else if (message.trim().length < 10) {
      errs.message = t('contact.errors.messageMin')
    }

    setErrors(errs)

    if (Object.keys(errs).length === 0) {
      const body = encodeURIComponent(`From: ${name.trim()} <${email.trim()}>\n\n${message.trim()}`)
      const mailto = `mailto:support@softgatecomic.com?subject=${encodeURIComponent(subject.trim())}&body=${body}`
      window.location.href = mailto
      setIsSuccess(true)
      setTimeout(() => {
        setIsSuccess(false)
      }, 2500)
    }
  }

  const contactChannels = [
    {
      icon: Mail,
      title: t('contact.email'),
      value: 'support@softgatecomic.com',
      href: 'mailto:support@softgatecomic.com',
      color: 'bg-white text-emerald-500 border-gray-200/60',
      iconColor: 'bg-emerald-50 text-emerald-500',
    },
    {
      icon: MapPin,
      title: t('contact.address'),
      value: 'Yangon, Myanmar',
      color: 'bg-white text-accent-600 border-gray-200/60',
      iconColor: 'bg-accent-500/10 text-accent-600',
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 pb-20 transition-colors duration-300">
      <SEO
        title={t('footer.contact')}
        description={t('contact.getInTouchDesc')}
        url="https://softgatecomic.com/contact"
      />
      {/* Immersive background soft radial glow overlay */}
      <div className="radial-wash-primary pointer-events-none absolute top-0 left-1/2 h-[450px] w-full max-w-7xl -translate-x-1/2" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader variant="compact" eyebrow={page.eyebrow} title={page.title} deck={page.deck} />

        {/* ═══════════════ SECTION 2: ASYMMETRICAL SPLIT GRID ═══════════════ */}
        <div className="mt-8 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* LEFT COLUMN: STANDALONE CONTACT DETAILS CARDS (SPAN 5) */}
          <div className="space-y-6 lg:col-span-5">
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-xl font-bold tracking-wider text-gray-900 uppercase">
                <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
                {t('contact.getInTouch')}
              </h2>
              <p className="pr-2 text-sm leading-relaxed font-semibold text-gray-500">
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
                    <p className="text-2xs font-bold tracking-widest text-gray-400 uppercase">
                      {ch.title}
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-900">{ch.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: HIGH-CONTRAST MESSAGE FORM CARD (SPAN 7) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-gray-200/60 bg-white p-6 shadow-xl sm:p-8">
              <div className="mb-6">
                <h2 className="flex items-center gap-2 text-lg font-bold tracking-wider text-gray-900 uppercase">
                  <span className="bg-primary-500 shape-circle h-2 w-2" />
                  {t('contact.sendMessage')}
                </h2>
                <p className="text-2xs mt-1 font-bold tracking-wider text-gray-400 uppercase">
                  {t('contact.formHint')}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center rounded-2xl border-2 border-dashed border-emerald-100 bg-emerald-500/5 py-12 text-center"
                  >
                    <CheckCircle2 className="mb-4 h-14 w-14 stroke-[2.5] text-emerald-500" />
                    <h4 className="text-sm font-bold text-gray-900">{t('contact.successTitle')}</h4>
                    <p className="mt-2 pr-6 pl-6 text-xs leading-relaxed font-bold text-gray-500">
                      {t('contact.successDesc')}
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
                      <label
                        htmlFor={messageId}
                        className="pl-1 text-xs font-bold tracking-wider text-gray-400 uppercase"
                      >
                        {t('contact.message')}
                      </label>
                      <textarea
                        id={messageId}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        placeholder={t('contact.messagePlaceholder')}
                        aria-invalid={errors.message ? true : undefined}
                        className={`w-full resize-none rounded-2xl border-2 px-4.5 py-3.5 text-sm font-bold transition focus:outline-none ${
                          errors.message
                            ? 'border-red-500 bg-red-500/5'
                            : 'focus:border-primary-500 focus:ring-primary-500 border-gray-200 focus:ring-1'
                        }`}
                      />
                      {errors.message && (
                        <p role="alert" className="text-2xs mt-1 ml-2 font-bold text-red-500">
                          {errors.message}
                        </p>
                      )}
                    </motion.div>

                    <Button
                      type="submit"
                      className="mt-2 min-h-[44px] w-full rounded-2xl text-xs font-bold tracking-wider uppercase"
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
