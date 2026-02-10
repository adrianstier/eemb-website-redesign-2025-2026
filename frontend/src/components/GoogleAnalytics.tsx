'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

// Validate GA Measurement ID format (G-XXXXXXXXXX) to prevent script injection
const rawGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
const GA_MEASUREMENT_ID = rawGaId && /^G-[A-Z0-9]+$/.test(rawGaId) ? rawGaId : undefined

// Track page views
function AnalyticsPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || !window.gtag) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')

    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }, [pathname, searchParams])

  return null
}

// Custom event tracking helper
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (!GA_MEASUREMENT_ID || typeof window === 'undefined' || !window.gtag) return

  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value,
  })
}

// Predefined event helpers for common actions
export const analytics = {
  // Contact form events
  contactFormSubmit: () => trackEvent('submit', 'Contact', 'contact_form'),
  contactFormError: (error: string) => trackEvent('error', 'Contact', error),

  // Navigation events
  externalLinkClick: (url: string) => trackEvent('click', 'External Link', url),
  downloadFile: (filename: string) => trackEvent('download', 'File', filename),

  // Faculty/People events
  facultyProfileView: (name: string) => trackEvent('view', 'Faculty Profile', name),
  labWebsiteClick: (faculty: string) => trackEvent('click', 'Lab Website', faculty),

  // News events
  newsArticleView: (title: string) => trackEvent('view', 'News Article', title),
  newsShareClick: (title: string) => trackEvent('share', 'News', title),

  // Event calendar events
  eventView: (title: string) => trackEvent('view', 'Event', title),
  eventRegisterClick: (title: string) => trackEvent('click', 'Event Registration', title),
  calendarSubscribe: () => trackEvent('subscribe', 'Calendar'),

  // Search events
  search: (query: string) => trackEvent('search', 'Site Search', query),

  // Recruitment funnel
  graduateInfoClick: () => trackEvent('click', 'Graduate Program', 'info_page'),
  applyClick: () => trackEvent('click', 'Graduate Program', 'apply_button'),
  facultyAcceptingClick: (faculty: string) => trackEvent('click', 'Accepting Students', faculty),
}

export default function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null
  }

  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
      {/* Page view tracking */}
      <Suspense fallback={null}>
        <AnalyticsPageView />
      </Suspense>
    </>
  )
}

// Extend window type for gtag
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void
    dataLayer: unknown[]
  }
}
