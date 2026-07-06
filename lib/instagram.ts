import type { Creator } from './types'

const CREATOR_ENV_KEY: Record<Creator, string> = {
  Siya: 'IG_TOKEN_SIYA',
  Kiara: 'IG_TOKEN_KIARA',
  Mia: 'IG_TOKEN_MIA',
  Ava: 'IG_TOKEN_AVA',
}

const CREATOR_IG_USER_ID_KEY: Record<Creator, string> = {
  Siya: 'IG_USER_ID_SIYA',
  Kiara: 'IG_USER_ID_KIARA',
  Mia: 'IG_USER_ID_MIA',
  Ava: 'IG_USER_ID_AVA',
}

export function getTokenForCreator(creator: Creator): string | null {
  return process.env[CREATOR_ENV_KEY[creator]] || null
}

export function getIgUserIdForCreator(creator: Creator): string | null {
  return process.env[CREATOR_IG_USER_ID_KEY[creator]] || null
}

const GRAPH = 'https://graph.instagram.com/v21.0'

// Instagram Login hands back TWO ids: an app-scoped `id` and the publishable
// `user_id`. The one stored in env can be the wrong one, which makes
// POST /{id}/media fail with "object does not exist" (code 100, subcode 33).
// Resolve the correct publishable id straight from the token so it's always right.
async function resolvePublishId(token: string, fallback: string): Promise<string> {
  try {
    const res = await fetch(`${GRAPH}/me?fields=user_id,id&access_token=${token}`, { cache: 'no-store' })
    const j = await res.json()
    if (res.ok && (j.user_id || j.id)) return String(j.user_id || j.id)
  } catch {}
  return fallback
}

// IG's content API officially accepts JPEG only; Higgsfield CDN serves PNG.
// Route every image through our public /api/img proxy, which re-encodes to JPEG.
function toJpegProxyUrl(imageUrl: string): string {
  // Already proxied or not one of our known PNG CDNs → pass through
  if (imageUrl.includes('/api/img?url=')) return imageUrl
  const base =
    (process.env.PUBLIC_BASE_URL || '').trim().replace(/\/$/, '') ||
    (() => {
      try {
        return new URL((process.env.IG_REDIRECT_URI || '').trim()).origin
      } catch {
        return 'https://influencerabcb.shop'
      }
    })()
  return `${base}/api/img?url=${encodeURIComponent(imageUrl)}`
}

async function createContainer(
  igUserId: string,
  token: string,
  params: Record<string, string>
): Promise<string> {
  const res = await fetch(
    `${GRAPH}/${igUserId}/media?` + new URLSearchParams({ ...params, access_token: token }),
    { method: 'POST' }
  )
  const json = await res.json()
  if (!res.ok || !json.id) throw new Error(`Container creation failed: ${JSON.stringify(json)}`)
  return json.id as string
}

async function publishContainer(igUserId: string, token: string, creationId: string): Promise<string> {
  const res = await fetch(
    `${GRAPH}/${igUserId}/media_publish?` +
      new URLSearchParams({ creation_id: creationId, access_token: token }),
    { method: 'POST' }
  )
  const json = await res.json()
  if (!res.ok || !json.id) throw new Error(`Publish failed: ${JSON.stringify(json)}`)
  return json.id as string
}

async function fetchPermalink(mediaId: string, token: string): Promise<string> {
  const res = await fetch(`${GRAPH}/${mediaId}?fields=permalink&access_token=${token}`)
  const json = await res.json()
  return json.permalink || `https://www.instagram.com/p/${mediaId}`
}

// Poll a container until it's ready. Instagram needs 1-5 sec even for
// single image feed / story posts before publish is accepted.
async function waitForContainerReady(containerId: string, token: string, maxAttempts = 30): Promise<void> {
  // Initial short delay — most image containers are ready in 1-2 sec
  await new Promise((r) => setTimeout(r, 1500))

  for (let i = 0; i < maxAttempts; i++) {
    const res = await fetch(`${GRAPH}/${containerId}?fields=status_code&access_token=${token}`)
    const json = await res.json()
    if (json.status_code === 'FINISHED') return
    if (json.status_code === 'PUBLISHED') return // already published (shouldn't happen mid-flow but treat as done)
    if (json.status_code === 'ERROR' || json.status_code === 'EXPIRED') {
      throw new Error(`Container ${containerId} failed: ${JSON.stringify(json)}`)
    }
    // IN_PROGRESS or unknown → keep polling
    await new Promise((r) => setTimeout(r, 2000))
  }
  throw new Error(`Container ${containerId} not ready after ${maxAttempts * 2}s`)
}

export type PublishKind = 'feed' | 'story' | 'carousel' | 'reel'

export async function publishToInstagram(params: {
  creator: Creator
  kind: PublishKind
  caption?: string
  imageUrl?: string
  imageUrls?: string[]
  videoUrl?: string
}): Promise<{ postId: string; permalink: string }> {
  const { creator, kind, caption = '', imageUrl, imageUrls, videoUrl } = params
  const token = getTokenForCreator(creator)
  const storedId = getIgUserIdForCreator(creator)

  if (!token) throw new Error(`No Instagram token stored for ${creator}. Connect the account first at /connect.`)
  if (!storedId) throw new Error(`No Instagram user ID stored for ${creator}. Reconnect the account.`)

  // Always resolve the correct publishable id from the token (the stored one may
  // be the wrong id type from OAuth and cause "object does not exist" on publish).
  const igUserId = await resolvePublishId(token, storedId)

  let creationId: string

  if (kind === 'feed') {
    if (!imageUrl) throw new Error('feed post needs imageUrl')
    creationId = await createContainer(igUserId, token, { image_url: toJpegProxyUrl(imageUrl), caption })
  } else if (kind === 'story') {
    if (!imageUrl && !videoUrl) throw new Error('story needs imageUrl or videoUrl')
    if (videoUrl) {
      creationId = await createContainer(igUserId, token, {
        media_type: 'STORIES',
        video_url: videoUrl,
      })
    } else {
      creationId = await createContainer(igUserId, token, {
        media_type: 'STORIES',
        image_url: toJpegProxyUrl(imageUrl!),
      })
    }
    // stories do not accept caption
  } else if (kind === 'carousel') {
    if (!imageUrls || imageUrls.length < 2 || imageUrls.length > 10) {
      throw new Error('carousel needs 2-10 image URLs')
    }
    // Create child containers (marked is_carousel_item) — wait for each to finish
    const childIds: string[] = []
    for (const url of imageUrls) {
      const id = await createContainer(igUserId, token, { image_url: toJpegProxyUrl(url), is_carousel_item: 'true' })
      await waitForContainerReady(id, token)
      childIds.push(id)
    }
    // Create parent carousel container
    creationId = await createContainer(igUserId, token, {
      media_type: 'CAROUSEL',
      children: childIds.join(','),
      caption,
    })
  } else if (kind === 'reel') {
    if (!videoUrl) throw new Error('reel needs videoUrl')
    creationId = await createContainer(igUserId, token, {
      media_type: 'REELS',
      video_url: videoUrl,
      caption,
    })
  } else {
    throw new Error(`Unknown kind: ${kind}`)
  }

  // Wait for the (parent) container to be ready across all kinds — Instagram
  // sometimes needs 1-5 sec even for a single image feed post
  await waitForContainerReady(creationId, token)

  const mediaId = await publishContainer(igUserId, token, creationId)
  const permalink = await fetchPermalink(mediaId, token)
  return { postId: mediaId, permalink }
}

export function buildOAuthLoginUrl(creator: Creator): string {
  const clientId = (process.env.IG_APP_ID || '').trim()
  const redirectUri = (process.env.IG_REDIRECT_URI || '').trim().replace(/\/$/, '')
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: [
      'instagram_business_basic',
      'instagram_business_content_publish',
      'instagram_business_manage_comments',
      'instagram_business_manage_insights',
    ].join(','),
    response_type: 'code',
    state: creator,
  })
  return `https://www.instagram.com/oauth/authorize?${params.toString()}`
}
