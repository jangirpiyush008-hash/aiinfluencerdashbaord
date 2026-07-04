'use client'
import { Post, CREATOR_META } from '@/lib/types'
import { useEffect, useState } from 'react'
import { isDone, setDone } from '@/lib/doneState'
import type { PostStack } from '@/app/page'

export default function PostModal({ stack, onClose }: { stack: PostStack | null; onClose: () => void }) {
  const [postIdx, setPostIdx] = useState(0)
  const post: Post | null = stack ? stack.posts[Math.min(postIdx, stack.posts.length - 1)] : null

  const [copied, setCopied] = useState<string | null>(null)
  const [productName, setProductName] = useState(post?.productName || '')
  const [affiliateLink, setAffiliateLink] = useState(post?.affiliateLink || '')
  const [doneState, setDoneState] = useState<boolean>(post ? isDone(post.id) : false)
  const [publishing, setPublishing] = useState(false)
  const [publishResult, setPublishResult] = useState<string | null>(null)
  const [publishingTT, setPublishingTT] = useState(false)
  const [publishResultTT, setPublishResultTT] = useState<string | null>(null)
  const [slideUrlsText, setSlideUrlsText] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [slideIndex, setSlideIndex] = useState(0)
  const [downloadingAll, setDownloadingAll] = useState(false)

  // Reset postIdx when the stack changes
  useEffect(() => { setPostIdx(0) }, [stack?.key])

  useEffect(() => {
    if (post) {
      setProductName(post.productName || '')
      setAffiliateLink(post.affiliateLink || '')
      setDoneState(isDone(post.id))
      // Persist to localStorage per post so it survives modal close
      const key = `post-${post.id}-link`
      const saved = localStorage.getItem(key)
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setProductName(data.productName || post.productName || '')
          setAffiliateLink(data.affiliateLink || post.affiliateLink || '')
        } catch {}
      }
      // Load saved slide URLs (for carousels) and video URL (for reels)
      const mediaKey = `post-${post.id}-media`
      const savedMedia = localStorage.getItem(mediaKey)
      if (savedMedia) {
        try {
          const m = JSON.parse(savedMedia)
          setSlideUrlsText((m.imageUrls || post.imageUrls || []).join('\n') || (post.imageUrl && post.format === 'carousel' ? post.imageUrl : ''))
          setVideoUrl(m.videoUrl || post.videoUrl || '')
        } catch {}
      } else {
        setSlideUrlsText((post.imageUrls || []).join('\n') || (post.imageUrl && post.format === 'carousel' ? post.imageUrl : ''))
        setVideoUrl(post.videoUrl || '')
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post?.id])

  const saveMedia = (imageUrls: string[], videoUrl: string) => {
    if (!post) return
    localStorage.setItem(`post-${post.id}-media`, JSON.stringify({ imageUrls, videoUrl }))
  }

  if (!post || !stack) return null
  const meta = CREATOR_META[post.creator]
  const toggleDone = () => { const nv = !doneState; setDone(post.id, nv); setDoneState(nv) }

  const linkSuffix = affiliateLink ? `\n\n🛒 link in bio 👆` : ''
  const locationTag = post.location || `${meta.city}, ${meta.country}`
  const locationLine = `\n📍 ${locationTag}`

  const igCopy = `${post.caption}${locationLine}${linkSuffix}\n\n${post.hashtags.map(t => '#' + t).join(' ')}`
  const trendingTags = ['viral','trending','explore','reels','instadaily','fyp','2026']
  const igCopyTrending = `${post.caption}${locationLine}${linkSuffix}\n\n${[...post.hashtags, ...trendingTags].map(t => '#' + t).join(' ')}`
  const tiktokCopy = `${post.caption}${locationLine}${linkSuffix}\n\n${post.hashtags.slice(0, 3).map(t => '#' + t).join(' ')} #fyp #foryou #viral`
  const pinterestCopy = `TITLE: ${post.concept}\n\nDESCRIPTION: ${post.caption}\n\nDESTINATION LINK: ${affiliateLink || '(none — leave blank on Pinterest)'}\n\nHASHTAGS: ${post.hashtags.map(t => '#' + t).join(' ')}`

  const saveLink = () => {
    localStorage.setItem(`post-${post.id}-link`, JSON.stringify({ productName, affiliateLink }))
  }
  const tiktokAvailable = meta.tiktokAvailable
  const pinterestAvailable = meta.pinterestAvailable

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 1500)
  }

  // Parse pasted slide URLs (one per line, ignore blanks)
  const parsedSlideUrls = slideUrlsText
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.startsWith('http'))

  const publishToTikTok = async () => {
    const finalVideoUrl = videoUrl || post.videoUrl || ''
    if (!finalVideoUrl.startsWith('http')) {
      setPublishResultTT('❌ Need a reel video URL. Paste MP4 URL in the field above (Reel video URL section) or use a video post.')
      return
    }
    setPublishingTT(true)
    setPublishResultTT(null)
    try {
      const res = await fetch('/api/publish-tiktok', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creator: post.creator, videoUrl: finalVideoUrl }),
      })
      const json = await res.json()
      if (json.ok) {
        setPublishResultTT(`✅ Uploaded to ${post.creator}'s TikTok drafts! Open TikTok app → drafts → add music → publish.`)
      } else {
        setPublishResultTT(`❌ ${json.error || 'TikTok upload failed'}`)
      }
    } catch (err) {
      setPublishResultTT(`❌ ${err instanceof Error ? err.message : 'Network error'}`)
    } finally {
      setPublishingTT(false)
    }
  }

  const publishToIG = async () => {
    let kind: 'feed' | 'carousel' | 'reel'
    const payload: {
      creator: string
      kind: string
      caption: string
      imageUrl?: string
      imageUrls?: string[]
      videoUrl?: string
    } = { creator: post.creator, kind: 'feed', caption: igCopy }

    if (post.format === 'video') {
      kind = 'reel'
      const finalVideoUrl = videoUrl || post.videoUrl || ''
      if (!finalVideoUrl.startsWith('http')) {
        setPublishResult('❌ Paste the reel video URL in the field below first')
        return
      }
      payload.kind = 'reel'
      payload.videoUrl = finalVideoUrl
    } else if (post.format === 'carousel') {
      kind = 'carousel'
      const urls = parsedSlideUrls.length
        ? parsedSlideUrls
        : post.imageUrls?.length
        ? post.imageUrls
        : post.imageUrl
        ? [post.imageUrl]
        : []
      if (urls.length < 2) {
        setPublishResult(`❌ Carousel needs 2-10 slide URLs. Paste them below (one per line). Currently: ${urls.length}`)
        return
      }
      if (urls.length > 10) {
        setPublishResult(`❌ Instagram allows max 10 slides per carousel. Currently: ${urls.length}`)
        return
      }
      payload.kind = 'carousel'
      payload.imageUrls = urls
    } else {
      kind = 'feed'
      const finalImageUrl = post.imageUrl || parsedSlideUrls[0] || ''
      if (!finalImageUrl.startsWith('http')) {
        setPublishResult('❌ No imageUrl — generate the post first (or paste URL below)')
        return
      }
      payload.kind = 'feed'
      payload.imageUrl = finalImageUrl
    }

    // Persist media URLs so they survive reloads
    saveMedia(parsedSlideUrls, videoUrl)

    setPublishing(true)
    setPublishResult(null)
    try {
      const res = await fetch('/api/publish-instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (json.ok) {
        setPublishResult(`✅ Published (${kind})! View: ${json.permalink}`)
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
        className="bg-neutral-900 border border-neutral-800 sm:rounded-2xl max-w-4xl w-full sm:my-8 overflow-hidden min-h-screen sm:min-h-0"
        style={{ borderTopColor: meta.color, borderTopWidth: 4 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* STACK NAV — jump between posts in the same creator/day stack */}
        <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-neutral-950 border-b border-neutral-800">
          {stack.posts.length > 1 && (
            <>
              <button
                onClick={() => setPostIdx((postIdx - 1 + stack.posts.length) % stack.posts.length)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg"
                aria-label="Previous post"
              >‹</button>
              <div className="text-xs text-neutral-400">
                Post <span className="text-white font-semibold">{postIdx + 1}</span> / {stack.posts.length}
                <span className="mx-2 text-neutral-600">·</span>
                <span className="uppercase text-[10px] tracking-wider" style={{ color: meta.color }}>
                  {post.format === 'tiktok-slideshow' ? '🎵 TikTok slideshow' : post.format === 'video' ? '🎥 Reel' : post.format === 'carousel' ? '📚 Carousel' : '📷 ' + post.format}
                </span>
              </div>
              <button
                onClick={() => setPostIdx((postIdx + 1) % stack.posts.length)}
                className="bg-neutral-800 hover:bg-neutral-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg"
                aria-label="Next post"
              >›</button>
            </>
          )}
          <button
            onClick={toggleDone}
            className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
              doneState ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
          >
            {doneState ? '✓ Done — click to undo' : 'Mark done'}
          </button>
          <button onClick={onClose} className="text-neutral-400 hover:text-white text-2xl leading-none px-2">×</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-neutral-950 aspect-[4/5] md:aspect-auto flex items-center justify-center p-6 relative">
            {(() => {
              const previewUrls: string[] = post.format === 'carousel'
                ? (parsedSlideUrls.length ? parsedSlideUrls : post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [])
                : post.imageUrl ? [post.imageUrl] : []
              const idx = Math.min(slideIndex, previewUrls.length - 1)
              if (previewUrls.length === 0) {
                return (
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
                )
              }
              return (
                <>
                  <img key={previewUrls[idx]} src={previewUrls[idx]} alt={`${post.concept} slide ${idx + 1}`} className="max-w-full max-h-[600px] object-contain rounded-lg" />
                  {previewUrls.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSlideIndex((idx - 1 + previewUrls.length) % previewUrls.length) }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl leading-none backdrop-blur z-20 shadow-lg cursor-pointer"
                        aria-label="Previous slide"
                      >‹</button>
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSlideIndex((idx + 1) % previewUrls.length) }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black text-white w-10 h-10 rounded-full flex items-center justify-center text-2xl leading-none backdrop-blur z-20 shadow-lg cursor-pointer"
                        aria-label="Next slide"
                      >›</button>
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur z-20">
                        {idx + 1} / {previewUrls.length}
                      </div>
                      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                        {previewUrls.map((_, i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSlideIndex(i) }}
                            className={`h-2 rounded-full transition-all cursor-pointer ${i === idx ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70 w-2'}`}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )
            })()}
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
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto sm:max-h-[80vh]">
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

            {/* AFFILIATE LINK INPUT — single URL field */}
            <div className="border-2 border-purple-500/40 bg-purple-500/5 rounded-xl p-4 space-y-3">
              <div className="text-xs uppercase tracking-wider text-purple-300 font-semibold">🔗 Link (optional)</div>
              <input
                type="url"
                placeholder="https://amazon.com/... or affiliate short link"
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                onBlur={saveLink}
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
              />
              <div className="text-[11px] text-neutral-400 leading-relaxed space-y-0.5">
                <div>📌 <span className="text-red-300">Pinterest:</span> auto-attached as clickable pin destination</div>
                <div>📷 <span className="text-pink-300">Instagram:</span> auto-updates Linktree (bio link) + adds "link in bio" to caption</div>
                <div>🎵 <span className="text-cyan-300">TikTok:</span> auto-updates bio link now · in-video link unlocks at 1000 followers</div>
              </div>
            </div>

            {/* LOCATION TAG */}
            <div className="bg-purple-500/10 border border-purple-500/40 rounded-xl p-3 space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-purple-300 font-semibold">📍 Location tag</div>
              <div className="text-white text-sm">{locationTag}</div>
              <div className="text-[10px] text-neutral-400">Add this via Instagram's "Add Location" sticker when posting — geo tags 2-3× local reach.</div>
            </div>

            {/* READY-TO-POST PREVIEW */}
            <div className="border-2 border-emerald-500/40 bg-emerald-500/5 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">🚀 Ready-to-post caption</div>
                <button onClick={() => copy(igCopy, 'ig')} className="text-[10px] bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 px-2 py-1 rounded">
                  {copied === 'ig' ? '✓' : 'Copy'}
                </button>
              </div>
              <div className="text-neutral-100 whitespace-pre-wrap bg-neutral-950/60 p-3 rounded border border-neutral-800 text-sm">
                {igCopy}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-[10px] text-orange-300 uppercase tracking-wider">🔥 Trending variant (viral + fyp + explore + reels tags added)</div>
                  <button onClick={() => copy(igCopyTrending, 'igt')} className="text-[10px] bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 px-2 py-1 rounded">
                    {copied === 'igt' ? '✓' : 'Copy'}
                  </button>
                </div>
                <div className="text-neutral-200 whitespace-pre-wrap bg-neutral-950/60 p-2 rounded border border-neutral-800 text-xs">
                  {igCopyTrending}
                </div>
              </div>

              {tiktokAvailable && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[10px] text-cyan-300 uppercase tracking-wider">TikTok version (FYP + viral)</div>
                    <button onClick={() => copy(tiktokCopy, 'ttc')} className="text-[10px] bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 px-2 py-1 rounded">
                      {copied === 'ttc' ? '✓' : 'Copy'}
                    </button>
                  </div>
                  <div className="text-neutral-200 whitespace-pre-wrap bg-neutral-950/60 p-2 rounded border border-neutral-800 text-xs">
                    {tiktokCopy}
                  </div>
                </div>
              )}
            </div>

            {/* DOWNLOAD IMAGES — high quality, direct to laptop */}
            {(() => {
              const downloadUrls: string[] = post.format === 'carousel'
                ? (parsedSlideUrls.length ? parsedSlideUrls : post.imageUrls?.length ? post.imageUrls : post.imageUrl ? [post.imageUrl] : [])
                : post.imageUrl ? [post.imageUrl] : []
              if (downloadUrls.length === 0) return null

              const downloadAll = async () => {
                setDownloadingAll(true)
                try {
                  for (let i = 0; i < downloadUrls.length; i++) {
                    const url = downloadUrls[i]
                    const res = await fetch(url)
                    const blob = await res.blob()
                    const objUrl = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = objUrl
                    const label = downloadUrls.length > 1 ? `-slide-${i + 1}` : ''
                    a.download = `post-${post.id}-${post.creator}${label}.png`
                    document.body.appendChild(a)
                    a.click()
                    document.body.removeChild(a)
                    URL.revokeObjectURL(objUrl)
                    // small pause so browser doesn't cancel subsequent downloads
                    await new Promise((r) => setTimeout(r, 350))
                  }
                } finally {
                  setDownloadingAll(false)
                }
              }

              return (
                <button
                  onClick={downloadAll}
                  disabled={downloadingAll}
                  className="w-full flex items-center justify-between gap-3 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">⬇️</span>
                    <span>
                      {downloadingAll
                        ? `Downloading… (${downloadUrls.length} file${downloadUrls.length > 1 ? 's' : ''})`
                        : downloadUrls.length > 1
                        ? `Download all ${downloadUrls.length} images`
                        : 'Download image'}
                    </span>
                  </span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded">Full quality → laptop</span>
                </button>
              )
            })()}

            {/* MEDIA URLS — carousel slides or reel video */}
            {post.format === 'carousel' && (
              <div className="space-y-2 bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">
                    📚 Carousel slide URLs
                  </div>
                  <div className={`text-xs px-2 py-0.5 rounded ${parsedSlideUrls.length >= 2 && parsedSlideUrls.length <= 10 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-orange-500/20 text-orange-300'}`}>
                    {parsedSlideUrls.length}/{post.slides || 10} slides
                  </div>
                </div>
                <textarea
                  value={slideUrlsText}
                  onChange={(e) => setSlideUrlsText(e.target.value)}
                  onBlur={() => saveMedia(parsedSlideUrls, videoUrl)}
                  placeholder={`Paste one URL per line — in slide order (A, B, C…)\nhttps://d8j0.../slide-A.png\nhttps://d8j0.../slide-B.png\nhttps://d8j0.../slide-C.png`}
                  className="w-full bg-black border border-neutral-800 rounded p-2 text-xs font-mono text-neutral-200 min-h-[100px] resize-y"
                />
                {parsedSlideUrls.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {parsedSlideUrls.slice(0, 10).map((url, i) => (
                      <div key={i} className="flex-shrink-0 relative">
                        <img src={url} alt={`Slide ${i + 1}`} className="h-16 w-16 object-cover rounded border border-neutral-700" onError={(e) => (e.currentTarget.style.opacity = '0.3')} />
                        <div className="absolute top-0 left-0 bg-black/70 text-white text-[10px] px-1 rounded-br">{i + 1}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-[10px] text-neutral-500">
                  Instagram needs 2-10 slides in order. URLs persist across refreshes.
                </div>
              </div>
            )}

            {post.format === 'video' && (
              <div className="space-y-2 bg-neutral-950 border border-neutral-800 rounded-xl p-3">
                <div className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">🎥 Reel video URL</div>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  onBlur={() => saveMedia(parsedSlideUrls, videoUrl)}
                  placeholder="https://d8j0.../reel.mp4"
                  className="w-full bg-black border border-neutral-800 rounded p-2 text-xs font-mono text-neutral-200"
                />
                <div className="text-[10px] text-neutral-500">
                  MP4 URL from Higgsfield. Video processing takes ~20-60 sec after publish click.
                </div>
              </div>
            )}

            {/* ONE-CLICK PLATFORM COPY (simplified) */}
            <div className="space-y-3">
              <div className="text-xs uppercase tracking-wider text-neutral-500">📤 Push to platform</div>

              {/* Instagram button — auto-publish */}
              <button
                onClick={publishToIG}
                disabled={publishing}
                className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:opacity-90 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold transition-all"
              >
                <span className="flex items-center gap-2">
                  <span className="text-lg">📷</span>
                  <span>{publishing ? 'Publishing…' : 'Auto-publish to Instagram'}</span>
                </span>
                <span className="text-xs bg-white/20 px-2 py-1 rounded">
                  {publishing ? '⏳' : 'Live'}
                </span>
              </button>
              {publishResult && (
                <div className="text-xs bg-neutral-950 border border-neutral-800 rounded px-3 py-2 break-all">
                  {publishResult}
                </div>
              )}
              <button
                onClick={() => copy(igCopy, 'ig')}
                className="w-full text-xs text-neutral-400 hover:text-neutral-200 underline"
              >
                {copied === 'ig' ? '✓ Copied caption' : 'or copy caption manually'}
              </button>

              {/* TikTok button — available on ALL posts + all creators. Photo posts → TikTok Photos slideshow tool manually; video posts → auto-push to drafts. */}
              {tiktokAvailable ? (
                post.format === 'video' ? (
                  <>
                    <button
                      onClick={publishToTikTok}
                      disabled={publishingTT}
                      className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-cyan-500 to-pink-500 hover:opacity-90 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold transition-all"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">🎵</span>
                        <span>{publishingTT ? 'Uploading to drafts…' : 'Push to TikTok drafts (auto)'}</span>
                      </span>
                      <span className="text-xs bg-white/20 px-2 py-1 rounded">{publishingTT ? '⏳' : 'Draft'}</span>
                    </button>
                    {publishResultTT && (
                      <div className="text-xs bg-neutral-950 border border-neutral-800 rounded px-3 py-2 break-all">
                        {publishResultTT}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => copy(tiktokCopy, 'tt')}
                    className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-cyan-500 to-pink-500 hover:opacity-90 text-white px-4 py-3 rounded-xl font-semibold transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-lg">🎵</span>
                      <span>Push to TikTok (photos → auto-slideshow)</span>
                    </span>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {copied === 'tt' ? '✓ Caption copied' : 'Copy + open TikTok'}
                    </span>
                  </button>
                )
              ) : (
                <button
                  onClick={() => copy(tiktokCopy, 'tt')}
                  className="w-full flex items-center justify-between gap-3 bg-neutral-800 hover:bg-neutral-700 text-white px-4 py-3 rounded-xl font-semibold transition-all"
                  title="TikTok banned in India for Siya/Kiara — use CapCut Photo→Video Slideshow as backup (same output)."
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🎵</span>
                    <span>Push via CapCut Slideshow ({post.creator} = India)</span>
                  </span>
                  <span className="text-xs bg-white/10 px-2 py-1 rounded">
                    {copied === 'tt' ? '✓ Copied' : 'Copy caption'}
                  </span>
                </button>
              )}

              {/* Pinterest button (all 4 creators) */}
              {pinterestAvailable && (
                <button
                  onClick={() => copy(pinterestCopy, 'pin')}
                  className="w-full flex items-center justify-between gap-3 bg-gradient-to-r from-red-600 to-red-500 hover:opacity-90 text-white px-4 py-3 rounded-xl font-semibold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-lg">📌</span>
                    <span>Push to Pinterest</span>
                  </span>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">
                    {copied === 'pin' ? '✓ Copied — open Pinterest' : 'Copy title + description'}
                  </span>
                </button>
              )}

              <div className="text-[10px] text-neutral-500 text-center">
                Auto-publish via API coming soon (after Meta + TikTok + Pinterest approval)
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
