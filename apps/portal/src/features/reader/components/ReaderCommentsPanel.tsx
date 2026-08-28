import CommentsThread from '../../../components/Comments/CommentsThread'
import { episodeCommentKey } from '../../../lib/comments'

interface ReaderCommentsPanelProps {
  webtoonId: string
  episodeNumber: number
}

const ReaderCommentsPanel = ({ webtoonId, episodeNumber }: ReaderCommentsPanelProps) => (
  <CommentsThread commentKey={episodeCommentKey(webtoonId, episodeNumber)} />
)

export default ReaderCommentsPanel
