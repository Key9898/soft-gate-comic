import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Coins,
  Gift,
  History,
  Check,
  Shield,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Copy,
  ArrowLeft,
  AlertCircle,
  CreditCard,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Button from '../../components/Button'

interface CoinPackage {
  id: string
  coins: number
  price: number
  bonus?: number
  popular?: boolean
  bestValue?: boolean
  metalClass: string
  glowClass: string
}

interface Transaction {
  id: string
  type: 'purchase' | 'spend' | 'refund' | 'bonus'
  amount: number
  description: string
  balance: number
  createdAt: string
}

const coinPackages: CoinPackage[] = [
  { id: '1', coins: 50, price: 1000, metalClass: 'metal-bronze', glowClass: '' },
  { id: '2', coins: 120, price: 2000, bonus: 10, metalClass: 'metal-silver', glowClass: '' },
  {
    id: '3',
    coins: 300,
    price: 5000,
    bonus: 30,
    popular: true,
    metalClass: 'metal-gold',
    glowClass: 'gold-glow',
  },
  { id: '4', coins: 650, price: 10000, bonus: 80, metalClass: 'metal-ruby', glowClass: '' },
  {
    id: '5',
    coins: 1400,
    price: 20000,
    bonus: 200,
    bestValue: true,
    metalClass: 'metal-platinum',
    glowClass: 'purple-glow',
  },
  { id: '6', coins: 3000, price: 40000, bonus: 500, metalClass: 'metal-obsidian', glowClass: '' },
]

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'purchase',
    amount: 300,
    description: 'Purchased 300 coins',
    balance: 450,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    type: 'spend',
    amount: -5,
    description: 'Unlocked Episode 45 - Shadow Knight',
    balance: 150,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    type: 'spend',
    amount: -5,
    description: 'Unlocked Episode 44 - Shadow Knight',
    balance: 155,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    type: 'bonus',
    amount: 30,
    description: 'Bonus coins from package purchase',
    balance: 160,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '5',
    type: 'purchase',
    amount: 120,
    description: 'Purchased 120 coins',
    balance: 130,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

type PaymentMethod = 'mmqr' | 'kbzpay' | 'wavepay' | 'aplus' | 'cbpay' | 'card'

const CoinsPage = () => {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as 'mm' | 'en'
  const prefersReducedMotion = useReducedMotion()

  const [balance, setBalance] = useState(150)
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US').format(price) + ' MMK'
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
      setPhoneError(lang === 'mm' ? '၀၉ ဖြင့် စတင်ရပါမည်' : 'Must start with 09')
    } else if (value && value.length < 9) {
      setPhoneError(lang === 'mm' ? 'ဖုန်းနံပါတ်တိုလွန်းသည်' : 'Too short')
    } else if (value && value.length > 11) {
      setPhoneError(lang === 'mm' ? 'ဖုန်းနံပါတ်ရှည်လွန်းသည်' : 'Too long')
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
      const totalCoins = selectedPackage.coins + (selectedPackage.bonus || 0)
      setBalance((prev) => prev + totalCoins)
      setIsProcessing(false)
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
    }, 2500)
  }

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'purchase':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />
      case 'spend':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />
      case 'refund':
        return <ArrowDownLeft className="h-5 w-5 text-blue-500" />
      case 'bonus':
        return <Gift className="h-5 w-5 text-amber-500" />
    }
  }

  const handleCopyMerchant = () => {
    navigator.clipboard.writeText('TXN-8472910-MM')
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

  return (
    <div className="min-h-screen bg-gray-50 pb-12 transition-colors duration-300 dark:bg-gray-950">
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
        .purple-glow {
          box-shadow: 0 10px 25px -5px rgba(168, 85, 247, 0.35), 0 8px 10px -6px rgba(168, 85, 247, 0.35);
        }
        .metal-bronze {
          background: linear-gradient(135deg, rgba(146, 64, 14, 0.1) 0%, rgba(120, 53, 4, 0.05) 100%);
          border-color: #b45309;
        }
        .dark .metal-bronze {
          background: linear-gradient(135deg, rgba(146, 64, 14, 0.25) 0%, rgba(120, 53, 4, 0.15) 100%);
        }
        .metal-silver {
          background: linear-gradient(135deg, rgba(156, 163, 175, 0.1) 0%, rgba(75, 85, 99, 0.05) 100%);
          border-color: #9ca3af;
        }
        .dark .metal-silver {
          background: linear-gradient(135deg, rgba(156, 163, 175, 0.25) 0%, rgba(75, 85, 99, 0.15) 100%);
        }
        .metal-gold {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(217, 119, 6, 0.05) 100%);
          border-color: #fbbf24;
        }
        .dark .metal-gold {
          background: linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(217, 119, 6, 0.15) 100%);
        }
        .metal-ruby {
          background: linear-gradient(135deg, rgba(219, 39, 119, 0.1) 0%, rgba(112, 26, 117, 0.05) 100%);
          border-color: #ec4899;
        }
        .dark .metal-ruby {
          background: linear-gradient(135deg, rgba(219, 39, 119, 0.25) 0%, rgba(112, 26, 117, 0.15) 100%);
        }
        .metal-platinum {
          background: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(79, 70, 229, 0.05) 50%, rgba(124, 58, 237, 0.05) 100%);
          border-color: #2dd4bf;
        }
        .dark .metal-platinum {
          background: linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(79, 70, 229, 0.2) 50%, rgba(124, 58, 237, 0.2) 100%);
        }
        .metal-obsidian {
          background: linear-gradient(135deg, rgba(55, 65, 81, 0.15) 0%, rgba(17, 24, 39, 0.1) 50%, rgba(3, 7, 18, 0.05) 100%);
          border-color: #4b5563;
        }
        .dark .metal-obsidian {
          background: linear-gradient(135deg, rgba(55, 65, 81, 0.35) 0%, rgba(17, 24, 39, 0.25) 50%, rgba(3, 7, 18, 0.25) 100%);
          border-color: #6b7280;
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
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="from-primary-600 relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br to-indigo-800 p-6 text-white shadow-xl sm:p-8">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/5 blur-2xl" />
          <div className="absolute bottom-0 left-0 h-36 w-36 rounded-full bg-indigo-500/10 blur-xl" />

          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-primary-100 text-sm font-semibold tracking-wider uppercase">
                {t('coinsPage.yourBalance')}
              </p>
              <div className="mt-2 flex items-center gap-3.5">
                <Coins className="h-10 w-10 animate-pulse text-amber-300" />
                <span className="text-5xl font-black tracking-tight sm:text-6xl">{balance}</span>
              </div>
              <p className="text-primary-200/90 mt-3 text-sm">{t('coinsPage.useCoinsDesc')}</p>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl bg-black/20 p-4 backdrop-blur-md">
              <div className="text-primary-100 flex items-center gap-2.5 text-sm font-semibold">
                <Shield className="h-4.5 w-4.5 text-emerald-400" />
                {t('coinsPage.securePayments')}
              </div>
              <div className="text-primary-100 flex items-center gap-2.5 text-sm font-semibold">
                <Clock className="h-4.5 w-4.5 text-sky-400" />
                {t('coinsPage.instantDelivery')}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════ TABS ═══════ */}
        <div className="mb-6 rounded-2xl border bg-white p-1.5 shadow-sm dark:border-white/5 dark:bg-gray-900">
          <div className="flex">
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                activeTab === 'buy'
                  ? 'bg-primary-500 shadow-primary-500/25 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <Coins className="h-4.5 w-4.5" />
              {t('coinsPage.buyCoins')}
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2.5 rounded-xl px-6 py-3 text-sm font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-primary-500 shadow-primary-500/25 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
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
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {coinPackages.map((pkg) => (
                  <motion.button
                    key={pkg.id}
                    whileHover={{ scale: 1.03, y: -4 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      setSelectedPackage(pkg)
                      setSelectedPaymentMethod(null)
                      setShowPaymentModal(true)
                    }}
                    className={`group relative overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 dark:text-white ${pkg.metalClass} ${pkg.glowClass}`}
                  >
                    {/* Shimmer sweep effect */}
                    {!prefersReducedMotion && (
                      <div className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
                    )}

                    {/* Continuous shimmer effect for bestValue / popular packages */}
                    {!prefersReducedMotion && (pkg.bestValue || pkg.popular) && (
                      <div className="animate-shimmer-sweep pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    )}

                    {pkg.popular && (
                      <span className="absolute top-0 right-6 rounded-b-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-sm">
                        {t('coinsPage.popular')}
                      </span>
                    )}
                    {pkg.bestValue && (
                      <span className="absolute top-0 right-6 rounded-b-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow-sm">
                        {t('coinsPage.bestValue')}
                      </span>
                    )}

                    <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${
                            pkg.popular
                              ? 'border border-amber-500/30 bg-amber-500/20 text-amber-500'
                              : pkg.bestValue
                                ? 'border border-purple-500/30 bg-purple-500/20 text-purple-400'
                                : 'bg-gray-100 text-gray-500 dark:bg-white/5 dark:text-gray-300'
                          }`}
                        >
                          <Coins className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-3xl font-black tracking-tight">
                            {pkg.coins.toLocaleString()}
                          </p>
                          {pkg.bonus && (
                            <p className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                              <Sparkles
                                className="h-3 w-3 animate-spin"
                                style={{ animationDuration: '3s' }}
                              />
                              +{pkg.bonus} {t('coinsPage.bonus')}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="font-sans text-lg font-black text-gray-950 dark:text-white">
                          {formatPrice(pkg.price)}
                        </p>
                        <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                          {Math.round(pkg.price / pkg.coins)} MMK per coin
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Instructions Bar */}
              <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-white/5 dark:bg-gray-900">
                <h3 className="mb-5 text-base font-bold text-gray-900 dark:text-white">
                  {t('coinsPage.title')}
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {[
                    {
                      icon: <Coins className="h-6 w-6" />,
                      title: t('coinsPage.buyCoins'),
                      description: t('coinsPage.selectPaymentMethod'),
                      color: 'bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400',
                    },
                    {
                      icon: <Sparkles className="h-6 w-6" />,
                      title: t('webtoonDetail.episodes'),
                      description: t('coinsPage.useCoinsDesc'),
                      color:
                        'bg-primary-100 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400',
                    },
                    {
                      icon: <Gift className="h-6 w-6" />,
                      title: t('coinsPage.bonus'),
                      description: t('coinsPage.bonusCoins'),
                      color:
                        'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400',
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div
                        className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${item.color} shadow-sm`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-950 dark:text-white">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
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
              <div className="overflow-hidden rounded-3xl border bg-white shadow-sm dark:border-white/5 dark:bg-gray-900">
                <div className="divide-y divide-gray-100 dark:divide-white/5">
                  {mockTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-5 transition-colors hover:bg-gray-50 dark:hover:bg-white/5"
                    >
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-white/5">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          {transaction.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-black ${
                            transaction.amount > 0 ? 'text-green-600' : 'text-red-500'
                          }`}
                        >
                          {transaction.amount > 0 ? '+' : ''}
                          {transaction.amount}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          {t('coinsPage.balance')}: {transaction.balance}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {mockTransactions.length === 0 && (
                  <div className="py-16 text-center">
                    <History className="mx-auto mb-3 h-12 w-12 text-gray-300 dark:text-gray-700" />
                    <p className="text-gray-500 dark:text-gray-400">{t('libraryPage.noItems')}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
                initial={{ scale: 0.95, opacity: 0, y: 15 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 15 }}
                transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border bg-white shadow-2xl dark:border-white/10 dark:bg-gray-900"
              >
                {/* Header info */}
                <div className="from-primary-600 bg-gradient-to-r to-indigo-800 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-primary-200 text-[10px] font-black tracking-wider uppercase">
                        {t('coinsPage.buyCoins')}
                      </span>
                      <h3 className="mt-1 text-lg font-black">
                        {selectedPackage.coins.toLocaleString()} {t('coinsPage.coins')}
                      </h3>
                      {selectedPackage.bonus && (
                        <p className="text-xs font-semibold text-emerald-300">
                          +{selectedPackage.bonus} {t('coinsPage.bonusCoins')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-primary-200 text-[10px] font-black tracking-wider uppercase">
                        Total Price
                      </span>
                      <p className="mt-1 text-2xl font-black">
                        {formatPrice(selectedPackage.price)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress breadcrumbs wizard */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-6 py-3 dark:border-white/5 dark:bg-white/5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        selectedPaymentMethod === null
                          ? 'bg-primary-600 text-white'
                          : 'bg-emerald-500 text-white'
                      }`}
                    >
                      {selectedPaymentMethod === null ? '1' : <Check className="h-3 w-3" />}
                    </div>
                    <span
                      className={`text-xs font-bold ${selectedPaymentMethod === null ? 'text-primary-600' : 'text-gray-500 dark:text-gray-400'}`}
                    >
                      {t('coinsPage.stepSelectMethod')}
                    </span>
                  </div>

                  <div className="h-px w-8 bg-gray-300 dark:bg-gray-700" />

                  <div className="flex items-center gap-1.5">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                        selectedPaymentMethod !== null
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
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

                {/* Content Box */}
                <div className="p-6">
                  {/* STEP 1: PAYMENT METHOD SELECTION */}
                  {selectedPaymentMethod === null && (
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                        {t('coinsPage.selectPaymentMethod')}
                      </p>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                          {
                            id: 'mmqr' as PaymentMethod,
                            name: 'MMQR',
                            desc: 'Any Local Banking App',
                            logo: (
                              <svg
                                viewBox="0 0 24 24"
                                className="h-8 w-8 text-indigo-600 dark:text-indigo-400"
                              >
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
                            hoverClass: 'hover:border-indigo-500 hover:bg-indigo-500/5',
                          },
                          {
                            id: 'kbzpay' as PaymentMethod,
                            name: 'KBZPay',
                            desc: 'Official KBZ mobile money',
                            logo: (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0062b1] font-sans text-base font-black text-white shadow-sm select-none">
                                K
                              </div>
                            ),
                            hoverClass: 'hover:border-blue-500 hover:bg-blue-500/5',
                          },
                          {
                            id: 'wavepay' as PaymentMethod,
                            name: 'WavePay',
                            desc: 'WaveMoney mobile wallet',
                            logo: (
                              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-[#fdd835] font-black shadow-sm select-none">
                                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-sans text-[10px] font-black text-emerald-800">
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
                            desc: 'A-Plus Wallet payment',
                            logo: (
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ff5722] font-sans text-xs font-black text-white shadow-sm select-none">
                                A+
                              </div>
                            ),
                            hoverClass: 'hover:border-orange-500 hover:bg-orange-500/5',
                          },
                          {
                            id: 'cbpay' as PaymentMethod,
                            name: 'CBPay',
                            desc: 'CB Bank digital wallet',
                            logo: (
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#01579b] font-sans text-xs font-black text-white shadow-sm select-none">
                                CB
                              </div>
                            ),
                            hoverClass: 'hover:border-sky-500 hover:bg-sky-500/5',
                          },
                          {
                            id: 'card' as PaymentMethod,
                            name: 'Cards',
                            desc: 'Visa, Mastercard, JCB',
                            logo: (
                              <CreditCard className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                            ),
                            hoverClass: 'hover:border-emerald-500 hover:bg-emerald-500/5',
                          },
                        ].map((method) => (
                          <button
                            key={method.id}
                            onClick={() => setSelectedPaymentMethod(method.id)}
                            className={`flex min-h-[44px] items-center gap-4.5 rounded-2xl border-2 border-gray-200 p-4 text-left transition-all duration-200 dark:border-white/5 ${method.hoverClass}`}
                          >
                            {method.logo}
                            <div>
                              <p className="font-sans text-sm font-bold text-gray-900 dark:text-white">
                                {method.name}
                              </p>
                              <p className="mt-0.5 text-[10px] text-gray-500 dark:text-gray-400">
                                {method.desc}
                              </p>
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
                        <ArrowLeft className="h-4 w-4" />
                        {lang === 'mm'
                          ? 'စနစ်ရွေးချယ်မှုသို့ ပြန်သွားရန်'
                          : 'Back to Payment Methods'}
                      </button>

                      {/* A. MMQR SCREEN SHEET */}
                      {selectedPaymentMethod === 'mmqr' && (
                        <div className="space-y-4 text-center">
                          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
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
                          <div className="flex items-center justify-between rounded-xl border bg-gray-50 p-3.5 dark:border-white/5 dark:bg-white/5">
                            <div className="text-left">
                              <span className="block text-[10px] font-semibold text-gray-400">
                                Transaction Merchant ID
                              </span>
                              <span className="font-mono text-sm font-bold dark:text-white">
                                TXN-8472910-MM
                              </span>
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
                                  <Copy className="h-4 w-4" />
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
                              className="mb-2 block text-sm font-bold text-gray-700 dark:text-gray-300"
                            >
                              {t('coinsPage.walletNumber')} ({selectedPaymentMethod.toUpperCase()})
                            </label>
                            <input
                              type="tel"
                              id="walletNumber"
                              value={walletPhone}
                              onChange={handlePhoneChange}
                              placeholder="09xxxxxxxxx"
                              className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-medium transition dark:bg-gray-800 dark:text-white ${
                                phoneError
                                  ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                                  : 'focus:border-primary-500 focus:ring-primary-500 border-gray-200 focus:ring-1 dark:border-white/5'
                              }`}
                            />
                            {phoneError && (
                              <p className="mt-1.5 flex items-center gap-1 text-xs font-bold text-red-500">
                                <AlertCircle className="h-3.5 w-3.5" />
                                {phoneError}
                              </p>
                            )}
                          </div>

                          <button
                            type="button"
                            className="mt-2 w-full text-center text-xs font-bold text-gray-500 hover:underline dark:text-gray-400"
                          >
                            Open Wallet App Deep Link
                          </button>
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
                              <div className="card-front flex flex-col justify-between bg-gradient-to-br from-indigo-700 to-purple-900 text-white">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold tracking-widest text-indigo-200">
                                    WEBPad Pay
                                  </span>
                                  {/* Styled Sim Chip */}
                                  <div className="relative h-7 w-9 overflow-hidden rounded-md border border-amber-300/40 bg-amber-400/80">
                                    <div className="absolute inset-x-2.5 top-0 bottom-0 border-x border-amber-600/30" />
                                    <div className="absolute inset-y-2 top-0 bottom-0 border-y border-amber-600/30" />
                                  </div>
                                </div>

                                <div className="my-2 font-mono text-lg tracking-widest select-all">
                                  {cardNumber || '•••• •••• •••• ••••'}
                                </div>

                                <div className="flex items-end justify-between">
                                  <div>
                                    <span className="block text-[8px] font-bold tracking-wider text-indigo-300 uppercase">
                                      Cardholder
                                    </span>
                                    <span className="block max-w-[180px] truncate text-xs font-bold uppercase">
                                      {cardHolder || 'Your Name'}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <span className="block text-[8px] font-bold tracking-wider text-indigo-300 uppercase">
                                      Expiry
                                    </span>
                                    <span className="block font-mono text-xs font-bold">
                                      {cardExpiry || 'MM/YY'}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Card Back face */}
                              <div className="card-back flex flex-col justify-between bg-gradient-to-br from-purple-900 to-indigo-950 p-0 py-5 text-white">
                                <div className="h-10 w-full bg-black/60" />
                                <div className="px-5">
                                  <span className="mb-1 block text-[8px] font-bold text-indigo-300 uppercase">
                                    Authorized Signature
                                  </span>
                                  <div className="flex h-8 w-full items-center rounded-md bg-white pr-3 text-right font-mono text-sm font-bold text-gray-800 italic shadow-inner">
                                    <div className="h-full flex-1 border-r border-gray-300/50 bg-gray-200" />
                                    <span className="ml-2 tracking-widest">{cardCvv || '•••'}</span>
                                  </div>
                                </div>
                                <div className="px-5 text-right">
                                  <span className="text-[9px] font-bold text-indigo-400">
                                    Mastercard / Visa Network
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
                                className="mb-1 block text-xs font-bold text-gray-500 uppercase dark:text-gray-400"
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
                                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm transition focus:ring-1 dark:border-white/5 dark:bg-gray-800 dark:text-white"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor="cardHolderInput"
                                className="mb-1 block text-xs font-bold text-gray-500 uppercase dark:text-gray-400"
                              >
                                {t('coinsPage.cardHolder')}
                              </label>
                              <input
                                type="text"
                                id="cardHolderInput"
                                value={cardHolder}
                                onChange={(e) => setCardHolder(e.target.value)}
                                placeholder="JOHN DOE"
                                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm transition focus:ring-1 dark:border-white/5 dark:bg-gray-800 dark:text-white"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label
                                  htmlFor="cardExpiryInput"
                                  className="mb-1 block text-xs font-bold text-gray-500 uppercase dark:text-gray-400"
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
                                  className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm transition focus:ring-1 dark:border-white/5 dark:bg-gray-800 dark:text-white"
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor="cardCvvInput"
                                  className="mb-1 block text-xs font-bold text-gray-500 uppercase dark:text-gray-400"
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
                                  className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-xl border-2 border-gray-200 px-4 py-2.5 text-sm transition focus:ring-1 dark:border-white/5 dark:bg-gray-800 dark:text-white"
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
                <div className="flex gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-white/5 dark:bg-white/5">
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
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          {t('coinsPage.processing')}
                        </span>
                      ) : (
                        `Pay ${formatPrice(selectedPackage.price)}`
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
              className="fixed bottom-6 left-1/2 z-[250] flex -translate-x-1/2 items-center gap-3.5 rounded-full border border-emerald-500 bg-emerald-600 px-6 py-3.5 text-white shadow-xl"
            >
              <div className="rounded-full bg-white/20 p-1">
                <Check className="h-4 w-4 stroke-[3]" />
              </div>
              <span className="text-sm font-bold tracking-wide">
                {t('coinsPage.purchaseSuccess')}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default CoinsPage
