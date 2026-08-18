import { motion } from 'framer-motion'
import { Coins, Sparkles } from 'lucide-react'
import type { CoinPackage } from './coinData'

export interface CoinPackageCardProps {
  pkg: CoinPackage
  prefersReducedMotion: boolean | null
  popularLabel: string
  bestValueLabel: string
  bonusLabel: string
  priceLabel: string
  perCoinLabel: string
  onSelect: (pkg: CoinPackage) => void
}

const CoinPackageCard = ({
  pkg,
  prefersReducedMotion,
  popularLabel,
  bestValueLabel,
  bonusLabel,
  priceLabel,
  perCoinLabel,
  onSelect,
}: CoinPackageCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onSelect(pkg)}
      className={`group relative overflow-hidden rounded-3xl border-2 p-6 text-left transition-all duration-300 ${pkg.metalClass} ${pkg.glowClass}`}
    >
      {!prefersReducedMotion && (
        <div className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out group-hover:translate-x-full" />
      )}

      {!prefersReducedMotion && (pkg.bestValue || pkg.popular) && (
        <div className="animate-shimmer-sweep pointer-events-none absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      )}

      {pkg.popular && (
        <span className="from-accent-500 to-accent-700 text-2xs absolute top-0 right-6 rounded-b-2xl bg-gradient-to-r px-3 py-1 font-bold tracking-wider text-white uppercase shadow-sm">
          {popularLabel}
        </span>
      )}
      {pkg.bestValue && (
        <span className="from-spark-500 to-spark-700 text-2xs absolute top-0 right-6 rounded-b-2xl bg-gradient-to-r px-3 py-1 font-bold tracking-wider text-white uppercase shadow-sm">
          {bestValueLabel}
        </span>
      )}

      <div className="relative z-10 flex h-full flex-col justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-inner ${
              pkg.popular
                ? 'border-accent-500/30 bg-accent-500/20 text-accent-500 border'
                : pkg.bestValue
                  ? 'border-spark-500/30 bg-spark-500/20 text-spark-600 border'
                  : 'bg-gray-100 text-gray-500'
            }`}
          >
            <Coins className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-3xl font-bold tracking-tight">{pkg.coins.toLocaleString()}</p>
            {pkg.bonus && (
              <p className="flex items-center gap-1 text-xs font-bold text-emerald-500">
                <Sparkles
                  className="h-3 w-3 animate-spin"
                  style={{ animationDuration: '3s' }}
                  aria-hidden="true"
                />
                +{pkg.bonus} {bonusLabel}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="font-sans text-lg font-bold text-gray-950">{priceLabel}</p>
          <p className="mt-1 text-xs font-medium text-gray-500">{perCoinLabel}</p>
        </div>
      </div>
    </motion.button>
  )
}

export default CoinPackageCard
