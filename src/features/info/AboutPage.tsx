import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, useReducedMotion } from 'framer-motion'
import {
  Users,
  BookOpen,
  Globe,
  Heart,
  Sparkles,
  Award,
  Compass,
  Target,
  Telescope,
} from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import { buildOrganizationJsonLd } from '../../components/SEO/jsonLd'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import StoryBook from './components/StoryBook'
import { getInfoPageMeta } from '../../lib/info/pageMeta'
import { getPublishedStoryChapters } from '../../lib/info/storyChapters'

const ICON_WELL =
  'bg-primary-50 text-primary-600 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'

const AboutPage = () => {
  const { t } = useTranslation()
  const page = getInfoPageMeta('about', t)
  const prefersReducedMotion = useReducedMotion()

  const stats = [
    { icon: Users, value: t('about.statReadersValue'), label: t('about.readers') },
    { icon: BookOpen, value: t('about.statWebtoonsValue'), label: t('about.webtoons') },
    { icon: Globe, value: t('about.statFocusValue'), label: t('about.focusMarket') },
    { icon: Heart, value: t('about.statStageValue'), label: t('about.productStage') },
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
        title={t('about.ourStory')}
        description={t('about.ourStoryDesc')}
        url="https://softgatecomic.com/about"
        jsonLd={buildOrganizationJsonLd()}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[450px] overflow-hidden"
        aria-hidden
      >
        <div className="radial-wash-primary absolute top-0 left-1/2 h-full w-full max-w-7xl -translate-x-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader variant="masthead" eyebrow={page.eyebrow} title={page.title} deck={page.deck} />

        <section className="mb-20">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                whileHover={prefersReducedMotion ? undefined : { scale: 1.03, y: -4 }}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18, delay: idx * 0.08 }}
                className="rounded-3xl border border-gray-200/60 bg-white p-6 text-center shadow-md transition-shadow duration-300 hover:shadow-xl"
              >
                <div className={`${ICON_WELL} mx-auto mb-4`}>
                  <stat.icon className="h-5.5 w-5.5" aria-hidden />
                </div>
                <p className="text-2xl font-bold break-words text-gray-900 sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-2xs mt-1 font-bold tracking-widest text-gray-400 uppercase">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-200/60 py-20">
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase">
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('about.ourStory')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed font-medium text-gray-500">
            {t('about.ourStoryDesc')}
          </p>
          <StoryBook chapters={getPublishedStoryChapters()} />
        </section>

        <section className="border-t border-gray-200/60 py-20">
          <div className="grid gap-6 sm:grid-cols-2">
            {missionVision.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm"
              >
                <span className={ICON_WELL}>
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-5 text-lg font-bold text-balance text-gray-900">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed font-medium text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-gray-200/60 py-20">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="flex items-center justify-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase">
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
                className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
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

        <section className="mt-12 rounded-3xl border border-gray-200/60 bg-white p-8 text-center shadow-lg">
          <h2 className="text-lg font-bold tracking-wider text-balance text-gray-900 uppercase">
            {t('about.joinUs')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed font-medium text-gray-500">
            {t('about.joinUsDesc')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/creators"
              className="bg-primary-600 hover:bg-primary-700 shadow-primary-500/10 flex min-h-[44px] items-center justify-center rounded-2xl px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md transition"
            >
              {t('about.publishWithUs')}
            </Link>
            <Link
              to="/contact"
              className="flex min-h-[44px] items-center justify-center rounded-2xl border border-gray-200 px-6 py-2.5 text-xs font-bold tracking-wider text-gray-700 uppercase transition hover:bg-gray-50"
            >
              {t('about.getInTouch')}
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutPage
