import { useState, type MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { BookOpen, ChevronDown } from 'lucide-react'
import { useScrollSpy } from './useScrollSpy'

export interface LegalTocSection {
  id: string
  label: string
  sub?: boolean
}

interface LegalTocSidebarProps {
  sections: LegalTocSection[]
}

const LegalTocSidebar = ({ sections }: LegalTocSidebarProps) => {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { activeId, setActiveId } = useScrollSpy(sections.map((sec) => sec.id))

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    event.preventDefault()
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(null, '', `#${id}`)
    setActiveId(id)
  }

  return (
    <div className="rounded-3xl border border-gray-200/60 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
          <BookOpen className="text-primary-500 h-4.5 w-4.5" aria-hidden />
          {t('legal.toc')}
        </h3>
        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={t('legal.toc')}
          className="focus-visible:ring-primary-500 -my-2 flex min-h-11 min-w-11 items-center justify-center rounded-2xl text-gray-400 hover:text-gray-600 focus-visible:ring-2 focus-visible:outline-none lg:hidden"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
      </div>
      <nav
        aria-label={t('legal.toc')}
        className={`${mobileOpen ? 'mt-4 block' : 'hidden'} scrollbar-thin-primary max-h-[50vh] space-y-1 overflow-y-auto overscroll-y-contain pr-1 lg:mt-4 lg:block`}
      >
        {sections.map((sec) => (
          <a
            key={sec.id}
            href={`#${sec.id}`}
            onClick={(event) => handleClick(event, sec.id)}
            aria-current={activeId === sec.id ? 'location' : undefined}
            className={`focus-visible:ring-primary-500 flex w-full rounded-2xl px-2 py-2.5 text-left text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:outline-none ${
              sec.sub ? 'pl-6' : ''
            } ${
              activeId === sec.id
                ? 'text-primary-600 bg-primary-50/50'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="truncate">{sec.label}</span>
          </a>
        ))}
      </nav>
    </div>
  )
}

export default LegalTocSidebar
