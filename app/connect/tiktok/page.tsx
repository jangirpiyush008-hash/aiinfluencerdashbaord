import { buildTikTokOAuthLoginUrl } from '@/lib/tiktok'
import type { Creator } from '@/lib/types'

export const metadata = { title: 'Connect TikTok · AI Influencer Dashboard' }

// TikTok is banned in India — only Mia (USA) and Ava (USA) publish there
const CREATORS: Array<{ creator: Creator; handle: string; color: string }> = [
  { creator: 'Mia', handle: '@miafitcartel', color: 'from-cyan-500 to-pink-600' },
  { creator: 'Ava', handle: '@ava.fabfashion', color: 'from-purple-500 to-fuchsia-600' },
]

export default function ConnectTikTokPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 space-y-6 text-neutral-200">
      <div>
        <h1 className="text-3xl font-bold mb-2">Connect TikTok</h1>
        <p className="text-neutral-400">
          Uploads land in the creator's <b>Drafts</b> folder. You finish on the TikTok app —
          add trending music, effects, then publish.
        </p>
      </div>

      <div className="space-y-3">
        {CREATORS.map((c) => (
          <a
            key={c.creator}
            href={buildTikTokOAuthLoginUrl(c.creator)}
            className={`block bg-gradient-to-r ${c.color} hover:opacity-90 text-white px-5 py-4 rounded-xl font-semibold transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg">Connect {c.creator}</div>
                <div className="text-sm opacity-90">{c.handle}</div>
              </div>
              <div className="text-2xl">🎵 →</div>
            </div>
          </a>
        ))}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-sm space-y-2">
        <div className="font-semibold text-neutral-200">Why only Mia + Ava?</div>
        <div className="text-neutral-400 text-xs">
          TikTok is banned in India, so Siya (Bangalore) and Kiara (Mumbai) don't publish there.
          Their content flows to Instagram + Pinterest only.
        </div>
      </div>

      <div className="text-xs text-neutral-500 border-t border-neutral-800 pt-6 mt-8 space-y-2">
        <p>
          <b>How it works:</b> TikTok redirects you to log in and grant permission. After approval,
          you'll see the access token + open_id for that creator — copy both to Railway → Variables.
        </p>
        <p>Tokens are short-lived (~24 hrs). Reconnect when they expire.</p>
      </div>
    </main>
  )
}
