import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  Search,
  BookOpen,
  CreditCard,
  Shield,
  Settings,
  ChevronRight,
} from 'lucide-react'
import Input from '../../components/Input'

const HelpPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')

  const categories = [
    { icon: BookOpen, title: t('help.gettingStarted'), articles: 12 },
    { icon: CreditCard, title: t('help.payments'), articles: 8 },
    { icon: Shield, title: t('help.accountSecurity'), articles: 6 },
    { icon: Settings, title: t('help.appSettings'), articles: 10 },
  ]

  const popularArticles = [
    { title: t('help.article1'), category: t('help.gettingStarted') },
    { title: t('help.article2'), category: t('help.payments') },
    { title: t('help.article3'), category: t('help.accountSecurity') },
    { title: t('help.article4'), category: t('help.gettingStarted') },
    { title: t('help.article5'), category: t('help.appSettings') },
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
            {t('static.helpTitle')}
          </h1>

          <div className="mb-8">
            <Input
              placeholder={t('help.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-5 w-5" />}
            />
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>{t('help.browseByCategory')}</h2>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="hover:border-primary-300 hover:bg-primary-50/50 cursor-pointer rounded-xl border border-gray-200 p-4 transition-colors"
              >
                <cat.icon className="text-primary-600 mb-2 h-8 w-8" />
                <h3 className="font-semibold text-gray-900">{cat.title}</h3>
                <p className="text-sm text-gray-500">
                  {cat.articles} {t('help.articles')}
                </p>
              </div>
            ))}
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>{t('help.popularArticles')}</h2>
          </div>

          <div className="mb-8 space-y-2">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="hover:border-primary-300 flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-4 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{article.title}</h3>
                  <p className="text-sm text-gray-500">{article.category}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            ))}
          </div>

          <div className="prose prose-gray max-w-none">
            <h2>{t('help.needMore')}</h2>
            <p>{t('help.needMoreDesc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
