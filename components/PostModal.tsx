'use client'
import { Post, CREATOR_META } from '@/lib/types'
import { useState } from 'react'

export default function PostModal({ post, onClose }: { post: Post | null; onClose: () => void }) {
  const [copied, setCopied] = useState<string | null>(null)
  if (!post) return null
  const meta = CREATOR_META[post.creator]

  const igCopy = `${post.caption}\n\n${post.hashtags.map(t => '#' + t).join(' ')}`
  const tiktokCopy = `${post.caption}\n\n${post.hashtags.slice(0, 3).map(t => '#' + t).join(' ')} #fyp #foryou`
  const tiktokAvailable = meta.tiktokAvailable

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full my-8 overflow-hidden"
        style={{ borderTopColor: meta.color, borderTopWidth: 4 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-neutral-950 aspect-[4/5] md:aspect-auto flex items-center justify-center p-6 relative">
            {post.imageUrl ? (
              <img src={post.imageUrl} alt={post.concept} className="max-w-full max-h-[600px] object-contain rounded-lg" />
            ) : (
              <div className="text-center space-y-4">
                <div className="text-7xl">
                  {post.format === 'carousel' ? '📚' : post.format === 'video' ? '🎥' : '📷'}
                </div>
                <div className="text-sm text-neutral-500 uppercase tracking-widest">
                  {post.format} {post.slides > 1 && `· ${post.slides} slides`}
                </div>
                <div className="text-neutral-400 text-sm max-w-xs mx-auto px-4">
                  {post.format === 'video' ? 'Video will be generated when you share reference + product' : 'Preview will appear here after Higgsfield generation.'}
                </div>
              </div>
            )}
            {post.isDubaiArc && (
              <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">🌴 Dubai Arc</div>
            )}
            {post.isPetPost && post.petName && (
              <div className="absolute top-4 left-4 bg-pink-500 text-white px-3 py-1 rounded-full text-xs font-semibold">🐕 {post.petName}</div>
            )}
            {post.isProductVideo && (
              <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">🎥 Product Video</div>
            )}
          </div>
          <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-neutral-500 mb-1">POST #{post.id}/99</div>
                <div className="text-2xl font-bold" style={{ color: meta.color }}>{post.creator}</div>
                <a href={meta.instagramUrl} target="_blank" rel="noreferrer" className="text-sm text-neutral-400 hover:text-neutral-200 transition-colors">
                  {meta.handle} · {meta.city}, {meta.country} ↗
                </a>
                <div className="text-xs text-neutral-500 mt-1">{meta.niche}</div>
              </div>
              <button onClick={onClose} className="text-neutral-400 hover:text-white text-2xl leading-none">×</button>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="bg-neutral-800 px-2 py-1 rounded">{post.date}</span>
              <span className="bg-neutral-800 px-2 py-1 rounded">{post.day}</span>
              <span className="bg-neutral-800 px-2 py-1 rounded uppercase">{post.format}</span>
              {post.slides > 1 && <span className="bg-neutral-800 px-2 py-1 rounded">{post.slides} slides</span>}
              <span className="bg-neutral-800 px-2 py-1 rounded capitalize">{post.status}</span>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Concept</div>
              <div className="text-neutral-200">{post.concept}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Photo description</div>
              <div className="text-neutral-300 text-sm">{post.photoDescription}</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wider text-neutral-500">Higgsfield prompt</div>
                <button
                  onClick={() => copy(post.prompt, 'prompt')}
                  className="text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-1 rounded"
                >
                  {copied === 'prompt' ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="text-xs text-neutral-400 bg-neutral-950 p-3 rounded-lg border border-neutral-800 max-h-32 overflow-y-auto whitespace-pre-wrap">
                {post.prompt}
              </div>
            </div>

            {/* READY-TO-POST PREVIEW */}
            <div className="border-2 border-emerald-500/40 bg-emerald-500/5 rounded-xl p-4 space-y-2">
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">🚀 Ready-to-post (caption + hashtags)</div>
              <div className="text-neutral-100 whitespace-pre-wrap bg-neutral-950/60 p-3 rounded border border-neutral-800 text-sm">
                {igCopy}
              </div>
              {tiktokAvailable && (
                <div>
                  <div className="text-[10px] text-cyan-300 uppercase tracking-wider mb-1">TikTok version (with FYP tags)</div>
                  <div className="text-neutral-200 whitespace-pre-wrap bg-neutral-950/60 p-2 rounded border border-neutral-800 text-xs">
                    {tiktokCopy}
                  </div>
                </div>
              )}
            </div>

            {/* DOWNLOAD IMAGE */}
            {post.imageUrl && (
              <a
                href={post.imageUrl}
                download={`post-${post.id}-${post.creator}.png`}
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

            {/* ONE-CLICK PLATFORM COPY (simplified) */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-neutral-500">📤 Push to platform</div>

              {/* Instagram button */}
              <button
                onClick={() => copy(igCopy, 'ig')}
                className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 text-white px-4 py-3 rounded-xl font-semibold transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">📷</span>
                  <span>Push to Instagram</span>
                </span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {copied === 'ig' ? '✓ Copied — open IG app' : 'Copy caption + hashtags'}
                </span>
              </button>

              {/* TikTok button (only for Ava + Mia) */}
              {tiktokAvailable ? (
                <button
                  onClick={() => copy(tiktokCopy, 'tt')}
                  className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-cyan-500 to-pink-500 hover:opacity-90 text-white px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🎵</span>
                    <span>Push to TikTok</span>
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {copied === 'tt' ? '✓ Copied — open TikTok' : 'Copy caption + FYP tags'}
                  </span>
                </button>
              ) : (
                <div className="text-xs text-neutral-500 bg-neutral-950 px-4 py-2 rounded-lg border border-neutral-800">
                  🚫 TikTok not available for {post.creator} (banned in India)
                </div>
              )}

              <div className="text-[10px] text-neutral-500 text-center">
                Auto-publish via API coming soon (after Meta + TikTok approval)
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Soul ID (for Higgsfield)</div>
              <div className="text-xs font-mono text-neutral-400 bg-neutral-950 p-2 rounded border border-neutral-800 break-all">
                {meta.soulId}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
