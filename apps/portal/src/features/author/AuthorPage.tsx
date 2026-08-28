import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutGrid, ListOrdered, Sparkles, UserCheck, UserPlus } from 'lucide-react'
import { CatalogBookCard } from '../../components/BookCard'
import Button from '../../components/Button'
import SearchAutocomplete from '../../components/SearchAutocomplete'
import SEO from '../../components/SEO/SEO'
import { buildBreadcrumbJsonLd, buildPersonJsonLd } from '../../components/SEO/jsonLd'
import { useData } from '../../context/DataContext'
import { useFollows } from '../../context/FollowsContext'
import { newestPublishedIds } from '../../lib/catalog'
import NotFoundPage from '../info/NotFoundPage'
import AuthorPageSkeleton from './components/AuthorPageSkeleton'

const DEST_LINK =
  'hover:border-primary-300 focus-visible:ring-primary-500 flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors focus-visible:ring-2 focus-visible:outline-none'

const DESTINATIONS = [
  { to: '/categories', labelKey: 'nav.categories', icon: LayoutGrid },
  { to: '/ranking', labelKey: 'home.ranking', icon: ListOrdered },
  { to: '/categories?sort=new', labelKey: 'home.newReleases', icon: Sparkles },
] as const

const AuthorPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language === 'mm' ? 'mm' : 'en'
  const { id } = useParams()
  const { authors, webtoons, genres, isLoading } = useData()
  const { isFollowing, toggleFollow } = useFollows()

  const author = authors.find((item) => item.id === id)
  const works = useMemo(() => {
    if (!author) return []
    return [...webtoons]
      .filter((webtoon) => webtoon.author.id === author.id && webtoon.status !== 'draft')
      .sort((a, b) => b.viewCount - a.viewCount)
  }, [author, webtoons])
  const newestIds = useMemo(() => newestPublishedIds(webtoons), [webtoons])
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [avatarLoaded, setAvatarLoaded] = useState(false)
  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }
  const handleImageError = (id: string) => {
    setFailedImages((prev) => {
      const next = new Set(prev)
      next.add(id)
      return next
    })
  }

  if (isLoading) {
    return <AuthorPageSkeleton />
  }

  if (!author) {
    return <NotFoundPage variant="author" />
  }

  const name = author.name[lang]
  const bio = author.bio?.[lang]
  const pageUrl = `https://softgatecomic.com/author/${author.id}`
  const following = isFollowing(author.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title={name}
        description={t('authorPage.seoDescription', { name })}
        path={`/author/${author.id}`}
        jsonLd={[
          buildPersonJsonLd({
            name,
            description: bio || t('authorPage.seoDescription', { name }),
            url: pageUrl,
          }),
          buildBreadcrumbJsonLd([
            { name: t('nav.home'), path: '/' },
            { name, path: `/author/${author.id}` },
          ]),
        ]}
      />
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-10 sm:flex-row sm:items-start sm:px-6 lg:px-8">
          {author.avatar ? (
            <div className="relative h-24 w-24 shrink-0">
              {!avatarLoaded ? (
                <div
                  className="shape-circle absolute inset-0 animate-pulse bg-gray-200"
                  aria-hidden="true"
                />
              ) : null}
              <img
                src={author.avatar}
                alt=""
                onLoad={() => setAvatarLoaded(true)}
                className={`shape-circle h-24 w-24 object-cover ${avatarLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          ) : (
            <div className="bg-primary-50 text-primary-700 shape-circle flex h-24 w-24 shrink-0 items-center justify-center text-3xl font-bold">
              {name.charAt(0)}
            </div>
          )}
          <div className="min-w-0 text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{name}</h1>
            {bio ? (
              <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">{bio}</p>
            ) : null}
            <p className="mt-3 text-sm font-semibold text-gray-500">
              {t('authorPage.seriesCount', { count: works.length })}
            </p>
            <div className="mt-4">
              <Button
                size="md"
                className="min-h-11"
                variant={following ? 'secondary' : 'primary'}
                leftIcon={
                  following ? (
                    <UserCheck className="h-4 w-4" aria-hidden />
                  ) : (
                    <UserPlus className="h-4 w-4" aria-hidden />
                  )
                }
                aria-pressed={following}
                onClick={() => toggleFollow(author.id)}
              >
                {following ? t('authorPage.following') : t('authorPage.follow')}
              </Button>
              <p className="mt-2 text-sm text-gray-500">{t('authorPage.followDemo')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-6 text-xl font-bold text-gray-900">{t('authorPage.works')}</h2>
          {works.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 md:grid-cols-4 lg:grid-cols-6">
              {works.map((webtoon) => (
                <Link
                  key={webtoon.id}
                  to={`/webtoon/${webtoon.id}`}
                  className="focus:ring-primary-500 block rounded-[3px] focus:ring-2 focus:ring-offset-2 focus:outline-none"
                >
                  <CatalogBookCard
                    webtoon={webtoon}
                    lang={lang}
                    genres={genres}
                    newestIds={newestIds}
                    imageLoaded={loadedImages.has(webtoon.id)}
                    imageFailed={failedImages.has(webtoon.id)}
                    onImageLoad={() => handleImageLoad(webtoon.id)}
                    onImageError={() => handleImageError(webtoon.id)}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl py-8 text-center">
              <p className="text-sm font-bold text-gray-500">{t('authorPage.noWorks')}</p>
              <div className="mt-6">
                <SearchAutocomplete className="mx-auto max-w-md" />
              </div>
              <div className="mt-8 w-full text-left">
                <h3 className="text-xs font-bold tracking-wider text-gray-400 uppercase">
                  {t('notFound.goHere')}
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {DESTINATIONS.map((item) => (
                    <Link key={item.to} to={item.to} className={DEST_LINK}>
                      <item.icon className="text-primary-500 h-4 w-4" aria-hidden />
                      {t(item.labelKey)}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default AuthorPage
