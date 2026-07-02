export const metadata = {
  title: 'Data Deletion · AI Influencer Dashboard',
  description: 'How to request deletion of your data from the AI Influencer Dashboard'
}

export default function DataDeletionPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-neutral-200">
      <div>
        <h1 className="text-3xl font-bold mb-2">User Data Deletion</h1>
        <p className="text-sm text-neutral-500">Effective July 2, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Who this applies to</h2>
        <p>
          AI Influencer Dashboard is a personal-use content-management tool operated by Piyush Jangir. The
          only person whose data is processed is the operator himself. We do not collect or store data from
          any third-party end users, followers, or public visitors.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What data we store</h2>
        <ul className="list-disc list-inside space-y-1 text-neutral-300">
          <li>OAuth access tokens for the operator's own Meta / TikTok / Pinterest accounts</li>
          <li>Content drafts, captions, hashtags, and AI-generated image references</li>
          <li>Post analytics returned by platform APIs (impressions, reach, engagement) — for the operator's own accounts only</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">How to request deletion</h2>
        <p>To delete all data associated with your Meta / Facebook account from this app:</p>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-2">Option 1 — Revoke access directly on Meta (fastest)</h3>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300 text-sm">
              <li>Go to <a className="text-blue-400 underline" href="https://www.facebook.com/settings?tab=business_tools" target="_blank" rel="noreferrer">Facebook → Settings → Business Integrations</a></li>
              <li>Find "AI Influencer Dashboard"</li>
              <li>Click Remove → confirm</li>
              <li>Your access token is invalidated immediately and cannot be used to fetch new data</li>
            </ol>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Option 2 — Email deletion request</h3>
            <p className="text-sm text-neutral-300">
              Email <a className="text-blue-400 underline" href="mailto:jangir.piyush008@gmail.com">jangir.piyush008@gmail.com</a> with the subject line:
            </p>
            <p className="text-sm text-neutral-100 bg-neutral-950 rounded p-3 mt-2 font-mono">
              "Data Deletion Request — [Your Facebook Name]"
            </p>
            <p className="text-sm text-neutral-300 mt-2">
              Include the Facebook User ID or the Instagram handle you want deleted. We respond and confirm deletion
              within <span className="font-semibold">7 business days</span>.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What we delete</h2>
        <ul className="list-disc list-inside space-y-1 text-neutral-300">
          <li>Encrypted OAuth tokens tied to your Meta identity</li>
          <li>Any content drafts stored on our systems that reference your accounts</li>
          <li>Analytics rows tied to your account IDs</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">What we cannot delete</h2>
        <p>
          Once a post has been published to Instagram/Facebook/TikTok/Pinterest, deletion of the post itself
          is controlled by those platforms. Log in to each platform directly to delete the post.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          Email: <a className="text-blue-400 underline" href="mailto:jangir.piyush008@gmail.com">jangir.piyush008@gmail.com</a>
        </p>
      </section>

      <p className="text-xs text-neutral-500 pt-8 border-t border-neutral-800">
        © 2026 AI Influencer Dashboard. Personal-use content-management tool.
      </p>
    </main>
  )
}
