// Client-side "done / posted" toggle for each post (localStorage).
// Used because CALENDAR is a static server-loaded const — we need per-user post-status overrides.

export function isDone(postId: number | string): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(`post-${postId}-done`) === '1'
  } catch {
    return false
  }
}

export function setDone(postId: number | string, done: boolean) {
  if (typeof window === 'undefined') return
  try {
    if (done) localStorage.setItem(`post-${postId}-done`, '1')
    else localStorage.removeItem(`post-${postId}-done`)
    // Fire a storage event so other tabs / mounted components refresh
    window.dispatchEvent(new StorageEvent('storage', { key: `post-${postId}-done` }))
  } catch {}
}
