import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User as UserIcon,
  Mail,
  Lock,
  Bell,
  Palette,
  Shield,
  LogOut,
  Edit3,
  ChevronRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import SEO from '../../components/SEO/SEO'
import { useAuth } from '../../context/AuthContext'
import { useLibrary } from '../../context/LibraryContext'
import { useEngagement } from '../../context/EngagementContext'
import { useWallet } from '../../context/WalletContext'
import FloatingInput from './components/FloatingInput'
import WeeklyReadingChart from './components/WeeklyReadingChart'
import AchievementsBadgeCenter from './components/AchievementsBadgeCenter'

type TabType = 'profile' | 'settings' | 'preferences' | 'security'

const ProfilePage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const navigate = useNavigate()
  const { user, logout, updateProfile, changePassword, deleteAccount } = useAuth()
  const { bookmarks } = useLibrary()
  const { history, likedWebtoonIds } = useEngagement()
  const { unlockedEpisodeKeys, balance } = useWallet()
  const [activeTab, setActiveTab] = useState<TabType>('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [statusMessage, setStatusMessage] = useState('')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deletePassword, setDeletePassword] = useState('')
  const [securityErrors, setSecurityErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) return
    setDisplayName(user.displayName)
    setBio(user.bio || '')
    setEmail(user.email)
  }, [user])

  const tabs = [
    { id: 'profile' as TabType, label: t('profilePage.profileInformation'), icon: UserIcon },
    { id: 'settings' as TabType, label: t('profilePage.settings'), icon: Bell },
    { id: 'preferences' as TabType, label: t('profilePage.preferences'), icon: Palette },
    { id: 'security' as TabType, label: t('profilePage.security'), icon: Shield },
  ]

  if (!user) {
    return null
  }

  const episodesRead = history.reduce((sum, h) => sum + (h.readEpisodeNumbers?.length ?? 1), 0)
  const seriesRead = history.length
  const stats = [
    { value: seriesRead, label: t('profilePage.webtoons') },
    { value: episodesRead, label: t('profilePage.episodes') },
    { value: bookmarks.length, label: t('profilePage.bookmarks') },
    { value: likedWebtoonIds.length, label: t('profilePage.likes') },
  ]

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.onerror = () => reject(new Error('read failed'))
        reader.readAsDataURL(file)
      })
      await updateProfile({ avatar: dataUrl })
      setStatusMessage(t('profilePage.savedLocally'))
    } catch {
      setStatusMessage(t('profilePage.avatarFailed'))
    } finally {
      setAvatarUploading(false)
    }
  }

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

  const handleSave = async () => {
    if (!validateProfileForm()) return
    try {
      await updateProfile({ displayName, email, bio })
      setIsEditing(false)
      setStatusMessage(t('profilePage.savedLocally'))
    } catch {
      setErrors({ email: t('auth.emailTaken') })
    }
  }

  const handleSecuritySave = async () => {
    const errs: Record<string, string> = {}
    if (!currentPassword) {
      errs.currentPassword = t('profilePage.validationRequired')
    }
    if (!newPassword) {
      errs.newPassword = t('profilePage.validationRequired')
    } else if (newPassword.length < 8) {
      errs.newPassword = t('auth.passwordMinLength8')
    }
    if (!confirmPassword) {
      errs.confirmPassword = t('profilePage.validationRequired')
    } else if (confirmPassword !== newPassword) {
      errs.confirmPassword = t('auth.passwordMismatch')
    }

    setSecurityErrors(errs)
    if (Object.keys(errs).length > 0) return

    try {
      await changePassword(currentPassword, newPassword)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setStatusMessage(t('profilePage.passwordUpdatedLocally'))
    } catch {
      setSecurityErrors({ currentPassword: t('auth.loginFailed') })
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setSecurityErrors({ deletePassword: t('profilePage.validationRequired') })
      return
    }
    try {
      await deleteAccount(deletePassword)
      navigate('/')
    } catch {
      setSecurityErrors({ deletePassword: t('auth.loginFailed') })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12 transition-colors duration-300">
      <SEO title={t('profile.title')} noindex />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {statusMessage && (
          <p
            role="status"
            className="bg-primary-50 text-primary-700 mb-4 rounded-2xl px-4 py-3 text-sm"
          >
            {statusMessage}
          </p>
        )}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-6 rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="from-primary-400 to-primary-600 shape-circle relative flex h-24 w-24 items-center justify-center bg-gradient-to-br shadow-md">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.displayName}
                      className="shape-circle h-24 w-24 object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <label className="absolute right-0 bottom-0 cursor-pointer rounded-2xl bg-white p-1.5 shadow">
                    <Edit3 className="text-primary-600 h-3.5 w-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      disabled={avatarUploading}
                      onChange={handleAvatarChange}
                      aria-label={t('profilePage.changeAvatar')}
                    />
                  </label>
                </div>
                <h1 className="mt-4 text-lg font-bold text-gray-900">{displayName}</h1>
                <p className="text-xs font-semibold text-gray-400">@{user.username}</p>
                <p className="text-2xs mt-2 font-medium text-gray-400">
                  {t('profilePage.localStatsNote', {
                    balance,
                    unlocks: unlockedEpisodeKeys.length,
                  })}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3.5">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border bg-gray-50 p-3.5 text-center">
                    <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-2xs mt-0.5 font-bold text-gray-400 uppercase">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <nav className="relative mt-6 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex min-h-[44px] w-full items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span className="text-sm font-bold">{tab.label}</span>
                    <ChevronRight className="ml-auto h-4 w-4 opacity-50" />
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeProfileTabBorder"
                        className="bg-primary-600 absolute top-3.5 bottom-3.5 left-0 w-1 rounded-2xl"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-2xl px-4 py-3 text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-bold">{t('profilePage.logout')}</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {activeTab === 'profile' && (
                <>
                  <div className="rounded-3xl border bg-white p-6 text-left shadow-sm">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">
                        {t('profilePage.profileInformation')}
                      </h3>
                      <Button
                        variant={isEditing ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => (isEditing ? void handleSave() : setIsEditing(true))}
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

                      <div className="text-left">
                        <label className="mb-2 block text-xs font-bold text-gray-400 uppercase">
                          {t('profilePage.bio')}
                        </label>
                        <textarea
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          disabled={!isEditing}
                          rows={4}
                          className={`w-full resize-none rounded-2xl border-2 px-4.5 py-3 text-sm font-bold transition focus:outline-none ${
                            isEditing
                              ? 'focus:border-primary-500 focus:ring-primary-500 border-gray-200 focus:ring-1'
                              : 'border-gray-100 bg-gray-50/50'
                          }`}
                          placeholder={t('comments.placeholder')}
                        />
                      </div>

                      <div className="border-t border-gray-100 pt-4">
                        <p className="text-xs font-bold text-gray-400">
                          {t('profilePage.joinedOn', {
                            date: new Date(user.createdAt).toLocaleDateString(
                              lang === 'mm' ? 'my-MM' : 'en-US',
                              { month: 'long', day: 'numeric', year: 'numeric' }
                            ),
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <WeeklyReadingChart history={history} demoLabel={t('common.demo')} />
                  <AchievementsBadgeCenter
                    demoLabel={t('common.demo')}
                    unlockedCount={unlockedEpisodeKeys.length}
                    historyCount={history.length}
                    likeCount={likedWebtoonIds.length}
                  />
                </>
              )}

              {activeTab === 'settings' && (
                <div className="rounded-3xl border bg-white p-6 text-left shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {t('notifications.title')}
                  </h3>
                  <p className="text-sm text-gray-500">{t('profilePage.prefsUnavailable')}</p>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div className="rounded-3xl border bg-white p-6 text-left shadow-sm">
                  <h3 className="mb-2 text-lg font-bold text-gray-900">
                    {t('profilePage.preferences')}
                  </h3>
                  <p className="text-sm text-gray-500">{t('profilePage.prefsUnavailable')}</p>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="rounded-3xl border bg-white p-6 text-left shadow-sm">
                    <h3 className="mb-6 text-lg font-bold text-gray-900">
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
                      <Button
                        variant="primary"
                        className="mt-4"
                        onClick={() => void handleSecuritySave()}
                      >
                        {t('profile.changePassword')}
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-red-100 bg-red-50 p-6 text-left">
                    <h3 className="mb-2 text-base font-bold tracking-wider text-red-600 uppercase">
                      {t('profile.deleteAccount')}
                    </h3>
                    <p className="mb-4 text-xs font-semibold text-red-500">
                      {t('profile.deleteAccountWarning')}
                    </p>
                    <FloatingInput
                      label={t('auth.password')}
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      error={securityErrors.deletePassword}
                      leftIcon={<Lock className="h-5 w-5" />}
                    />
                    <Button
                      variant="danger"
                      className="mt-4"
                      onClick={() => void handleDeleteAccount()}
                    >
                      {t('profile.deleteAccount')}
                    </Button>
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
