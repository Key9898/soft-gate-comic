import { useState, useEffect, useId, useMemo, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Coins,
  Gift,
  History,
  Check,
  Shield,
  Clock,
  Sparkles,
  Copy,
  ArrowLeft,
  AlertCircle,
  CreditCard,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'
import SEO from '../../components/SEO/SEO'
import { useWallet } from '../../context/WalletContext'
import { useData } from '../../context/DataContext'
import useScrollLock from '../../hooks/useScrollLock'
import useFocusTrap from '../../hooks/useFocusTrap'
import { Skeleton, SkeletonText } from '../../components/Skeleton'
import { packagesFromBlob, type CoinPackage } from './components/coinData'
import CoinPackageCard from './components/CoinPackageCard'
import TransactionHistoryRow from './components/TransactionHistoryRow'

type PaymentMethod = 'mmqr' | 'kbzpay' | 'wavepay' | 'aplus' | 'cbpay' | 'card'

const CoinsPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const prefersReducedMotion = useReducedMotion()
  const { balance, transactions, demoTopUp, unlockedEpisodeKeys } = useWallet()
  const { webtoons, isLoading, coinPackages: blobPackages } = useData()
  const shopPackages = useMemo(() => packagesFromBlob(blobPackages), [blobPackages])

  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState<'buy' | 'history'>('buy')

  // Wallet payment state
  const [walletPhone, setWalletPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')

  // Credit Card payment state
  const [cardNumber, setCardNumber] = useState('')
  const [cardHolder, setCardHolder] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [isCardFlipped, setIsCardFlipped] = useState(false)

  // QR timer countdown state
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [qrCopied, setQrCopied] = useState(false)

  const wizardRef = useRef<HTMLDivElement>(null)
  const wizardTitleId = useId()

  useScrollLock(showPaymentModal)
  useFocusTrap(wizardRef, showPaymentModal)

  useEffect(() => {
    if (!showPaymentModal) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        setShowPaymentModal(false)
        setSelectedPackage(null)
        setSelectedPaymentMethod(null)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [showPaymentModal, isProcessing])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(lang === 'mm' ? 'my-MM' : 'en-US').format(price) + ' MMK'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(lang === 'mm' ? 'my-MM' : 'en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Handle countdown security timer
  useEffect(() => {
    let timer: any
    if (showPaymentModal && selectedPaymentMethod === 'mmqr') {
      setTimeLeft(300)
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [showPaymentModal, selectedPaymentMethod])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? '0' : ''}${s}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '')
    setWalletPhone(value)
    if (value && !value.startsWith('09')) {
      setPhoneError(t('coinsPage.phoneStart09'))
    } else if (value && value.length < 9) {
      setPhoneError(t('coinsPage.phoneTooShort'))
    } else if (value && value.length > 11) {
      setPhoneError(t('coinsPage.phoneTooLong'))
    } else {
      setPhoneError('')
    }
  }

  const isPhoneValid =
    walletPhone.startsWith('09') && walletPhone.length >= 9 && walletPhone.length <= 11

  const handleBackToMethods = () => {
    setSelectedPaymentMethod(null)
    setWalletPhone('')
    setCardNumber('')
    setCardHolder('')
    setCardExpiry('')
    setCardCvv('')
  }

  const handlePurchase = () => {
    if (!selectedPackage || !selectedPaymentMethod) return

    setIsProcessing(true)

    setTimeout(() => {
      void (async () => {
        try {
          const totalCoins = selectedPackage.coins + (selectedPackage.bonus || 0)
          await demoTopUp(
            totalCoins,
            lang === 'mm'
              ? `Demo top-up ${totalCoins} ဒင်္ဂါး`
              : `Demo top-up ${totalCoins} coins (${selectedPaymentMethod})`
          )
          setShowPaymentModal(false)
          setShowSuccess(true)
          setSelectedPackage(null)
          setSelectedPaymentMethod(null)
          setWalletPhone('')
          setCardNumber('')
          setCardHolder('')
          setCardExpiry('')
          setCardCvv('')
          setTimeout(() => setShowSuccess(false), 4000)
        } finally {
          setIsProcessing(false)
        }
      })()
    }, 800)
  }

  const handleCopyMerchant = () => {
    navigator.clipboard.writeText('DEMO-TXN-8472910')
    setQrCopied(true)
    setTimeout(() => setQrCopied(false), 2000)
  }

  // Generate coin elements for the success falling rain animation
  const coinsRainArray = useMemo(() => {
    return Array.from({ length: 45 }).map((_, idx) => ({
      id: idx,
      x: Math.random() * 100, // vw left position
      delay: Math.random() * 2, // delay in seconds
      duration: 1.5 + Math.random() * 1.5, // speed in seconds
      size: 16 + Math.random() * 24, // width/height size in px
      rotate: Math.random() * 360,
    }))
  }, [])

  const unlockedEpisodes = useMemo(() => {
    const byId = new Map(webtoons.map((webtoon) => [webtoon.id, webtoon]))
    return unlockedEpisodeKeys
      .map((key) => {
        const sep = key.lastIndexOf(':')
        if (sep <= 0) return null
        const webtoonId = key.slice(0, sep)
        const episodeNumber = Number(key.slice(sep + 1))
        if (!Number.isFinite(episodeNumber)) return null
        const webtoon = byId.get(webtoonId)
        if (!webtoon) return null
        return { key, webtoonId, episodeNumber, title: webtoon.title }
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
  }, [unlockedEpisodeKeys, webtoons])

  return (
    <div className="min-h-screen bg-gray-50 pb-12 transition-colors duration-300">
      <SEO title={t('coinsPage.title')} noindex />
      <style>{`
        @keyframes shimmer-sweep {
          0% { transform: translateX(-150%) rotate(45deg); }
          50% { transform: translateX(150%) rotate(45deg); }
          100% { transform: translateX(150%) rotate(45deg); }
        }
        .animate-shimmer-sweep {
          animation: shimmer-sweep 3.5s infinite linear;
        }
        .gold-glow {
          box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.35), 0 8px 10px -6px rgba(245, 158, 11, 0.35);
        }
        .accent-glow {
          box-shadow: 0 10px 25px -5px color-mix(in srgb, var(--color-accent-600) 35%, transparent),
            0 8px 10px -6px color-mix(in srgb, var(--color-accent-600) 35%, transparent);
        }
        .spark-glow {
          box-shadow: 0 10px 25px -5px color-mix(in srgb, var(--color-spark-500) 35%, transparent),
            0 8px 10px -6px color-mix(in srgb, var(--color-spark-500) 35%, transparent);
        }
        .metal-bronze {
          background: linear-gradient(135deg, rgba(146, 64, 14, 0.1) 0%, rgba(120, 53, 4, 0.05) 100%);
          border-color: #b45309;
        }
        .metal-silver {
          background: linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(75, 85, 99, 0.05) 100%);
          border-color: #9ca3af;
        }
        .metal-gold {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%);
          border-color: #fbbf24;
        }
        .metal-ruby {
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-accent-600) 10%, transparent) 0%,
            color-mix(in srgb, var(--color-accent-700) 5%, transparent) 100%
          );
          border-color: var(--color-accent-600);
        }
        .metal-platinum {
          background: linear-gradient(
            135deg,
            color-mix(in srgb, var(--color-primary-600) 10%, transparent) 0%,
            color-mix(in srgb, var(--color-spark-500) 5%, transparent) 100%
          );
          border-color: var(--color-primary-600);
        }
        .metal-obsidian {
          background: linear-gradient(135deg, rgba(55, 65, 81, 0.15) 0%, rgba(17, 24, 39, 0.1) 50%, rgba(3, 7, 18, 0.05) 100%);
          border-color: #4b5563;
        }
        .card-3d-wrapper {
          width: 100%;
          height: 180px;
          perspective: 1000px;
        }
        .card-3d-inner {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          transform-style: preserve-3d;
        }
        .card-3d-flipped {
          transform: rotateY(180deg);
        }
        .card-front, .card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          border-radius: 1rem;
          padding: 1.25rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
        }
        .card-back {
          transform: rotateY(180deg);
        }
      `}</style>

      {/* ═══════ SUCCESS GOLD COINS RAIN ═══════ */}
      {showSuccess && !prefersReducedMotion && (
        <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
          {coinsRainArray.map((coin) => (
            <motion.div
              key={coin.id}
              initial={{ y: -50, x: `${coin.x}vw`, opacity: 1, rotate: coin.rotate }}
              animate={{ y: '110vh', rotate: coin.rotate + 360, opacity: 0.2 }}
              transition={{
                duration: coin.duration,
                delay: coin.delay,
                ease: 'linear',
                repeat: 0,
              }}
              className="absolute"
              style={{ width: coin.size, height: coin.size }}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-full w-full fill-amber-400 text-amber-600 shadow-md"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <circle
                  cx="12"
                  cy="12"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <path
                  d="M12 8v8M10 10h4M10 14h4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.div>
          ))}
        </div>
      )}

      {/* ═══════ HEADER BALANCE CARD ═══════ */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="sr-only">{t('coinsPage.title')}</h1>
        <div className="max-w-4xl">
          <div className="from-primary-600 to-primary-800 relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br p-6 text-white shadow-xl sm:p-8">
            <div className="shape-circle absolute top-0 right-0 h-48 w-48 bg-white/5 blur-2xl" />
            <div className="bg-accent-500/10 shape-circle absolute bottom-0 left-0 h-36 w-36 blur-xl" />

            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-primary-100 text-sm font-semibold tracking-wider uppercase">
                  {t('coinsPage.yourBalance')} · {t('coinsPage.demoLabel')}
                </p>
                <p className="text-2xs mt-1 inline-flex rounded-2xl bg-amber-400/20 px-2 py-0.5 font-bold tracking-wide text-amber-200 uppercase">
                  {t('coinsPage.demoTopUpBadge')}
                </p>
                <div className="mt-2 flex items-center gap-3.5">
                  <Coins className="h-10 w-10 animate-pulse text-amber-300" aria-hidden="true" />
                  <span className="text-5xl font-bold tracking-tight sm:text-6xl">{balance}</span>
                </div>
                <p className="text-primary-200/90 mt-3 text-sm">{t('coinsPage.useCoinsDesc')}</p>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl bg-black/20 p-4 backdrop-blur-md">
                <div className="text-primary-100 flex items-center gap-2.5 text-sm font-semibold">
                  <Shield className="h-4.5 w-4.5 text-emerald-400" />
                  {t('coinsPage.headerDemo')}
                </div>
                <div className="text-primary-100 flex items-center gap-2.5 text-sm font-semibold">
                  <Clock className="h-4.5 w-4.5 text-sky-400" aria-hidden="true" />
                  {t('coinsPage.headerLocalCredit')}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <section className="rounded-3xl border bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">{t('coinsPage.howItWorks')}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm font-medium text-gray-600">
                <li>{t('coinsPage.howSeed')}</li>
                <li>{t('coinsPage.howTopUp')}</li>
                <li>{t('coinsPage.howUnlock')}</li>
              </ul>
            </section>
            <section className="rounded-3xl border bg-white p-5 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">
                {t('coinsPage.unlockedEpisodes')}
              </h2>
              {isLoading && unlockedEpisodeKeys.length > 0 ? (
                <ul
                  className="mt-3 space-y-2"
                  data-testid="coins-unlocked-pending"
                  aria-busy="true"
                  aria-label={t('a11y.loading')}
                >
                  {unlockedEpisodeKeys.map((key) => (
                    <li key={key} className="flex min-h-11 items-center justify-between gap-3 px-2">
                      <SkeletonText className="w-2/3" />
                      <Skeleton className="h-3 w-16 shrink-0" />
                    </li>
                  ))}
                </ul>
              ) : unlockedEpisodes.length === 0 ? (
                <p className="mt-3 text-sm font-medium text-gray-500">
                  {t('coinsPage.unlockedEmpty')}
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {unlockedEpisodes.map((item) => (
                    <li key={item.key}>
                      <Link
                        to={`/webtoon/${item.webtoonId}`}
                        className="focus-visible:ring-primary-500 flex min-h-11 items-center justify-between gap-3 rounded-2xl px-2 text-sm font-bold text-gray-800 hover:bg-gray-50 focus-visible:ring-2 focus-visible:outline-none"
                      >
                        <span className="truncate">{item.title[lang]}</span>
                        <span className="shrink-0 text-xs font-semibold text-gray-500">
                          {t('coinsPage.unlockedEpisode', { n: item.episodeNumber })}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          {/* ═══════ TABS ═══════ */}
          <div className="mb-6 rounded-2xl border bg-white p-1.5 shadow-sm">
            <div className="flex">
              <button
                onClick={() => setActiveTab('buy')}
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-bold transition-all ${
                  activeTab === 'buy'
                    ? 'bg-primary-500 shadow-primary-500/25 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <Coins className="h-4.5 w-4.5" aria-hidden="true" />
                {t('coinsPage.demoTopUp')}
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`flex min-h-[44px] flex-1 items-center justify-center gap-2.5 rounded-2xl px-6 py-3 text-sm font-bold transition-all ${
                  activeTab === 'history'
                    ? 'bg-primary-500 shadow-primary-500/25 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <History className="h-4.5 w-4.5" />
                {t('coinsPage.transactionHistory')}
              </button>
            </div>
          </div>

          {/* ═══════ MAIN CONTENT PANELS ═══════ */}
          <AnimatePresence mode="wait">
            {activeTab === 'buy' ? (
              <motion.div
                key="buy"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Coin Packages Grid */}
                {shopPackages.length === 0 ? (
                  <p className="rounded-3xl border bg-white p-6 text-sm text-gray-600 shadow-sm">
                    {t('coinsPage.emptyShop')}
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {shopPackages.map((pkg) => (
                      <CoinPackageCard
                        key={pkg.id}
                        pkg={pkg}
                        prefersReducedMotion={prefersReducedMotion}
                        popularLabel={t('coinsPage.popular')}
                        bestValueLabel={t('coinsPage.bestValue')}
                        bonusLabel={t('coinsPage.bonus')}
                        priceLabel={formatPrice(pkg.price)}
                        perCoinLabel={t('coinsPage.perCoin', {
                          amount: Math.round(pkg.price / pkg.coins),
                        })}
                        onSelect={(selected) => {
                          setSelectedPackage(selected)
                          setSelectedPaymentMethod(null)
                          setShowPaymentModal(true)
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Instructions Bar */}
                <div className="rounded-3xl border bg-white p-6 shadow-sm">
                  <h3 className="mb-5 text-base font-bold text-gray-900">{t('coinsPage.title')}</h3>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                    {[
                      {
                        icon: <Coins className="h-6 w-6" aria-hidden="true" />,
                        title: t('coinsPage.buyCoins'),
                        description: t('coinsPage.selectPaymentMethod'),
                        color: 'bg-amber-100 text-amber-600',
                      },
                      {
                        icon: <Sparkles className="h-6 w-6" aria-hidden="true" />,
                        title: t('webtoonDetail.episodes'),
                        description: t('coinsPage.useCoinsDesc'),
                        color: 'bg-primary-100 text-primary-600',
                      },
                      {
                        icon: <Gift className="h-6 w-6" aria-hidden="true" />,
                        title: t('coinsPage.bonus'),
                        description: t('coinsPage.bonusCoins'),
                        color: 'bg-emerald-100 text-emerald-600',
                      },
                    ].map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div
                          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${item.color} shadow-sm`}
                        >
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-950">{item.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-gray-500">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
              >
                <div className="overflow-hidden rounded-3xl border bg-white shadow-sm">
                  <div className="divide-y divide-gray-100">
                    {transactions.map((txn) => (
                      <TransactionHistoryRow
                        key={txn.id}
                        transaction={{
                          id: txn.id,
                          type: txn.type,
                          amount: txn.amount,
                          description: txn.description,
                          balance: txn.balance,
                          createdAt: txn.createdAt,
                        }}
                        formattedDate={formatDate(txn.createdAt)}
                        balanceLabel={t('coinsPage.balance')}
                      />
                    ))}
                  </div>

                  {transactions.length === 0 && (
                    <div className="py-16 text-center">
                      <History className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                      <p className="text-gray-500">{t('libraryPage.noItems')}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ═══════ WIZARD MODAL ═══════ */}
        <AnimatePresence>
          {showPaymentModal && selectedPackage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!isProcessing) {
                    setShowPaymentModal(false)
                    setSelectedPackage(null)
                    setSelectedPaymentMethod(null)
                  }
                }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              />

              {/* Modal Card */}
              <motion.div
                ref={wizardRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={wizardTitleId}
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative z-10 flex max-h-[85dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border bg-white shadow-2xl"
              >
                {/* Header info */}
                <div className="from-primary-600 to-primary-800 bg-gradient-to-r p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-primary-200 text-2xs font-bold tracking-wider uppercase">
                        {t('coinsPage.demoTopUp')}
                      </span>
                      <h3 id={wizardTitleId} className="mt-1 text-lg font-bold">
                        {selectedPackage.coins.toLocaleString()} {t('coins.coins')}
                      </h3>
                      {selectedPackage.bonus && (
                        <p className="text-xs font-semibold text-emerald-300">
                          +{selectedPackage.bonus} {t('coinsPage.bonusCoins')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-primary-200 text-2xs font-bold tracking-wider uppercase">
                        {t('coinsPage.totalPrice')}
                      </span>
                      <p className="mt-1 text-2xl font-bold">
                        {formatPrice(selectedPackage.price)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress breadcrumbs wizard */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`shape-circle text-2xs flex h-5 w-5 items-center justify-center font-bold ${
                        selectedPaymentMethod === null
                          ? 'bg-primary-600 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {selectedPaymentMethod === null ? (
                        '1'
                      ) : (
                        <Check className="h-3 w-3" aria-hidden="true" />
                      )}
                    </div>
                    <span
                      className={`text-xs font-bold ${selectedPaymentMethod === null ? 'text-primary-600' : 'text-gray-500'}`}
                    >
                      {t('coinsPage.stepSelectMethod')}
                    </span>
                  </div>

                  <div className="h-px w-8 bg-gray-300" />

                  <div className="flex items-center gap-1.5">
                    <div
                      className={`shape-circle text-2xs flex h-5 w-5 items-center justify-center font-bold ${
                        selectedPaymentMethod !== null
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      2
                    </div>
                    <span
                      className={`text-xs font-bold ${selectedPaymentMethod !== null ? 'text-primary-600' : 'text-gray-400'}`}
                    >
                      {t('coinsPage.stepEnterDetails')}
                    </span>
                  </div>
                </div>

                {/* Persistent demo honesty banner */}
                <div className="flex items-start gap-2 border-b border-amber-200/60 bg-amber-50 px-6 py-2.5">
                  <AlertCircle
                    className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-600"
                    aria-hidden="true"
                  />
                  <p className="text-xs font-semibold text-amber-800">
                    {t('coinsPage.demoCheckoutNote')}
                  </p>
                </div>

                {/* Content Box */}
                <div className="flex-1 overflow-y-auto overscroll-contain p-6">
                  {/* STEP 1: PAYMENT METHOD SELECTION */}
                  {selectedPaymentMethod === null && (
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-gray-500">
                        {t('coinsPage.selectPaymentMethod')}
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                          {
                            id: 'mmqr' as PaymentMethod,
                            name: 'MMQR',
                            desc: t('coinsPage.methodMmqrDesc'),
                            logo: (
                              <svg viewBox="0 0 24 24" className="text-primary-600 h-8 w-8">
                                <rect
                                  x="3"
                                  y="3"
                                  width="7"
                                  height="7"
                                  rx="1.5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  fill="none"
                                />
                                <rect
                                  x="14"
                                  y="3"
                                  width="7"
                                  height="7"
                                  rx="1.5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  fill="none"
                                />
                                <rect
                                  x="3"
                                  y="14"
                                  width="7"
                                  height="7"
                                  rx="1.5"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  fill="none"
                                />
                                <rect x="14" y="14" width="3" height="3" fill="currentColor" />
                                <rect x="18" y="18" width="3" height="3" fill="currentColor" />
                              </svg>
                            ),
                            hoverClass: 'hover:border-primary-500 hover:bg-primary-500/5',
                          },
                          {
                            id: 'kbzpay' as PaymentMethod,
                            name: 'KBZPay',
                            desc: t('coinsPage.methodKbzDesc'),
                            logo: (
                              <div className="shape-circle flex h-8 w-8 items-center justify-center bg-[#0062b1] font-sans text-base font-bold text-white shadow-sm select-none">
                                K
                              </div>
                            ),
                            hoverClass: 'hover:border-blue-500 hover:bg-blue-500/5',
                          },
                          {
                            id: 'wavepay' as PaymentMethod,
                            name: 'WavePay',
                            desc: t('coinsPage.methodWaveDesc'),
                            logo: (
                              <div className="shape-circle relative flex h-8 w-8 items-center justify-center bg-[#fdd835] font-bold shadow-sm select-none">
                                <span className="text-2xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans font-bold text-emerald-800">
                                  W
                                </span>
                                <svg
                                  viewBox="0 0 24 24"
                                  className="absolute inset-0.5 animate-pulse text-emerald-700"
                                >
                                  <path
                                    d="M4 12c4-4 8 8 12 0s4-4 4-4"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    fill="none"
                                    strokeLinecap="round"
                                  />
                                </svg>
                              </div>
                            ),
                            hoverClass: 'hover:border-yellow-500 hover:bg-yellow-500/5',
                          },
                          {
                            id: 'aplus' as PaymentMethod,
                            name: 'A+',
                            desc: t('coinsPage.methodAplusDesc'),
                            logo: (
                              <div className="shape-circle flex h-8 w-8 items-center justify-center bg-[#ff5722] font-sans text-xs font-bold text-white shadow-sm select-none">
                                A+
                              </div>
                            ),
                            hoverClass: 'hover:border-orange-500 hover:bg-orange-500/5',
                          },
                          {
                            id: 'cbpay' as PaymentMethod,
                            name: 'CBPay',
                            desc: t('coinsPage.methodCbDesc'),
                            logo: (
                              <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-[#01579b] font-sans text-xs font-bold text-white shadow-sm select-none">
                                CB
                              </div>
                            ),
                            hoverClass: 'hover:border-sky-500 hover:bg-sky-500/5',
                          },
                          {
                            id: 'card' as PaymentMethod,
                            name: 'Cards',
                            desc: t('coinsPage.methodCardDesc'),
                            logo: (
                              <CreditCard className="h-8 w-8 text-gray-700" aria-hidden="true" />
                            ),
                            hoverClass: 'hover:border-emerald-500 hover:bg-emerald-500/5',
                          },
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`flex min-h-[44px] items-center gap-4.5 rounded-2xl border-2 border-gray-200 p-4 text-left transition-all duration-200 ${method.hoverClass}`}
                          >
                            {method.logo}
                            <div>
                              <p className="font-sans text-sm font-bold text-gray-900">
                                {method.name}
                              </p>
                              <p className="text-2xs mt-0.5 text-gray-500">{method.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 2: GATEWAY INPUT ACTION SHEETS */}
                  {selectedPaymentMethod !== null && (
                    <div className="space-y-5">
                      {/* Back button to steps */}
                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={handleBackToMethods}
                        className="text-primary-500 hover:text-primary-600 flex items-center gap-1.5 text-xs font-bold transition disabled:opacity-50"
                      >
                        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                        {t('coinsPage.backToMethods')}
                      </button>

                      {/* A. MMQR SCREEN SHEET */}
                      {selectedPaymentMethod === 'mmqr' && (
                        <div className="space-y-4 text-center">
                          <p className="text-xs font-bold text-gray-500">
                            {t('coinsPage.qrInstructions')}
                          </p>

                          {/* Scanner Frame */}
                          <div className="border-primary-500 relative mx-auto flex h-48 w-48 items-center justify-center rounded-2xl border-4 border-dashed bg-white p-3 shadow-inner">
                            {/* Simulated QR Code SVG */}
                            <svg viewBox="0 0 100 100" className="h-full w-full text-gray-900">
                              <rect x="0" y="0" width="25" height="25" fill="currentColor" />
                              <rect x="5" y="5" width="15" height="15" fill="white" />
                              <rect x="8" y="8" width="9" height="9" fill="currentColor" />

                              <rect x="75" y="0" width="25" height="25" fill="currentColor" />
                              <rect x="80" y="5" width="15" height="15" fill="white" />
                              <rect x="83" y="8" width="9" height="9" fill="currentColor" />

                              <rect x="0" y="75" width="25" height="25" fill="currentColor" />
                              <rect x="5" y="80" width="15" height="15" fill="white" />
                              <rect x="8" y="83" width="9" height="9" fill="currentColor" />

                              {/* Noise Matrix blocks */}
                              <rect x="35" y="10" width="5" height="20" fill="currentColor" />
                              <rect x="45" y="5" width="10" height="5" fill="currentColor" />
                              <rect x="60" y="15" width="5" height="15" fill="currentColor" />
                              <rect x="30" y="40" width="15" height="5" fill="currentColor" />
                              <rect x="50" y="35" width="5" height="15" fill="currentColor" />
                              <rect x="65" y="45" width="20" height="5" fill="currentColor" />
                              <rect x="10" y="35" width="15" height="5" fill="currentColor" />
                              <rect x="15" y="50" width="5" height="10" fill="currentColor" />
                              <rect x="40" y="60" width="25" height="5" fill="currentColor" />
                              <rect x="80" y="65" width="10" height="10" fill="currentColor" />
                              <rect x="35" y="75" width="5" height="20" fill="currentColor" />
                              <rect x="50" y="80" width="15" height="5" fill="currentColor" />
                              <rect x="70" y="85" width="5" height="10" fill="currentColor" />
                            </svg>
                          </div>

                          {/* Countdown clock */}
                          <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-red-500">
                            <Clock
                              className="h-4.5 w-4.5 animate-spin"
                              style={{ animationDuration: '4s' }}
                            />
                            <span>
                              {t('coinsPage.timerRemaining', { time: formatTime(timeLeft) })}
                            </span>
                          </div>

                          {/* Copy Merchant Transaction Details */}
                          <div className="flex items-center justify-between rounded-2xl border bg-gray-50 p-3.5">
                            <div className="text-left">
                              <span className="text-2xs block font-semibold text-gray-400">
                                {t('coinsPage.merchantIdLabel')}
                              </span>
                              <span className="font-mono text-sm font-bold">DEMO-TXN-8472910</span>
                            </div>
                            <button
                              type="button"
                              onClick={handleCopyMerchant}
                              className="text-primary-500 hover:text-primary-600 flex items-center gap-1 text-xs font-bold transition"
                            >
                              {qrCopied ? (
                                <span className="text-emerald-500">{t('coinsPage.copied')}</span>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" aria-hidden="true" />
                                  <span>{t('coinsPage.copyMerchant')}</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* B. WALLET INPUT SHEETS */}
                      {selectedPaymentMethod !== 'mmqr' && selectedPaymentMethod !== 'card' && (
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="walletNumber"
                              className="mb-2 block text-sm font-bold text-gray-700"
                            >
                              {t('coinsPage.walletNumber')} ({selectedPaymentMethod.toUpperCase()})
                            </label>
                            <input
                              type="tel"
                              id="walletNumber"
                              value={walletPhone}
                              onChange={handlePhoneChange}
                              placeholder="09xxxxxxxxx"
                              className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-medium transition ${
                                phoneError
                                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                  : 'focus:border-primary-500 focus:ring-primary-500 border-gray-200 focus:ring-1'
                              }`}
                            />
                            {phoneError && (
                              <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-red-500">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {phoneError}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* C. CREDIT CARD SHEETS (WITH 3D CARD FLIP) */}
                      {selectedPaymentMethod === 'card' && (
                        <div className="space-y-6">
                          {/* 3D Card Animation Mockup */}
                          <div className="card-3d-wrapper">
                            <div
                              className={`card-3d-inner ${isCardFlipped ? 'card-3d-flipped' : ''}`}
                            >
                              {/* Card Front face */}
                              <div className="card-front from-primary-700 to-primary-900 flex flex-col justify-between bg-gradient-to-br text-white">
                                <div className="flex items-center justify-between">
                                  <span className="text-primary-200 text-xs font-bold tracking-widest">
                                    {t('coinsPage.cardBrandName')}
                                  </span>
                                  {/* Styled Sim Chip */}
                                  <div className="relative h-7 w-9 overflow-hidden rounded-2xl border border-amber-300/40 bg-amber-400/80">
                                    <div className="absolute inset-x-2.5 top-0 bottom-0 border-x border-amber-600/30" />
                                    <div className="absolute inset-y-2 top-0 bottom-0 border-y border-amber-600/30" />
                                  </div>
                                </div>

                                <div className="my-2 font-mono text-lg tracking-widest select-all">
                                  {cardNumber || '•••• •••• •••• ••••'}
                                </div>

                                <div className="flex items-end justify-between">
                                  <div>
                                    <span className="text-primary-300 block text-[8px] font-bold tracking-wider uppercase">
                                      {t('coinsPage.cardholderLabel')}
                                    </span>
                                    <span className="block max-w-[180px] truncate text-xs font-bold uppercase">
                                      {cardHolder || t('coinsPage.cardholderPlaceholder')}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-primary-300 block text-[8px] font-bold tracking-wider uppercase">
                                      {t('coinsPage.expiryLabel')}
                                    </span>
                                    <span className="block font-mono text-xs font-bold">
                                      {cardExpiry || t('coinsPage.expiryPlaceholder')}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Card Back face */}
                              <div className="card-back from-primary-900 to-primary-950 flex flex-col justify-between bg-gradient-to-br p-0 py-5 text-white">
                                <div className="h-10 w-full bg-black/60" />
                                <div className="px-5">
                                  <span className="text-primary-300 mb-1 block text-[8px] font-bold uppercase">
                                    {t('coinsPage.signatureLabel')}
                                  </span>
                                  <div className="flex h-8 w-full items-center rounded-2xl bg-white pr-3 text-right font-mono text-sm font-bold text-gray-800 italic shadow-inner">
                                    <div className="h-full flex-1 border-r border-gray-300/50 bg-gray-200" />
                                    <span className="ml-2 tracking-widest">{cardCvv || '•••'}</span>
                                  </div>
                                </div>
                                <div className="px-5 text-right">
                                  <span className="text-primary-400 text-[9px] font-bold">
                                    {t('coinsPage.cardNetworkLabel')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Interactive Card Input Forms */}
                          <div className="space-y-3.5">
                            <div>
                              <label
                                htmlFor="cardNumberInput"
                                className="mb-1 block text-xs font-bold text-gray-500 uppercase"
                              >
                                {t('coinsPage.cardNumber')}
                              </label>
                              <input
                                type="text"
                                id="cardNumberInput"
                                maxLength={19}
                                value={cardNumber}
                                onChange={(e) => {
                                  let value = e.target.value.replace(/[^0-9]/g, '')
                                  // Add spaces every 4 characters
                                  value = value.match(/.{1,4}/g)?.join(' ') || ''
                                  setCardNumber(value)
                                }}
                                placeholder="4111 2222 3333 4444"
                                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-2xl border-2 border-gray-200 px-4 py-2.5 text-sm transition focus:ring-1"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="cardHolderInput"
                                className="mb-1 block text-xs font-bold text-gray-500 uppercase"
                              >
                                {t('coinsPage.cardHolder')}
                              </label>
                              <input
                                type="text"
                                id="cardHolderInput"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                placeholder="JOHN DOE"
                                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-2xl border-2 border-gray-200 px-4 py-2.5 text-sm transition focus:ring-1"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="cardExpiryInput"
                                  className="mb-1 block text-xs font-bold text-gray-500 uppercase"
                                >
                                  {t('coinsPage.cardExpiry')}
                                </label>
                                <input
                                  type="text"
                                  id="cardExpiryInput"
                                  maxLength={5}
                                  value={cardExpiry}
                                  onChange={(e) => {
                                    let value = e.target.value.replace(/[^0-9]/g, '')
                                    if (value.length > 2) {
                                      value = value.slice(0, 2) + '/' + value.slice(2)
                                    }
                                    setCardExpiry(value)
                                  }}
                                  placeholder="MM/YY"
                                  className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-2xl border-2 border-gray-200 px-4 py-2.5 text-sm transition focus:ring-1"
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor="cardCvvInput"
                                  className="mb-1 block text-xs font-bold text-gray-500 uppercase"
                                >
                                  {t('coinsPage.cardCvv')}
                                </label>
                                <input
                                  type="password"
                                  id="cardCvvInput"
                                  maxLength={3}
                                  value={cardCvv}
                                  onChange={(e) =>
                                    setCardCvv(e.target.value.replace(/[^0-9]/g, ''))
                                  }
                                  onFocus={() => setIsCardFlipped(true)}
                                  onBlur={() => setIsCardFlipped(false)}
                                  placeholder="•••"
                                  className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-2xl border-2 border-gray-200 px-4 py-2.5 text-sm transition focus:ring-1"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer buttons container */}
                <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
                  <Button
                    variant="ghost"
                    className="flex-1"
                    disabled={isProcessing}
                    onClick={() => {
                      setShowPaymentModal(false)
                      setSelectedPackage(null)
                      setSelectedPaymentMethod(null)
                      setWalletPhone('')
                    }}
                  >
                    {t('common.cancel')}
                  </Button>

                  {selectedPaymentMethod !== null && (
                    <Button
                      variant="primary"
                      className="flex-1"
                      disabled={
                        isProcessing ||
                        (selectedPaymentMethod === 'card' &&
                          (!cardNumber || !cardHolder || !cardExpiry || !cardCvv)) ||
                        (selectedPaymentMethod !== 'mmqr' &&
                          selectedPaymentMethod !== 'card' &&
                          !isPhoneValid)
                      }
                      onClick={handlePurchase}
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="shape-circle h-4 w-4 animate-spin border-2 border-white border-t-transparent" />
                          {t('coinsPage.processing')}
                        </span>
                      ) : (
                        t('coinsPage.payAmount', { price: formatPrice(selectedPackage.price) })
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* ═══════ MOCK SNACKBAR SUCCESS BANNER ═══════ */}
        <AnimatePresence>
          {showSuccess && (
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
                {t('coinsPage.demoTopUpSuccess')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CoinsPage
