import { NextResponse } from 'next/server'
import { getTokenForCreator } from '@/lib/instagram'
import { getFreshTikTokToken } from '@/lib/tiktok'
import type { Creator } from '@/lib/types'

// Live analytics from the Instagram Graph API (+ TikTok user info where scoped).
// Called by AnalyticsView; refreshed on demand.

export const dynamic = 'force-dynamic'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']
const GRAPH = 'https://graph.instagram.com/v21.0'

type IgStats = {
  connected: boolean
  username?: string
  followers?: number
  following?: number
  mediaCount?: number
  reach7d?: number | null
  views7d?: number | null
  profileViews7d?: number | null
  accountsEngaged7d?: number | null
  interactions7d?: number | null
  error?: string
}

type TtStats = {
  connected: boolean
  displayName?: string
  followers?: number | null
  likes?: number | null
  videos?: number | null
  error?: string
}

async function igInsight(
  token: string,
  metric: string,
  totalValue: boolean
): Promise<number | null> {
  const since = Math.floor(Date.now() / 1000) - 7 * 86400
  const until = Math.floor(Date.now() / 1000)
  const extra = totalValue ? '&metric_type=total_value' : ''
  try {
    // /me resolves to the token's own account — avoids "Object with ID does not
    // exist" errors when the stored numeric ID differs from the professional ID.
    const res = await fetch(
      `${GRAPH}/me/insights?metric=${metric}&period=day&since=${since}&until=${until}${extra}&access_token=${token}`,
      { cache: 'no-store' }
    )
    const j = await res.json()
    if (!res.ok) return null
    const data = j.data?.[0]
    if (!data) return null
    if (data.total_value) return data.total_value.value ?? null
    if (Array.isArray(data.values)) {
      return data.values.reduce((s: number, v: { value?: number }) => s + (v.value || 0), 0)
    }
    return null
  } catch {
    return null
  }
}

async function fetchIg(creator: Creator): Promise<IgStats> {
  const token = getTokenForCreator(creator)
  if (!token) return { connected: false }

  const out: IgStats = { connected: true }
  try {
    // /me instead of /{id} — the stored numeric ID can be the app-scoped one,
    // which GET rejects with "Unsupported get request" even though publishing works.
    const res = await fetch(
      `${GRAPH}/me?fields=username,followers_count,follows_count,media_count&access_token=${token}`,
      { cache: 'no-store' }
    )
    const j = await res.json()
    if (res.ok) {
      out.username = j.username
      out.followers = j.followers_count ?? 0
      out.following = j.follows_count ?? 0
      out.mediaCount = j.media_count ?? 0
    } else {
      out.error = j?.error?.message || 'profile fetch failed'
    }
  } catch (e) {
    out.error = e instanceof Error ? e.message : String(e)
  }

  // 7-day insights — each metric fetched independently; nulls tolerated
  const [reach, views, profileViews, engaged, interactions] = await Promise.all([
    igInsight(token, 'reach', false),
    igInsight(token, 'views', true),
    igInsight(token, 'profile_views', true),
    igInsight(token, 'accounts_engaged', true),
    igInsight(token, 'total_interactions', true),
  ])
  out.reach7d = reach
  out.views7d = views
  out.profileViews7d = profileViews
  out.accountsEngaged7d = engaged
  out.interactions7d = interactions
  return out
}

async function fetchTikTok(creator: Creator): Promise<TtStats> {
  const token = await getFreshTikTokToken(creator)
  if (!token) return { connected: false }
  const out: TtStats = { connected: true }
  try {
    const res = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=display_name,follower_count,likes_count,video_count',
      { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }
    )
    const j = await res.json()
    if (res.ok && j.data?.user) {
      out.displayName = j.data.user.display_name
      out.followers = j.data.user.follower_count ?? null
      out.likes = j.data.user.likes_count ?? null
      out.videos = j.data.user.video_count ?? null
    } else {
      const raw = j?.error?.message || 'stats unavailable'
      out.error = raw.includes('access token is invalid')
        ? 'Token expired — reconnect at /connect (also add TIKTOK_REFRESH_TOKEN_* env for auto-refresh)'
        : raw
    }
  } catch (e) {
    out.error = e instanceof Error ? e.message : String(e)
  }
  return out
}

export async function GET() {
  const result: Record<string, { instagram: IgStats; tiktok: TtStats }> = {}
  await Promise.all(
    CREATORS.map(async (c) => {
      const [instagram, tiktok] = await Promise.all([fetchIg(c), fetchTikTok(c)])
      result[c] = { instagram, tiktok }
    })
  )
  return NextResponse.json({ creators: result, fetchedAt: new Date().toISOString() })
}
