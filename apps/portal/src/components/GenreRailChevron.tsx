import { ChevronRight } from 'lucide-react'

export type GenreRailChevronSize = 'md' | 'sm'

const SIZE_CLASS: Record<GenreRailChevronSize, string> = {
  md: 'min-h-11 min-w-11',
  sm: 'min-h-[38px] min-w-[38px]',
}

type GenreRailChevronProps = {
  enabled: boolean
  size?: GenreRailChevronSize
  onClick?: () => void
  label?: string
}

const GenreRailChevron = ({ enabled, size = 'md', onClick, label }: GenreRailChevronProps) => {
  const box = `shrink-0 self-center ${SIZE_CLASS[size]}`

  if (!enabled || !onClick || !label) {
    return <span aria-hidden data-testid="genre-rail-chevron-slot" className={box} />
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`text-primary-600 hover:bg-primary-50 focus:ring-primary-500 flex items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200/80 transition focus:ring-2 focus:outline-none ${box}`}
    >
      <ChevronRight className="h-5 w-5" aria-hidden />
    </button>
  )
}

export default GenreRailChevron
