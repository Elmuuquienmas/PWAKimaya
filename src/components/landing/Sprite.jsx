export function Sprite({ src, frames, scale = 3, duration = 0.8, flip = false, className = '' }) {
  return (
    <div
      className={`sprite ${className}`}
      style={{
        backgroundImage: `url(${src})`,
        '--frames': frames,
        '--s': scale,
        '--dur': `${duration}s`,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    />
  )
}
