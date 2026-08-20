import { useEffect, useState } from 'react'
import { Moon, Sun, Type, RectangleHorizontal, Maximize2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  loadReaderPrefs,
  saveReaderPrefs,
  type ReaderFontSize,
  type ReaderImageFit,
  type ReaderPrefs,
} from '../../../lib/reader'

const ReaderPreferencesPanel = () => {
  const { t } = useTranslation()
  const [prefs, setPrefs] = useState<ReaderPrefs>(() => loadReaderPrefs())

  useEffect(() => {
    saveReaderPrefs(prefs)
  }, [prefs])

  const patch = (next: Partial<ReaderPrefs>) => {
    setPrefs((current) => ({ ...current, ...next, schemaVersion: 1 }))
  }

  return (
    <div className="rounded-3xl border bg-white p-6 text-left shadow-sm">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <h3 className="text-lg font-bold text-gray-900">{t('profilePage.preferences')}</h3>
        <span className="rounded-2xl bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-600">
          {t('profilePage.prefsDeviceChip')}
        </span>
      </div>
      <p className="mb-2 text-sm text-gray-500">{t('profilePage.prefsThisBrowser')}</p>
      <p className="mb-6 text-sm text-gray-500">{t('profilePage.prefsLanguageNote')}</p>

      <div className="space-y-6">
        <div>
          <label className="mb-3 block text-sm font-semibold tracking-wider text-gray-400 uppercase">
            {t('profilePage.prefsReaderDark')}
          </label>
          <p className="mb-3 text-xs font-medium text-gray-500">
            {t('profilePage.prefsReaderDarkHint')}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => patch({ darkMode: false })}
              className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                !prefs.darkMode
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Sun className="h-5 w-5" />
              {t('reader.lightMode')}
            </button>
            <button
              type="button"
              onClick={() => patch({ darkMode: true })}
              className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                prefs.darkMode
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
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
            <span className="text-primary-600 text-xs font-bold">
              {Math.round(prefs.brightness * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0.25"
            max="1"
            step="0.05"
            value={prefs.brightness}
            onChange={(e) => patch({ brightness: parseFloat(e.target.value) })}
            className="accent-primary-500 h-1.5 w-full cursor-pointer appearance-none rounded-2xl bg-gray-200"
            aria-label={t('readerPage.brightness')}
          />
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold tracking-wider text-gray-400 uppercase">
            {t('reader.fontSize')}
          </label>
          <div className="flex gap-3">
            {(['sm', 'md', 'lg'] as const).map((size: ReaderFontSize) => (
              <button
                type="button"
                key={size}
                onClick={() => patch({ fontSize: size })}
                className={`min-h-11 flex-1 rounded-2xl border px-3 py-2.5 font-semibold transition ${
                  prefs.fontSize === size
                    ? 'border-primary-500 bg-primary-50 text-primary-600'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Type className="mx-auto h-4 w-4" />
                <span className="mt-1 block text-xs">
                  {size === 'sm'
                    ? t('legal.sizeSmall')
                    : size === 'md'
                      ? t('legal.sizeMedium')
                      : t('legal.sizeLarge')}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-3 block text-sm font-semibold tracking-wider text-gray-400 uppercase">
            {t('readerPage.imageFit')}
          </label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => patch({ imageFit: 'fit' satisfies ReaderImageFit })}
              className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                prefs.imageFit === 'fit'
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <RectangleHorizontal className="h-5 w-5" />
              {t('readerPage.fit')}
            </button>
            <button
              type="button"
              onClick={() => patch({ imageFit: 'full' })}
              className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-2xl border px-4 py-2.5 font-semibold transition ${
                prefs.imageFit === 'full'
                  ? 'border-primary-500 bg-primary-50 text-primary-600'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <Maximize2 className="h-5 w-5" />
              {t('readerPage.fullWidth')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReaderPreferencesPanel
