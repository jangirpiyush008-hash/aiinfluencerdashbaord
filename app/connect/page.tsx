import { buildOAuthLoginUrl } from '@/lib/instagram'
import type { Creator } from '@/lib/types'

export const metadata = { title: 'Connect Instagram · AI Influencer Dashboard' }

const CREATORS: Array<{ creator: Creator; handle: string; color: string }> = [
  { creator: 'Siya', handle: '@_siyasharmaofficial', color: 'from-rose-500 to-pink-600' },
  { creator: 'Kiara', handle: '@kiararai_fit', color: 'from-orange-500 to-red-600' },
  { creator: 'Mia', handle: '@miafitcartel', color: 'from-green-500 to-emerald-600' },
  { creator: 'Ava', handle: '@ava.fabfashion', color: 'from-purple-500 to-fuchsia-600' },
]

export default function ConnectPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 space-y-6 text-neutral-200">
      <div>
        <h1 className="text-3xl font-bold mb-2">Connect Instagram</h1>
        <p className="text-neutral-400">Click each creator to authorize Instagram publishing. You'll grant permissions once per account.</p>
      </div>

      <div className="space-y-3">
        {CREATORS.map((c) => (
          <a
            key={c.creator}
            href={buildOAuthLoginUrl(c.creator)}
            className={`block bg-gradient-to-r ${c.color} hover:opacity-90 text-white px-5 py-4 rounded-xl font-semibold transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg">Connect {c.creator}</div>
                <div className="text-sm opacity-90">{c.handle}</div>
              </div>
              <div className="text-2xl">📷 →</div>
            </div>
          </a>
        ))}
      </div>

      <div className="text-xs text-neutral-500 border-t border-neutral-800 pt-6 mt-8 space-y-2">
        <p>
          <b>How it works:</b> Meta redirects you to Facebook to authorize the AI Influencer Dashboard app.
          After you approve permissions, you'll see the token + IG User ID for that creator.
          Copy both values into Railway → Variables tab (env names shown on the callback page).
        </p>
        <p>Tokens are long-lived (60 days). Reconnect when they expire.</p>
      </div>
    </main>
  )
}
