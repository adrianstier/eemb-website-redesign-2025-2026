import React from 'react'

interface LoadingProps {
  /** Loading indicator style */
  type?: 'spinner' | 'skeleton' | 'dots' | 'bar'
  /** Optional loading text */
  text?: string
  /** Center in full viewport */
  fullScreen?: boolean
  /** Number of skeleton items */
  count?: number
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Loading component with multiple indicator styles.
 * Follows the Pacific Naturalism design system.
 *
 * @example
 * ```tsx
 * <Loading type="spinner" text="Loading faculty..." />
 * <Loading type="skeleton" count={4} />
 * ```
 */
export const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  text,
  fullScreen = false,
  count = 1,
  size = 'md',
}) => {
  const containerClass = fullScreen
    ? 'flex items-center justify-center min-h-screen bg-warm-50'
    : 'flex items-center justify-center py-12'

  const spinnerSizes = {
    sm: 'h-8 w-8 border-2',
    md: 'h-12 w-12 border-4',
    lg: 'h-16 w-16 border-4',
  }

  if (type === 'spinner') {
    return (
      <div className={containerClass} role="status" aria-label={text || 'Loading'}>
        <div className="text-center">
          <div
            className={`animate-spin rounded-full ${spinnerSizes[size]} border-warm-200 border-t-ocean-teal mx-auto mb-4`}
          />
          {text && (
            <p className="text-warm-600 font-medium" aria-live="polite">
              {text}
            </p>
          )}
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  }

  if (type === 'skeleton') {
    return (
      <div className="space-y-4" role="status" aria-label="Loading content">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
        <span className="sr-only">Loading content...</span>
      </div>
    )
  }

  if (type === 'dots') {
    return (
      <div className={containerClass} role="status" aria-label={text || 'Loading'}>
        <div className="flex items-center space-x-2">
          <div
            className="w-3 h-3 bg-ocean-teal rounded-full animate-bounce"
            style={{ animationDelay: '0ms' }}
          />
          <div
            className="w-3 h-3 bg-bioluminescent rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          />
          <div
            className="w-3 h-3 bg-ocean-blue rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          />
        </div>
        {text && (
          <p className="ml-4 text-warm-600 font-medium" aria-live="polite">
            {text}
          </p>
        )}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (type === 'bar') {
    return (
      <div className="w-full" role="status" aria-label={text || 'Loading'}>
        {text && (
          <p className="text-warm-600 font-medium mb-2" aria-live="polite">
            {text}
          </p>
        )}
        <div className="w-full bg-warm-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-ocean-teal via-bioluminescent to-ocean-blue h-full rounded-full w-full animate-shimmer" />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  return null
}

/**
 * Base skeleton pulse element with shimmer animation.
 */
export const Skeleton: React.FC<{
  className?: string
  variant?: 'text' | 'circular' | 'rectangular'
  width?: string | number
  height?: string | number
}> = ({ className = '', variant = 'rectangular', width, height }) => {
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  }

  const style: React.CSSProperties = {}
  if (width) style.width = typeof width === 'number' ? `${width}px` : width
  if (height) style.height = typeof height === 'number' ? `${height}px` : height

  return (
    <div
      className={`animate-pulse bg-warm-200 ${variantClasses[variant]} ${className}`}
      style={style}
    />
  )
}

/**
 * Skeleton Card Component with profile layout.
 */
export const SkeletonCard: React.FC<{
  variant?: 'profile' | 'news' | 'event' | 'compact'
}> = ({ variant = 'profile' }) => {
  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 p-4 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-warm-200 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-warm-200 rounded w-3/4" />
            <div className="h-3 bg-warm-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'news') {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden animate-pulse">
        <div className="aspect-video bg-warm-200" />
        <div className="p-6 space-y-3">
          <div className="h-3 bg-warm-200 rounded w-1/4" />
          <div className="h-6 bg-warm-200 rounded w-3/4" />
          <div className="space-y-2">
            <div className="h-3 bg-warm-200 rounded w-full" />
            <div className="h-3 bg-warm-200 rounded w-5/6" />
          </div>
          <div className="h-4 bg-warm-200 rounded w-1/3 mt-4" />
        </div>
      </div>
    )
  }

  if (variant === 'event') {
    return (
      <div className="bg-white rounded-2xl border border-warm-200 p-6 animate-pulse">
        <div className="flex gap-4">
          <div className="w-16 h-20 bg-warm-200 rounded-xl shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-warm-200 rounded w-3/4" />
            <div className="h-3 bg-warm-200 rounded w-1/2" />
            <div className="h-3 bg-warm-200 rounded w-2/3" />
          </div>
        </div>
      </div>
    )
  }

  // Default: profile card
  return (
    <div className="bg-white rounded-2xl border border-warm-200 p-6 animate-pulse">
      <div className="w-24 h-24 bg-warm-200 rounded-full mx-auto mb-4" />
      <div className="text-center space-y-3">
        <div className="h-5 bg-warm-200 rounded w-3/4 mx-auto" />
        <div className="h-4 bg-warm-200 rounded w-1/2 mx-auto" />
        <div className="space-y-2 pt-2">
          <div className="h-3 bg-warm-200 rounded w-full" />
          <div className="h-3 bg-warm-200 rounded w-5/6 mx-auto" />
        </div>
        <div className="flex justify-center gap-2 pt-4">
          <div className="w-9 h-9 bg-warm-200 rounded-full" />
          <div className="w-9 h-9 bg-warm-200 rounded-full" />
          <div className="w-9 h-9 bg-warm-200 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/**
 * Grid Skeleton for multiple items.
 */
export const SkeletonGrid: React.FC<{
  count?: number
  columns?: string
  variant?: 'profile' | 'news' | 'event' | 'compact'
}> = ({
  count = 6,
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  variant = 'profile',
}) => {
  return (
    <div className={`grid ${columns} gap-6`} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant={variant} />
      ))}
      <span className="sr-only">Loading content...</span>
    </div>
  )
}

/**
 * Section skeleton for full section loading.
 */
export const SectionSkeleton: React.FC<{
  hasHeader?: boolean
  itemCount?: number
  columns?: number
}> = ({ hasHeader = true, itemCount = 3, columns = 3 }) => {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <div className="animate-pulse" role="status" aria-label="Loading section">
      {hasHeader && (
        <div className="mb-8 md:mb-12 space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-warm-200" />
            <div className="h-3 w-24 bg-warm-200 rounded" />
          </div>
          <div className="h-10 w-2/3 bg-warm-200 rounded-lg" />
          <div className="h-5 w-1/2 bg-warm-200 rounded" />
        </div>
      )}
      <div className={`grid ${columnClasses[columns as keyof typeof columnClasses] || columnClasses[3]} gap-6`}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <span className="sr-only">Loading section...</span>
    </div>
  )
}

/**
 * Text skeleton for paragraphs.
 */
export const TextSkeleton: React.FC<{
  lines?: number
  className?: string
}> = ({ lines = 3, className = '' }) => {
  return (
    <div className={`space-y-2 animate-pulse ${className}`} role="status">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-warm-200 rounded"
          style={{ width: `${60 + ((i * 37) % 40)}%` }}
        />
      ))}
      <span className="sr-only">Loading text...</span>
    </div>
  )
}

export default Loading