'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const themes = [
  {
    title: 'Marine Ecology',
    subtitle: 'From kelp to coral',
    description: 'Kelp forests off our coast. Coral reefs in Moorea. We study how marine communities form, function, and respond to change—from microscopic interactions to ecosystem-scale dynamics.',
    image: '/images/about/marine-reef.jpg',
    href: '/research#marine',
    accent: 'bioluminescent',
    accentColor: '#22d3ee',
    number: '01',
  },
  {
    title: 'Evolution & Genetics',
    subtitle: 'How life diversifies',
    description: 'Plant speciation in the Rockies. Bioluminescence in the deep sea. We uncover the genetic basis of adaptation, innovation, and the remarkable diversity of life.',
    image: '/images/about/evolution-flower.jpg',
    href: '/research#evolution',
    accent: 'ucsb-gold',
    accentColor: '#FEBC11',
    number: '02',
  },
  {
    title: 'Ecosystem Science',
    subtitle: 'Patterns at scale',
    description: 'Disease dynamics. Nutrient cycles. Plant-animal interactions. Understanding ecosystems from grasslands to oceans—and how they respond to a changing world.',
    image: '/images/about/campus-lagoon.jpg',
    href: '/research#ecosystems',
    accent: 'kelp-500',
    accentColor: '#10b981',
    number: '03',
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

export default function ResearchThemes() {
  const { ref: sectionRef, isInView: sectionInView } = useInView(0.1)

  return (
    <section ref={sectionRef} className="py-24 md:py-32 lg:py-40 bg-warm-100 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Decorative blob */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-bioluminescent/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] bg-ocean-teal/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Section header - editorial style */}
        <div className={`max-w-2xl mb-16 md:mb-24 transition-all duration-1000 ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px w-16 bg-gradient-to-r from-ocean-teal to-transparent" />
            <span className="text-ocean-teal text-sm font-semibold tracking-[0.2em] uppercase">
              Research
            </span>
          </div>
          <h2 className="font-heading text-display-sm font-bold text-ocean-deep mb-6">
            What We Study
          </h2>
          <p className="text-warm-600 text-xl leading-relaxed">
            Three interconnected themes. Countless questions. Research that shapes how we understand and protect life on Earth.
          </p>
        </div>

        {/* Research cards - magazine layout */}
        <div className="space-y-16 md:space-y-24">
          {themes.map((theme, index) => (
            <ThemeCard
              key={theme.title}
              theme={theme}
              index={index}
              isEven={index % 2 === 1}
            />
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-20 transition-all duration-1000 delay-500 ${sectionInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Link
            href="/research"
            className="group inline-flex items-center gap-4 bg-ocean-deep text-white px-10 py-5 rounded-2xl font-semibold text-lg hover:bg-ocean-midnight transition-all duration-500 hover:shadow-ocean-lg"
          >
            View all research areas
            <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

function ThemeCard({ theme, index, isEven }: { theme: typeof themes[0]; index: number; isEven: boolean }) {
  const { ref, isInView } = useInView(0.2)

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      <Link href={theme.href} className="group block">
        <div className={`grid lg:grid-cols-12 gap-8 lg:gap-12 items-center ${isEven ? 'lg:direction-rtl' : ''}`}>
          {/* Image side */}
          <div className={`lg:col-span-7 ${isEven ? 'lg:order-2' : ''}`}>
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-warm-xl group-hover:shadow-2xl transition-shadow duration-500">
              <Image
                src={theme.image}
                alt={`${theme.title} research`}
                fill
                className="object-cover transition-transform duration-700 ease-spring group-hover:scale-105"
              />
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Number badge */}
              <div
                className="absolute top-6 left-6 w-14 h-14 rounded-2xl flex items-center justify-center font-heading font-bold text-xl text-white/90 backdrop-blur-sm border border-white/20"
                style={{ backgroundColor: `${theme.accentColor}30` }}
              >
                {theme.number}
              </div>

              {/* Hover CTA */}
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <span className="text-white font-semibold">Explore research</span>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className={`lg:col-span-5 ${isEven ? 'lg:order-1 lg:text-right' : ''}`}>
            {/* Accent line */}
            <div className={`flex items-center gap-3 mb-4 ${isEven ? 'lg:justify-end' : ''}`}>
              <div
                className="w-12 h-1 rounded-full"
                style={{ backgroundColor: theme.accentColor }}
              />
              <span
                className="text-sm font-semibold tracking-wide"
                style={{ color: theme.accentColor }}
              >
                {theme.subtitle}
              </span>
            </div>

            <h3 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-ocean-deep mb-6 group-hover:text-ocean-blue transition-colors duration-300">
              {theme.title}
            </h3>

            <p className="text-warm-600 text-lg leading-relaxed mb-8">
              {theme.description}
            </p>

            {/* Link with animated arrow */}
            <span
              className={`inline-flex items-center gap-3 font-semibold group-hover:gap-4 transition-all duration-300 ${isEven ? 'lg:flex-row-reverse' : ''}`}
              style={{ color: theme.accentColor }}
            >
              <span>Learn more</span>
              <svg className={`w-5 h-5 transition-transform duration-300 ${isEven ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}
