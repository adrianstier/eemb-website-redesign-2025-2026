/**
 * Animation Design Tokens
 *
 * Centralized animation constants for consistent timing and thresholds
 * across the EEMB website. These values ensure smooth, organic animations
 * that reflect the "Pacific Naturalism" design philosophy.
 */

/**
 * Animation duration scale (in milliseconds)
 * Based on natural rhythms - quick interactions to slow, organic movements
 */
export const ANIMATION_DURATION = {
  /** Ultra-fast interactions - hover states, micro-interactions (300ms) */
  INSTANT: 300,

  /** Fast transitions - button states, dropdowns (500ms) */
  FAST: 500,

  /** Standard animations - cards, modals, most UI transitions (600ms) */
  NORMAL: 600,

  /** Slower reveal animations - sections scrolling into view (800ms) */
  SLOW: 1000,

  /** Counters and data visualization animations (2000ms) */
  COUNTER: 2000,

  /** Hero carousel auto-rotation (5000ms) */
  CAROUSEL: 5000,
} as const

/**
 * IntersectionObserver threshold values
 * Control when scroll-triggered animations fire
 */
export const ANIMATION_THRESHOLDS = {
  /** Fire immediately when any part enters viewport (0.1) */
  IMMEDIATE: 0.1,

  /** Fire when 20% is visible - standard for most animations (0.2) */
  STANDARD: 0.2,

  /** Fire when 30% is visible - counters and important content (0.3) */
  DELAYED: 0.3,

  /** Fire when 50% is visible - full sections (0.5) */
  HALF: 0.5,
} as const

/**
 * Stagger delay values (in milliseconds)
 * For sequential reveal of list items and grid elements
 */
export const STAGGER_DELAY = {
  /** Tight stagger for dense lists (50ms) */
  TIGHT: 50,

  /** Standard stagger for most lists (100ms) */
  STANDARD: 100,

  /** Relaxed stagger for large cards (150ms) */
  RELAXED: 150,

  /** Wide stagger for hero elements (200ms) */
  WIDE: 200,
} as const

/**
 * Easing functions as cubic-bezier values
 * Pre-defined in Tailwind config as 'spring' and 'bounce-soft'
 */
export const EASING = {
  /** Smooth, natural easing - cubic-bezier(0.16, 1, 0.3, 1) */
  SPRING: 'cubic-bezier(0.16, 1, 0.3, 1)',

  /** Slight bounce - cubic-bezier(0.34, 1.56, 0.64, 1) */
  BOUNCE_SOFT: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  /** Ease out cubic - for counters */
  EASE_OUT_CUBIC: 'cubic-bezier(0.33, 1, 0.68, 1)',
} as const

/**
 * Helper function to get CSS transition string
 *
 * @example
 * ```tsx
 * style={{ transition: getTransition('opacity', 'FAST') }}
 * ```
 */
export function getTransition(
  property: string = 'all',
  duration: keyof typeof ANIMATION_DURATION = 'NORMAL',
  easing: keyof typeof EASING = 'SPRING'
): string {
  return `${property} ${ANIMATION_DURATION[duration]}ms ${EASING[easing]}`
}

/**
 * Type exports for TypeScript
 */
export type AnimationDuration = keyof typeof ANIMATION_DURATION
export type AnimationThreshold = keyof typeof ANIMATION_THRESHOLDS
export type StaggerDelay = keyof typeof STAGGER_DELAY
export type EasingFunction = keyof typeof EASING
