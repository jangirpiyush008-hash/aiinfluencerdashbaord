// Route a generated image through the /api/img proxy, which auto-trims any fake
// social-media UI bands (usernames/icons/arrows the generator sometimes bakes in)
// and re-encodes to JPEG. Clean images pass through untouched.
// Only proxies our known CDNs; anything else (already-proxied, data URLs, blobs)
// is returned as-is.

const PROXY_HOSTS = [
  'd8j0ntlcm91z4.cloudfront.net',
  'd2ol7oe51mr4n9.cloudfront.net',
  'cdn.higgsfield.ai',
  'res.cloudinary.com',
]

export function cleanImg(url: string | undefined | null): string {
  if (!url) return ''
  if (url.includes('/api/img?url=')) return url
  try {
    const u = new URL(url)
    if (PROXY_HOSTS.includes(u.hostname)) {
      return `/api/img?url=${encodeURIComponent(url)}`
    }
  } catch {
    /* not an absolute URL — leave untouched */
  }
  return url
}
