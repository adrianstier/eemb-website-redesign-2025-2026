/**
 * TopographicPattern - Subtle background pattern inspired by bathymetric/topographic maps
 * Represents both ocean depths and mountain terrain - perfect for EEMB's identity
 *
 * Use as a background element in sections or cards to add texture without overwhelming
 */

interface TopographicPatternProps {
  className?: string
  opacity?: number
  variant?: 'ocean' | 'terrain' | 'subtle'
}

export default function TopographicPattern({
  className = '',
  opacity = 0.05,
  variant = 'subtle',
}: TopographicPatternProps) {
  const colorClass =
    variant === 'ocean'
      ? 'stroke-ocean-blue'
      : variant === 'terrain'
      ? 'stroke-kelp-500'
      : 'stroke-warm-600'

  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ opacity }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={`topo-${variant}`}
          x="0"
          y="0"
          width="200"
          height="200"
          patternUnits="userSpaceOnUse"
        >
          {/* Organic contour lines that suggest depth/elevation */}
          <path
            d="M20,100 Q50,80 80,100 T140,100 T200,100"
            fill="none"
            className={colorClass}
            strokeWidth="1"
          />
          <path
            d="M0,60 Q40,40 80,60 T160,60 T200,60"
            fill="none"
            className={colorClass}
            strokeWidth="0.75"
          />
          <path
            d="M10,140 Q60,120 100,145 T180,135"
            fill="none"
            className={colorClass}
            strokeWidth="1"
          />
          <path
            d="M0,180 Q30,160 70,180 T140,175 T200,180"
            fill="none"
            className={colorClass}
            strokeWidth="0.5"
          />
          <path
            d="M30,20 Q70,10 110,25 T170,15 T200,20"
            fill="none"
            className={colorClass}
            strokeWidth="0.75"
          />
          {/* Subtle circular contours */}
          <circle
            cx="150"
            cy="50"
            r="25"
            fill="none"
            className={colorClass}
            strokeWidth="0.5"
          />
          <circle
            cx="150"
            cy="50"
            r="35"
            fill="none"
            className={colorClass}
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="150"
            r="20"
            fill="none"
            className={colorClass}
            strokeWidth="0.5"
          />
          <circle
            cx="50"
            cy="150"
            r="30"
            fill="none"
            className={colorClass}
            strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#topo-${variant})`} />
    </svg>
  )
}

/**
 * Simpler contour lines for inline decoration
 */
export function ContourLines({
  className = '',
  lines = 3,
}: {
  className?: string
  lines?: number
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-px bg-gradient-to-r from-transparent via-ocean-teal/20 to-transparent"
          style={{
            width: `${100 - i * 15}%`,
            marginLeft: `${i * 7.5}%`,
          }}
        />
      ))}
    </div>
  )
}

/**
 * Decorative kelp illustration - single strand
 */
export function KelpStrand({
  className = '',
  height = 200,
}: {
  className?: string
  height?: number
}) {
  return (
    <svg
      className={`${className}`}
      width="40"
      height={height}
      viewBox={`0 0 40 ${height}`}
      fill="none"
    >
      <path
        d={`M20,${height} Q25,${height - 40} 18,${height - 80} T22,${height - 120} T18,${height - 160} T20,0`}
        stroke="currentColor"
        strokeWidth="2"
        className="text-kelp-500/20"
        fill="none"
      />
      {/* Kelp fronds */}
      <path
        d={`M20,${height - 50} Q30,${height - 60} 35,${height - 45}`}
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-kelp-400/15"
        fill="none"
      />
      <path
        d={`M18,${height - 90} Q8,${height - 100} 5,${height - 85}`}
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-kelp-400/15"
        fill="none"
      />
      <path
        d={`M22,${height - 130} Q32,${height - 140} 36,${height - 125}`}
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-kelp-400/15"
        fill="none"
      />
    </svg>
  )
}
