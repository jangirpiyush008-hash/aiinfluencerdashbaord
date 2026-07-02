import type { Creator } from './types'

const CREATOR_TOKEN_KEY: Record<Creator, string> = {
  Siya: 'TIKTOK_TOKEN_SIYA',
  Kiara: 'TIKTOK_TOKEN_KIARA',
  Mia: 'TIKTOK_TOKEN_MIA',
  Ava: 'TIKTOK_TOKEN_AVA',
}

const CREATOR_OPEN_ID_KEY: Record<Creator, string> = {
  Siya: 'TIKTOK_OPEN_ID_SIYA',
  Kiara: 'TIKTOK_OPEN_ID_KIARA',
  Mia: 'TIKTOK_OPEN_ID_MIA',
  Ava: 'TIKTOK_OPEN_ID_AVA',
}

export function getTikTokTokenForCreator(creator: Creator): string | null {
  return process.env[CREATOR_TOKEN_KEY[creator]] || null
}

export function getTikTokOpenIdForCreator(creator: Creator): string | null {
  return process.env[CREATOR_OPEN_ID_KEY[creator]] || null
}

export function buildTikTokOAuthLoginUrl(creator: Creator): string {
  const clientKey = (process.env.TIKTOK_CLIENT_KEY || '').trim()
  const redirectUri = (process.env.TIKTOK_REDIRECT_URI || '').trim().replace(/\/$/, '')
  const params = new URLSearchParams({
    client_key: clientKey,
    response_type: 'code',
    scope: 'user.info.basic,user.info.profile,video.upload',
    redirect_uri: redirectUri,
    state: creator,
  })
  return `https://www.tiktok.com/v2/auth/authorize/?${params.toString()}`
}

/**
 * Publishes a video to the creator's TikTok drafts folder.
 * User must open TikTok app → drafts → add music/effects → publish manually.
 *
 * Flow:
 * 1. Download video from URL (Higgsfield CDN, our server, etc)
 * 2. Init inbox upload with TikTok → get upload_url + publish_id
 * 3. PUT video bytes to upload_url in a single chunk
 * 4. Return publish_id (video appears in user's TikTok drafts)
 */
export async function publishToTikTokDraft(params: {
  creator: Creator
  videoUrl: string
}): Promise<{ publishId: string }> {
  const { creator, videoUrl } = params
  const token = getTikTokTokenForCreator(creator)

  if (!token) {
    throw new Error(`No TikTok token stored for ${creator}. Connect the account first at /connect/tiktok.`)
  }

  // Step 1: download the video
  const videoRes = await fetch(videoUrl)
  if (!videoRes.ok) throw new Error(`Failed to download video: ${videoRes.status} ${videoRes.statusText}`)
  const contentLength = videoRes.headers.get('content-length')
  const videoBuffer = Buffer.from(await videoRes.arrayBuffer())
  const videoSize = videoBuffer.byteLength
  if (contentLength && parseInt(contentLength) !== videoSize) {
    // ignore — some CDNs strip content-length
  }
  if (videoSize > 4 * 1024 * 1024 * 1024) {
    throw new Error('Video >4GB — TikTok limit')
  }

  // Step 2: init upload — single chunk (whole video)
  const initRes = await fetch('https://open.tiktokapis.com/v2/post/publish/inbox/video/init/', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify({
      source_info: {
        source: 'FILE_UPLOAD',
        video_size: videoSize,
        chunk_size: videoSize,
        total_chunk_count: 1,
      },
    }),
  })
  const initJson = await initRes.json()
  if (!initRes.ok || !initJson.data?.upload_url || !initJson.data?.publish_id) {
    throw new Error(`TikTok init failed: ${JSON.stringify(initJson)}`)
  }
  const uploadUrl = initJson.data.upload_url as string
  const publishId = initJson.data.publish_id as string

  // Step 3: PUT video bytes as a single chunk
  const putRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Range': `bytes 0-${videoSize - 1}/${videoSize}`,
      'Content-Length': String(videoSize),
    },
    body: videoBuffer,
  })
  if (!putRes.ok) {
    const body = await putRes.text().catch(() => '')
    throw new Error(`TikTok upload PUT failed: ${putRes.status} ${putRes.statusText} — ${body}`)
  }

  return { publishId }
}
