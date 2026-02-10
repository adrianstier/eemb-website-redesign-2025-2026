'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import type { NewsArticle } from '@/lib/supabase/types'

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Research: { bg: 'bg-ocean-blue/10', text: 'text-ocean-blue', border: 'border-ocean-blue/20' },
  Awards: { bg: 'bg-ucsb-gold/10', text: 'text-ucsb-gold', border: 'border-ucsb-gold/20' },
  Funding: { bg: 'bg-kelp-500/10', text: 'text-kelp-600', border: 'border-kelp-500/20' },
  Faculty: { bg: 'bg-ocean-teal/10', text: 'text-ocean-teal', border: 'border-ocean-teal/20' },
  Students: { bg: 'bg-bioluminescent/10', text: 'text-bioluminescent', border: 'border-bioluminescent/20' },
  default: { bg: 'bg-warm-200', text: 'text-warm-600', border: 'border-warm-300' },
}

interface FeaturedNewsProps {
  initialNews?: NewsArticle[]
}

export default function FeaturedNews({ initialNews = [] }: FeaturedNewsProps) {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(!initialNews.length)
  const { ref, isInView } = useInView({ threshold: 0.1 })

  useEffect(() => {
    if (initialNews.length > 0) {
      setNews(initialNews.slice(0, 3))
      setLoading(false)
    }
  }, [initialNews])

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

  if (news.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-warm-200 text-center">
        <p className="text-warm-500">No news articles available</p>
        <Link href="/news" className="text-ocean-blue hover:underline text-sm mt-2 inline-block">
          View news archive →
        </Link>
      </div>
    )
  }

  return (
    <div ref={ref} className="space-y-4">
      {news.map((item, index) => {
        const colors = categoryColors[item.category || 'default'] || categoryColors.default
        const publishDate = item.publish_date ? new Date(item.publish_date) : null

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
              {publishDate && (
                <div className="flex-shrink-0 w-14 text-center">
                  <div className="bg-gradient-to-br from-ocean-deep to-ocean-blue rounded-xl p-3 shadow-md">
                    <div className="text-[10px] text-white/70 uppercase font-semibold tracking-wider">
                      {publishDate.toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                    <div className="text-2xl font-heading font-bold text-white">
                      {publishDate.getDate()}
                    </div>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Category tag */}
                {item.category && (
                  <span className={`inline-block text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} mb-2`}>
                    {item.category}
                  </span>
                )}

                <h3 className="font-heading font-bold text-ocean-deep text-base leading-snug mb-2 group-hover:text-ocean-blue transition-colors duration-300">
                  <Link href={`/news/${item.slug}`} className="line-clamp-2">
                    {item.title}
                  </Link>
                </h3>

                {item.excerpt && (
                  <p className="text-sm text-warm-500 line-clamp-1 leading-relaxed">
                    {item.excerpt}
                  </p>
                )}
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
