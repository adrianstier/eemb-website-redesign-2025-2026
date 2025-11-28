'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CalendarIcon, UserIcon, AcademicCapIcon, BeakerIcon, NewspaperIcon } from '@/components/icons'
import { Card } from '@/components/ui/Card'

interface GoodNewsItem {
  id: number
  attributes: {
    title: string
    description: string
    date: string
    category: 'Award' | 'Publication' | 'Grant' | 'Recognition' | 'Milestone' | 'Other'
    person?: string
    personRole?: string
    link?: string
    publishedAt: string
  }
}

export default function GoodNewsPage() {
  const [goodNews, setGoodNews] = useState<GoodNewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    fetchGoodNews()
  }, [])

  const fetchGoodNews = async () => {
    try {
      // In production, fetch from API
      // const response = await fetch('http://localhost:1337/api/good-news?sort=date:desc&populate=*')
      // const data = await response.json()
      // setGoodNews(data.data || [])

      // Mock data for now
      setGoodNews([
        {
          id: 1,
          attributes: {
            title: 'Dr. Sarah Chen Receives NSF CAREER Award',
            description: 'Professor Sarah Chen has been awarded the prestigious NSF CAREER Award for her groundbreaking research on coral reef resilience to climate change. The $600,000 grant will support her lab\'s work over the next five years.',
            date: '2024-11-10',
            category: 'Award',
            person: 'Dr. Sarah Chen',
            personRole: 'Assistant Professor',
            publishedAt: '2024-11-10T00:00:00Z'
          }
        },
        {
          id: 2,
          attributes: {
            title: 'Graduate Student Wins Best Student Talk at ESA',
            description: 'PhD candidate Maria Rodriguez won the Best Student Talk award at the Ecological Society of America annual meeting for her presentation on plant-pollinator networks in changing climates.',
            date: '2024-11-05',
            category: 'Recognition',
            person: 'Maria Rodriguez',
            personRole: 'PhD Candidate',
            publishedAt: '2024-11-05T00:00:00Z'
          }
        },
        {
          id: 3,
          attributes: {
            title: 'Major Grant for Marine Biodiversity Research',
            description: 'A collaborative team led by Dr. James Wilson has secured a $2.5 million grant from NOAA to study marine biodiversity in the California Current System. The five-year project will involve multiple institutions.',
            date: '2024-10-28',
            category: 'Grant',
            person: 'Dr. James Wilson',
            personRole: 'Professor',
            publishedAt: '2024-10-28T00:00:00Z'
          }
        },
        {
          id: 4,
          attributes: {
            title: 'Nature Paper on Evolution of Symbiosis',
            description: 'Dr. Angela Martinez and her team published a landmark paper in Nature revealing new insights into the evolution of plant-fungal symbioses, with implications for sustainable agriculture.',
            date: '2024-10-15',
            category: 'Publication',
            person: 'Dr. Angela Martinez',
            personRole: 'Associate Professor',
            link: 'https://nature.com/example',
            publishedAt: '2024-10-15T00:00:00Z'
          }
        },
        {
          id: 5,
          attributes: {
            title: 'Department Reaches 50% Women Faculty Milestone',
            description: 'With recent hires, the EEMB department has achieved gender parity among tenure-track faculty for the first time in its history, setting an example for STEM departments nationwide.',
            date: '2024-10-01',
            category: 'Milestone',
            publishedAt: '2024-10-01T00:00:00Z'
          }
        },
        {
          id: 6,
          attributes: {
            title: 'Postdoc Lands Tenure-Track Position at Top University',
            description: 'Former EEMB postdoc Dr. Michael Chen has accepted a tenure-track assistant professor position at Stanford University, where he will continue his research on microbial ecology.',
            date: '2024-09-22',
            category: 'Recognition',
            person: 'Dr. Michael Chen',
            personRole: 'Former Postdoctoral Researcher',
            publishedAt: '2024-09-22T00:00:00Z'
          }
        },
        {
          id: 7,
          attributes: {
            title: 'Lab Featured in Science Magazine',
            description: 'Dr. Lisa Wong\'s kelp forest ecology lab was featured in Science magazine\'s "Labs to Watch" series, highlighting their innovative approaches to studying marine ecosystem dynamics.',
            date: '2024-09-10',
            category: 'Recognition',
            person: 'Dr. Lisa Wong',
            personRole: 'Professor',
            link: 'https://science.org/example',
            publishedAt: '2024-09-10T00:00:00Z'
          }
        },
        {
          id: 8,
          attributes: {
            title: 'Two Graduate Students Awarded NSF Fellowships',
            description: 'EEMB PhD students Emma Thompson and David Lee have been awarded competitive NSF Graduate Research Fellowships, providing three years of full funding for their dissertation research.',
            date: '2024-08-28',
            category: 'Award',
            person: 'Emma Thompson & David Lee',
            personRole: 'PhD Students',
            publishedAt: '2024-08-28T00:00:00Z'
          }
        }
      ])
    } catch (error) {
      console.error('Error fetching good news:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['all', 'Award', 'Publication', 'Grant', 'Recognition', 'Milestone']

  const filteredNews = selectedCategory === 'all'
    ? goodNews
    : goodNews.filter(item => item.attributes.category === selectedCategory)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Award':
        return <AcademicCapIcon className="w-5 h-5" />
      case 'Publication':
        return <NewspaperIcon className="w-5 h-5" />
      case 'Grant':
        return <BeakerIcon className="w-5 h-5" />
      case 'Recognition':
        return <UserIcon className="w-5 h-5" />
      default:
        return <CalendarIcon className="w-5 h-5" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Award':
        return 'bg-yellow-500'
      case 'Publication':
        return 'bg-blue-500'
      case 'Grant':
        return 'bg-green-500'
      case 'Recognition':
        return 'bg-purple-500'
      case 'Milestone':
        return 'bg-pink-500'
      default:
        return 'bg-gray-500'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Good News</h1>
            <p className="text-lg md:text-xl text-white/90">
              Celebrating the achievements, awards, publications, and milestones of our EEMB community.
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg text-gray-700 leading-relaxed">
              Our department thrives on the outstanding accomplishments of our faculty, students, and staff.
              Here we highlight recent successes, from major grants and prestigious awards to important
              publications and personal milestones that make our community proud.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-ocean-blue text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All News' : category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Good News Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">
                No {selectedCategory !== 'all' ? selectedCategory.toLowerCase() : ''} news at this time.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredNews.map(item => (
                <Card key={item.id} className="hover:shadow-xl transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Category Badge */}
                      <div className={`${getCategoryColor(item.attributes.category)} w-12 h-12 rounded-full flex items-center justify-center text-white flex-shrink-0`}>
                        {getCategoryIcon(item.attributes.category)}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold mb-2">
                              {item.attributes.category}
                            </span>
                            <h3 className="text-2xl font-bold text-gray-900">
                              {item.attributes.title}
                            </h3>
                          </div>
                        </div>

                        {item.attributes.person && (
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <UserIcon className="w-4 h-4" />
                            <span className="font-semibold">{item.attributes.person}</span>
                            {item.attributes.personRole && (
                              <>
                                <span>•</span>
                                <span>{item.attributes.personRole}</span>
                              </>
                            )}
                          </div>
                        )}

                        <p className="text-gray-700 leading-relaxed mb-4">
                          {item.attributes.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {formatDate(item.attributes.date)}
                          </div>
                          {item.attributes.link && (
                            <a
                              href={item.attributes.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-ocean-blue hover:underline font-semibold"
                            >
                              Read More
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Submit Good News CTA */}
      <section className="py-16 bg-gradient-to-r from-ocean-blue to-ocean-teal text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Share Your Good News!</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Have an achievement, award, publication, or milestone to share?
            We'd love to celebrate your success with the EEMB community.
          </p>
          <a
            href="mailto:eemb@ucsb.edu?subject=Good News Submission"
            className="inline-block bg-white text-ocean-blue px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Submit Good News
          </a>
        </div>
      </section>
    </div>
  )
}
