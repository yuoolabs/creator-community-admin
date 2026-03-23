export type XxxxCategoryItem = {
  id: string
  name: string
  count: number
  status: boolean
  createdAt: string
  isMovable: boolean
  imageUrl?: string
}

const STORAGE_KEY = 'creator-community-admin:xxxx-categories'

export const defaultXxxxCategories: XxxxCategoryItem[] = [
  {
    id: '3',
    name: '美妆分类',
    count: 8,
    status: true,
    createdAt: '2025-05-13 14:54:40',
    isMovable: true,
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=240&h=240&fit=crop',
  },
  {
    id: '4',
    name: '户外运动',
    count: 7,
    status: true,
    createdAt: '2025-05-13 14:55:39',
    isMovable: true,
    imageUrl: 'https://images.unsplash.com/photo-1501554728187-ce583db33af7?w=240&h=240&fit=crop',
  },
  {
    id: '5',
    name: '美食Share',
    count: 4,
    status: true,
    createdAt: '2025-05-13 15:17:29',
    isMovable: true,
    imageUrl: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=240&h=240&fit=crop',
  },
  {
    id: '6',
    name: 'PLAZA',
    count: 1,
    status: true,
    createdAt: '2025-05-14 11:32:37',
    isMovable: true,
    imageUrl: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31?w=240&h=240&fit=crop',
  },
]

export function loadXxxxCategories(): XxxxCategoryItem[] {
  if (typeof window === 'undefined') return defaultXxxxCategories

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultXxxxCategories

  try {
    const parsed = JSON.parse(raw) as XxxxCategoryItem[]
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultXxxxCategories

    return parsed.map((item) => {
      const fallback = defaultXxxxCategories.find((category) => category.id === item.id || category.name === item.name)
      return {
        ...item,
        imageUrl: item.imageUrl ?? fallback?.imageUrl,
      }
    })
  } catch {
    return defaultXxxxCategories
  }
}

export function saveXxxxCategories(items: XxxxCategoryItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getVisibleXxxxOptions() {
  return loadXxxxCategories()
    .filter((item) => item.status)
    .map((item) => ({
      label: item.name,
      value: item.name,
    }))
}
