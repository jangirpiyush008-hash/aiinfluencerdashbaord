'use client'
import { useMemo, useState } from 'react'
import { CALENDAR } from '@/lib/calendar'
import { CREATOR_META, Creator, Post, PostStatus } from '@/lib/types'
import PostCard from '@/components/PostCard'
import PostModal from '@/components/PostModal'
import CreatorsView from '@/components/CreatorsView'
import VideoTemplatesView from '@/components/VideoTemplatesView'
import StoryView from '@/components/StoryView'
import StoriesView from '@/components/StoriesView'
import AnalyticsView from '@/components/AnalyticsView'

type Tab = 'calendar' | 'stories' | 'creators' | 'story' | 'videos' | 'analytics'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']
const STATUSES: PostStatus[] = ['pending', 'generated', 'scheduled', 'posted']

export default function Home() {
  const [tab, setTab] = useState<Tab>('calendar')
  const [selectedCreator, setSelectedCreator] = useState<Creator | 'All'>('All')
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | 'All'>('All')
  const [dubaiOnly, setDubaiOnly] = useState(false)
  const [petOnly, setPetOnly] = useState(false)
  const [videosOnly, setVideosOnly] = useState(false)
  const [openPost, setOpenPost] = useState<Post | null>(null)

  const filtered = useMemo(() => {
    return CALENDAR.filter((p) => {
      if (selectedCreator !== 'All' && p.creator !== selectedCreator) return false
      if (selectedStatus !== 'All' && p.status !== selectedStatus) return false
      if (dubaiOnly && !p.isDubaiArc) return false
      if (petOnly && !p.isPetPost) return false
      if (videosOnly && !p.isProductVideo) return false
      return true
    })
  }, [selectedCreator, selectedStatus, dubaiOnly, petOnly, videosOnly])

  const perCreator = useMemo(() => {
    const counts: Record<string, number> = {}
    CREATORS.forEach((c) => (counts[c] = CALENDAR.filter((p) => p.creator === c).length))
    return counts
  }, [])

  const perStatus = useMemo(() => {
    const counts: Record<string, number> = {}
    STATUSES.forEach((s) => (counts[s] = CALENDAR.filter((p) => p.status === s).length))
    return counts
  }, [])

  const grouped = useMemo(() => {
    const byDate: Record<string, Post[]> = {}
    filtered.forEach((p) => {
      byDate[p.date] = byDate[p.date] || []
      byDate[p.date].push(p)
    })
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <main className="min-h-screen">
      <header className="glass sticky top-0 z-40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex-1 min-w-0 fade-in-up">
              <h1 className="text-lg sm:text-2xl font-bold flex items-center gap-2">
                <span className="text-xl sm:text-2xl">🎬</span>
                <span className="gradient-text">AI Influencer Dashboard</span>
              </h1>
              <p className="text-[11px] sm:text-sm text-neutral-400 mt-0.5 sm:mt-1">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" /> Live
                </span>
                <span className="mx-2 text-neutral-600">·</span>
                4 creators · 99 posts + 112 stories · Jul 2–29
              </p>
            </div>
          </div>

          {/* Creator pills — horizontal scroll on mobile */}
          <div className="flex gap-2 items-center mt-3 -mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto no-scrollbar">
            {CREATORS.map((c) => (
              <button
                key={c}
                onClick={() => { setTab('calendar'); setSelectedCreator(c) }}
                className="text-xs bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/5 hover:border-white/15 rounded-lg px-3 py-2 flex items-center gap-2 transition-all shrink-0 hover:-translate-y-0.5"
                style={{
                  boxShadow: `inset 0 0 0 1px ${CREATOR_META[c].color}22, 0 4px 12px -8px ${CREATOR_META[c].color}66`,
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: CREATOR_META[c].color, boxShadow: `0 0 10px ${CREATOR_META[c].color}` }}
                />
                <span className="font-semibold">{c}</span>
                <span className="text-neutral-500">{perCreator[c]}</span>
              </button>
            ))}
          </div>

          {/* TAB SWITCHER — icon + label always, horizontal scroll on mobile */}
          <div className="flex gap-1.5 mt-3 sm:mt-5 -mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto no-scrollbar">
            <TabButton active={tab === 'calendar'} onClick={() => setTab('calendar')} icon="📅" label="Calendar" />
            <TabButton active={tab === 'stories'} onClick={() => setTab('stories')} icon="📱" label="Stories" />
            <TabButton active={tab === 'creators'} onClick={() => setTab('creators')} icon="👑" label="Creators" />
            <TabButton active={tab === 'story'} onClick={() => setTab('story')} icon="📖" label="Story" />
            <TabButton active={tab === 'videos'} onClick={() => setTab('videos')} icon="🎥" label="Videos" />
            <TabButton active={tab === 'analytics'} onClick={() => setTab('analytics')} icon="📊" label="Stats" />
          </div>
        </div>
      </header>

      {tab === 'calendar' && (
        <>
          <div className="border-b border-white/5 bg-black/30 backdrop-blur">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-3 sm:mx-0 px-3 sm:px-0">
                <FilterChip active={selectedCreator === 'All'} onClick={() => setSelectedCreator('All')}>
                  All creators
                </FilterChip>
                {CREATORS.map((c) => (
                  <FilterChip
                    key={c}
                    active={selectedCreator === c}
                    onClick={() => setSelectedCreator(c)}
                    color={CREATOR_META[c].color}
                  >
                    {c}
                  </FilterChip>
                ))}
                <div className="w-px bg-neutral-800 mx-1" />
                <FilterChip active={selectedStatus === 'All'} onClick={() => setSelectedStatus('All')}>
                  All statuses
                </FilterChip>
                {STATUSES.map((s) => (
                  <FilterChip key={s} active={selectedStatus === s} onClick={() => setSelectedStatus(s)}>
                    {s} <span className="opacity-60 ml-1">{perStatus[s]}</span>
                  </FilterChip>
                ))}
                <div className="w-px bg-neutral-800 mx-1" />
                <FilterChip active={dubaiOnly} onClick={() => setDubaiOnly(!dubaiOnly)}>
                  🌴 Dubai arc
                </FilterChip>
                <FilterChip active={petOnly} onClick={() => setPetOnly(!petOnly)}>
                  🐕 Pet posts
                </FilterChip>
                <FilterChip active={videosOnly} onClick={() => setVideosOnly(!videosOnly)}>
                  🎥 Product videos
                </FilterChip>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
            {grouped.length === 0 ? (
              <div className="text-center text-neutral-500 py-20">No posts match your filters.</div>
            ) : (
              <div className="space-y-6 sm:space-y-10">
                {grouped.map(([date, posts]) => (
                  <section key={date} className="fade-in-up">
                    <div className="mb-3 sm:mb-4 flex items-center gap-3">
                      <div className="h-6 w-1 rounded-full bg-gradient-to-b from-pink-500 via-fuchsia-500 to-sky-500" />
                      <h2 className="text-base sm:text-lg font-semibold text-neutral-100">{date}</h2>
                      <span className="text-xs sm:text-sm text-neutral-500">{posts[0].day}</span>
                      <span className="text-[11px] sm:text-xs text-neutral-500 ml-auto bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5">
                        {posts.length} {posts.length === 1 ? 'post' : 'posts'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {posts.map((p) => (
                        <PostCard key={p.id} post={p} onClick={() => setOpenPost(p)} />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'stories' && <StoriesView />}
      {tab === 'creators' && <CreatorsView />}
      {tab === 'story' && <StoryView />}
      {tab === 'videos' && <VideoTemplatesView />}
      {tab === 'analytics' && <AnalyticsView />}

      <PostModal post={openPost} onClose={() => setOpenPost(null)} />
    </main>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: string; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-full transition-all flex items-center gap-1.5 shrink-0 ${
        active
          ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-sky-500 text-white shadow-lg shadow-fuchsia-500/25'
          : 'bg-neutral-900/60 text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-100 border border-white/5 hover:border-white/15 backdrop-blur'
      }`}
    >
      <span className="text-base">{icon}</span>
      <span>{label}</span>
    </button>
  )
}

function FilterChip({
  active,
  onClick,
  color,
  children
}: {
  active: boolean
  onClick: () => void
  color?: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs px-3 py-2 rounded-full border transition-all shrink-0 whitespace-nowrap font-medium hover:-translate-y-0.5"
      style={{
        background: active ? (color ? `${color}22` : 'rgba(255,255,255,0.06)') : 'rgba(20,20,22,0.55)',
        borderColor: active ? (color || 'rgba(255,255,255,0.18)') : 'rgba(255,255,255,0.06)',
        color: active ? (color || 'rgb(245 245 245)') : 'rgb(180 180 185)',
        boxShadow: active && color ? `0 6px 20px -10px ${color}` : 'none',
      }}
    >
      {children}
    </button>
  )
}
