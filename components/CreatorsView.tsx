'use client'
import { CREATOR_META, Creator } from '@/lib/types'
import { CALENDAR } from '@/lib/calendar'
import { useState } from 'react'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']

export default function CreatorsView() {
  const [openCreator, setOpenCreator] = useState<Creator | null>(null)

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Meet the Squad 💫</h2>
        <p className="text-neutral-400 text-sm">4 AI influencers, 4 cities, 1 group chat. College friends from Yale who all just started posting.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {CREATORS.map((c) => {
          const meta = CREATOR_META[c]
          const postCount = CALENDAR.filter(p => p.creator === c).length
          const videoCount = CALENDAR.filter(p => p.creator === c && p.isProductVideo).length

          return (
            <button
              key={c}
              onClick={() => setOpenCreator(c)}
              className="text-left bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-2xl overflow-hidden transition-all group"
              style={{ borderTopColor: meta.color, borderTopWidth: 4 }}
            >
              <div className="aspect-[3/4] relative bg-neutral-950 overflow-hidden">
                <img src={meta.anchorImageUrl} alt={c} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="text-2xl font-bold text-white mb-1">{c}</div>
                  <div className="text-xs text-neutral-300">{meta.city}, {meta.country}</div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="text-sm font-semibold" style={{ color: meta.color }}>{meta.niche}</div>
                <a
                  href={meta.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
                >
                  📷 {meta.handle} ↗
                </a>
                {meta.tiktokAvailable && meta.tiktokUrl && (
                  <a
                    href={meta.tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-neutral-400 hover:text-neutral-200 flex items-center gap-1"
                  >
                    🎵 {meta.tiktokHandle} ↗
                  </a>
                )}
                <div className="flex gap-3 text-xs text-neutral-500 pt-1">
                  <span>{postCount} posts</span>
                  <span>·</span>
                  <span>{videoCount} videos</span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {openCreator && (
        <CreatorDetailModal
          creator={openCreator}
          onClose={() => setOpenCreator(null)}
        />
      )}
    </div>
  )
}

function CreatorDetailModal({ creator, onClose }: { creator: Creator; onClose: () => void }) {
  const meta = CREATOR_META[creator]
  const posts = CALENDAR.filter(p => p.creator === creator)
  const videos = posts.filter(p => p.isProductVideo)
  const petPosts = posts.filter(p => p.isPetPost)
  const dubaiPosts = posts.filter(p => p.isDubaiArc)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
      <div
        className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-5xl w-full my-8 overflow-hidden"
        style={{ borderTopColor: meta.color, borderTopWidth: 4 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-1 md:grid-cols-5">
          <div className="md:col-span-2 bg-neutral-950 relative overflow-hidden min-h-[400px]">
            <img src={meta.anchorImageUrl} alt={creator} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="text-4xl font-bold text-white mb-2">{creator}</div>
              <div className="text-neutral-300">{meta.city}, {meta.country}</div>
            </div>
          </div>

          <div className="md:col-span-3 p-6 space-y-5 overflow-y-auto max-h-[80vh]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold uppercase tracking-widest" style={{ color: meta.color }}>{meta.niche}</div>
                <div className="flex flex-col gap-1 mt-1">
                  <a href={meta.instagramUrl} target="_blank" rel="noreferrer" className="text-sm text-neutral-400 hover:text-white flex items-center gap-2">
                    <span>📷</span> {meta.handle} ↗
                  </a>
                  {meta.tiktokAvailable && meta.tiktokUrl ? (
                    <a href={meta.tiktokUrl} target="_blank" rel="noreferrer" className="text-sm text-neutral-400 hover:text-white flex items-center gap-2">
                      <span>🎵</span> {meta.tiktokHandle} ↗
                    </a>
                  ) : (
                    <span className="text-xs text-neutral-600 flex items-center gap-2">
                      <span>🚫</span> TikTok not available (banned in India)
                    </span>
                  )}
                </div>
              </div>
              <button onClick={onClose} className="text-neutral-400 hover:text-white text-2xl leading-none">×</button>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Bio</div>
              <div className="text-neutral-200 whitespace-pre-line text-sm bg-neutral-950 p-3 rounded border border-neutral-800">{meta.bio}</div>
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Backstory</div>
              <div className="text-neutral-300 text-sm">{meta.backstory}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Face vibe</div>
                <div className="text-neutral-300 text-xs">{meta.faceVibe}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Body</div>
                <div className="text-neutral-300 text-xs">{meta.bodyType}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Identity lock</div>
                <div className="text-neutral-300 text-xs">{meta.identityLock}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-500 mb-1">Personality</div>
                <div className="text-neutral-300 text-xs">{meta.personality}</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 pt-2">
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                <div className="text-xl font-bold text-white">{posts.length}</div>
                <div className="text-[10px] text-neutral-500 uppercase mt-1">Posts</div>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                <div className="text-xl font-bold text-red-400">{videos.length}</div>
                <div className="text-[10px] text-neutral-500 uppercase mt-1">Videos</div>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                <div className="text-xl font-bold text-pink-400">{petPosts.length}</div>
                <div className="text-[10px] text-neutral-500 uppercase mt-1">Pet</div>
              </div>
              <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-2 text-center">
                <div className="text-xl font-bold text-orange-400">{dubaiPosts.length}</div>
                <div className="text-[10px] text-neutral-500 uppercase mt-1">Dubai</div>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
              <div className="text-xs uppercase tracking-wider text-neutral-500">👗 Fashion identity</div>
              <div className="text-sm text-neutral-200">{meta.fashionStyle}</div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Brands</div>
                <div className="flex flex-wrap gap-1">
                  {meta.fashionBrands.map(b => (
                    <span key={b} className="text-[10px] bg-neutral-800 px-2 py-0.5 rounded-full">{b}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Signature looks</div>
                <ul className="text-xs text-neutral-400 space-y-1">
                  {meta.signatureLooks.map((l, i) => (
                    <li key={i} className="flex gap-2"><span className="text-neutral-600">•</span>{l}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2">
              <div className="text-xs uppercase tracking-wider text-neutral-500">🚗 Signature Car (face-locked)</div>
              <div>
                <div className="text-sm font-semibold text-white">{meta.carColor} {meta.carModel}</div>
                <div className="text-xs text-neutral-500 mt-1">Plate: <span className="font-mono">{meta.carPlate}</span></div>
                <div className="text-xs text-neutral-400 mt-2">{meta.carDescription}</div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="text-xs uppercase tracking-wider text-neutral-500">Tech IDs</div>
              <div className="text-xs font-mono space-y-1">
                <div className="bg-neutral-950 p-2 rounded border border-neutral-800 break-all">
                  <span className="text-neutral-500">Soul ID: </span>
                  <span className="text-neutral-300">{meta.soulId}</span>
                </div>
                <div className="bg-neutral-950 p-2 rounded border border-neutral-800 break-all">
                  <span className="text-neutral-500">Voice ID: </span>
                  <span className="text-neutral-300">{meta.voiceId}</span>
                </div>
                <div className="bg-neutral-950 p-2 rounded border border-neutral-800 break-all">
                  <span className="text-neutral-500">Reference Element: </span>
                  <span className="text-neutral-300">{meta.referenceElementId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
