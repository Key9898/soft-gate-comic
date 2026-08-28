import { useTranslation } from 'react-i18next'
import { ZoomIn, ZoomOut, Settings } from 'lucide-react'
import { LEGAL_FONT_SIZES, type LegalFontSize, type LegalReadingTheme } from './useLegalReadability'

interface ReadabilityControlsProps {
  fontSize: LegalFontSize
  onFontSizeChange: (size: LegalFontSize) => void
  readingTheme: LegalReadingTheme
  onReadingThemeChange: (theme: LegalReadingTheme) => void
}

const SIZE_LABEL_KEYS: Record<LegalFontSize, string> = {
  sm: 'legal.sizeSmall',
  base: 'legal.sizeMedium',
  lg: 'legal.sizeLarge',
  xl: 'legal.sizeXLarge',
}

const ReadabilityControls = ({
  fontSize,
  onFontSizeChange,
  readingTheme,
  onReadingThemeChange,
}: ReadabilityControlsProps) => {
  const { t } = useTranslation()
  const sizeIndex = LEGAL_FONT_SIZES.indexOf(fontSize)

  return (
    <div className="rounded-3xl border border-gray-200/60 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
        <Settings className="text-primary-500 h-4.5 w-4.5" aria-hidden />
        {t('legal.readability')}
      </h3>
      <div className="space-y-4">
        <div role="group" aria-labelledby="legal-zoom-label">
          <p
            id="legal-zoom-label"
            className="text-2xs font-bold tracking-wider text-gray-400 uppercase"
          >
            {t('legal.textZoom')}
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-1.5 rounded-2xl bg-gray-50 p-1">
            <button
              type="button"
              onClick={() => onFontSizeChange(LEGAL_FONT_SIZES[Math.max(0, sizeIndex - 1)])}
              disabled={sizeIndex === 0}
              aria-label={t('legal.zoomOut')}
              className="focus-visible:ring-primary-500 flex min-h-11 flex-1 items-center justify-center rounded-2xl hover:bg-gray-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
            >
              <ZoomOut className="h-4 w-4 text-gray-500" aria-hidden />
            </button>
            <span className="text-2xs w-14 text-center font-bold text-gray-800 uppercase">
              {t(SIZE_LABEL_KEYS[fontSize])}
            </span>
            <button
              type="button"
              onClick={() =>
                onFontSizeChange(
                  LEGAL_FONT_SIZES[Math.min(LEGAL_FONT_SIZES.length - 1, sizeIndex + 1)]
                )
              }
              disabled={sizeIndex === LEGAL_FONT_SIZES.length - 1}
              aria-label={t('legal.zoomIn')}
              className="focus-visible:ring-primary-500 flex min-h-11 flex-1 items-center justify-center rounded-2xl hover:bg-gray-200 focus-visible:ring-2 focus-visible:outline-none disabled:opacity-40"
            >
              <ZoomIn className="h-4 w-4 text-gray-500" aria-hidden />
            </button>
          </div>
        </div>

        <div role="radiogroup" aria-labelledby="legal-contrast-label">
          <p
            id="legal-contrast-label"
            className="text-2xs font-bold tracking-wider text-gray-400 uppercase"
          >
            {t('legal.contrast')}
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-1.5 rounded-2xl bg-gray-50 p-1">
            <button
              type="button"
              role="radio"
              aria-checked={readingTheme === 'default'}
              onClick={() => onReadingThemeChange('default')}
              className={`focus-visible:ring-primary-500 min-h-11 flex-1 rounded-2xl text-xs font-bold uppercase focus-visible:ring-2 focus-visible:outline-none ${
                readingTheme === 'default'
                  ? 'text-primary-600 bg-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('legal.contrastDefault')}
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={readingTheme === 'sepia'}
              onClick={() => onReadingThemeChange('sepia')}
              className={`focus-visible:ring-primary-500 min-h-11 flex-1 rounded-2xl text-xs font-bold uppercase focus-visible:ring-2 focus-visible:outline-none ${
                readingTheme === 'sepia'
                  ? 'bg-amber-100 text-amber-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('legal.contrastSepia')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReadabilityControls
