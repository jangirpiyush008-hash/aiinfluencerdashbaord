import { NextRequest, NextResponse } from 'next/server'
import { publishToTikTokDraft } from '@/lib/tiktok'
import type { Creator } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 60 // Video upload can take up to a minute for larger MP4s

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { creator, videoUrl } = body as {
      creator: Creator
      videoUrl: string
    }

    if (!creator || !videoUrl) {
      return NextResponse.json({ error: 'Missing creator or videoUrl' }, { status: 400 })
    }

    const result = await publishToTikTokDraft({ creator, videoUrl })
    return NextResponse.json({
      ok: true,
      publishId: result.publishId,
      message: `Uploaded to ${creator}'s TikTok drafts. Open TikTok app → drafts → add music/effects → publish.`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
