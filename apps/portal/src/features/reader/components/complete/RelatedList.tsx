import { Link } from 'react-router-dom'
import type { Webtoon } from '@softgate/shared'

export type RelatedListProps = {
  related: Webtoon[]
  lang: 'mm' | 'en'
  nested: string
  titleClass: string
}

const RELATED_MAX = 3

const RelatedList = ({ related, lang, nested, titleClass }: RelatedListProps) => {
  return (
    <ul className="space-y-2" data-testid="reader-related">
      {related.slice(0, RELATED_MAX).map((item) => (
        <li key={item.id}>
          <Link
            to={`/webtoon/${item.id}`}
            className={`flex min-h-11 items-center gap-3 rounded-2xl border px-3 py-2 ${nested}`}
          >
            {item.coverImage ? (
              <img
                src={item.coverImage}
                alt=""
                className="book-media book-media-shadow h-12 w-9 shrink-0 object-cover"
              />
            ) : null}
            <span className={`truncate text-sm font-bold ${titleClass}`}>{item.title[lang]}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default RelatedList
