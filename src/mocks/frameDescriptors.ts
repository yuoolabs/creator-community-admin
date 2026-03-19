import type { PageDescriptor } from '../types/admin'

// Derived from frame 1:2 business blocks (main navigation domains).
export const pageDescriptors: PageDescriptor[] = [
  {
    nodeId: '1:2',
    frameName: '创作者审核',
    routePath: '/creator-review',
    componentName: 'CreatorReviewPage',
  },
  {
    nodeId: '1:56',
    frameName: '创作者管理',
    routePath: '/creator-management',
    componentName: 'CreatorManagementPage',
  },
  {
    nodeId: '1:56',
    frameName: '创作者详情',
    routePath: '/creator-management/detail',
    componentName: 'CreatorDetailPage',
  },
  {
    nodeId: '1:56',
    frameName: '创作者等级',
    routePath: '/creator-level',
    componentName: 'CreatorDataPage',
  },
  {
    nodeId: '1:80',
    frameName: '活动管理',
    routePath: '/campaign',
    componentName: 'CampaignPage',
  },
  {
    nodeId: '1:82',
    frameName: '作品管理',
    routePath: '/work-management',
    componentName: 'WorkReviewPage',
  },
  {
    nodeId: '1:241',
    frameName: '勋章系统',
    routePath: '/badge-system',
    componentName: 'BadgeSystemPage',
  },
  {
    nodeId: '1:40',
    frameName: '基础设置',
    routePath: '/settings',
    componentName: 'SettingsPage',
  },
]
