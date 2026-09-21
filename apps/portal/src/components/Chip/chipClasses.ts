export type ChipTone = 'filter' | 'genre'

const TONES: Record<ChipTone, { on: string; off: string }> = {
  filter: {
    on: 'bg-primary-50 text-primary-700 ring-1 ring-primary-200',
    off: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
  },
  genre: {
    on: 'bg-primary-600 text-white',
    off: 'bg-gray-100 text-gray-700 hover:bg-gray-200',
  },
}

export const CHIP_BASE =
  'px-4.5 focus-visible:ring-primary-500 relative flex min-h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-chip py-2.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2'

export function chipClasses(selected: boolean, tone: ChipTone = 'filter', className = '') {
  return `${CHIP_BASE} ${selected ? TONES[tone].on : TONES[tone].off} ${className}`.trim()
}
