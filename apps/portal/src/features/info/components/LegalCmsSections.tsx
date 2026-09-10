import { Link } from 'react-router-dom'
import { pickLegalText, type PortalLegalSection } from '../../../lib/legal'
import { LEGAL_H2_CLASS, LEGAL_H3_CLASS } from './LegalPageShell'

const RIGHTS_LINK =
  'focus-visible:ring-primary-500 inline-flex min-h-11 items-center rounded-2xl font-bold text-primary-600 hover:text-primary-700 focus-visible:ring-2 focus-visible:outline-none'

type LegalCmsSectionsProps = {
  sections: PortalLegalSection[]
  language: string
}

const LegalCmsSections = ({ sections, language }: LegalCmsSectionsProps) => {
  const txt = (value: { en: string; mm: string }) => pickLegalText(value, language)

  return (
    <>
      {sections.map((section) => {
        const Heading = section.headingLevel === 'h3' ? 'h3' : 'h2'
        const headingClass = section.headingLevel === 'h3' ? LEGAL_H3_CLASS : LEGAL_H2_CLASS
        const wrapClass =
          section.headingLevel === 'h3' ? 'border-primary-500/35 border-l-2 pl-4' : ''
        const title = txt(section.title)
        const body = txt(section.body)

        return (
          <div key={section.id} className={wrapClass || undefined}>
            <Heading id={section.slug} className={headingClass}>
              {title}
            </Heading>
            {body ? (
              <p
                className={
                  section.headingLevel === 'h3'
                    ? 'mt-1.5 font-semibold opacity-90'
                    : 'mt-3 font-semibold opacity-90'
                }
              >
                {body}
              </p>
            ) : null}
            {section.kind === 'privacy-rights' ? (
              <>
                {section.bullets.length >= 2 ? (
                  <ul className="mt-3 list-disc space-y-2 pl-5 font-semibold opacity-90">
                    <li>
                      <Link to="/profile?tab=security" className={RIGHTS_LINK}>
                        {txt(section.bullets[0]!)}
                      </Link>
                      <span> — {txt(section.bullets[1]!)}</span>
                    </li>
                    {section.bullets.slice(2, 4).map((item, index) => (
                      <li key={index}>{txt(item)}</li>
                    ))}
                  </ul>
                ) : null}
                {section.bullets[4] ? (
                  <p className="mt-3">
                    <Link to="/contact" className={RIGHTS_LINK}>
                      {txt(section.bullets[4])}
                    </Link>
                  </p>
                ) : null}
              </>
            ) : section.kind === 'bullets' && section.bullets.length > 0 ? (
              <ul
                className={
                  body
                    ? 'mt-3 list-disc space-y-1.5 pl-5 font-semibold opacity-90'
                    : 'mt-1.5 list-disc space-y-1.5 pl-5 font-semibold opacity-90'
                }
              >
                {section.bullets.map((item, index) => (
                  <li key={index}>{txt(item)}</li>
                ))}
              </ul>
            ) : null}
          </div>
        )
      })}
    </>
  )
}

export default LegalCmsSections
