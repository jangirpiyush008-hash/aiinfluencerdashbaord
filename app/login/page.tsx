'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const json = await res.json().catch(() => ({}))
      if (json.ok) {
        const params = new URLSearchParams(window.location.search)
        const next = params.get('next') || '/'
        // Trust the cookie is set; navigate.
        window.location.href = next.startsWith('/') ? next : '/'
      } else {
        setError(json.error || 'Login failed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-neutral-500 text-xs uppercase tracking-widest mb-2">
            <span>🔒</span> Private
          </div>
          <h1 className="text-3xl font-bold text-white">AI Influencer Dashboard</h1>
          <p className="text-neutral-400 text-sm mt-2">Sign in to continue</p>
        </div>

        <form onSubmit={submit} className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Username</label>
            <input
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 text-sm text-neutral-200 focus:border-emerald-500 focus:outline-none"
              autoFocus
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold">Password</label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2.5 text-sm text-neutral-200 focus:border-emerald-500 focus:outline-none"
              required
            />
          </div>

          {error && (
            <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/40 rounded px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 disabled:opacity-50 text-white px-4 py-3 rounded-xl font-semibold transition-all"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-[10px] text-neutral-500 text-center">
            Cookie stays valid for 30 days.
          </p>
        </form>
      </div>
    </main>
  )
}
