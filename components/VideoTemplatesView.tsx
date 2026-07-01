'use client'
import { VIDEO_TEMPLATES } from '@/lib/videoTemplates'
import { useState } from 'react'

export default function VideoTemplatesView() {
  const [openId, setOpenId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">🎥 Video Prompt Templates</h2>
        <p className="text-neutral-400 text-sm">
          Master prompt library for Higgsfield video generation. Use these when generating product videos —
          replace [PRODUCT NAME] and creator-specific fields.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {VIDEO_TEMPLATES.map((t) => (
          <div key={t.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
            <div className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">{t.name}</h3>
                  <div className="text-xs text-neutral-500 mt-1">
                    {t.duration} · {t.platform}
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-300">{t.description}</p>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-neutral-500 mb-1">Best for</div>
                <div className="text-xs text-neutral-400">{t.useCase}</div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setOpenId(openId === t.id ? null : t.id)}
                  className="flex-1 text-xs bg-neutral-800 hover:bg-neutral-700 px-3 py-2 rounded"
                >
                  {openId === t.id ? 'Hide prompt' : 'View prompt'}
                </button>
                <button
                  onClick={() => copy(t.prompt, t.id)}
                  className="text-xs bg-blue-500 hover:bg-blue-400 text-white px-4 py-2 rounded font-semibold"
                >
                  {copied === t.id ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {openId === t.id && (
                <div className="text-xs text-neutral-300 bg-neutral-950 p-4 rounded border border-neutral-800 whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {t.prompt}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold mb-3">🎬 How to generate a product video</h3>
        <ol className="text-sm text-neutral-300 space-y-2 list-decimal list-inside">
          <li>Say <span className="text-blue-400 font-mono">"generate video for [Creator]"</span> in the Higgsfield chat</li>
          <li>Upload a reference video (style/aesthetic to mimic)</li>
          <li>Upload product photos + provide affiliate link</li>
          <li>The AI uses the CINEMATIC-15S template + creator's Soul ID + product images</li>
          <li>Video renders in ~3-5 minutes, ready to publish</li>
        </ol>
      </div>
    </div>
  )
}
