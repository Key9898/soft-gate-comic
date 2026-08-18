import { FormEvent, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useDebounce } from '../../hooks/useDebounce'
import { addRecentSearch, getSearchSuggestions, type SearchSuggestion } from '../../lib/search'

interface SearchAutocompleteProps {
  className?: string
  inputClassName?: string
  autoFocus?: boolean
}

const SearchAutocomplete = ({
  className = '',
  inputClassName = '',
  autoFocus = false,
}: SearchAutocompleteProps) => {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === 'mm' ? 'mm' : 'en') as 'mm' | 'en'
  const navigate = useNavigate()
  const { webtoons, authors, genres } = useData()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const debounced = useDebounce(query, 300)

  const suggestions = useMemo(
    () =>
      getSearchSuggestions({
        q: debounced,
        webtoons,
        authors,
        genres,
        lang,
        limit: 5,
      }),
    [debounced, webtoons, authors, genres, lang]
  )

  useEffect(() => {
    const onDocClick = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const goSearch = (term: string) => {
    const q = term.trim()
    if (!q) return
    addRecentSearch(q)
    setOpen(false)
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    goSearch(query)
  }

  const onPick = (item: SearchSuggestion) => {
    addRecentSearch(item.label)
    setOpen(false)
    navigate(item.href)
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <form onSubmit={onSubmit} className="relative">
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          placeholder={t('search.placeholder')}
          aria-label={t('search.placeholder')}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open && suggestions.length > 0}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className={
            inputClassName ||
            'focus:ring-primary-500 w-56 rounded-2xl border-none bg-gray-100 py-2 pr-4 pl-10 text-sm transition-all focus:bg-white focus:ring-2'
          }
        />
        <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </form>

      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-72 w-full min-w-[16rem] overflow-auto rounded-2xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((item) => (
            <li key={item.id} role="option" aria-selected={false}>
              <button
                type="button"
                className="hover:bg-primary-50 flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-gray-800"
                onClick={() => onPick(item)}
              >
                <span className="truncate font-medium">{item.label}</span>
                <span className="shrink-0 text-xs text-gray-400">
                  {t(`search.suggestion.${item.kind}`)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchAutocomplete
