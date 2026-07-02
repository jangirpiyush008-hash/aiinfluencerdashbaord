# 📷 Instagram Graph API — Full Auto-Publish Setup

**Goal:** Enable one-click auto-publish from dashboard to any of the 4 Instagram accounts.

**Time estimate:** 2 hours your time + 2-14 days Meta approval + 6-8 hours my build time after approval.

---

## Phase 1 — Convert IG accounts (5 min each, do TODAY)

For each of the 4 Instagram accounts (Siya, Kiara, Mia, Ava):

1. Open Instagram app → tap profile picture → hamburger menu → **Settings**
2. Tap **Account type and tools** → **Switch to professional account**
3. Choose **Creator** (not Business — Creator gets better algo treatment for personal-feel content)
4. Skip the category selection screens
5. When it asks "Are you a business?" → tap **Creator**

Repeat for all 4 accounts. Total: **20 min**.

---

## Phase 2 — Create 4 Facebook Pages (10 min each, do TODAY)

Instagram Graph API requires each IG account to be linked to a Facebook Page. Create pages for each creator:

1. Go to https://www.facebook.com/pages/create
2. Page name: **Siya Sharma** (Personal Brand category)
3. Repeat for Kiara Rai, Mia Carter, Ava Monroe
4. Each page can be minimal — profile pic + one post is enough

Then link each IG to its FB Page:

1. Instagram app → Settings → **Accounts Center** → **Add accounts** → **Add Facebook account**
2. Log into the matching Facebook account → link the specific Page
3. Repeat for all 4

Total: **40-60 min**.

---

## Phase 3 — Meta Developer app (30 min, do TODAY)

1. Go to https://developers.facebook.com and sign in with your personal Facebook
2. Click **My Apps** → **Create App**
3. Use case: **Other** → Type: **Business**
4. App name: **AI Influencer Dashboard**
5. Contact email: your email

In the app dashboard:

6. **Add Product** → **Instagram Graph API** → Set Up
7. **Add Product** → **Facebook Login** → Set Up
8. In Facebook Login → Settings:
   - Valid OAuth redirect URIs: `https://<your-vercel-domain>/api/auth/callback/instagram`
   - Client OAuth Login: **Yes**
   - Web OAuth Login: **Yes**

Total: **30 min**.

---

## Phase 4 — Request scopes for App Review (15 min, TRIGGERS 2-14 DAY CLOCK)

In your app dashboard:

1. **App Review** → **Permissions and Features**
2. Request these scopes:
   - `instagram_basic` ✅ (usually auto-approved)
   - `instagram_content_publish` ⚠️ (this is the one that takes 2-14 days)
   - `pages_show_list`
   - `pages_read_engagement`
   - `business_management`

3. For `instagram_content_publish`:
   - Click **Request**
   - Fill out the form:
     - **Usage description:** "This app manages content for 4 personal Instagram Creator accounts owned by the same user. Content is generated via AI and published directly by the user through the dashboard."
     - **Screencast:** Record a 60-sec video of the dashboard (I'll help with a script when we get here)
     - **Test user credentials:** Provide test account
   - Submit for review

**Meta will email you 2-14 days later with approval or request more info.**

---

## Phase 5 — Get long-lived access tokens (30 min AFTER APPROVAL)

Once Meta approves:

1. In your app → **Tools** → **Access Token Debugger**
2. For each creator, do the OAuth flow:
   - Go to `https://www.facebook.com/v20.0/dialog/oauth?client_id=YOUR_APP_ID&redirect_uri=YOUR_REDIRECT&scope=instagram_content_publish,pages_show_list,business_management`
   - Log in as that creator's Facebook account
   - Get the short-lived token from the redirect
   - Exchange for long-lived (60-day) token via API
3. Store the 4 long-lived tokens securely

Total: **30 min**.

---

## Phase 6 — I build the dashboard integration (6-8 hours my time)

I add:

- `/api/publish-instagram` endpoint (Next.js API route)
- Push button becomes "Publish Now" instead of "Copy"
- Modal shows scheduling options
- Environment variables for the 4 tokens (stored in Vercel)
- Refresh token cron (Meta tokens expire every 60 days)
- Error handling + retry logic
- Post status updates: pending → publishing → posted → error
- Live analytics wiring (follower count, reach)

---

## What breaks / risks

### 1. Meta rejection reasons (most common)
- **AI-generated content warning:** Meta is fine with AI content BUT you must disclose. Add "AI-generated" label in bio.
- **Multiple accounts flag:** Meta may question why one dev app manages 4 accounts. Response: "Same user owns all 4 personal creator brands."
- **Fake account concerns:** Have some organic activity on each account before submitting for review (5-10 real posts per account, some real engagement)

### 2. Rate limits
- 25 publish requests per hour per account = **600 posts/day max per account**
- Way above what we need

### 3. Token expiry
- Long-lived tokens expire every 60 days
- I build auto-refresh cron

### 4. Content policy
- No copyrighted music
- No adult nudity (soft cleavage OK, matches our style)
- No misleading affiliate claims

---

## Backup plan if Meta rejects

**Meta Business Suite manual scheduling** (free, works today):
1. Go to business.facebook.com
2. Link 4 IG accounts to your Business Manager
3. Upload posts + schedule via UI
4. Dashboard has "Prep for MBS" button that copies + downloads → paste into MBS

Not fully automated but works as backup.

---

## Timeline

| Day | Action |
|---|---|
| Today | Phases 1-4 (2 hrs your time) → triggers Meta review clock |
| Day 3-14 | Meta reviews `instagram_content_publish` scope |
| Day of approval | I get pinged → start Phase 6 build |
| Day + 2 | Full auto-publish live on dashboard |

---

## Reply to me with

- **"Done with Phase 1"** (accounts converted) → I confirm what's next
- **"Done with Phase 3"** (Meta app created) → I help write the App Review form
- **"Meta approved!"** → I start the Phase 6 build immediately
- **"Meta rejected — here's their message"** → I help you fix + resubmit

Standing by to walk you through each phase.
