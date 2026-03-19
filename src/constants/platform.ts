export const platformLogoMap = {
  小红书: 'https://cdn.simpleicons.org/xiaohongshu/E60012',
  抖音: 'https://cdn.simpleicons.org/tiktok/111111',
  哔哩哔哩: 'https://cdn.simpleicons.org/bilibili/00A1D6',
} as const

export type SupportedPlatform = keyof typeof platformLogoMap

export const supportedPlatforms: SupportedPlatform[] = ['小红书', '抖音', '哔哩哔哩']
