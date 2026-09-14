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
  iconClassName?: string
  autoFocus?: boolean
  defaultQuery?: string
}

const SearchAutocomplete = ({
  className = '',
  inputClassName = '',
  iconClassName = 'pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted',
  autoFocus = false,
  defaultQuery = '',
}: SearchAutocompleteProps) => {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === 'mm' ? 'mm' : 'en') as 'mm' | 'en'
  const navigate = useNavigate()
  const { webtoons, authors, genres } = useData()
  const listId = useId()
  const rootRef = useRef<HTMLDivElement>(null)

  const [query, setQuery] = useState(defaultQuery)
  const [open, setOpen] = useState(false)
  // -1 means "no option is active": the combobox still commits the typed query on
  // Enter, which is the behaviour a visitor expects before they arrow into the list.
  const [activeIndex, setActiveIndex] = useState(-1)
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
    setQuery(defaultQuery)
  }, [defaultQuery])

  useEffect(() => {
    setActiveIndex(-1)
  }, [debounced])

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
    setActiveIndex(-1)
    navigate(item.href)
  }

  const isOpen = open && suggestions.length > 0

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      if (isOpen) {
        e.preventDefault()
        setOpen(false)
        setActiveIndex(-1)
      }
      return
    }
    if (e.key === 'Enter') {
      if (isOpen && activeIndex >= 0) {
        e.preventDefault()
        onPick(suggestions[activeIndex])
      }
      return
    }
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'Home' && e.key !== 'End') {
      return
    }
    if (!isOpen) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        e.preventDefault()
        setOpen(true)
        setActiveIndex(0)
      }
      return
    }
    e.preventDefault()
    const last = suggestions.length - 1
    if (e.key === 'Home') return setActiveIndex(0)
    if (e.key === 'End') return setActiveIndex(last)
    // Functional updates: held arrow keys can fire several times before a render.
    if (e.key === 'ArrowDown') {
      return setActiveIndex((current) => (current >= last ? -1 : current + 1))
    }
    setActiveIndex((current) => (current <= -1 ? last : current - 1))
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
          role="combobox"
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={isOpen}
          aria-activedescendant={
            isOpen && activeIndex >= 0 ? `${listId}-option-${activeIndex}` : undefined
          }
          onKeyDown={onKeyDown}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className={
            inputClassName ||
            'focus:ring-primary-500 w-56 rounded-2xl border-none bg-gray-100 py-2 pl-10 pr-4 text-sm transition-all focus:bg-white focus:ring-2'
          }
        />
        <Search className={iconClassName} aria-hidden="true" />
      </form>

      {isOpen && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-72 w-full min-w-[16rem] overflow-auto rounded-2xl border border-gray-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((item, index) => (
            <li
              key={item.id}
              id={`${listId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onMouseEnter={() => setActiveIndex(index)}
              className={index === activeIndex ? 'bg-primary-50' : ''}
            >
              <button
                type="button"
                tabIndex={-1}
                className="hover:bg-primary-50 flex min-h-11 w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm text-gray-800"
                onClick={() => onPick(item)}
              >
                <span className="truncate font-medium">{item.label}</span>
                <span className="text-muted shrink-0 text-xs">
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
