import { NextRequest } from 'next/server'
import sharp from 'sharp'

// Image proxy: (1) trims fake social-media UI that the generator sometimes bakes
// into the frame (solid black letterbox bands carrying usernames / icons / arrows),
// (2) re-encodes as JPEG for Instagram publishing (IG's API accepts JPEG only,
// Higgsfield serves PNG).
// MUST stay public (middleware) — Instagram's servers fetch it without our cookie.

export const dynamic = 'force-dynamic'

const ALLOWED_HOSTS = [
  'd8j0ntlcm91z4.cloudfront.net',
  'd2ol7oe51mr4n9.cloudfront.net',
  'cdn.higgsfield.ai',
  'res.cloudinary.com',
]

// A row/column counts as a "letterbox band" if it is mostly dark. The fake
// chrome bars are near-black but carry white username text + a colored profile
// icon, so a strict pure-black test misses them — we allow up to ~22% bright
// pixels (the text/icons) and still call the row a band. Real photos are far
// brighter at their edges, so clean images are never trimmed.
const DARK_LUMA = 48        // 0-255; below this a pixel counts as "dark"
const DARK_FRACTION = 0.78  // ≥78% of the line must be dark to trim it
const MAX_TRIM = 0.16       // never remove more than 16% from any single side

async function autoTrimBands(buf: Buffer): Promise<Buffer> {
  const base = sharp(buf).rotate()
  const meta = await base.metadata()
  const w = meta.width ?? 0
  const h = meta.height ?? 0
  if (!w || !h) return buf

  // Read greyscale raw pixels once for fast scanning
  const { data } = await base.clone().greyscale().raw().toBuffer({ resolveWithObject: true })

  const rowIsBand = (y: number) => {
    let black = 0
    const off = y * w
    for (let x = 0; x < w; x++) if (data[off + x] < DARK_LUMA) black++
    return black / w >= DARK_FRACTION
  }
  const colIsBand = (x: number) => {
    let black = 0
    for (let y = 0; y < h; y++) if (data[y * w + x] < DARK_LUMA) black++
    return black / h >= DARK_FRACTION
  }

  const maxV = Math.floor(h * MAX_TRIM)
  const maxH = Math.floor(w * MAX_TRIM)

  let top = 0
  while (top < maxV && rowIsBand(top)) top++
  let bottom = 0
  while (bottom < maxV && rowIsBand(h - 1 - bottom)) bottom++
  let left = 0
  while (left < maxH && colIsBand(left)) left++
  let right = 0
  while (right < maxH && colIsBand(w - 1 - right)) right++

  if (top + bottom + left + right === 0) return buf // already clean

  const newW = w - left - right
  const newH = h - top - bottom
  if (newW < w * 0.5 || newH < h * 0.5) return buf // safety: never gut the image

  return sharp(buf)
    .rotate()
    .extract({ left, top, width: newW, height: newH })
    .toBuffer() as Promise<Buffer>
}

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

  let buf: Buffer = Buffer.from(await upstream.arrayBuffer())
  try {
    buf = await autoTrimBands(buf)
  } catch {
    // if trim fails for any reason, fall through with the original bytes
  }

  const jpeg = (await sharp(buf)
    .rotate()
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer()) as Buffer

  return new Response(new Uint8Array(jpeg), {
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
