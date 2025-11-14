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
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-64 rounded-lg"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <article key={item.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                {item.attributes.category && (
                  <span className="text-sm text-ucsb-coral font-semibold">{item.attributes.category}</span>
                )}
                <h3 className="text-xl font-semibold text-ucsb-navy mt-2 mb-3">
                  <Link href={`/news/${item.attributes.slug}`} className="hover:text-ucsb-gold transition">
                    {item.attributes.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">{item.attributes.excerpt}</p>
                <time className="text-sm text-gray-500">
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
        <div className="text-center mt-8">
          <Link href="/news" className="inline-block bg-ucsb-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition">
            View All News
          </Link>
        </div>
      </div>
    </section>
  )
}