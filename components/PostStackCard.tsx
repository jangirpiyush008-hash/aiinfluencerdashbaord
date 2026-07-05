'use client'
import { CREATOR_META } from '@/lib/types'
import { isDone } from '@/lib/doneState'
import { InstagramIcon, TikTokIcon } from '@/components/BrandIcons'
import type { PostStack } from '@/app/page'

export default function PostStackCard({ stack, onClick }: { stack: PostStack; onClick: () => void }) {
  const meta = CREATOR_META[stack.creator]
  const cover = stack.posts.find(p => p.imageUrl) || stack.posts[0]
  const doneCount = stack.posts.filter(p => isDone(p.id)).length
  const allDone = doneCount === stack.posts.length && stack.posts.length > 0
  const totalSlides = stack.posts.reduce((n, p) => n + (p.imageUrls?.length || (p.imageUrl ? 1 : 0)), 0)
  const hasTikTok = stack.posts.some(p => p.format === 'tiktok-slideshow' || p.isCrossPostReel)

  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-neutral-900/70 hover:bg-neutral-900 border border-white/5 hover:border-white/20 rounded-2xl overflow-hidden hover-lift backdrop-blur-sm"
      style={{
        borderTopColor: meta.color,
        borderTopWidth: 3,
        boxShadow: `0 10px 34px -16px ${meta.color}77`,
        opacity: allDone ? 0.55 : 1,
      }}
    >
      <div className="aspect-[4/5] relative bg-neutral-950 flex items-center justify-center overflow-hidden">
        {cover.imageUrl ? (
          <img
            src={cover.imageUrl}
            alt={cover.concept}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          />
        ) : (
          <div className="text-center p-4">
            <div className="text-5xl mb-2">📷</div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">
              {stack.posts.length} post{stack.posts.length > 1 ? 's' : ''} pending
            </div>
          </div>
        )}

        {/* gradient scrim for readability */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {totalSlides > 1 && (
          <div className="absolute top-2.5 right-2.5 bg-black/75 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm ring-1 ring-white/10">
            {stack.posts.length > 1 ? `${stack.posts.length} posts · ${totalSlides} imgs` : `${totalSlides} imgs`}
          </div>
        )}
        {allDone && (
          <div className="absolute inset-0 bg-emerald-500/25 flex items-center justify-center backdrop-blur-[2px]">
            <div className="bg-emerald-500 text-white text-lg font-bold px-5 py-2 rounded-full shadow-2xl">✓ Done</div>
          </div>
        )}
        {!allDone && doneCount > 0 && (
          <div className="absolute bottom-2.5 right-2.5 bg-emerald-500/85 text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {doneCount}/{stack.posts.length} done
          </div>
        )}
        {stack.posts.some(p => p.isDubaiArc) && (
          <div className="absolute top-2.5 left-2.5 bg-orange-500/90 text-white text-xs px-2.5 py-1 rounded-full">🌴 Dubai</div>
        )}
        {stack.posts.some(p => p.isPetPost) && (
          <div className="absolute top-10 left-2.5 bg-pink-500/90 text-white text-xs px-2.5 py-1 rounded-full">
            🐕 {stack.posts.find(p => p.petName)?.petName}
          </div>
        )}

        {/* creator identity on the image */}
        <div className="absolute bottom-2.5 left-2.5 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.anchorImageUrl}
            alt={stack.creator}
            className="w-7 h-7 rounded-full object-cover ring-2"
            style={{ ['--tw-ring-color' as string]: meta.color }}
          />
          <div>
            <div className="text-xs font-bold leading-none" style={{ color: meta.color }}>{stack.creator}</div>
            <div className="text-[10px] text-neutral-300 leading-tight">{stack.day} · {stack.date}</div>
          </div>
        </div>
      </div>

      <div className="p-3.5 space-y-2">
        <div className="text-sm text-neutral-100 font-medium line-clamp-2 leading-snug">
          {stack.posts[0].concept}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-pink-500/15 text-pink-300 px-2 py-0.5 rounded-full">
            <InstagramIcon className="w-3 h-3" /> {stack.posts[0].format === 'carousel' ? 'Carousel' : stack.posts[0].format}
          </span>
          {hasTikTok && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-cyan-500/15 text-cyan-300 px-2 py-0.5 rounded-full">
              <TikTokIcon className="w-3 h-3" /> Slideshow
            </span>
          )}
          <span className="text-[10px] text-neutral-500 ml-auto capitalize">{stack.posts[0].status}</span>
        </div>
      </div>
    </button>
  )
}
