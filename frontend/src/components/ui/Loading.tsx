import React from 'react'

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'dots' | 'bar'
  text?: string
  fullScreen?: boolean
  count?: number
}

export const Loading: React.FC<LoadingProps> = ({
  type = 'spinner',
  text,
  fullScreen = false,
  count = 1,
}) => {
  const containerClass = fullScreen
    ? 'flex items-center justify-center min-h-screen'
    : 'flex items-center justify-center py-12'

  if (type === 'spinner') {
    return (
      <div className={containerClass} role="status" aria-label={text || 'Loading'}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-ocean-light border-t-ocean-deep mx-auto mb-4"></div>
          {text && (
            <p className="text-gray-600 font-medium" aria-live="polite">
              {text}
            </p>
          )}
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
          ></div>
          <div
            className="w-3 h-3 bg-ocean-blue rounded-full animate-bounce"
            style={{ animationDelay: '150ms' }}
          ></div>
          <div
            className="w-3 h-3 bg-ocean-deep rounded-full animate-bounce"
            style={{ animationDelay: '300ms' }}
          ></div>
        </div>
        {text && (
          <p className="ml-4 text-gray-600 font-medium" aria-live="polite">
            {text}
          </p>
        )}
      </div>
    )
  }

  if (type === 'bar') {
    return (
      <div className="w-full" role="status" aria-label={text || 'Loading'}>
        {text && (
          <p className="text-gray-600 font-medium mb-2" aria-live="polite">
            {text}
          </p>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-ocean-teal to-ocean-blue h-full rounded-full animate-pulse"
            style={{
              width: '100%',
              animation: 'slide 1.5s ease-in-out infinite',
            }}
          ></div>
        </div>
      </div>
    )
  }

  return null
}

// Skeleton Card Component
export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
      <div className="flex items-start space-x-4">
        <div className="w-32 h-32 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1 space-y-3">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="h-3 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Grid Skeleton for multiple items
export const SkeletonGrid: React.FC<{ count?: number; columns?: string }> = ({
  count = 6,
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}) => {
  return (
    <div className={`grid ${columns} gap-6`} role="status" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export default Loading