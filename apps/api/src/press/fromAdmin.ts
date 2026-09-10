import { Prisma } from '@prisma/client'
import { asBilingual } from '../catalog/fromAdmin.js'

export const PRESS_META_ID = 'press'

export type BilingualText = { en: string; mm: string }

export type PortalPressFact = {
  key: string
  label: BilingualText
  value: BilingualText
  href?: string
}

export type PortalPressNews = {
  id: string
  title: BilingualText
  body: BilingualText
  href?: string
  demoBadge?: boolean
}

export type PortalPressStill = {
  id: string
  title: BilingualText
  imageUrl: string
  demoBadge?: boolean
}

export type PortalPressSpokesperson = {
  name: BilingualText
  role: BilingualText
  photoUrl?: string
}

export type PortalPress = {
  copy: Record<string, BilingualText>
  zipUrl: string
  contactEmail: string
  facts: PortalPressFact[]
  palette: Array<{ hex: string; label: BilingualText }>
  assets: Array<{ name: BilingualText; url: string; format: string }>
  news: PortalPressNews[]
  stills: PortalPressStill[]
  spokesperson?: PortalPressSpokesperson
}

export type AdminPressMetaRow = {
  id: string
  copy: unknown
  zipUrl: string
  contactEmail: string
  facts: unknown
  palette: unknown
  assets: unknown
  spokespersonMemberId?: string | null
}

export type AdminPressNewsRow = {
  id: string
  title: unknown
  body: unknown
  href?: string | null
  sortOrder: number
  published: boolean
  demoBadge: boolean
}

export type AdminPressStillRow = {
  id: string
  title: unknown
  imageUrl: string
  sortOrder: number
  published: boolean
  demoBadge: boolean
}

export type AdminAboutTeamMemberRow = {
  id: string
  name: unknown
  role: unknown
  photoUrl?: string | null
  sortOrder: number
  published: boolean
}

const bi = (en: string, mm: string): BilingualText => ({ en, mm })

const FACT_KEYS = [
  'legalName',
  'product',
  'stage',
  'market',
  'hq',
  'founded',
  'platforms',
  'languages',
  'website',
] as const

export const STUB_PRESS: PortalPress = {
  copy: {
    intro: bi(
      'News and media information about SoftGate Comic.',
      'SoftGate Comic နှင့် ပတ်သက်သည့် သတင်းများနှင့် မီဒီယာ အချက်အလက်များ။'
    ),
    boilerplateTitle: bi('About SoftGate Comic', 'SoftGate Comic အကြောင်း'),
    boilerplate: bi(
      'SoftGate Comic is the webtoon reading portal of SoftGate, designed for readers in Myanmar. The platform offers a curated webtoon catalog with English and Myanmar interfaces, episode reading, bookmarks, and a coin-based unlock system. SoftGate Comic is currently a demo portal in active development.',
      'SoftGate Comic သည် SoftGate ၏ ဝဘ်တွန်း ဖတ်ရှုရေး portal ဖြစ်ပြီး မြန်မာစာဖတ်သူများအတွက် ဒီဇိုင်းထုတ်ထားပါသည်။ အင်္ဂလိပ်နှင့် မြန်မာ ဘာသာစကား နှစ်မျိုးဖြင့် ရွေးချယ်ထားသော ဝဘ်တွန်း စာရင်း၊ အပိုင်းလိုက် ဖတ်ရှုခြင်း၊ bookmark နှင့် coin ဖြင့် ဖွင့်ယူသည့် စနစ်တို့ ပါဝင်ပါသည်။ SoftGate Comic သည် လက်ရှိတွင် ဖွံ့ဖြိုးဆဲ demo portal ဖြစ်ပါသည်။'
    ),
    mediaKit: bi('Brand Assets', 'မီဒီယာကိရိယာ'),
    mediaKitDesc: bi(
      'Official SoftGate Comic logo and icon files for media and partner use. Download the ZIP first; single files are also listed.',
      'မီဒီယာနှင့် ပါတနာများ အသုံးပြုရန် SoftGate Comic ၏ တရားဝင် logo နှင့် icon ဖိုင်များ။ ZIP ကို အရင် ဒေါင်းလုဒ်လုပ်ပါ။ တစ်ဖိုင်ချင်းလည်း ရှိပါသည်။'
    ),
    downloadZip: bi('Download media kit', 'မီဒီယာကိရိယာ ဒေါင်းလုဒ်'),
    zipHint: bi(
      'The ZIP contains logo.svg, logo.png, and icon-512.png at the archive root — the same bytes as the files below.',
      'ZIP ထဲတွင် archive ရင်းမြစ်၌ logo.svg၊ logo.png နှင့် icon-512.png သုံးဖိုင် ပါသည် — အောက်ပါ ဖိုင်များနှင့် တူညီသော bytes ဖြစ်သည်။'
    ),
    download: bi('Download', 'ဒေါင်းလုဒ်'),
    paletteTitle: bi('Brand colors', 'အမှတ်အသား အရောင်များ'),
    usageTitle: bi('Logo use', 'Logo အသုံးပြုခြင်း'),
    usageDoTitle: bi('Do', 'လုပ်ပါ'),
    usageDontTitle: bi("Don't", 'မလုပ်ပါနှင့်'),
    usageDo1: bi(
      'Keep the logo colors and proportions as provided.',
      'ပေးထားသော logo အရောင်နှင့် အချိုးအစားကို ထားပါ။'
    ),
    usageDo2: bi('Leave clear space around the mark.', 'အမှတ်ပတ်လည်တွင် နေရာလွတ် ချန်ထားပါ။'),
    usageDo3: bi(
      'Use the provided SVG or PNG files; do not redraw the mark.',
      'ပေးထားသော SVG သို့မဟုတ် PNG ကို သုံးပါ။ အမှတ်ကို ပြန်မဆွဲပါနှင့်။'
    ),
    usageDont1: bi(
      'Do not recolor, stretch, or rotate the logo.',
      'Logo ကို အရောင်ပြင်ခြင်း၊ ဆွဲဆန့်ခြင်း၊ လှည့်ခြင်း မပြုပါနှင့်။'
    ),
    usageDont2: bi(
      'Do not place the logo on a busy background.',
      'နောက်ခံရှုပ်သော နေရာတွင် logo မထားပါနှင့်။'
    ),
    usageDont3: bi(
      'Do not use the browser tab favicon as the logo.',
      'Browser tab favicon ကို logo အဖြစ် မသုံးပါနှင့်။'
    ),
    trademark: bi(
      'SoftGate and SoftGate Comic names and marks are trademarks of SoftGate. Use them only to identify this product.',
      'SoftGate နှင့် SoftGate Comic အမည်နှင့် အမှတ်များသည် SoftGate ၏ trademark များဖြစ်သည်။ ဤထုတ်ကုန်ကို ဖော်ပြရန်သာ သုံးပါ။'
    ),
    factSheet: bi('Fact Sheet', 'အချက်အလက်များ'),
    newsTitle: bi('News', 'သတင်းများ'),
    newsIntro: bi(
      'This is a press-kit archive, not a live newsroom CMS. Public releases will land here when they exist.',
      'ဤစာမျက်နှာသည် press-kit စုစည်းမှုဖြစ်ပြီး တိုက်ရိုက် သတင်းခန်း CMS မဟုတ်ပါ။ အများသုံး ကြေညာချက်များ ရှိလာသောအခါ ဤနေရာတွင် ထည့်သွားပါမည်။'
    ),
    newsSlotTitle: bi('No public press release yet', 'အများသုံး press release မရှိသေး'),
    newsSlotCopy: bi(
      'This Demo row is a client-swap slot. SoftGate Comic has not published public press releases, coverage logos, or traffic metrics.',
      'ဤ Demo အတန်းသည် client-swap နေရာဖြစ်သည်။ SoftGate Comic သည် အများသုံး press release၊ coverage logo သို့မဟုတ် လာရောက်ကြည့်ရှုမှု ကိန်းဂဏန်းများ မထုတ်ပြန်ရသေးပါ။'
    ),
    screenshotsTitle: bi('Product images', 'ထုတ်ကုန်ပုံများ'),
    stillsNote: bi(
      'Guest-open Demo stills of this portal for client swap. Home is the live Home. Hub and Reader cards use always-on Company pages while the published catalog is empty — not a login wall or a 404.',
      'ဤ portal ၏ ဧည့်သည်ဖွင့်နိုင်သော Demo stills ဖြစ်ပြီး client-swap အတွက်ဖြစ်သည်။ ပင်မစာမျက်နှာသည် တကယ့် Home ဖြစ်သည်။ ထုတ်ဝေပြီးသော catalog ဗလာဖြစ်နေစဉ် hub နှင့် Reader ကတ်များသည် အမြဲဖွင့်နိုင်သော Company စာမျက်နှာများကို သုံးသည် — login နံရံ သို့မဟုတ် 404 မဟုတ်ပါ။'
    ),
    spokespersonTitle: bi('Spokesperson', 'ပြောရေးဆိုခွင့်ရှိသူ'),
    deskBadge: bi('Media desk (Demo)', 'မီဒီယာစားပွဲ (Demo)'),
    deskNote: bi(
      'Portrait and name are stand-ins until the studio publishes its public roster. Interview requests go to the media email.',
      'ဓာတ်ပုံနှင့် အမည်သည် စတူဒီယိုက အများပြည်သူ စာရင်း မထုတ်မချင်း ယာယီဖြစ်သည်။ အင်တာဗျူး တောင်းဆိုမှုများကို မီဒီယာအီးမေးလ်သို့ ပို့ပါ။'
    ),
    interviewCta: bi('Request an interview', 'အင်တာဗျူး တောင်းဆိုရန်'),
    contact: bi('Media Contact', 'မီဒီယာ ဆက်သွယ်ရန်'),
    contactDesc: bi(
      'For interviews, media questions, or asset requests, email our media team.',
      'အင်တာဗျူးများ၊ မီဒီယာ မေးမြန်းချက်များ သို့မဟုတ် asset တောင်းဆိုမှုများအတွက် ကျွန်ုပ်တို့၏ မီဒီယာအဖွဲ့ထံ အီးမေးလ် ပို့နိုင်ပါသည်။'
    ),
    contactHours: bi(
      'We are based in Myanmar (Yangon time). We do not publish a reply SLA.',
      'ကျွန်ုပ်တို့သည် မြန်မာနိုင်ငံ (ရန်ကုန် အချိန်) တွင် အခြေစိုက်ပါသည်။ ပြန်ကြားချိန် ကတိ မထားပါ။'
    ),
    otherInquiries: bi(
      'For reader or creator questions, use Contact or Creators — not this press inbox.',
      'စာဖတ်သူ သို့မဟုတ် ဖန်တီးသူ မေးခွန်းများအတွက် ဆက်သွယ်ရန် သို့မဟုတ် ဖန်တီးသူများ စာမျက်နှာကို သုံးပါ — ဤ press inbox မဟုတ်ပါ။'
    ),
    updated: bi('Last updated 10 September 2026', 'နောက်ဆုံး ပြင်ဆင်သည့်ရက် ၁၀ စက်တင်ဘာ ၂၀၂၆'),
  },
  zipUrl: '/press-kit/softgate-comic-press-kit.zip',
  contactEmail: 'press@softgatecomic.com',
  facts: [
    { key: 'legalName', label: bi('Legal name', 'တရားဝင်အမည်'), value: bi('SoftGate', 'SoftGate') },
    {
      key: 'product',
      label: bi('Product', 'ထုတ်ကုန်'),
      value: bi('Webtoon reading portal (web)', 'ဝဘ်တွန်း ဖတ်ရှုရေး portal (web)'),
    },
    {
      key: 'stage',
      label: bi('Stage', 'အဆင့်'),
      value: bi('Demo portal — in development', 'Demo portal — ဖွံ့ဖြိုးဆဲ'),
    },
    { key: 'market', label: bi('Focus market', 'ဦးတည်ဈေးကွက်'), value: bi('Myanmar', 'မြန်မာ') },
    {
      key: 'hq',
      label: bi('Headquarters', 'ရုံးချုပ်'),
      value: bi('Insein, Yangon', 'အင်းစိန်၊ ရန်ကုန်မြို့'),
    },
    { key: 'founded', label: bi('Founded', 'တည်ထောင်သည့်နှစ်'), value: bi('2026', '2026') },
    { key: 'platforms', label: bi('Platforms', 'ပလက်ဖောင်းများ'), value: bi('Web', 'Web') },
    {
      key: 'languages',
      label: bi('Languages', 'ဘာသာစကားများ'),
      value: bi('English & Myanmar', 'အင်္ဂလိပ်နှင့် မြန်မာ'),
    },
    {
      key: 'website',
      label: bi('Website', 'ဝဘ်ဆိုက်'),
      value: bi('https://softgatecomic.com', 'https://softgatecomic.com'),
      href: 'https://softgatecomic.com',
    },
  ],
  palette: [
    { hex: '#0e9494', label: bi('CTA / theme', 'CTA / theme') },
    { hex: '#69c9ca', label: bi('Letter fill', 'စာလုံး ဖြည့်အရောင်') },
    { hex: '#ee3968', label: bi('Burst', 'Burst') },
    { hex: '#ef4124', label: bi('Tip / flame', 'ထိပ် / မီးလျှံ') },
    { hex: '#010101', label: bi('Ink', 'မင်') },
  ],
  assets: [
    {
      name: bi('Primary logo (vector)', 'အဓိက logo (vector)'),
      url: '/logo/logo.svg',
      format: 'SVG',
    },
    { name: bi('Primary logo', 'အဓိက logo'), url: '/logo/logo.png', format: 'PNG' },
    { name: bi('Icon (square)', 'Icon (စတုရန်း)'), url: '/favicon/icon-512.png', format: 'PNG' },
  ],
  news: [],
  stills: [],
}

function asCopy(value: unknown): Record<string, BilingualText> {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}
  const next: Record<string, BilingualText> = { ...STUB_PRESS.copy }
  for (const [key, fallback] of Object.entries(STUB_PRESS.copy)) {
    next[key] = source[key] ? asBilingual(source[key]) : fallback
  }
  return next
}

function asFacts(value: unknown): PortalPressFact[] {
  const source =
    value && typeof value === 'object' && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {}
  return FACT_KEYS.map((key) => {
    const fallback = STUB_PRESS.facts.find((item) => item.key === key)!
    const raw = source[key]
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return fallback
    const row = raw as { label?: unknown; value?: unknown; href?: unknown }
    const fact: PortalPressFact = {
      key,
      label: row.label ? asBilingual(row.label) : fallback.label,
      value: row.value ? asBilingual(row.value) : fallback.value,
    }
    if (typeof row.href === 'string' && row.href.trim()) fact.href = row.href.trim()
    else if (fallback.href) fact.href = fallback.href
    return fact
  })
}

function asPalette(value: unknown): PortalPress['palette'] {
  if (!Array.isArray(value) || value.length === 0) return STUB_PRESS.palette
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return []
    const row = item as { hex?: unknown; label?: unknown }
    if (typeof row.hex !== 'string') return []
    return [{ hex: row.hex, label: asBilingual(row.label) }]
  })
}

function asAssets(value: unknown): PortalPress['assets'] {
  if (!Array.isArray(value) || value.length === 0) return STUB_PRESS.assets
  return value.flatMap((item) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) return []
    const row = item as { name?: unknown; url?: unknown; format?: unknown }
    if (typeof row.url !== 'string' || typeof row.format !== 'string') return []
    return [{ name: asBilingual(row.name), url: row.url, format: row.format }]
  })
}

export function portalNewsFromAdminRows(rows: AdminPressNewsRow[]): PortalPressNews[] {
  return rows
    .filter((row) => row.published)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
    .map((row) => {
      const item: PortalPressNews = {
        id: row.id,
        title: asBilingual(row.title),
        body: asBilingual(row.body),
      }
      if (row.href) item.href = row.href
      if (row.demoBadge) item.demoBadge = true
      return item
    })
}

export function portalStillsFromAdminRows(rows: AdminPressStillRow[]): PortalPressStill[] {
  return rows
    .filter((row) => row.published)
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder || a.id.localeCompare(b.id))
    .map((row) => {
      const item: PortalPressStill = {
        id: row.id,
        title: asBilingual(row.title),
        imageUrl: row.imageUrl,
      }
      if (row.demoBadge) item.demoBadge = true
      return item
    })
}

export function portalSpokespersonFromAdmin(
  spokespersonMemberId: string | null | undefined,
  members: AdminAboutTeamMemberRow[]
): PortalPressSpokesperson | undefined {
  if (!spokespersonMemberId) return undefined
  const row = members.find((item) => item.id === spokespersonMemberId && item.published)
  if (!row) return undefined
  const person: PortalPressSpokesperson = {
    name: asBilingual(row.name),
    role: asBilingual(row.role),
  }
  if (row.photoUrl) person.photoUrl = row.photoUrl
  return person
}

export function portalPressFromAdmin(input: {
  meta: AdminPressMetaRow | null
  news: AdminPressNewsRow[]
  stills: AdminPressStillRow[]
  members: AdminAboutTeamMemberRow[]
}): PortalPress {
  if (!input.meta) {
    return {
      ...STUB_PRESS,
      news: portalNewsFromAdminRows(input.news),
      stills: portalStillsFromAdminRows(input.stills),
    }
  }
  const next: PortalPress = {
    copy: asCopy(input.meta.copy),
    zipUrl: input.meta.zipUrl || STUB_PRESS.zipUrl,
    contactEmail: input.meta.contactEmail || STUB_PRESS.contactEmail,
    facts: asFacts(input.meta.facts),
    palette: asPalette(input.meta.palette),
    assets: asAssets(input.meta.assets),
    news: portalNewsFromAdminRows(input.news),
    stills: portalStillsFromAdminRows(input.stills),
  }
  const spokesperson = portalSpokespersonFromAdmin(input.meta.spokespersonMemberId, input.members)
  if (spokesperson) next.spokesperson = spokesperson
  return next
}

export function isMissingPressTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021'
}
