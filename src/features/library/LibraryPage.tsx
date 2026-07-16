import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bookmark,
  Clock,
  Heart,
  Grid3X3,
  List,
  Search,
  Filter,
  SortAsc,
  Trash2,
  Play,
  Check,
  Edit3,
  CheckSquare,
  Square,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import { useData } from '../../context/DataContext'

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

  const [activeTab, setActiveTab] = useState<TabType>('bookmarks')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Library Items states to allow actual deletions
  const [bookmarksList, setBookmarksList] = useState<LibraryItem[]>([])
  const [historyList, setHistoryList] = useState<LibraryItem[]>([])
  const [likesList, setLikesList] = useState<LibraryItem[]>([])

  useEffect(() => {
    if (webtoons.length > 0) {
      const items = webtoons.slice(0, 6).map((w, i) => ({
        id: `lib-${i}`,
        webtoonId: w.id,
        title: w.title,
        coverImage: w.coverImage,
        coverColor: w.coverColor,
        lastReadEpisode: Math.floor(Math.random() * w.episodeCount),
        totalEpisodes: w.episodeCount,
        lastReadAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: Math.floor(Math.random() * 100),
      }))

      const histItems = webtoons.slice(2, 8).map((w, i) => ({
        id: `hist-${i}`,
        webtoonId: w.id,
        title: w.title,
        coverImage: w.coverImage,
        coverColor: w.coverColor,
        lastReadEpisode: Math.floor(Math.random() * w.episodeCount),
        totalEpisodes: w.episodeCount,
        lastReadAt: new Date(Date.now() - Math.random() * 3 * 24 * 60 * 60 * 1000).toISOString(),
        addedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        progress: Math.floor(Math.random() * 100),
      }))

      setBookmarksList(items)
      setHistoryList(histItems)
      setLikesList(items.slice(0, 4))
    }
  }, [webtoons])

  // Bulk edit states
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  // Custom modal states for premium feel
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessToast, setShowSuccessToast] = useState(false)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="border-primary-600 h-12 w-12 animate-spin rounded-full border-4 border-t-transparent" />
      </div>
    )
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
      setBookmarksList((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
    } else if (activeTab === 'history') {
      setHistoryList((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
    } else if (activeTab === 'likes') {
      setLikesList((prev) => prev.filter((item) => !selectedItems.includes(item.id)))
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

  return (
    <div className="min-h-screen bg-gray-50 pb-24 transition-colors duration-300 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 sm:text-3xl dark:text-white">
              {t('libraryPage.title')}
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
              {t('libraryPage.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsEditMode(!isEditMode)
                setSelectedItems([])
              }}
              className={`gap-2 ${isEditMode ? 'bg-primary-50 border-primary-300 text-primary-600 dark:bg-primary-950/20 dark:border-primary-800' : ''}`}
            >
              <Edit3 className="h-4 w-4" />
              <span>{isEditMode ? t('libraryPage.exitEdit') : t('libraryPage.editMode')}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 dark:border-white/10 dark:text-white"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t('libraryPage.filter')}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2 dark:border-white/10 dark:text-white"
            >
              <SortAsc className="h-4 w-4" />
              <span className="hidden sm:inline">{t('libraryPage.sort')}</span>
            </Button>
          </div>
        </div>

        {/* SEARCH & VIEWS */}
        <div className="mb-6 rounded-3xl border bg-white shadow-sm dark:border-white/5 dark:bg-gray-900">
          <div className="flex flex-col border-b border-gray-100 sm:flex-row sm:items-center dark:border-white/5">
            {/* TABS WITH SMOOTH SPRING UNDERLINE */}
            <div className="flex scrollbar-none overflow-x-auto">
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
                    activeTab === tab.id
                      ? 'text-primary-600 dark:text-primary-500'
                      : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="h-4.5 w-4.5" />
                  <span className="text-sm font-bold">{tab.label}</span>
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold dark:bg-white/10">
                    {tab.count}
                  </span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="bg-primary-600 dark:bg-primary-500 absolute right-0 bottom-0 left-0 h-0.5"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>
            {/* VIEW GRID/LIST TOGGLE */}
            <div className="flex items-center gap-2 border-t border-gray-100 px-4 py-2 sm:ml-auto sm:border-0 dark:border-white/5">
              <button
                type="button"
                title="Grid view"
                aria-label="Grid view"
                onClick={() => setViewMode('grid')}
                className={`rounded-xl p-2 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button
                type="button"
                title="List view"
                aria-label="List view"
                onClick={() => setViewMode('list')}
                className={`rounded-xl p-2 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* SEARCH FIELD */}
          <div className="p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-4.5 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder={t('libraryPage.searchPlaceholder')}
                aria-label={t('libraryPage.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-2xl border border-gray-200 py-3 pr-4 pl-12 text-sm font-medium transition focus:ring-1 dark:border-white/10 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* BULK EDIT SUB-BAR IF ANY COMPONENT IS ACTIVE IN DESKTOP */}
        {isEditMode && items.length > 0 && (
          <div className="bg-primary-50/50 dark:bg-primary-950/10 border-primary-100/30 mb-4 flex items-center justify-between rounded-2xl border px-5 py-3">
            <button
              onClick={handleSelectAll}
              className="text-primary-600 dark:text-primary-400 flex items-center gap-2 text-xs font-bold transition hover:opacity-80"
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
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
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
                      onClick={() => handleCardClick(item)}
                      className={`group relative flex flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 dark:border-white/5 dark:bg-gray-900 ${
                        isEditMode ? 'cursor-pointer select-none' : ''
                      } ${isSelected ? 'border-primary-500 ring-primary-500/20 ring-2' : ''}`}
                    >
                      {/* Checkbox HUD Overlay */}
                      {isEditMode && (
                        <div className="absolute top-3.5 left-3.5 z-20">
                          <div
                            className={`flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 shadow-md transition-all ${
                              isSelected
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-white bg-black/45 text-transparent'
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3.5]" />}
                          </div>
                        </div>
                      )}

                      {/* Image/Cover container */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.title[lang]}
                            className={`h-full w-full object-cover transition-transform duration-500 ${
                              isEditMode ? '' : 'group-hover:scale-105'
                            }`}
                          />
                        ) : (
                          <div
                            className={`h-full w-full ${item.coverColor} flex items-center justify-center`}
                          >
                            <span className="text-4xl font-black text-white opacity-40">
                              {item.title[lang].charAt(0)}
                            </span>
                          </div>
                        )}

                        {/* Hover Overlay */}
                        {!isEditMode && (
                          <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
                        )}

                        {/* Progress slider bar at the bottom */}
                        {item.progress > 0 && (
                          <div className="absolute right-0 bottom-0 left-0 h-1 bg-black/20 backdrop-blur-xs">
                            <div
                              className={`bg-primary-500 h-full transition-all duration-500 ${getProgressWidthClass(
                                item.progress
                              )}`}
                            />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="p-3.5">
                        <h3 className="truncate text-sm leading-tight font-bold text-gray-900 dark:text-white">
                          {item.title[lang]}
                        </h3>
                        <div className="mt-1.5 flex items-center justify-between">
                          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            Ep. {item.lastReadEpisode || 0}/{item.totalEpisodes}
                          </p>
                          {item.lastReadAt && (
                            <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                              {formatDate(item.lastReadAt)}
                            </p>
                          )}
                        </div>
                      </div>
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
                      onClick={() => handleCardClick(item)}
                      className={`group relative flex items-center gap-4 rounded-3xl border bg-white p-4 shadow-sm transition-all duration-300 dark:border-white/5 dark:bg-gray-900 ${
                        isEditMode ? 'cursor-pointer select-none' : ''
                      } ${isSelected ? 'border-primary-500 ring-primary-500/20 ring-2' : ''}`}
                    >
                      {/* Checkbox HUD Overlay */}
                      {isEditMode && (
                        <div className="flex-shrink-0">
                          <div
                            className={`flex h-6.5 w-6.5 items-center justify-center rounded-full border-2 transition-all ${
                              isSelected
                                ? 'border-primary-600 bg-primary-600 text-white'
                                : 'border-gray-300 text-transparent dark:border-white/20'
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5 stroke-[3.5]" />}
                          </div>
                        </div>
                      )}

                      {/* Card Thumbnail */}
                      <div
                        className={`h-22 w-16 flex-shrink-0 rounded-2xl ${item.coverColor} flex items-center justify-center overflow-hidden bg-gray-100 shadow-inner dark:bg-gray-800`}
                      >
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.title[lang]}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl font-black text-white opacity-40">
                            {item.title[lang].charAt(0)}
                          </span>
                        )}
                      </div>

                      {/* Info layout */}
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base leading-tight font-black text-gray-900 dark:text-white">
                          {item.title[lang]}
                        </h3>
                        <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {t('webtoon.episodes')} {item.lastReadEpisode || 0} of{' '}
                          {item.totalEpisodes}
                        </p>
                        <div className="mt-2.5 flex items-center gap-4">
                          {item.progress > 0 && (
                            <div className="max-w-[120px] flex-1">
                              <div className="h-1.5 rounded-full bg-gray-100 dark:bg-gray-800">
                                <div
                                  className={`bg-primary-500 h-full rounded-full transition-all duration-500 ${getProgressWidthClass(
                                    item.progress
                                  )}`}
                                />
                              </div>
                            </div>
                          )}
                          {item.lastReadAt && (
                            <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                              {formatDate(item.lastReadAt)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Chevron Link */}
                      {!isEditMode && (
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hidden gap-1 text-xs font-bold sm:flex"
                          >
                            <Play className="h-3.5 w-3.5 fill-current" />
                            {t('libraryPage.continueReading')}
                          </Button>
                          <div className="rounded-xl p-2 text-gray-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-gray-600 dark:group-hover:text-gray-300">
                            <ChevronRight className="h-5 w-5" />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* EMPTY STATE */}
            {items.length === 0 && (
              <div className="py-16 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                  {activeTab === 'bookmarks' && (
                    <Bookmark className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  )}
                  {activeTab === 'history' && (
                    <Clock className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  )}
                  {activeTab === 'likes' && (
                    <Heart className="h-8 w-8 text-gray-400 dark:text-gray-600" />
                  )}
                </div>
                <h3 className="mb-2 text-lg font-black text-gray-900 dark:text-white">
                  {t('libraryPage.noItems')}
                </h3>
                <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
                  {lang === 'mm'
                    ? 'စာရင်းသွင်းထားသော အပိုင်းများ မရှိသေးပါ။'
                    : 'Explore webtoons to fill your library.'}
                </p>
                <Button variant="primary" size="sm" onClick={() => navigate('/categories')}>
                  {t('categories.webtoons')}
                </Button>
              </div>
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
              className="fixed bottom-6 left-1/2 z-40 flex w-[90%] max-w-lg items-center justify-between gap-4 rounded-full border border-gray-200 bg-white/95 px-6 py-3.5 text-sm shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-gray-900/95"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase">
                  {t('libraryPage.title')}
                </span>
                <span className="font-extrabold text-gray-900 dark:text-white">
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
                  <Trash2 className="h-4 w-4" />
                  <span>{t('common.delete')}</span>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══════ PREMIUM CUSTOM CONFIRMATION DIALOG MODAL ═══════ */}
        <AnimatePresence>
          {showConfirmModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirmModal(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />

              {/* Dialog panel */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-gray-900"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/30 dark:text-red-400">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white">
                      {lang === 'mm' ? 'စုစည်းမှုမှ ဖယ်ရှားရန်' : 'Remove from Collection'}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed font-medium text-gray-500 dark:text-gray-400">
                      {t('libraryPage.deleteConfirm')}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 border-t border-gray-50 pt-4 dark:border-white/5">
                  <Button
                    variant="ghost"
                    onClick={() => setShowConfirmModal(false)}
                    className="px-4 py-2"
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    variant="danger"
                    onClick={confirmDelete}
                    className="px-5 py-2 font-bold shadow-lg shadow-red-500/15"
                  >
                    {t('common.delete')}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════ TOAST FEEDBACK OVERLAY BANNER ═══════ */}
        <AnimatePresence>
          {showSuccessToast && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              className="fixed bottom-6 left-1/2 z-[250] flex -translate-x-1/2 items-center gap-3.5 rounded-full border border-emerald-500 bg-emerald-600 px-6 py-3.5 text-white shadow-xl"
            >
              <div className="rounded-full bg-white/20 p-1">
                <Check className="h-4 w-4 stroke-[3]" />
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
