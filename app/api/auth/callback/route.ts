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

  const appId = process.env.IG_APP_ID
  const appSecret = process.env.IG_APP_SECRET
  const redirectUri = process.env.IG_REDIRECT_URI

  if (!appId || !appSecret || !redirectUri) {
    return html('<h1>Server misconfigured</h1><p>Missing IG_APP_ID / IG_APP_SECRET / IG_REDIRECT_URI env vars.</p>')
  }

  // Step 1: exchange code → short-lived token (Instagram Business API)
  const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: appId,
      client_secret: appSecret,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
      code,
    }),
  })
  const tokenJson = await tokenRes.json()
  if (!tokenRes.ok || !tokenJson.access_token) {
    return html(`<h1>Token exchange failed</h1><pre>${escape(JSON.stringify(tokenJson, null, 2))}</pre>`)
  }
  const shortToken = tokenJson.access_token as string
  const userId = tokenJson.user_id as string

  // Step 2: exchange short-lived for long-lived (60-day) token
  const longRes = await fetch(
    `https://graph.instagram.com/access_token?` +
      new URLSearchParams({
        grant_type: 'ig_exchange_token',
        client_secret: appSecret,
        access_token: shortToken,
      })
  )
  const longJson = await longRes.json()
  const longToken = (longJson.access_token as string) || shortToken
  const expiresIn = longJson.expires_in as number | undefined

  // Step 3: fetch user info to display which account they connected
  const meRes = await fetch(
    `https://graph.instagram.com/v21.0/me?fields=user_id,username,account_type&access_token=${longToken}`
  )
  const meJson = await meRes.json()
  const username = meJson.username || 'unknown'
  const accountType = meJson.account_type || 'unknown'

  const creator = state || 'UNKNOWN'
  const envSuffix = creator.toUpperCase()
  const expiresDays = expiresIn ? Math.round(expiresIn / 86400) : 60

  return html(`
    <h1>✅ Connected @${escape(username)}</h1>
    <p style="color:#aaa">Account type: <b>${escape(accountType)}</b> · Token valid ~${expiresDays} days</p>
    <p style="color:#aaa">Add these two env vars to Railway → Variables tab for creator <b>${escape(creator)}</b>:</p>

    <div style="background:#111;padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid #333">
      <div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">IG_USER_ID_${envSuffix}</div>
      <code style="display:block;background:#000;padding:8px;border-radius:6px;margin-top:4px;word-break:break-all">${escape(userId)}</code>
    </div>

    <div style="background:#111;padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid #333">
      <div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">IG_TOKEN_${envSuffix}</div>
      <code style="display:block;background:#000;padding:8px;border-radius:6px;margin-top:4px;word-break:break-all;font-size:11px">${escape(longToken)}</code>
    </div>

    <div style="margin-top:24px;padding:16px;background:#0a1e2a;border-left:3px solid #4af;border-radius:6px">
      <b>Next:</b>
      <ol style="margin-top:8px">
        <li>Copy both values above</li>
        <li>Railway → Variables tab → Add Variable</li>
        <li>Paste name + value, hit Save</li>
        <li>Wait ~1 min for Railway to redeploy</li>
        <li>Back to <a href="/" style="color:#4af">dashboard</a> → open the post → click <b>Auto-publish to Instagram</b></li>
      </ol>
    </div>

    <p style="color:#666;margin-top:24px;font-size:12px">
      Reconnect at <a href="/connect" style="color:#4af">/connect</a> when the token expires (~60 days).
    </p>
  `)
}

function html(body: string) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><title>Instagram OAuth</title></head>
    <body style="background:#0a0a0a;color:#eee;font-family:-apple-system,sans-serif;max-width:720px;margin:40px auto;padding:24px;line-height:1.5">
    ${body}
    </body></html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

function escape(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!))
}
