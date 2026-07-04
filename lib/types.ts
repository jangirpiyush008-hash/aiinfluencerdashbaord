export type Creator = 'Siya' | 'Kiara' | 'Mia' | 'Ava'
export type PostStatus = 'pending' | 'generated' | 'scheduled' | 'posted'
export type PostFormat =
  | 'single'          // 1 image
  | 'mini-carousel'   // 2 images paired
  | 'carousel'        // 3-4 slides, story arc
  | 'diary'           // 8-slide Sunday recap, day-in-my-life
  | 'video'           // real Higgsfield-generated 15-20s reel
  | 'tiktok-slideshow' // 4-5 photos → TikTok Photo→Video tool → cross-post to IG Reel (Mia + Ava only)

export type FrameType =
  | 'real-object-selfie'
  | 'product-flat-lay'
  | 'restaurant-food'
  | 'cameo'  // boyfriend / family / pet
  | 'atmosphere' // sunset / balcony / cruise
  | 'blurry-candid'
  | 'bold-sexy'
  | 'mundane-real-life'
  | 'face-mask-raw'
  | 'big-reveal'

export type Post = {
  id: number
  date: string
  day: string
  creator: Creator
  handle: string
  format: PostFormat
  slides: number
  concept: string
  photoDescription: string
  prompt: string
  caption: string
  hashtags: string[]
  imageUrl?: string
  imageUrls?: string[] // for carousels (2-10 URLs)
  videoUrl?: string // for reels
  status: PostStatus
  frameTypes?: FrameType[]  // which of the 10 frame types this post rotates through
  isDubaiArc?: boolean
  isPetPost?: boolean
  petName?: 'Marshall' | 'Blinki'
  isProductVideo?: boolean
  videoTemplateId?: string
  isBoyfriendPost?: boolean
  isFamilyPost?: boolean
  isBeachPost?: boolean
  isRevealPost?: boolean  // family / boyfriend / pet first appearance
  isCrossPostReel?: boolean // Mia/Ava — same TikTok slideshow also posts to IG as Reel
  storyArcId?: string
  higgsfieldJobId?: string
  generatedAt?: string
  affiliateLink?: string
  productName?: string
}

export type CreatorMeta = {
  handle: string
  instagramUrl: string
  city: string
  country: string
  niche: string
  color: string
  soulId: string
  voiceId: string
  referenceElementId: string
  anchorImageUrl: string
  faceVibe: string
  bio: string
  backstory: string
  bodyType: string
  identityLock: string
  personality: string
  carModel: string
  carColor: string
  carPlate: string
  carDescription: string
  // Locked brand vocabulary — 2026-07-04 constitution rules
  phone: string          // e.g. "Pink iPhone 17 Pro Max"
  coffeeShops: string[]  // rotation of chains for this creator
  salons: string[]       // hair / nails / skin salons
  waterBottle: string    // Stanley / Hydro Flask / Owala / etc
  kitchenBrands: string  // "Wolf range + SMEG pink kettle + Nespresso"
  restaurants: string[]  // locked luxury dinner spots
  fitnessStudios: string[] // Cult.fit / Barry's / SoulCycle
  retailStores: string[]  // shopping content locations
  fashionStyle: string
  fashionBrands: string[]
  signatureLooks: string[]
  tiktokHandle?: string
  tiktokUrl?: string
  tiktokAvailable: boolean
  pinterestHandle?: string
  pinterestUrl?: string
  pinterestAvailable: boolean
}

export const CREATOR_META: Record<Creator, CreatorMeta> = {
  Siya: {
    handle: '@_siyasharmaofficial',
    instagramUrl: 'https://www.instagram.com/_siyasharmaofficial/',
    city: 'Bangalore',
    country: 'India',
    niche: 'Beauty + Fashion',
    color: '#ec9dc0',
    soulId: '69db0f1c-ca4d-4238-aa59-9a23bfefb06d',
    voiceId: '7791a070-fef3-4e07-97e5-ad27346fb3ab',
    referenceElementId: '659002e5-2a38-4295-bb29-2161c98a058d',
    anchorImageUrl: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FiKc7FGFLQSD8kKOBv1iVfxF8A/159fdac7-706a-4bcd-a86a-0dac6db0430a.png',
    faceVibe: 'Kiara-Advani-soft — full youthful cheeks, doll-like almond eyes, fair glowing dewy skin',
    bio: 'Beauty obsessed. Fashion forward. ✨\nBangalore · 9–5 + golden hour OOTDs\n🛒 Everything I wear daily ↓',
    backstory: 'Bangalore-based working professional. Sweet-sexy Indian girl-next-door energy. Corporate marketing girlie by day, soft glam ritualist by night. College friends with Kiara, Mia, and Ava — met at Yale.',
    bodyType: 'Slim athletic lean, natural small-to-medium bust, modest fit',
    identityLock: 'Tiny mole on right cheekbone',
    personality: 'Sweet, warm, softly confident, aspirational-but-relatable. Loves cafés, skincare, slow mornings.',
    carModel: 'Hyundai Creta 2026',
    carColor: 'Phantom Black',
    carPlate: 'KA 01 SS 2026',
    carDescription: 'Sleek black Hyundai Creta 2026 SUV with chrome grille, tinted windows, Karnataka registration plate "KA 01 SS 2026", parked outside Bangalore cafés or her home garage. Face lock the car — same plate always.',
    phone: 'Samsung Galaxy Z Fold 7 in Phantom Black (foldable form factor — distinctive on purpose, she is the tech-forward Indian professional)',
    coffeeShops: ['Blue Tokai Coffee Roasters Bangalore', 'Third Wave Coffee Bangalore', 'home Nespresso setup'],
    salons: ['Enrich Salon Bangalore (hair)', 'Toni & Guy Bangalore (color)', 'Nykaa nail bar (nails)', 'Kaya Skin Clinic Indiranagar (skin)'],
    waterBottle: 'copper Ayurvedic bottle at home + YETI Rambler cream stainless steel when out',
    kitchenBrands: 'traditional gas stove + Prestige electric kettle + Bialetti moka pot + Kalsi filter coffee maker + Sujata mixer grinder',
    restaurants: ['Toit Whitefield', 'Truffles Koramangala', 'Sanchez Kitchen', 'The Fatty Bao', 'Copper + Cloves'],
    fitnessStudios: ['Cult.fit Indiranagar', 'SARVA Yoga Bangalore'],
    retailStores: ['Anokhi Bangalore', 'Nykaa Luxe MG Road', 'Sabyasachi Bangalore', 'Charlotte Tilbury counter Nykaa Luxe'],
    fashionStyle: 'Modern Indian sweet-feminine — Sabyasachi meets Anokhi. Silk kurtis, cotton kurta sets, printed midi dresses, banarasi silk saris for occasions, kolhapuri chappals, jhumkas + delicate gold chain. Beauty content in cream silk robes, luxury vanity setups. Indian modern-professional workwear = kurti + palazzo.',
    fashionBrands: ['Anokhi', 'Fabindia', 'Sabyasachi', 'Payal Singhal', 'Ritu Kumar', 'Nappa Dori', 'Amrapali', 'Charlotte Tilbury', 'Tatcha', 'Drunk Elephant'],
    signatureLooks: [
      'Cream/peach silk kurta + gold jhumkas + kolhapuri chappals (café day)',
      'Printed cotton kurti + palazzo + delicate gold chain (office/desk work)',
      'Banarasi silk sari + red bindi + gold jewelry (family lunch / occasion)',
      'Cream silk robe + jade roller (skincare content)',
      'Blush pink midi dress + Amrapali jhumkas (date night)',
      'Ivory anarkali + kolhapuri wedges (Sunday brunch)'
    ],
    tiktokAvailable: false,
    pinterestHandle: '__PLACEHOLDER__',
    pinterestUrl: '__PLACEHOLDER__',
    pinterestAvailable: true
  },
  Kiara: {
    handle: '@kiararai_fit',
    instagramUrl: 'https://www.instagram.com/kiararai_fit/',
    city: 'Mumbai',
    country: 'India',
    niche: 'Fitness + Beauty + Fashion',
    color: '#e11d48',
    soulId: '1e9f2dc4-1196-4778-83e3-5155b2fa432a',
    voiceId: '967c5bb0-bdfe-4c8d-b7e6-c0fe82f39f44',
    referenceElementId: '62e48caf-931d-45a0-a2a7-b4a57c63ba0b',
    anchorImageUrl: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FiKc7FGFLQSD8kKOBv1iVfxF8A/0f1e42e6-b778-4fba-bed5-579a56618e00.png',
    faceVibe: 'Punjabi oval — sharp jawline, high cheekbones, bold thick brows, warm hazel-brown eyes',
    bio: 'Gym girl with a glam side 💪💄\nPunjab di kudi in Mumbai | fit · pretty · stylish\n🛒 My daily edit ↓',
    backstory: 'Punjab-origin, Mumbai-based working professional. Modern fit-girl bombshell energy. 9-5 grind + 6am gym + all the glam. College friends with Siya, Mia, and Ava. Owner of Blinki (Beagle 🐶).',
    bodyType: 'Athletic hourglass, toned abs, sculpted shoulders, natural confident bust',
    identityLock: 'Tiny mole above right upper lip',
    personality: 'Bold, confident, motivational, Punjabi sass with Mumbai polish. Cult.fit daily, tea gang, protein shakes.',
    carModel: 'Mini Cooper Countryman',
    carColor: 'British Racing Green',
    carPlate: 'MH 04 KR 2024',
    carDescription: 'British racing green Mini Cooper Countryman with white roof + white bonnet stripes, JCW styling, black alloys, Maharashtra plate "MH 04 KR 2024". Bandra Mumbai apartment garage or Cult.fit parking. Face lock the exact car — same plate always.',
    phone: 'Black iPhone 17 Pro Max in Space Titanium',
    coffeeShops: ['Blue Tokai Coffee Roasters Bandra', 'Starbucks Bandra Palladium', 'Third Wave Coffee Bandra'],
    salons: ['Looks Salon Bandra (hair)', 'BBLUNT Bandra (color)', 'Nail Spa Mumbai Bandra', 'Kaya Skin Clinic Bandra'],
    waterBottle: 'Owala FreeSip in black for daily, Stanley Quencher for gym',
    kitchenBrands: 'Kaff 4-burner gas hob + SMEG mint green kettle + Nespresso Vertuo Plus + Bosch dishwasher + KitchenAid stand mixer cream',
    restaurants: ['Bastian Bandra', 'Papas Bandra', 'The Table Colaba', 'Foxglove Bandra', 'Ekaa Fort'],
    fitnessStudios: ['Cult.fit Bandra (primary)', 'F45 Bandra', 'The Yoga Institute Santa Cruz'],
    retailStores: ['Nykaa Luxe Bandra', 'Sabyasachi flagship Kala Ghoda', 'Cult.fit shop Bandra', 'Zara Palladium', 'Manish Malhotra store Kemps Corner'],
    fashionStyle: 'Fitness-forward bombshell — Cult.fit gym gear for 60% of posts + Bandra-cool bombshell fashion off-gym. Gym wardrobe = deep-V sports bras, high-waist compression leggings, cropped hoodies. Off-gym = deep-V black silk slip dresses, satin bodycon, cream co-ord lounge sets. Punjabi elegance for family posts.',
    fashionBrands: ['Cultsport', 'Nike', 'Lululemon', 'Alo Yoga', 'Gymshark', 'Zara', 'H&M Studio', 'Sabyasachi (occasion)', 'Manish Malhotra (occasion)'],
    signatureLooks: [
      'Deep-V black Cultsport sports bra + high-waist compression leggings + sneakers (gym daily)',
      'Cropped Nike hoodie + bike shorts + Air Max sneakers (post-gym café)',
      'Deep-V black silk slip camisole + cream satin joggers (Mumbai balcony)',
      'Deep-V black satin bodycon mini + gold body chain + heels (rooftop night)',
      'Punjabi salwar-kameez + jhumkas (family visit)',
      'Deep-V black bikini + gold body chain + sarong (Goa beach)'
    ],
    tiktokAvailable: false,
    pinterestHandle: '__PLACEHOLDER__',
    pinterestUrl: '__PLACEHOLDER__',
    pinterestAvailable: true
  },
  Mia: {
    handle: '@miafitcartel',
    instagramUrl: 'https://www.instagram.com/miafitcartel/',
    city: 'Chicago',
    country: 'USA',
    niche: 'Fitness + Healthy Living',
    color: '#0ea5e9',
    soulId: '97625973-f756-4378-83d9-2336c2d26250',
    voiceId: 'preset-quinn-pending-clone',
    referenceElementId: '347b753b-1408-4c5b-b8f6-8dbde82be595',
    anchorImageUrl: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FiKc7FGFLQSD8kKOBv1iVfxF8A/02787ab7-af8e-454d-9929-de84022649c6.png',
    faceVibe: 'Sun-kissed California blonde bombshell — sculpted jaw, blue-green eyes, peachy skin with light sun freckles',
    bio: 'Chicago fit girl 💪\nWorkouts · clean eats · real routines\n🛒 Shop my fit stack ↓',
    backstory: 'Chicago-based fitness pro. Sun-kissed blonde bombshell energy. 5am Lake Michigan runs + clean eating + strength training. College friends with Siya, Kiara, and Ava — Yale athletics track team.',
    bodyType: 'Fit athletic toned bombshell, defined abs, sculpted shoulders, natural confident bust',
    identityLock: 'Tiny mole on right side of neck (not face)',
    personality: 'Bold, hyped, no-BS energy. Motivational coach vibes. Believes in real routines, not shortcuts.',
    carModel: 'Hummer EV SUV',
    carColor: 'Interstellar Black',
    carPlate: 'IL MCARTER',
    carDescription: 'Massive black Hummer EV SUV (matte black finish), aggressive aftermarket wheels, blackout windows, Illinois vanity plate "MCARTER". Parked at Chicago high-rise gym garage or her West Loop building. Face lock — same plate always.',
    phone: 'Silver iPhone 17 Pro Max in Natural Titanium',
    coffeeShops: ['Starbucks Reserve Chicago Roastery Michigan Ave', 'Tim Hortons downtown Chicago', 'Blue Bottle Coffee River North (occasional editorial)'],
    salons: ['Drybar Chicago (blowouts)', 'Maxine Salon Gold Coast (hair color)', 'Paintbox Chicago (nails)', 'Olive & June (at-home mani)', 'Skin Laundry Chicago'],
    waterBottle: 'Stanley Quencher stainless steel in cream',
    kitchenBrands: 'Wolf 4-burner range + SMEG mint green kettle + Nespresso Vertuo Plus + KitchenAid stand mixer cream + Miele dishwasher',
    restaurants: ['Alinea (special)', 'Beatnik on the River', 'Elske', 'Kasama', 'Le Sud', 'Somerset Lincoln Park'],
    fitnessStudios: ['Barrys Bootcamp Chicago West Loop', 'Solidcore Chicago', 'SoulCycle Chicago', 'Alo Yoga Chicago'],
    retailStores: ['Nordstrom Michigan Ave', 'Alo Yoga Chicago', 'Lululemon flagship Michigan Ave', 'Sephora State Street', 'Bloomingdales Michigan Ave'],
    fashionStyle: 'Athletic bombshell — 80% fitness gear (matching seamless sets, deep-V sports bras). Off-gym = lounge sets, slip dresses for date nights, denim for casual. Bright pops (neon green, coral) mixed with cream/white base.',
    fashionBrands: ['Lululemon', 'Nike', 'Alo Yoga', 'Bandier', 'Vuori', 'Gymshark', 'Skims', 'Free People (casual)', 'Reformation (date night)'],
    signatureLooks: [
      'Deep-V neon-green Nike Dri-Fit sports bra + high-waist white bike shorts + white Vaporfly sneakers (Lake Michigan run)',
      'Alo Yoga matching seamless set (deep-V sports bra + leggings) + Blake gym partner (indoor gym)',
      'Deep-V white ribbed sports bra + Chicago Bears cap + bike shorts (post-workout casual)',
      'Deep-V cream lounge set + Ugg slippers + coffee (Sunday chill)',
      'Deep-V black satin slip dress + heels + Blake (Chicago date night)',
      'Deep-V neon-green triangle bikini + gold body chain + sarong (Miami beach)'
    ],
    tiktokHandle: '@miafitcartel',
    tiktokUrl: 'https://www.tiktok.com/@miafitcartel',
    tiktokAvailable: true,
    pinterestHandle: '__PLACEHOLDER__',
    pinterestUrl: '__PLACEHOLDER__',
    pinterestAvailable: true
  },
  Ava: {
    handle: '@ava.fabfashion',
    instagramUrl: 'https://www.instagram.com/ava.fabfashion/',
    city: 'NYC',
    country: 'USA',
    niche: 'Fashion + Beauty + Lifestyle',
    color: '#a855f7',
    soulId: '4e3cc9d3-4b86-4fc6-9b38-f4186fed4d7f',
    voiceId: 'preset-sloane-pending-clone',
    referenceElementId: 'bf46fc65-6637-4898-b5ac-99e10b772aca',
    anchorImageUrl: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3FiKc7FGFLQSD8kKOBv1iVfxF8A/00c17498-e5f7-4d65-b2a6-e75460e9cf88.png',
    faceVibe: 'LA-blonde editorial bombshell — soft heart-shaped face, hazel-blue eyes, pillowy plump lips, dewy porcelain skin',
    bio: 'Fashion first · NYC 🗽\nEditor\'s eye, everyday-girl taste\n🛒 Shop my closet ↓',
    backstory: 'NYC-based fashion + beauty influencer. Editorial bombshell energy. Silk, satin, Sixth Avenue. Fashion Week regular. College friends with Siya, Kiara, and Mia. Owner of Marshall (Golden Retriever 🐕).',
    bodyType: 'Slim elegant feminine soft curves, natural confident bust, soft snatched waist — NOT extreme fit',
    identityLock: 'Tiny mole on left collarbone (not face)',
    personality: 'Bold, sultry, sophisticated. Editorial calm. Loves Marshall, luxury shopping, rooftop cocktails.',
    carModel: 'Ferrari 488 GTB',
    carColor: 'Rosa Corsa (custom pink)',
    carPlate: 'AVA MNR',
    carDescription: 'Custom Rosa Corsa pink Ferrari 488 GTB with beige leather interior + Ferrari yellow calipers, NY vanity plate "AVA MNR". Parked outside NYC luxury apartments, Hamptons driveway, or valet at Cipriani. Face lock — same plate always.',
    phone: 'Pink iPhone 17 Pro Max in Rose Titanium (custom pink metallic finish)',
    coffeeShops: ['Starbucks Reserve Roastery NYC Chelsea', 'Tim Hortons Midtown', 'Blue Bottle Coffee NoMad (editorial)'],
    salons: ['Rita Hazan (color)', 'Ted Gibson (styling)', 'Paintbox NYC (nails)', 'Chillhouse Nolita', 'Skin Laundry NYC', 'Dr. Barbara Sturm Bar Madison Ave'],
    waterBottle: 'Hydro Flask matte pink 32oz for daily, Owala FreeSip for Barrys Bootcamp',
    kitchenBrands: 'Wolf 6-burner range + SMEG pastel pink electric kettle + Nespresso Vertuo Next + Sub-Zero built-in fridge + KitchenAid stand mixer pastel pink',
    restaurants: ['Cipriani Downtown', 'The Living Room by Cipriani', 'Zuma Madison Ave', 'Bar Pitti', 'Sant Ambroeus', 'Sushi Nakazawa', 'Balthazar SoHo'],
    fitnessStudios: ['Barrys Bootcamp NYC Meatpacking', 'SoulCycle NoHo', 'Y7 Yoga Nolita', 'Rumble Boxing'],
    retailStores: ['Bergdorf Goodman', 'The Row store SoHo', 'Chanel Madison Ave', 'Hermes Madison Ave', 'Balmain 20 Rue Saint-Honore (when Paris)'],
    fashionStyle: 'Quiet-luxury editorial bombshell — silk slips, tailored blazers, designer bags, Louboutin heels, cashmere sweaters. Fashion Week backstage energy. Old-money-meets-new-money NYC. Everyday luxury: Loro Piana + The Row + Hermès rotation. Occasion: Chanel, Balmain, Bottega. Never fast-fashion.',
    fashionBrands: ['Chanel', 'Hermès', 'The Row', 'Loro Piana', 'Balmain', 'Bottega Veneta', 'Christian Louboutin', 'Celine', 'Prada', 'Cartier', 'Van Cleef & Arpels'],
    signatureLooks: [
      'Deep-V black silk halter Balmain bodysuit + Loro Piana wide-leg cream trousers + Louboutin So Kate heels (dinner)',
      'Deep-V cream silk slip camisole + Chanel classic flap + Cartier love bracelet (NYC morning)',
      'The Row oversized camel wool trench + fitted deep-V black cashmere + Celine Triomphe bag (Central Park with Marshall)',
      'Deep-V black satin slip Balmain mini dress + Louboutin So Kate + Prada clutch (Cipriani date)',
      'Deep-V nude silk crochet bikini + gold body chain + Chanel straw hat (Hamptons pool)',
      'Deep-V black silk sequin Balmain bodycon + Bottega heels (Dubai Zuma)'
    ],
    tiktokHandle: '@ava.fabfashion',
    tiktokUrl: 'https://www.tiktok.com/@ava.fabfashion',
    tiktokAvailable: true,
    pinterestHandle: '__PLACEHOLDER__',
    pinterestUrl: '__PLACEHOLDER__',
    pinterestAvailable: true
  }
}
