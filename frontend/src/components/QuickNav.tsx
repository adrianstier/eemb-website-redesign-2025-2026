'use client'

import Link from 'next/link'
import { useState } from 'react'

const audienceCards = [
  {
    id: 'prospective-grad',
    title: 'Prospective Graduate Students',
    shortTitle: 'Graduate Students',
    description: 'PhD and MS programs, funding, how to apply',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    links: [
      { label: 'Graduate Programs Overview', href: '/academics/graduate' },
      { label: 'How to Apply', href: '/academics/graduate#apply' },
      { label: 'Funding & Support', href: '/academics/graduate#funding' },
      { label: 'Meet Faculty', href: '/people?category=faculty' },
      { label: 'Contact Graduate Advisor', href: '/support#advisors' },
    ],
    color: 'ocean-blue',
  },
  {
    id: 'undergrad',
    title: 'Undergraduate Students',
    shortTitle: 'Undergraduates',
    description: 'Major requirements, research opportunities, advising',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    links: [
      { label: 'Undergraduate Programs', href: '/academics' },
      { label: 'Research Opportunities', href: '/academics#research' },
      { label: 'Course Offerings', href: '/academics#courses' },
      { label: 'Academic Advising', href: '/support#advisors' },
      { label: 'Student Resources', href: '/support' },
    ],
    color: 'kelp-500',
  },
  {
    id: 'current',
    title: 'Current Students & Postdocs',
    shortTitle: 'Current Members',
    description: 'Resources, forms, facilities, IT support',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    links: [
      { label: 'Department Support', href: '/support' },
      { label: 'Research Facilities', href: '/support#facilities' },
      { label: 'IT & Technical Help', href: '/support#it' },
      { label: 'Conference Rooms', href: '/support#conference-rooms' },
      { label: 'Wellness Resources', href: '/support#wellness' },
    ],
    color: 'ucsb-gold',
  },
  {
    id: 'researchers',
    title: 'Researchers & Collaborators',
    shortTitle: 'Researchers',
    description: 'Faculty expertise, research areas, partnerships',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    links: [
      { label: 'Research Areas', href: '/research' },
      { label: 'Faculty Directory', href: '/people?category=faculty' },
      { label: 'Publications', href: '/research#publications' },
      { label: 'LTER & Field Sites', href: '/research#field-sites' },
      { label: 'Contact Department', href: '/contact' },
    ],
    color: 'ocean-teal',
  },
  {
    id: 'media',
    title: 'Media & Visitors',
    shortTitle: 'Media',
    description: 'News, expert sources, department info',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
      </svg>
    ),
    links: [
      { label: 'Latest News', href: '/news' },
      { label: 'Find an Expert', href: '/people?category=faculty' },
      { label: 'About EEMB', href: '/about' },
      { label: 'Events Calendar', href: '/calendar' },
      { label: 'Contact Us', href: '/contact' },
    ],
    color: 'sunset',
  },
  {
    id: 'giving',
    title: 'Alumni & Donors',
    shortTitle: 'Give Back',
    description: 'Support students, give to the department',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    links: [
      { label: 'Ways to Give', href: '/support-us' },
      { label: 'Student Scholarships', href: '/support-us#scholarships' },
      { label: 'Research Support', href: '/support-us#research' },
      { label: 'Department News', href: '/news' },
      { label: 'Contact Development', href: '/contact' },
    ],
    color: 'ucsb-coral',
  },
]

export default function QuickNav() {
  const [activeCard, setActiveCard] = useState<string | null>(null)

  const colorClasses: Record<string, { bg: string; text: string; border: string; hover: string }> = {
    'ocean-blue': {
      bg: 'bg-ocean-blue/10',
      text: 'text-ocean-blue',
      border: 'border-ocean-blue/20',
      hover: 'hover:border-ocean-blue/40 hover:bg-ocean-blue/15',
    },
    'kelp-500': {
      bg: 'bg-kelp-500/10',
      text: 'text-kelp-600',
      border: 'border-kelp-500/20',
      hover: 'hover:border-kelp-500/40 hover:bg-kelp-500/15',
    },
    'ucsb-gold': {
      bg: 'bg-ucsb-gold/10',
      text: 'text-ucsb-gold',
      border: 'border-ucsb-gold/20',
      hover: 'hover:border-ucsb-gold/40 hover:bg-ucsb-gold/15',
    },
    'ocean-teal': {
      bg: 'bg-ocean-teal/10',
      text: 'text-ocean-teal',
      border: 'border-ocean-teal/20',
      hover: 'hover:border-ocean-teal/40 hover:bg-ocean-teal/15',
    },
    'sunset': {
      bg: 'bg-sunset/10',
      text: 'text-sunset',
      border: 'border-sunset/20',
      hover: 'hover:border-sunset/40 hover:bg-sunset/15',
    },
    'ucsb-coral': {
      bg: 'bg-ucsb-coral/10',
      text: 'text-ucsb-coral',
      border: 'border-ucsb-coral/20',
      hover: 'hover:border-ucsb-coral/40 hover:bg-ucsb-coral/15',
    },
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        {/* Section header */}
        <div className="text-center mb-10">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-ucsb-navy mb-3">
            I&apos;m looking for...
          </h2>
          <p className="text-warm-600 max-w-xl mx-auto">
            Select your role to find the most relevant information
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {audienceCards.map((card) => {
            const colors = colorClasses[card.color]
            const isActive = activeCard === card.id

            return (
              <div key={card.id} className="relative">
                <button
                  onClick={() => setActiveCard(isActive ? null : card.id)}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${colors.border} ${colors.hover} ${
                    isActive ? `${colors.bg} border-2` : 'bg-white'
                  }`}
                >
                  <div className={`${colors.text} mb-3`}>{card.icon}</div>
                  <h3 className="font-semibold text-sm text-warm-800 leading-tight">
                    {card.shortTitle}
                  </h3>
                </button>

                {/* Dropdown panel */}
                {isActive && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-xl shadow-lg border border-warm-200 p-4 min-w-[280px] md:min-w-[300px]">
                    <div className="mb-3 pb-3 border-b border-warm-100">
                      <h4 className="font-semibold text-warm-800">{card.title}</h4>
                      <p className="text-sm text-warm-500 mt-1">{card.description}</p>
                    </div>
                    <ul className="space-y-1">
                      {card.links.map((link, i) => (
                        <li key={i}>
                          <Link
                            href={link.href}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-warm-700 hover:bg-warm-50 hover:text-ocean-blue transition-colors"
                          >
                            <svg className="w-4 h-4 text-warm-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Click outside to close */}
        {activeCard && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setActiveCard(null)}
          />
        )}
      </div>
    </section>
  )
}
