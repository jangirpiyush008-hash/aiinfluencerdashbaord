import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // creator name
  const error = searchParams.get('error')

  if (error) {
    return html(`<h1>OAuth error</h1><pre>${escape(error)}</pre>`)
  }
  if (!code) return html('<h1>Missing code param</h1>')

  const appId = process.env.META_APP_ID
  const appSecret = process.env.META_APP_SECRET
  const redirectUri = process.env.META_REDIRECT_URI

  if (!appId || !appSecret || !redirectUri) {
    return html('<h1>Server misconfigured</h1><p>Missing META_APP_ID / META_APP_SECRET / META_REDIRECT_URI env vars.</p>')
  }

  // Step 1: exchange code → short-lived token
  const tokenRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?` +
      new URLSearchParams({
        client_id: appId,
        client_secret: appSecret,
        redirect_uri: redirectUri,
        code,
      })
  )
  const tokenJson = await tokenRes.json()
  if (!tokenRes.ok || !tokenJson.access_token) {
    return html(`<h1>Token exchange failed</h1><pre>${escape(JSON.stringify(tokenJson, null, 2))}</pre>`)
  }
  const shortToken = tokenJson.access_token as string

  // Step 2: swap for long-lived (60-day) token
  const longRes = await fetch(
    `https://graph.facebook.com/v21.0/oauth/access_token?` +
      new URLSearchParams({
        grant_type: 'fb_exchange_token',
        client_id: appId,
        client_secret: appSecret,
        fb_exchange_token: shortToken,
      })
  )
  const longJson = await longRes.json()
  const longToken = (longJson.access_token as string) || shortToken

  // Step 3: get Pages the user manages
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=name,access_token,instagram_business_account{id,username}&access_token=${longToken}`
  )
  const pagesJson = await pagesRes.json()
  const pages = (pagesJson.data as Array<{ name: string; access_token: string; instagram_business_account?: { id: string; username: string } }>) || []

  const igAccounts = pages
    .filter((p) => p.instagram_business_account)
    .map((p) => ({
      pageName: p.name,
      pageToken: p.access_token,
      igUserId: p.instagram_business_account!.id,
      igUsername: p.instagram_business_account!.username,
    }))

  const creator = state || 'UNKNOWN'
  const envSuffix = creator.toUpperCase()

  const rows = igAccounts
    .map(
      (a) => `
    <div style="background:#111;padding:16px;border-radius:12px;margin-bottom:12px;border:1px solid #333">
      <div style="font-weight:600;font-size:16px">📷 @${escape(a.igUsername)} <span style="color:#666;font-weight:400">(Page: ${escape(a.pageName)})</span></div>
      <div style="margin-top:12px">
        <div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">IG_USER_ID_${envSuffix}</div>
        <code style="display:block;background:#000;padding:8px;border-radius:6px;margin-top:4px;word-break:break-all">${escape(a.igUserId)}</code>
      </div>
      <div style="margin-top:12px">
        <div style="color:#888;font-size:12px;text-transform:uppercase;letter-spacing:1px">IG_TOKEN_${envSuffix}</div>
        <code style="display:block;background:#000;padding:8px;border-radius:6px;margin-top:4px;word-break:break-all;font-size:11px">${escape(a.pageToken)}</code>
      </div>
    </div>`
    )
    .join('')

  const noAccounts = igAccounts.length === 0
    ? `<div style="background:#3a1a1a;border:1px solid #663;padding:16px;border-radius:12px;color:#fca">
        No Instagram Business accounts found linked to your Facebook Pages. Make sure the Instagram account is set to
        Business (not Personal) and linked to a Facebook Page in Meta Business Suite.
      </div>`
    : ''

  return html(`
    <h1>✅ Connected — copy these to Railway</h1>
    <p style="color:#aaa">Add these two env vars to Railway → Variables tab for creator <b>${escape(creator)}</b>:</p>
    ${noAccounts}
    ${rows}
    <p style="color:#666;margin-top:24px;font-size:12px">
      Long-lived token valid 60 days. Reconnect at <a href="/connect" style="color:#4af">/connect</a> when it expires.
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
