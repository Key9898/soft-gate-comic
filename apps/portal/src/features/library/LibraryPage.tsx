import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  BellOff,
  Bookmark,
  Clock,
  Heart,
  Grid3X3,
  List,
  Search,
  Trash2,
  Play,
  Check,
  Edit3,
  CheckSquare,
  Square,
  ChevronRight,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate, Link } from 'react-router-dom'
import Button from '../../components/Button'
import BookCard from '../../components/BookCard'
import SEO from '../../components/SEO/SEO'
import { useData } from '../../context/DataContext'
import { useLibrary } from '../../context/LibraryContext'
import { useEngagement } from '../../context/EngagementContext'
import { blendedProgressPercent } from '../../lib/engagement'
import LibraryEmptyState from './components/LibraryEmptyState'
import LibraryDeleteConfirmDialog from './components/LibraryDeleteConfirmDialog'
import LibraryPageSkeleton from './components/LibraryPageSkeleton'

type TabType = 'bookmarks' | 'history' | 'likes'
type ViewMode = 'grid' | 'list'

interface LibraryItem {
  id: string
  webtoonId: string
  title: { mm: string; en: string }
  coverImage?: string
  coverColor: string
  lastReadEpisode?: number
  totalEpisodes: number
  lastReadAt?: string
  addedAt: string
  progress: number
  notifyMuted?: boolean
}

const progressWidthClasses: Record<number, string> = {
  0: 'w-0',
  10: 'w-[10%]',
  20: 'w-[20%]',
  30: 'w-[30%]',
  40: 'w-[40%]',
  50: 'w-1/2',
  60: 'w-[60%]',
  70: 'w-[70%]',
  80: 'w-[80%]',
  90: 'w-[90%]',
  100: 'w-full',
}

const getProgressWidthClass = (progress: number): string => {
  const roundedProgress = Math.round(progress / 10) * 10
  return progressWidthClasses[roundedProgress] || `w-[${progress}%]`
}

const LibraryPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const navigate = useNavigate()

  const { webtoons, isLoading } = useData()
  const { bookmarks, removeBookmarks, setNotifyMuted } = useLibrary()
  const { history, likedWebtoonIds, removeHistory, removeLikes } = useEngagement()

  const [activeTab, setActiveTab] = useState<TabType>('bookmarks')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
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

  const bookmarksList = useMemo(() => {
    const byId = new Map(webtoons.map((w) => [w.id, w]))
    const items: LibraryItem[] = []
    for (const record of bookmarks) {
      const w = byId.get(record.webtoonId)
      if (!w) continue
      items.push({
        id: w.id,
        webtoonId: w.id,
        title: w.title,
        coverImage: w.coverImage,
        coverColor: w.coverColor,
        totalEpisodes: w.episodeCount,
        addedAt: record.addedAt,
        progress: 0,
        notifyMuted: record.notifyMuted,
      })
    }
    return items
  }, [bookmarks, webtoons])

  const historyList = useMemo(() => {
    const byId = new Map(webtoons.map((w) => [w.id, w]))
    const items: LibraryItem[] = []
    for (const record of history) {
      const w = byId.get(record.webtoonId)
      if (!w) continue
      const scrollRatio = record.scrollRatio ?? 0
      const progress = blendedProgressPercent(record.episodeNumber, w.episodeCount, scrollRatio)
      items.push({
        id: w.id,
        webtoonId: w.id,
        title: w.title,
        coverImage: w.coverImage,
        coverColor: w.coverColor,
        lastReadEpisode: record.episodeNumber,
        totalEpisodes: w.episodeCount,
        lastReadAt: record.lastReadAt,
        addedAt: record.lastReadAt,
        progress,
      })
    }
    return items
  }, [history, webtoons])

  const likesList = useMemo(() => {
    const byId = new Map(webtoons.map((w) => [w.id, w]))
    const items: LibraryItem[] = []
    for (const webtoonId of likedWebtoonIds) {
      const w = byId.get(webtoonId)
      if (!w) continue
      items.push({
        id: w.id,
        webtoonId: w.id,
        title: w.title,
        coverImage: w.coverImage,
        coverColor: w.coverColor,
        totalEpisodes: w.episodeCount,
        addedAt: new Date().toISOString(),
        progress: 0,
      })
    }
    return items
  }, [likedWebtoonIds, webtoons])

  // Bulk edit states
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Custom modal states for premium feel
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  if (isLoading) {
    return <LibraryPageSkeleton />
  }

  const getItemsList = () => {
    switch (activeTab) {
      case 'bookmarks':
        return bookmarksList
      case 'history':
        return historyList
      case 'likes':
        return likesList
      default:
        return []
    }
  }

  const items = getItemsList().filter((item) =>
    item.title[lang].toLowerCase().includes(searchQuery.toLowerCase())
  )

  const tabs = [
    {
      id: 'bookmarks' as TabType,
      label: t('libraryPage.bookmarks'),
      icon: Bookmark,
      count: bookmarksList.length,
    },
    {
      id: 'history' as TabType,
      label: t('libraryPage.history'),
      icon: Clock,
      count: historyList.length,
    },
    {
      id: 'likes' as TabType,
      label: t('libraryPage.likes'),
      icon: Heart,
      count: likesList.length,
    },
  ]

  const handleCardClick = (item: LibraryItem) => {
    if (isEditMode) {
      toggleSelect(item.id)
    } else {
      navigate(`/webtoon/${item.webtoonId}`)
    }
  }

  const toggleSelect = (id: string) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleSelectAll = () => {
    const allIds = items.map((item) => item.id)
    const isAllSelected = items.every((item) => selectedItems.includes(item.id))

    if (isAllSelected) {
      // Deselect all items of this active tab
      setSelectedItems((prev) => prev.filter((id) => !allIds.includes(id)))
    } else {
      // Select all items of this active tab
      setSelectedItems((prev) => {
        const unique = new Set([...prev, ...allIds])
        return Array.from(unique)
      })
    }
  }

  const handleDeleteSelected = () => {
    if (selectedItems.length === 0) return
    setShowConfirmModal(true)
  }

  const confirmDelete = () => {
    if (activeTab === 'bookmarks') {
      removeBookmarks(selectedItems)
    } else if (activeTab === 'history') {
      removeHistory(selectedItems)
    } else if (activeTab === 'likes') {
      removeLikes(selectedItems)
    }

    setSelectedItems([])
    setIsEditMode(false)
    setShowConfirmModal(false)

    // Trigger Success Toast
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return t('libraryPage.today')
    if (diffDays === 1) return t('libraryPage.yesterday')
    if (diffDays < 7) return `${diffDays} ${t('libraryPage.daysAgo')}`
    return date.toLocaleDateString(lang === 'mm' ? 'my-MM' : 'en-US', {
      month: 'short',
      day: 'numeric',
    })
  }

  const isAllSelected = items.length > 0 && items.every((item) => selectedItems.includes(item.id))

  const continueHref = (item: LibraryItem) => `/read/${item.webtoonId}/${item.lastReadEpisode || 1}`

  return (
    <div className="min-h-screen bg-gray-50 pb-24 transition-colors duration-300">
      <SEO title={t('libraryPage.title')} noindex />
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t('libraryPage.title')}
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500">{t('libraryPage.subtitle')}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditMode(!isEditMode)
                setSelectedItems([])
              }}
              className={`gap-2 ${isEditMode ? 'bg-primary-50 border-primary-300 text-primary-600' : ''}`}
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditMode ? t('libraryPage.exitEdit') : t('libraryPage.editMode')}</span>
            </Button>
          </div>
        </div>

        {/* SEARCH & VIEWS */}
        <div className="mb-6 rounded-3xl border bg-white shadow-sm">
          <div className="flex flex-col border-b border-gray-100 sm:flex-row sm:items-center">
            {/* TABS WITH SMOOTH SPRING UNDERLINE */}
            <div className="scrollbar-hide flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setSelectedItems([])
                    setIsEditMode(false)
                  }}
                  className={`relative flex min-h-[44px] items-center gap-2 px-6 py-4 whitespace-nowrap transition-colors focus:outline-none ${
                    activeTab === tab.id ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4.5 w-4.5" />
                  <span className="text-sm font-bold">{tab.label}</span>
                  <span className="text-2xs rounded-2xl bg-gray-100 px-2 py-0.5 font-bold">
                    {tab.count}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="bg-primary-600 absolute right-0 bottom-0 left-0 h-0.5"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
            {/* VIEW GRID/LIST TOGGLE */}
            <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-2 sm:ml-auto sm:border-0">
              <button
                type="button"
                title={t('libraryPage.gridView')}
                aria-label={t('libraryPage.gridView')}
                onClick={() => setViewMode('grid')}
                className={`rounded-2xl p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid3X3 className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                title={t('libraryPage.listView')}
                aria-label={t('libraryPage.listView')}
                onClick={() => setViewMode('list')}
                className={`rounded-2xl p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* SEARCH FIELD */}
          <div className="p-4">
            <div className="relative">
              <Search
                className="absolute top-1/2 left-4.5 h-5 w-5 -translate-y-1/2 text-gray-400"
                aria-hidden="true"
              />
              <input
                type="text"
                placeholder={t('libraryPage.searchPlaceholder')}
                aria-label={t('libraryPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-2xl border border-gray-200 py-3 pr-4 pl-12 text-sm font-medium transition focus:ring-1"
              />
            </div>
          </div>
        </div>

        {/* BULK EDIT SUB-BAR IF ANY COMPONENT IS ACTIVE IN DESKTOP */}
        {isEditMode && items.length > 0 && (
          <div className="bg-primary-50/50 border-primary-100/30 mb-4 flex items-center justify-between rounded-2xl border px-5 py-3">
            <button
              onClick={handleSelectAll}
              className="text-primary-600 flex items-center gap-2 text-xs font-bold transition hover:opacity-80"
            >
              {isAllSelected ? (
                <>
                  <CheckSquare className="h-4.5 w-4.5" />
                  <span>{t('libraryPage.deselectAll')}</span>
                </>
              ) : (
                <>
                  <Square className="h-4.5 w-4.5" />
                  <span>{t('libraryPage.selectAll')}</span>
                </>
              )}
            </button>
            <span className="text-xs font-bold text-gray-500">
              {t('libraryPage.itemsSelected', { count: selectedItems.length })}
            </span>
          </div>
        )}

        {/* CONTAINER GRID & LIST CARDS WITH TRANSITIONS */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab + viewMode + items.length}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {items.map((item) => {
                  const isSelected = selectedItems.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCardClick(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleCardClick(item)
                        }
                      }}
                      className={`group focus-visible:ring-primary-500 relative flex flex-col transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none ${
                        isEditMode ? 'cursor-pointer select-none' : 'cursor-pointer'
                      } ${isSelected ? 'ring-primary-500/30 rounded-[3px] ring-2 ring-offset-4' : ''}`}
                    >
                      {isEditMode && (
                        <div className="absolute top-2 left-2 z-20">
                          <div
                            className={`shape-circle flex h-6.5 w-6.5 items-center justify-center border-2 shadow-md transition-all ${
                              isSelected
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-white bg-black/45 text-transparent'
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 stroke-[3.5]" aria-hidden="true" />
                            )}
                          </div>
                        </div>
                      )}

                      <BookCard
                        coverImage={item.coverImage}
                        coverColor={item.coverColor}
                        title={item.title[lang]}
                        showCoverLabel={false}
                        progress={item.progress}
                        imageLoaded={loadedImages.has(item.webtoonId)}
                        imageFailed={failedImages.has(item.webtoonId)}
                        onImageLoad={() => handleImageLoad(item.webtoonId)}
                        onImageError={() => handleImageError(item.webtoonId)}
                        meta={
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-gray-500">
                              {t('libraryPage.epOfTotal', {
                                n: item.lastReadEpisode || 0,
                                total: item.totalEpisodes,
                              })}
                            </p>
                            {item.lastReadAt && (
                              <p className="text-2xs font-medium text-gray-400">
                                {formatDate(item.lastReadAt)}
                              </p>
                            )}
                          </div>
                        }
                      />
                      {activeTab === 'bookmarks' && !isEditMode ? (
                        <button
                          type="button"
                          data-testid="notify-mute"
                          className="absolute top-2 right-2 z-20 flex min-h-11 min-w-11 items-center justify-center rounded-2xl bg-white/90 text-gray-700 shadow-sm"
                          aria-label={
                            item.notifyMuted
                              ? t('webtoonDetail.notifyOff')
                              : t('webtoonDetail.notifyOn')
                          }
                          onClick={(event) => {
                            event.stopPropagation()
                            setNotifyMuted(item.webtoonId, !item.notifyMuted)
                          }}
                        >
                          {item.notifyMuted ? (
                            <BellOff className="h-4 w-4" aria-hidden="true" />
                          ) : (
                            <Bell className="h-4 w-4" aria-hidden="true" />
                          )}
                        </button>
                      ) : null}
                      {activeTab === 'history' && !isEditMode ? (
                        <Link
                          to={continueHref(item)}
                          onClick={(event) => event.stopPropagation()}
                          className="bg-primary-600 hover:bg-primary-700 focus-visible:ring-primary-500 mt-2 inline-flex min-h-11 items-center justify-center gap-1 rounded-2xl px-3 text-xs font-bold text-white focus-visible:ring-2 focus-visible:outline-none"
                        >
                          <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                          {t('libraryPage.continueReading')}
                        </Link>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const isSelected = selectedItems.includes(item.id)
                  return (
                    <div
                      key={item.id}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleCardClick(item)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          handleCardClick(item)
                        }
                      }}
                      className={`group focus-visible:ring-primary-500 relative flex items-center gap-4 rounded-3xl border bg-white p-4 shadow-sm transition-all duration-300 focus-visible:ring-2 focus-visible:outline-none ${
                        isEditMode ? 'cursor-pointer select-none' : ''
                      } ${isSelected ? 'border-primary-500 ring-primary-500/20 ring-2' : ''}`}
                    >
                      {/* Checkbox HUD Overlay */}
                      {isEditMode && (
                        <div className="flex-shrink-0">
                          <div
                            className={`shape-circle flex h-6.5 w-6.5 items-center justify-center border-2 transition-all ${
                              isSelected
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-gray-300 text-transparent'
                            }`}
                          >
                            {isSelected && (
                              <Check className="h-3.5 w-3.5 stroke-[3.5]" aria-hidden="true" />
                            )}
                          </div>
                        </div>
                      )}

                      {/* Card Thumbnail */}
                      <div
                        className={`book-media book-media-shadow h-22 w-16 flex-shrink-0 ${item.coverColor} flex items-center justify-center`}
                      >
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.title[lang]}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-bold text-white opacity-40">
                            {item.title[lang].charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Info layout */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base leading-tight font-bold text-gray-900">
                          {item.title[lang]}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-gray-500">
                          {t('webtoon.episodes')} {item.lastReadEpisode || 0} of{' '}
                          {item.totalEpisodes}
                        </p>
                        <div className="mt-2.5 flex items-center gap-4">
                          {item.progress > 0 && (
                            <div className="max-w-[120px] flex-1">
                              <div className="h-1.5 rounded-2xl bg-gray-100">
                                <div
                                  className={`bg-primary-500 h-full rounded-2xl transition-all duration-500 ${getProgressWidthClass(
                                    item.progress
                                  )}`}
                                />
                              </div>
                            </div>
                          )}
                          {item.lastReadAt && (
                            <span className="text-2xs font-semibold text-gray-400">
                              {formatDate(item.lastReadAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Chevron Link */}
                      {!isEditMode && (
                        <div className="flex items-center gap-2">
                          {activeTab === 'bookmarks' ? (
                            <button
                              type="button"
                              data-testid="notify-mute"
                              className="flex min-h-11 min-w-11 items-center justify-center rounded-2xl text-gray-500 hover:bg-gray-50"
                              aria-label={
                                item.notifyMuted
                                  ? t('webtoonDetail.notifyOff')
                                  : t('webtoonDetail.notifyOn')
                              }
                              onClick={(event) => {
                                event.stopPropagation()
                                setNotifyMuted(item.webtoonId, !item.notifyMuted)
                              }}
                            >
                              {item.notifyMuted ? (
                                <BellOff className="h-4 w-4" aria-hidden="true" />
                              ) : (
                                <Bell className="h-4 w-4" aria-hidden="true" />
                              )}
                            </button>
                          ) : null}
                          {activeTab === 'history' ? (
                            <Link
                              to={continueHref(item)}
                              onClick={(event) => event.stopPropagation()}
                              className="hover:bg-primary-50 text-primary-600 focus-visible:ring-primary-500 hidden min-h-11 items-center gap-1 rounded-2xl px-3 text-xs font-bold focus-visible:ring-2 focus-visible:outline-none sm:inline-flex"
                            >
                              <Play className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                              {t('libraryPage.continueReading')}
                            </Link>
                          ) : null}
                          <div className="rounded-2xl p-2 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-600">
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {items.length === 0 && (
              <LibraryEmptyState
                tab={activeTab}
                title={t('libraryPage.noItems')}
                description={t('libraryPage.emptyExplore')}
                ctaLabel={t('categories.webtoons')}
                onCtaClick={() => navigate('/categories')}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* ═══════ FLOATING STICKY EDIT CONTROL BAR (GLASSMORPHIC) ═══════ */}
        <AnimatePresence>
          {isEditMode && (
            <motion.div
              initial={{ y: 80, x: '-50%', opacity: 0 }}
              animate={{ y: 0, x: '-50%', opacity: 1 }}
              exit={{ y: 80, x: '-50%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-40 flex w-[90%] max-w-lg items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white/95 px-6 py-3.5 text-sm shadow-2xl backdrop-blur-md"
            >
              <div className="flex flex-col">
                <span className="text-2xs font-bold tracking-wider text-gray-400 uppercase">
                  {t('libraryPage.title')}
                </span>
                <span className="font-bold text-gray-900">
                  {t('libraryPage.itemsSelected', { count: selectedItems.length })}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditMode(false)
                    setSelectedItems([])
                  }}
                >
                  {t('common.cancel')}
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  disabled={selectedItems.length === 0}
                  onClick={handleDeleteSelected}
                  className="gap-1.5 shadow-md shadow-red-500/10"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  <span>{t('common.delete')}</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <LibraryDeleteConfirmDialog
          isOpen={showConfirmModal}
          title={t('libraryPage.removeFromCollection')}
          message={t('libraryPage.deleteConfirm')}
          cancelLabel={t('common.cancel')}
          confirmLabel={t('common.delete')}
          onCancel={() => setShowConfirmModal(false)}
          onConfirm={confirmDelete}
        />
        {/* ═══════ TOAST FEEDBACK OVERLAY BANNER ═══════ */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              role="status"
              className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 z-[250] flex -translate-x-1/2 items-center gap-3.5 rounded-2xl border border-emerald-500 bg-emerald-600 px-6 py-3.5 text-white shadow-xl"
            >
              <div className="rounded-2xl bg-white/20 p-1">
                <Check className="h-4 w-4 stroke-[3]" aria-hidden="true" />
              </div>
              <span className="text-sm font-bold tracking-wide">
                {t('libraryPage.deleteSuccess')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default LibraryPage
