import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Briefcase, Heart, CheckCircle2, X } from 'lucide-react'
import Button from '../../components/Button'

// ═══════════════ LOCAL FLOATING INPUT COMPONENT ═══════════════
interface FloatingInputProps {
  label: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
}

const CareersFloatingInput = ({
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

// ═══════════════ MAIN CAREERS PAGE ═══════════════
const CareersPage = () => {
  const { t } = useTranslation()
  const [activeDept, setActiveDept] = useState<string>('All')

  // Job Application Drawer state
  const [applyingJob, setApplyingJob] = useState<{ title: string; department: string } | null>(null)
  const [applicantName, setApplicantName] = useState('')
  const [applicantEmail, setApplicantEmail] = useState('')
  const [applicantResume, setApplicantResume] = useState('')
  const [applicantCover, setApplicantCover] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSuccess, setIsSuccess] = useState(false)

  const jobs = [
    {
      title: 'Senior Frontend Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Backend Developer',
      department: 'Engineering',
      location: 'Yangon, Myanmar',
      type: 'Full-time',
    },
    {
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Remote',
      type: 'Full-time',
    },
    {
      title: 'Content Moderator',
      department: 'Operations',
      location: 'Yangon, Myanmar',
      type: 'Part-time',
    },
  ]

  const benefits = [
    { icon: Heart, title: t('careers.health'), desc: t('careers.healthDesc') },
    { icon: Clock, title: t('careers.flexible'), desc: t('careers.flexibleDesc') },
    { icon: Briefcase, title: t('careers.growth'), desc: t('careers.growthDesc') },
  ]

  const departments = ['All', 'Engineering', 'Design', 'Operations']

  // Filter listings
  const filteredJobs = jobs.filter((job) => activeDept === 'All' || job.department === activeDept)

  // Submit and validates application
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!applicantName.trim()) {
      errs.name = 'Full name is required'
    } else if (applicantName.trim().length < 3) {
      errs.name = 'Must be at least 3 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!applicantEmail.trim()) {
      errs.email = 'Email address is required'
    } else if (!emailRegex.test(applicantEmail)) {
      errs.email = 'Please enter a valid email address'
    }

    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
    if (!applicantResume.trim()) {
      errs.resume = 'Resume link is required'
    } else if (!urlRegex.test(applicantResume)) {
      errs.resume = 'Please enter a valid URL (e.g. Google Drive/Dropbox)'
    }

    if (!applicantCover.trim()) {
      errs.cover = 'Cover letter is required'
    } else if (applicantCover.trim().length < 15) {
      errs.cover = 'Must be at least 15 characters'
    }

    setErrors(errs)

    if (Object.keys(errs).length === 0) {
      setIsSuccess(true)
      // reset forms
      setTimeout(() => {
        setApplyingJob(null)
        setIsSuccess(false)
        setApplicantName('')
        setApplicantEmail('')
        setApplicantResume('')
        setApplicantCover('')
      }, 2000)
    }
  }

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
        <header className="pt-8 pb-12 sm:pt-12 sm:pb-16">
          <span className="text-primary-500 dark:text-primary-400 text-xs font-black tracking-widest uppercase">
            Work With Soft-Gate Comic
          </span>
          <h1 className="mt-2.5 text-3xl font-black tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            {t('static.careersTitle')}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed font-semibold text-gray-600 dark:text-gray-400">
            {t('careers.intro')}
          </p>
        </header>

        {/* ═══════════════ SECTION 2: DEPARTMENT FILTERS ═══════════════ */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-2.5">
            {departments.map((dept) => {
              const isActive = activeDept === dept
              const deptCount =
                dept === 'All' ? jobs.length : jobs.filter((j) => j.department === dept).length
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setActiveDept(dept)}
                  className={`relative flex min-h-[38px] items-center justify-center rounded-full px-4.5 py-2.5 text-xs font-black tracking-wider uppercase transition-all ${
                    isActive
                      ? 'text-white shadow-md'
                      : 'border border-gray-200/60 bg-white text-gray-700 hover:bg-gray-100 dark:border-white/5 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-white/10'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {dept}
                    <span
                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-400'
                      }`}
                    >
                      {deptCount}
                    </span>
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeCareersDept"
                      className="bg-primary-600 dark:bg-primary-500 absolute inset-0 rounded-full"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* ═══════════════ SECTION 3: OPEN POSITIONS FEED (STANDALONE CARDS) ═══════════════ */}
        <section className="border-t border-gray-200/60 py-16 dark:border-white/5">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-wider text-gray-900 uppercase dark:text-white">
              <span className="bg-primary-500 h-2.5 w-2.5 rounded-full" />
              {t('careers.openPositions')}
            </h2>
            <p className="text-2xs mt-1 font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Browse openings by department category
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {filteredJobs.map((job) => (
              <motion.div
                key={job.title}
                whileHover={{ scale: 1.015, y: -4 }}
                className="rounded-3xl border border-gray-200/60 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-xl dark:border-white/5 dark:bg-gray-900"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-base font-black text-gray-900 sm:text-lg dark:text-white">
                      {job.title}
                    </h3>
                    <div className="text-2xs mt-3 flex flex-wrap items-center gap-3.5 font-black tracking-widest text-gray-400 uppercase dark:text-gray-500">
                      <span className="bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 rounded-xl px-3 py-1">
                        {job.department}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 font-bold">
                        <MapPin className="text-primary-500 h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5 font-bold">
                        <Clock className="text-primary-500 h-3.5 w-3.5" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setApplyingJob(job)}
                    className="min-h-[40px] rounded-2xl px-5 text-xs font-black tracking-wider uppercase dark:border-white/10 dark:text-white"
                  >
                    {t('careers.apply')}
                  </Button>
                </div>
              </motion.div>
            ))}

            {filteredJobs.length === 0 && (
              <div className="rounded-3xl border-2 border-dashed border-gray-200/60 bg-white/50 py-12 text-center dark:border-white/5 dark:bg-white/2">
                <p className="text-sm font-bold text-gray-400 dark:text-gray-500">
                  No positions listed under this category currently.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════ SECTION 4: BENEFITS GRID ═══════════════ */}
        <section className="border-t border-gray-200/60 py-16 dark:border-white/5">
          <div className="mb-6">
            <h2 className="flex items-center gap-2 text-xl font-black tracking-wider text-gray-900 uppercase dark:text-white">
              <span className="bg-primary-500 h-2.5 w-2.5 rounded-full" />
              {t('careers.benefits')}
            </h2>
            <p className="text-2xs mt-1 font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              Perks and policies built for our team
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <motion.div
                key={benefit.title}
                whileHover={{ y: -3 }}
                className="rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900"
              >
                <div className="bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400 mb-4 flex h-11 w-11 items-center justify-center rounded-2xl shadow-sm">
                  <benefit.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="text-sm font-black text-gray-900 dark:text-white">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed font-semibold text-gray-500 dark:text-gray-400">
                  {benefit.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════ SECTION 5: CULTURE BLOCK ═══════════════ */}
        <section className="border-t border-gray-200/60 py-16 dark:border-white/5">
          <h2 className="flex items-center gap-2 text-xl font-black tracking-wider text-gray-900 uppercase dark:text-white">
            <span className="bg-primary-500 h-2.5 w-2.5 rounded-full" />
            {t('careers.culture')}
          </h2>
          <p className="mt-4 max-w-3xl pl-1 text-sm leading-relaxed font-semibold text-gray-500 dark:text-gray-400">
            {t('careers.cultureDesc')}
          </p>
        </section>
      </div>

      {/* ═══════════════ INTERACTIVE DRAWER OVERLAY ═══════════════ */}
      <AnimatePresence>
        {applyingJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/60 p-4 backdrop-blur-md">
            {/* Click backdrop listener to cancel */}
            <div className="absolute inset-0" onClick={() => setApplyingJob(null)} />

            {/* Application container card floating centered */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gray-200/60 bg-white p-6 text-left shadow-2xl dark:border-white/5 dark:bg-gray-900"
            >
              {/* Close Button trigger */}
              <button
                type="button"
                onClick={() => setApplyingJob(null)}
                className="absolute top-4 right-4 p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-white"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-6 pr-6">
                <span className="text-primary-500 dark:text-primary-400 text-[10px] font-black tracking-wider uppercase">
                  Join Myanmar Soft-Gate Comic team
                </span>
                <h3 className="mt-0.5 text-lg leading-tight font-black text-gray-900 dark:text-white">
                  Apply for {applyingJob.title}
                </h3>
                <p className="text-2xs mt-1 font-bold tracking-wider text-gray-400 uppercase">
                  {applyingJob.department} Department
                </p>
              </div>

              {/* Submit application state feedback */}
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-12 text-center"
                >
                  <CheckCircle2 className="mb-4 h-14 w-14 stroke-[2.5] text-emerald-500" />
                  <h4 className="text-sm font-black text-gray-900 dark:text-white">
                    Application Sent!
                  </h4>
                  <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                    Thank you. We will review your portfolio details shortly.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  <CareersFloatingInput
                    label="Full Name"
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    error={errors.name}
                  />

                  <CareersFloatingInput
                    label="Email Address"
                    type="email"
                    value={applicantEmail}
                    onChange={(e) => setApplicantEmail(e.target.value)}
                    error={errors.email}
                  />

                  <CareersFloatingInput
                    label="Resume or Portfolio Link"
                    value={applicantResume}
                    onChange={(e) => setApplicantResume(e.target.value)}
                    error={errors.resume}
                  />

                  {/* Cover letter field */}
                  <motion.div
                    animate={{ x: errors.cover ? [-10, 10, -10, 10, 0] : 0 }}
                    className="space-y-2 text-left"
                  >
                    <label className="pl-1 text-xs font-black tracking-wider text-gray-400 uppercase dark:text-gray-500">
                      Short Cover Letter
                    </label>
                    <textarea
                      value={applicantCover}
                      onChange={(e) => setApplicantCover(e.target.value)}
                      rows={4}
                      placeholder="Introduce yourself and tell us why you want to join Soft-Gate Comic..."
                      className={`w-full resize-none rounded-2xl border-2 px-4.5 py-3 text-sm font-bold transition focus:outline-none dark:bg-gray-800 dark:text-white ${
                        errors.cover
                          ? 'border-red-500 bg-red-500/5'
                          : 'focus:border-primary-500 focus:ring-primary-500 border-gray-200 focus:ring-1 dark:border-white/5'
                      }`}
                    />
                    {errors.cover && (
                      <p className="mt-1 ml-2 text-[10px] font-bold text-red-500">{errors.cover}</p>
                    )}
                  </motion.div>

                  <Button
                    type="submit"
                    className="mt-2 min-h-[44px] w-full rounded-2xl text-xs font-black tracking-wider uppercase"
                  >
                    Submit Application
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CareersPage
