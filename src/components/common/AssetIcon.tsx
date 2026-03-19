type AssetIconProps = {
  src: string
  alt: string
  size?: number
  width?: number
  height?: number
  className?: string
}

export default function AssetIcon({
  src,
  alt,
  size = 16,
  width,
  height,
  className,
}: AssetIconProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        width: width ?? size,
        height: height ?? size,
        display: 'block',
        objectFit: 'contain',
      }}
    />
  )
}
