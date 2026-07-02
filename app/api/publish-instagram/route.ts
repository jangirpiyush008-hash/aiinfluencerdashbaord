import { NextRequest, NextResponse } from 'next/server'
import { publishToInstagram, type PublishKind } from '@/lib/instagram'
import type { Creator } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { creator, kind, caption, imageUrl, imageUrls, videoUrl } = body as {
      creator: Creator
      kind: PublishKind
      caption?: string
      imageUrl?: string
      imageUrls?: string[]
      videoUrl?: string
    }

    if (!creator || !kind) {
      return NextResponse.json({ error: 'Missing creator or kind' }, { status: 400 })
    }

    const result = await publishToInstagram({ creator, kind, caption, imageUrl, imageUrls, videoUrl })
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
