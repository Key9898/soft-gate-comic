import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, CheckCheck, BookOpen, MessageCircle, Gift, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import SEO from '../../components/SEO/SEO'
import { useEngagement } from '../../context/EngagementContext'

const NotificationsPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const {
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearReadNotifications,
  } = useEngagement()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = unreadNotificationCount
  const filteredNotifications =
    filter === 'all' ? notifications : notifications.filter((n) => !n.isRead)

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

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <SEO title={t('notificationsPage.title')} noindex />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('notificationsPage.title')}</h1>
            {unreadCount > 0 ? (
              <p className="mt-1 text-sm text-gray-500">
                {unreadCount} {t('notificationsPage.unread')}
              </p>
            ) : null}
          </div>

          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              {t('categories.all')}
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              {t('notificationsPage.unread')}
            </Button>
            {unreadCount > 0 ? (
              <Button variant="ghost" size="sm" onClick={markAllNotificationsRead}>
                <CheckCheck className="mr-1 h-4 w-4" />
                {t('notificationsPage.markAllRead')}
              </Button>
            ) : null}
          </div>

          <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
            {filteredNotifications.length === 0 ? (
              <div className="py-16 text-center">
                <BellOff className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                <p className="text-gray-500">{t('notificationsPage.noNotifications')}</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                <AnimatePresence>
                  {filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      role="button"
                      tabIndex={0}
                      className={`focus-visible:ring-primary-500 flex cursor-pointer gap-4 p-4 transition ring-inset hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none ${
                        !notification.isRead ? 'bg-primary-50/50' : ''
                      }`}
                      onClick={() => markNotificationRead(notification.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          markNotificationRead(notification.id)
                        }
                      }}
                    >
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
                            {notification.href ? (
                              <Link
                                to={notification.href}
                                className="text-primary-600 mt-2 inline-block text-xs font-semibold"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {t('notificationsPage.view')}
                              </Link>
                            ) : null}
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
                      <button
                        type="button"
                        className="rounded-2xl p-2 text-gray-400 hover:bg-gray-100 hover:text-red-500"
                        aria-label={t('common.delete')}
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
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
