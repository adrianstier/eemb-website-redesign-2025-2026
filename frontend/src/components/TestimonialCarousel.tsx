'use client'

import { useState, useEffect, useCallback, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { TestimonialWithStudent } from '@/lib/data'
import useReducedMotion from '@/hooks/useReducedMotion'

interface TestimonialCarouselProps {
  testimonials: TestimonialWithStudent[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

export default function TestimonialCarousel({
  testimonials,
  autoPlay = true,
  autoPlayInterval = 6000,
  className = '',
}: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const goToNext = useCallback(() => {
    if (isAnimating || testimonials.length <= 1) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, testimonials.length])

  const goToPrevious = useCallback(() => {
    if (isAnimating || testimonials.length <= 1) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, testimonials.length])

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return
    setIsAnimating(true)
    setCurrentIndex(index)
    setTimeout(() => setIsAnimating(false), 500)
  }, [isAnimating, currentIndex])

  // Auto-play logic
  useEffect(() => {
    if (!autoPlay || isPaused || prefersReducedMotion || testimonials.length <= 1) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    intervalRef.current = setInterval(goToNext, autoPlayInterval)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoPlay, autoPlayInterval, isPaused, prefersReducedMotion, goToNext, testimonials.length])

  // Keyboard navigation handler scoped to carousel container
  const handleKeyDown = useCallback((e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious()
    } else if (e.key === 'ArrowRight') {
      goToNext()
    }
  }, [goToNext, goToPrevious])

  if (testimonials.length === 0) {
    return null
  }

  const currentTestimonial = testimonials[currentIndex]
  const studentName = currentTestimonial.student
    ? `${currentTestimonial.student.first_name} ${currentTestimonial.student.last_name}`
    : 'Graduate Student'

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Student testimonials carousel"
      aria-roledescription="carousel"
    >
      {/* Main testimonial card */}
      <div className="relative bg-white rounded-3xl shadow-warm-lg overflow-hidden">
        {/* Decorative quote marks */}
        <div className="absolute top-6 left-6 text-ocean-teal/10 pointer-events-none">
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        <div className="relative p-8 md:p-12">
          {/* Quote */}
          <blockquote
            className={`text-lg md:text-xl text-warm-700 leading-relaxed mb-8 transition-opacity duration-500 ${
              prefersReducedMotion ? '' : isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
            aria-live="polite"
          >
            &ldquo;{currentTestimonial.quote}&rdquo;
          </blockquote>

          {/* Student info */}
          <div
            className={`flex items-center gap-4 transition-opacity duration-500 ${
              prefersReducedMotion ? '' : isAnimating ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {/* Student photo */}
            <div className="flex-shrink-0">
              {currentTestimonial.student?.photo_url ? (
                <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-ocean-teal/20">
                  <Image
                    src={currentTestimonial.student.photo_url}
                    alt={`Portrait of ${studentName}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center ring-2 ring-ocean-teal/20">
                  <span className="text-white font-bold text-lg">
                    {currentTestimonial.student?.first_name?.[0] || 'G'}
                    {currentTestimonial.student?.last_name?.[0] || 'S'}
                  </span>
                </div>
              )}
            </div>

            {/* Name and program */}
            <div>
              {currentTestimonial.student?.slug ? (
                <Link
                  href={`/people/students/${currentTestimonial.student.slug}`}
                  className="font-display font-bold text-ocean-deep hover:text-ocean-teal transition-colors"
                >
                  {studentName}
                </Link>
              ) : (
                <p className="font-display font-bold text-ocean-deep">{studentName}</p>
              )}
              {currentTestimonial.student?.degree_program && (
                <p className="text-sm text-warm-500">
                  {currentTestimonial.student.degree_program} Candidate
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Navigation controls */}
        {testimonials.length > 1 && (
          <>
            {/* Previous button */}
            <button
              onClick={goToPrevious}
              disabled={isAnimating}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 text-ocean-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next button */}
            <button
              onClick={goToNext}
              disabled={isAnimating}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-md hover:bg-white hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 text-ocean-deep" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Dot indicators */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial slides">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-ocean-teal w-8'
                  : 'bg-warm-300 hover:bg-warm-400'
              }`}
              role="tab"
              aria-selected={index === currentIndex}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Screen reader status */}
      <div className="sr-only" aria-live="polite">
        Showing testimonial {currentIndex + 1} of {testimonials.length}
      </div>
    </div>
  )
}
