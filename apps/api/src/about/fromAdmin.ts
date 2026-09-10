import { Prisma } from '@prisma/client'
import { asBilingual } from '../catalog/fromAdmin.js'

export const ABOUT_TEAM_META_ID = 'about-team'

export type BilingualText = { en: string; mm: string }

export type PortalAboutHistory = {
  id: string
  year: number
  month: number
  title: BilingualText
  description: BilingualText
  sortOrder: number
  photoUrl?: string
}

export type PortalAboutMember = {
  id: string
  name: BilingualText
  role: BilingualText
  sortOrder: number
  photoUrl?: string
}

export type PortalAboutMeta = {
  deck: BilingualText
  standInNote: BilingualText
  standInVisible: boolean
}

export type PortalAbout = {
  histories: PortalAboutHistory[]
  members: PortalAboutMember[]
  meta: PortalAboutMeta
}

export type AdminAboutHistoryRow = {
  id: string
  year: number
  month: number
  title: unknown
  description: unknown
  photoUrl?: string | null
  sortOrder: number
  published: boolean
}

export type AdminAboutTeamMemberRow = {
  id: string
  name: unknown
  role: unknown
  photoUrl?: string | null
  sortOrder: number
  published: boolean
}

export type AdminAboutTeamMetaRow = {
  id: string
  deck: unknown
  standInNote: unknown
  standInVisible: boolean
}

const STUB_META: PortalAboutMeta = {
  deck: {
    en: 'The public-facing studio roles for this portal.',
    mm: 'ဤ portal အတွက် အများပြည်သူသို့ ပြသသော စတူဒီယို ရာထူးများ။',
  },
  standInNote: {
    en: 'Portraits and names are stand-ins until the studio publishes its public roster.',
    mm: 'ပုံတူများနှင့် နာမည်များသည် စတူဒီယိုက အများပြည်သူ စာရင်း မထုတ်မီ ယာယီ အစားထိုးများ ဖြစ်သည်။',
  },
  standInVisible: true,
}

export const STUB_ABOUT: PortalAbout = {
  histories: [
    {
      id: 'h1',
      year: 2026,
      month: 1,
      title: { en: 'Founded', mm: 'တည်ထောင်ခြင်း' },
      description: {
        en: 'A Myanmar-first webtoon studio starts building a local reading portal.',
        mm: 'မြန်မာဦးစားပေး webtoon စတူဒီယိုက ဒေသခံ ဖတ်ရှုရေး portal တည်ဆောက်ရန် စတင်သည်။',
      },
      sortOrder: 0,
    },
    {
      id: 'h2',
      year: 2026,
      month: 3,
      title: { en: 'Portal', mm: 'Portal' },
      description: {
        en: 'Catalog, episode reader, and English plus Myanmar ship in the same product.',
        mm: 'Catalog၊ အပိုင်းဖတ်ရှုခြင်းနှင့် အင်္ဂလိပ်-မြန်မာကို ထုတ်ကုန်တစ်ခုတည်းတွင် တင်ဆက်သည်။',
      },
      sortOrder: 0,
    },
    {
      id: 'h3',
      year: 2026,
      month: 6,
      title: { en: 'Demo wallet', mm: 'ဒီမို ပိုက်ဆံအိတ်' },
      description: {
        en: 'Coins unlock premium episodes on this device only.',
        mm: 'Coins ဖြင့် premium အပိုင်းများကို ဤစက်ပေါ်တွင်သာ ဖွင့်သည်။',
      },
      sortOrder: 0,
    },
    {
      id: 'h4',
      year: 2026,
      month: 12,
      title: { en: 'Production path', mm: 'ထုတ်လုပ်ရေး လမ်း' },
      description: {
        en: 'Real APIs and creator tools are the aim — not a claim that they already ship.',
        mm: 'အမှန်တကယ် API နှင့် ဖန်တီးသူကိရိယာများသည် ရည်မှန်းချက် — ယခု တင်ပြီးသားဟု မဆိုလို။',
      },
      sortOrder: 0,
    },
  ],
  members: [
    {
      id: 'm1',
      name: { en: 'Nandar Aye', mm: 'နန္ဒာအေး' },
      role: { en: 'Founder', mm: 'တည်ထောင်သူ' },
      sortOrder: 0,
    },
    {
      id: 'm2',
      name: { en: 'Min Khant', mm: 'မင်းခန့်' },
      role: { en: 'Editorial', mm: 'အယ်ဒီတာ' },
      sortOrder: 1,
    },
    {
      id: 'm3',
      name: { en: 'Su Myat', mm: 'စုမြတ်' },
      role: { en: 'Product', mm: 'ထုတ်ကုန်' },
      sortOrder: 2,
    },
    {
      id: 'm4',
      name: { en: 'Thiri Win', mm: 'သီရိဝင်း' },
      role: { en: 'Creator partnerships', mm: 'ဖန်တီးသူ ပူးပေါင်းဆောင်ရွက်ရေး' },
      sortOrder: 3,
    },
  ],
  meta: STUB_META,
}

function optionalPhoto(photoUrl: string | null | undefined): string | undefined {
  return photoUrl ? photoUrl : undefined
}

function compareHistory(a: PortalAboutHistory, b: PortalAboutHistory): number {
  if (a.year !== b.year) return a.year - b.year
  if (a.month !== b.month) return a.month - b.month
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
  return a.id.localeCompare(b.id)
}

function compareMember(a: PortalAboutMember, b: PortalAboutMember): number {
  if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
  return a.id.localeCompare(b.id)
}

export function portalHistoriesFromAdminRows(rows: AdminAboutHistoryRow[]): PortalAboutHistory[] {
  const mapped: PortalAboutHistory[] = []
  for (const row of rows) {
    if (!row.published) continue
    const item: PortalAboutHistory = {
      id: row.id,
      year: row.year,
      month: row.month,
      title: asBilingual(row.title),
      description: asBilingual(row.description),
      sortOrder: row.sortOrder,
    }
    const photoUrl = optionalPhoto(row.photoUrl)
    if (photoUrl) item.photoUrl = photoUrl
    mapped.push(item)
  }
  return mapped.sort(compareHistory)
}

export function portalMembersFromAdminRows(rows: AdminAboutTeamMemberRow[]): PortalAboutMember[] {
  const mapped: PortalAboutMember[] = []
  for (const row of rows) {
    if (!row.published) continue
    const item: PortalAboutMember = {
      id: row.id,
      name: asBilingual(row.name),
      role: asBilingual(row.role),
      sortOrder: row.sortOrder,
    }
    const photoUrl = optionalPhoto(row.photoUrl)
    if (photoUrl) item.photoUrl = photoUrl
    mapped.push(item)
  }
  return mapped.sort(compareMember)
}

export function portalMetaFromAdminRow(row: AdminAboutTeamMetaRow | null): PortalAboutMeta {
  if (!row) return STUB_META
  return {
    deck: asBilingual(row.deck),
    standInNote: asBilingual(row.standInNote),
    standInVisible: row.standInVisible,
  }
}

export function isMissingAboutTable(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2021'
}
