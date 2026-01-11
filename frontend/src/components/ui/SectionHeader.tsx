'use client'

import React from 'react'
import Link from 'next/link'

interface SectionHeaderProps {
  /** Eyebrow text displayed above the title */
  eyebrow?: string
  /** Main section title */
  title: string | React.ReactNode
  /** Optional subtitle/description */
  subtitle?: string
  /** Color theme for eyebrow and accent line */
  color?: 'teal' | 'blue' | 'gold' | 'bioluminescent'
  /** Alignment */
  align?: 'left' | 'center'
  /** Optional link to show "View all" or similar */
  link?: {
    href: string
    label: string
  }
  /** Additional class names */
  className?: string
  /** Title heading level for accessibility */
  titleAs?: 'h1' | 'h2' | 'h3'
  /** Title size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Animation visibility (for scroll-triggered animations) */
  isVisible?: boolean
}

/**
 * SectionHeader component for consistent section headings.
 * Follows the Pacific Naturalism design system with eyebrow, title, and optional link.
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   eyebrow="Research"
 *   title="What We Study"
 *   subtitle="Three interconnected themes..."
 *   color="teal"
 *   link={{ href: "/research", label: "View all" }}
 * />
 * ```
 */
export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  color = 'teal',
  align = 'left',
  link,
  className = '',
  titleAs: TitleComponent = 'h2',
  size = 'lg',
  isVisible = true,
}: SectionHeaderProps) {
  // Color classes for eyebrow text
  const eyebrowColorClasses: Record<string, string> = {
    teal: 'text-ocean-teal',
    blue: 'text-ocean-blue',
    gold: 'text-ucsb-gold',
    bioluminescent: 'text-bioluminescent',
  }

  // Gradient line colors
  const lineColorClasses: Record<string, string> = {
    teal: 'from-ocean-teal',
    blue: 'from-ocean-blue',
    gold: 'from-ucsb-gold',
    bioluminescent: 'from-bioluminescent',
  }

  // Title size classes
  const titleSizeClasses: Record<string, string> = {
    sm: 'text-2xl md:text-3xl',
    md: 'text-3xl md:text-4xl',
    lg: 'text-display-sm',
    xl: 'text-display',
  }

  // Animation classes
  const animationClasses = `transition-all duration-1000 ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  }`

  const alignmentClasses = align === 'center' ? 'text-center' : ''

  return (
    <div className={`${animationClasses} ${alignmentClasses} ${className}`}>
      {/* Eyebrow */}
      {eyebrow && (
        <div
          className={`flex items-center gap-4 mb-4 md:mb-6 ${
            align === 'center' ? 'justify-center' : ''
          }`}
        >
          <div
            className={`h-px w-12 bg-gradient-to-r ${lineColorClasses[color]} to-transparent`}
          />
          <span
            className={`text-sm font-semibold tracking-[0.2em] uppercase ${eyebrowColorClasses[color]}`}
          >
            {eyebrow}
          </span>
          {align === 'center' && (
            <div
              className={`h-px w-12 bg-gradient-to-l ${lineColorClasses[color]} to-transparent`}
            />
          )}
        </div>
      )}

      {/* Title with optional link */}
      <div
        className={`flex flex-col ${
          link ? 'md:flex-row md:items-end md:justify-between' : ''
        } gap-4 md:gap-6`}
      >
        <div className={link ? 'flex-1' : ''}>
          <TitleComponent
            className={`font-heading ${titleSizeClasses[size]} font-bold text-ocean-deep leading-tight`}
          >
            {title}
          </TitleComponent>

          {subtitle && (
            <p
              className={`mt-4 text-warm-600 text-lg md:text-xl leading-relaxed ${
                align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-2xl'
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>

        {link && (
          <Link
            href={link.href}
            className="group inline-flex items-center gap-2 text-sm font-semibold text-ocean-blue hover:text-ocean-deep transition-colors shrink-0"
          >
            {link.label}
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  )
}

/**
 * Compact section header variant for utility pages.
 * Smaller, no decorative elements.
 */
export function CompactSectionHeader({
  title,
  subtitle,
  className = '',
  titleAs: TitleComponent = 'h2',
}: Pick<SectionHeaderProps, 'title' | 'subtitle' | 'className' | 'titleAs'>) {
  return (
    <div className={className}>
      <TitleComponent className="font-heading text-2xl md:text-3xl font-bold text-ocean-deep">
        {title}
      </TitleComponent>
      {subtitle && (
        <p className="mt-2 text-warm-600 leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

/**
 * Page header variant for top of pages.
 * Used for utility/compact pages that don't need full heroes.
 */
export function PageHeader({
  title,
  subtitle,
  badge,
  className = '',
}: {
  title: string
  subtitle?: string
  badge?: string
  className?: string
}) {
  return (
    <section className={`bg-white border-b border-warm-200 pt-8 pb-6 ${className}`}>
      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-8 bg-gradient-to-b from-ocean-teal to-ocean-blue rounded-full" />
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-ocean-deep">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-warm-600 ml-4">{subtitle}</p>
            )}
          </div>
          {badge && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-ocean-teal/10 text-ocean-teal">
              {badge}
            </span>
          )}
        </div>
      </div>
    </section>
  )
}
