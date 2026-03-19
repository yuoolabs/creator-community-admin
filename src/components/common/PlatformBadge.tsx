import { platformLogoMap, type SupportedPlatform } from '../../constants/platform'
import { Tooltip } from 'antd'

type PlatformBadgeProps = {
  platform: string
  compact?: boolean
  verified?: boolean
}

export default function PlatformBadge({ platform, compact = false, verified = true }: PlatformBadgeProps) {
  const logo = platformLogoMap[platform as SupportedPlatform]

  return (
    <Tooltip title={verified ? '' : '未认证'}>
      <span className={`platform-pill ${compact ? 'platform-pill-compact' : ''} ${!verified ? 'platform-pill-unverified' : ''}`}>
        {logo ? <img className="platform-logo" src={logo} alt={`${platform} 官方logo`} /> : null}
        <span>{platform}</span>
      </span>
    </Tooltip>
  )
}

