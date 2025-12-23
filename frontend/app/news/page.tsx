'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Calendar, ChevronRight, ArrowRight, ChevronDown, Filter, X } from 'lucide-react'
import newsData from '@/data/news.json'

interface NewsItem {
  id: number
  title: string
  slug: string
  date: string
  excerpt: string
  imageUrl: string
  originalImageUrl: string
}

// Topic categories with colors - inferred from content
const topics = [
  { id: 'marine', label: 'Marine & Ocean', color: 'bg-ocean-blue', textColor: 'text-ocean-blue' },
  { id: 'climate', label: 'Climate & Environment', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  { id: 'ecology', label: 'Ecology', color: 'bg-amber-500', textColor: 'text-amber-600' },
  { id: 'evolution', label: 'Evolution & Genetics', color: 'bg-purple-500', textColor: 'text-purple-600' },
  { id: 'conservation', label: 'Conservation', color: 'bg-teal-500', textColor: 'text-teal-600' },
  { id: 'faculty', label: 'Faculty & Awards', color: 'bg-ucsb-gold', textColor: 'text-yellow-700' },
]

// Simple topic inference based on keywords
function inferTopic(title: string, excerpt: string): string {
  const text = (title + ' ' + excerpt).toLowerCase()
  if (text.includes('coral') || text.includes('ocean') || text.includes('marine') || text.includes('sea') || text.includes('fish') || text.includes('kelp') || text.includes('shark')) return 'marine'
  if (text.includes('climate') || text.includes('carbon') || text.includes('temperature') || text.includes('warming')) return 'climate'
  if (text.includes('conservation') || text.includes('protected') || text.includes('wildlife') || text.includes('endangered')) return 'conservation'
  if (text.includes('evolution') || text.includes('genome') || text.includes('gene') || text.includes('species')) return 'evolution'
  if (text.includes('award') || text.includes('fellow') || text.includes('professor') || text.includes('grant') || text.includes('honor')) return 'faculty'
  return 'ecology'
}

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [visibleCount, setVisibleCount] = useState(9)
  const [showFilters, setShowFilters] = useState(false)

  // Get unique years from news data
  const years = useMemo(() => {
    const yearSet = new Set<string>()
    newsData.forEach((item: NewsItem) => {
      const year = new Date(item.date).getFullYear().toString()
      yearSet.add(year)
    })
    return Array.from(yearSet).sort((a, b) => parseInt(b) - parseInt(a))
  }, [])

  // Filter news based on search, year, and topics
  const filteredNews = useMemo(() => {
    return (newsData as NewsItem[]).filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      const itemYear = new Date(item.date).getFullYear().toString()
      const matchesYear = selectedYear === 'all' || itemYear === selectedYear
      const itemTopic = inferTopic(item.title, item.excerpt)
      const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(itemTopic)
      return matchesSearch && matchesYear && matchesTopic
    })
  }, [searchTerm, selectedYear, selectedTopics])

  // Featured news for bento grid (first 5 items)
  const featuredNews = filteredNews.slice(0, 5)
  // Remaining news for standard grid
  const remainingNews = filteredNews.slice(5, visibleCount + 5)
  const hasMore = visibleCount + 5 < filteredNews.length

  const toggleTopic = (topicId: string) => {
    setSelectedTopics(prev =>
      prev.includes(topicId)
        ? prev.filter(t => t !== topicId)
        : [...prev, topicId]
    )
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSelectedYear('all')
    setSelectedTopics([])
  }

  const hasActiveFilters = searchTerm || selectedYear !== 'all' || selectedTopics.length > 0

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Compact Hero */}
      <section className="relative bg-gradient-to-br from-ucsb-navy via-ocean-deep to-ocean-blue text-white py-16 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl">
            <nav className="flex items-center gap-2 text-sm text-white/70 mb-4">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white">News</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
              Research News
            </h1>
            <p className="text-lg text-white/80 max-w-2xl">
              Discoveries, breakthroughs, and stories from EEMB researchers studying life on Earth.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <section className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-warm-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          {/* Main filter row */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
            {/* Search */}
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-300 rounded-lg focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Year dropdown */}
            <div className="relative">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 text-sm border border-warm-300 rounded-lg focus:ring-2 focus:ring-ocean-blue/20 focus:border-ocean-blue transition bg-white cursor-pointer"
              >
                <option value="all">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400 pointer-events-none" />
            </div>

            {/* Filter toggle for mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 text-sm border border-warm-300 rounded-lg hover:bg-warm-50 transition"
            >
              <Filter className="w-4 h-4" />
              Topics
              {selectedTopics.length > 0 && (
                <span className="bg-ocean-blue text-white text-xs px-1.5 py-0.5 rounded-full">
                  {selectedTopics.length}
                </span>
              )}
            </button>

            {/* Topic pills - desktop */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap">
              {topics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    selectedTopics.includes(topic.id)
                      ? `${topic.color} text-white border-transparent`
                      : `bg-white ${topic.textColor} border-current hover:bg-warm-50`
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-warm-500 hover:text-warm-700 transition"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Mobile topic pills */}
          {showFilters && (
            <div className="lg:hidden flex items-center gap-2 flex-wrap mt-4 pt-4 border-t border-warm-200">
              {topics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => toggleTopic(topic.id)}
                  className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                    selectedTopics.includes(topic.id)
                      ? `${topic.color} text-white border-transparent`
                      : `bg-white ${topic.textColor} border-current`
                  }`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          <div className="mt-3 text-sm text-warm-500">
            {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''}
            {hasActiveFilters && ' matching your filters'}
          </div>
        </div>
      </section>

      {/* Bento Grid - Featured Articles */}
      {featuredNews.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[280px]">
              {/* Hero Card - 2x2 */}
              {featuredNews[0] && (
                <article className="md:col-span-2 md:row-span-2 group relative rounded-2xl overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                  <Image
                    src={featuredNews[0].imageUrl || '/images/news/placeholder.jpg'}
                    alt={featuredNews[0].title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <TopicBadge topic={inferTopic(featuredNews[0].title, featuredNews[0].excerpt)} />
                      <time className="text-sm text-white/70">{featuredNews[0].date}</time>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3 group-hover:text-ucsb-gold transition line-clamp-3">
                      <Link href={`/news/${featuredNews[0].slug}`} className="hover:underline decoration-2 underline-offset-4">
                        {featuredNews[0].title}
                      </Link>
                    </h2>
                    <p className="text-white/80 line-clamp-2 mb-4 max-w-xl hidden md:block">
                      {featuredNews[0].excerpt}
                    </p>
                    <Link
                      href={`/news/${featuredNews[0].slug}`}
                      className="inline-flex items-center gap-2 text-ucsb-gold font-semibold hover:gap-3 transition-all w-fit"
                    >
                      Read Story <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </article>
              )}

              {/* Medium Cards - 1x1 */}
              {featuredNews.slice(1, 3).map((item) => (
                <MediumCard key={item.id} item={item} />
              ))}

              {/* Compact Cards - horizontal */}
              {featuredNews.slice(3, 5).map((item) => (
                <CompactCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Standard Grid - Remaining Articles */}
      {remainingNews.length > 0 && (
        <section className="py-8 pb-16">
          <div className="container mx-auto px-4">
            <h2 className="text-xl font-serif font-bold text-warm-800 mb-6 flex items-center gap-3">
              <span className="w-8 h-0.5 bg-ocean-blue"></span>
              More Stories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingNews.map((item, index) => (
                <StandardCard key={item.id} item={item} index={index} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev + 9)}
                  className="inline-flex items-center gap-2 bg-warm-800 text-white px-8 py-3 rounded-xl font-semibold hover:bg-warm-900 transition"
                >
                  Load More Articles
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Empty State */}
      {filteredNews.length === 0 && (
        <section className="py-24">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-warm-400" />
              </div>
              <h2 className="text-xl font-serif font-bold text-warm-800 mb-2">No articles found</h2>
              <p className="text-warm-600 mb-6">
                Try adjusting your search terms or filters to find what you're looking for.
              </p>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-ocean-blue font-semibold hover:text-ocean-deep transition"
              >
                Clear all filters <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Archive Section */}
      <section className="py-12 bg-warm-100 border-t border-warm-200">
        <div className="container mx-auto px-4">
          <h2 className="text-xl font-serif font-bold text-warm-800 mb-6">Browse by Year</h2>
          <div className="flex flex-wrap gap-2">
            {years.map(year => {
              const count = (newsData as NewsItem[]).filter(item =>
                new Date(item.date).getFullYear().toString() === year
              ).length
              return (
                <button
                  key={year}
                  onClick={() => {
                    setSelectedYear(year)
                    window.scrollTo({ top: 200, behavior: 'smooth' })
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition border ${
                    selectedYear === year
                      ? 'bg-ocean-blue text-white border-ocean-blue'
                      : 'bg-white text-warm-700 border-warm-200 hover:border-warm-300 hover:shadow-sm'
                  }`}
                >
                  <span className="font-semibold">{year}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    selectedYear === year ? 'bg-white/20' : 'bg-warm-100'
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

// Topic Badge Component
function TopicBadge({ topic }: { topic: string }) {
  const topicData = topics.find(t => t.id === topic) || topics[3]
  return (
    <span className={`${topicData.color} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}>
      {topicData.label}
    </span>
  )
}

// Medium Card (1x1 in bento grid)
function MediumCard({ item }: { item: NewsItem }) {
  const topic = inferTopic(item.title, item.excerpt)

  return (
    <article className="group relative rounded-xl overflow-hidden shadow-md bg-white">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
      <Image
        src={item.imageUrl || '/images/news/placeholder.jpg'}
        alt={item.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-5">
        <div className="flex items-center gap-2 mb-2">
          <TopicBadge topic={topic} />
        </div>
        <h3 className="text-lg font-serif font-bold text-white line-clamp-3 group-hover:text-ucsb-gold transition">
          <Link href={`/news/${item.slug}`}>
            {item.title}
          </Link>
        </h3>
        <time className="text-xs text-white/60 mt-2">{item.date}</time>
      </div>
    </article>
  )
}

// Compact Card (horizontal layout)
function CompactCard({ item }: { item: NewsItem }) {
  const topic = inferTopic(item.title, item.excerpt)

  return (
    <article className="group flex gap-4 bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition border border-warm-100">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={item.imageUrl || '/images/news/placeholder.jpg'}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`${topics.find(t => t.id === topic)?.textColor || 'text-warm-600'} text-xs font-semibold`}>
            {topics.find(t => t.id === topic)?.label || 'Research'}
          </span>
        </div>
        <h3 className="font-semibold text-warm-800 line-clamp-2 text-sm group-hover:text-ocean-blue transition leading-snug">
          <Link href={`/news/${item.slug}`}>{item.title}</Link>
        </h3>
        <time className="text-xs text-warm-400 mt-1.5">{item.date}</time>
      </div>
    </article>
  )
}

// Standard Card (for grid below bento)
function StandardCard({ item, index }: { item: NewsItem; index: number }) {
  const topic = inferTopic(item.title, item.excerpt)

  return (
    <article
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-warm-100"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative h-44 overflow-hidden bg-warm-100">
        <Image
          src={item.imageUrl || '/images/news/placeholder.jpg'}
          alt={item.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <TopicBadge topic={topic} />
        </div>
      </div>
      <div className="p-5">
        <time className="text-xs text-warm-500 mb-2 block">{item.date}</time>
        <h2 className="text-base font-serif font-bold text-warm-800 mb-2 line-clamp-2 group-hover:text-ocean-blue transition leading-snug">
          <Link href={`/news/${item.slug}`}>
            {item.title}
          </Link>
        </h2>
        <p className="text-warm-600 text-sm line-clamp-2 mb-3">
          {item.excerpt}
        </p>
        <Link
          href={`/news/${item.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-blue hover:text-ocean-deep transition"
        >
          Read More <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </article>
  )
}
