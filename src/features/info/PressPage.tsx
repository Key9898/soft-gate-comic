import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, Newspaper, Mic, Mail, Phone } from 'lucide-react'
import Button from '../../components/Button'

const PressPage = () => {
  const { t } = useTranslation()

  const pressReleases = [
    {
      date: 'December 15, 2025',
      title: 'Soft-Gate Comic Reaches 1 Million Active Readers',
      summary:
        'Soft-Gate Comic celebrates major milestone with growing community of webtoon enthusiasts.',
    },
    {
      date: 'November 1, 2025',
      title: 'Soft-Gate Comic Launches Creator Support Program',
      summary: 'New initiative provides resources and support for independent webtoon creators.',
    },
    {
      date: 'September 20, 2025',
      title: 'Soft-Gate Comic Expands to Southeast Asia',
      summary: 'Platform now available in Thailand, Vietnam, and Indonesia.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="hover:text-primary-600 mb-6 inline-flex items-center gap-2 text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            {t('static.pressTitle')}
          </h1>

          <p className="mb-8 text-lg text-gray-600">{t('press.intro')}</p>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <Newspaper className="text-primary-600 mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold text-gray-900">50+</p>
              <p className="text-sm text-gray-500">{t('press.articles')}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <Mic className="text-primary-600 mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold text-gray-900">20+</p>
              <p className="text-sm text-gray-500">{t('press.interviews')}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-4 text-center">
              <Mail className="text-primary-600 mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold text-gray-900">100+</p>
              <p className="text-sm text-gray-500">{t('press.mentions')}</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>{t('press.recentNews')}</h2>
          </div>

          <div className="mb-8 space-y-4">
            {pressReleases.map((release) => (
              <div key={release.title} className="border-primary-500 border-l-4 py-2 pl-4">
                <p className="text-sm text-gray-500">{release.date}</p>
                <h3 className="font-semibold text-gray-900">{release.title}</h3>
                <p className="mt-1 text-gray-600">{release.summary}</p>
              </div>
            ))}
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>{t('press.mediaKit')}</h2>
            <p>{t('press.mediaKitDesc')}</p>
          </div>

          <div className="mt-4 mb-8">
            <Button variant="outline">{t('press.downloadKit')}</Button>
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>{t('press.contact')}</h2>
          </div>

          <div className="flex flex-col gap-2">
            <p className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              press@softgatecomic.com
            </p>
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              +95 9 123 456 789
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PressPage
