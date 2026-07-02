import { NextRequest, NextResponse } from 'next/server'
import { publishToInstagram } from '@/lib/instagram'
import type { Creator } from '@/lib/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { creator, imageUrl, caption } = body as {
      creator: Creator
      imageUrl: string
      caption: string
    }

    if (!creator || !imageUrl || !caption) {
      return NextResponse.json({ error: 'Missing creator / imageUrl / caption' }, { status: 400 })
    }

    const result = await publishToInstagram({ creator, imageUrl, caption })
    return NextResponse.json({ ok: true, ...result })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
