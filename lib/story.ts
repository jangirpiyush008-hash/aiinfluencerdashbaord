import { Creator } from './types'

export type StoryArc = {
  id: string
  title: string
  dateRange: string
  emoji: string
  color: string
  description: string
  creators: Creator[]
  keyMoments: string[]
}

export type Character = {
  name: string
  role: string
  age: number
  vibe: string
  soulIdStatus: 'trained' | 'pending' | 'concept'
  soulId?: string
  faceDescription: string
}

export type CreatorCast = {
  creator: Creator
  boyfriend: Character
  family: Character[]
  pet?: Character
  locations: string[]
}

export const STORY_ARCS: StoryArc[] = [
  {
    id: 'establish',
    title: 'Establishing the Squad',
    dateRange: 'Jul 2 – Jul 8',
    emoji: '🌸',
    color: '#a855f7',
    description: 'Each creator introduces her world. Bangalore mornings, Mumbai gym life, Chicago sunrise runs, NYC editorial energy. Audience learns their vibe, aesthetic, and daily rhythm.',
    creators: ['Siya', 'Kiara', 'Mia', 'Ava'],
    keyMoments: [
      'Kiara reveals her Blinki (Beagle) on Jul 5',
      'Ava reveals Marshall (Golden Retriever) on Jul 10',
      'First hints at friendship in group chat teasers'
    ]
  },
  {
    id: 'deepen',
    title: 'Deepening the World + Family Cameos',
    dateRange: 'Jul 9 – Jul 15',
    emoji: '💕',
    color: '#ec9dc0',
    description: 'Family posts drop — Siya with mom, Kiara with brother, Mia with dad, Ava with sister. Boyfriend cameos start subtly (Kiara + Rohan; Mia + Blake). Packing for Dubai teasers begin.',
    creators: ['Siya', 'Kiara', 'Mia', 'Ava'],
    keyMoments: [
      'Family visit posts (Sat–Sun Jul 12–13)',
      'Boyfriend soft-launch posts',
      'Dubai trip announcement teasers'
    ]
  },
  {
    id: 'dubai',
    title: 'DUBAI 🌴 The Reunion',
    dateRange: 'Jul 16 – Jul 22',
    emoji: '🌴',
    color: '#f97316',
    description: 'All 4 girls reunite in Dubai. Nobu brunch, desert safari, yacht party at Palm Jumeirah, White Dubai club night. Bikini shots, luxury hotel rooms, bombshell energy. Peak viral content.',
    creators: ['Siya', 'Kiara', 'Mia', 'Ava'],
    keyMoments: [
      'Nobu Dubai group reveal (Jul 17)',
      'Yacht party viral moment (Jul 19)',
      'Club night White Dubai (Jul 20)',
      'Emotional airport goodbye (Jul 21)'
    ]
  },
  {
    id: 'goa-hamptons',
    title: 'Goa + The Hamptons + Miami',
    dateRange: 'Jul 23 – Jul 27',
    emoji: '🏖️',
    color: '#0ea5e9',
    description: 'Post-Dubai, the girls hit their OWN beaches: Kiara → Goa with boyfriend, Ava → The Hamptons, Mia → Miami. Bikini content, cocktail sunsets, dogs on beach. Some pair up (Kiara + boyfriend, Ava with Marshall).',
    creators: ['Kiara', 'Mia', 'Ava'],
    keyMoments: [
      'Kiara Goa trip with Rohan',
      'Ava Hamptons weekend',
      'Mia Miami weekend',
      'Blinki debut at Goa beach'
    ]
  },
  {
    id: 'return',
    title: 'Back to Reality + Product Season',
    dateRange: 'Jul 28 – Jul 29',
    emoji: '🛍️',
    color: '#10b981',
    description: 'Girls return to daily life. First affiliate product drops. Kiara Dymatize video, Mia protein program launch, Siya beauty review, Ava luxury unboxing.',
    creators: ['Siya', 'Kiara', 'Mia', 'Ava'],
    keyMoments: [
      'Mia launches 30-day summer body program',
      'Kiara Dymatize collab',
      'Ava fashion event red carpet',
      'August planning teaser (Aug preview)'
    ]
  }
]

export const CREATOR_CAST: Record<Creator, CreatorCast> = {
  Siya: {
    creator: 'Siya',
    boyfriend: {
      name: 'Aryan Kapoor',
      role: 'Boyfriend',
      age: 28,
      vibe: 'Bangalore product manager, soft masc, laid-back charm, chai + startup guy',
      soulIdStatus: 'concept',
      faceDescription: 'Fair Indian, ~6ft, wavy dark brown hair, clean shave, warm brown eyes, soft jawline. Wears linen shirts + jeans + Airpods. Chill startup founder energy.'
    },
    family: [
      { name: 'Meera Sharma', role: 'Mom', age: 52, vibe: 'Warm Karnataka woman, saree lover, doctor', soulIdStatus: 'concept', faceDescription: 'Fair Indian woman, ~5\'3, salt-pepper wavy hair, warm sultry brown eyes like Siya, gold Karnataka jewelry, mature soft glam.' },
      { name: 'Rajeev Sharma', role: 'Dad', age: 56, vibe: 'Retired engineer, cricket fan, tech-forward', soulIdStatus: 'concept', faceDescription: 'Fair Indian man, ~5\'8, salt-pepper hair, glasses, kind smile, polo + slacks.' },
      { name: 'Aditya Sharma', role: 'Brother (older)', age: 30, vibe: 'Software engineer in Bengaluru, laid-back', soulIdStatus: 'concept', faceDescription: 'Fair Indian man, ~6ft, short black hair, trimmed beard, glasses, athletic build.' },
      { name: 'Riya Sharma', role: 'Sister (younger)', age: 22, vibe: 'College student in Delhi', soulIdStatus: 'concept', faceDescription: 'Fair Indian woman, ~5\'4, long straight black hair, similar face to Siya, playful modern Gen-Z style.' }
    ],
    locations: ['Bangalore home', 'Koramangala café', 'Ranga Shankara theatre', 'Nandi Hills', 'Goa weekend']
  },
  Kiara: {
    creator: 'Kiara',
    boyfriend: {
      name: 'Rohan Malhotra',
      role: 'Boyfriend',
      age: 30,
      vibe: 'Mumbai finance guy, gym partner, Punjabi origin, cars + protein',
      soulIdStatus: 'concept',
      faceDescription: 'Fair Punjabi Indian, ~6\'1, thick dark hair with slight wave, trimmed beard, muscular build with visible chest under fitted tees, bold jawline, confident swagger. Wears designer fitted tees + jeans.'
    },
    family: [
      { name: 'Simran Rai', role: 'Mom', age: 54, vibe: 'Punjabi mom, energetic, kitchen queen, always feeding you', soulIdStatus: 'concept', faceDescription: 'Fair Punjabi woman, ~5\'5, dyed dark brown wavy hair, gold jewelry, elegant salwar-kameez, warm confident.' },
      { name: 'Harjeet Rai', role: 'Dad', age: 58, vibe: 'Punjab businessman, whisky guy, big personality', soulIdStatus: 'concept', faceDescription: 'Fair Punjabi man, ~5\'11, salt-pepper hair, groomed beard, polo shirts, gold watch.' },
      { name: 'Arjun Rai', role: 'Brother (younger)', age: 26, vibe: 'Studying in Canada, party boy', soulIdStatus: 'concept', faceDescription: 'Fair Punjabi man, ~6ft, short fade cut, trimmed beard, gym-fit build, streetwear.' }
    ],
    pet: { name: 'Blinki', role: 'Beagle 🐕', age: 3, vibe: 'Cheerful, floppy ears, pink collar', soulIdStatus: 'pending', faceDescription: 'Tri-color beagle (white/brown/black), pink leather collar with silver tag, playful open-mouth pant.' },
    locations: ['Bandra Mumbai apartment', 'Cult.fit Bandra', 'Bandra café strips', 'Powai lake trails', 'Goa beach getaway', 'Punjab family home']
  },
  Mia: {
    creator: 'Mia',
    boyfriend: {
      name: 'Blake Anderson',
      role: 'Boyfriend',
      age: 29,
      vibe: 'Chicago Bears fan, gym partner, personal trainer, soft masc golden retriever energy',
      soulIdStatus: 'concept',
      faceDescription: 'American white man, ~6\'2, sandy blonde short hair, clean shave, strong jawline, bright blue eyes, athletic build with defined chest under fitted tees. Wears Nike/Under Armour athleisure.'
    },
    family: [
      { name: 'Karen Carter', role: 'Mom', age: 56, vibe: 'Midwestern warm mom, hostess with the mostess, gardener', soulIdStatus: 'concept', faceDescription: 'American woman, ~5\'6, blonde shoulder-length bob, glasses, warm blue-green eyes, floral blouses.' },
      { name: 'Tom Carter', role: 'Dad', age: 60, vibe: 'Retired engineer, grill master, Cubs fan', soulIdStatus: 'concept', faceDescription: 'American man, ~5\'11, grey short hair, glasses, polo shirts, warm dad energy.' },
      { name: 'Grace Carter', role: 'Sister (younger)', age: 25, vibe: 'Nashville PR girlie, country-chic', soulIdStatus: 'concept', faceDescription: 'American woman, ~5\'7, honey blonde long hair, similar face to Mia, boho fits.' },
      { name: 'Tyler Carter', role: 'Brother (older)', age: 32, vibe: 'Married with kid, dad-mode', soulIdStatus: 'concept', faceDescription: 'American man, ~6ft, brown short hair, groomed beard, casual polos, dad build.' }
    ],
    locations: ['Chicago West Loop apartment', 'Lake Michigan lakeshore', 'Chicago high-rise gym', 'Wicker Park cafés', 'Miami South Beach', 'Suburban Chicago family home']
  },
  Ava: {
    creator: 'Ava',
    boyfriend: {
      name: 'Marcus Reyes',
      role: 'Boyfriend',
      age: 31,
      vibe: 'NYC investment banker, Wall Street polish, luxury tastes, Latin American',
      soulIdStatus: 'concept',
      faceDescription: 'Mixed Latino-American man, ~6\'1, dark brown short hair (slight fade), trimmed stubble, hazel eyes, sharp jawline, athletic build in tailored suits. Wears Loro Piana + Rolex + designer sneakers on weekends.'
    },
    family: [
      { name: 'Elena Monroe', role: 'Mom', age: 55, vibe: 'Manhattan lifestyle mother, art curator, silk-scarf tier', soulIdStatus: 'concept', faceDescription: 'American woman, ~5\'7, platinum blonde chic bob, blue eyes, cashmere sweaters, gold jewelry, editorial mom.' },
      { name: 'Richard Monroe', role: 'Dad', age: 60, vibe: 'Retired lawyer, sailing club, old-money vibes', soulIdStatus: 'concept', faceDescription: 'American man, ~6ft, silver hair, blue eyes, blazer + polo, easy Hamptons energy.' },
      { name: 'Chloe Monroe', role: 'Sister (younger)', age: 24, vibe: 'Barnard senior, cool girl fashion, artier version of Ava', soulIdStatus: 'concept', faceDescription: 'American woman, ~5\'8, dark brown hair (contrast to Ava), similar sharp features, downtown edgy.' }
    ],
    pet: { name: 'Marshall', role: 'Golden Retriever 🐕', age: 3, vibe: 'Sweet gentle boy, blue collar, tongue always out', soulIdStatus: 'pending', faceDescription: 'Purebred Golden Retriever, honey-gold coat, warm brown eyes, blue leather collar with gold tag.' },
    locations: ['NYC UES apartment', 'Central Park', 'Soho + Meatpacking', 'The Hamptons summer', 'Miami escapes', 'Fashion Week venues']
  }
}
