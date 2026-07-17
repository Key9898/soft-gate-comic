import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Facebook, Send, Instagram, Youtube } from 'lucide-react'

const Footer = () => {
  const { t } = useTranslation()

  const footerLinks = {
    company: [
      { name: t('footer.about'), path: '/about' },
      { name: t('footer.careers'), path: '/careers' },
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

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Send, href: '#', label: 'Telegram' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="text-primary-400 flex items-center gap-3 focus:outline-none">
              <img
                src="/logo/logo.jpg"
                alt="Soft-Gate Comic Logo"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <span className="text-lg font-black tracking-tight text-white">Soft-Gate Comic</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400">{t('footer.description')}</p>
            <div className="mt-6 flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="p-2 text-gray-400 transition-colors hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-white">{t('footer.company')}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-400 transition-colors hover:text-white"
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
                    className="text-sm text-gray-400 transition-colors hover:text-white"
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
                    className="text-sm text-gray-400 transition-colors hover:text-white"
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
