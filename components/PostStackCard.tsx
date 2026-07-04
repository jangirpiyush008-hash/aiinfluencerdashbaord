'use client'
import { CREATOR_META } from '@/lib/types'
import { isDone } from '@/lib/doneState'
import type { PostStack } from '@/app/page'

export default function PostStackCard({ stack, onClick }: { stack: PostStack; onClick: () => void }) {
  const meta = CREATOR_META[stack.creator]
  const cover = stack.posts.find(p => p.imageUrl) || stack.posts[0]
  const doneCount = stack.posts.filter(p => isDone(p.id)).length
  const allDone = doneCount === stack.posts.length && stack.posts.length > 0
  const totalSlides = stack.posts.reduce((n, p) => n + (p.imageUrls?.length || (p.imageUrl ? 1 : 0)), 0)

  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-neutral-900/70 hover:bg-neutral-900 border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden hover-lift backdrop-blur-sm"
      style={{
        borderTopColor: meta.color,
        borderTopWidth: 3,
        boxShadow: `0 8px 30px -14px ${meta.color}66`,
        opacity: allDone ? 0.55 : 1,
      }}
    >
      <div className="aspect-[4/5] relative bg-neutral-950 flex items-center justify-center overflow-hidden">
        {cover.imageUrl ? (
          <img
            src={cover.imageUrl}
            alt={cover.concept}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="text-center p-4">
            <div className="text-5xl mb-2">📷</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">
              {stack.posts.length} post{stack.posts.length > 1 ? 's' : ''}
            </div>
          </div>
        )}
        {totalSlides > 1 && (
          <div className="absolute top-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur">
            {stack.posts.length > 1 ? `${stack.posts.length} posts · ${totalSlides} imgs` : `${totalSlides} imgs`}
          </div>
        )}
        {allDone && (
          <div className="absolute inset-0 bg-emerald-500/25 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-emerald-500 text-white text-lg font-bold px-4 py-2 rounded-full shadow-2xl">✓ Done</div>
          </div>
        )}
        {!allDone && doneCount > 0 && (
          <div className="absolute bottom-2 right-2 bg-emerald-500/80 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {doneCount}/{stack.posts.length} done
          </div>
        )}
        {stack.posts.some(p => p.isDubaiArc) && (
          <div className="absolute top-2 left-2 bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full">🌴 Dubai</div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="font-semibold text-sm" style={{ color: meta.color }}>{stack.creator}</div>
          <span className="text-xs text-neutral-500">{stack.day}</span>
          <span className="text-xs text-neutral-600 ml-auto">{stack.date}</span>
        </div>
        <div className="text-sm text-neutral-200 line-clamp-2 leading-snug">
          {stack.posts.length === 1
            ? stack.posts[0].concept
            : stack.posts.map(p => p.format === 'tiktok-slideshow' ? '🎵 TikTok' : p.format === 'video' ? '🎥 Reel' : '📸 Feed').join(' · ')}
        </div>
        <div className="text-xs text-neutral-400 italic line-clamp-2">"{stack.posts[0].caption}"</div>
      </div>
    </button>
  )
}
