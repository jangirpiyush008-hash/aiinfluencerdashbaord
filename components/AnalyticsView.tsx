'use client'
import { CREATOR_META, Creator } from '@/lib/types'
import { CALENDAR } from '@/lib/calendar'
import { STORIES } from '@/lib/stories'
import { isDone } from '@/lib/doneState'
import { useCallback, useEffect, useMemo, useState } from 'react'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']

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

type Analytics = {
  creators: Record<Creator, { instagram: IgStats; tiktok: TtStats }>
  fetchedAt: string
}

const fmt = (n: number | null | undefined) =>
  n === null || n === undefined ? '—' : n.toLocaleString()

type PlatformTab = 'combined' | 'instagram' | 'tiktok'

export default function AnalyticsView() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tab, setTab] = useState<PlatformTab>('combined')

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    fetch('/api/analytics', { cache: 'no-store' })
      .then((r) => r.json())
      .then((j) => setData(j))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  // Published counts from the local done-state
  const published = useMemo(() => {
    const posts = CALENDAR.filter((p) => isDone(p.id)).length
    const stories = STORIES.filter((s) => isDone(s.id)).length
    return { posts, stories }
  }, [])

  // Combined totals across creators
  const totals = useMemo(() => {
    if (!data?.creators) return null
    let igFollowers = 0, ttFollowers = 0, reach = 0, views = 0, engaged = 0, interactions = 0
    let hasReach = false, hasViews = false, hasEngaged = false, hasInteractions = false
    for (const c of CREATORS) {
      const s = data.creators[c]
      if (!s) continue
      igFollowers += s.instagram.followers ?? 0
      ttFollowers += s.tiktok.followers ?? 0
      if (s.instagram.reach7d != null) { reach += s.instagram.reach7d; hasReach = true }
      if (s.instagram.views7d != null) { views += s.instagram.views7d; hasViews = true }
      if (s.instagram.accountsEngaged7d != null) { engaged += s.instagram.accountsEngaged7d; hasEngaged = true }
      if (s.instagram.interactions7d != null) { interactions += s.instagram.interactions7d; hasInteractions = true }
    }
    return {
      igFollowers, ttFollowers,
      allFollowers: igFollowers + ttFollowers,
      reach7d: hasReach ? reach : null,
      views7d: hasViews ? views : null,
      engaged7d: hasEngaged ? engaged : null,
      interactions7d: hasInteractions ? interactions : null,
    }
  }, [data])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold mb-2">📊 Analytics</h2>
          <p className="text-neutral-400 max-w-3xl">
            Live metrics pulled from the platform APIs per creator.
            {data?.fetchedAt && (
              <span className="text-neutral-500"> · Updated {new Date(data.fetchedAt).toLocaleTimeString()}</span>
            )}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="text-sm bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 disabled:opacity-50 text-white px-4 py-2 rounded-xl font-semibold"
        >
          {loading ? '⏳ Refreshing…' : '🔄 Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3 text-sm text-red-200">
          Failed to load analytics: {error}
        </div>
      )}

      {/* PLATFORM TABS */}
      <div className="flex gap-2">
        <PlatformTabButton active={tab === 'instagram'} onClick={() => setTab('instagram')} icon="📷" label="Instagram" gradient="from-pink-500 to-orange-500" />
        <PlatformTabButton active={tab === 'tiktok'} onClick={() => setTab('tiktok')} icon="🎵" label="TikTok" gradient="from-cyan-500 to-pink-500" />
        <PlatformTabButton active={tab === 'combined'} onClick={() => setTab('combined')} icon="🌐" label="Combined" gradient="from-emerald-500 to-sky-500" />
      </div>

      {/* HERO STATS — adapt to selected platform */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tab === 'instagram' && (
          <>
            <StatCard label="IG followers" value={totals ? fmt(totals.igFollowers) : '…'} sub="all 4 accounts" />
            <StatCard label="Reach last 7d" value={totals ? fmt(totals.reach7d) : '…'} sub="IG insights" />
            <StatCard label="Views last 7d" value={totals ? fmt(totals.views7d) : '…'} sub="IG insights" />
            <StatCard label="Interactions 7d" value={totals ? fmt(totals.interactions7d) : '…'} sub={`engaged: ${totals ? fmt(totals.engaged7d) : '…'}`} />
          </>
        )}
        {tab === 'tiktok' && (
          <>
            <StatCard label="TT followers" value={totals ? fmt(totals.ttFollowers) : '…'} sub="Mia + Ava" />
            <StatCard label="TT likes" value={data ? fmt(CREATORS.reduce((s, c) => s + (data.creators[c]?.tiktok.likes ?? 0), 0)) : '…'} sub="total hearts" />
            <StatCard label="TT videos" value={data ? fmt(CREATORS.reduce((s, c) => s + (data.creators[c]?.tiktok.videos ?? 0), 0)) : '…'} sub="published" />
            <StatCard label="Accounts live" value={data ? `${CREATORS.filter((c) => data.creators[c]?.tiktok.connected).length} / 2` : '…'} sub="tokens active" />
          </>
        )}
        {tab === 'combined' && (
          <>
            <StatCard label="Total followers" value={totals ? fmt(totals.allFollowers) : '…'} sub={`IG ${totals ? fmt(totals.igFollowers) : '…'} · TT ${totals ? fmt(totals.ttFollowers) : '…'}`} />
            <StatCard label="Reach last 7d" value={totals ? fmt(totals.reach7d) : '…'} sub="all accounts combined" />
            <StatCard label="Views last 7d" value={totals ? fmt(totals.views7d) : '…'} sub="all accounts combined" />
            <StatCard label="Interactions 7d" value={totals ? fmt(totals.interactions7d) : '…'} sub={`engaged: ${totals ? fmt(totals.engaged7d) : '…'}`} />
          </>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Posts published" value={`${published.posts} / ${CALENDAR.length}`} sub="marked done on dashboard" />
        <StatCard label="Stories posted" value={`${published.stories} / ${STORIES.length}`} sub="marked done on dashboard" />
        <StatCard label="IG accounts live" value={data ? `${CREATORS.filter(c => data.creators[c]?.instagram.connected).length} / 4` : '…'} sub="tokens active" />
        <StatCard label="TT accounts live" value={data ? `${CREATORS.filter(c => data.creators[c]?.tiktok.connected).length} / 2` : '…'} sub="Mia + Ava only" />
      </div>

      {/* PER-CREATOR DETAIL */}
      <div>
        <h3 className="text-xl font-bold mb-4">By Creator — full detail</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CREATORS.filter((c) => tab !== 'tiktok' || CREATOR_META[c].tiktokAvailable).map((c) => {
            const meta = CREATOR_META[c]
            const s = data?.creators?.[c]
            const ig = s?.instagram
            const tt = s?.tiktok
            const totalPosts = CALENDAR.filter((p) => p.creator === c).length
            const donePosts = CALENDAR.filter((p) => p.creator === c && isDone(p.id)).length
            const totalStories = STORIES.filter((st) => st.creator === c).length
            const doneStories = STORIES.filter((st) => st.creator === c && isDone(st.id)).length

            return (
              <div
                key={c}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
                style={{ borderTopColor: meta.color, borderTopWidth: 3 }}
              >
                <div className="flex items-baseline justify-between mb-1">
                  <div className="text-lg font-bold" style={{ color: meta.color }}>{c}</div>
                  <div className="text-xs text-neutral-500">{meta.city}</div>
                </div>
                {ig?.username && (
                  <div className="text-xs text-neutral-400 mb-3">@{ig.username}</div>
                )}

                {/* INSTAGRAM BLOCK */}
                <div className={`rounded-xl bg-neutral-950 border border-neutral-800 p-3 mb-3 ${tab === 'tiktok' ? 'hidden' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-pink-300 uppercase tracking-wider">📷 Photo platform</div>
                    <div className={`text-[10px] px-2 py-0.5 rounded-full ${ig?.connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                      {ig?.connected ? 'connected' : 'not connected'}
                    </div>
                  </div>
                  {ig?.connected ? (
                    <div className="grid grid-cols-3 gap-2">
                      <Metric label="Followers" value={fmt(ig.followers)} />
                      <Metric label="Following" value={fmt(ig.following)} />
                      <Metric label="Posts" value={fmt(ig.mediaCount)} />
                      <Metric label="Reach 7d" value={fmt(ig.reach7d)} />
                      <Metric label="Views 7d" value={fmt(ig.views7d)} />
                      <Metric label="Profile views" value={fmt(ig.profileViews7d)} />
                      <Metric label="Engaged 7d" value={fmt(ig.accountsEngaged7d)} />
                      <Metric label="Interactions" value={fmt(ig.interactions7d)} />
                    </div>
                  ) : (
                    <div className="text-xs text-neutral-500">{loading ? 'Loading…' : 'Connect at /connect'}</div>
                  )}
                  {ig?.error && <div className="text-[10px] text-orange-300 mt-2 break-all">⚠ {ig.error}</div>}
                </div>

                {/* TIKTOK BLOCK */}
                <div className={`rounded-xl bg-neutral-950 border border-neutral-800 p-3 mb-3 ${tab === 'instagram' ? 'hidden' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-cyan-300 uppercase tracking-wider">🎵 Video platform</div>
                    {meta.tiktokAvailable ? (
                      <div className={`text-[10px] px-2 py-0.5 rounded-full ${tt?.connected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                        {tt?.connected ? 'connected' : 'not connected'}
                      </div>
                    ) : (
                      <div className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-500">n/a in India</div>
                    )}
                  </div>
                  {meta.tiktokAvailable ? (
                    tt?.connected && !tt?.error ? (
                      <div className="grid grid-cols-3 gap-2">
                        <Metric label="Followers" value={fmt(tt.followers)} />
                        <Metric label="Likes" value={fmt(tt.likes)} />
                        <Metric label="Videos" value={fmt(tt.videos)} />
                      </div>
                    ) : tt?.error ? (
                      <div className="text-xs text-orange-300 leading-relaxed">
                        ⚠ Token expired / missing stats permission.
                        <span className="text-neutral-400"> Fix once: reconnect this account at /connect (now asks for stats scope), then save the returned refresh_token as TIKTOK_REFRESH_TOKEN_{c.toUpperCase()} in Railway → auto-refreshes for 1 year.</span>
                      </div>
                    ) : (
                      <div className="text-xs text-neutral-500">{loading ? 'Loading…' : 'Connect at /connect'}</div>
                    )
                  ) : (
                    <div className="text-xs text-neutral-500">Banned in India — cross-posting via CapCut slideshow instead.</div>
                  )}
                </div>

                {/* COMBINED + PIPELINE */}
                <div className="grid grid-cols-3 gap-2">
                  <Metric
                    label="Combined fans"
                    value={fmt((ig?.followers ?? 0) + (tt?.followers ?? 0))}
                    highlight
                  />
                  <Metric label="Posts done" value={`${donePosts}/${totalPosts}`} />
                  <Metric label="Stories done" value={`${doneStories}/${totalStories}`} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-5 text-xs text-blue-100/70">
        Reach / views / engagement come from the platform insights API and can lag ~24-48h for brand-new accounts.
        TikTok follower stats need the <code>user.info.stats</code> scope — if the video-platform block shows ⚠, reconnect Mia + Ava with the updated scope.
      </div>
    </div>
  )
}

function PlatformTabButton({
  active, onClick, icon, label, gradient
}: {
  active: boolean; onClick: () => void; icon: string; label: string; gradient: string
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2.5 text-sm font-semibold rounded-full transition-all flex items-center gap-2 ${
        active
          ? `bg-gradient-to-r ${gradient} text-white shadow-lg`
          : 'bg-neutral-900/60 text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-100 border border-white/5'
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
      {sub && <div className="text-xs text-neutral-500 mt-1">{sub}</div>}
    </div>
  )
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-lg px-2 py-1.5 ${highlight ? 'bg-emerald-500/10 border border-emerald-500/30' : ''}`}>
      <div className="text-[10px] text-neutral-500 uppercase tracking-wider truncate">{label}</div>
      <div className={`text-sm font-bold ${highlight ? 'text-emerald-300' : 'text-neutral-100'}`}>{value}</div>
    </div>
  )
}
