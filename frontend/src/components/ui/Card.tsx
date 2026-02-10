import React, { forwardRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface CardProps {
  children: React.ReactNode
  /** Enable hover effects */
  hover?: boolean
  /** Card padding size */
  padding?: 'none' | 'sm' | 'md' | 'lg'
  /** Card border radius */
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  /** Visual variant */
  variant?: 'default' | 'elevated' | 'outlined' | 'filled' | 'gradient'
  /** Additional CSS classes */
  className?: string
  /** If provided, card becomes a link */
  href?: string
  /** Click handler */
  onClick?: () => void
  /** Accessible label */
  ariaLabel?: string
  /** Semantic role */
  role?: string
  /** Tab index for focus management */
  tabIndex?: number
}

/**
 * Card component following the Pacific Naturalism design system.
 * Supports multiple variants and hover effects.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" hover padding="lg">
 *   <CardImage src="/image.jpg" alt="Description" />
 *   <CardTitle>Card Title</CardTitle>
 *   <CardDescription>Card content here.</CardDescription>
 * </Card>
 * ```
 */
export const Card = forwardRef<HTMLElement, CardProps>(
  (
    {
      children,
      hover = true,
      padding = 'md',
      rounded = '2xl',
      variant = 'default',
      className = '',
      href,
      onClick,
      ariaLabel,
      role = 'article',
      tabIndex,
    },
    ref
  ) => {
    const paddingClasses: Record<string, string> = {
      none: '',
      sm: 'p-4',
      md: 'p-6 md:p-8',
      lg: 'p-8 md:p-10',
    }

    const roundedClasses: Record<string, string> = {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      '2xl': 'rounded-2xl',
      '3xl': 'rounded-3xl',
    }

    // Variant styles following Pacific Naturalism design system
    const variantClasses: Record<string, string> = {
      default: 'bg-white border border-warm-200 shadow-warm-sm',
      elevated: 'bg-white shadow-warm-lg border border-warm-100',
      outlined: 'bg-white border-2 border-warm-300',
      filled: 'bg-warm-100 border border-warm-200',
      gradient: 'bg-gradient-to-br from-white to-warm-50 border border-warm-200 shadow-warm-md',
    }

    const hoverClasses = hover
      ? 'hover:shadow-warm-xl hover:border-ocean-teal/30 hover:-translate-y-1 transition-all duration-500'
      : 'transition-all duration-300'

    const interactiveClass = href || onClick ? 'cursor-pointer' : ''

    const combinedClasses = `
      ${variantClasses[variant]}
      ${paddingClasses[padding]}
      ${roundedClasses[rounded]}
      ${hoverClasses}
      ${interactiveClass}
      ${className}
    `.replace(/\s+/g, ' ').trim()

    // Common props for all card types
    const cardProps = {
      className: `${combinedClasses} group`,
      role,
      'aria-label': ariaLabel,
      tabIndex: tabIndex ?? (onClick ? 0 : undefined),
    }

    if (href) {
      return (
        <Link href={href} className="block focus-visible:outline-none">
          <article {...cardProps} ref={ref as React.Ref<HTMLElement>}>
            {children}
          </article>
        </Link>
      )
    }

    if (onClick) {
      return (
        <article
          {...cardProps}
          ref={ref as React.Ref<HTMLElement>}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onClick()
            }
          }}
        >
          {children}
        </article>
      )
    }

    return (
      <article {...cardProps} ref={ref as React.Ref<HTMLElement>}>
        {children}
      </article>
    )
  }
)

Card.displayName = 'Card'

/**
 * Card Title component with heading styles.
 * Uses ocean-deep color and transitions to ocean-blue on hover.
 */
export const CardTitle: React.FC<{
  children: React.ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'h4'
  size?: 'sm' | 'md' | 'lg'
}> = ({ children, className = '', as: Component = 'h3', size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-lg font-semibold',
    md: 'text-xl md:text-2xl font-semibold',
    lg: 'text-2xl md:text-3xl font-bold',
  }

  return (
    <Component
      className={`font-heading ${sizeClasses[size]} text-ocean-deep group-hover:text-ocean-blue transition-colors duration-300 ${className}`}
    >
      {children}
    </Component>
  )
}

/**
 * Card Description with warm-600 text color for readability.
 */
export const CardDescription: React.FC<{
  children: React.ReactNode
  className?: string
  clamp?: 2 | 3 | 4 | 'none'
}> = ({ children, className = '', clamp = 'none' }) => {
  const clampClass = clamp !== 'none' ? `line-clamp-${clamp}` : ''

  return (
    <p className={`text-warm-600 leading-relaxed ${clampClass} ${className}`}>
      {children}
    </p>
  )
}

/**
 * Card Image with optimized Next.js Image component.
 * Supports multiple aspect ratios and hover zoom effect.
 */
export const CardImage: React.FC<{
  src: string
  alt: string
  aspectRatio?: 'video' | 'square' | 'portrait' | 'wide'
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl'
  className?: string
  priority?: boolean
  overlay?: boolean
}> = ({
  src,
  alt,
  aspectRatio = 'video',
  rounded = 'xl',
  className = '',
  priority = false,
  overlay = false,
}) => {
  const aspectClasses: Record<string, string> = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
    wide: 'aspect-[3/2]',
  }

  const roundedClasses: Record<string, string> = {
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  }

  return (
    <div
      className={`relative ${aspectClasses[aspectRatio]} ${roundedClasses[rounded]} overflow-hidden bg-warm-100 ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-spring"
        priority={priority}
      />
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}
    </div>
  )
}

/**
 * Card Badge with gradient or solid color options.
 */
export const CardBadge: React.FC<{
  children: React.ReactNode
  variant?: 'gradient' | 'teal' | 'gold' | 'coral' | 'blue'
  className?: string
}> = ({ children, variant = 'gradient', className = '' }) => {
  const variantClasses: Record<string, string> = {
    gradient: 'bg-gradient-to-r from-ocean-teal to-bioluminescent text-white',
    teal: 'bg-ocean-teal text-white',
    gold: 'bg-ucsb-gold text-ocean-deep',
    coral: 'bg-ucsb-coral text-white',
    blue: 'bg-ocean-blue text-white',
  }

  return (
    <span
      className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

/**
 * Card Metadata for dates, authors, categories, etc.
 */
export const CardMeta: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-4 text-sm text-warm-500 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Card Eyebrow for category labels above titles.
 */
export const CardEyebrow: React.FC<{
  children: React.ReactNode
  color?: 'teal' | 'blue' | 'gold'
  className?: string
}> = ({ children, color = 'teal', className = '' }) => {
  const colorClasses: Record<string, string> = {
    teal: 'text-ocean-teal',
    blue: 'text-ocean-blue',
    gold: 'text-ucsb-gold',
  }

  const gradientClasses: Record<string, string> = {
    teal: 'from-ocean-teal to-transparent',
    blue: 'from-ocean-blue to-transparent',
    gold: 'from-ucsb-gold to-transparent',
  }

  return (
    <div className={`flex items-center gap-3 mb-3 ${className}`}>
      <div className={`h-px w-8 bg-gradient-to-r ${gradientClasses[color] || gradientClasses.teal}`} />
      <span className={`text-xs font-semibold tracking-[0.15em] uppercase ${colorClasses[color]}`}>
        {children}
      </span>
    </div>
  )
}

/**
 * Card Header section with optional border.
 */
export const CardHeader: React.FC<{
  children: React.ReactNode
  bordered?: boolean
  className?: string
}> = ({ children, bordered = false, className = '' }) => {
  return (
    <div className={`${bordered ? 'border-b border-warm-200 pb-4 mb-4' : ''} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Card Body section.
 */
export const CardBody: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>
}

/**
 * Card Footer section with optional border.
 */
export const CardFooter: React.FC<{
  children: React.ReactNode
  bordered?: boolean
  className?: string
}> = ({ children, bordered = false, className = '' }) => {
  return (
    <div className={`${bordered ? 'border-t border-warm-200 pt-4 mt-4' : 'mt-4'} ${className}`}>
      {children}
    </div>
  )
}

/**
 * Card Action for interactive links/buttons within cards.
 */
export const CardAction: React.FC<{
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
}> = ({ children, href, onClick, className = '' }) => {
  const baseClasses = `
    inline-flex items-center gap-2
    text-ocean-blue font-semibold
    hover:text-ocean-deep
    transition-colors duration-300
  `.replace(/\s+/g, ' ').trim()

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} group/action ${className}`}>
        {children}
        <svg
          className="w-4 h-4 transition-transform duration-300 group-hover/action:translate-x-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
    )
  }

  return (
    <button onClick={onClick} className={`${baseClasses} group/action ${className}`}>
      {children}
    </button>
  )
}

export default Card
