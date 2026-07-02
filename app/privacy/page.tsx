export const metadata = {
  title: 'Privacy Policy · AI Influencer Dashboard',
  description: 'Privacy policy for the AI Influencer Dashboard app'
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-neutral-200">
      <div>
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-neutral-500">Effective July 2, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. Who we are</h2>
        <p>
          AI Influencer Dashboard ("we", "us", "the app") is a personal content-management tool built by
          Piyush Jangir for planning, generating, and publishing content across a small set of Instagram,
          TikTok, and Pinterest accounts that the operator owns.
        </p>
        <p>Contact: jangir.piyush008@gmail.com</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. What data we collect</h2>
        <p>The app collects and stores only the minimum data needed to help the operator manage their own accounts:</p>
        <ul className="list-disc list-inside space-y-1 text-neutral-300">
          <li>OAuth access tokens for connected Meta / TikTok / Pinterest accounts (used to publish content on the operator's own accounts)</li>
          <li>Content the operator schedules, drafts, or publishes (captions, hashtags, generated images)</li>
          <li>Basic post analytics returned by the platform APIs (impressions, reach, engagement)</li>
          <li>Session data required to keep the operator logged in</li>
        </ul>
        <p>We do not collect data from end users, followers, or third parties.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. How we use the data</h2>
        <ul className="list-disc list-inside space-y-1 text-neutral-300">
          <li>To publish content the operator has explicitly drafted to the operator's own social accounts</li>
          <li>To fetch and display analytics for the operator's own accounts</li>
          <li>To improve the operator's own workflow</li>
        </ul>
        <p>We do not sell, share, or use data for advertising to third parties.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Storage &amp; security</h2>
        <p>
          Tokens are stored as encrypted environment variables on Railway (our hosting provider). Content
          drafts are stored in the repository codebase or on Railway. We use HTTPS end-to-end.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Third parties</h2>
        <p>We integrate with:</p>
        <ul className="list-disc list-inside space-y-1 text-neutral-300">
          <li>Meta (Instagram + Facebook) — content publishing and analytics</li>
          <li>TikTok — content publishing and analytics</li>
          <li>Pinterest — content publishing and analytics</li>
          <li>Higgsfield.ai — AI image generation for the operator's content</li>
          <li>Railway — hosting</li>
          <li>Vercel — hosting fallback</li>
        </ul>
        <p>Each provider's privacy policy applies to data processed on their side.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. Your rights</h2>
        <p>
          The operator (Piyush Jangir) is the only data subject. To delete all data, revoke OAuth tokens
          on each connected platform and delete the Railway deployment.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. Data retention</h2>
        <p>Tokens are kept as long as valid or until manually revoked. Post analytics are retained for 12 months.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">8. AI-generated content disclosure</h2>
        <p>
          Content published through this app is AI-generated using Higgsfield.ai and represents fictional
          characters (Siya Sharma, Kiara Rai, Mia Carter, Ava Monroe). Each post is disclosed as AI-generated
          in captions or platform metadata where required by law or platform policy.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">9. Changes to this policy</h2>
        <p>We may update this policy. The effective date at the top will reflect any changes.</p>
      </section>

      <p className="text-xs text-neutral-500 pt-8 border-t border-neutral-800">
        © 2026 AI Influencer Dashboard. Personal-use content-management tool.
      </p>
    </main>
  )
}
