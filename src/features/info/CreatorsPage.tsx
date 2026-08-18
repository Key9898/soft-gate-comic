import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BookOpen, FileImage, Send, Check, Sparkles } from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import { getInfoPageMeta } from '../../lib/info/pageMeta'

const ICON_WELL =
  'bg-primary-50 text-primary-600 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl'

const CreatorsPage = () => {
  const { t } = useTranslation()
  const page = getInfoPageMeta('creators', t)

  const steps = [
    { icon: BookOpen, title: t('creators.step1Title'), desc: t('creators.step1Desc') },
    { icon: FileImage, title: t('creators.step2Title'), desc: t('creators.step2Desc') },
    { icon: Send, title: t('creators.step3Title'), desc: t('creators.step3Desc') },
  ]

  const specs = [t('creators.spec1'), t('creators.spec2'), t('creators.spec3'), t('creators.spec4')]

  const lookFor = [t('creators.lookFor1'), t('creators.lookFor2'), t('creators.lookFor3')]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 pb-20">
      <SEO
        title={t('static.creatorsTitle')}
        description={t('info.deck.creators')}
        url="https://softgatecomic.com/creators"
      />
      <div className="radial-wash-primary pointer-events-none absolute top-0 left-1/2 h-[450px] w-full max-w-7xl -translate-x-1/2" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <Breadcrumb items={page.breadcrumbs} className="mb-6" />
        <PageHeader
          variant={page.header}
          eyebrow={page.eyebrow}
          title={page.title}
          deck={page.deck}
        />

        <section aria-labelledby="creators-how">
          <h2
            id="creators-how"
            className="text-lg font-bold tracking-wider text-gray-900 uppercase"
          >
            {t('creators.howItWorks')}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-gray-200/60 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className={ICON_WELL}>
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="text-2xs text-primary-500 font-bold tracking-widest uppercase">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold tracking-wider text-gray-900 uppercase">
              {t('creators.specsTitle')}
            </h2>
            <ul className="mt-5 space-y-3">
              {specs.map((spec) => (
                <li key={spec} className="flex items-start gap-3 text-sm text-gray-600">
                  <Check className="text-primary-500 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{spec}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-bold tracking-wider text-gray-900 uppercase">
              {t('creators.lookForTitle')}
            </h2>
            <ul className="mt-5 space-y-3">
              {lookFor.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-600">
                  <Sparkles className="text-primary-500 mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-12 max-w-3xl rounded-3xl border border-gray-200/60 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900">{t('creators.ctaTitle')}</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{t('creators.ctaDesc')}</p>
          <Link
            to="/contact"
            className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 mt-6 inline-block rounded-2xl px-6 py-2.5 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            {t('creators.ctaButton')}
          </Link>
          <p className="mt-4 text-xs leading-relaxed text-gray-400">{t('creators.legalNote')}</p>
        </section>
      </div>
    </div>
  )
}

export default CreatorsPage
