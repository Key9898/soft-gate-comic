import { Moon, Maximize2, RectangleHorizontal, Sun, Type } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { ReaderFontSize, ReaderImageFit } from '../../../lib/reader'
import ReaderSheet from './ReaderSheet'

type ReaderSettingsSheetProps = {
  isOpen: boolean
  onClose: () => void
  darkMode: boolean
  brightness: number
  imageFit: ReaderImageFit
  fontSize: ReaderFontSize
  onDarkMode: (value: boolean) => void
  onBrightness: (value: number) => void
  onImageFit: (value: ReaderImageFit) => void
  onFontSize: (value: ReaderFontSize) => void
}

const ReaderSettingsSheet = ({
  isOpen,
  onClose,
  darkMode,
  brightness,
  imageFit,
  fontSize,
  onDarkMode,
  onBrightness,
  onImageFit,
  onFontSize,
}: ReaderSettingsSheetProps) => {
  const { t } = useTranslation()
  // Border/bg tokenise (edge + surface-nested); the hover-border accent has no token
  // equivalent and stays branched.
  const idle = `border-edge bg-surface-nested ${darkMode ? 'hover:border-white/20' : 'hover:border-gray-300'}`
  const active = 'border-primary-500 bg-primary-600/10 text-primary-500'
  const legendTone = 'text-ink-secondary'
  const legend = `mb-3 block text-sm font-semibold tracking-wider uppercase ${legendTone}`
  const option = `flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`

  return (
    <ReaderSheet isOpen={isOpen} onClose={onClose} title={t('readerPage.settings')}>
      <div className="space-y-6">
        {/* Each group is a fieldset/legend + radiogroup. These used to be bare <label>
            elements wrapping nothing, so the groups had no accessible name and the
            chosen option was conveyed by colour alone. */}
        <fieldset>
          <legend className={legend}>{t('reader.theme')}</legend>
          <div role="radiogroup" aria-label={t('reader.theme')} className="flex gap-3">
            <button
              type="button"
              role="radio"
              aria-checked={!darkMode}
              onClick={() => onDarkMode(false)}
              className={`${option} ${!darkMode ? active : idle}`}
            >
              <Sun className="h-5 w-5" aria-hidden="true" />
              {t('reader.lightMode')}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={darkMode}
              onClick={() => onDarkMode(true)}
              className={`${option} ${darkMode ? active : idle}`}
            >
              <Moon className="h-5 w-5" aria-hidden="true" />
              {t('reader.darkMode')}
            </button>
          </div>
        </fieldset>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <label
              htmlFor="reader-brightness"
              className={`text-sm font-semibold uppercase tracking-wider ${legendTone}`}
            >
              {t('readerPage.brightness')}
            </label>
            <span className="text-primary-500 text-xs font-semibold tabular-nums">
              {Math.round(brightness * 100)}%
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Sun className="text-ink-muted h-4 w-4" aria-hidden />
            <input
              id="reader-brightness"
              type="range"
              min="0.25"
              max="1"
              step="0.05"
              value={brightness}
              onChange={(e) => onBrightness(parseFloat(e.target.value))}
              className="accent-primary-500 bg-track h-1.5 w-full cursor-pointer appearance-none rounded-2xl"
            />
            <Sun className="text-ink-muted h-5 w-5" aria-hidden />
          </div>
        </div>

        {/* The fontSize preference was stored, applied and persisted, but had no
            control anywhere in the reader — only in profile settings. */}
        <fieldset>
          <legend className={legend}>{t('reader.fontSize')}</legend>
          <div role="radiogroup" aria-label={t('reader.fontSize')} className="flex gap-3">
            {(['sm', 'md', 'lg'] as const).map((size) => (
              <button
                key={size}
                type="button"
                role="radio"
                aria-checked={fontSize === size}
                onClick={() => onFontSize(size)}
                className={`${option} flex-col gap-1 ${fontSize === size ? active : idle}`}
              >
                <Type className="h-4 w-4" aria-hidden="true" />
                <span className="text-xs">
                  {size === 'sm'
                    ? t('legal.sizeSmall')
                    : size === 'md'
                      ? t('legal.sizeMedium')
                      : t('legal.sizeLarge')}
                </span>
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={legend}>{t('readerPage.imageFit')}</legend>
          <div role="radiogroup" aria-label={t('readerPage.imageFit')} className="flex gap-3">
            <button
              type="button"
              role="radio"
              aria-checked={imageFit === 'fit'}
              onClick={() => onImageFit('fit')}
              className={`${option} ${imageFit === 'fit' ? active : idle}`}
            >
              <RectangleHorizontal className="h-5 w-5" aria-hidden="true" />
              {t('readerPage.fit')}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={imageFit === 'full'}
              onClick={() => onImageFit('full')}
              className={`${option} ${imageFit === 'full' ? active : idle}`}
            >
              <Maximize2 className="h-5 w-5" aria-hidden="true" />
              {t('readerPage.fullWidth')}
            </button>
          </div>
        </fieldset>
      </div>
    </ReaderSheet>
  )
}

export default ReaderSettingsSheet
