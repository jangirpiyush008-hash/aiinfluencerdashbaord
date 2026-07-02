import { NextResponse } from 'next/server'

// Meta pings this URL when a user removes the app from their Facebook account.
// We just acknowledge — token cleanup happens on next OAuth reconnect.
export async function POST() {
  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ ok: true, note: 'Deauthorize webhook — POST only in practice' })
}
