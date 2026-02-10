'use client'

import { useEffect } from 'react'

/**
 * Web Vitals metrics type
 */
type WebVitalsMetric = {
  id: string
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  delta: number
  navigationType: string
}

/**
 * Thresholds for Core Web Vitals (in milliseconds for time-based metrics)
 * Based on Google's recommended thresholds
 */
const thresholds = {
  CLS: { good: 0.1, poor: 0.25 },      // Cumulative Layout Shift (no unit)
  FCP: { good: 1800, poor: 3000 },     // First Contentful Paint (ms)
  FID: { good: 100, poor: 300 },       // First Input Delay (ms)
  INP: { good: 200, poor: 500 },       // Interaction to Next Paint (ms)
  LCP: { good: 2500, poor: 4000 },     // Largest Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 },     // Time to First Byte (ms)
}

/**
 * Get rating based on metric value and thresholds
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = thresholds[name as keyof typeof thresholds]
  if (!threshold) return 'needs-improvement'

  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Report metric to analytics (Google Analytics 4)
 */
function sendToGA(metric: WebVitalsMetric) {
  // Check if GA is available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_rating: metric.rating,
      non_interaction: true,
    })
  }
}

/**
 * Log metric to console in development
 */
function logMetric(metric: WebVitalsMetric) {
  const color = {
    good: '#0cce6b',
    'needs-improvement': '#ffa400',
    poor: '#ff4e42',
  }[metric.rating]

  console.log(
    `%c${metric.name} %c${metric.value.toFixed(metric.name === 'CLS' ? 3 : 0)}${metric.name === 'CLS' ? '' : 'ms'} %c(${metric.rating})`,
    'font-weight: bold;',
    `color: ${color}; font-weight: bold;`,
    `color: ${color};`
  )
}

/**
 * WebVitals Component
 *
 * Measures and reports Core Web Vitals metrics:
 * - LCP (Largest Contentful Paint) - loading performance
 * - FID (First Input Delay) - interactivity
 * - CLS (Cumulative Layout Shift) - visual stability
 * - FCP (First Contentful Paint) - perceived load speed
 * - TTFB (Time to First Byte) - server responsiveness
 * - INP (Interaction to Next Paint) - overall responsiveness
 *
 * @example
 * ```tsx
 * // In layout.tsx or page.tsx
 * import WebVitals from '@/components/WebVitals'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <>
 *       <WebVitals />
 *       {children}
 *     </>
 *   )
 * }
 * ```
 */
export default function WebVitals() {
  useEffect(() => {
    // Dynamically import web-vitals to avoid SSR issues
    const loadWebVitals = async () => {
      try {
        const { onCLS, onFCP, onFID, onINP, onLCP, onTTFB } = await import('web-vitals')

        const handleMetric = (metric: {
          name: string
          value: number
          id: string
          delta: number
          navigationType: string
        }) => {
          const rating = getRating(metric.name, metric.value)
          const fullMetric: WebVitalsMetric = { ...metric, rating }

          // Log in development
          if (process.env.NODE_ENV === 'development') {
            logMetric(fullMetric)
          }

          // Send to GA in production
          if (process.env.NODE_ENV === 'production') {
            sendToGA(fullMetric)
          }
        }

        // Register all metric handlers
        onCLS(handleMetric)
        onFCP(handleMetric)
        onFID(handleMetric)
        onINP(handleMetric)
        onLCP(handleMetric)
        onTTFB(handleMetric)
      } catch (error) {
        // web-vitals not available, silently fail
        console.debug('Web Vitals not available:', error)
      }
    }

    loadWebVitals()
  }, [])

  // This component doesn't render anything
  return null
}
