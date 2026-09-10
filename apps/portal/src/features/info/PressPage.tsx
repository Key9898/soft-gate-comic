import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Copy, Download, Mail } from 'lucide-react'
import SEO from '../../components/SEO/SEO'
import { buildOrganizationJsonLd } from '../../components/SEO/jsonLd'
import Breadcrumb from '../../components/Breadcrumb'
import PageHeader from '../../components/PageHeader'
import { getInfoPageMeta } from '../../lib/info/pageMeta'
import { pickPressText, usePress } from '../../lib/press'

const SECTION_HEADING =
  'flex items-center gap-2 text-xl font-bold tracking-wider text-balance text-gray-900 uppercase'

const SECTION_RULE = 'border-t border-gray-200/60 py-20'

const CARD = 'rounded-3xl border border-gray-200/60 bg-white shadow-sm'

const PRIMARY_CTA =
  'bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold tracking-wider text-white uppercase shadow-md shadow-primary-500/10 transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

const TOC_LINK =
  'focus-visible:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl border border-gray-200 bg-white px-3 text-xs font-bold tracking-wider text-gray-700 uppercase transition hover:border-primary-300 hover:text-primary-700 focus-visible:ring-2 focus-visible:outline-none'

const BODY = 'mt-3 max-w-3xl text-sm leading-relaxed font-medium text-gray-500'

const PRESS_EMAIL = 'press@softgatecomic.com'
const PRESS_SITE = 'https://softgatecomic.com'
const KIT_ZIP = '/press-kit/softgate-comic-press-kit.zip'

const TOC = [
  { href: '/press#press-about', labelKey: 'press.tocAbout' },
  { href: '/press#press-facts', labelKey: 'press.tocFacts' },
  { href: '/press#press-news', labelKey: 'press.tocNews' },
  { href: '/press#press-kit', labelKey: 'press.tocKit' },
  { href: '/press#press-images', labelKey: 'press.tocImages' },
  { href: '/press#press-desk', labelKey: 'press.tocDesk' },
  { href: '/press#press-contact', labelKey: 'press.tocContact' },
] as const

const FACTS = [
  { labelKey: 'press.factLegalNameLabel', valueKey: 'press.factLegalNameValue' },
  { labelKey: 'press.factProductLabel', valueKey: 'press.factProductValue' },
  { labelKey: 'press.factStageLabel', valueKey: 'press.factStageValue' },
  { labelKey: 'press.factMarketLabel', valueKey: 'press.factMarketValue' },
  { labelKey: 'press.factHqLabel', valueKey: 'press.factHqValue' },
  { labelKey: 'press.factFoundedLabel', valueKey: 'press.factFoundedValue' },
  { labelKey: 'press.factPlatformsLabel', valueKey: 'press.factPlatformsValue' },
  { labelKey: 'press.factLanguagesLabel', valueKey: 'press.factLanguagesValue' },
  { labelKey: 'press.factWebsiteLabel', valueKey: 'press.factWebsiteValue', href: PRESS_SITE },
] as const

const BRAND_ASSETS = [
  { nameKey: 'press.assetLogoSvg', file: '/logo/logo.svg', format: 'SVG' },
  { nameKey: 'press.assetLogoPng', file: '/logo/logo.png', format: 'PNG' },
  { nameKey: 'press.assetIconPng', file: '/favicon/icon-512.png', format: 'PNG' },
] as const

const PALETTE = [
  { hex: '#0e9494', labelKey: 'press.palettePrimary' },
  { hex: '#69c9ca', labelKey: 'press.paletteLetter' },
  { hex: '#ee3968', labelKey: 'press.paletteAccent' },
  { hex: '#ef4124', labelKey: 'press.paletteSpark' },
  { hex: '#010101', labelKey: 'press.paletteInk' },
] as const

const STILLS = [
  { src: '/press-kit/still-home.png', titleKey: 'press.stillHome' },
  { src: '/press-kit/still-hub.png', titleKey: 'press.stillHub' },
  { src: '/press-kit/still-reader.png', titleKey: 'press.stillReader' },
] as const

const USAGE_DO = ['press.usageDo1', 'press.usageDo2', 'press.usageDo3'] as const
const USAGE_DONT = ['press.usageDont1', 'press.usageDont2', 'press.usageDont3'] as const

function pressOrganizationJsonLd(email: string): Record<string, unknown> {
  return {
    ...buildOrganizationJsonLd(),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'press',
      email,
    },
  }
}

const PressPage = () => {
  const { t, i18n } = useTranslation()
  const page = getInfoPageMeta('press', t)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle')
  const live = usePress()
  const lang = i18n.language.startsWith('mm') ? 'mm' : 'en'
  const txt = (key: string, fallbackKey: string) =>
    live?.copy[key] ? pickPressText(live.copy[key], lang) : t(fallbackKey)

  const boilerplate = txt('boilerplate', 'press.boilerplate')
  const pressEmail = live?.contactEmail || PRESS_EMAIL
  const kitZip = live?.zipUrl || KIT_ZIP
  const founderName = live?.spokesperson
    ? pickPressText(live.spokesperson.name, lang)
    : t('about.teamFounderName')
  const founderRole = live?.spokesperson
    ? pickPressText(live.spokesperson.role, lang)
    : t('about.teamFounderRole')
  const founderPhoto = live?.spokesperson?.photoUrl || '/about/team/team-founder.jpg'
  const showSpokespersonPerson = !live || Boolean(live.spokesperson)

  const facts = live
    ? live.facts.map((fact) => ({
        key: fact.key,
        label: pickPressText(fact.label, lang),
        value: pickPressText(fact.value, lang),
        href: fact.href,
      }))
    : FACTS.map((fact) => ({
        key: fact.labelKey,
        label: t(fact.labelKey),
        value: t(fact.valueKey),
        href: 'href' in fact ? fact.href : undefined,
      }))

  const assets = live
    ? live.assets.map((asset) => ({
        name: pickPressText(asset.name, lang),
        file: asset.url,
        format: asset.format,
      }))
    : BRAND_ASSETS.map((asset) => ({
        name: t(asset.nameKey),
        file: asset.file,
        format: asset.format,
      }))

  const palette = live
    ? live.palette.map((swatch) => ({
        hex: swatch.hex,
        label: pickPressText(swatch.label, lang),
      }))
    : PALETTE.map((swatch) => ({ hex: swatch.hex, label: t(swatch.labelKey) }))

  const usageDo = live
    ? ['usageDo1', 'usageDo2', 'usageDo3'].map((key) =>
        live.copy[key] ? pickPressText(live.copy[key], lang) : t(`press.${key}`)
      )
    : USAGE_DO.map((key) => t(key))
  const usageDont = live
    ? ['usageDont1', 'usageDont2', 'usageDont3'].map((key) =>
        live.copy[key] ? pickPressText(live.copy[key], lang) : t(`press.${key}`)
      )
    : USAGE_DONT.map((key) => t(key))

  const stills = live
    ? live.stills.map((still) => ({
        src: still.imageUrl,
        title: pickPressText(still.title, lang),
        demoBadge: still.demoBadge,
      }))
    : STILLS.map((still) => ({ src: still.src, title: t(still.titleKey), demoBadge: true }))

  const newsRows = live
    ? live.news.map((item) => ({
        id: item.id,
        title: pickPressText(item.title, lang),
        body: pickPressText(item.body, lang),
        href: item.href,
        demoBadge: item.demoBadge,
      }))
    : null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(boilerplate)
      setCopyState('copied')
      window.setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('failed')
    }
  }

  const liveMessage =
    copyState === 'copied' ? t('press.copied') : copyState === 'failed' ? t('press.copyFailed') : ''

  return (
    <div className="relative min-h-screen bg-gray-50 pb-20">
      <SEO
        title={t('static.pressTitle')}
        description={t('info.deck.press')}
        path="/press"
        jsonLd={pressOrganizationJsonLd(pressEmail)}
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

        <nav aria-label={t('press.tocLabel')} className="mb-8 flex flex-wrap gap-2">
          {TOC.map((item) => (
            <Link key={item.href} to={item.href} className={TOC_LINK}>
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <section className={SECTION_RULE} aria-labelledby="press-about">
          <h2 id="press-about" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {txt('boilerplateTitle', 'press.boilerplateTitle')}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed font-medium text-gray-600">
            {boilerplate}
          </p>
          <button
            type="button"
            onClick={() => void handleCopy()}
            className="link mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
          >
            <Copy className="h-4 w-4" aria-hidden />
            {t('press.copy')}
          </button>
          <p
            aria-live="polite"
            className={liveMessage ? 'mt-2 max-w-3xl text-sm font-medium text-gray-600' : 'sr-only'}
          >
            {liveMessage}
          </p>
          {copyState === 'failed' ? (
            <textarea
              readOnly
              value={boilerplate}
              rows={6}
              className="mt-4 w-full max-w-3xl rounded-2xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-700"
            />
          ) : null}
        </section>

        <section className={SECTION_RULE} aria-labelledby="press-facts">
          <h2 id="press-facts" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {txt('factSheet', 'press.factSheet')}
          </h2>
          <dl className={`${CARD} mt-8 grid gap-x-8 gap-y-6 p-8 sm:grid-cols-2 lg:grid-cols-3`}>
            {facts.map((fact) => (
              <div key={fact.key}>
                <dt className="text-2xs font-bold tracking-widest text-gray-400 uppercase">
                  {fact.label}
                </dt>
                <dd className="mt-1.5 text-sm font-semibold text-gray-900">
                  {fact.href ? (
                    <a href={fact.href} className="link">
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section className={SECTION_RULE} aria-labelledby="press-news">
          <h2 id="press-news" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {txt('newsTitle', 'press.newsTitle')}
          </h2>
          <p className={BODY}>{txt('newsIntro', 'press.newsIntro')}</p>
          <div className={`${CARD} mt-8 overflow-x-auto`}>
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200/60">
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold tracking-wider text-gray-500 uppercase"
                  >
                    {t('press.newsColStatus')}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold tracking-wider text-gray-500 uppercase"
                  >
                    {t('press.newsColItem')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {newsRows && newsRows.length > 0 ? (
                  newsRows.map((row) => (
                    <tr key={row.id}>
                      <td className="px-6 py-5 align-top">
                        {row.demoBadge ? (
                          <span className="inline-flex rounded-2xl bg-amber-50 px-2 py-1 text-xs font-bold tracking-wider text-amber-800 uppercase">
                            {t('common.demo')}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900">
                          {row.href ? (
                            <a href={row.href} className="link">
                              {row.title}
                            </a>
                          ) : (
                            row.title
                          )}
                        </p>
                        <p className="mt-1 leading-relaxed text-gray-500">{row.body}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-5 align-top">
                      <span className="inline-flex rounded-2xl bg-amber-50 px-2 py-1 text-xs font-bold tracking-wider text-amber-800 uppercase">
                        {t('common.demo')}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-900">
                        {txt('newsSlotTitle', 'press.newsSlotTitle')}
                      </p>
                      <p className="mt-1 leading-relaxed text-gray-500">
                        {txt('newsSlotCopy', 'press.newsSlotCopy')}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className={SECTION_RULE} aria-labelledby="press-kit">
          <h2 id="press-kit" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {txt('mediaKit', 'press.mediaKit')}
          </h2>
          <p className={BODY}>{txt('mediaKitDesc', 'press.mediaKitDesc')}</p>
          <a href={kitZip} download className={`${PRIMARY_CTA} mt-8`}>
            <Download className="h-4 w-4" aria-hidden />
            {txt('downloadZip', 'press.downloadZip')}
          </a>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-500">
            {txt('zipHint', 'press.zipHint')}
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {assets.map((asset) => (
              <div key={asset.file} className={`${CARD} flex flex-col p-6`}>
                <div className="bg-primary-50 flex h-28 items-center justify-center rounded-2xl p-4">
                  <img src={asset.file} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="mt-4 flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-gray-900">{asset.name}</p>
                  <span className="text-2xs rounded-2xl bg-gray-100 px-2 py-1 font-bold tracking-wider text-gray-500 uppercase">
                    {asset.format}
                  </span>
                </div>
                <a
                  href={asset.file}
                  download
                  className="link mt-3 inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold"
                >
                  <Download className="h-4 w-4" aria-hidden />
                  {txt('download', 'press.download')}
                </a>
              </div>
            ))}
          </div>

          <h3 className="mt-12 text-sm font-bold tracking-wider text-gray-900 uppercase">
            {txt('paletteTitle', 'press.paletteTitle')}
          </h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {palette.map((swatch) => (
              <li key={swatch.hex} className={`${CARD} overflow-hidden`}>
                <div className="h-16" style={{ backgroundColor: swatch.hex }} aria-hidden />
                <div className="p-4">
                  <p className="text-sm font-bold text-gray-900">{swatch.label}</p>
                  <p className="mt-1 font-mono text-xs tracking-wide text-gray-500" translate="no">
                    {swatch.hex}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <h3 className="mt-12 text-sm font-bold tracking-wider text-gray-900 uppercase">
            {txt('usageTitle', 'press.usageTitle')}
          </h3>
          <div className="mt-4 grid max-w-3xl gap-8 sm:grid-cols-2">
            <div>
              <p className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                {txt('usageDoTitle', 'press.usageDoTitle')}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed font-medium text-gray-500">
                {usageDo.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                {txt('usageDontTitle', 'press.usageDontTitle')}
              </p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed font-medium text-gray-500">
                {usageDont.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-gray-500">
            {txt('trademark', 'press.trademark')}
          </p>
        </section>

        <section className={SECTION_RULE} aria-labelledby="press-images">
          <h2 id="press-images" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {txt('screenshotsTitle', 'press.screenshotsTitle')}
          </h2>
          <p className={BODY}>{txt('stillsNote', 'press.stillsNote')}</p>
          {stills.length === 0 ? null : (
            <ul className="mt-8 grid gap-6 sm:grid-cols-3">
              {stills.map((still) => (
                <li key={still.src} className={`${CARD} overflow-hidden`}>
                  <img
                    src={still.src}
                    alt={still.title}
                    className="aspect-[16/10] w-full object-cover object-top"
                  />
                  <div className="flex items-start justify-between gap-3 p-5">
                    <h3 className="text-sm font-bold text-gray-900">{still.title}</h3>
                    {still.demoBadge ? (
                      <span className="inline-flex shrink-0 rounded-2xl bg-amber-50 px-2 py-1 text-xs font-bold tracking-wider text-amber-800 uppercase">
                        {t('common.demo')}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className={SECTION_RULE} aria-labelledby="press-desk">
          <h2 id="press-desk" className={SECTION_HEADING}>
            <span className="bg-primary-500 shape-circle h-2.5 w-2.5" />
            {txt('spokespersonTitle', 'press.spokespersonTitle')}
          </h2>
          <div
            className={`${CARD} mt-8 flex max-w-xl flex-col gap-6 p-6 sm:flex-row sm:items-start`}
          >
            {showSpokespersonPerson ? (
              <img
                src={founderPhoto}
                alt={`${founderName}, ${founderRole}`}
                width={160}
                height={160}
                className="aspect-square w-40 shrink-0 rounded-2xl object-cover object-top"
              />
            ) : null}
            <div>
              {showSpokespersonPerson ? (
                <>
                  <h3 className="text-base font-bold text-gray-900">{founderName}</h3>
                  <p className="text-2xs mt-1 font-bold tracking-widest text-gray-400 uppercase">
                    {founderRole}
                  </p>
                </>
              ) : null}
              <p className="mt-3 text-sm font-semibold text-gray-900">
                {txt('deskBadge', 'press.deskBadge')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                {txt('deskNote', 'press.deskNote')}
              </p>
              <a href={`mailto:${pressEmail}`} className={`${PRIMARY_CTA} mt-5`}>
                {txt('interviewCta', 'press.interviewCta')}
              </a>
            </div>
          </div>
        </section>

        <section className={SECTION_RULE} aria-labelledby="press-contact">
          <div className={`${CARD} p-8 text-left`}>
            <div className="bg-primary-50 text-primary-600 mb-4 flex h-12 w-12 items-center justify-center rounded-2xl">
              <Mail className="h-6 w-6" aria-hidden />
            </div>
            <h2 id="press-contact" className="text-xl font-bold text-balance text-gray-900">
              {txt('contact', 'press.contact')}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-600">
              {txt('contactDesc', 'press.contactDesc')}
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-500">
              {txt('contactHours', 'press.contactHours')}
            </p>
            <a href={`mailto:${pressEmail}`} className={`${PRIMARY_CTA} mt-6`}>
              <span translate="no">{pressEmail}</span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              {txt('otherInquiries', 'press.otherInquiries')}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-6">
              <Link
                to="/about"
                className="link inline-flex min-h-11 items-center text-sm font-semibold"
              >
                {t('footer.about')}
              </Link>
              <Link
                to="/contact"
                className="link inline-flex min-h-11 items-center text-sm font-semibold"
              >
                {t('footer.contact')}
              </Link>
              <Link
                to="/creators"
                className="link inline-flex min-h-11 items-center text-sm font-semibold"
              >
                {t('footer.creators')}
              </Link>
            </div>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-gray-400">
            {txt('updated', 'press.updated')}
          </p>
        </section>
      </div>
    </div>
  )
}

export default PressPage
