import React, { forwardRef } from 'react'
import Link from 'next/link'

export interface ButtonProps {
  children: React.ReactNode
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'gold' | 'danger' | 'ocean' | 'teal'
  /** Button size */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** If provided, renders as a Next.js Link */
  href?: string
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  /** Button type for form submission */
  type?: 'button' | 'submit' | 'reset'
  /** Disabled state */
  disabled?: boolean
  /** Loading state with spinner */
  loading?: boolean
  /** Full width button */
  fullWidth?: boolean
  /** Additional CSS classes */
  className?: string
  /** Accessible label */
  ariaLabel?: string
  /** Optional icon on the left */
  leftIcon?: React.ReactNode
  /** Optional icon on the right */
  rightIcon?: React.ReactNode
  /** External link (opens in new tab) */
  external?: boolean
  /** Tab index for focus management */
  tabIndex?: number
}

/**
 * Button component following the Pacific Naturalism design system.
 * Supports multiple variants, sizes, and states.
 *
 * @example
 * ```tsx
 * <Button variant="gold" size="lg" rightIcon={<ArrowIcon />}>
 *   Apply Now
 * </Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      href,
      onClick,
      type = 'button',
      disabled = false,
      loading = false,
      fullWidth = false,
      className = '',
      ariaLabel,
      leftIcon,
      rightIcon,
      external = false,
      tabIndex,
    },
    ref
  ) => {
    // Base styles with design system tokens
    const baseClasses = `
      inline-flex items-center justify-center gap-2
      font-semibold
      rounded-xl
      transition-all duration-300 ease-spring
      focus:outline-none focus:ring-2 focus:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      active:scale-[0.98]
    `.replace(/\s+/g, ' ').trim()

    // Variant styles following Pacific Naturalism palette
    const variantClasses: Record<string, string> = {
      // Primary: Ocean blue with depth
      primary: `
        bg-ocean-blue text-white
        hover:bg-ocean-deep hover:shadow-ocean
        focus:ring-ocean-blue
      `,
      // Secondary: Outlined with ocean blue border
      secondary: `
        bg-white text-ocean-blue
        border-2 border-ocean-blue
        hover:bg-ocean-blue hover:text-white
        focus:ring-ocean-blue
      `,
      // Ghost: Subtle, text-only appearance
      ghost: `
        text-ocean-blue
        hover:bg-ocean-blue/10
        focus:ring-ocean-blue
      `,
      // Gold CTA: High-visibility call-to-action (UCSB Gold)
      gold: `
        bg-ucsb-gold text-ocean-deep
        font-bold
        hover:bg-yellow-400 hover:shadow-glow-gold
        focus:ring-ucsb-gold
      `,
      // Ocean: Dark ocean background
      ocean: `
        bg-ocean-deep text-white
        hover:bg-ocean-midnight hover:shadow-ocean-lg
        focus:ring-ocean-blue
      `,
      // Teal: Bioluminescent accent
      teal: `
        bg-ocean-teal text-white
        hover:bg-ocean-teal/90 hover:shadow-glow-teal
        focus:ring-ocean-teal
      `,
      // Danger: Destructive actions
      danger: `
        bg-ucsb-coral text-white
        hover:bg-red-700
        focus:ring-ucsb-coral
      `,
    }

    // Size styles with responsive padding
    const sizeClasses: Record<string, string> = {
      sm: 'px-4 py-2 text-sm rounded-lg',
      md: 'px-6 py-3 text-base rounded-xl',
      lg: 'px-8 py-4 text-lg rounded-xl',
      xl: 'px-10 py-5 text-xl rounded-2xl',
    }

    const widthClass = fullWidth ? 'w-full' : ''

    // Clean up whitespace in class strings
    const cleanVariantClasses = variantClasses[variant]?.replace(/\s+/g, ' ').trim() || ''

    const combinedClasses = `${baseClasses} ${cleanVariantClasses} ${sizeClasses[size]} ${widthClass} ${className}`.trim()

    // Loading spinner component
    const LoadingSpinner = () => (
      <svg
        className="animate-spin h-5 w-5"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    )

    // Button content with icons
    const content = (
      <>
        {loading ? (
          <LoadingSpinner />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!loading && rightIcon && (
          <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">
            {rightIcon}
          </span>
        )}
      </>
    )

    // Render as Link for internal navigation
    if (href && !disabled && !loading) {
      if (external) {
        return (
          <a
            href={href}
            className={`group ${combinedClasses}`}
            aria-label={ariaLabel}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tabIndex}
          >
            {content}
          </a>
        )
      }

      return (
        <Link
          href={href}
          className={`group ${combinedClasses}`}
          aria-label={ariaLabel}
          tabIndex={tabIndex}
        >
          {content}
        </Link>
      )
    }

    // Render as button
    return (
      <button
        ref={ref}
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        className={`group ${combinedClasses}`}
        aria-label={ariaLabel}
        aria-busy={loading}
        tabIndex={tabIndex}
      >
        {content}
      </button>
    )
  }
)

Button.displayName = 'Button'

// Common icon components for convenience
export const ArrowRightIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
)

export const ChevronRightIcon = ({ className = 'w-5 h-5' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
)

export const ExternalLinkIcon = ({ className = 'w-4 h-4' }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
  </svg>
)

export default Button
