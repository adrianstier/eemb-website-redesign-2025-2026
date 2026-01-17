'use client'

import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'

/**
 * Action button configuration
 */
interface EmptyStateAction {
  label: string
  href: string
  variant?: 'primary' | 'secondary'
  icon?: LucideIcon
  external?: boolean
}

/**
 * Icon configuration for the decorative cluster
 */
interface EmptyStateIcon {
  icon: LucideIcon
  color: 'ocean-teal' | 'ucsb-gold' | 'bioluminescent'
  rotation?: 'left' | 'right' | 'none'
}

/**
 * Suggestion card configuration
 */
interface EmptyStateSuggestion {
  icon: React.ReactNode
  title: string
  description: string
  iconColor: 'ocean-teal' | 'ucsb-gold' | 'bioluminescent'
}

interface EmptyStateProps {
  /** Main heading text */
  title: string
  /** Description paragraph */
  description: string
  /** Array of icons to display in the decorative cluster */
  icons?: EmptyStateIcon[]
  /** Array of action buttons */
  actions?: EmptyStateAction[]
  /** Array of suggestion cards */
  suggestions?: EmptyStateSuggestion[]
  /** Show animated wave pattern */
  showWave?: boolean
  /** Wrap in ScrollReveal animation */
  animated?: boolean
  /** Additional CSS classes */
  className?: string
}

const colorClassMap = {
  'ocean-teal': {
    bg: 'bg-ocean-teal/10',
    text: 'text-ocean-teal',
  },
  'ucsb-gold': {
    bg: 'bg-ucsb-gold/10',
    text: 'text-ucsb-gold',
  },
  'bioluminescent': {
    bg: 'bg-bioluminescent/10',
    text: 'text-bioluminescent',
  },
}

export default function EmptyState({
  title,
  description,
  icons = [],
  actions = [],
  suggestions = [],
  showWave = true,
  animated = true,
  className = '',
}: EmptyStateProps) {
  const content = (
    <div className={`relative overflow-hidden bg-white rounded-3xl border border-warm-200 shadow-warm-lg ${className}`}>
      {/* Decorative background gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-teal/5 via-transparent to-bioluminescent/5" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-ucsb-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-ocean-teal/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Animated wave pattern */}
      {showWave && (
        <div className="absolute bottom-0 left-0 right-0 opacity-10">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-16">
            <path fill="currentColor" className="text-ocean-teal" d="M0,64 C240,96,480,32,720,64 C960,96,1200,32,1440,64 L1440,120 L0,120 Z">
              <animate
                attributeName="d"
                dur="8s"
                repeatCount="indefinite"
                values="M0,64 C240,96,480,32,720,64 C960,96,1200,32,1440,64 L1440,120 L0,120 Z;M0,32 C240,64,480,96,720,32 C960,64,1200,96,1440,32 L1440,120 L0,120 Z;M0,64 C240,96,480,32,720,64 C960,96,1200,32,1440,64 L1440,120 L0,120 Z"
              />
            </path>
          </svg>
        </div>
      )}

      <div className="relative px-8 py-16 md:py-20 text-center">
        {/* Icon cluster */}
        {icons.length > 0 && (
          <div className="flex items-center justify-center gap-4 mb-8">
            {icons.map((iconConfig, index) => {
              const Icon = iconConfig.icon
              const colors = colorClassMap[iconConfig.color]
              const rotationClass =
                iconConfig.rotation === 'left' ? '-rotate-6' :
                iconConfig.rotation === 'right' ? 'rotate-6' :
                ''

              // Center icon is larger with gradient
              const isCenter = index === Math.floor(icons.length / 2)

              return (
                <div
                  key={index}
                  className={`
                    ${isCenter ? 'w-16 h-16 rounded-2xl shadow-glow-gold bg-gradient-to-br from-ucsb-gold to-sunset-400' : `w-12 h-12 rounded-xl ${colors.bg}`}
                    flex items-center justify-center transform ${rotationClass}
                  `}
                >
                  <Icon className={`${isCenter ? 'w-8 h-8 text-ocean-deep' : `w-6 h-6 ${colors.text}`}`} />
                </div>
              )
            })}
          </div>
        )}

        {/* Heading */}
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-ocean-deep mb-4">
          {title}
        </h3>

        {/* Description */}
        <p className="text-warm-600 max-w-lg mx-auto mb-8 text-lg leading-relaxed">
          {description}
        </p>

        {/* Action buttons */}
        {actions.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {actions.map((action, index) => {
              const ActionIcon = action.icon
              const buttonClasses = action.variant === 'primary'
                ? 'px-6 py-3.5 bg-ucsb-gold text-ocean-deep rounded-xl font-bold hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg'
                : 'px-6 py-3.5 bg-ocean-teal/10 text-ocean-teal rounded-xl font-semibold hover:bg-ocean-teal hover:text-white transition-all duration-300'

              const content = (
                <>
                  {ActionIcon && <ActionIcon className="w-5 h-5" />}
                  {action.label}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )

              if (action.external) {
                return (
                  <a
                    key={index}
                    href={action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center gap-2 group ${buttonClasses}`}
                  >
                    {content}
                  </a>
                )
              }

              return (
                <Link
                  key={index}
                  href={action.href}
                  className={`inline-flex items-center justify-center gap-2 group ${buttonClasses}`}
                >
                  {content}
                </Link>
              )
            })}
          </div>
        )}

        {/* Suggestion cards */}
        {suggestions.length > 0 && (
          <div className="mt-12 grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {suggestions.map((suggestion, index) => {
              const colors = colorClassMap[suggestion.iconColor]
              return (
                <div key={index} className="bg-warm-50 rounded-xl p-4 text-left border border-warm-200">
                  <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center mb-3`}>
                    {suggestion.icon}
                  </div>
                  <h4 className="font-semibold text-ocean-deep text-sm mb-1">{suggestion.title}</h4>
                  <p className="text-warm-500 text-xs">{suggestion.description}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )

  // Wrap in ScrollReveal if animated
  if (animated) {
    return (
      <ScrollReveal direction="up" duration={600}>
        {content}
      </ScrollReveal>
    )
  }

  return content
}
