import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 60

// Uploads to Cloudinary if env is set, otherwise returns a helpful error
// telling the user to paste a URL instead.
export async function POST(req: NextRequest) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim()
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim()
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim()

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json({
      ok: false,
      error: 'Uploads not enabled. Add CLOUDINARY_CLOUD_NAME + CLOUDINARY_API_KEY + CLOUDINARY_API_SECRET to Railway, OR just paste a public URL in the brief form (right-click brand-site image → Copy image address, or use imgbb.com for quick free hosting).',
    }, { status: 501 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const timestamp = Math.round(Date.now() / 1000)

    // Cloudinary requires a signed upload
    const paramsToSign = `folder=briefs&timestamp=${timestamp}`
    // Simple SHA-1 signature via Web Crypto
    const encoder = new TextEncoder()
    const data = encoder.encode(paramsToSign + apiSecret)
    const hashBuffer = await crypto.subtle.digest('SHA-1', data)
    const signature = Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    const uploadForm = new FormData()
    uploadForm.append('file', new Blob([buffer]), file.name)
    uploadForm.append('api_key', apiKey)
    uploadForm.append('timestamp', String(timestamp))
    uploadForm.append('folder', 'briefs')
    uploadForm.append('signature', signature)

    const resourceType = file.type.startsWith('video') ? 'video' : 'image'
    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      { method: 'POST', body: uploadForm }
    )
    const uploadJson = await uploadRes.json()

    if (!uploadRes.ok || !uploadJson.secure_url) {
      return NextResponse.json({ ok: false, error: `Cloudinary error: ${JSON.stringify(uploadJson)}` }, { status: 500 })
    }

    return NextResponse.json({ ok: true, url: uploadJson.secure_url })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
