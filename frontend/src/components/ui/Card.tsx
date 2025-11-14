import React from 'react'
import Link from 'next/link'

interface CardProps {
  children: React.ReactNode
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg' | 'xl'
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
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  }

  const baseClasses = 'bg-white rounded-xl shadow-md border border-gray-100'
  const hoverClass = hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300' : ''
  const cursorClass = href || onClick ? 'cursor-pointer' : ''

  const combinedClasses = `${baseClasses} ${paddingClasses[padding]} ${hoverClass} ${cursorClass} ${className}`

  if (href) {
    return (
      <Link href={href} className="block">
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
        className={combinedClasses}
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
      className={combinedClasses}
      role={role}
      aria-label={ariaLabel}
    >
      {children}
    </article>
  )
}

// Subcomponents for semantic structure
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