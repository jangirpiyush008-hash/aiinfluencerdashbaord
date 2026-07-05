import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // creator name
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('error_description')

  if (error) {
    return html(`<h1>OAuth error</h1><pre>${escape(error)}\n${escape(errorDescription || '')}</pre>`)
  }
  if (!code) return html('<h1>Missing code param</h1>')

  const clientKey = process.env.TIKTOK_CLIENT_KEY?.trim()
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET?.trim()
  const redirectUri = process.env.TIKTOK_REDIRECT_URI?.trim().replace(/\/$/, '')

  if (!clientKey || !clientSecret || !redirectUri) {
    return html('<h1>Server misconfigured</h1><p>Missing TIKTOK_CLIENT_KEY / TIKTOK_CLIENT_SECRET / TIKTOK_REDIRECT_URI env vars.</p>')
  }

  // Exchange code → access token (TikTok returns long-lived access + refresh)
  const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  })
  const tokenJson = await tokenRes.json()
  if (!tokenRes.ok || !tokenJson.access_token) {
    return html(`<h1>Token exchange failed</h1>
      <p><b>redirect_uri sent:</b></p>
      <code style="display:block;background:#000;padding:8px;border-radius:6px;word-break:break-all">${escape(redirectUri)}</code>
      <p style="margin-top:12px"><b>TikTok's response:</b></p>
      <pre style="background:#111;padding:12px;border-radius:6px;overflow-x:auto">${escape(JSON.stringify(tokenJson, null, 2))}</pre>
    `)
  }

  const accessToken = tokenJson.access_token as string
  const refreshToken = tokenJson.refresh_token as string | undefined
  const openId = tokenJson.open_id as string
  const expiresIn = tokenJson.expires_in as number | undefined

  // Fetch profile info to display which account was connected
  const meRes = await fetch(
    'https://open.tiktokapis.com/v2/user/info/?fields=open_id,username,display_name,avatar_url',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  const meJson = await meRes.json()
  const username = meJson.data?.user?.username || 'unknown'
  const displayName = meJson.data?.user?.display_name || ''

  const creator = state || 'UNKNOWN'
  const envSuffix = creator.toUpperCase()
  const expiresDays = expiresIn ? Math.round(expiresIn / 86400) : 1

  return html(`
    <h1>✅ Connected TikTok @${escape(username)}</h1>
    <p style="color:#aaa">Display name: <b>${escape(displayName)}</b> · Token valid ~${expiresDays} days</p>
    <p style="color:#aaa">Add these two env vars to Railway → Variables tab for creator <b>${escape(creator)}</b>:</p>

    <div style="background:#111;padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid #333">
      <div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">TIKTOK_OPEN_ID_${envSuffix}</div>
      <code style="display:block;background:#000;padding:8px;border-radius:6px;margin-top:4px;word-break:break-all">${escape(openId)}</code>
    </div>

    <div style="background:#111;padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid #333">
      <div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">TIKTOK_TOKEN_${envSuffix}</div>
      <code style="display:block;background:#000;padding:8px;border-radius:6px;margin-top:4px;word-break:break-all;font-size:11px">${escape(accessToken)}</code>
    </div>

    ${refreshToken ? `
    <div style="background:#1a2e1a;padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid #3a5">
      <div style="color:#7c7;font-size:12px;text-transform:uppercase;letter-spacing:1px">TIKTOK_REFRESH_TOKEN_${envSuffix} <span style="color:#5a5">(IMPORTANT — enables 1-year auto-refresh, access tokens die in 24h)</span></div>
      <code style="display:block;background:#000;padding:8px;border-radius:6px;margin-top:4px;word-break:break-all;font-size:11px">${escape(refreshToken)}</code>
    </div>` : ''}

    <div style="margin-top:24px;padding:16px;background:#0a1e2a;border-left:3px solid #4af;border-radius:6px">
      <b>Next:</b>
      <ol style="margin-top:8px">
        <li>Copy ALL THREE values above (the refresh token keeps the connection alive for a year)</li>
        <li>Railway → Variables tab → Add Variable</li>
        <li>Wait ~1 min for Railway to redeploy</li>
        <li>Dashboard → open a Reel post → click <b>Push to TikTok</b> → video appears in ${escape(username)}'s TikTok drafts</li>
        <li>Open TikTok mobile app → drafts → add music/effects → publish</li>
      </ol>
    </div>

    <p style="color:#666;margin-top:24px;font-size:12px">
      Reconnect at <a href="/connect/tiktok" style="color:#4af">/connect/tiktok</a> when the token expires (~24 hrs — TikTok tokens are short-lived).
    </p>
  `)
}

function html(body: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>TikTok OAuth</title></head>
    <body style="background:#0a0a0a;color:#eee;font-family:-apple-system,sans-serif;max-width:720px;margin:40px auto;padding:24px;line-height:1.5">
    ${body}
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

function escape(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
