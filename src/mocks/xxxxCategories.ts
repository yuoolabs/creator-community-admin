export type XxxxCategoryItem = {
  id: string
  name: string
  count: number
  status: boolean
  createdAt: string
  isMovable: boolean
}

const STORAGE_KEY = 'creator-community-admin:xxxx-categories'

export const defaultXxxxCategories: XxxxCategoryItem[] = [
  { id: '3', name: '美妆分类', count: 8, status: true, createdAt: '2025-05-13 14:54:40', isMovable: true },
  { id: '4', name: '户外运动', count: 7, status: true, createdAt: '2025-05-13 14:55:39', isMovable: true },
  { id: '5', name: '美食Share', count: 4, status: true, createdAt: '2025-05-13 15:17:29', isMovable: true },
  { id: '6', name: 'PLAZA', count: 1, status: true, createdAt: '2025-05-14 11:32:37', isMovable: true },
]

export function loadXxxxCategories(): XxxxCategoryItem[] {
  if (typeof window === 'undefined') return defaultXxxxCategories

  const raw = window.localStorage.getItem(STORAGE_KEY)
  if (!raw) return defaultXxxxCategories

  try {
    const parsed = JSON.parse(raw) as XxxxCategoryItem[]
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultXxxxCategories
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
