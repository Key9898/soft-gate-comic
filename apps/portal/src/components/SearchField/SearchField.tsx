import { forwardRef, type InputHTMLAttributes } from 'react'
import { Search } from 'lucide-react'

export type SearchFieldSize = 'md' | 'lg'

export interface SearchFieldProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'size'
> {
  /** Used for both the visible placeholder and the accessible name. */
  label: string
  size?: SearchFieldSize
  wrapperClassName?: string
}

const SIZES: Record<SearchFieldSize, { field: string; icon: string }> = {
  md: {
    field: 'min-h-11 py-3.5 pl-11 pr-4 text-sm font-bold text-gray-950',
    icon: 'left-4 h-5 w-5',
  },
  lg: {
    field: 'min-h-12 py-4 pl-12 pr-12 text-lg',
    icon: 'left-4 h-6 w-6',
  },
}

/**
 * The filled search field used on Help, FAQ, Library, Search and the 404 page.
 * Help and FAQ shipped byte-identical copies of this markup and Library a third
 * variant, which is how the placeholder colour drifted between them.
 */
const SearchField = forwardRef<HTMLInputElement, SearchFieldProps>(
  ({ label, size = 'md', wrapperClassName = '', className = '', ...props }, ref) => {
    const tokens = SIZES[size]
    return (
      <div className={`relative ${wrapperClassName}`}>
        <input
          ref={ref}
          type="search"
          aria-label={label}
          placeholder={label}
          className={`focus:ring-primary-500 placeholder:text-muted w-full rounded-2xl border-none bg-gray-100 transition focus:bg-white focus:outline-none focus:ring-2 ${tokens.field} ${className}`}
          {...props}
        />
        <Search
          className={`text-muted pointer-events-none absolute top-1/2 -translate-y-1/2 ${tokens.icon}`}
          aria-hidden="true"
        />
      </div>
    )
  }
)

SearchField.displayName = 'SearchField'

export default SearchField
