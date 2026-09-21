import { SeriesRatingControl } from '../../../../components/SeriesRating'

export type RatingControlProps = {
  webtoonId: string
  darkMode: boolean
}

const RatingControl = ({ webtoonId, darkMode }: RatingControlProps) => {
  return (
    <div className="mb-6 w-full max-w-md">
      <SeriesRatingControl webtoonId={webtoonId} variant="card" darkMode={darkMode} />
    </div>
  )
}

export default RatingControl
