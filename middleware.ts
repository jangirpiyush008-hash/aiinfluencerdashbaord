import { NextRequest, NextResponse } from 'next/server'
import { AUTH_COOKIE, verifyToken } from '@/lib/auth'

// Routes that must stay reachable without a valid session
const PUBLIC_PREFIXES = [
  '/login',
  '/api/auth/login',
  '/api/auth/logout',
  // OAuth callbacks — external services (Meta/TikTok) hit these without our cookie
  '/api/auth/callback',
  '/api/auth/tiktok-callback',
  '/api/auth/deauthorize',
  // Legal pages — Meta App Review needs these public
  '/privacy',
  '/terms',
  '/data-deletion',
  // Public brief viewer — Claude WebFetches this URL after Piyush pastes it
  '/brief/view',
  // JPEG conversion proxy — Instagram's servers fetch this without our cookie
  '/api/img',
  // Static assets + PWA
  '/_next',
  '/favicon',
  '/manifest.json',
  '/icon.svg',
  '/app-icon',
]

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/') || pathname.startsWith(prefix))) {
    return NextResponse.next()
  }

  const token = req.cookies.get(AUTH_COOKIE)?.value
  const { ok } = await verifyToken(token)
  if (ok) return NextResponse.next()

  const loginUrl = new URL('/login', req.url)
  if (pathname !== '/') loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  // Match all paths except Next.js internals — evaluated by the PUBLIC_PREFIXES check above
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
