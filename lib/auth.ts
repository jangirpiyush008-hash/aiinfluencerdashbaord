// Simple single-user cookie auth. Middleware verifies the cookie on every request.
// Cookie is a signed token so it can't be forged without the AUTH_SECRET.

export const AUTH_COOKIE = 'dashboard_session'
export const AUTH_MAX_AGE_SEC = 60 * 60 * 24 * 30 // 30 days — "keep me logged in"

const DEFAULT_USERNAME = 'piyushjangir'
const DEFAULT_PASSWORD = 'Piyush@12345'
const DEFAULT_SECRET = 'ai-influencer-dashboard-hmac-secret-do-set-AUTH_SECRET-in-railway'

export function getUsername(): string {
  return (process.env.AUTH_USERNAME || DEFAULT_USERNAME).trim()
}

export function getPassword(): string {
  return (process.env.AUTH_PASSWORD || DEFAULT_PASSWORD).trim()
}

export function getSecret(): string {
  return (process.env.AUTH_SECRET || DEFAULT_SECRET).trim()
}

async function hmacSha256(secret: string, message: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Token format: base64url(payload).base64url(hmac)
// payload = { u: username, e: expiryEpochSec }
export async function issueToken(username: string): Promise<string> {
  const expiryEpochSec = Math.floor(Date.now() / 1000) + AUTH_MAX_AGE_SEC
  const payload = JSON.stringify({ u: username, e: expiryEpochSec })
  const payloadB64 = btoa(payload).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
  const sig = await hmacSha256(getSecret(), payloadB64)
  return `${payloadB64}.${sig}`
}

export async function verifyToken(token: string | undefined): Promise<{ ok: boolean; username?: string }> {
  if (!token) return { ok: false }
  const parts = token.split('.')
  if (parts.length !== 2) return { ok: false }
  const [payloadB64, sig] = parts
  const expected = await hmacSha256(getSecret(), payloadB64)
  if (sig !== expected) return { ok: false }
  try {
    const b64 = payloadB64.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    const payload = JSON.parse(atob(padded)) as { u: string; e: number }
    if (payload.e < Math.floor(Date.now() / 1000)) return { ok: false }
    return { ok: true, username: payload.u }
  } catch {
    return { ok: false }
  }
}
