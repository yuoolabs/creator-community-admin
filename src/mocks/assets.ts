const makeProofPlaceholder = (label: string, accent: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="320" height="200" viewBox="0 0 320 200">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#f8fafc"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" rx="20" fill="url(#bg)"/>
      <rect x="22" y="22" width="276" height="156" rx="16" fill="#ffffff" stroke="${accent}" stroke-width="4" stroke-dasharray="10 8"/>
      <circle cx="88" cy="86" r="28" fill="${accent}" fill-opacity="0.12"/>
      <path d="M68 92 L84 76 L97 88 L110 72 L136 98 L68 98 Z" fill="${accent}" fill-opacity="0.72"/>
      <circle cx="78" cy="76" r="7" fill="${accent}" fill-opacity="0.72"/>
      <text x="160" y="115" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="700" fill="#334155">${label}</text>
      <text x="160" y="146" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#64748b">截图占位图</text>
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`
}

export const figmaAssets = {
  adminAvatar: 'https://www.figma.com/api/mcp/asset/6b55edf4-13b9-40d6-9d7c-760624e05e94',
  proof1: makeProofPlaceholder('凭证 A', '#3b82f6'),
  proof2: makeProofPlaceholder('凭证 B', '#10b981'),
  proof3: makeProofPlaceholder('凭证 C', '#f59e0b'),
  proof4: makeProofPlaceholder('凭证 D', '#8b5cf6'),
  proof5: makeProofPlaceholder('凭证 E', '#ef4444'),
  brandIcon: 'https://www.figma.com/api/mcp/asset/9b2eac31-57fa-4b1c-9e7b-5c37aee90da6',
  creatorReviewIcon: 'https://www.figma.com/api/mcp/asset/9808246d-efa0-4c29-aced-68e551b00ba2',
  creatorDataIcon: 'https://www.figma.com/api/mcp/asset/1d8bd9f8-cc17-45c6-9205-d85628c5050e',
  campaignIcon: 'https://www.figma.com/api/mcp/asset/d4891de6-bd0a-4be0-b079-71774aff6d2b',
  workReviewIcon: 'https://www.figma.com/api/mcp/asset/49646bc8-e09d-439a-a5ea-55a20fe0200f',
  badgeIcon: 'https://www.figma.com/api/mcp/asset/74da5edf-7bb6-4122-887a-861784340b6e',
  settingIcon: 'https://www.figma.com/api/mcp/asset/3d6e3891-0411-48bf-a6de-0fc21ccbfb16',
  exitIcon: 'https://www.figma.com/api/mcp/asset/6edb3ebc-4293-4af5-9e5c-da2a57137f7a',
  xiaohongshuIcon: 'https://www.figma.com/api/mcp/asset/a9c5e8cf-8a05-463d-bcaf-ae176b43da57',
  douyinIcon: 'https://www.figma.com/api/mcp/asset/e89db465-b26c-4fd5-9b9a-1f21cb86057f',
  bilibiliIcon: 'https://www.figma.com/api/mcp/asset/8af3e2db-8f66-4fc9-994a-dc438bcd1dfd',
  searchIcon: 'https://www.figma.com/api/mcp/asset/4514026a-cdd6-490f-ac2a-bae24fc80bb7',
  noticeIcon: 'https://www.figma.com/api/mcp/asset/1c4df51d-538d-4857-a067-ac5afc661e59',
} as const
