import CommentsThread from '../../../components/Comments/CommentsThread'
import type { CommentsThreadController } from '../../../hooks/useCommentsThread'
import { episodeCommentKey } from '../../../lib/comments'

interface ReaderCommentsPanelProps {
  webtoonId: string
  episodeNumber: number
  controller?: CommentsThreadController
  darkMode?: boolean
}

const ReaderCommentsPanel = ({
  webtoonId,
  episodeNumber,
  controller,
  darkMode = false,
}: ReaderCommentsPanelProps) => (
  <CommentsThread
    commentKey={episodeCommentKey(webtoonId, episodeNumber)}
    controller={controller}
    headingMode="count"
    darkMode={darkMode}
  />
)

export default ReaderCommentsPanel
