import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, AUTH_MAX_AGE_SEC, getPassword, getUsername, issueToken } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const username = String(body.username || '').trim()
  const password = String(body.password || '').trim()

  if (username !== getUsername() || password !== getPassword()) {
    return NextResponse.json({ ok: false, error: 'Invalid username or password' }, { status: 401 })
  }

  const token = await issueToken(username)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: AUTH_MAX_AGE_SEC,
  })
  return res
}
