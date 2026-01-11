'use client'

import { useState, useEffect } from 'react'

/**
 * Hook to detect if user prefers reduced motion
 *
 * Uses the prefers-reduced-motion media query to respect user's
 * accessibility preferences. Critical for users with vestibular disorders.
 *
 * @returns boolean - true if user prefers reduced motion
 *
 * @example
 * ```tsx
 * const prefersReducedMotion = useReducedMotion()
 *
 * // Pause auto-rotating carousels
 * useEffect(() => {
 *   if (prefersReducedMotion) {
 *     clearInterval(autoRotateInterval)
 *   }
 * }, [prefersReducedMotion])
 *
 * // Conditionally apply animations
 * <div className={prefersReducedMotion ? '' : 'animate-fade-in'}>
 * ```
 */
export function useReducedMotion(): boolean {
  // Default to reduced motion on server (safer assumption)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(true)

  useEffect(() => {
    // Check if window is available (client-side only)
    if (typeof window === 'undefined') return

    // Get the media query
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches)

    // Listen for changes (user can change system settings while page is open)
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches)
    }

    // Modern browsers
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return prefersReducedMotion
}

/**
 * Hook to get animation duration based on motion preference
 * Returns 0 for reduced motion, otherwise returns the specified duration
 *
 * @param duration - Animation duration in milliseconds
 * @returns number - 0 if reduced motion preferred, otherwise the duration
 *
 * @example
 * ```tsx
 * const duration = useAnimationDuration(5000) // 5 seconds or 0
 *
 * useEffect(() => {
 *   if (duration > 0) {
 *     const interval = setInterval(rotate, duration)
 *     return () => clearInterval(interval)
 *   }
 * }, [duration])
 * ```
 */
export function useAnimationDuration(duration: number): number {
  const prefersReducedMotion = useReducedMotion()
  return prefersReducedMotion ? 0 : duration
}

export default useReducedMotion
