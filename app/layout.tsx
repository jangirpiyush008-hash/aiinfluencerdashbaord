import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Influencer Dashboard',
  description: '4-creator content calendar for Siya, Kiara, Mia, and Ava',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'AI Influencers',
    statusBarStyle: 'black-translucent'
  }
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AI Influencers" />
      </head>
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
