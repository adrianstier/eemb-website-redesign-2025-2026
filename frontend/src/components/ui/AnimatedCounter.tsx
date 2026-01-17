'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { ANIMATION_DURATION, ANIMATION_THRESHOLDS } from '@/lib/animationTokens'

interface AnimatedCounterProps {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
  className?: string
  labelClassName?: string
  label?: string
}

export function AnimatedCounter({
  end,
  duration = ANIMATION_DURATION.COUNTER,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  labelClassName = '',
  label,
}: AnimatedCounterProps) {
  const prefersReducedMotion = useReducedMotion()
  const [count, setCount] = useState(prefersReducedMotion ? end : 0)
  const [hasAnimated, setHasAnimated] = useState(prefersReducedMotion)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element || hasAnimated || prefersReducedMotion) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)

          // If reduced motion is preferred, skip animation
          if (prefersReducedMotion) {
            setCount(end)
            observer.unobserve(element)
            return
          }

          const startTime = performance.now()
          const startValue = 0

          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime
            const progress = Math.min(elapsed / duration, 1)

            // Ease out cubic for smooth deceleration
            const easeOut = 1 - Math.pow(1 - progress, 3)
            const currentValue = startValue + (end - startValue) * easeOut

            setCount(currentValue)

            if (progress < 1) {
              requestAnimationFrame(animate)
            } else {
              setCount(end)
            }
          }

          requestAnimationFrame(animate)
          observer.unobserve(element)
        }
      },
      { threshold: ANIMATION_THRESHOLDS.DELAYED }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [end, duration, hasAnimated, prefersReducedMotion])

  const formattedCount = decimals > 0
    ? count.toFixed(decimals)
    : Math.round(count).toLocaleString('en-US')

  return (
    <div ref={ref} className="text-center">
      <div className={`font-heading font-bold ${className}`}>
        {prefix}{formattedCount}{suffix}
      </div>
      {label && (
        <div className={`mt-1 ${labelClassName}`}>
          {label}
        </div>
      )}
    </div>
  )
}

// Stats grid component for consistent stat displays
interface Stat {
  value: number
  label: string
  prefix?: string
  suffix?: string
  decimals?: number
}

interface StatsGridProps {
  stats: Stat[]
  variant?: 'light' | 'dark' | 'gradient'
  columns?: 2 | 3 | 4 | 5
  className?: string
}

export function StatsGrid({
  stats,
  variant = 'light',
  columns = 4,
  className = '',
}: StatsGridProps) {
  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
  }

  const variantStyles = {
    light: {
      container: 'bg-white border border-warm-200 rounded-2xl p-6 md:p-8 shadow-warm',
      value: 'text-4xl md:text-5xl text-ocean-deep',
      label: 'text-warm-600 text-sm',
    },
    dark: {
      container: 'bg-ocean-deep rounded-2xl p-6 md:p-8',
      value: 'text-4xl md:text-5xl text-white',
      label: 'text-white/70 text-sm',
    },
    gradient: {
      container: 'bg-gradient-to-r from-ocean-deep via-ocean-blue to-ocean-teal rounded-2xl p-6 md:p-8',
      value: 'text-4xl md:text-5xl text-white',
      label: 'text-white/80 text-sm',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`grid ${colClasses[columns]} gap-6 md:gap-8`}>
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <AnimatedCounter
              end={stat.value}
              prefix={stat.prefix}
              suffix={stat.suffix}
              decimals={stat.decimals}
              className={styles.value}
              labelClassName={styles.label}
              label={stat.label}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
