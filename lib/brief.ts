import type { Creator } from './types'

export type VideoBrief = {
  id: string
  createdAt: string
  creator: Creator | ''
  // Product
  productName: string
  productBrand: string
  productCategory: string
  productPhotoUrls: string[]
  keyFeatures: string
  // References
  referenceVideoUrls: string[]
  whatYouLike: string
  // Story integration
  storyArcId: string
  productInDailyLife: string // how does product fit into their daily story
  linkedStoryDate: string // ISO date — story that ties into this affiliate video
  linkedStoryConcept: string
  // Video specs
  duration: '5s' | '10s' | '15s' | '30s' | ''
  aspectRatio: '9:16' | '1:1' | '4:5' | ''
  shots: 'single' | '3-shot' | '6-shot cinematic' | ''
  // Scene
  setting: string
  wardrobe: string
  vibe: string
  faceLockMode: 'trained Soul ID' | 'Nano Banana Pro + Reference Element' | ''
  // Distribution
  affiliateUrl: string
  discountCode: string
  platforms: string[] // ['Instagram Reel', 'TikTok', 'Pinterest', 'Story']
  captionHook: string
}

export const EMPTY_BRIEF: VideoBrief = {
  id: '',
  createdAt: '',
  creator: '',
  productName: '',
  productBrand: '',
  productCategory: '',
  productPhotoUrls: [],
  keyFeatures: '',
  referenceVideoUrls: [],
  whatYouLike: '',
  storyArcId: '',
  productInDailyLife: '',
  linkedStoryDate: '',
  linkedStoryConcept: '',
  duration: '',
  aspectRatio: '',
  shots: '',
  setting: '',
  wardrobe: '',
  vibe: '',
  faceLockMode: 'trained Soul ID',
  affiliateUrl: '',
  discountCode: '',
  platforms: [],
  captionHook: '',
}

// Encode brief to URL-safe base64 for shareable URL
export function encodeBrief(brief: VideoBrief): string {
  const json = JSON.stringify(brief)
  const b64 = typeof window !== 'undefined'
    ? btoa(unescape(encodeURIComponent(json)))
    : Buffer.from(json, 'utf-8').toString('base64')
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function decodeBrief(encoded: string): VideoBrief | null {
  try {
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padding = '='.repeat((4 - (b64.length % 4)) % 4)
    const json = typeof window !== 'undefined'
      ? decodeURIComponent(escape(atob(b64 + padding)))
      : Buffer.from(b64 + padding, 'base64').toString('utf-8')
    return JSON.parse(json) as VideoBrief
  } catch {
    return null
  }
}
