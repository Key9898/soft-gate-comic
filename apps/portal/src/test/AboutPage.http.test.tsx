import { afterEach, describe, expect, it, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import AboutPage from '../features/info/AboutPage'
import { render, screen, waitFor } from './utils'

const jsonRes = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

const SEED_HISTORIES = [
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
]

const SEED_MEMBERS = [
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
]

const EMPTY_ABOUT = {
  histories: [] as unknown[],
  members: [] as unknown[],
  meta: {
    deck: { en: 'Team deck', mm: 'Team deck' },
    standInNote: { en: 'Stand-in', mm: 'Stand-in' },
    standInVisible: true,
  },
}

function aboutCallCount(fetchMock: ReturnType<typeof vi.fn>) {
  return fetchMock.mock.calls.filter(([input]) => String(input).includes('/api/about')).length
}

function stubAboutHttp(about: () => Promise<Response> | Response) {
  vi.stubEnv('VITE_USE_MOCK_API', 'false')
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input)
    if (url.includes('/api/catalog')) {
      return jsonRes(200, { data: { authors: [], genres: [], webtoons: [], episodes: [] } })
    }
    if (url.includes('/api/settings')) {
      return jsonRes(200, { data: {} })
    }
    if (url.includes('/api/about')) {
      return about()
    }
    return jsonRes(401, { error: { code: 'UNAUTHENTICATED' } })
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('AboutPage HTTP about', () => {
  it('groups seed histories and lists members without portrait files', async () => {
    stubAboutHttp(() =>
      jsonRes(200, { data: { ...EMPTY_ABOUT, histories: SEED_HISTORIES, members: SEED_MEMBERS } })
    )
    const { container } = render(<AboutPage />)

    expect(await screen.findByText('January')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our history' })).toBeInTheDocument()
    expect(screen.getByText(/a short 2026 timeline/i)).toBeInTheDocument()
    expect(screen.getAllByText('2026').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('March')).toBeInTheDocument()
    expect(screen.getByText('June')).toBeInTheDocument()
    expect(screen.getByText('December')).toBeInTheDocument()
    expect(screen.getByText('Founded')).toBeInTheDocument()
    expect(screen.getByText('Production path')).toBeInTheDocument()
    expect(screen.queryByText('Next')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/about/team/studio-workspace.jpg"]')).toBeNull()

    expect(screen.getByRole('heading', { name: 'Our team' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nandar Aye' })).toBeInTheDocument()
    expect(screen.getByText('Founder')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Min Khant' })).toBeInTheDocument()
    expect(screen.getByText('Editorial')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Su Myat' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Thiri Win' })).toBeInTheDocument()
    expect(container.querySelector('img[src="/about/team/team-founder.jpg"]')).toBeNull()
    expect(container.querySelector('img[src="/about/team/team-editorial.jpg"]')).toBeNull()
    expect(container.querySelector('img[src="/about/team/team-product.jpg"]')).toBeNull()
    expect(container.querySelector('img[src="/about/team/team-creators.jpg"]')).toBeNull()
    expect(screen.getByText('Stand-in')).toBeInTheDocument()
  })

  it('shows honest empty copy when histories and members are []', async () => {
    stubAboutHttp(() => jsonRes(200, { data: EMPTY_ABOUT }))
    const { container } = render(<AboutPage />)

    expect(
      await screen.findByText('The studio has not published timeline entries yet.')
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our history' })).toBeInTheDocument()
    expect(screen.getByText(/a short 2026 timeline/i)).toBeInTheDocument()
    expect(screen.queryByText('Founded')).not.toBeInTheDocument()
    expect(screen.queryByText('Next')).not.toBeInTheDocument()

    expect(screen.getByRole('heading', { name: 'Our team' })).toBeInTheDocument()
    expect(
      screen.getByText('The studio has not published its public roster yet.')
    ).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Nandar Aye' })).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/about/team/team-founder.jpg"]')).toBeNull()
    expect(screen.getByText('Stand-in')).toBeInTheDocument()
  })

  it('shows fail copy in both sections and retries GET /api/about on 500', async () => {
    const user = userEvent.setup({ delay: null })
    const fetchMock = stubAboutHttp(() => jsonRes(500, { error: { code: 'INTERNAL' } }))
    render(<AboutPage />)

    expect(
      await screen.findByText(/the timeline cannot show until this request succeeds/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/the team cannot show until this request succeeds/i)
    ).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our history' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Our team' })).toBeInTheDocument()
    expect(screen.queryByText('Founded')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Nandar Aye' })).not.toBeInTheDocument()
    const retries = screen.getAllByRole('button', { name: /^retry$/i })
    expect(retries).toHaveLength(2)
    const firstRetry = retries[0]
    if (!firstRetry) throw new Error('expected Retry')
    const before = aboutCallCount(fetchMock)
    await user.click(firstRetry)
    await waitFor(() => {
      expect(aboutCallCount(fetchMock)).toBeGreaterThan(before)
    })
    expect(
      await screen.findByText(/the timeline cannot show until this request succeeds/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/the team cannot show until this request succeeds/i)
    ).toBeInTheDocument()
  })

  it('shows fail copy in both sections when fetch rejects', async () => {
    stubAboutHttp(() => Promise.reject(new Error('network')))
    render(<AboutPage />)

    expect(
      await screen.findByText(/the timeline cannot show until this request succeeds/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/the team cannot show until this request succeeds/i)
    ).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^retry$/i })).toHaveLength(2)
    expect(screen.queryByText('Founded')).not.toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Nandar Aye' })).not.toBeInTheDocument()
  })

  it('hides the stand-in note when standInVisible is false', async () => {
    stubAboutHttp(() =>
      jsonRes(200, {
        data: {
          histories: SEED_HISTORIES,
          members: SEED_MEMBERS,
          meta: {
            deck: { en: 'Team deck', mm: 'Team deck' },
            standInNote: { en: 'CMS stand-in note', mm: 'CMS stand-in note' },
            standInVisible: false,
          },
        },
      })
    )
    render(<AboutPage />)

    expect(await screen.findByRole('heading', { name: 'Nandar Aye' })).toBeInTheDocument()
    expect(screen.queryByText('CMS stand-in note')).not.toBeInTheDocument()
  })

  it('shows the CMS stand-in note when standInVisible is true', async () => {
    stubAboutHttp(() =>
      jsonRes(200, {
        data: {
          histories: SEED_HISTORIES,
          members: SEED_MEMBERS,
          meta: {
            deck: { en: 'Team deck', mm: 'Team deck' },
            standInNote: { en: 'CMS stand-in note', mm: 'CMS stand-in note' },
            standInVisible: true,
          },
        },
      })
    )
    render(<AboutPage />)

    expect(await screen.findByText('CMS stand-in note')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Nandar Aye' })).toBeInTheDocument()
  })

  it('fails Team only when members is missing', async () => {
    stubAboutHttp(() =>
      jsonRes(200, { data: { histories: SEED_HISTORIES, meta: EMPTY_ABOUT.meta } })
    )
    render(<AboutPage />)

    expect(await screen.findByText('January')).toBeInTheDocument()
    expect(screen.getByText('Founded')).toBeInTheDocument()
    expect(
      screen.getByText(/the team cannot show until this request succeeds/i)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/the timeline cannot show until this request succeeds/i)
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^retry$/i })).toHaveLength(1)
    expect(screen.queryByRole('heading', { name: 'Nandar Aye' })).not.toBeInTheDocument()
  })

  it('fails History only when histories is missing', async () => {
    stubAboutHttp(() => jsonRes(200, { data: { members: SEED_MEMBERS, meta: EMPTY_ABOUT.meta } }))
    const { container } = render(<AboutPage />)

    expect(await screen.findByRole('heading', { name: 'Nandar Aye' })).toBeInTheDocument()
    expect(
      screen.getByText(/the timeline cannot show until this request succeeds/i)
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/the team cannot show until this request succeeds/i)
    ).not.toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /^retry$/i })).toHaveLength(1)
    expect(screen.queryByText('Founded')).not.toBeInTheDocument()
    expect(container.querySelector('img[src="/about/team/team-founder.jpg"]')).toBeNull()
  })
})
