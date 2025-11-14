'use client'

import React from 'react'
import { Button } from './Button'

interface ErrorStateProps {
  error?: Error | string
  reset?: () => void
  title?: string
  message?: string
  fullScreen?: boolean
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  reset,
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  fullScreen = false,
}) => {
  const containerClass = fullScreen
    ? 'min-h-screen flex items-center justify-center py-20'
    : 'py-20'

  return (
    <div className={containerClass}>
      <div className="max-w-md mx-auto text-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
          <svg
            className="w-16 h-16 text-red-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-bold text-red-900 mb-2">{title}</h3>
          <p className="text-red-700 mb-6">{message}</p>

          {typeof error === 'string' && (
            <details className="mb-4 text-left">
              <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                Error details
              </summary>
              <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded break-all">
                {error}
              </p>
            </details>
          )}

          {error instanceof Error && (
            <details className="mb-4 text-left">
              <summary className="text-sm text-red-600 cursor-pointer hover:text-red-800">
                Error details
              </summary>
              <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded break-all">
                {error.message}
              </p>
            </details>
          )}

          {reset && (
            <Button variant="danger" onClick={reset}>
              Try Again
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// Empty State Component
interface EmptyStateProps {
  title?: string
  message?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  message = 'Try adjusting your search or filters.',
  action,
  icon,
}) => {
  return (
    <div className="text-center py-20">
      <div className="max-w-md mx-auto">
        {icon || (
          <svg
            className="w-24 h-24 text-gray-300 mx-auto mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        )}

        <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>

        {action && (
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ErrorState