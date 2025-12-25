'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const pathways = [
  {
    question: "Thinking about grad school?",
    answer: "We offer fully-funded PhD and MS programs. Work alongside faculty from day one on research that matters.",
    cta: "Explore graduate programs",
    href: "/academics/graduate",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    accentColor: '#0369a1',
    bgGradient: 'from-ocean-blue/5 to-bioluminescent/5',
  },
  {
    question: "Looking for collaborators?",
    answer: "25 faculty across marine ecology, evolutionary biology, and ecosystem science. Find your research partner.",
    cta: "Browse faculty & research",
    href: "/people",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    accentColor: '#0d9488',
    bgGradient: 'from-ocean-teal/5 to-kelp-400/5',
  },
  {
    question: "Need an expert source?",
    answer: "Our faculty speak on climate, biodiversity, ocean health, and conservation. Connect with leading researchers.",
    cta: "Find an expert",
    href: "/people?category=faculty",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    accentColor: '#FEBC11',
    bgGradient: 'from-ucsb-gold/5 to-sunset-400/5',
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

export default function QuickNav() {
  const { ref, isInView } = useInView(0.1)

  return (
    <section ref={ref} className="py-8 md:py-12 bg-warm-50 relative">
      {/* Subtle top border gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-warm-300 to-transparent" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-3 gap-5">
          {pathways.map((path, i) => (
            <Link
              key={i}
              href={path.href}
              className={`group block p-6 bg-gradient-to-br ${path.bgGradient} rounded-2xl border border-warm-200 hover:border-warm-300 hover:shadow-warm-lg transition-all duration-500 ease-spring ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${path.accentColor}15`, color: path.accentColor }}
              >
                {path.icon}
              </div>

              {/* Content */}
              <h3 className="font-heading text-lg font-bold text-ocean-deep mb-2 group-hover:text-ocean-blue transition-colors duration-300">
                {path.question}
              </h3>
              <p className="text-warm-600 text-sm leading-relaxed mb-4">
                {path.answer}
              </p>

              {/* CTA */}
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all duration-300"
                style={{ color: path.accentColor }}
              >
                {path.cta}
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
