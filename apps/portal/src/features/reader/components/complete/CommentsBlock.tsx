import CommentsTeaser from '../../../../components/Comments/CommentsTeaser'
import type { StoredComment } from '../../../../lib/comments'

export type CommentsBlockProps = {
  comments: StoredComment[]
  onOpenComments: () => void
  darkMode: boolean
}

const CommentsBlock = ({ comments, onOpenComments, darkMode }: CommentsBlockProps) => {
  return <CommentsTeaser comments={comments} onOpen={onOpenComments} darkMode={darkMode} />
}

export default CommentsBlock
