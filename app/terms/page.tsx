export const metadata = {
  title: 'Terms of Service · AI Influencer Dashboard',
  description: 'Terms of service for the AI Influencer Dashboard app'
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 space-y-8 text-neutral-200">
      <div>
        <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-neutral-500">Effective July 2, 2026</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">1. About</h2>
        <p>
          AI Influencer Dashboard is a personal-use content-management tool operated by Piyush Jangir. It
          is used to plan, generate, and publish AI-generated content across the operator's own social media
          accounts on Meta, TikTok, and Pinterest.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">2. Acceptable use</h2>
        <p>The app is used only:</p>
        <ul className="list-disc list-inside space-y-1 text-neutral-300">
          <li>By the operator (Piyush Jangir)</li>
          <li>To manage social accounts the operator personally owns</li>
          <li>To publish content the operator has generated or licensed</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">3. AI-generated content disclosure</h2>
        <p>
          Content published through this app is AI-generated using Higgsfield.ai. Fictional characters (Siya
          Sharma, Kiara Rai, Mia Carter, Ava Monroe) are not real people. Each post is disclosed as
          AI-generated where required by law or platform policy. Any resemblance to real individuals is
          coincidental.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">4. Platform compliance</h2>
        <p>
          Use of Meta, TikTok, and Pinterest APIs through this app complies with each provider's Platform
          Terms and Policies. The operator is responsible for ensuring content complies with each platform's
          community standards.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">5. Affiliate disclosures</h2>
        <p>
          When posts include affiliate links, they are disclosed as required by FTC (US) and CCPA (India)
          regulations using #ad or #affiliate labels where applicable.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">6. Intellectual property</h2>
        <p>
          All AI-generated content produced by the app belongs to the operator. Third-party trademarks
          (brand names, product mentions) belong to their respective owners and are used only for editorial
          or affiliate purposes.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">7. No warranty</h2>
        <p>
          The app is provided "as-is". No warranty is made regarding uptime, data preservation, or API
          reliability. Platform providers may change their APIs at any time.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">8. Limitation of liability</h2>
        <p>
          The operator is solely responsible for content and outcomes. The app authors are not liable for
          account suspensions, API failures, or downstream damages.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">9. Changes</h2>
        <p>These terms may change. The effective date at the top will reflect updates.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">10. Contact</h2>
        <p>jangir.piyush008@gmail.com</p>
      </section>

      <p className="text-xs text-neutral-500 pt-8 border-t border-neutral-800">
        © 2026 AI Influencer Dashboard. Personal-use content-management tool.
      </p>
    </main>
  )
}
