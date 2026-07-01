'use client'
import { Post, CREATOR_META } from '@/lib/types'

export default function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const meta = CREATOR_META[post.creator]
  const statusColor = {
    pending: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    generated: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    scheduled: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    posted: 'bg-green-500/20 text-green-300 border-green-500/30'
  }[post.status]

  return (
    <button
      onClick={onClick}
      className="group text-left w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all"
      style={{ borderTopColor: meta.color, borderTopWidth: 3 }}
    >
      <div className="aspect-[4/5] relative bg-neutral-950 flex items-center justify-center overflow-hidden">
        {post.imageUrl ? (
          <img src={post.imageUrl} alt={post.concept} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <div className="text-5xl mb-2">
              {post.format === 'carousel' ? '📚' : post.format === 'video' ? '🎥' : '📷'}
            </div>
            <div className="text-xs text-neutral-500 uppercase tracking-wider">
              {post.format} · {post.slides > 1 ? `${post.slides} slides` : '1 slide'}
            </div>
            <div className="mt-3 text-xs text-neutral-400 line-clamp-3 px-2">{post.photoDescription}</div>
          </div>
        )}
        {post.isDubaiArc && (
          <div className="absolute top-2 right-2 bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full">🌴 Dubai</div>
        )}
        {post.isPetPost && post.petName && (
          <div className="absolute top-2 left-2 bg-pink-500/90 text-white text-xs px-2 py-1 rounded-full">🐕 {post.petName}</div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-neutral-500">#{post.id}/99</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColor}`}>{post.status}</span>
        </div>
        <div>
          <div className="font-semibold text-sm" style={{ color: meta.color }}>{post.creator}</div>
          <div className="text-xs text-neutral-500">{post.date} · {post.day}</div>
        </div>
        <div className="text-sm text-neutral-200 line-clamp-2 leading-snug">{post.concept}</div>
        <div className="text-xs text-neutral-400 italic line-clamp-2">"{post.caption}"</div>
      </div>
    </button>
  )
}
