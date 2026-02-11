'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export interface ResearchThemeData {
  id: string
  title: string
  subtitle: string
  description: string
  questions: string[]
  image: string
  color: string
  faculty: {
    name: string
    focus: string
    slug: string
  }[]
}

interface ResearchThemeAccordionProps {
  themes: ResearchThemeData[]
}

export default function ResearchThemeAccordion({ themes }: ResearchThemeAccordionProps) {
  const [activeTheme, setActiveTheme] = useState<string | null>(null)

  // Map theme colors to actual Tailwind classes (avoiding dynamic class generation issues)
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { badge: string; overlay: string }> = {
      'ocean-teal': { badge: 'bg-ocean-teal', overlay: 'bg-ocean-teal/30' },
      'kelp-500': { badge: 'bg-kelp-500', overlay: 'bg-kelp-500/30' },
      'ucsb-gold': { badge: 'bg-ucsb-gold', overlay: 'bg-ucsb-gold/30' },
      'ucsb-coral': { badge: 'bg-ucsb-coral', overlay: 'bg-ucsb-coral/30' },
      'ocean-blue': { badge: 'bg-ocean-blue', overlay: 'bg-ocean-blue/30' },
    }
    return colorMap[color] || { badge: 'bg-ocean-teal', overlay: 'bg-ocean-teal/30' }
  }

  return (
    <div className="space-y-6">
      {themes.map((theme) => {
        const colors = getColorClasses(theme.color)
        return (
          <article
            key={theme.id}
            className={`bg-white rounded-2xl overflow-hidden shadow-warm-md hover:shadow-warm-xl transition-all duration-500 border border-warm-200 ${
              activeTheme === theme.id ? 'ring-2 ring-ocean-blue' : ''
            }`}
          >
            <button
              onClick={() => setActiveTheme(activeTheme === theme.id ? null : theme.id)}
              className="w-full text-left"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative h-48 md:h-auto md:w-64 shrink-0">
                  <Image
                    src={theme.image}
                    alt={theme.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 256px"
                    className="object-cover"
                  />
                  <div className={`absolute inset-0 ${colors.overlay}`} />
                </div>

                {/* Content preview */}
                <div className="p-6 md:p-8 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${colors.badge} mb-3`}>
                        {theme.faculty.length} Faculty
                      </span>
                      <h3 className="font-heading text-xl md:text-2xl font-bold text-ucsb-navy mb-2">
                        {theme.title}
                      </h3>
                      <p className="text-ocean-blue font-medium text-sm mb-3">
                        {theme.subtitle}
                      </p>
                      <p className="text-warm-600 leading-relaxed">
                        {theme.description}
                      </p>
                    </div>
                    <svg
                      className={`w-6 h-6 text-warm-400 shrink-0 ml-4 transition-transform duration-300 ${
                        activeTheme === theme.id ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>

            {/* Expanded content */}
            <div
              className={`overflow-hidden transition-all duration-500 ${
                activeTheme === theme.id ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="border-t border-warm-200 p-6 md:p-8 bg-warm-50">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Research questions */}
                  <div>
                    <h4 className="font-heading font-bold text-ucsb-navy mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-ocean-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Questions We Ask
                    </h4>
                    <ul className="space-y-3">
                      {theme.questions.map((question, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-warm-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-ocean-teal mt-2 shrink-0" />
                          {question}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Faculty in this theme */}
                  <div>
                    <h4 className="font-heading font-bold text-ucsb-navy mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-ocean-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Faculty in This Area
                    </h4>
                    <div className="grid gap-3">
                      {theme.faculty.map((person) => (
                        <Link
                          key={person.slug}
                          href={`/people/faculty/${person.slug}`}
                          className="group flex items-center justify-between p-3 bg-white rounded-xl border border-warm-200 hover:border-ocean-teal/30 hover:shadow-warm-md transition-all"
                        >
                          <div>
                            <div className="font-semibold text-ucsb-navy group-hover:text-ocean-blue transition-colors">
                              {person.name}
                            </div>
                            <div className="text-sm text-warm-600">
                              {person.focus}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-warm-400 group-hover:text-ocean-teal group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
