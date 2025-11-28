import React from 'react'
import Link from 'next/link'

interface CardProps {
  children: React.ReactNode
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  href?: string
  onClick?: () => void
  ariaLabel?: string
  role?: string
}

export const Card: React.FC<CardProps> = ({
  children,
  hover = true,
  padding = 'md',
  className = '',
  href,
  onClick,
  ariaLabel,
  role = 'article',
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6 md:p-8',
    lg: 'p-8 md:p-10',
  }

  // Style guide: bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all border border-gray-100
  const baseClasses = 'bg-white rounded-xl shadow-md border border-gray-100'
  const hoverClass = hover ? 'hover:shadow-xl transition-all duration-300' : 'transition-all duration-300'
  const cursorClass = href || onClick ? 'cursor-pointer' : ''

  const combinedClasses = `${baseClasses} ${paddingClasses[padding]} ${hoverClass} ${cursorClass} ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className="block group">
        <article
          className={combinedClasses}
          role={role}
          aria-label={ariaLabel}
        >
          {children}
        </article>
      </Link>
    )
  }

  if (onClick) {
    return (
      <article
        className={`${combinedClasses} group`}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick()
          }
        }}
        role={role}
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {children}
      </article>
    )
  }

  return (
    <article
      className={`${combinedClasses} group`}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </article>
  )
}

// Card Title - follows style guide: text-xl md:text-2xl font-semibold text-ucsb-navy
export const CardTitle: React.FC<{
  children: React.ReactNode
  className?: string
  as?: 'h2' | 'h3' | 'h4'
}> = ({ children, className = '', as: Component = 'h3' }) => {
  return (
    <Component className={`text-xl md:text-2xl font-semibold text-ucsb-navy group-hover:text-ocean-blue transition-colors ${className}`}>
      {children}
    </Component>
  )
}

// Card Description - follows style guide: text-gray-600
export const CardDescription: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return <p className={`text-gray-600 ${className}`}>{children}</p>
}

// Card Image - with proper aspect ratio and hover zoom
export const CardImage: React.FC<{
  src: string
  alt: string
  aspectRatio?: 'video' | 'square' | 'portrait'
  className?: string
}> = ({ src, alt, aspectRatio = 'video', className = '' }) => {
  const aspectClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[4/5]',
  }

  return (
    <div className={`${aspectClasses[aspectRatio]} rounded-lg overflow-hidden bg-gray-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  )
}

// Card Badge - gradient style per style guide
export const CardBadge: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <span className={`inline-block text-xs font-bold text-white bg-gradient-to-r from-ocean-blue to-ocean-teal px-3 py-1 rounded-full ${className}`}>
      {children}
    </span>
  )
}

// Card Metadata - for dates, authors, etc.
export const CardMeta: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className = '' }) => {
  return (
    <div className={`flex items-center gap-4 text-sm text-gray-500 ${className}`}>
      {children}
    </div>
  )
}

// Semantic structure subcomponents
export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`border-b border-gray-100 pb-4 mb-4 ${className}`}>{children}</div>
}

export const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={className}>{children}</div>
}

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => {
  return <div className={`border-t border-gray-100 pt-4 mt-4 ${className}`}>{children}</div>
}

export default Card
