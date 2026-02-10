'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'
  distance?: number
  once?: boolean
  threshold?: number
  as?: 'section' | 'div' | 'article' | 'aside'
  // Section styling options
  background?: 'white' | 'warm' | 'ocean' | 'gradient' | 'none'
  spacing?: 'sm' | 'md' | 'lg' | 'xl' | 'none'
  container?: boolean
  id?: string
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  duration = 800,
  direction = 'up',
  distance = 40,
  once = true,
  threshold = 0.1,
  as: Component = 'section',
  background = 'none',
  spacing = 'lg',
  container = true,
  id,
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) {
            observer.unobserve(element)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -80px 0px',
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [once, threshold, prefersReducedMotion])

  const getInitialTransform = () => {
    switch (direction) {
      case 'up': return `translateY(${distance}px)`
      case 'down': return `translateY(-${distance}px)`
      case 'left': return `translateX(${distance}px)`
      case 'right': return `translateX(-${distance}px)`
      case 'scale': return 'scale(0.95)'
      case 'none': return 'none'
      default: return `translateY(${distance}px)`
    }
  }

  const bgClasses = {
    white: 'bg-white',
    warm: 'bg-warm-50',
    ocean: 'bg-ocean-deep text-white',
    gradient: 'bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white',
    none: '',
  }

  const spacingClasses = {
    sm: 'py-8 md:py-12',
    md: 'py-12 md:py-16',
    lg: 'py-16 md:py-20',
    xl: 'py-20 md:py-28',
    none: '',
  }

  return (
    <Component
      ref={ref as React.RefObject<HTMLDivElement>}
      id={id}
      className={`${bgClasses[background]} ${spacingClasses[spacing]} ${className}`}
      style={prefersReducedMotion ? undefined : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getInitialTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {container ? (
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
          {children}
        </div>
      ) : children}
    </Component>
  )
}

// Staggered children animation wrapper
interface StaggeredChildrenProps {
  children: ReactNode[]
  baseDelay?: number
  staggerDelay?: number
  className?: string
  itemClassName?: string
}

export function StaggeredChildren({
  children,
  baseDelay = 0,
  staggerDelay = 100,
  className = '',
  itemClassName = '',
}: StaggeredChildrenProps) {
  const ref = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()
  const [isVisible, setIsVisible] = useState(prefersReducedMotion)

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(element)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [prefersReducedMotion])

  return (
    <div ref={ref} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          className={itemClassName}
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'none' : 'translateY(30px)',
            transition: `opacity 600ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + index * staggerDelay}ms, transform 600ms cubic-bezier(0.16, 1, 0.3, 1) ${baseDelay + index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
