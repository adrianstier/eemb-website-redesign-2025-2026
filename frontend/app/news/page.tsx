'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface NewsItem {
  id: number
  attributes: {
    title: string
    excerpt: string
    content?: string
    publishDate: string
    slug: string
    category?: string
    image?: string
  }
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const response = await fetch('http://localhost:1337/api/news-articles?sort=publishDate:desc&populate=*')
      const data = await response.json()
      setNews(data.data || [])
    } catch (error) {
      console.error('Error fetching news:', error)
      // Set placeholder data
      setNews([
        {
          id: 1,
          attributes: {
            title: 'EEMB Researchers Discover New Deep-Sea Species',
            excerpt: 'A groundbreaking expedition led by EEMB scientists has identified three previously unknown species of deep-sea organisms in the Santa Barbara Channel.',
            content: 'Our research team recently completed a five-week expedition studying the unique ecosystems of the Santa Barbara Channel at depths exceeding 2,000 meters. The discoveries include two new species of hydrozoan and one new species of deepwater squid.',
            publishDate: '2024-11-15',
            slug: 'new-deep-sea-species',
            category: 'Research',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600'
          }
        },
        {
          id: 2,
          attributes: {
            title: 'PhD Student Wins NSF Graduate Fellowship',
            excerpt: 'Congratulations to Sarah Johnson for receiving the prestigious National Science Foundation Graduate Research Fellowship.',
            content: 'Sarah Johnson, a PhD student in our Evolutionary Biology program, has been awarded the highly competitive NSF Graduate Research Fellowship. Her research focuses on the evolutionary adaptations of coastal organisms to climate change.',
            publishDate: '2024-11-10',
            slug: 'phd-nsf-fellowship',
            category: 'Awards',
            image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600'
          }
        },
        {
          id: 3,
          attributes: {
            title: 'EEMB Receives $3.2M Climate Research Grant',
            excerpt: 'The National Science Foundation awards EEMB department a major grant to study ecosystem responses to ocean warming.',
            content: 'The Department of Ecology, Evolution and Marine Biology has received a $3.2 million grant from the National Science Foundation to conduct a five-year study on how marine ecosystems respond to increasing ocean temperatures and acidification.',
            publishDate: '2024-11-05',
            slug: 'climate-grant',
            category: 'Funding',
            image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600'
          }
        },
        {
          id: 4,
          attributes: {
            title: 'Coral Restoration Project Celebrates First Year',
            excerpt: 'EEMB\'s coral restoration initiative has successfully restored over 1,000 coral colonies in local marine reserves.',
            content: 'After one year of intensive work, our coral restoration program has achieved remarkable success with a 95% survival rate for restored colonies. This groundbreaking initiative provides hope for coral reef conservation globally.',
            publishDate: '2024-10-28',
            slug: 'coral-restoration-milestone',
            category: 'Conservation',
            image: 'https://images.unsplash.com/photo-1583212192562-40c695cabccf?w=600'
          }
        },
        {
          id: 5,
          attributes: {
            title: 'New Undergraduate Research Summer Program Launches',
            excerpt: 'EEMB announces an expanded summer research opportunity for undergraduate students interested in field biology.',
            content: 'The department is pleased to announce the launch of our new Summer Undergraduate Research Program (SURP), which will provide 20 undergraduates with hands-on research experience in marine and terrestrial ecosystems.',
            publishDate: '2024-10-20',
            slug: 'summer-research-program',
            category: 'Education',
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600'
          }
        },
        {
          id: 6,
          attributes: {
            title: 'Faculty Member Named Fellow of the American Association for the Advancement of Science',
            excerpt: 'Professor Michael Chen receives prestigious AAAS Fellowship for his contributions to evolutionary biology.',
            content: 'Professor Michael Chen has been elected as a Fellow of the American Association for the Advancement of Science (AAAS), one of the highest honors in the scientific community, recognizing his distinguished contributions to evolutionary biology and population genetics.',
            publishDate: '2024-10-15',
            slug: 'aaas-fellowship',
            category: 'Awards',
            image: 'https://images.unsplash.com/photo-1536776877081-d282a0f896e2?w=600'
          }
        },
        {
          id: 7,
          attributes: {
            title: 'Biodiversity Survey Reveals Unexpected Species Richness',
            excerpt: 'New study shows that understudied habitats contain far more species diversity than previously estimated.',
            content: 'A comprehensive biodiversity survey conducted by EEMB researchers has revealed that certain terrestrial habitats in the local region contain significantly more species diversity than scientific models had predicted, suggesting new conservation priorities.',
            publishDate: '2024-10-08',
            slug: 'biodiversity-survey',
            category: 'Research',
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600'
          }
        },
        {
          id: 8,
          attributes: {
            title: 'International Collaboration Studies Migratory Bird Populations',
            excerpt: 'EEMB researchers partner with institutions across four continents to track changing migration patterns.',
            content: 'Our department is leading a multi-institutional research effort involving colleagues from 12 countries to understand how climate change is affecting migratory bird populations and their critical stopover habitats.',
            publishDate: '2024-09-30',
            slug: 'bird-migration-study',
            category: 'Research',
            image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600'
          }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const categories = ['All Categories', 'Research', 'Education', 'Awards', 'Funding', 'Conservation']

  const filteredNews = news.filter(item => {
    const matchesSearch = item.attributes.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.attributes.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || selectedCategory === 'All Categories' || item.attributes.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-ucsb-navy via-blue-800 to-blue-700 text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Latest News</h1>
            <p className="text-xl md:text-2xl text-gray-100">
              Stay informed about our research discoveries, faculty achievements, and departmental updates from the Department of Ecology, Evolution and Marine Biology.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search news articles..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ucsb-gold focus:border-transparent transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-ucsb-gold focus:border-transparent transition bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4 w-2/3"></div>
                    <div className="h-3 bg-gray-100 rounded mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No news articles found matching your search criteria.</p>
            </div>
          ) : (
            <>
              <div className="mb-8 text-gray-600">
                Showing {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredNews.map(item => (
                  <article key={item.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
                    {item.attributes.image && (
                      <div className="h-48 overflow-hidden bg-gray-200">
                        <img
                          src={item.attributes.image}
                          alt={item.attributes.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {item.attributes.category && (
                        <span className="text-xs font-bold text-white bg-ucsb-coral px-3 py-1 rounded-full">
                          {item.attributes.category}
                        </span>
                      )}
                      <h2 className="text-xl font-bold text-ucsb-navy mt-4 mb-3 group-hover:text-ucsb-gold transition">
                        <Link href={`/news/${item.attributes.slug}`}>
                          {item.attributes.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {item.attributes.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <time className="text-sm text-gray-500">
                          {new Date(item.attributes.publishDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </time>
                        <Link
                          href={`/news/${item.attributes.slug}`}
                          className="text-sm font-semibold text-ucsb-navy hover:text-ucsb-gold transition"
                        >
                          Read More →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Newsletter Signup Section */}
      <section className="py-16 bg-gradient-to-r from-ucsb-navy to-blue-800 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-lg text-gray-200 mb-8">
              Subscribe to our newsletter to receive the latest news and announcements directly in your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-ucsb-gold"
                required
              />
              <button
                type="submit"
                className="bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
