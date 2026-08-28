import { LayoutGrid, ListOrdered, Sparkles } from 'lucide-react'

export const SEARCH_PAGE_INPUT_CLASS =
  'focus:ring-primary-500 w-full rounded-2xl border-none bg-gray-100 py-4 pr-12 pl-12 text-lg transition focus:bg-white focus:ring-2'

export const SEARCH_PAGE_ICON_CLASS =
  'pointer-events-none absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-gray-400'

export const SEARCH_DEST_LINK =
  'hover:border-primary-300 focus-visible:ring-primary-500 flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition-colors focus-visible:ring-2 focus-visible:outline-none'

export const SEARCH_DESTINATIONS = [
  { to: '/categories', labelKey: 'nav.categories', icon: LayoutGrid },
  { to: '/ranking', labelKey: 'home.ranking', icon: ListOrdered },
  { to: '/categories?sort=new', labelKey: 'home.newReleases', icon: Sparkles },
] as const
