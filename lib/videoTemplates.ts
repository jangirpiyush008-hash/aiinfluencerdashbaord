export type VideoTemplate = {
  id: string
  name: string
  description: string
  duration: string
  platform: string
  useCase: string
  prompt: string
}

export const VIDEO_TEMPLATES: VideoTemplate[] = [
  {
    id: 'cinematic-15s',
    name: 'Cinematic 15-Second Promo',
    description: 'Aggressive pacing, premium lighting, ultra scroll-stopping product reveal.',
    duration: '15 sec',
    platform: 'Instagram Reels / TikTok / YouTube Shorts',
    useCase: 'Product launch, affiliate promo, brand deal',
    prompt: `Using the Higgsfield connector, create a 15-second cinematic promotional video for [PRODUCT NAME].

Use maximum visual effects, aggressive pacing, premium lighting, and ultra-scroll-stopping editing.

SHOT 1 (0:00–0:01) — OPENING REVEAL
Effect: Hard cut flash-in + zoom-in + lens flare burst
Scene: Product drops into frame from a black void.
Camera: Static low-angle cinematic framing.
Transition: Snap whip-pan into Shot 2.

SHOT 2 (0:01–0:03) — THE WOW MOMENT
Effect: Speed ramp → freeze-frame at peak emotion.
Scene: Hero shot of person using product naturally.
Visual FX: Motion blur smear, color briefly desaturates, snaps back vivid during freeze.

SHOT 3 (0:03–0:06) — PRODUCT SHOWCASE
Effect: 360-degree orbital camera + rack focus.
Scene: Premium product close-up showing texture, logo, packaging, details.
FX: Golden particle dust, cinematic depth-of-field, smooth slow motion.

SHOT 4 (0:06–0:10) — LIFESTYLE + SOCIAL PROOF
Effect: Split-screen montage + kinetic typography.
Kinetic Text: "YOU DESERVE THIS"
Scene: Multiple fast-cut angles showing the product in real-world use.
Style: Premium lifestyle visuals with social-proof energy.

SHOT 5 (0:10–0:12) — CTA BUILDUP
Effect: Crash zoom + chromatic aberration spike.
CTA Text: "SHOP NOW / LINK IN BIO / TRY IT TODAY"
Typography: Large bold vibrating text with aggressive motion.

SHOT 6 (0:12–0:15) — FREEZE + FILM BURN ENDING
Effect: Hyper-deceleration → hard freeze frame → film burn transition.
Scene: Extreme product close-up composited during burn-out.
Ending: Fade to black exactly at 0:15.

Product: [PRODUCT NAME + DESCRIPTION]
Target: [Gen Z women / gym lovers / skincare / entrepreneurs]
Feel: Highly cinematic, emotionally addictive, fast-paced, premium, viral-ready.`
  },
  {
    id: 'mj-style-hat',
    name: 'The Hat — Michael Jackson Style Promo',
    description: 'Surreal, cinematic MJ-inspired promo with moonwalk, freeze frames, kinetic text.',
    duration: '15 sec',
    platform: 'Instagram Reels / TikTok',
    useCase: 'Statement product drop, fashion/accessory launch, brand statement',
    prompt: `Using the Higgsfield connector, create a 15-second Michael Jackson-inspired cinematic promo video.

SHOT 1 (0:00–0:01) — BLACK VOID DROP
Effects: Hard cut flash-in, digital zoom scale-in, lens flare burst
Scene: Pure black frame. Product drops from above. Low-angle looking upward. Shockwave light pulse expands outward. Subtle smoke ripple.
Transition: Snap whip-pan LEFT into Shot 2.

SHOT 2 (0:01–0:02.5) — "EHEEEE!" MOMENT
Effects: Speed ramp, motion blur smear, freeze-frame snap zoom.
Scene: MJ-style performer spins into frame mid-moonwalk stance. Tips hat brim with one finger. On "EHEEE!" frame freezes at peak, color desaturates near B&W, snaps back vivid.
Transition: Vertical whip-pan UP.

SHOT 3 (0:02.5–0:04) — MOONWALK SEQUENCE
Effects: Reverse motion layer, ghost afterimage trails, reflection ripple floor.
Scene: Wide shot moonwalking across reflective black floor. Each footstep creates liquid-like ripple reflections. Camera dollies backward. Playback ~80% speed for surreal glide.

SHOT 4 (0:04–0:05.5) — THE LAUGH
Effects: Crash zoom, film grain burst, warm orange-gold color spike.
Scene: Performer laughs dramatically while adjusting product. Camera aggressively pushes into close-up.

SHOT 5 (0:05.5–0:07) — PRODUCT SPIN
Effects: 360-degree orbital camera, rack focus, 40% slow motion.
Scene: Performer extends product toward camera. Background falls into creamy bokeh. Golden particle dust drifts.

SHOT 6 (0:07–0:08.5) — KINETIC TEXT BURST
Effects: Kaleidoscope split-screen burst, kinetic text flashes, dolly push.
Text: "YOU CAN CREATE WHATEVER YOU WANT" — each word slams at staggered intervals.

SHOT 7 (0:08.5–0:10) — DANCE EXPLOSION
Effects: Multi-stutter cuts, strobe rhythm sync, time deceleration.
Scene: Rapid poses — spin, toe stand, hip lock, MJ attitude. Final pose slows to 15% speed.

SHOT 8 (0:10–0:12) — "SUBSCRIBE BABY!"
Effects: Dutch angle, extreme crash zoom, RGB split / chromatic aberration.
Scene: Performer leans into lens shouting CTA. Text: "SUBSCRIBE" — massive aggressive typography shaking violently.

SHOT 9 (0:12–0:15) — SNAP / FREEZE / FILM BURN
Effects: Hyper-deceleration, hard freeze-frame, film burn transition.
Scene: Finger snap freezes frame instantly. Film burn bleeds from top-left corner. Product close-up appears bottom-right during burn. Fade to full black at exactly 0:15.`
  },
  {
    id: 'pinterest-carousel',
    name: 'Pinterest Carousel Master',
    description: '4-slide vertical carousel optimized for Pinterest mobile feed. Wellness / lifestyle infographic style.',
    duration: 'Static (4 slides, 3:4 aspect)',
    platform: 'Pinterest',
    useCase: 'Affiliate product education, wellness recommendations, lifestyle content',
    prompt: `Using the Higgsfield connector, create a high-converting Pinterest carousel for [PRODUCT NAME + LINK].

FORMAT: 4 vertical 3:4 slides, mobile-optimized, premium but realistic (not AI-looking).

STYLE: Realistic product photography, natural lifestyle visuals, clean typography, soft branding, layered editorial layouts, Pinterest-style infographic formatting.
FEEL: [calm / energetic / trustworthy / feminine / clean]
COLORS: [soft neutrals / pink and white / bold greens]
AUDIENCE: [women 20-30 / busy moms / gym-goers]

SLIDE 1 — HOOK
Large bold text: [YOUR HOOK — e.g., "Why I Couldn't Sleep Through the Night..."]
Supporting text: [Relatable curiosity statement]
Visual: Person naturally experiencing the problem. Product subtly visible.

SLIDE 2 — THE PROBLEM
Educational pain points (4):
- [Pain Point 1]
- [Pain Point 2]
- [Pain Point 3]
- [Pain Point 4]
Visual: Lifestyle visual showing the struggle naturally.

SLIDE 3 — THE ROUTINE
Large text: "My New [NUMBER]-Minute Routine"
Steps (4):
- [Step 1]
- [Step 2]
- [Step 3]
- [Step 4]
Visual: Warm cozy aesthetic showing product in use.

SLIDE 4 — RESULT + CTA
Large text: [YOUR TRANSFORMATION RESULT]
Smaller text: [SOFT CTA — e.g., "Link in bio to try it"]
Include: Product close-up, peaceful transformation visual, clean CTA styling.

DESIGN RULES:
- Highly graphical premium Pinterest aesthetic
- Strong visual hierarchy, mobile-first
- Saveable/shareable
- No stock-photo or AI energy
- Medium-large bold typography for mobile scrolling`
  },
  {
    id: 'magnesium-example',
    name: 'Magnesium Glycinate — Filled Example',
    description: 'Fully filled Pinterest carousel template using a real product (Designs for Health Magnesium).',
    duration: 'Static (4 slides, 3:4 aspect)',
    platform: 'Pinterest',
    useCase: 'Reference/example — copy and adapt for any supplement or wellness product',
    prompt: `Using the Higgsfield connector, create a high-converting Pinterest carousel for this Magnesium Glycinate supplement:
https://www.amazon.com/Designs-Health-Magnesium-BufferedCapsules/dp/B000FGWBK6

FORMAT: 4 vertical 3:4 slides, Pinterest-optimized, modern wellness aesthetic, premium but realistic.

STYLE:
- Realistic women in their 20s
- Cozy nighttime routines, warm lamp lighting, soft daylight
- Wellness lifestyle scenes, Pinterest infographic layouts
- Smooth layered compositions, subtle shadows and depth
- Clean white backgrounds, natural expressions, realistic skin texture, accurate product rendering
Avoid: Clutter, fake AI look, stock-photo energy.

SLIDE 1 — HOOK
Text: "Why I Couldn't Sleep Through the Night..."
Supporting: "The bedtime habit that completely changed my sleep routine."
Visual: Woman awake in bed scrolling phone at night. Magnesium bottle subtly visible.

SLIDE 2 — THE PROBLEM
Pain points:
- constantly waking up at night
- racing thoughts before bed
- exhausted in the morning
- restless sleep and stress
Visual: Young woman tossing in bed checking clock.

SLIDE 3 — THE ROUTINE
Text: "My New 5-Minute Night Routine"
Steps:
- taking magnesium
- drinking water
- putting phone away
- relaxing in bed
Visual: Warm cozy nighttime wellness scene.

SLIDE 4 — RESULT + CTA
Large text: "I Finally Started Sleeping Better"
Smaller text: "Worth trying if you've been struggling with sleep and stress."
Include: Product close-up, peaceful morning aesthetic, clean CTA styling.

DESIGN: Premium Pinterest aesthetic, strong visual hierarchy, easy-to-read bold text, saveable/shareable, conversion-focused layout, modern wellness editorial feel, native Pinterest style.`
  }
]
