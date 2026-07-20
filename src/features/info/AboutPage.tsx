import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, BookOpen, Globe, Heart, Sparkles, Award, Compass } from 'lucide-react'

const AboutPage = () => {
  const { t } = useTranslation()

  const stats = [
    {
      icon: Users,
      value: '1M+',
      label: t('about.readers'),
      color: 'text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20',
    },
    {
      icon: BookOpen,
      value: '10K+',
      label: t('about.webtoons'),
      color: 'text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20',
    },
    {
      icon: Globe,
      value: '50+',
      label: t('about.countries'),
      color: 'text-accent-600 dark:text-accent-500 bg-accent-500/10 dark:bg-accent-500/20',
    },
    {
      icon: Heart,
      value: '5M+',
      label: t('about.likes'),
      color: 'text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-950/20',
    },
  ]

  const milestones = [
    {
      year: '2024',
      title: 'Platform Beta Genesis',
      desc: 'Launched Soft-Gate Comic beta version in Myanmar, partnering with 10 local indie creators to offer original Burmese webtoon chapters.',
      color: 'from-emerald-400 to-teal-600',
    },
    {
      year: '2025',
      title: 'Local Payments & 500K Milestone',
      desc: 'Partnered with KBZPay, WaveMoney, and local banks to integrate MMQR billing. Registered readership grew to over 500,000 active fans.',
      color: 'from-cyan-400 to-primary-600',
    },
    {
      year: '2026',
      title: 'Premium Redevelopment & 1M+ readers',
      desc: 'Overhaul of Soft-Gate Comic client interface, adding floating label validations, metallic payment gateways, coin animations, and dark-theme controls.',
      color: 'from-primary-400 to-accent-600',
    },
  ]

  const coreValues = [
    {
      icon: Sparkles,
      title: t('about.valueQuality'),
      desc: 'Curating the highest resolution art strips and writing narratives for premium reading immersion.',
      color: 'bg-white text-emerald-500 border-gray-100 dark:bg-gray-900 dark:border-white/5',
      iconColor: 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-400',
    },
    {
      icon: Users,
      title: t('about.valueCommunity'),
      desc: 'Building a safe interactive space connecting readers with creators through structured episode reviews and user boards.',
      color: 'bg-white text-blue-500 border-gray-100 dark:bg-gray-900 dark:border-white/5',
      iconColor: 'bg-blue-50 text-blue-500 dark:bg-blue-950/20 dark:text-blue-400',
    },
    {
      icon: Award,
      title: t('about.valueCreators'),
      desc: 'Ensuring fair monetisation payouts, tip gateways, and intellectual copyright bounds protect local Myanmar comic artists.',
      color: 'bg-white text-amber-500 border-gray-100 dark:bg-gray-900 dark:border-white/5',
      iconColor: 'bg-amber-50 text-amber-500 dark:bg-amber-950/20 dark:text-amber-400',
    },
    {
      icon: Compass,
      title: t('about.valueInnovation'),
      desc: 'Delivering lightweight mobile client bundles, responsive dark theme models, and coin purchase checkout timelines.',
      color: 'bg-white text-accent-600 border-gray-100 dark:bg-gray-900 dark:border-white/5',
      iconColor: 'bg-accent-500/10 text-accent-600 dark:bg-accent-500/20 dark:text-accent-500',
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gray-50 pb-20 transition-colors duration-300 dark:bg-gray-950">
      {/* Immersive background soft radial glow overlay */}
      <div className="pointer-events-none absolute top-0 left-1/2 h-[450px] w-full max-w-7xl -translate-x-1/2 bg-[radial-gradient(circle_at_top,rgba(14,148,148,0.08),transparent_65%)] dark:bg-[radial-gradient(circle_at_top,rgba(14,148,148,0.04),transparent_65%)]" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 text-left sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          to="/"
          className="hover:text-primary-600 mb-8 inline-flex items-center gap-2 text-xs font-black tracking-wider text-gray-500 uppercase transition-colors dark:text-gray-400"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('common.back')}
        </Link>

        {/* ═══════════════ SECTION 1: HERO SECTION ═══════════════ */}
        <header className="pt-8 pb-16 sm:pt-12 sm:pb-20">
          <span className="text-primary-500 dark:text-primary-400 text-xs font-black tracking-widest uppercase">
            About Our Company
          </span>
          <h1 className="mt-2.5 text-3xl font-black tracking-tight text-gray-900 sm:text-5xl dark:text-white">
            {t('static.aboutTitle')}
          </h1>
          <p className="border-primary-500 mt-6 max-w-3xl border-l-4 pl-6 text-lg leading-relaxed font-bold text-gray-600 sm:text-xl dark:text-gray-400">
            {t('about.mission')}
          </p>
        </header>

        {/* ═══════════════ SECTION 2: STANDALONE FLOATING STATS ═══════════════ */}
        <section className="mb-20">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                whileHover={{ scale: 1.03, y: -4 }}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 18, delay: idx * 0.08 }}
                className="rounded-3xl border border-gray-200/60 bg-white p-6 text-center shadow-md transition-all duration-300 hover:shadow-xl dark:border-white/5 dark:bg-gray-900"
              >
                <div
                  className={`mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl ${stat.color}`}
                >
                  <stat.icon className="h-5.5 w-5.5" />
                </div>
                <p className="text-3xl font-black text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-2xs mt-1 font-black tracking-widest text-gray-400 uppercase dark:text-gray-500">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════ SECTION 3: STORY TIMELINE (SPLIT VIEW) ═══════════════ */}
        <section className="border-t border-gray-200/60 py-20 dark:border-white/5">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {/* Timeline Left Intro */}
            <div className="space-y-4 lg:col-span-1">
              <h2 className="flex items-center gap-2 text-xl font-black tracking-wider text-gray-900 uppercase dark:text-white">
                <span className="bg-primary-500 h-2.5 w-2.5 rounded-full" />
                {t('about.ourStory')}
              </h2>
              <p className="text-sm leading-relaxed font-bold text-gray-500 dark:text-gray-400">
                {t('about.ourStoryDesc')}
              </p>
            </div>

            {/* Timeline Right Tree */}
            <div className="relative ml-3 space-y-12 border-l-2 border-gray-200/60 pl-8 lg:col-span-2 dark:border-white/5">
              {milestones.map((ms, index) => (
                <motion.div
                  key={ms.year}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.12 }}
                  className="relative"
                >
                  {/* Circle Node pointer */}
                  <div
                    className={`absolute top-1 -left-[45px] flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br ${ms.color} text-[11px] font-black text-white shadow-md ring-4 ring-gray-50 dark:ring-gray-950`}
                  >
                    {index + 1}
                  </div>

                  <div>
                    <span className="text-primary-500 dark:text-primary-400 text-xs font-black tracking-wider uppercase">
                      {ms.year}
                    </span>
                    <h4 className="mt-1 text-base font-black text-gray-900 dark:text-white">
                      {ms.title}
                    </h4>
                    <p className="mt-2 max-w-xl text-xs leading-relaxed font-semibold text-gray-500 dark:text-gray-400">
                      {ms.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ SECTION 4: CORE VALUES GRID ═══════════════ */}
        <section className="border-t border-gray-200/60 py-20 dark:border-white/5">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <h2 className="flex items-center justify-center gap-2 text-xl font-black tracking-wider text-gray-900 uppercase dark:text-white">
              <span className="bg-primary-500 h-2.5 w-2.5 rounded-full" />
              {t('about.ourValues')}
            </h2>
            <p className="mt-2 text-xs font-bold tracking-wider text-gray-400 uppercase dark:text-gray-500">
              The principles that guide our everyday work and growth
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {coreValues.map((val) => (
              <motion.div
                key={val.title}
                whileHover={{ y: -3, scale: 1.01 }}
                className={`rounded-3xl border p-6 shadow-sm transition-all duration-300 ${val.color}`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${val.iconColor}`}
                  >
                    <val.icon className="h-5.5 w-5.5 stroke-[2.2]" />
                  </div>
                  <h4 className="text-base font-black text-gray-900 dark:text-white">
                    {val.title}
                  </h4>
                </div>
                <p className="mt-4 pl-1 text-xs leading-relaxed font-bold text-gray-500 dark:text-gray-400">
                  {val.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ═══════════════ SECTION 5: JOIN US CTA BANNER ═══════════════ */}
        <footer className="mt-12 rounded-3xl border border-gray-200/60 bg-white p-8 text-center shadow-lg dark:border-white/5 dark:bg-gray-900">
          <h3 className="text-lg font-black tracking-wider text-gray-900 uppercase dark:text-white">
            {t('about.joinUs')}
          </h3>
          <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed font-bold text-gray-500 dark:text-gray-400">
            {t('about.joinUsDesc')}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/careers"
              className="bg-primary-600 hover:bg-primary-700 shadow-primary-500/10 flex min-h-[44px] items-center justify-center rounded-2xl px-6 py-2.5 text-xs font-black tracking-wider text-white uppercase shadow-md transition"
            >
              View Openings
            </Link>
            <Link
              to="/contact"
              className="flex min-h-[44px] items-center justify-center rounded-2xl border border-gray-200 px-6 py-2.5 text-xs font-black tracking-wider text-gray-700 uppercase transition hover:bg-gray-50 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            >
              Get In Touch
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default AboutPage
