import { NextRequest, NextResponse } from 'next/server'
import { buildOAuthLoginUrl } from '@/lib/instagram'
import { buildTikTokOAuthLoginUrl } from '@/lib/tiktok'
import type { Creator } from '@/lib/types'

// Kicks off the OAuth flow for a creator+platform from anywhere in the dashboard
// (e.g. the Reconnect buttons on the Stats tab). Redirects straight to the
// platform's authorize screen.

const VALID_CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']

export async function GET(req: NextRequest) {
  const platform = req.nextUrl.searchParams.get('platform')
  const creator = req.nextUrl.searchParams.get('creator') as Creator | null

  if (!creator || !VALID_CREATORS.includes(creator)) {
    return NextResponse.json({ error: 'invalid creator' }, { status: 400 })
  }
  if (platform === 'instagram') {
    return NextResponse.redirect(buildOAuthLoginUrl(creator))
  }
  if (platform === 'tiktok') {
    return NextResponse.redirect(buildTikTokOAuthLoginUrl(creator))
  }
  return NextResponse.json({ error: 'invalid platform' }, { status: 400 })
}
