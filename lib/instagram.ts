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

export async function publishToInstagram(params: {
  creator: Creator
  imageUrl: string
  caption: string
}): Promise<{ postId: string; permalink: string }> {
  const { creator, imageUrl, caption } = params
  const token = getTokenForCreator(creator)
  const igUserId = getIgUserIdForCreator(creator)

  if (!token) throw new Error(`No Instagram token stored for ${creator}. Connect the account first at /connect.`)
  if (!igUserId) throw new Error(`No Instagram user ID stored for ${creator}. Reconnect the account.`)

  // Instagram Business Login flow uses graph.instagram.com
  // Step 1: create media container
  const containerRes = await fetch(
    `https://graph.instagram.com/v21.0/${igUserId}/media?` +
      new URLSearchParams({
        image_url: imageUrl,
        caption,
        access_token: token,
      }),
    { method: 'POST' }
  )
  const containerJson = await containerRes.json()
  if (!containerRes.ok || !containerJson.id) {
    throw new Error(`Container creation failed: ${JSON.stringify(containerJson)}`)
  }
  const creationId = containerJson.id as string

  // Step 2: publish
  const publishRes = await fetch(
    `https://graph.instagram.com/v21.0/${igUserId}/media_publish?` +
      new URLSearchParams({ creation_id: creationId, access_token: token }),
    { method: 'POST' }
  )
  const publishJson = await publishRes.json()
  if (!publishRes.ok || !publishJson.id) {
    throw new Error(`Publish failed: ${JSON.stringify(publishJson)}`)
  }
  const mediaId = publishJson.id as string

  // Step 3: fetch permalink
  const permalinkRes = await fetch(
    `https://graph.instagram.com/v21.0/${mediaId}?fields=permalink&access_token=${token}`
  )
  const permalinkJson = await permalinkRes.json()

  return { postId: mediaId, permalink: permalinkJson.permalink || `https://www.instagram.com/p/${mediaId}` }
}

export function buildOAuthLoginUrl(creator: Creator): string {
  const params = new URLSearchParams({
    client_id: process.env.IG_APP_ID || '',
    redirect_uri: process.env.IG_REDIRECT_URI || '',
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
