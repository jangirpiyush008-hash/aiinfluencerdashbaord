import { NextResponse } from 'next/server'
import type { Creator } from '@/lib/types'

export const dynamic = 'force-dynamic'

const CREATORS: Creator[] = ['Siya', 'Kiara', 'Mia', 'Ava']

function hasEnv(key: string): boolean {
  return typeof process.env[key] === 'string' && process.env[key]!.trim().length > 0
}

export async function GET() {
  const instagram = Object.fromEntries(
    CREATORS.map((c) => [c, hasEnv(`IG_TOKEN_${c.toUpperCase()}`) && hasEnv(`IG_USER_ID_${c.toUpperCase()}`)])
  ) as Record<Creator, boolean>

  const tiktok = Object.fromEntries(
    CREATORS.map((c) => [c, hasEnv(`TIKTOK_TOKEN_${c.toUpperCase()}`) && hasEnv(`TIKTOK_OPEN_ID_${c.toUpperCase()}`)])
  ) as Record<Creator, boolean>

  const pinterest = Object.fromEntries(
    CREATORS.map((c) => [c, hasEnv(`PINTEREST_TOKEN_${c.toUpperCase()}`)])
  ) as Record<Creator, boolean>

  // TikTok is only for Mia + Ava (banned in India)
  const tiktokEligible: Creator[] = ['Mia', 'Ava']

  return NextResponse.json({
    instagram: {
      connected: Object.values(instagram).filter(Boolean).length,
      total: CREATORS.length,
      byCreator: instagram,
    },
    tiktok: {
      connected: tiktokEligible.filter((c) => tiktok[c]).length,
      total: tiktokEligible.length,
      byCreator: tiktok,
    },
    pinterest: {
      connected: Object.values(pinterest).filter(Boolean).length,
      total: CREATORS.length,
      byCreator: pinterest,
    },
  })
}
