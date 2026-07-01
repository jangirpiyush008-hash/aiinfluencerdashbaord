'use client'
import { CREATOR_META, Creator } from '@/lib/types'
import { CALENDAR } from '@/lib/calendar'
import { STORIES } from '@/lib/stories'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']

// Placeholder analytics — will populate from real IG + TikTok APIs once connected
type Metrics = {
  followers: { instagram: number; tiktok: number | null }
  reach7d: { instagram: number; tiktok: number | null }
  engagement7d: { instagram: number; tiktok: number | null }
  postsPublished: number
  storiesPublished: number
}

const PLACEHOLDER: Record<Creator, Metrics> = {
  Siya: {
    followers: { instagram: 0, tiktok: null },
    reach7d: { instagram: 0, tiktok: null },
    engagement7d: { instagram: 0, tiktok: null },
    postsPublished: 0,
    storiesPublished: 0
  },
  Kiara: {
    followers: { instagram: 0, tiktok: null },
    reach7d: { instagram: 0, tiktok: null },
    engagement7d: { instagram: 0, tiktok: null },
    postsPublished: 0,
    storiesPublished: 0
  },
  Mia: {
    followers: { instagram: 0, tiktok: 0 },
    reach7d: { instagram: 0, tiktok: 0 },
    engagement7d: { instagram: 0, tiktok: 0 },
    postsPublished: 0,
    storiesPublished: 0
  },
  Ava: {
    followers: { instagram: 0, tiktok: 0 },
    reach7d: { instagram: 0, tiktok: 0 },
    engagement7d: { instagram: 0, tiktok: 0 },
    postsPublished: 0,
    storiesPublished: 0
  }
}

export default function AnalyticsView() {
  const combinedFollowers = CREATORS.reduce((sum, c) => {
    const m = PLACEHOLDER[c]
    return sum + m.followers.instagram + (m.followers.tiktok || 0)
  }, 0)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
      <div>
        <h2 className="text-3xl font-bold mb-2">📊 Analytics</h2>
        <p className="text-neutral-400 max-w-3xl">
          Real-time performance across Instagram + TikTok. Data will populate here once API integrations are approved (Meta 2-14 days, TikTok 3-7 days).
        </p>
      </div>

      {/* HERO STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total followers" value={combinedFollowers.toLocaleString()} sub="across all platforms" />
        <StatCard label="Posts published" value="0 / 99" sub="from July calendar" />
        <StatCard label="Stories posted" value="0 / 112" sub="daily stories" />
        <StatCard label="Reach last 7d" value="—" sub="waiting on API" />
      </div>

      {/* PLATFORM SPLIT */}
      <div>
        <h3 className="text-xl font-bold mb-4">By Platform</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PlatformCard
            name="Instagram"
            icon="📷"
            gradient="from-pink-500 to-orange-500"
            creators={CREATORS.length}
            connected={0}
          />
          <PlatformCard
            name="TikTok"
            icon="🎵"
            gradient="from-cyan-500 to-pink-500"
            creators={2}
            note="Ava + Mia only (banned in India)"
            connected={0}
          />
        </div>
      </div>

      {/* CREATOR BREAKDOWN */}
      <div>
        <h3 className="text-xl font-bold mb-4">By Creator</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREATORS.map(c => {
            const meta = CREATOR_META[c]
            const m = PLACEHOLDER[c]
            const totalPosts = CALENDAR.filter(p => p.creator === c).length
            const totalStories = STORIES.filter(s => s.creator === c).length

            return (
              <div key={c} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5" style={{ borderTopColor: meta.color, borderTopWidth: 3 }}>
                <div className="text-lg font-bold mb-1" style={{ color: meta.color }}>{c}</div>
                <div className="text-xs text-neutral-500 mb-4">{meta.city}</div>

                <div className="space-y-3">
                  <StatRow icon="📷" label="Instagram" value={m.followers.instagram.toLocaleString() + ' followers'} />
                  {meta.tiktokAvailable ? (
                    <StatRow icon="🎵" label="TikTok" value={(m.followers.tiktok ?? 0).toLocaleString() + ' followers'} />
                  ) : (
                    <StatRow icon="🚫" label="TikTok" value="Not available (India)" muted />
                  )}
                  <div className="h-px bg-neutral-800 my-2" />
                  <StatRow icon="📅" label="Posts planned" value={`${totalPosts} in July`} muted />
                  <StatRow icon="📱" label="Stories planned" value={`${totalStories} in July`} muted />
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-500">
                  Connect API to enable live metrics ↗
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* PLACEHOLDER CHARTS */}
      <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-2">📈 Coming after API connection</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
          {[
            'Follower growth curve (30d)',
            'Best-performing post types',
            'Top 10 hashtags by reach',
            'Peak posting times per creator',
            'Story completion rates',
            'Bio link click-through',
            'Reels/Videos vs Photos reach',
            'Cross-platform audience overlap',
            'Affiliate revenue tracker'
          ].map(item => (
            <div key={item} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 text-sm text-neutral-300">
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
        <div className="text-blue-300 font-semibold mb-2">🔗 Connect APIs to enable live analytics</div>
        <div className="text-sm text-blue-100/80 mb-3">
          Both Instagram Graph API and TikTok Content Posting API require app registration + approval.
          Once connected, this dashboard becomes your command center for all 4 creators across both platforms.
        </div>
        <div className="text-xs text-blue-100/60">
          Setup takes: 2 hrs human time + 3-14 days for platform approvals
        </div>
      </div>
    </div>
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

function PlatformCard({
  name, icon, gradient, creators, note, connected
}: {
  name: string; icon: string; gradient: string; creators: number; note?: string; connected: number
}) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
      <div className="relative">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-3xl">{icon}</div>
          <div>
            <div className="text-lg font-bold">{name}</div>
            {note && <div className="text-xs text-neutral-500">{note}</div>}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Creators</div>
            <div className="text-xl font-bold">{creators}</div>
          </div>
          <div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">Connected</div>
            <div className="text-xl font-bold">{connected} / {creators}</div>
          </div>
        </div>
        <button className="mt-4 w-full text-xs bg-neutral-800 hover:bg-neutral-700 py-2 rounded transition-colors">
          Connect API →
        </button>
      </div>
    </div>
  )
}

function StatRow({ icon, label, value, muted }: { icon: string; label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">{icon}</span>
        <span className={`text-xs ${muted ? 'text-neutral-500' : 'text-neutral-400'}`}>{label}</span>
      </div>
      <div className={`text-xs font-semibold ${muted ? 'text-neutral-500' : 'text-neutral-200'}`}>{value}</div>
    </div>
  )
}
