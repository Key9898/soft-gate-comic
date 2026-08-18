import { motion } from 'framer-motion'
import { Award, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Achievement {
  id: string
  title: string
  desc: string
  icon: string
  color: string
  unlocked: boolean
  special?: boolean
}

interface AchievementsBadgeCenterProps {
  demoLabel?: string
  unlockedCount?: number
  historyCount?: number
  likeCount?: number
}

export const AchievementsBadgeCenter = ({
  demoLabel,
  unlockedCount = 0,
  historyCount = 0,
  likeCount = 0,
}: AchievementsBadgeCenterProps) => {
  const { t } = useTranslation()
  const achievementsList: Achievement[] = [
    {
      id: '1',
      title: t('profilePage.achFirstStep'),
      desc: t('profilePage.achFirstStepDesc'),
      icon: '🏅',
      color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
      unlocked: historyCount > 0,
    },
    {
      id: '2',
      title: t('profilePage.achScholar'),
      desc: t('profilePage.achScholarDesc'),
      icon: '📖',
      color: 'bg-sky-500/10 text-sky-500 border-sky-500/30',
      unlocked: historyCount >= 3,
    },
    {
      id: '3',
      title: t('profilePage.achGenerous'),
      desc: t('profilePage.achGenerousDesc'),
      icon: '🪙',
      color: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
      unlocked: unlockedCount > 0,
    },
    {
      id: '4',
      title: t('profilePage.achHeart'),
      desc: t('profilePage.achHeartDesc'),
      icon: '❤️',
      color: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
      unlocked: likeCount >= 3,
    },
    {
      id: '5',
      title: t('profilePage.achLegend'),
      desc: t('profilePage.achLegendDesc'),
      icon: '👑',
      color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30 gold-glow',
      unlocked: unlockedCount >= 5,
      special: true,
    },
  ]

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 text-left shadow-sm">
      <style>{`
        .gold-glow {
          box-shadow: 0 5px 15px -3px rgba(245, 158, 11, 0.4), 0 4px 6px -4px rgba(245, 158, 11, 0.4);
        }
      `}</style>
      <h4 className="mb-5 flex items-center gap-2 text-sm font-bold tracking-wider text-gray-400 uppercase">
        <Award className="text-primary-500 h-4.5 w-4.5" aria-hidden="true" />
        {t('profilePage.achievements')}
        {demoLabel ? (
          <span className="text-2xs rounded-2xl bg-gray-100 px-2 py-0.5 font-bold text-gray-500">
            {demoLabel}
          </span>
        ) : null}
      </h4>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {achievementsList.map((ach) => (
          <motion.div
            key={ach.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`relative flex flex-col items-center rounded-2xl border p-4 text-center transition-all duration-300 ${
              ach.unlocked
                ? 'border-gray-100 bg-white shadow-sm'
                : 'border-dashed border-gray-200 bg-gray-50/50 opacity-55 grayscale filter'
            }`}
          >
            <div
              className={`mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl shadow-inner ${ach.color}`}
            >
              {ach.icon}
            </div>

            {ach.special && ach.unlocked && (
              <span className="absolute top-2 right-2">
                <Sparkles
                  className="h-3 w-3 animate-spin text-amber-500"
                  style={{ animationDuration: '3s' }}
                />
              </span>
            )}

            {!ach.unlocked && (
              <div className="absolute top-2 right-2 rounded-2xl bg-gray-200 p-1">
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

            <p className="text-xs leading-tight font-bold text-gray-900">{ach.title}</p>
            <p className="text-2xs mt-1 leading-normal text-gray-400">{ach.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AchievementsBadgeCenter
