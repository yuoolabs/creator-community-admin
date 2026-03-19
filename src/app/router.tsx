import { createBrowserRouter, Navigate } from 'react-router-dom'
import AdminLayout from '../layouts/AdminLayout'
import BadgeSystemPage from '../pages/badge-system'
import CampaignPage from '../pages/campaign'
import CampaignEditPage from '../pages/campaign/edit'
import CreatorDataPage from '../pages/creator-data'
import CreatorDetailPage from '../pages/creator-detail'
import CreatorManagementPage from '../pages/creator-management'
import CreatorReviewPage from '../pages/creator-review'
import SettingsPage from '../pages/settings'
import WorkReviewPage from '../pages/work-review'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/creator-review" replace /> },
      { path: 'creator-review', element: <CreatorReviewPage /> },
      { path: 'creator-management', element: <CreatorManagementPage /> },
      { path: 'creator-management/detail', element: <CreatorDetailPage /> },
      { path: 'creator-level', element: <CreatorDataPage /> },
      { path: 'creator-data', element: <Navigate to="/creator-level" replace /> },
      { path: 'campaign', element: <CampaignPage /> },
      { path: 'campaign/new', element: <CampaignEditPage /> },
      { path: 'campaign/edit', element: <CampaignEditPage /> },
      { path: 'work-management', element: <WorkReviewPage /> },
      { path: 'work-review', element: <Navigate to="/work-management" replace /> },
      { path: 'badge-system', element: <BadgeSystemPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
])
