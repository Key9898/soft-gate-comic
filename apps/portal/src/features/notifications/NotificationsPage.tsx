import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Bell,
  BellOff,
  CheckCheck,
  BookOpen,
  MessageCircle,
  Gift,
  Trash2,
  Settings,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import SEO from '../../components/SEO/SEO'
import { useEngagement } from '../../context/EngagementContext'
import type { NotificationType } from '../../lib/notifications'

type InboxFilter = 'all' | 'unread' | NotificationType

const NotificationsPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearReadNotifications,
  } = useEngagement()
  const [filter, setFilter] = useState<InboxFilter>('all')

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'unread') return !item.isRead
    return item.type === filter
  })

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (diffMins < 1) return t('notificationsPage.justNow')
    if (diffMins < 60) return `${diffMins}${t('notificationsPage.minutesAgo')}`
    if (diffHours < 24) return `${diffHours}${t('notificationsPage.hoursAgo')}`
    if (diffDays < 7) return `${diffDays}${t('notificationsPage.daysAgo')}`
    return date.toLocaleDateString(lang === 'mm' ? 'my-MM' : 'en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_episode':
        return <BookOpen className="h-5 w-5" />
      case 'comment_reply':
        return <MessageCircle className="h-5 w-5" />
      case 'promotion':
        return <Gift className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const iconClass = (type: string) => {
    switch (type) {
      case 'new_episode':
        return 'bg-primary-100 text-primary-600'
      case 'comment_reply':
        return 'bg-sky-100 text-sky-600'
      case 'promotion':
        return 'bg-amber-100 text-amber-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const filters: { id: InboxFilter; label: string }[] = [
    { id: 'all', label: t('categories.all') },
    { id: 'unread', label: t('notificationsPage.unread') },
    { id: 'new_episode', label: t('notificationsPage.filterUpdates') },
    { id: 'comment_reply', label: t('notificationsPage.filterActivity') },
    { id: 'promotion', label: t('notificationsPage.filterPromo') },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <SEO title={t('notificationsPage.title')} noindex />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{t('notificationsPage.title')}</h1>
            <Link
              to="/profile?tab=settings"
              className="text-primary-600 focus-visible:ring-primary-500 inline-flex min-h-11 items-center gap-2 rounded-2xl text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
            >
              <Settings className="h-4 w-4" aria-hidden="true" />
              {t('profilePage.settings')}
            </Link>
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            {filters.map((item) => (
              <Button
                key={item.id}
                variant={filter === item.id ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(item.id)}
              >
                {item.label}
              </Button>
            ))}
            {notifications.some((item) => !item.isRead) ? (
              <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
                <CheckCheck className="mr-1 h-4 w-4" />
                {t('notificationsPage.markAllRead')}
              </Button>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            {filteredNotifications.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <BellOff className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p className="font-bold text-gray-900">{t('notificationsPage.allCaughtUp')}</p>
                <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                  {t('notificationsPage.allCaughtUpWhy')}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link
                    to="/categories"
                    className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl px-4 text-sm font-bold text-white focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {t('categories.webtoons')}
                  </Link>
                  <Link
                    to="/profile?tab=settings"
                    className="focus-visible:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl border border-gray-200 px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {t('profilePage.settings')}
                  </Link>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => {
                  const rowClass = `flex gap-4 p-4 transition hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-primary-50/50' : ''
                  }`
                  const body = (
                    <>
                      <div
                        className={`shape-circle flex h-11 w-11 flex-shrink-0 items-center justify-center ${iconClass(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {t(notification.titleKey)}
                            </p>
                            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {!notification.isRead ? (
                              <span className="bg-primary-500 shape-circle h-2 w-2" />
                            ) : null}
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  )
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-stretch"
                    >
                      {notification.href ? (
                        <Link
                          to={notification.href}
                          className={`focus-visible:ring-primary-500 min-w-0 flex-1 rounded-none ring-inset focus-visible:ring-2 focus-visible:outline-none ${rowClass}`}
                          onClick={() => markNotificationRead(notification.id)}
                        >
                          {body}
                        </Link>
                      ) : (
                        <div className={`min-w-0 flex-1 ${rowClass}`}>{body}</div>
                      )}
                      <button
                        type="button"
                        className="focus-visible:ring-primary-500 m-2 self-center rounded-2xl p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500 focus-visible:ring-2 focus-visible:outline-none"
                        aria-label={t('common.delete')}
                        onClick={() => deleteNotification(notification.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>

          {notifications.some((n) => n.isRead) ? (
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={clearReadNotifications}>
                {t('notificationsPage.clearAllRead')}
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
