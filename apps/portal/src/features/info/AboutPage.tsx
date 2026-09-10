import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Award,
  BookOpen,
  CircleDollarSign,
  Compass,
  Globe,
  Sparkles,
  Target,
  Telescope,
  Users,
} from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import { buildOrganizationJsonLd } from '../../components/SEO/jsonLd'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import { AboutProvider } from './AboutDataContext'
import AboutHistorySection from './components/AboutHistorySection'
import AboutTeamSection from './components/AboutTeamSection'
import StoryBook from './components/StoryBook'
import { getInfoPageMeta } from '../../lib/info/pageMeta'
import { getPublishedStoryChapters } from '../../lib/info/storyChapters'

const ICON_WELL =
  'bg-primary-50 text-primary-600 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'

const SECTION_HEADING =
  'flex items-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase'

const SECTION_RULE = 'border-t border-gray-200/60 py-20'

const CARD = 'rounded-3xl border border-gray-200/60 bg-white shadow-sm'

const PRIMARY_CTA =
  'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 flex min-h-[44px] items-center justify-center rounded-2xl px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-primary-500/10 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const SECONDARY_CTA =
  'flex min-h-[44px] items-center justify-center rounded-2xl border border-gray-200 px-6 py-2.5 text-xs font-bold tracking-wider text-gray-700 uppercase transition hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:outline-none'

const FACTS = [
  { labelKey: 'about.factProductLabel', valueKey: 'about.factProductValue' },
  { labelKey: 'about.factStageLabel', valueKey: 'about.factStageValue' },
  { labelKey: 'about.factMarketLabel', valueKey: 'about.factMarketValue' },
  { labelKey: 'about.factLanguagesLabel', valueKey: 'about.factLanguagesValue' },
] as const

const AboutPage = () => {
  const { t } = useTranslation()
  const page = getInfoPageMeta('about', t)
  const prefersReducedMotion = useReducedMotion()

  const howItWorks = [
    { icon: BookOpen, title: t('about.howReadTitle'), desc: t('about.howReadDesc') },
    { icon: Globe, title: t('about.howLangTitle'), desc: t('about.howLangDesc') },
    { icon: CircleDollarSign, title: t('about.howCoinsTitle'), desc: t('about.howCoinsDesc') },
  ]

  const missionVision = [
    { icon: Target, title: t('about.ourMission'), desc: t('about.ourMissionDesc') },
    { icon: Telescope, title: t('about.ourVision'), desc: t('about.ourVisionDesc') },
  ]

  const coreValues = [
    { icon: Sparkles, title: t('about.valueQuality'), desc: t('about.valueQualityDesc') },
    { icon: Users, title: t('about.valueCommunity'), desc: t('about.valueCommunityDesc') },
    { icon: Award, title: t('about.valueCreators'), desc: t('about.valueCreatorsDesc') },
    { icon: Compass, title: t('about.valueInnovation'), desc: t('about.valueInnovationDesc') },
  ]

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20 transition-colors duration-300">
      <SEO
        title={t('about.whoWeAre')}
        description={t('info.deck.about')}
        path="/about"
        jsonLd={buildOrganizationJsonLd()}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[450px] overflow-hidden"
        aria-hidden
      >
        <div className="radial-wash-primary absolute top-0 left-1/2 h-full w-full max-w-7xl -translate-x-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <AboutProvider>
          <Breadcrumb items={page.breadcrumbs} className="mb-6" />
          <PageHeader
            variant="masthead"
            eyebrow={page.eyebrow}
            title={t('about.whoWeAre')}
            deck={page.deck}
          />

          <section className="mb-20">
            <dl className={`${CARD} grid gap-x-8 gap-y-6 p-8 sm:grid-cols-2 lg:grid-cols-4`}>
              {FACTS.map((fact) => (
                <div key={fact.labelKey}>
                  <dt className="text-2xs font-bold tracking-widest text-gray-400 uppercase">
                    {t(fact.labelKey)}
                  </dt>
                  <dd className="mt-1.5 text-sm font-semibold text-gray-900">{t(fact.valueKey)}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className={SECTION_RULE}>
            <h2 className={SECTION_HEADING}>
              <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
              {t('about.howItWorks')}
            </h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {howItWorks.map(({ icon: Icon, title, desc }) => (
                <div key={title} className={`${CARD} p-6`}>
                  <span className={ICON_WELL}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-5 text-base font-bold text-gray-900">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed font-medium text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={SECTION_RULE}>
            <h2 className={SECTION_HEADING}>
              <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
              {t('about.ourStory')}
            </h2>
            <p className="mt-3 text-sm leading-relaxed font-medium text-gray-500">
              {t('about.ourStoryDesc')}
            </p>
            <StoryBook chapters={getPublishedStoryChapters()} />
          </section>

          <AboutHistorySection />

          <section className={SECTION_RULE}>
            <div className="grid gap-6 sm:grid-cols-2">
              {missionVision.map(({ icon: Icon, title, desc }) => (
                <div key={title} className={`${CARD} p-8`}>
                  <span className={ICON_WELL}>
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h2 className="mt-5 text-lg font-bold text-balance text-gray-900">{title}</h2>
                  <p className="mt-3 text-sm leading-relaxed font-medium text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={SECTION_RULE}>
            <div className="mx-auto mb-12 max-w-xl text-center">
              <h2 className={`${SECTION_HEADING} justify-center`}>
                <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
                {t('about.ourValues')}
              </h2>
              <p className="mt-3 text-sm font-medium text-gray-500">{t('about.valuesDeck')}</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {coreValues.map((val) => (
                <motion.div
                  key={val.title}
                  whileHover={prefersReducedMotion ? undefined : { y: -3, scale: 1.01 }}
                  className={`${CARD} border-gray-100 p-6 transition-shadow duration-300 hover:shadow-md`}
                >
                  <div className="flex items-center gap-4">
                    <div className={ICON_WELL}>
                      <val.icon className="h-5.5 w-5.5 stroke-[2.2]" aria-hidden />
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{val.title}</h3>
                  </div>
                  <p className="mt-4 pl-1 text-sm leading-relaxed font-medium text-gray-500">
                    {val.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <AboutTeamSection />

          <section className={`${CARD} mt-12 p-8 text-center shadow-lg`}>
            <h2 className="text-lg font-bold tracking-wider text-balance text-gray-900 uppercase">
              {t('about.getInvolved')}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed font-medium text-gray-500">
              {t('about.getInvolvedDesc')}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/creators" className={PRIMARY_CTA}>
                {t('about.publishWithUs')}
              </Link>
              <Link to="/contact" className={SECONDARY_CTA}>
                {t('about.getInTouch')}
              </Link>
            </div>
          </section>
        </AboutProvider>
      </div>
    </div>
  )
}

export default AboutPage
