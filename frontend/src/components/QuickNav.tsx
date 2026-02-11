'use client'

import Link from 'next/link'
import { useInView } from '@/hooks/useInView'

const pathways = [
  {
    question: "Ready to do research that matters?",
    answer: "100% funded PhD and MS programs. Your research starts day one, not after coursework.",
    cta: "Explore graduate programs",
    href: "/academics/graduate",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    number: "01",
    accentFrom: 'from-ocean-blue',
    accentTo: 'to-bioluminescent',
    hoverBorder: 'hover:border-ocean-blue/40',
  },
  {
    question: "Looking for collaborators?",
    answer: "25 faculty studying kelp forests to coral reefs, evolutionary origins to ecosystem dynamics.",
    cta: "Browse faculty & research",
    href: "/people",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    number: "02",
    accentFrom: 'from-ocean-teal',
    accentTo: 'to-kelp-400',
    hoverBorder: 'hover:border-ocean-teal/40',
  },
  {
    question: "Need an expert source?",
    answer: "Scientists who study climate impacts, biodiversity loss, ocean health, and conservation solutions.",
    cta: "Find an expert",
    href: "/people?category=faculty",
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
    number: "03",
    accentFrom: 'from-ucsb-gold',
    accentTo: 'to-sunset-500',
    hoverBorder: 'hover:border-ucsb-gold/40',
  },
]

export default function QuickNav() {
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section ref={ref} className="py-16 md:py-20 bg-warm-50 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      {/* Decorative gradient orbs */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-ocean-blue/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-ocean-teal/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl relative">
        {/* Section intro */}
        <div className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="text-warm-600 text-sm font-medium tracking-wide uppercase mb-2">How can we help?</p>
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ocean-deep">Find your path</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {pathways.map((path, i) => (
            <Link
              key={i}
              href={path.href}
              className={`group relative block transition-all duration-700 ease-spring ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* Card */}
              <div className={`relative h-full p-8 bg-white rounded-3xl border border-warm-200 ${path.hoverBorder} shadow-warm-sm hover:shadow-warm-xl transition-all duration-500 overflow-hidden`}>
                {/* Gradient accent line at top */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${path.accentFrom} ${path.accentTo} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${path.accentFrom}/5 ${path.accentTo}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                {/* Number watermark */}
                <div className="absolute -top-4 -right-2 font-heading text-[120px] font-bold text-warm-100 select-none pointer-events-none leading-none group-hover:text-warm-200/60 transition-colors duration-500">
                  {path.number}
                </div>

                {/* Content */}
                <div className="relative">
                  {/* Icon with gradient background */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${path.accentFrom} ${path.accentTo} flex items-center justify-center mb-6 text-white shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    {path.icon}
                  </div>

                  <h3 className="font-heading text-xl font-bold text-ocean-deep mb-3 group-hover:text-ocean-blue transition-colors duration-300">
                    {path.question}
                  </h3>

                  <p className="text-warm-600 text-[15px] leading-relaxed mb-6">
                    {path.answer}
                  </p>

                  {/* CTA with arrow */}
                  <div className="flex items-center gap-2 text-sm font-semibold text-ocean-blue group-hover:gap-3 transition-all duration-300">
                    <span>{path.cta}</span>
                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
