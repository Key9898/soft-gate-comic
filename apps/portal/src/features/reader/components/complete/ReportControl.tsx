import { useTranslation } from 'react-i18next'
import Button from '../../../../components/Button'

export type ReportControlProps = {
  reported: boolean
  reportConfirm: boolean
  onAskReport: () => void
  onCancelReport: () => void
  onConfirmReport: () => void
  nested: string
  muted: string
}

const ReportControl = ({
  reported,
  reportConfirm,
  onAskReport,
  onCancelReport,
  onConfirmReport,
  nested,
  muted,
}: ReportControlProps) => {
  const { t } = useTranslation()

  return reported ? (
    <p className={`text-sm font-semibold ${muted}`}>{t('readerPage.reported')}</p>
  ) : reportConfirm ? (
    <div className={`rounded-2xl border p-4 ${nested}`}>
      <p className={`mb-3 text-sm ${muted}`}>{t('readerPage.reportConfirm')}</p>
      <div className="flex justify-center gap-2">
        <Button size="sm" variant="outline" onClick={onCancelReport}>
          {t('common.cancel')}
        </Button>
        <Button size="sm" onClick={onConfirmReport}>
          {t('readerPage.confirmReport')}
        </Button>
      </div>
    </div>
  ) : (
    <button
      type="button"
      onClick={onAskReport}
      className={`min-h-11 rounded-2xl px-3 text-sm font-semibold ${muted}`}
    >
      {t('readerPage.reportEpisode')}
    </button>
  )
}

export default ReportControl
