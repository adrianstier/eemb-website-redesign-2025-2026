'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-ucsb-navy mb-4">
          Something went wrong!
        </h2>
        <p className="text-gray-600 mb-6">
          We apologize for the inconvenience. An error occurred while loading this page.
        </p>
        <button
          onClick={() => reset()}
          className="bg-ucsb-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
        >
          Try again
        </button>
      </div>
    </div>
  )
}