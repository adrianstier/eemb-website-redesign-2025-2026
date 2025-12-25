'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

const quotes = [
  {
    quote: "EEMB gave me the freedom to follow my curiosity wherever it led—from the lab to the field, from local tide pools to remote Pacific atolls. The collaborative spirit here is genuine.",
    name: "Dr. Holly Moeller",
    title: "Associate Professor",
    focus: "Microbial Ecology",
    image: "/uploads/faculty/holly-moeller-976.jpg",
  },
  {
    quote: "What drew me to EEMB was the chance to work at the intersection of evolution and ecology. Here, you can ask questions that span scales from genes to ecosystems.",
    name: "Dr. Gretchen Hofmann",
    title: "Professor",
    focus: "Marine Physiology",
    image: "/uploads/faculty/gretchen-hofmann-200.jpg",
  },
  {
    quote: "Our students come here driven by real questions about real problems—coral bleaching, species extinction, climate impacts. We give them the tools to find answers.",
    name: "Dr. Deron Burkepile",
    title: "Professor",
    focus: "Marine Community Ecology",
    image: "/uploads/faculty/deron-burkepile-200.jpg",
  },
]

function useInView(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [threshold])

  return { ref, isInView }
}

export default function FacultyQuote() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const { ref, isInView } = useInView(0.2)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length)
        setIsAnimating(false)
      }, 500)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  const handleDotClick = (index: number) => {
    if (index === currentIndex) return
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentIndex(index)
      setIsAnimating(false)
    }, 500)
  }

  const current = quotes[currentIndex]

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 lg:py-40 bg-ocean-midnight overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-bioluminescent/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ocean-teal/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Wave pattern */}
        <svg className="absolute bottom-0 left-0 right-0 text-white/[0.02] h-64" viewBox="0 0 1440 320" preserveAspectRatio="none">
          <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">
            <animate
              attributeName="d"
              dur="10s"
              repeatCount="indefinite"
              values="
                M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z;
                M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,128C672,117,768,139,864,160C960,181,1056,203,1152,192C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z;
                M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z
              "
            />
          </path>
        </svg>
      </div>

      <div className={`container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl relative transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Quote content */}
        <div className={`transition-all duration-500 ${isAnimating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Photo column */}
            <div className="lg:col-span-4 flex justify-center lg:justify-start">
              <div className="relative">
                {/* Glow ring */}
                <div className="absolute -inset-4 bg-gradient-to-br from-bioluminescent/20 via-ocean-teal/10 to-transparent rounded-full blur-2xl animate-pulse-soft" />

                {/* Photo */}
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                  <Image
                    src={current.image}
                    alt={current.name}
                    fill
                    className="object-cover"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-midnight/20 to-transparent" />
                </div>

                {/* Decorative ring */}
                <div className="absolute -inset-6 border border-white/5 rounded-full" />
                <div className="absolute -inset-10 border border-white/[0.02] rounded-full" />
              </div>
            </div>

            {/* Quote column */}
            <div className="lg:col-span-8 text-center lg:text-left">
              {/* Quote icon */}
              <div className="inline-block mb-8">
                <svg className="w-16 h-16 text-ucsb-gold/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>

              {/* Quote text */}
              <blockquote className="font-heading text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed mb-10 text-white/90">
                {current.quote}
              </blockquote>

              {/* Attribution */}
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                <div className="w-16 h-0.5 bg-gradient-to-r from-ucsb-gold to-transparent hidden lg:block" />
                <div>
                  <p className="font-heading font-bold text-xl text-white mb-1">
                    {current.name}
                  </p>
                  <p className="text-white/50">
                    {current.title}
                    <span className="mx-2 text-white/20">·</span>
                    <span className="text-bioluminescent/70">{current.focus}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mt-16">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`relative h-3 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-bioluminescent focus:ring-offset-2 focus:ring-offset-ocean-midnight ${
                i === currentIndex
                  ? 'w-10 bg-ucsb-gold'
                  : 'w-3 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`View quote ${i + 1}`}
            >
              {i === currentIndex && (
                <span className="absolute inset-0 rounded-full bg-ucsb-gold/50 animate-ping" />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
