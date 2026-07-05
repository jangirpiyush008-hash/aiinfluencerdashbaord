'use client'
import { useEffect, useMemo, useState } from 'react'
import { CALENDAR } from '@/lib/calendar'
import { CREATOR_META, Creator, Post, PostStatus } from '@/lib/types'
import PostStackCard from '@/components/PostStackCard'
import PostModal from '@/components/PostModal'
import CreatorsView from '@/components/CreatorsView'
import VideoTemplatesView from '@/components/VideoTemplatesView'
import StoryView from '@/components/StoryView'
import StoriesView from '@/components/StoriesView'
import AnalyticsView from '@/components/AnalyticsView'
import { CalendarIcon, StoriesRingIcon, UsersIcon, BookIcon, FilmIcon, ChartIcon } from '@/components/BrandIcons'

type Tab = 'calendar' | 'stories' | 'creators' | 'story' | 'videos' | 'analytics'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']
const STATUSES: PostStatus[] = ['pending', 'generated', 'scheduled', 'posted']

export type PostStack = {
  key: string
  creator: Creator
  date: string
  day: string
  posts: Post[]
}

export default function Home() {
  const [tab, setTab] = useState<Tab>('calendar')
  const [selectedCreator, setSelectedCreator] = useState<Creator | 'All'>('All')
  const [selectedStatus, setSelectedStatus] = useState<PostStatus | 'All'>('All')
  const [dubaiOnly, setDubaiOnly] = useState(false)
  const [petOnly, setPetOnly] = useState(false)
  const [videosOnly, setVideosOnly] = useState(false)
  const [openStack, setOpenStack] = useState<PostStack | null>(null)
  // Re-render tick so the "done" badge updates when localStorage flips
  const [doneTick, setDoneTick] = useState(0)

  useEffect(() => {
    const onStorage = () => setDoneTick(t => t + 1)
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

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

  // Group by (date, creator) → one card per creator per day
  const grouped = useMemo(() => {
    const bucket: Record<string, PostStack> = {}
    filtered.forEach((p) => {
      const key = `${p.date}::${p.creator}`
      if (!bucket[key]) bucket[key] = { key, creator: p.creator, date: p.date, day: p.day, posts: [] }
      bucket[key].posts.push(p)
    })
    const stacks = Object.values(bucket).sort((a, b) => a.posts[0].id - b.posts[0].id)
    const byDate: Record<string, PostStack[]> = {}
    stacks.forEach(s => {
      byDate[s.date] = byDate[s.date] || []
      byDate[s.date].push(s)
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
                4 creators · one card per creator per day
              </p>
            </div>
          </div>

          <div className="flex gap-2.5 items-center mt-3 -mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto no-scrollbar">
            {CREATORS.map((c) => (
              <button
                key={c}
                onClick={() => { setTab('calendar'); setSelectedCreator(c) }}
                className="bg-neutral-900/60 hover:bg-neutral-800/80 border border-white/5 hover:border-white/20 rounded-full pl-1.5 pr-4 py-1.5 flex items-center gap-2.5 transition-all shrink-0 hover:-translate-y-0.5"
                style={{
                  boxShadow: `inset 0 0 0 1px ${CREATOR_META[c].color}33, 0 6px 16px -8px ${CREATOR_META[c].color}88`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={CREATOR_META[c].anchorImageUrl}
                  alt={c}
                  className="w-8 h-8 rounded-full object-cover ring-2"
                  style={{ ['--tw-ring-color' as string]: CREATOR_META[c].color }}
                />
                <span className="text-sm font-semibold">{c}</span>
                <span className="text-xs text-neutral-500">{perCreator[c]}</span>
              </button>
            ))}
          </div>

          <div className="mt-3 sm:mt-5 -mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto no-scrollbar">
            <div className="inline-flex items-center gap-1 bg-neutral-900/80 border border-white/10 rounded-2xl p-1.5 backdrop-blur">
              <TabButton active={tab === 'calendar'} onClick={() => setTab('calendar')} icon={<CalendarIcon className="w-4 h-4" />} label="Calendar" />
              <TabButton active={tab === 'stories'} onClick={() => setTab('stories')} icon={<StoriesRingIcon className="w-4 h-4" />} label="Stories" />
              <TabButton active={tab === 'creators'} onClick={() => setTab('creators')} icon={<UsersIcon className="w-4 h-4" />} label="Creators" />
              <TabButton active={tab === 'story'} onClick={() => setTab('story')} icon={<BookIcon className="w-4 h-4" />} label="Story" />
              <TabButton active={tab === 'videos'} onClick={() => setTab('videos')} icon={<FilmIcon className="w-4 h-4" />} label="Videos" />
              <TabButton active={tab === 'analytics'} onClick={() => setTab('analytics')} icon={<ChartIcon className="w-4 h-4" />} label="Stats" />
            </div>
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
                <FilterChip active={dubaiOnly} onClick={() => setDubaiOnly(!dubaiOnly)}>🌴 Dubai arc</FilterChip>
                <FilterChip active={petOnly} onClick={() => setPetOnly(!petOnly)}>🐕 Pet posts</FilterChip>
                <FilterChip active={videosOnly} onClick={() => setVideosOnly(!videosOnly)}>🎥 Product videos</FilterChip>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-8">
            {grouped.length === 0 ? (
              <div className="text-center text-neutral-500 py-20">No posts match your filters.</div>
            ) : (
              <div className="space-y-6 sm:space-y-10">
                {grouped.map(([date, stacks]) => (
                  <section key={date} className="fade-in-up">
                    <div className="mb-3 sm:mb-4 flex items-center gap-3">
                      <div className="h-8 w-1.5 rounded-full bg-gradient-to-b from-pink-500 via-fuchsia-500 to-sky-500" />
                      <h2 className="text-lg sm:text-xl font-bold text-neutral-50 tracking-tight">{date}</h2>
                      <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-fuchsia-300 bg-fuchsia-500/10 border border-fuchsia-500/25 rounded-full px-2.5 py-0.5">
                        {stacks[0].day}
                      </span>
                      <span className="text-[11px] sm:text-xs text-neutral-400 ml-auto bg-white/5 border border-white/10 rounded-full px-3 py-1">
                        {stacks.length} creator{stacks.length > 1 ? 's' : ''} · {stacks.reduce((n, s) => n + s.posts.length, 0)} posts
                      </span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                      {stacks.map((s) => (
                        <PostStackCard key={s.key + ':' + doneTick} stack={s} onClick={() => setOpenStack(s)} />
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

      <PostModal stack={openStack} onClose={() => { setOpenStack(null); setDoneTick(t => t + 1) }} />
    </main>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-2 shrink-0 ${
        active
          ? 'bg-gradient-to-r from-pink-500 via-fuchsia-500 to-sky-500 text-white shadow-lg shadow-fuchsia-500/30'
          : 'text-neutral-400 hover:text-neutral-100 hover:bg-white/5'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function FilterChip({
  active, onClick, color, children
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
