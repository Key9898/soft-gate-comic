import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  BookOpen,
  FileImage,
  Send,
  Check,
  Scale,
  CircleDollarSign,
  Globe,
  Library,
  ClipboardCheck,
  Share2,
  X,
} from 'lucide-react'
import { mockWebtoons } from '@softgate/shared'
import SEO from '../../components/SEO/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import BookCard from '../../components/BookCard'
import { getInfoPageMeta } from '../../lib/info/pageMeta'

const ICON_WELL =
  'bg-primary-50 text-primary-600 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'

const SECTION_HEADING =
  'flex items-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase'

const SECTION_RULE = 'border-t border-gray-200/60 py-20'

const CARD = 'rounded-3xl border border-gray-200/60 bg-white shadow-sm'

const PRIMARY_CTA =
  'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 flex min-h-[44px] items-center justify-center rounded-2xl px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-primary-500/10 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const TOC_LINK =
  'focus-visible:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-bold tracking-wider text-gray-700 uppercase transition hover:border-primary-300 hover:text-primary-700 focus-visible:ring-2 focus-visible:outline-none'

const FACTS = [
  { labelKey: 'creators.factPathLabel', valueKey: 'creators.factPathValue' },
  { labelKey: 'creators.factReadersLabel', valueKey: 'creators.factReadersValue' },
  { labelKey: 'creators.factLanguagesLabel', valueKey: 'creators.factLanguagesValue' },
  { labelKey: 'creators.factStageLabel', valueKey: 'creators.factStageValue' },
] as const

const SPECS = [
  { labelKey: 'creators.specArtLabel', valueKey: 'creators.specArtValue' },
  { labelKey: 'creators.specWidthLabel', valueKey: 'creators.specWidthValue' },
  { labelKey: 'creators.specColorLabel', valueKey: 'creators.specColorValue' },
  { labelKey: 'creators.specCoverLabel', valueKey: 'creators.specCoverValue' },
  { labelKey: 'creators.specLaunchLabel', valueKey: 'creators.specLaunchValue' },
  { labelKey: 'creators.specFilesLabel', valueKey: 'creators.specFilesValue' },
] as const

const PITCH = [
  'creators.pitch1',
  'creators.pitch2',
  'creators.pitch3',
  'creators.pitch4',
  'creators.pitch5',
] as const

const LOOK_FOR = ['creators.lookFor1', 'creators.lookFor2', 'creators.lookFor3'] as const

const DONT_SEND = [
  'creators.dont1',
  'creators.dont2',
  'creators.dont3',
  'creators.dont4',
  'creators.dont5',
] as const

const AFTER = [
  { titleKey: 'creators.after1Title', descKey: 'creators.after1Desc' },
  { titleKey: 'creators.after2Title', descKey: 'creators.after2Desc' },
  { titleKey: 'creators.after3Title', descKey: 'creators.after3Desc' },
] as const

const FAQ = [
  { qKey: 'creators.faq1Q', aKey: 'creators.faq1A' },
  { qKey: 'creators.faq2Q', aKey: 'creators.faq2A' },
  { qKey: 'creators.faq3Q', aKey: 'creators.faq3A' },
  { qKey: 'creators.faq4Q', aKey: 'creators.faq4A' },
  { qKey: 'creators.faq5Q', aKey: 'creators.faq5A' },
] as const

const EXAMPLE_IDS = ['1', '2', '3'] as const

const TOC = [
  { href: '/creators#creators-why', labelKey: 'creators.tocWhy' },
  { href: '/creators#creators-how', labelKey: 'creators.tocHow' },
  { href: '/creators#creators-examples', labelKey: 'creators.tocExamples' },
  { href: '/creators#creators-specs', labelKey: 'creators.tocSpecs' },
  { href: '/creators#creators-pitch', labelKey: 'creators.tocPitch' },
  { href: '/creators#creators-look', labelKey: 'creators.tocLook' },
  { href: '/creators#creators-after', labelKey: 'creators.tocAfter' },
  { href: '/creators#creators-rights', labelKey: 'creators.tocRights' },
  { href: '/creators#creators-faq', labelKey: 'creators.tocFaq' },
  { href: '/creators#creators-cta', labelKey: 'creators.tocCta' },
] as const

const CreatorsPage = () => {
  const { t, i18n } = useTranslation()
  const page = getInfoPageMeta('creators', t)
  const lang = i18n.language.startsWith('mm') ? 'mm' : 'en'
  const examples = EXAMPLE_IDS.map((id) => mockWebtoons.find((item) => item.id === id)).filter(
    (item): item is NonNullable<(typeof mockWebtoons)[number]> => Boolean(item)
  )

  const steps = [
    { icon: BookOpen, title: t('creators.step1Title'), desc: t('creators.step1Desc') },
    { icon: FileImage, title: t('creators.step2Title'), desc: t('creators.step2Desc') },
    { icon: Send, title: t('creators.step3Title'), desc: t('creators.step3Desc') },
  ]

  const whyCards = [
    { icon: Globe, title: t('creators.why1Title'), desc: t('creators.why1Desc') },
    { icon: Library, title: t('creators.why2Title'), desc: t('creators.why2Desc') },
    { icon: ClipboardCheck, title: t('creators.why3Title'), desc: t('creators.why3Desc') },
  ]

  return (
    <div className="relative min-h-screen bg-gray-50 pb-36">
      <SEO
        title={t('static.creatorsTitle')}
        description={t('info.deck.creators')}
        url="https://softgatecomic.com/creators"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[450px] overflow-hidden"
        aria-hidden
      >
        <div className="radial-wash-primary absolute top-0 left-1/2 h-full w-full max-w-7xl -translate-x-1/2" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 pb-16 text-left sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader
          variant={page.header}
          eyebrow={page.eyebrow}
          title={page.title}
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

        <nav aria-label={t('creators.tocLabel')} className="mb-8 flex flex-wrap gap-2">
          {TOC.map((item) => (
            <Link key={item.href} to={item.href} className={TOC_LINK}>
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <section className={SECTION_RULE} aria-labelledby="creators-why">
          <h2 id="creators-why" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('creators.whyTitle')}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed font-medium text-gray-500">
            {t('creators.whyDesc')}
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {whyCards.map((card) => (
              <div key={card.title} className={`${CARD} p-6`}>
                <span className={ICON_WELL}>
                  <card.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed font-medium text-gray-500">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={SECTION_RULE} aria-labelledby="creators-how">
          <h2 id="creators-how" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('creators.howItWorks')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className={`${CARD} p-6`}>
                <div className="flex items-center gap-3">
                  <span className={ICON_WELL}>
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-2xs text-primary-500 font-bold tracking-widest uppercase">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed font-medium text-gray-500">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className={SECTION_RULE} aria-labelledby="creators-examples">
          <h2 id="creators-examples" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('creators.examplesTitle')}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed font-medium text-gray-500">
            {t('creators.examplesNote')}
          </p>
          <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {examples.map((webtoon) => (
              <li key={webtoon.id}>
                <Link
                  to={`/webtoon/${webtoon.id}`}
                  className="focus-visible:ring-primary-500 block rounded-2xl focus-visible:ring-2 focus-visible:outline-none"
                >
                  <BookCard
                    coverImage={webtoon.coverImage}
                    coverColor={webtoon.coverColor}
                    title={webtoon.title[lang]}
                    showCoverLabel={false}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={SECTION_RULE} aria-labelledby="creators-specs">
          <h2 id="creators-specs" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('creators.specsTitle')}
          </h2>
          <div className="mt-8 grid grid-cols-1 items-end gap-8 sm:grid-cols-2">
            <div>
              <div className="book-media book-media-shadow relative aspect-[3/4] w-40 max-w-full bg-gray-200">
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-500">
                  {t('creators.specVisualCover')}
                </span>
              </div>
              <p className="mt-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                {t('creators.specCoverLabel')}
              </p>
            </div>
            <div>
              <p className="text-2xs mb-2 font-bold tracking-widest text-gray-400 uppercase">
                {t('creators.specVisualWidth')}
              </p>
              <div className="w-24 border-x-2 border-t-2 border-gray-300 px-1 pt-1">
                <div className="space-y-1">
                  <div className="h-10 rounded-sm bg-gray-100" />
                  <div className="h-14 rounded-sm bg-gray-100" />
                  <div className="h-8 rounded-sm bg-gray-100" />
                  <div className="h-12 rounded-sm bg-gray-100" />
                </div>
              </div>
              <p className="mt-3 text-xs font-bold tracking-wider text-gray-400 uppercase">
                {t('creators.specVisualStrip')}
              </p>
            </div>
          </div>
          <dl className={`${CARD} mt-8 grid gap-x-8 gap-y-6 p-8 sm:grid-cols-2`}>
            {SPECS.map((spec) => (
              <div key={spec.labelKey}>
                <dt className="text-2xs font-bold tracking-widest text-gray-400 uppercase">
                  {t(spec.labelKey)}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-gray-900">{t(spec.valueKey)}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500">
            {t('creators.specFootnote')}
          </p>
        </section>

        <section className={SECTION_RULE} aria-labelledby="creators-pitch">
          <h2 id="creators-pitch" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('creators.pitchTitle')}
          </h2>
          <ul className={`${CARD} mt-8 max-w-3xl space-y-3 p-8`}>
            {PITCH.map((key) => (
              <li key={key} className="flex items-start gap-3 text-sm text-gray-600">
                <Check className="text-primary-500 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span>{t(key)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500">
            {t('creators.pitchOptional')}
          </p>
        </section>

        <section className={SECTION_RULE} aria-labelledby="creators-look">
          <h2 id="creators-look" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('creators.lookForTitle')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ul className={`${CARD} space-y-3 p-8`}>
              {LOOK_FOR.map((key) => (
                <li key={key} className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="text-primary-500 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{t(key)}</span>
                </li>
              ))}
            </ul>
            <div className={`${CARD} p-8`}>
              <h3 className="text-base font-bold text-gray-900">{t('creators.dontTitle')}</h3>
              <ul className="mt-4 space-y-3">
                {DONT_SEND.map((key) => (
                  <li key={key} className="flex items-start gap-3 text-sm text-gray-600">
                    <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" aria-hidden />
                    <span>{t(key)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={SECTION_RULE} aria-labelledby="creators-after">
          <h2 id="creators-after" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('creators.afterTitle')}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed font-medium text-gray-500">
            {t('creators.afterDeck')}
          </p>
          <ol className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {AFTER.map((item, index) => (
              <li key={item.titleKey} className={`${CARD} p-6`}>
                <span className="text-2xs text-primary-500 font-bold tracking-widest uppercase">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-gray-900">{t(item.titleKey)}</h3>
                <p className="mt-2 text-sm leading-relaxed font-medium text-gray-500">
                  {t(item.descKey)}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className={SECTION_RULE} aria-labelledby="creators-rights">
          <h2 id="creators-rights" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('creators.rightsTitle')}
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className={`${CARD} p-8`}>
              <span className={ICON_WELL}>
                <Scale className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-bold text-gray-900">
                {t('creators.rightsIpTitle')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed font-medium text-gray-500">
                {t('creators.rightsIpDesc')}
              </p>
            </div>
            <div className={`${CARD} p-8`}>
              <span className={ICON_WELL}>
                <CircleDollarSign className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-bold text-gray-900">
                {t('creators.rightsPayTitle')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed font-medium text-gray-500">
                {t('creators.rightsPayDesc')}
              </p>
            </div>
            <div className={`${CARD} p-8`}>
              <span className={ICON_WELL}>
                <Share2 className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-5 text-base font-bold text-gray-900">
                {t('creators.rightsSimulTitle')}
              </h3>
              <p className="mt-3 text-sm leading-relaxed font-medium text-gray-500">
                {t('creators.rightsSimulDesc')}
              </p>
            </div>
          </div>
        </section>

        <section className={SECTION_RULE} aria-labelledby="creators-faq">
          <h2 id="creators-faq" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {t('creators.faqTitle')}
          </h2>
          <dl className="mt-8 max-w-3xl space-y-6">
            {FAQ.map((item) => (
              <div key={item.qKey} className={`${CARD} p-6`}>
                <dt className="text-sm font-bold text-gray-900">{t(item.qKey)}</dt>
                <dd className="mt-2 text-sm leading-relaxed font-medium text-gray-500">
                  {t(item.aKey)}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section id="creators-cta" className={SECTION_RULE}>
          <div className={`${CARD} p-8`}>
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-gray-900">{t('creators.ctaTitle')}</h2>
              <p className="mt-3 text-sm leading-relaxed font-medium text-gray-500">
                {t('creators.ctaDesc')}
              </p>
              <Link to="/contact?intent=submit" className={`${PRIMARY_CTA} mt-6 w-fit`}>
                {t('creators.ctaButton')}
              </Link>
              <p className="mt-4 text-xs leading-relaxed text-gray-400">
                {t('creators.legalNote')}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-gray-400">
                {t('creators.ctaInbox')} <span translate="no">support@softgatecomic.com</span>
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 pr-20 sm:px-6 lg:px-8">
          <p className="hidden text-sm font-medium text-gray-600 sm:block">
            {t('creators.ctaTitle')}
          </p>
          <Link to="/contact?intent=submit" className={`${PRIMARY_CTA} ml-auto`}>
            {t('creators.ctaButton')}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CreatorsPage
