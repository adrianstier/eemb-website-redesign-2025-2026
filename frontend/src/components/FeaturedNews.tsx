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
        // Set placeholder data if API is not available
        setNews([
          {
            id: 1,
            attributes: {
              title: 'EEMB Researchers Discover New Marine Species',
              excerpt: 'A team of marine biologists has identified a new species of coral in the Santa Barbara Channel...',
              publishDate: '2024-11-10',
              slug: 'new-marine-species',
              category: 'Research'
            }
          },
          {
            id: 2,
            attributes: {
              title: 'Graduate Student Wins National Science Award',
              excerpt: 'PhD candidate Sarah Johnson receives prestigious NSF fellowship for her work on climate adaptation...',
              publishDate: '2024-11-08',
              slug: 'graduate-award',
              category: 'Awards'
            }
          },
          {
            id: 3,
            attributes: {
              title: 'New Grant Funds Climate Change Research',
              excerpt: 'EEMB receives $2.5 million grant to study ecosystem responses to changing ocean temperatures...',
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
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-ocean-coral bg-opacity-10 rounded-full">
              <p className="text-sm font-semibold text-ocean-coral uppercase tracking-wide">News</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-blue mb-3 leading-tight">Latest News</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block mb-3 px-3 py-1 bg-ocean-coral bg-opacity-10 rounded-full">
            <p className="text-sm font-semibold text-ocean-coral uppercase tracking-wide">News</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-ocean-blue mb-3 leading-tight">Latest News</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Stay updated on research breakthroughs, faculty achievements, and department events.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <article key={item.id} className="bg-gradient-to-br from-ocean-50 to-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-150 border border-gray-200">
              <div className="p-6">
                {item.attributes.category && (
                  <span className="inline-block px-3 py-1 bg-ocean-coral/10 text-ocean-coral text-xs font-semibold rounded-full mb-3">
                    {item.attributes.category}
                  </span>
                )}
                <h3 className="text-lg font-bold text-ocean-blue mb-3 leading-tight">
                  <Link href={`/news/${item.attributes.slug}`} className="hover:text-ocean-teal transition-colors duration-150">
                    {item.attributes.title}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{item.attributes.excerpt}</p>
                <time className="text-xs text-gray-500">
                  {new Date(item.attributes.publishDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link href="/news" className="inline-block bg-ocean-blue text-white px-8 py-3 rounded-lg font-semibold text-base hover:bg-ocean-teal transition-colors duration-150 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2">
            View All News
          </Link>
        </div>
      </div>
    </section>
  )
}