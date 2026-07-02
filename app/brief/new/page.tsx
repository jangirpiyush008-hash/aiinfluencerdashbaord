'use client'
import { useState, useEffect } from 'react'
import { CREATOR_META, type Creator } from '@/lib/types'
import { STORY_ARCS } from '@/lib/story'
import { STORIES } from '@/lib/stories'
import { EMPTY_BRIEF, encodeBrief, type VideoBrief } from '@/lib/brief'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']

function nextId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export default function NewBriefPage() {
  const [brief, setBrief] = useState<VideoBrief>({ ...EMPTY_BRIEF, id: '', createdAt: '' })
  const [copied, setCopied] = useState(false)
  const [shareUrl, setShareUrl] = useState<string>('')

  // Load draft from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('brief-draft-new')
    if (saved) {
      try {
        setBrief({ ...EMPTY_BRIEF, ...JSON.parse(saved) })
      } catch {}
    }
  }, [])

  // Auto-save
  useEffect(() => {
    localStorage.setItem('brief-draft-new', JSON.stringify(brief))
  }, [brief])

  const update = <K extends keyof VideoBrief>(key: K, value: VideoBrief[K]) => {
    setBrief((b) => ({ ...b, [key]: value }))
  }

  const upload = async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const json = await res.json()
    if (json.ok) return json.url as string
    return null
  }

  const onPhotoFiles = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const url = await upload(file)
      if (url) {
        setBrief((b) => ({ ...b, productPhotoUrls: [...b.productPhotoUrls, url] }))
      }
    }
  }

  const submit = () => {
    const finalBrief: VideoBrief = {
      ...brief,
      id: brief.id || nextId(),
      createdAt: brief.createdAt || new Date().toISOString(),
    }
    const encoded = encodeBrief(finalBrief)
    const url = `${window.location.origin}/brief/view?d=${encoded}`
    setShareUrl(url)
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  // Nearby stories for the picked creator
  const relatedStories = brief.creator
    ? STORIES.filter((s) => s.creator === brief.creator).slice(0, 30)
    : []

  const meta = brief.creator ? CREATOR_META[brief.creator as Creator] : null

  return (
    <main className="max-w-4xl mx-auto px-6 py-10 text-neutral-200">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">🎥 New Video Brief</h1>
        <p className="text-neutral-400 text-sm">
          Fill this in — every field feeds the ultra-detailed prompt Claude will generate.
          Draft auto-saves. Hit <b>Generate share URL</b> when done → paste URL to Claude.
        </p>
      </div>

      <div className="space-y-8">

        {/* SECTION 1 — PRODUCT */}
        <Section num={1} title="Product" desc="What you're selling. The more detail here, the more accurate the AI video.">
          <Field label="Product name" hint="Exact spelling as brand uses">
            <input
              type="text"
              value={brief.productName}
              onChange={(e) => update('productName', e.target.value)}
              placeholder="e.g. Cultsport Elevate Seamless Sports Bra"
              className={inputCls}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Brand">
              <input
                type="text"
                value={brief.productBrand}
                onChange={(e) => update('productBrand', e.target.value)}
                placeholder="e.g. Cultsport"
                className={inputCls}
              />
            </Field>
            <Field label="Category">
              <select
                value={brief.productCategory}
                onChange={(e) => update('productCategory', e.target.value)}
                className={inputCls}
              >
                <option value="">Pick category…</option>
                <option>Fitness apparel</option>
                <option>Fashion apparel</option>
                <option>Skincare</option>
                <option>Makeup</option>
                <option>Haircare</option>
                <option>Fragrance</option>
                <option>Fitness equipment</option>
                <option>Supplement / Nutrition</option>
                <option>Accessories / Bags</option>
                <option>Jewelry</option>
                <option>Shoes</option>
                <option>Tech</option>
                <option>Home / Lifestyle</option>
              </select>
            </Field>
          </div>
          <Field label="Key features (3-5)" hint="One per line — the wow-factors">
            <textarea
              value={brief.keyFeatures}
              onChange={(e) => update('keyFeatures', e.target.value)}
              placeholder={`e.g.:\nBuilt-in wireless bra support\nMoisture-wicking\nHigh-impact suitable for lifting\nSquat-proof leggings`}
              className={`${inputCls} min-h-[100px] font-mono text-xs`}
            />
          </Field>

          <Field label="Product photos" hint="Paste URLs (right-click brand site image → Copy image address) OR drag-drop files">
            <input
              type="url"
              placeholder="Paste image URL and press Enter"
              className={inputCls}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (v.startsWith('http')) {
                    update('productPhotoUrls', [...brief.productPhotoUrls, v])
                    ;(e.target as HTMLInputElement).value = ''
                  }
                }
              }}
            />
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files) onPhotoFiles(e.target.files)
                e.target.value = ''
              }}
              className="block w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 mt-2"
            />
            {brief.productPhotoUrls.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {brief.productPhotoUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="product" className="h-16 w-16 object-cover rounded border border-neutral-700" onError={(e) => (e.currentTarget.style.opacity = '0.3')} />
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          'productPhotoUrls',
                          brief.productPhotoUrls.filter((_, idx) => idx !== i)
                        )
                      }
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        </Section>

        {/* SECTION 2 — REFERENCES */}
        <Section num={2} title="Reference videos" desc="TikToks, Reels, YouTube Shorts, or uploaded MP4s in the exact style you want. Claude analyzes these.">
          <Field label="Reference video URLs" hint="TikTok / Instagram Reel / YouTube Shorts — press Enter to add each">
            <input
              type="url"
              placeholder="https://www.tiktok.com/@... or https://www.instagram.com/reel/..."
              className={inputCls}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const v = (e.target as HTMLInputElement).value.trim()
                  if (v.startsWith('http')) {
                    update('referenceVideoUrls', [...brief.referenceVideoUrls, v])
                    ;(e.target as HTMLInputElement).value = ''
                  }
                }
              }}
            />
            <input
              type="file"
              accept="video/*"
              multiple
              onChange={async (e) => {
                if (e.target.files) {
                  for (const file of Array.from(e.target.files)) {
                    const url = await upload(file)
                    if (url) update('referenceVideoUrls', [...brief.referenceVideoUrls, url])
                  }
                  e.target.value = ''
                }
              }}
              className="block w-full text-xs text-neutral-400 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700 mt-2"
            />
            {brief.referenceVideoUrls.length > 0 && (
              <div className="space-y-1 mt-2">
                {brief.referenceVideoUrls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs bg-neutral-950 p-2 rounded border border-neutral-800">
                    <span className="text-neutral-500">#{i + 1}</span>
                    <a href={url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 flex-1 truncate">{url}</a>
                    <button
                      type="button"
                      onClick={() =>
                        update(
                          'referenceVideoUrls',
                          brief.referenceVideoUrls.filter((_, idx) => idx !== i)
                        )
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
          <Field label="What you like about them" hint="One line per reference. Claude uses this to replicate what works.">
            <textarea
              value={brief.whatYouLike}
              onChange={(e) => update('whatYouLike', e.target.value)}
              placeholder={`e.g.:\n#1 — hook at 0:00 is fire\n#2 — transition at 0:03, product reveal\n#3 — closing frame ("shop link in bio") + energy`}
              className={`${inputCls} min-h-[80px] text-xs`}
            />
          </Field>
        </Section>

        {/* SECTION 3 — STORY INTEGRATION */}
        <Section num={3} title="Story integration" desc="How this affiliate video fits into the creator's daily life story. Not a standalone ad.">
          <Field label="Creator">
            <select
              value={brief.creator}
              onChange={(e) => update('creator', e.target.value as Creator)}
              className={inputCls}
            >
              <option value="">Pick a creator…</option>
              {CREATORS.map((c) => (
                <option key={c} value={c}>
                  {c} — {CREATOR_META[c].handle}
                </option>
              ))}
            </select>
          </Field>
          {meta && (
            <div className="text-xs bg-neutral-950 p-3 rounded border border-neutral-800 space-y-1">
              <div><span className="text-neutral-500">City:</span> {meta.city}</div>
              <div><span className="text-neutral-500">Niche:</span> {meta.niche}</div>
              <div><span className="text-neutral-500">Personality:</span> {meta.personality}</div>
              <div><span className="text-neutral-500">Signature looks:</span> {meta.signatureLooks.slice(0, 2).join(' · ')}</div>
            </div>
          )}
          <Field label="Which story arc?" hint="Which arc this video ties into">
            <select
              value={brief.storyArcId}
              onChange={(e) => update('storyArcId', e.target.value)}
              className={inputCls}
            >
              <option value="">Pick arc…</option>
              {STORY_ARCS.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.emoji} {a.title} · {a.dateRange}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Which day's story?" hint="Pick the story this video piggybacks off (or fill 'Linked story concept' manually)">
            <select
              value={brief.linkedStoryDate}
              onChange={(e) => {
                update('linkedStoryDate', e.target.value)
                const s = relatedStories.find((s) => s.date === e.target.value)
                if (s) update('linkedStoryConcept', s.concept)
              }}
              className={inputCls}
              disabled={!brief.creator}
            >
              <option value="">Pick date…</option>
              {relatedStories.map((s) => (
                <option key={s.id} value={s.date}>
                  {s.date} — {s.emoji} {s.concept}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Linked story concept (auto-fills)">
            <input
              type="text"
              value={brief.linkedStoryConcept}
              onChange={(e) => update('linkedStoryConcept', e.target.value)}
              placeholder="e.g. Morning skincare shelf ritual"
              className={inputCls}
            />
          </Field>
          <Field label="How does product fit into her daily life?" hint="The narrative bridge. Not 'buy this'. More: 'this is what she uses every morning.'">
            <textarea
              value={brief.productInDailyLife}
              onChange={(e) => update('productInDailyLife', e.target.value)}
              placeholder={`e.g. Ava applies this face oil every morning as part of her NYC apartment sunrise routine, right before her Loro Piana silk robe closet moment. Sells the lifestyle, not the product.`}
              className={`${inputCls} min-h-[80px] text-xs`}
            />
          </Field>
        </Section>

        {/* SECTION 4 — SPECS */}
        <Section num={4} title="Video specs" desc="Format and structure.">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Duration">
              <select value={brief.duration} onChange={(e) => update('duration', e.target.value as VideoBrief['duration'])} className={inputCls}>
                <option value="">Pick…</option>
                <option value="5s">5 sec — quick hook</option>
                <option value="10s">10 sec — reel intro</option>
                <option value="15s">15 sec — full narrative ⭐</option>
                <option value="30s">30 sec — long-form</option>
              </select>
            </Field>
            <Field label="Aspect ratio">
              <select value={brief.aspectRatio} onChange={(e) => update('aspectRatio', e.target.value as VideoBrief['aspectRatio'])} className={inputCls}>
                <option value="">Pick…</option>
                <option value="9:16">9:16 (Reel / TikTok / Story)</option>
                <option value="1:1">1:1 (feed)</option>
                <option value="4:5">4:5 (IG feed)</option>
              </select>
            </Field>
            <Field label="Shots">
              <select value={brief.shots} onChange={(e) => update('shots', e.target.value as VideoBrief['shots'])} className={inputCls}>
                <option value="">Pick…</option>
                <option value="single">Single shot</option>
                <option value="3-shot">3-shot cut</option>
                <option value="6-shot cinematic">6-shot cinematic ⭐</option>
              </select>
            </Field>
          </div>
        </Section>

        {/* SECTION 5 — SCENE + MOOD */}
        <Section num={5} title="Scene + mood" desc="Where and how the video feels.">
          <Field label="Setting" hint="Physical location. Defaults to creator's city vibe.">
            <input type="text" value={brief.setting} onChange={(e) => update('setting', e.target.value)} placeholder="e.g. Ava's NYC UES walk-in closet, sunrise" className={inputCls} />
          </Field>
          <Field label="Wardrobe" hint="Pick from creator's signature looks or specify">
            <textarea value={brief.wardrobe} onChange={(e) => update('wardrobe', e.target.value)} placeholder="e.g. Deep-V cream silk slip camisole + Loro Piana wide-leg trousers + Louboutin heels" className={`${inputCls} min-h-[60px] text-xs`} />
          </Field>
          <Field label="Vibe">
            <select value={brief.vibe} onChange={(e) => update('vibe', e.target.value)} className={inputCls}>
              <option value="">Pick…</option>
              <option>Sultry editorial bombshell</option>
              <option>Hyped fit-girl motivational</option>
              <option>Soft aesthetic dreamy</option>
              <option>Raw authentic no-filter</option>
              <option>Cinematic dramatic slo-mo</option>
              <option>Casual candid friend-filming</option>
              <option>Luxury quiet elegant</option>
              <option>Playful trendy Gen-Z</option>
            </select>
          </Field>
          <Field label="Face lock mode">
            <select value={brief.faceLockMode} onChange={(e) => update('faceLockMode', e.target.value as VideoBrief['faceLockMode'])} className={inputCls}>
              <option value="trained Soul ID">Trained Soul ID (default)</option>
              <option value="Nano Banana Pro + Reference Element">Nano Banana Pro + Reference Element</option>
            </select>
          </Field>
        </Section>

        {/* SECTION 6 — DISTRIBUTION */}
        <Section num={6} title="Distribution + affiliate" desc="Where this goes + how it makes money.">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Affiliate URL">
              <input type="url" value={brief.affiliateUrl} onChange={(e) => update('affiliateUrl', e.target.value)} placeholder="https://tracker.link/ava-loropiana-oct2026" className={inputCls} />
            </Field>
            <Field label="Discount code (if any)">
              <input type="text" value={brief.discountCode} onChange={(e) => update('discountCode', e.target.value)} placeholder="e.g. AVA20" className={inputCls} />
            </Field>
          </div>
          <Field label="Platforms" hint="Where this video publishes">
            <div className="flex gap-3 flex-wrap">
              {['Instagram Reel', 'TikTok', 'Pinterest', 'Instagram Story'].map((p) => (
                <label key={p} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={brief.platforms.includes(p)}
                    onChange={(e) => {
                      const next = e.target.checked
                        ? [...brief.platforms, p]
                        : brief.platforms.filter((x) => x !== p)
                      update('platforms', next)
                    }}
                  />
                  {p}
                </label>
              ))}
            </div>
          </Field>
          <Field label="Caption hook (optional)" hint="First line of caption. Leave blank and Claude writes it.">
            <input type="text" value={brief.captionHook} onChange={(e) => update('captionHook', e.target.value)} placeholder="e.g. never thought I'd repurchase this 3 times" className={inputCls} />
          </Field>
        </Section>

        {/* SUBMIT */}
        <div className="border-t border-neutral-800 pt-6 space-y-3">
          <button
            onClick={submit}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white px-6 py-4 rounded-xl font-bold text-lg transition-all"
          >
            🎯 Generate share URL → send to Claude
          </button>
          {shareUrl && (
            <div className="bg-neutral-950 border border-emerald-500/40 rounded-xl p-4 space-y-2">
              <div className="text-xs uppercase tracking-wider text-emerald-300 font-semibold">
                {copied ? '✅ Copied to clipboard — paste to Claude' : 'Share URL'}
              </div>
              <div className="text-xs text-neutral-300 break-all bg-black p-3 rounded font-mono">{shareUrl}</div>
              <div className="text-xs text-neutral-500">
                Reply to Claude with: <b>"Brief ready: [paste URL]"</b> — Claude fetches everything.
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

const inputCls =
  'w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-sm text-neutral-200 focus:border-emerald-500 focus:outline-none'

function Section({ num, title, desc, children }: { num: number; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
      <div>
        <div className="text-xs text-emerald-400 font-mono uppercase tracking-widest">Section {num}</div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-xs text-neutral-500 mt-1">{desc}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">{label}</label>
      {hint && <div className="text-[10px] text-neutral-500">{hint}</div>}
      {children}
    </div>
  )
}
