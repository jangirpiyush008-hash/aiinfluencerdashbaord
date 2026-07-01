# 🎬 AI Influencer Dashboard

A Next.js dashboard for managing 4 AI-generated Instagram creators: **Siya Sharma** (Bangalore), **Kiara Rai** (Mumbai), **Mia Carter** (Chicago), **Ava Monroe** (NYC).

## Features

- 📅 **Calendar view** — 64 posts across 4 weeks (Jul 2 – Jul 29, 2026)
- 📸 **Post preview cards** — click any card for full details
- 🎯 **Filters** — by creator, status, Dubai arc, pet posts
- 🌴 **Dubai story arc** — 14 posts of the group Dubai trip
- 🐕 **Pet posts** — Marshall (Ava's Golden Retriever) + Blinki (Kiara's Beagle)
- 📋 **Copy to clipboard** — one-click copy for Higgsfield prompts, captions, hashtags
- 🎨 **Creator-colored cards** — visual identity per creator

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Deployed on Vercel

## Local dev

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Push to GitHub → connect on [Vercel](https://vercel.com/new) → auto-deploy.

## Creator meta

| Creator | Handle | City | Niche | Soul ID |
|---|---|---|---|---|
| Siya | @_siyasharmaofficial | Bangalore | Beauty + Fashion | `69db0f1c...` |
| Kiara | @kiararai_fit | Mumbai | Fitness + Beauty + Fashion | `1e9f2dc4...` |
| Mia | @miafitcartel | Chicago | Fitness + Healthy Living | `97625973...` |
| Ava | @ava.fabfashion | NYC | Fashion + Beauty | `4e3cc9d3...` |

## Data model

All 64 posts live in `lib/calendar.ts`. Each post has:
- Sequential ID (1/64 to 56/64 + 8 filler slots)
- Date, day, creator, format (single/carousel/video), slides
- Concept, photo description
- Full Higgsfield prompt (ready to fire via MCP)
- Caption + 5 hashtags (IG algorithm-optimized limit)
- Status (pending / generated / scheduled / posted)
- Image URL slot (populated after Higgsfield gen)
- Flags: `isDubaiArc`, `isPetPost`, `petName`

## Prompt style guide

All prompts follow a strict 8-section structure — see [`docs/PROMPT_STYLE_GUIDE.md`](./docs/PROMPT_STYLE_GUIDE.md).

**Face-lock rules:**
- Main creator alone → `soul_2` with `soul_id`
- New face (boyfriend/family/car/pet) → `nano_banana_2` first to generate, save as Reference Element, then use `<<<element_id>>>` in future prompts
- Multi-character → `nano_banana_2` with multiple `<<<element>>>` placeholders

**Boldness rules:**
- Kiara / Mia / Ava = plunging deep-V, revealing cleavage, bombshell energy
- Siya = sweet Indian normal beauty, modest cuts, tasteful collarbones only

**Family posts:** hard-capped at 3 total (Siya, Kiara, Mia — 1 each). Solo/lifestyle content dominates.

## Roadmap

- [ ] Wire Higgsfield MCP for one-click gen from dashboard
- [ ] Vercel deploy
- [ ] Analytics dashboard (post performance)
- [ ] Meta Business Suite integration for auto-scheduling
- [ ] Add creators 5+ as content scales
