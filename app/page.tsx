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

type Tab = 'calendar' | 'stories' | 'creators' | 'story' | 'videos'

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
      <header className="border-b border-neutral-800 sticky top-0 bg-neutral-950/90 backdrop-blur-lg z-40">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold">🎬 AI Influencer Dashboard</h1>
              <p className="text-sm text-neutral-400 mt-1">4 creators · 99 posts + 112 daily stories · Jul 2 – Jul 29, 2026</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {CREATORS.map((c) => (
                <button
                  key={c}
                  onClick={() => { setTab('calendar'); setSelectedCreator(c) }}
                  className="text-xs bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-lg px-3 py-2 flex items-center gap-2 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: CREATOR_META[c].color }} />
                  <span className="font-semibold">{c}</span>
                  <span className="text-neutral-500">{perCreator[c]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* TAB SWITCHER */}
          <div className="flex gap-1 mt-5 border-b border-neutral-800 -mb-5">
            <TabButton active={tab === 'calendar'} onClick={() => setTab('calendar')}>
              📅 Calendar
            </TabButton>
            <TabButton active={tab === 'stories'} onClick={() => setTab('stories')}>
              📱 Stories
            </TabButton>
            <TabButton active={tab === 'creators'} onClick={() => setTab('creators')}>
              👑 Creators
            </TabButton>
            <TabButton active={tab === 'story'} onClick={() => setTab('story')}>
              📖 Story
            </TabButton>
            <TabButton active={tab === 'videos'} onClick={() => setTab('videos')}>
              🎥 Video Templates
            </TabButton>
          </div>
        </div>
      </header>

      {tab === 'calendar' && (
        <>
          <div className="border-b border-neutral-800 bg-neutral-950">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex flex-wrap gap-2">
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

          <div className="max-w-7xl mx-auto px-6 py-8">
            {grouped.length === 0 ? (
              <div className="text-center text-neutral-500 py-20">No posts match your filters.</div>
            ) : (
              <div className="space-y-10">
                {grouped.map(([date, posts]) => (
                  <section key={date}>
                    <div className="mb-4 flex items-baseline gap-3">
                      <h2 className="text-lg font-semibold">{date}</h2>
                      <span className="text-sm text-neutral-500">{posts[0].day}</span>
                      <span className="text-xs text-neutral-600 ml-auto">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      <PostModal post={openPost} onClose={() => setOpenPost(null)} />
    </main>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-3 text-sm font-semibold transition-all border-b-2 ${
        active
          ? 'text-white border-white'
          : 'text-neutral-500 hover:text-neutral-300 border-transparent'
      }`}
    >
      {children}
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
      className="text-xs px-3 py-1.5 rounded-full border transition-all"
      style={{
        background: active ? (color ? `${color}22` : 'rgb(38 38 38)') : 'transparent',
        borderColor: active ? (color || 'rgb(64 64 64)') : 'rgb(38 38 38)',
        color: active ? (color || 'rgb(245 245 245)') : 'rgb(163 163 163)'
      }}
    >
      {children}
    </button>
  )
}
