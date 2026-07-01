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
}

export const CREATOR_META: Record<Creator, {
  handle: string
  city: string
  niche: string
  color: string
  soulId: string
}> = {
  Siya: {
    handle: '@_siyasharmaofficial',
    city: 'Bangalore, India',
    niche: 'Beauty + Fashion',
    color: '#ec9dc0',
    soulId: '69db0f1c-ca4d-4238-aa59-9a23bfefb06d'
  },
  Kiara: {
    handle: '@kiararai_fit',
    city: 'Mumbai, India',
    niche: 'Fitness + Beauty + Fashion',
    color: '#e11d48',
    soulId: '1e9f2dc4-1196-4778-83e3-5155b2fa432a'
  },
  Mia: {
    handle: '@miafitcartel',
    city: 'Chicago, USA',
    niche: 'Fitness + Healthy Living',
    color: '#0ea5e9',
    soulId: '97625973-f756-4378-83d9-2336c2d26250'
  },
  Ava: {
    handle: '@ava.fabfashion',
    city: 'NYC, USA',
    niche: 'Fashion + Beauty + Lifestyle',
    color: '#a855f7',
    soulId: '4e3cc9d3-4b86-4fc6-9b38-f4186fed4d7f'
  }
}
