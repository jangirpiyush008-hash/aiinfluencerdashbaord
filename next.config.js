/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'd8j0ntlcm91z4.cloudfront.net' },
      { protocol: 'https', hostname: 'd2ol7oe51mr4n9.cloudfront.net' },
      { protocol: 'https', hostname: 'upload.higgsfield.ai' }
    ]
  }
}
module.exports = nextConfig
