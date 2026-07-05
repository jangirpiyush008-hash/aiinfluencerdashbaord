import { NextRequest } from 'next/server'
import sharp from 'sharp'

// JPEG conversion proxy for Instagram publishing.
// IG's content API officially accepts JPEG only — Higgsfield CDN serves PNG.
// This route fetches the source image and re-encodes as JPEG.
// MUST stay public (middleware) — Instagram's servers fetch it without our auth cookie.

export const dynamic = 'force-dynamic'

const ALLOWED_HOSTS = [
  'd8j0ntlcm91z4.cloudfront.net',
  'd2ol7oe51mr4n9.cloudfront.net',
  'cdn.higgsfield.ai',
  'res.cloudinary.com',
]

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get('url')
  if (!url) return new Response('missing url', { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return new Response('invalid url', { status: 400 })
  }
  if (parsed.protocol !== 'https:' || !ALLOWED_HOSTS.includes(parsed.hostname)) {
    return new Response('host not allowed', { status: 403 })
  }

  const upstream = await fetch(url, { cache: 'no-store' })
  if (!upstream.ok) return new Response('upstream fetch failed', { status: 502 })

  const buf = Buffer.from(await upstream.arrayBuffer())
  const jpeg = await sharp(buf)
    .rotate() // respect EXIF orientation
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer()

  return new Response(new Uint8Array(jpeg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
