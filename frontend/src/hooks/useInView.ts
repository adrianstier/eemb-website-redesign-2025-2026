'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ANIMATION_THRESHOLDS, STAGGER_DELAY } from '@/lib/animationTokens'

interface UseInViewOptions {
  /** Intersection threshold (0-1). Default: 0.2 */
  threshold?: number
  /** Root margin. Default: '0px' */
  rootMargin?: string
  /** Whether to unobserve after first intersection. Default: true */
  triggerOnce?: boolean
  /** Whether to skip observation (useful for reduced motion). Default: false */
  skip?: boolean
}

interface UseInViewReturn<T extends Element> {
  /** Ref to attach to the target element */
  ref: React.RefObject<T>
  /** Whether the element is currently in view */
  isInView: boolean
  /** Whether the element has ever been in view */
  hasBeenInView: boolean
}

/**
 * Custom hook to detect when an element enters the viewport.
 * Used for scroll-triggered animations and lazy loading.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { ref, isInView } = useInView({ threshold: 0.2 })
 *
 *   return (
 *     <div
 *       ref={ref}
 *       className={isInView ? 'opacity-100' : 'opacity-0'}
 *     >
 *       Content
 *     </div>
 *   )
 * }
 * ```
 */
export function useInView<T extends Element = HTMLDivElement>({
  threshold = ANIMATION_THRESHOLDS.STANDARD,
  rootMargin = '0px',
  triggerOnce = true,
  skip = false,
}: UseInViewOptions = {}): UseInViewReturn<T> {
  const ref = useRef<T>(null)
  const [isInView, setIsInView] = useState(false)
  const [hasBeenInView, setHasBeenInView] = useState(false)

  useEffect(() => {
    // If skip is true, consider element as "in view" immediately
    if (skip) {
      setIsInView(true)
      setHasBeenInView(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isCurrentlyInView = entry.isIntersecting

        if (isCurrentlyInView) {
          setIsInView(true)
          setHasBeenInView(true)

          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, triggerOnce, skip])

  return { ref, isInView, hasBeenInView }
}

/**
 * Hook for staggered animations on multiple elements.
 * Returns a function to generate animation delay styles.
 *
 * @example
 * ```tsx
 * function List({ items }) {
 *   const { containerRef, isInView, getStaggerStyles } = useStaggeredInView()
 *
 *   return (
 *     <ul ref={containerRef}>
 *       {items.map((item, index) => (
 *         <li
 *           key={item.id}
 *           className={isInView ? 'animate-fade-in-up' : 'opacity-0'}
 *           style={getStaggerStyles(index)}
 *         >
 *           {item.name}
 *         </li>
 *       ))}
 *     </ul>
 *   )
 * }
 * ```
 */
export function useStaggeredInView<T extends Element = HTMLDivElement>(
  options: UseInViewOptions & {
    /** Delay between each item in ms. Default: 100 */
    staggerDelay?: number
    /** Initial delay before first item in ms. Default: 0 */
    initialDelay?: number
  } = {}
) {
  const { staggerDelay = STAGGER_DELAY.STANDARD, initialDelay = 0, ...inViewOptions } = options
  const { ref, isInView, hasBeenInView } = useInView<T>(inViewOptions)

  const getStaggerStyles = useCallback(
    (index: number): React.CSSProperties => ({
      transitionDelay: `${initialDelay + index * staggerDelay}ms`,
    }),
    [staggerDelay, initialDelay]
  )

  const getStaggerClass = useCallback(
    (index: number, baseDelay = 0): string => {
      const delay = baseDelay + index * staggerDelay
      // Map to Tailwind delay classes (extended up to 1000ms)
      if (delay <= 100) return 'delay-100'
      if (delay <= 150) return 'delay-150'
      if (delay <= 200) return 'delay-200'
      if (delay <= 300) return 'delay-300'
      if (delay <= 400) return 'delay-400'
      if (delay <= 500) return 'delay-500'
      if (delay <= 600) return 'delay-600'
      if (delay <= 700) return 'delay-700'
      if (delay <= 800) return 'delay-800'
      if (delay <= 1000) return 'delay-1000'
      // For delays > 1000ms, use inline styles via getStaggerStyles instead
      return ''
    },
    [staggerDelay]
  )

  return {
    containerRef: ref,
    isInView,
    hasBeenInView,
    getStaggerStyles,
    getStaggerClass,
  }
}

export default useInView
