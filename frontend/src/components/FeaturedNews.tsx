'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'

interface NewsItem {
  id: number
  attributes: {
    title: string
    excerpt: string
    publishDate: string
    slug: string
    category?: string
  }
}

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

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Research: { bg: 'bg-ocean-blue/10', text: 'text-ocean-blue', border: 'border-ocean-blue/20' },
  Awards: { bg: 'bg-ucsb-gold/10', text: 'text-ucsb-gold', border: 'border-ucsb-gold/20' },
  Funding: { bg: 'bg-kelp-500/10', text: 'text-kelp-600', border: 'border-kelp-500/20' },
  Faculty: { bg: 'bg-ocean-teal/10', text: 'text-ocean-teal', border: 'border-ocean-teal/20' },
  Students: { bg: 'bg-bioluminescent/10', text: 'text-bioluminescent', border: 'border-bioluminescent/20' },
  default: { bg: 'bg-warm-200', text: 'text-warm-600', border: 'border-warm-300' },
}

export default function FeaturedNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const { ref, isInView } = useInView(0.1)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:1337/api/news-articles?pagination[limit]=3&sort=publishDate:desc')
        const data = await response.json()
        setNews(data.data || [])
      } catch (error) {
        console.error('Error fetching news:', error)
        setNews([
          {
            id: 1,
            attributes: {
              title: 'EEMB Researchers Discover New Marine Species',
              excerpt: 'A team of marine biologists has identified a new species of coral in the Santa Barbara Channel.',
              publishDate: '2024-11-10',
              slug: 'new-marine-species',
              category: 'Research'
            }
          },
          {
            id: 2,
            attributes: {
              title: 'Graduate Student Wins National Science Award',
              excerpt: 'PhD candidate receives prestigious NSF fellowship for climate adaptation research.',
              publishDate: '2024-11-08',
              slug: 'graduate-award',
              category: 'Awards'
            }
          },
          {
            id: 3,
            attributes: {
              title: 'New Grant Funds Climate Research',
              excerpt: 'EEMB receives $2.5 million to study ecosystem responses to ocean temperature changes.',
              publishDate: '2024-11-05',
              slug: 'climate-grant',
              category: 'Funding'
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl animate-pulse border border-warm-200">
            <div className="flex gap-4">
              <div className="w-14 h-16 bg-warm-200 rounded-xl" />
              <div className="flex-1">
                <div className="h-4 bg-warm-200 rounded-lg w-3/4 mb-3" />
                <div className="h-3 bg-warm-200 rounded-lg w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="space-y-4">
      {news.map((item, index) => {
        const colors = categoryColors[item.attributes.category || 'default'] || categoryColors.default

        return (
          <article
            key={item.id}
            className={`group relative bg-white rounded-2xl p-5 border border-warm-200 hover:border-ocean-blue/30 hover:shadow-warm-lg transition-all duration-500 overflow-hidden ${
              isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            {/* Hover glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-ocean-blue/0 via-ocean-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative flex gap-4">
              {/* Date badge */}
              <div className="flex-shrink-0 w-14 text-center">
                <div className="bg-gradient-to-br from-ocean-deep to-ocean-blue rounded-xl p-3 shadow-md">
                  <div className="text-[10px] text-white/70 uppercase font-semibold tracking-wider">
                    {new Date(item.attributes.publishDate).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                  <div className="text-2xl font-heading font-bold text-white">
                    {new Date(item.attributes.publishDate).getDate()}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Category tag */}
                {item.attributes.category && (
                  <span className={`inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} mb-2`}>
                    {item.attributes.category}
                  </span>
                )}

                <h3 className="font-heading font-bold text-ocean-deep text-base leading-snug mb-2 group-hover:text-ocean-blue transition-colors duration-300">
                  <Link href={`/news/${item.attributes.slug}`} className="line-clamp-2">
                    {item.attributes.title}
                  </Link>
                </h3>

                <p className="text-sm text-warm-500 line-clamp-1 leading-relaxed">
                  {item.attributes.excerpt}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                <svg className="w-5 h-5 text-ocean-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
