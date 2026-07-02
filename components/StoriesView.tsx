'use client'
import { useMemo, useState } from 'react'
import { STORIES, Story } from '@/lib/stories'
import { CREATOR_META, Creator } from '@/lib/types'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']

export default function StoriesView() {
  const [selectedCreator, setSelectedCreator] = useState<Creator | 'All'>('All')
  const [openStory, setOpenStory] = useState<Story | null>(null)

  const filtered = useMemo(() => {
    if (selectedCreator === 'All') return STORIES
    return STORIES.filter(s => s.creator === selectedCreator)
  }, [selectedCreator])

  const grouped = useMemo(() => {
    const byDate: Record<string, Story[]> = {}
    filtered.forEach(s => {
      byDate[s.date] = byDate[s.date] || []
      byDate[s.date].push(s)
    })
    return Object.entries(byDate).sort(([a], [b]) => a.localeCompare(b))
  }, [filtered])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-2">
          <h2 className="text-2xl font-bold">📱 Daily Stories</h2>
          <div className="text-sm text-neutral-500">
            {filtered.length} stories · {grouped.length} days
          </div>
        </div>
        <p className="text-neutral-400 text-sm max-w-3xl">
          24hr Instagram Stories with text overlay captions. Each creator posts 1 story per day.
          Siya = sweet Indian normal life. Kiara + Mia + Ava = bold sultry bombshell energy.
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
        {grouped.map(([date, stories]) => (
          <section key={date}>
            <div className="mb-3 flex items-baseline gap-3">
              <h3 className="text-base font-semibold">{date}</h3>
              <span className="text-xs text-neutral-500">{stories[0].day}</span>
              <span className="text-xs text-neutral-600 ml-auto">{stories.length} stories</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {stories.map(s => (
                <StoryCard key={s.id} story={s} onClick={() => setOpenStory(s)} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {openStory && <StoryModal story={openStory} onClose={() => setOpenStory(null)} />}
    </div>
  )
}

function StoryCard({ story, onClick }: { story: Story; onClick: () => void }) {
  const meta = CREATOR_META[story.creator]
  const hasImage = !!story.imageUrl

  return (
    <button
      onClick={onClick}
      className="group text-left w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all"
      style={{ borderTopColor: meta.color, borderTopWidth: 3 }}
    >
      {/* Instagram Story 9:16 aspect ratio */}
      <div className="aspect-[9/16] relative bg-neutral-950 overflow-hidden">
        {hasImage ? (
          <img
            src={story.imageUrl}
            alt={story.concept}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-3">
            <div className="text-5xl mb-6">{story.emoji}</div>
            {/* Show overlay text at top only when no image (image already has text baked in) */}
            <div className="absolute top-3 left-3 right-3 text-center">
              <div className="text-[10px] text-white/90 font-bold uppercase tracking-wider drop-shadow-lg">
                {story.overlayText}
              </div>
            </div>
          </div>
        )}

        {/* Creator name at bottom (like IG username tag) */}
        <div className="absolute bottom-2 left-3 right-3 text-center bg-gradient-to-t from-black/80 to-transparent pt-6 pb-1">
          <div className="text-[10px] font-semibold" style={{ color: meta.color }}>
            {story.creator}
          </div>
          <div className="text-[9px] text-neutral-400">{story.day}</div>
        </div>
      </div>
    </button>
  )
}

function StoryModal({ story, onClose }: { story: Story; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<string | null>(null)
  const meta = CREATOR_META[story.creator]

  const copy = () => {
    navigator.clipboard.writeText(story.prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const publishToIG = async () => {
    if (!story.imageUrl) {
      setPublishResult('❌ No image URL — generate the story first')
      return
    }
    setPublishing(true)
    setPublishResult(null)
    try {
      const res = await fetch('/api/publish-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creator: story.creator,
          kind: 'story',
          imageUrl: story.imageUrl,
        }),
      })
      const json = await res.json()
      if (json.ok) {
        setPublishResult(`✅ Story posted! View: ${json.permalink}`)
        window.open(json.permalink, '_blank')
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
        className="bg-neutral-900 border border-neutral-800 sm:rounded-2xl max-w-3xl w-full sm:my-8 overflow-hidden min-h-screen sm:min-h-0"
        style={{ borderTopColor: meta.color, borderTopWidth: 4 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-neutral-950 aspect-[9/16] md:aspect-auto min-h-[520px] flex items-center justify-center relative overflow-hidden">
            {story.imageUrl ? (
              <img
                src={story.imageUrl}
                alt={story.concept}
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <div className="text-8xl">{story.emoji}</div>
                <div className="absolute top-4 left-4 right-4 text-center">
                  <div className="text-white/95 text-lg font-bold drop-shadow-lg">{story.overlayText}</div>
                </div>
              </>
            )}
            <div className="absolute bottom-4 left-4 right-4 text-center bg-gradient-to-t from-black/80 to-transparent pt-8 pb-2">
              <div className="text-sm font-semibold" style={{ color: meta.color }}>{story.creator}</div>
              <div className="text-xs text-neutral-400">{story.date} · {story.day}</div>
            </div>
            {story.storyArc && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                {story.storyArc.toUpperCase()}
              </div>
            )}
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto sm:max-h-[80vh]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-mono text-neutral-500">STORY</div>
                <div className="text-2xl font-bold mt-1" style={{ color: meta.color }}>{story.creator}</div>
                <div className="text-sm text-neutral-400">{story.date} · {story.day}</div>
              </div>
              <button onClick={onClose} className="text-neutral-400 hover:text-white text-2xl">×</button>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Concept</div>
              <div className="text-neutral-200">{story.concept}</div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-xl p-4">
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold mb-2">
                📝 Text overlay (goes ON the story photo)
              </div>
              <div className="text-white text-lg font-bold">{story.overlayText}</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wider text-neutral-500">Higgsfield prompt</div>
                <button
                  onClick={copy}
                  className="text-xs bg-blue-500 hover:bg-blue-400 text-white px-3 py-1 rounded font-semibold"
                >
                  {copied ? '✓ Copied' : 'Copy prompt'}
                </button>
              </div>
              <div className="text-xs text-neutral-400 bg-neutral-950 p-3 rounded border border-neutral-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                {story.prompt}
              </div>
            </div>

            {/* READY-TO-POST PREVIEW */}
            <div className="border-2 border-emerald-500/40 bg-emerald-500/5 rounded-xl p-4 space-y-2">
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">🚀 Overlay text (already baked into image, but here if you want it separately)</div>
              <div className="text-neutral-100 whitespace-pre-wrap bg-neutral-950/60 p-3 rounded border border-neutral-800 text-sm font-semibold">
                {story.overlayText}
              </div>
            </div>

            {/* DOWNLOAD IMAGE */}
            {story.imageUrl && (
              <a
                href={story.imageUrl}
                download={`story-${story.id}-${story.creator}.png`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between gap-3 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-xl font-semibold transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">⬇️</span>
                  <span>Download image</span>
                </span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded">Save to device</span>
              </a>
            )}

            {/* AUTO-PUBLISH TO INSTAGRAM STORY */}
            <button
              onClick={publishToIG}
              disabled={publishing}
              className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold transition-all"
            >
              <span className="flex items-center gap-2">
                <span className="text-lg">📷</span>
                <span>{publishing ? 'Publishing…' : 'Auto-publish to Instagram Story'}</span>
              </span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded">{publishing ? '⏳' : 'Live'}</span>
            </button>
            {publishResult && (
              <div className="text-xs bg-neutral-950 border border-neutral-800 rounded px-3 py-2 break-all">
                {publishResult}
              </div>
            )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(story.overlayText)
                setCopied(true)
                setTimeout(() => setCopied(false), 1500)
              }}
              className="w-full text-xs text-neutral-400 hover:text-neutral-200 underline"
            >
              {copied ? '✓ Overlay text copied' : 'or copy overlay text manually'}
            </button>
            <div className="text-[10px] text-neutral-500 text-center">
              Stories only exist on Instagram (TikTok doesn't have stories)
            </div>

            {story.storyArc && (
              <div className="text-xs bg-orange-500/10 border border-orange-500/40 rounded-lg p-3">
                <span className="text-orange-300 font-semibold uppercase tracking-wider">Story arc:</span>
                <span className="text-orange-100 ml-2">{story.storyArc}</span>
              </div>
            )}
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
