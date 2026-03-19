export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export type PageDescriptor = {
  nodeId: string
  frameName: string
  routePath: string
  componentName: string
}

export type NavItem = {
  key: string
  label: string
  icon?: string
  routePath: string
}

export type FilterState = {
  keyword: string
  platform: string
  sort: string
  tab: string
  page: number
  pageSize: number
}

export type CreatorReviewRow = {
  id: string
  userName: string
  userAvatar: string
  phone: string
  platform: string
  accountId: string
  accountNickname: string
  proofImage: string
  submittedAt: string
  status: ReviewStatus
  rejectReason?: string
  actions: string[]
}


export type StatusStyleMap = Record<
  ReviewStatus,
  { color: string; bg: string; border: string; text: string }
>
