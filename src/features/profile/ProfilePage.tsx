import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User as UserIcon,
  Mail,
  Lock,
  Bell,
  Palette,
  Shield,
  LogOut,
  Camera,
  Edit3,
  ChevronRight,
  TrendingUp,
  Award,
  Sparkles,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'

interface UserProfile {
  id: string
  email: string
  username: string
  displayName: string
  avatar?: string
  bio?: string
  coinBalance: number
  stats: {
    webtoonsRead: number
    episodesRead: number
    bookmarksCount: number
    likesCount: number
  }
  createdAt: string
}

const mockUser: UserProfile = {
  id: '1',
  email: 'user@example.com',
  username: 'webtoon_lover',
  displayName: 'Webtoon Lover',
  bio: 'Webtoon enthusiast from Myanmar. Love reading action and romance genres!',
  coinBalance: 150,
  stats: {
    webtoonsRead: 45,
    episodesRead: 328,
    bookmarksCount: 12,
    likesCount: 89,
  },
  createdAt: '2024-01-15',
}

type TabType = 'profile' | 'settings' | 'preferences' | 'security'

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

const FloatingInput = ({
  label,
  type = 'text',
  value,
  onChange,
  disabled,
  error,
  leftIcon,
  rightIcon,
}: FloatingInputProps) => {
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
              ? 'border-primary-500 ring-primary-500/20 bg-white ring-2 dark:bg-gray-900'
              : 'border-gray-200 bg-gray-50/50 dark:border-white/5 dark:bg-white/5'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      >
        {leftIcon && (
          <div className="absolute top-1/2 left-4.5 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}

        <label
          className={`pointer-events-none absolute left-4.5 origin-top-left transition-all duration-200 ${
            leftIcon ? 'left-11' : ''
          } ${
            isFocused || hasValue
              ? 'text-primary-500 dark:text-primary-400 top-2 text-[10px] font-black'
              : 'top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 dark:text-gray-500'
          }`}
        >
          {label}
        </label>

        <input
          type={isPassword && showPassword ? 'text' : type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full bg-transparent px-4.5 text-sm font-bold text-gray-950 transition-all duration-200 focus:outline-none dark:text-white ${
            leftIcon ? 'pl-11' : ''
          } ${isFocused || hasValue ? 'pt-6.5 pb-2' : 'py-4'}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4.5 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-5 w-5"
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
            className="mt-1.5 ml-2 flex items-center gap-1 text-xs font-bold text-red-500"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="h-3.5 w-3.5"
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

// ═══════════════ WEEKLY READING habits SVG CHART ═══════════════
const WeeklyReadingChart = () => {
  const data = [
    { day: 'Mon', mins: 45 },
    { day: 'Tue', mins: 60 },
    { day: 'Wed', mins: 30 },
    { day: 'Thu', mins: 75 },
    { day: 'Fri', mins: 90 },
    { day: 'Sat', mins: 120 },
    { day: 'Sun', mins: 80 },
  ]
  const maxMins = 120
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 text-left shadow-sm dark:border-white/5 dark:bg-gray-900">
      <h4 className="mb-5 flex items-center gap-2 text-sm font-black tracking-wider text-gray-400 uppercase dark:text-gray-500">
        <TrendingUp className="text-primary-500 h-4.5 w-4.5" />
        Weekly Reading Activity
      </h4>

      <div className="relative flex h-52 items-end justify-between gap-2.5 px-3 pt-6 pb-2.5">
        {/* SVG background grid lines */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full border-t border-dashed border-gray-100 dark:border-white/5"
            />
          ))}
        </div>

        {data.map((d, index) => {
          const heightPercent = (d.mins / maxMins) * 100
          const isHovered = hoveredIndex === index
          return (
            <div
              key={d.day}
              className="group relative flex flex-1 cursor-pointer flex-col items-center"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Tooltip detail overlay */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: -35, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute top-0 z-30 rounded-xl bg-gray-950 px-2.5 py-1.5 text-[10px] font-extrabold whitespace-nowrap text-white shadow-lg dark:bg-white dark:text-gray-950"
                  >
                    {d.mins} mins
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Visual glowing bar */}
              <div className="relative flex h-36 w-7 items-end sm:w-8.5">
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 20, delay: index * 0.08 }}
                  className="from-primary-600 dark:from-primary-500 w-full origin-bottom rounded-t-full bg-gradient-to-t to-indigo-500 shadow-md transition-all group-hover:brightness-110 dark:to-purple-600"
                  style={{ height: `${heightPercent}%` }}
                />
              </div>

              {/* Day marker label */}
              <span className="mt-2 text-[10px] font-bold text-gray-400 uppercase dark:text-gray-500">
                {d.day}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ═══════════════ ACHIEVEMENTS BADGE GRID ═══════════════
interface Achievement {
  id: string
  title: string
  desc: string
  icon: string
  color: string
  unlocked: boolean
  special?: boolean
}

const achievementsList: Achievement[] = [
  {
    id: '1',
    title: 'First Step',
    desc: 'Read your first episode',
    icon: '🏅',
    color: 'bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/25 border-emerald-500/30',
    unlocked: true,
  },
  {
    id: '2',
    title: 'Webtoon Scholar',
    desc: 'Read 10 different series',
    icon: '📖',
    color: 'bg-sky-500/10 text-sky-500 dark:bg-sky-500/25 border-sky-500/30',
    unlocked: true,
  },
  {
    id: '3',
    title: 'Generous Fan',
    desc: 'Unlocked a premium episode',
    icon: '🪙',
    color: 'bg-amber-500/10 text-amber-500 dark:bg-amber-500/25 border-amber-500/30',
    unlocked: true,
  },
  {
    id: '4',
    title: 'Golden Legend',
    desc: 'Read 100+ episodes',
    icon: '👑',
    color: 'bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/25 border-yellow-500/30 gold-glow',
    unlocked: true,
    special: true,
  },
  {
    id: '5',
    title: 'Streak Master',
    desc: 'Read 7 days in a row',
    icon: '🔥',
    color: 'bg-gray-200 text-gray-400 dark:bg-white/5 border-gray-300 dark:border-white/5',
    unlocked: false,
  },
]

const AchievementsBadgeCenter = () => {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 text-left shadow-sm dark:border-white/5 dark:bg-gray-900">
      <style>{`
        .gold-glow {
          box-shadow: 0 5px 15px -3px rgba(245, 158, 11, 0.4), 0 4px 6px -4px rgba(245, 158, 11, 0.4);
        }
      `}</style>
      <h4 className="mb-5 flex items-center gap-2 text-sm font-black tracking-wider text-gray-400 uppercase dark:text-gray-500">
        <Award className="text-primary-500 h-4.5 w-4.5" />
        Badges & Achievements
      </h4>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {achievementsList.map((ach) => (
          <motion.div
            key={ach.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all duration-300 ${
              ach.unlocked
                ? 'border-gray-100 bg-white shadow-sm dark:border-white/5 dark:bg-gray-800'
                : 'border-dashed border-gray-200 bg-gray-50/50 opacity-55 grayscale filter dark:border-white/5 dark:bg-white/5'
            }`}
          >
            {/* Badge Icon bubble */}
            <div
              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl shadow-inner ${ach.color}`}
            >
              {ach.icon}
            </div>

            {/* Sparkle for special badges */}
            {ach.special && ach.unlocked && (
              <span className="absolute top-2 right-2">
                <Sparkles
                  className="h-3 w-3 animate-spin text-amber-500"
                  style={{ animationDuration: '3s' }}
                />
              </span>
            )}

            {/* Lock padlock HUD overlay */}
            {!ach.unlocked && (
              <div className="absolute top-2 right-2 rounded-full bg-gray-200 p-1 dark:bg-white/10">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="h-3 w-3 text-gray-400"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            )}

            <p className="text-xs leading-tight font-bold text-gray-900 dark:text-white">
              {ach.title}
            </p>
            <p className="mt-1 text-[10px] leading-normal text-gray-400 dark:text-gray-500">
              {ach.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ═══════════════ MAIN PROFILE PAGE ═══════════════
const ProfilePage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [isEditing, setIsEditing] = useState(false)

  // Edit profiles state
  const [displayName, setDisplayName] = useState(mockUser.displayName)
  const [bio, setBio] = useState(mockUser.bio || '')
  const [email, setEmail] = useState(mockUser.email)

  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Security password fields state
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({})

  const tabs = [
    { id: 'profile' as TabType, label: t('profilePage.profileInformation'), icon: UserIcon },
    { id: 'settings' as TabType, label: t('profilePage.settings'), icon: Bell },
    { id: 'preferences' as TabType, label: t('profilePage.preferences'), icon: Palette },
    { id: 'security' as TabType, label: t('profilePage.security'), icon: Shield },
  ]

  const validateProfileForm = () => {
    const errs: Record<string, string> = {}
    if (!displayName.trim()) {
      errs.displayName = t('profilePage.validationRequired')
    } else if (displayName.trim().length < 3) {
      errs.displayName = t('profilePage.validationTooShort')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      errs.email = t('profilePage.validationRequired')
    } else if (!emailRegex.test(email)) {
      errs.email = t('profilePage.validationEmail')
    }

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSave = () => {
    if (validateProfileForm()) {
      setIsEditing(false)
    }
  }

  const handleSecuritySave = () => {
    const errs: Record<string, string> = {}
    if (!currentPassword) {
      errs.currentPassword = t('profilePage.validationRequired')
    }
    if (!newPassword) {
      errs.newPassword = t('profilePage.validationRequired')
    } else if (newPassword.length < 8) {
      errs.newPassword = t('auth.passwordPlaceholder')
    }
    if (!confirmPassword) {
      errs.confirmPassword = t('profilePage.validationRequired')
    } else if (confirmPassword !== newPassword) {
      errs.confirmPassword = t('auth.passwordMismatch')
    }

    setSecurityErrors(errs)
    if (Object.keys(errs).length === 0) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      alert('Password updated successfully!')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* SIDEBAR NAVIGATION CARD */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-3xl border bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="from-primary-400 to-primary-600 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br shadow-md">
                    {mockUser.avatar ? (
                      <img
                        src={mockUser.avatar}
                        alt={mockUser.displayName}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl font-black text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    title={t('profilePage.changeAvatar')}
                    aria-label={t('profilePage.changeAvatar')}
                    className="bg-primary-600 hover:bg-primary-700 absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-colors"
                  >
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                <h2 className="mt-4 text-lg font-black text-gray-900 dark:text-white">
                  {displayName}
                </h2>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500">
                  @{mockUser.username}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="bg-primary-50 dark:bg-primary-950/20 flex items-center gap-1 rounded-full px-3 py-1">
                    <span className="text-primary-600 dark:text-primary-400 text-xs font-extrabold">
                      {mockUser.coinBalance}
                    </span>
                    <span className="text-primary-600 dark:text-primary-400 text-[10px] font-bold">
                      {t('profilePage.coins')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Counts Stats grids */}
              <div className="mt-6 grid grid-cols-2 gap-3.5">
                <div className="rounded-2xl border bg-gray-50 p-3.5 text-center dark:border-white/5 dark:bg-white/5">
                  <p className="text-xl font-black text-gray-900 dark:text-white">
                    {mockUser.stats.webtoonsRead}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-gray-400 uppercase dark:text-gray-500">
                    {t('profilePage.webtoons')}
                  </p>
                </div>
                <div className="rounded-2xl border bg-gray-50 p-3.5 text-center dark:border-white/5 dark:bg-white/5">
                  <p className="text-xl font-black text-gray-900 dark:text-white">
                    {mockUser.stats.episodesRead}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-gray-400 uppercase dark:text-gray-500">
                    {t('profilePage.episodes')}
                  </p>
                </div>
                <div className="rounded-2xl border bg-gray-50 p-3.5 text-center dark:border-white/5 dark:bg-white/5">
                  <p className="text-xl font-black text-gray-900 dark:text-white">
                    {mockUser.stats.bookmarksCount}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-gray-400 uppercase dark:text-gray-500">
                    {t('profilePage.bookmarks')}
                  </p>
                </div>
                <div className="rounded-2xl border bg-gray-50 p-3.5 text-center dark:border-white/5 dark:bg-white/5">
                  <p className="text-xl font-black text-gray-900 dark:text-white">
                    {mockUser.stats.likesCount}
                  </p>
                  <p className="mt-0.5 text-[10px] font-bold text-gray-400 uppercase dark:text-gray-500">
                    {t('profilePage.likes')}
                  </p>
                </div>
              </div>

              {/* Sidebar Action Tabs */}
              <nav className="relative mt-6 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex min-h-[44px] w-full items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-white/5'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="text-sm font-bold">{tab.label}</span>
                    <ChevronRight className="ml-auto h-4 w-4 opacity-50" />

                    {/* Tab Navigation Glide transition indicator */}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeProfileTabBorder"
                        className="bg-primary-600 dark:bg-primary-500 absolute top-3.5 bottom-3.5 left-0 w-1 rounded-full"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
                <button className="flex min-h-[44px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/10">
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-bold">{t('profilePage.logout')}</span>
                </button>
              </nav>
            </div>
          </div>

          {/* MAIN TAB CONTENT CARD PANELS */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* A. PROFILE INFORMATION SHEET */}
              {activeTab === 'profile' && (
                <>
                  <div className="rounded-3xl border bg-white p-6 text-left shadow-sm dark:border-white/5 dark:bg-gray-900">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-black text-gray-900 dark:text-white">
                        {t('profilePage.profileInformation')}
                      </h3>
                      <Button
                        variant={isEditing ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        className="dark:border-white/10 dark:text-white"
                      >
                        {isEditing ? (
                          t('profilePage.saveChanges')
                        ) : (
                          <>
                            <Edit3 className="mr-2 h-4 w-4" />
                            {t('profilePage.editProfile')}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* INTERACTIVE FLOATING label form */}
                    <div className="space-y-5.5">
                      <FloatingInput
                        label={t('profilePage.displayName')}
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={!isEditing}
                        error={errors.displayName}
                        leftIcon={<UserIcon className="h-5 w-5" />}
                      />

                      <FloatingInput
                        label={t('profilePage.email')}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={!isEditing}
                        error={errors.email}
                        leftIcon={<Mail className="h-5 w-5" />}
                      />

                      {/* Bio Field Textarea */}
                      <div className="text-left">
                        <label className="mb-2 block text-xs font-bold text-gray-400 uppercase dark:text-gray-500">
                          {t('profilePage.bio')}
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          disabled={!isEditing}
                          rows={4}
                          className={`w-full resize-none rounded-2xl border-2 px-4.5 py-3 text-sm font-bold transition focus:outline-none dark:text-white ${
                            isEditing
                              ? 'focus:border-primary-500 focus:ring-primary-500 border-gray-200 focus:ring-1 dark:border-white/5 dark:bg-gray-800'
                              : 'border-gray-100 bg-gray-50/50 dark:border-white/5 dark:bg-white/5 dark:text-gray-400'
                          }`}
                          placeholder={t('comments.placeholder')}
                        />
                      </div>

                      <div className="border-t border-gray-100 pt-4 dark:border-white/5">
                        <p className="text-xs font-bold text-gray-400 dark:text-gray-500">
                          Joined Myanmar Soft-Gate Comic on{' '}
                          {new Date(mockUser.createdAt).toLocaleDateString(
                            lang === 'mm' ? 'my-MM' : 'en-US',
                            {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* WEEKLY SVG CHARTS */}
                  <WeeklyReadingChart />

                  {/* ACHIEVEMENTS BADGE GRIDS */}
                  <AchievementsBadgeCenter />
                </>
              )}

              {/* B. NOTIFICATION SETTINGS SHEET */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="rounded-3xl border bg-white p-6 text-left shadow-sm dark:border-white/5 dark:bg-gray-900">
                    <h3 className="mb-6 text-lg font-black text-gray-900 dark:text-white">
                      {t('notifications.title')}
                    </h3>
                    <div className="space-y-4">
                      {[
                        {
                          title: t('notifications.newEpisode'),
                          description: t('notifications.newEpisode'),
                        },
                        {
                          title: t('notifications.commentReply'),
                          description: t('notifications.commentReply'),
                        },
                        {
                          title: t('notifications.promotion'),
                          description: t('notifications.promotion'),
                        },
                        {
                          title: t('notifications.system'),
                          description: t('notifications.system'),
                        },
                      ].map((setting, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between border-b border-gray-100 py-4 last:border-0 dark:border-white/5"
                        >
                          <div>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {setting.title}
                            </p>
                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                              {setting.description}
                            </p>
                          </div>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              defaultChecked={index < 2}
                              className="peer sr-only"
                            />
                            <div className="peer-focus:ring-primary-100 peer peer-checked:bg-primary-600 h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-800"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* C. PREFERENCES SETTINGS SHEET */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div className="rounded-3xl border bg-white p-6 text-left shadow-sm dark:border-white/5 dark:bg-gray-900">
                    <h3 className="mb-6 text-lg font-black text-gray-900 dark:text-white">
                      {t('profilePage.preferences')}
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <label className="mb-3 block text-xs font-bold text-gray-400 uppercase dark:text-gray-500">
                          {t('reader.fontSize')}
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="12"
                            max="24"
                            defaultValue="16"
                            aria-label={t('reader.fontSize')}
                            className="accent-primary-600 h-2 flex-1 cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-800"
                          />
                          <span className="w-12 text-center text-sm font-extrabold text-gray-700 dark:text-gray-300">
                            16px
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 py-4 dark:border-white/5">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">
                            {t('reader.darkMode')}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {t('reader.darkMode')}
                          </p>
                        </div>
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input type="checkbox" className="peer sr-only" />
                          <div className="peer-focus:ring-primary-100 peer peer-checked:bg-primary-600 h-6 w-11 rounded-full bg-gray-200 peer-focus:ring-4 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white dark:bg-gray-800"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* D. SECURITY AND PASSWORDS SHEET */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="rounded-3xl border bg-white p-6 text-left shadow-sm dark:border-white/5 dark:bg-gray-900">
                    <h3 className="mb-6 text-lg font-black text-gray-900 dark:text-white">
                      {t('profile.changePassword')}
                    </h3>
                    <div className="max-w-md space-y-4">
                      <FloatingInput
                        label={t('profile.currentPassword')}
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        error={securityErrors.currentPassword}
                        leftIcon={<Lock className="h-5 w-5" />}
                      />

                      <FloatingInput
                        label={t('profile.newPassword')}
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        error={securityErrors.newPassword}
                        leftIcon={<Lock className="h-5 w-5" />}
                      />

                      <FloatingInput
                        label={t('profile.confirmNewPassword')}
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={securityErrors.confirmPassword}
                        leftIcon={<Lock className="h-5 w-5" />}
                      />

                      <Button variant="primary" className="mt-4" onClick={handleSecuritySave}>
                        {t('profile.changePassword')}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-left dark:border-red-950/30 dark:bg-red-950/20">
                    <h3 className="mb-2 text-base font-black tracking-wider text-red-600 uppercase dark:text-red-400">
                      {t('profile.deleteAccount')}
                    </h3>
                    <p className="mb-4 text-xs font-semibold text-red-500 dark:text-red-400/80">
                      {t('profile.deleteAccountWarning')}
                    </p>
                    <Button variant="danger">{t('profile.deleteAccount')}</Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
