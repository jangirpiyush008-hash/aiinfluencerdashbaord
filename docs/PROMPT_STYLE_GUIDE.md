# 🎨 HIGGSFIELD PROMPT STYLE GUIDE

**Every prompt in this repo follows this structure for maximum output accuracy.**

---

## 1. FACE-LOCK RULES (mandatory)

| Situation | Model | How to lock face |
|---|---|---|
| **Main creator alone** (Siya, Kiara, Mia, Ava) | `soul_2` (Soul V2) | `soul_id: <trained Soul ID>` |
| **Main creator + product** | `soul_2` | `soul_id` + `medias[{role:image, value: product_media_id}]` |
| **New character** (boyfriend, family member, pet) | `nano_banana_2` | Generate anchor image → save as Reference Element via `show_reference_elements action=create` → then use `<<<element_id>>>` in future prompts |
| **Main creator + boyfriend/family** | `nano_banana_2` | Embed BOTH element placeholders: `<<<creator_element_id>>> + <<<boyfriend_element_id>>>` |
| **Multiple main creators** (Dubai reunion) | `nano_banana_2` | Embed all 4 element placeholders: `<<<siya>>> + <<<kiara>>> + <<<mia>>> + <<<ava>>>` |

**Soul IDs (locked):**
- Siya: `69db0f1c-ca4d-4238-aa59-9a23bfefb06d`
- Kiara: `1e9f2dc4-1196-4778-83e3-5155b2fa432a`
- Mia: `97625973-f756-4378-83d9-2336c2d26250`
- Ava: `4e3cc9d3-4b86-4fc6-9b38-f4186fed4d7f`

**Reference Elements (locked):**
- Siya: `659002e5-2a38-4295-bb29-2161c98a058d`
- Kiara: `62e48caf-931d-45a0-a2a7-b4a57c63ba0b`
- Mia: `347b753b-1408-4c5b-b8f6-8dbde82be595`
- Ava: `bf46fc65-6637-4898-b5ac-99e10b772aca`
- Dymatize whey tub: `3697a342-436f-4509-abf8-ceaeed8eb413`
- Pending (create on first appearance): Marshall, Blinki, all boyfriends, all family, all cars

---

## 2. PROMPT SECTIONS (all 8 required for detailed accuracy)

### A. CHARACTER + FACE LOCK
`[Creator name] (Soul V2 lock: soul_id=<id>) — [physical trait recap]`

### B. WARDROBE (detailed clothing)
Include: exact garment name, color, cut, fit, brand hint, layering, accessories.
- **Kiara/Mia/Ava:** always include "plunging deep-V neckline showing REVEALING cleavage"
- **Siya:** modest cuts, cream/pastel silk, tasteful collarbones NOT cleavage
- Always mention: shoes, jewelry (gold layered necklaces standard), bag, watch, sunglasses

### C. HAIR + MAKEUP
- Hair: length, texture, style (bombshell waves / sleek ponytail / half-up), state (wet / dry / flying)
- Makeup: soft glam / dewy / smoky / no-makeup — specify products (glossy nude lip, bronze eye, dewy highlight)

### D. POSE + EXPRESSION
- Body position (mid-stride, seated, leaning, kneeling)
- Hand placement (on hip, adjusting earring, at mirror)
- Gaze (direct camera, over shoulder, looking away)
- Facial expression (sultry smirk, joyful laugh, soft smile, contemplative)

### E. SETTING (specific location)
- Named venue when applicable (Cult.fit Bandra, Nobu Dubai, Anjuna Beach Goa, Cipriani NYC, Miami South Beach)
- Time of day (golden hour, morning, moody dusk)
- Interior details (marble kitchen, industrial gym, chic café patio, luxury bedroom)
- Background elements (Mumbai skyline, Chicago Lake Michigan, NYC storefronts blurred)

### F. LIGHTING + CINEMATOGRAPHY
- Source (natural window, ring light, moody sconce, golden sunset, red neon)
- Direction (front-left, from side, backlit)
- Quality (soft warm, hard moody, cinematic)
- Camera style (phone selfie POV, editorial framing, iPhone 17 Pro Max quality)

### G. REALISM MARKERS
Every prompt ends with:
`Hyperrealistic Instagram [format] 4:5 or 9:16, real skin pores, slight film grain, iPhone 17 Pro Max quality. [Boldness cue]`

Boldness cues:
- Kiara/Mia/Ava: `BOLD SEXY bombshell energy — revealing but tasteful`
- Siya: `SWEET soft Indian beauty — modest and elegant`

### H. NEGATIVE PROMPTS (avoid)
Standard: `No CGI, no plastic skin, no doll eyes, no over-retouching, no cartoon look.`

---

## 3. STORY vs POST PROMPT DIFFERENCES

| Attribute | Feed post | Story |
|---|---|---|
| Aspect ratio | 4:5 (Instagram feed) | 9:16 (Instagram Stories) |
| Prompt length | 4-8 sentences (detailed) | 2-4 sentences (quick snapshot) |
| Caption vibe | 2-3 paragraphs | 1-line text overlay ON the photo |
| Face lock | Soul V2 preferred | Soul V2 or Nano Banana |
| Realism | Editorial cinematic | Casual snapshot phone-mic feel |
| Hashtags | 5 max | 0 (stories don't use hashtags) |

---

## 4. FASHION IDENTITY per creator (MUST show in every post)

### 🌸 SIYA — Modern Indian sweet-feminine (Bangalore beauty + fashion)
**Aesthetic:** Sabyasachi meets Anokhi meets Charlotte Tilbury. India-forward with global polish. Feminine, modest, elegant. Never cleavage.

**Wardrobe categories:**
- **Café/desk work:** silk kurti + palazzo OR cotton kurta + jeans + jhumkas + kolhapuri chappals
- **Skincare/vanity content:** cream silk robe / matching cream silk pyjama set + jade roller + gold chain
- **Family lunch:** banarasi silk sari OR anarkali + gold jhumkas + red bindi
- **Date night:** blush pink midi dress + Amrapali jhumkas + delicate gold chain
- **Sunday brunch:** printed cotton co-ord + Kolhapuri wedges + jhumkas

**Brands to reference:** Anokhi, Fabindia, Sabyasachi (occasion), Payal Singhal, Ritu Kumar, Amrapali (jewelry), Charlotte Tilbury, Tatcha, Drunk Elephant (beauty)

**Modesty rule:** ALWAYS modest necklines. Tasteful collarbones only. NEVER cleavage. Kurtas and silk slips only.

**Every post must include:** either a distinctly Indian garment (kurti, sari, jhumkas, kolhapuri) OR luxury Indian beauty product (Charlotte Tilbury, Tatcha).

---

### 🌹 KIARA — Fitness bombshell + Mumbai fashion (60% gym / 40% chic)
**Aesthetic:** Cult.fit bombshell by day, Bandra chic by night. Punjabi elegance for family. Bold, sexy, revealing but tasteful.

**Wardrobe categories:**
- **Gym daily:** deep-V black Cultsport/Nike sports bra + high-waist compression Alo leggings + Nike sneakers
- **Post-gym café:** cropped Nike hoodie + bike shorts + Air Max
- **Mumbai balcony evening:** deep-V black silk slip camisole + cream satin joggers + gold body chain
- **Rooftop night out:** deep-V black satin bodycon mini + gold body chain + Sabyasachi jhumkas + Louboutin heels
- **Family visit:** elegant Punjabi salwar-kameez + gold jhumkas
- **Goa beach:** deep-V black triangle bikini + gold body chain + sarong

**Brands to reference:** Cultsport, Nike, Lululemon, Alo Yoga, Gymshark, Zara (casual), Sabyasachi (occasion)

**Boldness rule:** deep-V necklines REVEALING cleavage, toned abs visible, snatched waist.

**Every post must include:** either gym gear (sports bra/compression) OR figure-hugging bombshell fashion.

---

### 🌊 MIA — Athletic bombshell + Chicago fit lifestyle (80% fitness / 20% casual)
**Aesthetic:** Lululemon Alo athletic bombshell. Bright neon pops on cream/white base. Chicago city-fit girl.

**Wardrobe categories:**
- **Morning run:** deep-V neon-green Nike Dri-Fit sports bra + high-waist white bike shorts + white Nike Vaporfly
- **Gym daily:** Alo Yoga matching seamless set (deep-V bra + leggings) + Nike sneakers
- **Post-workout casual:** deep-V white ribbed sports bra + Chicago Bears cap + bike shorts
- **Sunday chill:** deep-V cream Skims lounge set + Ugg slippers + coffee
- **Chicago date night:** deep-V black satin slip dress + Louboutin heels + Blake
- **Miami beach:** deep-V neon-green triangle bikini + gold body chain + sarong

**Brands to reference:** Lululemon, Nike, Alo Yoga, Vuori, Bandier, Gymshark, Skims, Reformation (date night)

**Boldness rule:** deep-V REVEALING cleavage + toned athletic abs visible.

**Every post must include:** either fitness gear OR athletic-bombshell casual (never full formal).

---

### 🖤 AVA — Editorial luxury bombshell + NYC quiet-luxury fashion (100% fashion-forward)
**Aesthetic:** Quiet-luxury editorial. Silk, cashmere, tailoring. Designer bags. Fashion Week regular. Never fast-fashion. Old-money-meets-new-money NYC.

**Wardrobe categories:**
- **NYC morning:** deep-V cream silk slip Balmain camisole + Loro Piana lounge pants + Chanel classic flap + Cartier bracelet
- **Office chic:** structured cream blazer + deep-V black silk halter Balmain + tailored trousers + Louboutin So Kate
- **Central Park with Marshall:** The Row oversized camel wool trench + deep-V cashmere + Celine Triomphe bag + jeans
- **Cipriani dinner:** deep-V black satin slip Balmain mini dress + Louboutin + Prada clutch
- **Fashion event red carpet:** deep-V structured black silk gown OR sequin Balmain bodycon
- **Hamptons pool:** deep-V nude silk crochet bikini + gold body chain + Chanel straw hat

**Brands to reference:** Chanel, Hermès, The Row, Loro Piana, Balmain, Bottega Veneta, Christian Louboutin, Celine, Prada, Cartier, Van Cleef

**Boldness rule:** deep-V REVEALING cleavage + elegant collarbones. Editorial not gym.

**Every post must include:** at least ONE named designer brand piece (bag, shoes, bracelet, or garment).

---

## 5. WHAT MAKES A "BAD" PROMPT

❌ *"Kiara at the gym, fit, hot"* — Too vague. Model has no visual anchors.

✅ *"Kiara Rai (Soul V2 lock: soul_id=1e9f2dc4-1196-4778-83e3-5155b2fa432a) mid-deadlift at Cult.fit gym Bandra Mumbai, moody industrial black hex walls with red neon accent lighting behind, sleek tight high ponytail with 2 face-framing strands falling, sweaty sheen on forehead + collarbones, intense focused expression with clenched jaw, wearing plunging deep-V black Nike Dri-Fit sports bra REVEALING cleavage + high-waisted black seamless leggings showing sculpted 4-pack abs, tiny mole above right upper lip visible (identity lock), warm cinematic gym lighting from overhead, blurred weight rack behind. Hyperrealistic Instagram feed 4:5, real skin pores + sweat detail, slight film grain, iPhone 17 Pro Max quality. BOLD SEXY bombshell fit energy — revealing but tasteful. No CGI, no plastic skin, no doll eyes."*

---

## 6. GENERATION WORKFLOW

1. Pick post from Calendar tab
2. Open modal → copy prompt
3. If new face needed (boyfriend, family, car reveal) → first: `nano_banana_2` with detailed face description → save output as Reference Element → THEN use element placeholder in main prompt
4. Fire `soul_2` (or `nano_banana_2` if multi-character) with prompt
5. Once image lands → click "Copy All" (caption + hashtags)
6. Post to Instagram via Meta Business Suite
7. Update dashboard status to `posted`
