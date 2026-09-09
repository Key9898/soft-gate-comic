import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEngagement } from '../../../context/EngagementContext'
import { isMockApi } from '../../../lib/api/isMockApi'
import { enableLockScreenPush } from '../../../lib/push'
import type { NotifPrefs } from '../../../lib/notifications'

type PrefKey = keyof NotifPrefs

const CHANNELS: { key: PrefKey; titleKey: string; descKey: string }[] = [
  {
    key: 'newEpisode',
    titleKey: 'profilePage.prefNewEpisode',
    descKey: 'profilePage.prefNewEpisodeDesc',
  },
  {
    key: 'commentReply',
    titleKey: 'profilePage.prefCommentReply',
    descKey: 'profilePage.prefCommentReplyDesc',
  },
  {
    key: 'promotion',
    titleKey: 'profilePage.prefPromotion',
    descKey: 'profilePage.prefPromotionDesc',
  },
]

const InAppSwitch = ({
  checked,
  label,
  onToggle,
}: {
  checked: boolean
  label: string
  onToggle: () => void
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onToggle}
    className="focus-visible:ring-primary-500 flex min-h-11 min-w-11 items-center justify-center rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
  >
    <span
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-primary-600' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </span>
  </button>
)

const FollowChannel = ({ label }: { label: string }) => (
  <span className="text-2xs block max-w-[9.5rem] font-semibold text-gray-600">{label}</span>
)

const LockedChannel = ({ label }: { label: string }) => (
  <span className="text-2xs block max-w-[9.5rem] font-semibold text-gray-400">{label}</span>
)

const NotificationSettingsMatrix = () => {
  const { t } = useTranslation()
  const { notifPrefs, setNotifPrefs } = useEngagement()
  const [pushStatus, setPushStatus] = useState<'idle' | 'ok' | 'denied' | 'unavailable'>('idle')
  const http = !isMockApi()

  return (
    <div className="rounded-3xl border bg-white p-6 text-left shadow-sm">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{t('notifications.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('profilePage.settingsLead')}</p>
        </div>
        <Link
          to="/notifications"
          className="text-primary-600 focus-visible:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl text-sm font-bold focus-visible:ring-2 focus-visible:outline-none"
        >
          {t('profilePage.settingsInboxLink')}
        </Link>
      </div>

      {http ? (
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-600">{t('profilePage.pushEnableLead')}</p>
          <button
            type="button"
            className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 inline-flex min-h-11 items-center justify-center rounded-2xl px-4 text-sm font-bold text-white focus-visible:ring-2 focus-visible:outline-none"
            onClick={() => {
              void enableLockScreenPush().then(setPushStatus)
            }}
          >
            {t('profilePage.pushEnable')}
          </button>
        </div>
      ) : null}
      {pushStatus === 'ok' ? (
        <p className="mb-4 text-sm font-medium text-gray-700">{t('profilePage.pushEnableOk')}</p>
      ) : null}
      {pushStatus === 'denied' ? (
        <p className="mb-4 text-sm font-medium text-gray-700">
          {t('profilePage.pushEnableDenied')}
        </p>
      ) : null}
      {pushStatus === 'unavailable' ? (
        <p className="mb-4 text-sm font-medium text-gray-700">
          {t('profilePage.pushEnableUnavailable')}
        </p>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="text-2xs font-bold tracking-wider text-gray-400 uppercase">
              <th className="px-2 py-2 font-bold">{t('profilePage.settingsCategory')}</th>
              <th className="px-2 py-2 text-center font-bold">{t('profilePage.channelInApp')}</th>
              <th className="px-2 py-2 text-center font-bold">{t('profilePage.channelEmail')}</th>
              <th className="px-2 py-2 text-center font-bold">{t('profilePage.channelPush')}</th>
            </tr>
          </thead>
          <tbody>
            {CHANNELS.map((channel) => (
              <tr key={channel.key} className="rounded-2xl bg-gray-50">
                <th scope="row" className="rounded-l-2xl px-4 py-3">
                  <p className="text-sm font-bold text-gray-900">{t(channel.titleKey)}</p>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">{t(channel.descKey)}</p>
                </th>
                <td className="px-2 py-2 text-center">
                  <InAppSwitch
                    checked={notifPrefs[channel.key]}
                    label={t(channel.titleKey)}
                    onToggle={() => setNotifPrefs({ [channel.key]: !notifPrefs[channel.key] })}
                  />
                </td>
                <td className="px-2 py-2 text-center">
                  <FollowChannel label={t('profilePage.channelFollowsPref')} />
                </td>
                <td className="rounded-r-2xl px-2 py-2 text-center">
                  <FollowChannel label={t('profilePage.channelFollowsPref')} />
                </td>
              </tr>
            ))}
            <tr className="rounded-2xl bg-gray-50">
              <th scope="row" className="rounded-l-2xl px-4 py-3">
                <p className="text-sm font-bold text-gray-900">
                  {t('profilePage.prefAccountSecurity')}
                </p>
                <p className="mt-0.5 text-xs font-medium text-gray-500">
                  {t('profilePage.prefAccountSecurityDesc')}
                </p>
              </th>
              <td className="px-2 py-2 text-center">
                <span className="text-xs font-bold text-gray-600">
                  {t('profilePage.prefAccountLocked')}
                </span>
              </td>
              <td className="px-2 py-2 text-center">
                <LockedChannel label={t('profilePage.prefAccountLocked')} />
              </td>
              <td className="rounded-r-2xl px-2 py-2 text-center">
                <LockedChannel label={t('profilePage.prefAccountLocked')} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NotificationSettingsMatrix
