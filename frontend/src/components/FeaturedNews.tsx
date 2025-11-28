'use client'

import { useEffect, useState } from 'react'
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

export default function FeaturedNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)

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
          <div key={i} className="bg-white p-4 rounded-lg animate-pulse h-24 border border-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <article
          key={item.id}
          className="bg-white rounded-lg p-4 border border-gray-100 hover:border-ocean-blue/30 hover:shadow-md transition-all"
        >
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-12 text-center">
              <div className="text-xs text-gray-500 uppercase font-medium">
                {new Date(item.attributes.publishDate).toLocaleDateString('en-US', { month: 'short' })}
              </div>
              <div className="text-xl font-bold text-ucsb-navy">
                {new Date(item.attributes.publishDate).getDate()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-ucsb-navy text-sm leading-tight mb-1 line-clamp-2">
                <Link
                  href={`/news/${item.attributes.slug}`}
                  className="hover:text-ocean-blue transition-colors"
                >
                  {item.attributes.title}
                </Link>
              </h3>
              <p className="text-xs text-gray-500 line-clamp-1">
                {item.attributes.excerpt}
              </p>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
