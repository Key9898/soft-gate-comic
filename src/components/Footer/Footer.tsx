import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()

  const footerLinks = {
    company: [
      { name: t('footer.about'), path: '/about' },
      { name: t('footer.creators'), path: '/creators' },
      { name: t('footer.press'), path: '/press' },
    ],
    support: [
      { name: t('footer.help'), path: '/help' },
      { name: t('footer.contact'), path: '/contact' },
      { name: t('footer.faq'), path: '/faq' },
    ],
    legal: [
      { name: t('footer.privacy'), path: '/privacy' },
      { name: t('footer.terms'), path: '/terms' },
      { name: t('footer.cookies'), path: '/cookies' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              to="/"
              className="text-primary-400 flex items-center gap-3 rounded-2xl focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
            >
              <img
                src="/logo/logo.svg"
                alt="SoftGate Comic Logo"
                className="h-10 w-auto object-contain"
              />
              <span className="text-lg font-bold tracking-tight text-white">SoftGate Comic</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">{t('footer.description')}</p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">{t('footer.company')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="rounded-2xl text-sm text-gray-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">{t('footer.support')}</h3>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="rounded-2xl text-sm text-gray-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">{t('footer.legal')}</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="rounded-2xl text-sm text-gray-400 transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className="text-sm text-gray-500">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
