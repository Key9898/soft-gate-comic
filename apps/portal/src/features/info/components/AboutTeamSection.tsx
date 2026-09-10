import { useTranslation } from 'react-i18next'
import { Skeleton } from '../../../components/Skeleton/Skeleton'
import { pickBilingual } from '../../../lib/about/history'
import type { PortalAboutMember, PortalAboutMeta } from '../../../lib/about/team'
import { useAboutTeam } from '../useAboutTeam'

const SECTION_HEADING =
  'flex items-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase'

const SECTION_RULE = 'border-t border-gray-200/60 py-20'

const MOCK_TEAM = [
  {
    src: '/about/team/team-founder.jpg',
    nameKey: 'about.teamFounderName',
    roleKey: 'about.teamFounderRole',
  },
  {
    src: '/about/team/team-editorial.jpg',
    nameKey: 'about.teamEditorialName',
    roleKey: 'about.teamEditorialRole',
  },
  {
    src: '/about/team/team-product.jpg',
    nameKey: 'about.teamProductName',
    roleKey: 'about.teamProductRole',
  },
  {
    src: '/about/team/team-creators.jpg',
    nameKey: 'about.teamCreatorsName',
    roleKey: 'about.teamCreatorsRole',
  },
] as const

const PHOTO_CLASS = 'aspect-square w-full rounded-2xl object-cover object-top'

function TeamSkeleton() {
  const { t } = useTranslation()
  return (
    <ul className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4" aria-busy="true" aria-live="polite">
      <span className="sr-only">{t('a11y.loading')}</span>
      {[0, 1, 2, 3].map((slot) => (
        <li key={slot} className="space-y-3">
          <Skeleton className="aspect-square w-full" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </li>
      ))}
    </ul>
  )
}

function MockTeamList() {
  const { t } = useTranslation()
  return (
    <ul className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
      {MOCK_TEAM.map((member) => {
        const name = t(member.nameKey)
        const role = t(member.roleKey)
        return (
          <li key={member.src}>
            <img
              src={member.src}
              alt={`${name}, ${role}`}
              width={1024}
              height={1024}
              loading="lazy"
              className={PHOTO_CLASS}
            />
            <h3 className="mt-4 text-base font-bold text-gray-900">{name}</h3>
            <p className="text-2xs mt-1 font-bold tracking-widest text-gray-400 uppercase">
              {role}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

function HttpTeamList({ members, lang }: { members: PortalAboutMember[]; lang: string }) {
  return (
    <ul className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
      {members.map((member) => {
        const name = pickBilingual(member.name, lang)
        const role = pickBilingual(member.role, lang)
        return (
          <li key={member.id}>
            {member.photoUrl ? (
              <img
                src={member.photoUrl}
                alt={`${name}, ${role}`}
                width={1024}
                height={1024}
                loading="lazy"
                className={PHOTO_CLASS}
              />
            ) : null}
            <h3 className="mt-4 text-base font-bold text-gray-900">{name}</h3>
            <p className="text-2xs mt-1 font-bold tracking-widest text-gray-400 uppercase">
              {role}
            </p>
          </li>
        )
      })}
    </ul>
  )
}

function StandInNote({
  mock,
  meta,
  lang,
}: {
  mock: boolean
  meta: PortalAboutMeta | null
  lang: string
}) {
  const { t } = useTranslation()
  if (mock) {
    return (
      <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-500">
        {t('about.teamStandInNote')}
      </p>
    )
  }
  if (!meta?.standInVisible) return null
  return (
    <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-500">
      {pickBilingual(meta.standInNote, lang)}
    </p>
  )
}

const AboutTeamSection = () => {
  const { t, i18n } = useTranslation()
  const state = useAboutTeam()
  const lang = i18n.language
  const meta = state.status === 'ready' || state.status === 'empty' ? state.meta : null
  const deck =
    state.status === 'mock' || !meta
      ? t('about.teamDeck')
      : pickBilingual(meta.deck, lang) || t('about.teamDeck')

  return (
    <section className={SECTION_RULE}>
      <h2 className={SECTION_HEADING}>
        <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
        {t('about.ourTeam')}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed font-medium text-gray-500">{deck}</p>
      {state.status === 'mock' ? <MockTeamList /> : null}
      {state.status === 'loading' ? <TeamSkeleton /> : null}
      {state.status === 'empty' ? (
        <p className="mt-10 max-w-3xl text-sm leading-relaxed font-medium text-gray-500">
          {t('about.teamEmpty')}
        </p>
      ) : null}
      {state.status === 'error' ? (
        <div className="mt-10 max-w-3xl">
          <p className="text-sm leading-relaxed font-medium text-gray-500">
            {t('about.teamUnavailable')}
          </p>
          <button
            type="button"
            onClick={state.retry}
            className="mt-4 min-h-11 rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-gray-800 ring-1 ring-gray-200 transition hover:bg-gray-50"
          >
            {t('a11y.retry')}
          </button>
        </div>
      ) : null}
      {state.status === 'ready' ? <HttpTeamList members={state.members} lang={lang} /> : null}
      {state.status === 'mock' || state.status === 'ready' || state.status === 'empty' ? (
        <StandInNote mock={state.status === 'mock'} meta={meta} lang={lang} />
      ) : null}
    </section>
  )
}

export default AboutTeamSection
