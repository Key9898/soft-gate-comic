import { Moon, Maximize2, RectangleHorizontal, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReaderImageFit } from '../../../lib/reader'
import ReaderSheet from './ReaderSheet'

type ReaderSettingsSheetProps = {
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
  brightness: number
  imageFit: ReaderImageFit
  onDarkMode: (value: boolean) => void
  onBrightness: (value: number) => void
  onImageFit: (value: ReaderImageFit) => void
}

const ReaderSettingsSheet = ({
  isOpen,
  onClose,
  darkMode,
  brightness,
  imageFit,
  onDarkMode,
  onBrightness,
  onImageFit,
}: ReaderSettingsSheetProps) => {
  const { t } = useTranslation()
  const idle = darkMode
    ? 'border-white/10 bg-white/5 hover:border-white/20'
    : 'border-gray-200 bg-gray-50 hover:border-gray-300'
  const active = 'border-primary-500 bg-primary-600/10 text-primary-500'
  const label = 'mb-3 block text-sm font-semibold tracking-wider text-gray-400 uppercase'

  return (
    <ReaderSheet
      isOpen={isOpen}
      onClose={onClose}
      title={t('readerPage.settings')}
      darkMode={darkMode}
    >
      <div className="space-y-6">
        <div>
          <label className={label}>{t('profilePage.preferences')}</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onDarkMode(false)}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                !darkMode ? active : idle
              }`}
            >
              <Sun className="h-5 w-5" />
              {t('reader.lightMode')}
            </button>
            <button
              type="button"
              onClick={() => onDarkMode(true)}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                darkMode ? active : idle
              }`}
            >
              <Moon className="h-5 w-5" />
              {t('reader.darkMode')}
            </button>
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
              {t('readerPage.brightness')}
            </label>
            <span className="text-primary-500 text-xs font-bold">
              {Math.round(brightness * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Sun className="h-4 w-4 text-gray-400" />
            <input
              type="range"
              min="0.25"
              max="1"
              step="0.05"
              value={brightness}
              onChange={(e) => onBrightness(parseFloat(e.target.value))}
              className={`accent-primary-500 h-1.5 w-full cursor-pointer appearance-none rounded-2xl ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}
              aria-label={t('readerPage.brightness')}
            />
            <Sun className="h-5 w-5 text-gray-300" />
          </div>
        </div>

        <div>
          <label className={label}>{t('readerPage.imageFit')}</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onImageFit('fit')}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                imageFit === 'fit' ? active : idle
              }`}
            >
              <RectangleHorizontal className="h-5 w-5" />
              {t('readerPage.fit')}
            </button>
            <button
              type="button"
              onClick={() => onImageFit('full')}
              className={`flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                imageFit === 'full' ? active : idle
              }`}
            >
              <Maximize2 className="h-5 w-5" />
              {t('readerPage.fullWidth')}
            </button>
          </div>
        </div>
      </div>
    </ReaderSheet>
  )
}

export default ReaderSettingsSheet
