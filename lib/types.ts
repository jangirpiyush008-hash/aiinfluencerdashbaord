export type Creator = 'Siya' | 'Kiara' | 'Mia' | 'Ava'
export type PostStatus = 'pending' | 'generated' | 'scheduled' | 'posted'
export type PostFormat = 'single' | 'carousel' | 'video'

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
  status: PostStatus
  isDubaiArc?: boolean
  isPetPost?: boolean
  petName?: 'Marshall' | 'Blinki'
  isProductVideo?: boolean
  videoTemplateId?: string
  isBoyfriendPost?: boolean
  isFamilyPost?: boolean
  isBeachPost?: boolean
  storyArcId?: string
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
    carDescription: 'Sleek black Hyundai Creta 2026 SUV with chrome grille, tinted windows, Karnataka registration plate "KA 01 SS 2026", parked outside Bangalore cafés or her home garage. Face lock the car — same plate always.'
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
    carDescription: 'British racing green Mini Cooper Countryman with white roof + white bonnet stripes, JCW styling, black alloys, Maharashtra plate "MH 04 KR 2024". Bandra Mumbai apartment garage or Cult.fit parking. Face lock the exact car — same plate always.'
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
    carDescription: 'Massive black Hummer EV SUV (matte black finish), aggressive aftermarket wheels, blackout windows, Illinois vanity plate "MCARTER". Parked at Chicago high-rise gym garage or her West Loop building. Face lock — same plate always.'
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
    carDescription: 'Custom Rosa Corsa pink Ferrari 488 GTB with beige leather interior + Ferrari yellow calipers, NY vanity plate "AVA MNR". Parked outside NYC luxury apartments, Hamptons driveway, or valet at Cipriani. Face lock — same plate always.'
  }
}
