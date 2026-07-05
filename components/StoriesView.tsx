'use client'
import { useEffect, useMemo, useState } from 'react'
import { STORIES, Story } from '@/lib/stories'
import { CREATOR_META, Creator } from '@/lib/types'
import { isDone, setDone } from '@/lib/doneState'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']

type StoryGroup = {
  key: string
  creator: Creator
  date: string
  day: string
  stories: Story[]
}

export default function StoriesView() {
  const [selectedCreator, setSelectedCreator] = useState<Creator | 'All'>('All')
  const [openGroup, setOpenGroup] = useState<StoryGroup | null>(null)
  const [doneTick, setDoneTick] = useState(0)

  useEffect(() => {
    const on = () => setDoneTick(t => t + 1)
    window.addEventListener('storage', on)
    return () => window.removeEventListener('storage', on)
  }, [])

  const filtered = useMemo(() => {
    if (selectedCreator === 'All') return STORIES
    return STORIES.filter(s => s.creator === selectedCreator)
  }, [selectedCreator])

  // Group by (creator, date) — one card per creator per day.
  const groupsByDate = useMemo(() => {
    const bucket: Record<string, StoryGroup> = {}
    filtered.forEach(s => {
      const key = `${s.date}::${s.creator}`
      if (!bucket[key]) {
        bucket[key] = { key, creator: s.creator, date: s.date, day: s.day, stories: [] }
      }
      bucket[key].stories.push(s)
    })
    const groups = Object.values(bucket)
    const byDate: Record<string, StoryGroup[]> = {}
    groups.forEach(g => {
      byDate[g.date] = byDate[g.date] || []
      byDate[g.date].push(g)
    })
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
          <h2 className="text-2xl font-bold">📱 Daily Stories</h2>
          <div className="text-sm text-neutral-500">
            {filtered.length} stories · one stack per creator per day
          </div>
        </div>
        <p className="text-neutral-400 text-sm max-w-3xl">
          Each card = one creator's full story stack for that day. Open → swipe all stories, download all, publish.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <FilterChip active={selectedCreator === 'All'} onClick={() => setSelectedCreator('All')}>
          All creators <span className="opacity-60 ml-1">{STORIES.length}</span>
        </FilterChip>
        {CREATORS.map(c => {
          const count = STORIES.filter(s => s.creator === c).length
          return (
            <FilterChip
              key={c}
              active={selectedCreator === c}
              onClick={() => setSelectedCreator(c)}
              color={CREATOR_META[c].color}
            >
              {c} <span className="opacity-60 ml-1">{count}</span>
            </FilterChip>
          )
        })}
      </div>

      <div className="space-y-8">
        {groupsByDate.map(([date, groups]) => (
          <section key={date}>
            <div className="mb-3 flex items-baseline gap-3">
              <h3 className="text-base font-semibold">{date}</h3>
              <span className="text-xs text-neutral-500">{groups[0].day}</span>
              <span className="text-xs text-neutral-600 ml-auto">
                {groups.length} creator{groups.length > 1 ? 's' : ''} · {groups.reduce((a, g) => a + g.stories.length, 0)} stories
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {groups.map(g => (
                <StackCard key={g.key + ':' + doneTick} group={g} onClick={() => setOpenGroup(g)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {openGroup && <StoryStackModal group={openGroup} onClose={() => { setOpenGroup(null); setDoneTick(t => t + 1) }} />}
    </div>
  )
}

function StackCard({ group, onClick }: { group: StoryGroup; onClick: () => void }) {
  const meta = CREATOR_META[group.creator]
  const cover = group.stories.find(s => s.imageUrl) || group.stories[0]
  const doneCount = group.stories.filter(s => isDone(s.id)).length
  const allDone = doneCount === group.stories.length && group.stories.length > 0
  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all"
      style={{ borderTopColor: meta.color, borderTopWidth: 3, opacity: allDone ? 0.55 : 1 }}
    >
      <div className="aspect-[9/16] relative bg-neutral-950 overflow-hidden">
        {cover.imageUrl ? (
          <img src={cover.imageUrl} alt={cover.concept} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">{cover.emoji}</div>
        )}
        <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur">
          {group.stories.length} 📚
        </div>
        {allDone && (
          <div className="absolute inset-0 bg-emerald-500/25 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-emerald-500 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-2xl">✓ Done</div>
          </div>
        )}
        {!allDone && doneCount > 0 && (
          <div className="absolute bottom-14 right-2 bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {doneCount}/{group.stories.length} done
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3">
          <div className="text-sm font-semibold" style={{ color: meta.color }}>{group.creator}</div>
          <div className="text-[10px] text-neutral-300 truncate">{group.day} · tap to open stack</div>
        </div>
      </div>
    </button>
  )
}

function StoryStackModal({ group, onClose }: { group: StoryGroup; onClose: () => void }) {
  const [idx, setIdx] = useState(0)
  const [copied, setCopied] = useState<string | null>(null)
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [doneCurrent, setDoneCurrent] = useState<boolean>(isDone(group.stories[0].id))
  const [doneAll, setDoneAll] = useState<boolean>(group.stories.every(s => isDone(s.id)))

  const meta = CREATOR_META[group.creator]
  const current = group.stories[idx]

  useEffect(() => { setDoneCurrent(isDone(current.id)) }, [current.id])

  const toggleCurrentDone = () => {
    const nv = !doneCurrent
    setDone(current.id, nv)
    setDoneCurrent(nv)
    setDoneAll(group.stories.every(s => isDone(s.id)))
  }
  const markAllDone = () => {
    const target = !doneAll
    group.stories.forEach(s => setDone(s.id, target))
    setDoneAll(target)
    setDoneCurrent(target)
  }
  const defaultLoc = `${meta.city}, ${meta.country}`

  const overlayCopy = (s: Story) => {
    const loc = s.location || defaultLoc
    return `${s.overlayText}\n\n📍 ${loc}`
  }

  const downloadAll = async () => {
    setDownloading(true)
    try {
      for (let i = 0; i < group.stories.length; i++) {
        const s = group.stories[i]
        if (!s.imageUrl) continue
        const res = await fetch(s.imageUrl)
        const blob = await res.blob()
        const objUrl = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = objUrl
        a.download = `story-${group.creator}-${s.date}-${i + 1}.png`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(objUrl)
        await new Promise((r) => setTimeout(r, 350))
      }
    } finally {
      setDownloading(false)
    }
  }

  const copy = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 1500)
  }

  const publishCurrentToIG = async () => {
    if (!current.imageUrl) {
      setPublishResult('❌ Current story has no image URL')
      return
    }
    setPublishing(true)
    setPublishResult(null)
    try {
      const res = await fetch('/api/publish-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creator: group.creator, kind: 'story', imageUrl: current.imageUrl }),
      })
      const json = await res.json()
      if (json.ok) {
        setPublishResult(`✅ Story ${idx + 1}/${group.stories.length} published`)
      } else {
        setPublishResult(`❌ ${json.error || 'Publish failed'}`)
      }
    } catch (err) {
      setPublishResult(`❌ ${err instanceof Error ? err.message : 'Network error'}`)
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 sm:rounded-2xl max-w-4xl w-full sm:my-8 overflow-hidden min-h-screen sm:min-h-0"
        style={{ borderTopColor: meta.color, borderTopWidth: 4 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR — nav + mark-done (matches PostModal pattern) */}
        <div className="flex items-center flex-wrap gap-2 px-3 sm:px-4 py-2 bg-neutral-950 border-b border-neutral-800">
          <div className="text-xs text-neutral-400">
            Story <span className="text-white font-semibold">{idx + 1}</span> / {group.stories.length}
            <span className="mx-2 text-neutral-600">·</span>
            <span className="uppercase text-[10px] tracking-wider" style={{ color: meta.color }}>{group.creator}</span>
          </div>
          <button
            onClick={toggleCurrentDone}
            className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              doneCurrent ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            {doneCurrent ? '✓ Done — undo' : 'Mark done'}
          </button>
          {group.stories.length > 1 && (
            <button
              onClick={markAllDone}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                doneAll ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              {doneAll ? '✓ All done' : 'Mark all done'}
            </button>
          )}
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-2xl leading-none px-2">×</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT — image viewer with prev/next */}
          <div className="bg-neutral-950 aspect-[9/16] md:aspect-auto min-h-[520px] flex items-center justify-center relative overflow-hidden">
            {current.imageUrl ? (
              <img key={current.imageUrl} src={current.imageUrl} alt={current.concept} className="w-full h-full object-cover" />
            ) : (
              <div className="text-8xl">{current.emoji}</div>
            )}
            {group.stories.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + group.stories.length) % group.stories.length) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-11 h-11 rounded-full flex items-center justify-center text-2xl backdrop-blur z-20 shadow-lg"
                  aria-label="Previous"
                >‹</button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % group.stories.length) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-11 h-11 rounded-full flex items-center justify-center text-2xl backdrop-blur z-20 shadow-lg"
                  aria-label="Next"
                >›</button>
                <div className="absolute top-3 left-3 right-3 flex gap-1 z-20">
                  {group.stories.map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1 rounded-full ${i === idx ? 'bg-white' : i < idx ? 'bg-white/70' : 'bg-white/30'}`}
                    />
                  ))}
                </div>
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur z-20">
                  {idx + 1} / {group.stories.length}
                </div>
              </>
            )}
            <div className="absolute bottom-2 left-3 right-3 text-center bg-gradient-to-t from-black/80 to-transparent pt-8 pb-1 z-10">
              <div className="text-sm font-semibold" style={{ color: meta.color }}>{group.creator}</div>
              <div className="text-xs text-neutral-400">{current.date} · {current.day}</div>
            </div>
          </div>

          {/* RIGHT — controls */}
          <div className="p-4 sm:p-6 space-y-4 overflow-y-auto sm:max-h-[80vh]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono text-neutral-500">STORY STACK</div>
                <div className="text-2xl font-bold mt-1" style={{ color: meta.color }}>{group.creator}</div>
                <div className="text-sm text-neutral-400">{group.date} · {group.day} · {group.stories.length} stories</div>
              </div>
              <button onClick={onClose} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Concept ({idx + 1}/{group.stories.length})</div>
              <div className="text-neutral-200">{current.concept}</div>
            </div>

            <div className="bg-purple-500/10 border border-purple-500/40 rounded-xl p-3 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-purple-300 font-semibold">📍 Location tag</div>
              <div className="text-white text-sm">{current.location || defaultLoc}</div>
              <div className="text-[10px] text-neutral-400">Tag this on Instagram when adding location sticker — geo-tagging boosts local reach.</div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider text-emerald-300 font-semibold mb-1">📝 Text overlay (baked into image)</div>
              <div className="text-white font-bold">{current.overlayText}</div>
            </div>

            {/* DOWNLOAD ALL */}
            <button
              onClick={downloadAll}
              disabled={downloading}
              className="w-full flex items-center justify-between gap-3 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">⬇️</span>
                <span>{downloading ? `Downloading ${group.stories.length}…` : `Download all ${group.stories.length} stories`}</span>
              </span>
              <span className="text-xs bg-white/10 px-2 py-1 rounded">Full quality</span>
            </button>

            {/* PUBLISH CURRENT */}
            <button
              onClick={publishCurrentToIG}
              disabled={publishing}
              className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📷</span>
                <span>{publishing ? 'Publishing…' : `Publish story ${idx + 1}/${group.stories.length} to IG`}</span>
              </span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">{publishing ? '⏳' : 'Live'}</span>
            </button>
            {publishResult && (
              <div className="text-xs bg-neutral-950 border border-neutral-800 rounded px-3 py-2 break-all">{publishResult}</div>
            )}

            <button
              onClick={() => copy(overlayCopy(current), 'overlay')}
              className="w-full text-xs text-neutral-400 hover:text-neutral-200 underline"
            >
              {copied === 'overlay' ? '✓ Overlay + location copied' : 'Copy overlay text + location'}
            </button>

            <details className="text-xs text-neutral-500">
              <summary className="cursor-pointer hover:text-neutral-300">Higgsfield prompt</summary>
              <div className="mt-2 text-[11px] text-neutral-400 bg-neutral-950 p-2 rounded border border-neutral-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {current.prompt}
              </div>
            </details>

            <div className="text-[10px] text-neutral-500 text-center pt-2">
              Stories only exist on Instagram · use next/prev arrows to swipe
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function FilterChip({
  active, onClick, color, children
}: {
  active: boolean; onClick: () => void; color?: string; children: React.ReactNode
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
