import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, ZoomIn, ZoomOut, BookOpen, Settings } from 'lucide-react'

const TermsPage = () => {
  const { t } = useTranslation()

  // Readability configurations state
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base')
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans')
  const [readingTheme, setReadingTheme] = useState<'default' | 'sepia'>('default')
  const [activeId, setActiveId] = useState('')

  const sections = [
    { id: 'acceptance', label: t('static.acceptanceTerms') },
    { id: 'license', label: t('static.useLicense') },
    { id: 'permitted', label: t('static.permitted'), sub: true },
    { id: 'prohibited', label: t('static.prohibited'), sub: true },
    { id: 'accounts', label: t('static.userAccounts') },
    { id: 'intellectual', label: t('static.intellectualProperty') },
    { id: 'premium', label: t('static.premiumContent') },
    { id: 'termination', label: t('static.termination') },
    { id: 'limitation', label: t('static.limitation') },
    { id: 'governing', label: t('static.governingLaw') },
  ]

  // IntersectionObserver to scroll spy active headers
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting)
        if (visible) {
          setActiveId(visible.target.id)
        }
      },
      { rootMargin: '-10% 0px -75% 0px', threshold: 0 }
    )

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActiveId(id)
    }
  }

  // Sizing styles mapping
  const sizeClasses = {
    sm: 'text-xs sm:text-sm leading-relaxed',
    base: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed',
    xl: 'text-lg sm:text-xl leading-relaxed',
  }

  // Font family styles mapping
  const familyClasses = {
    sans: 'font-sans',
    serif: 'font-serif',
  }

  // Theme overrides mapping
  const themeClasses = {
    default:
      'bg-white dark:bg-gray-900 border-gray-100 dark:border-white/5 text-gray-800 dark:text-gray-200',
    sepia:
      'bg-[#fcf8f2] text-[#433422] border-[#eedece] dark:bg-[#1a140e] dark:text-[#eedecb] dark:border-amber-950/20',
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 pb-12 transition-colors duration-300 dark:bg-gray-950 ${familyClasses[fontFamily]}`}
    >
      <div className="mx-auto max-w-7xl px-4 py-8 text-left sm:px-6 lg:px-8">
        <Link
          to="/"
          className="hover:text-primary-600 mb-6 inline-flex items-center gap-2 text-xs font-black tracking-wider text-gray-500 uppercase transition-colors dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-4">
          {/* LEFT COLUMN: STICKY TOC SIDEBAR */}
          <div className="space-y-4 lg:sticky lg:top-6 lg:col-span-1">
            {/* Table of Contents Container */}
            <div className="rounded-3xl border bg-white p-5 shadow-sm dark:border-white/5 dark:bg-gray-900">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-wider text-gray-400 uppercase dark:text-gray-500">
                <BookOpen className="text-primary-500 h-4.5 w-4.5" />
                Table of Contents
              </h3>
              <nav className="max-h-[50vh] space-y-1 overflow-y-auto pr-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => handleScrollTo(sec.id)}
                    className={`flex w-full rounded-xl text-left transition-all ${
                      sec.sub ? 'pl-6 text-xs' : 'text-xs.5 pr-2 font-extrabold'
                    } py-2.5 ${
                      activeId === sec.id
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/10 font-extrabold'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white'
                    }`}
                  >
                    <span className="truncate">{sec.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Readability Customizer Controls container */}
            <div className="rounded-3xl border bg-white p-5 shadow-sm dark:border-white/5 dark:bg-gray-900">
              <h3 className="mb-4 flex items-center gap-2 text-xs font-black tracking-wider text-gray-400 uppercase dark:text-gray-500">
                <Settings className="text-primary-500 h-4.5 w-4.5" />
                Readability Controls
              </h3>
              <div className="space-y-4">
                {/* 1. Sizing Adjuster */}
                <div>
                  <label className="text-[10px] font-black tracking-wider text-gray-400 uppercase dark:text-gray-500">
                    Text Zoom
                  </label>
                  <div className="mt-1.5 flex items-center justify-between gap-1.5 rounded-xl bg-gray-50 p-1 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() =>
                        setFontSize(fontSize === 'xl' ? 'lg' : fontSize === 'lg' ? 'base' : 'sm')
                      }
                      disabled={fontSize === 'sm'}
                      className="flex min-h-[32px] flex-1 items-center justify-center rounded-lg hover:bg-gray-200 disabled:opacity-40 dark:hover:bg-white/5"
                    >
                      <ZoomOut className="h-4 w-4 text-gray-500" />
                    </button>
                    <span className="w-12 text-center text-[10px] font-black text-gray-800 uppercase dark:text-gray-200">
                      {fontSize === 'sm'
                        ? 'Small'
                        : fontSize === 'base'
                          ? 'Medium'
                          : fontSize === 'lg'
                            ? 'Large'
                            : 'X-Large'}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setFontSize(fontSize === 'sm' ? 'base' : fontSize === 'base' ? 'lg' : 'xl')
                      }
                      disabled={fontSize === 'xl'}
                      className="flex min-h-[32px] flex-1 items-center justify-center rounded-lg hover:bg-gray-200 disabled:opacity-40 dark:hover:bg-white/5"
                    >
                      <ZoomIn className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* 2. Typo family toggle */}
                <div>
                  <label className="text-[10px] font-black tracking-wider text-gray-400 uppercase dark:text-gray-500">
                    Font Style
                  </label>
                  <div className="mt-1.5 flex items-center justify-between gap-1.5 rounded-xl bg-gray-50 p-1 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() => setFontFamily('sans')}
                      className={`min-h-[32px] flex-1 rounded-lg text-xs font-black uppercase ${
                        fontFamily === 'sans'
                          ? 'text-primary-600 dark:text-primary-400 bg-white shadow-sm dark:bg-gray-800'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Sans
                    </button>
                    <button
                      type="button"
                      onClick={() => setFontFamily('serif')}
                      className={`min-h-[32px] flex-1 rounded-lg text-xs font-black uppercase ${
                        fontFamily === 'serif'
                          ? 'text-primary-600 dark:text-primary-400 bg-white shadow-sm dark:bg-gray-800'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Serif
                    </button>
                  </div>
                </div>

                {/* 3. Contrast warm sepia theme toggler */}
                <div>
                  <label className="text-[10px] font-black tracking-wider text-gray-400 uppercase dark:text-gray-500">
                    Contrast Mode
                  </label>
                  <div className="mt-1.5 flex items-center justify-between gap-1.5 rounded-xl bg-gray-50 p-1 dark:bg-white/5">
                    <button
                      type="button"
                      onClick={() => setReadingTheme('default')}
                      className={`min-h-[32px] flex-1 rounded-lg text-xs font-black uppercase ${
                        readingTheme === 'default'
                          ? 'text-primary-600 dark:text-primary-400 bg-white shadow-sm dark:bg-gray-800'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      System
                    </button>
                    <button
                      type="button"
                      onClick={() => setReadingTheme('sepia')}
                      className={`min-h-[32px] flex-1 rounded-lg text-xs font-black uppercase ${
                        readingTheme === 'sepia'
                          ? 'bg-amber-100 text-amber-800 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Sepia
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: MAIN PROSE TERMS SHEET */}
          <div className="lg:col-span-3">
            <div
              className={`rounded-3xl border p-6 shadow-sm transition-colors duration-300 sm:p-8 ${themeClasses[readingTheme]}`}
            >
              <h1 className="mb-2 text-2xl font-black sm:text-3xl">{t('static.termsTitle')}</h1>
              <p className="text-2xs mb-6 font-extrabold tracking-wider text-gray-400 uppercase">
                {t('static.lastUpdated')}: January 1, 2026
              </p>

              {/* Dynamic size, typography, and contrast mapping on prose text container */}
              <div
                className={`prose prose-gray dark:prose-invert max-w-none space-y-6 text-left ${sizeClasses[fontSize]}`}
              >
                <div>
                  <h2
                    id="acceptance"
                    className="border-gray-150 border-b pb-2 text-lg font-black dark:border-white/5 dark:text-white"
                  >
                    {t('static.acceptanceTerms')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.acceptanceTermsDesc')}</p>
                </div>

                <div>
                  <h2
                    id="license"
                    className="border-gray-150 border-b pb-2 text-lg font-black dark:border-white/5 dark:text-white"
                  >
                    {t('static.useLicense')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.useLicenseDesc')}</p>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="permitted" className="text-base font-black dark:text-white">
                    {t('static.permitted')}
                  </h3>
                  <ul className="mt-1.5 list-disc space-y-1.5 pl-5 font-semibold opacity-90">
                    <li>{t('static.permittedAccess')}</li>
                    <li>{t('static.permittedPersonal')}</li>
                    <li>{t('static.permittedDownload')}</li>
                  </ul>
                </div>

                <div className="border-primary-500/35 border-l-2 pl-4">
                  <h3 id="prohibited" className="text-base font-black dark:text-white">
                    {t('static.prohibited')}
                  </h3>
                  <ul className="mt-1.5 list-disc space-y-1.5 pl-5 font-semibold opacity-90">
                    <li>{t('static.prohibitedModify')}</li>
                    <li>{t('static.prohibitedCommercial')}</li>
                    <li>{t('static.prohibitedReverse')}</li>
                    <li>{t('static.prohibitedTransfer')}</li>
                  </ul>
                </div>

                <div>
                  <h2
                    id="accounts"
                    className="border-gray-150 border-b pb-2 text-lg font-black dark:border-white/5 dark:text-white"
                  >
                    {t('static.userAccounts')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.userAccountsDesc')}</p>
                </div>

                <div>
                  <h2
                    id="intellectual"
                    className="border-gray-150 border-b pb-2 text-lg font-black dark:border-white/5 dark:text-white"
                  >
                    {t('static.intellectualProperty')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">
                    {t('static.intellectualPropertyDesc')}
                  </p>
                </div>

                <div>
                  <h2
                    id="premium"
                    className="border-gray-150 border-b pb-2 text-lg font-black dark:border-white/5 dark:text-white"
                  >
                    {t('static.premiumContent')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.premiumContentDesc')}</p>
                </div>

                <div>
                  <h2
                    id="termination"
                    className="border-gray-150 border-b pb-2 text-lg font-black dark:border-white/5 dark:text-white"
                  >
                    {t('static.termination')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.terminationDesc')}</p>
                </div>

                <div>
                  <h2
                    id="limitation"
                    className="border-gray-150 border-b pb-2 text-lg font-black dark:border-white/5 dark:text-white"
                  >
                    {t('static.limitation')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.limitationDesc')}</p>
                </div>

                <div>
                  <h2
                    id="governing"
                    className="border-gray-150 border-b pb-2 text-lg font-black dark:border-white/5 dark:text-white"
                  >
                    {t('static.governingLaw')}
                  </h2>
                  <p className="mt-3 font-semibold opacity-90">{t('static.governingLawDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
