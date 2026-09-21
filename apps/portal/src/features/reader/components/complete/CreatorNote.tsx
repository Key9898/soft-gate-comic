import { useTranslation } from 'react-i18next'

export type CreatorNoteProps = {
  nested: string
  muted: string
}

const CreatorNote = ({ nested, muted }: CreatorNoteProps) => {
  const { t } = useTranslation()

  return (
    <div className={`mt-6 w-full max-w-md rounded-2xl border p-4 text-left ${nested}`}>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
        {t('readerPage.creatorNote')}
      </p>
      <p className={`text-sm ${muted}`}>{t('readerPage.creatorNoteBody')}</p>
      <span className="text-primary-500 mt-2 inline-block text-xs font-semibold">
        {t('common.demo')}
      </span>
    </div>
  )
}

export default CreatorNote
