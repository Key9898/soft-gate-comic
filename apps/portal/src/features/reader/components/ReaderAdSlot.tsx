import { useTranslation } from 'react-i18next'

type ReaderAdSlotProps = {
  variant: 'mid' | 'end'
  darkMode?: boolean
}

const ReaderAdSlot = ({ variant, darkMode = false }: ReaderAdSlotProps) => {
  const { t } = useTranslation()
  const box = variant === 'end' ? 'min-h-[280px] aspect-square max-h-[360px]' : 'min-h-[120px]'
  const tone = darkMode
    ? 'border-white/10 bg-white/5 text-gray-400'
    : 'border-gray-200 bg-gray-100 text-gray-500'

  return (
    <aside
      data-testid={variant === 'end' ? 'reader-ad-end' : 'reader-ad-mid'}
      role="complementary"
      aria-label={t('readerPage.advertisement')}
      className={`flex w-full flex-col items-center justify-center gap-1 border-y px-4 py-6 ${box} ${tone}`}
    >
      <p className="text-xs font-semibold tracking-wider uppercase">
        {t('readerPage.advertisement')}
      </p>
      <p className="max-w-xs text-center text-xs">{t('readerPage.adDemo')}</p>
      <span className="text-2xs font-semibold tracking-wider uppercase">{t('common.demo')}</span>
    </aside>
  )
}

export default ReaderAdSlot
