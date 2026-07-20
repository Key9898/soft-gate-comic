import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

type NotificationType = 'new_episode' | 'comment_reply' | 'system' | 'promotion'

interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  data?: {
    webtoonId?: string
    webtoonTitle?: string
    episodeNumber?: number
    commentId?: string
    userId?: string
  }
  createdAt: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'new_episode',
    title: 'notificationsPage.newEpisode',
    message: 'The Last Horizon - Episode 86 is now available. Continue reading!',
    isRead: false,
    data: {
      webtoonId: '1',
      webtoonTitle: 'The Last Horizon',
      episodeNumber: 86,
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'comment_reply',
    title: 'notificationsPage.commentReply',
    message: 'Webtoon Fan replied to your comment on "Shadow Knight Episode 45"',
    isRead: false,
    data: {
      webtoonId: '3',
      commentId: 'c1',
      userId: '2',
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'promotion',
    title: 'notificationsPage.promotion',
    message: 'Get 50% bonus coins on your next purchase! Limited time offer.',
    isRead: true,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'new_episode',
    title: 'notificationsPage.newEpisode',
    message: 'Love in Seoul - Episode 63 is now available. Continue reading!',
    isRead: true,
    data: {
      webtoonId: '2',
      webtoonTitle: 'Love in Seoul',
      episodeNumber: 63,
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'system',
    title: 'notificationsPage.system',
    message: 'Your password was successfully changed.',
    isRead: true,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '6',
    type: 'comment_reply',
    title: 'notificationsPage.commentReply',
    message: 'Manga Lover liked your comment on "Blood Moon Episode 50"',
    isRead: true,
    data: {
      webtoonId: '7',
      commentId: 'c2',
      userId: '3',
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '7',
    type: 'promotion',
    title: 'notificationsPage.promotion',
    message: 'Unlock premium episodes with 30% fewer coins this weekend!',
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '8',
    type: 'system',
    title: 'notificationsPage.system',
    message: 'Thanks for joining Soft-Gate Comic. Start exploring amazing webtoons now!',
    isRead: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

const NotificationsPage = () => {
  const { t } = useTranslation()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [showSettings, setShowSettings] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length

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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'new_episode':
        return <BookOpen className="h-5 w-5" />
      case 'comment_reply':
        return <MessageCircle className="h-5 w-5" />
      case 'system':
        return <Bell className="h-5 w-5" />
      case 'promotion':
        return <Gift className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'new_episode':
        return 'bg-primary-100 text-primary-600'
      case 'comment_reply':
        return 'bg-blue-100 text-blue-600'
      case 'system':
        return 'bg-gray-100 text-gray-600'
      case 'promotion':
        return 'bg-accent-500/10 text-accent-600'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id))
  }

  const clearAllRead = () => {
    setNotifications(notifications.filter((n) => !n.isRead))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              {t('notificationsPage.title')}
            </h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-gray-500">
                {unreadCount} {t('notificationsPage.unread')}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="mb-6 rounded-2xl bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 p-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {t('categories.all')}
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {t('notificationsPage.unread')}
                {unreadCount > 0 && (
                  <span className="bg-accent-600 ml-2 rounded-full px-1.5 py-0.5 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                  <CheckCheck className="mr-1 h-4 w-4" />
                  {t('notificationsPage.markAllRead')}
                </Button>
              )}
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative cursor-pointer p-4 transition-colors hover:bg-gray-50 ${
                      !notification.isRead ? 'bg-primary-50/50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-4">
                      <div
                        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${getNotificationColor(
                          notification.type
                        )}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-gray-900">{t(notification.title)}</p>
                            <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-2">
                            {!notification.isRead && (
                              <span className="bg-accent-600 h-2 w-2 rounded-full" />
                            )}
                            <span className="text-xs text-gray-400">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                        {notification.type === 'new_episode' && notification.data && (
                          <div className="mt-3">
                            <Button variant="outline" size="sm">
                              {t('webtoon.episodes')} {notification.data.episodeNumber}
                            </Button>
                          </div>
                        )}
                        {notification.type === 'promotion' && (
                          <div className="mt-3">
                            <Button variant="accent" size="sm">
                              <Gift className="mr-1 h-4 w-4" />
                              {t('coinsPage.bonus')}
                            </Button>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        title={t('common.delete')}
                        aria-label={t('common.delete')}
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteNotification(notification.id)
                        }}
                        className="p-1 text-gray-400 opacity-0 transition-colors group-hover:opacity-100 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                  <BellOff className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {t('notificationsPage.noNotifications')}
                </h3>
                <p className="text-gray-500">{t('notificationsPage.noNotifications')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {notifications.some((n) => n.isRead) && (
            <div className="border-t border-gray-100 p-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-red-600"
                onClick={clearAllRead}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('notificationsPage.clearAllRead')}
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            {t('notificationsPage.title')}
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              {
                type: 'new_episode' as NotificationType,
                label: t('notificationsPage.newEpisode'),
                count: notifications.filter((n) => n.type === 'new_episode').length,
              },
              {
                type: 'comment_reply' as NotificationType,
                label: t('notificationsPage.commentReply'),
                count: notifications.filter((n) => n.type === 'comment_reply').length,
              },
              {
                type: 'system' as NotificationType,
                label: t('notificationsPage.system'),
                count: notifications.filter((n) => n.type === 'system').length,
              },
              {
                type: 'promotion' as NotificationType,
                label: t('notificationsPage.promotion'),
                count: notifications.filter((n) => n.type === 'promotion').length,
              },
            ].map((item) => (
              <div
                key={item.type}
                className={`rounded-xl p-4 text-center ${
                  item.count > 0 ? 'bg-gray-50' : 'bg-gray-50/50'
                }`}
              >
                <div
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full ${getNotificationColor(
                    item.type
                  )}`}
                >
                  {getNotificationIcon(item.type)}
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-500">{item.count}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsPage
