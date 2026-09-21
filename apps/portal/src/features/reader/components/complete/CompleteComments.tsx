import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CommentsTeaser from '../../../../components/Comments/CommentsTeaser'
import Button from '../../../../components/Button'
import type { StoredComment } from '../../../../lib/comments'

export type CompleteCommentsProps = {
  comments: StoredComment[]
  onOpen: () => void
  onAdd: (content: string, spoiler: boolean) => void
  isAuthenticated: boolean
  darkMode: boolean
  nested: string
}

const CompleteComments = ({
  comments,
  onOpen,
  onAdd,
  isAuthenticated,
  darkMode,
  nested,
}: CompleteCommentsProps) => {
  const { t } = useTranslation()
  const [draft, setDraft] = useState('')
  const [spoiler, setSpoiler] = useState(false)
  const canPost = draft.trim().length > 0

  const submit = () => {
    if (!canPost) return
    onAdd(draft.trim(), spoiler)
    setDraft('')
    setSpoiler(false)
  }

  return (
    <>
      <CommentsTeaser comments={comments} onOpen={onOpen} darkMode={darkMode} />
      {isAuthenticated ? (
        <div
          data-testid="reader-comment-composer"
          className={`mt-3 w-full max-w-md rounded-2xl border p-4 text-left ${nested}`}
        >
          <label className="sr-only" htmlFor="reader-comment-draft">
            {t('readerPage.commentPlaceholder')}
          </label>
          <textarea
            id="reader-comment-draft"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={t('readerPage.commentPlaceholder')}
            rows={3}
            className={`w-full rounded-2xl border p-3 text-sm ${
              darkMode ? 'border-white/10 bg-white/5 text-gray-100' : 'border-gray-200 bg-white'
            }`}
          />
          <div className="mt-3 flex items-center justify-between gap-3">
            <label className="flex min-h-11 items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={spoiler}
                onChange={(event) => setSpoiler(event.target.checked)}
              />
              {t('readerPage.commentSpoiler')}
            </label>
            <Button size="sm" onClick={submit} disabled={!canPost}>
              {t('readerPage.commentPost')}
            </Button>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default CompleteComments
