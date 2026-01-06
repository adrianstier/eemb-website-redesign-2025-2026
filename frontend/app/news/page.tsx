'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronRight, ArrowRight, ChevronDown, Filter, X } from 'lucide-react'
import newsData from '@/data/news.json'

interface NewsItem {
  id: number
  title: string
  slug: string
  date: string
  excerpt: string
  imageUrl: string
  originalImageUrl: string
  topic?: string  // Now stored in data, not inferred
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

// Get topic from article data (falls back to inference if not set)
function getTopic(item: NewsItem): string {
  // Use the topic from data if available
  if (item.topic) {
    return item.topic
  }
  // Fallback inference for articles without explicit topic
  const text = (item.title + ' ' + item.excerpt).toLowerCase()
  if (text.includes('award') || text.includes('fellow') || text.includes('receives') || text.includes('honored')) return 'faculty'
  if (text.includes('coral') || text.includes('ocean') || text.includes('marine') || text.includes('kelp') || text.includes('shark') || text.includes('fish')) return 'marine'
  if (text.includes('climate') || text.includes('carbon') || text.includes('warming')) return 'climate'
  if (text.includes('conservation') || text.includes('protected') || text.includes('wildlife')) return 'conservation'
  if (text.includes('evolution') || text.includes('genome') || text.includes('gene')) return 'evolution'
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
      const itemTopic = getTopic(item)
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
      {/* Compact Page Header - gets users to content fast */}
      <section className="bg-warm-50 pt-6 pb-4">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-warm-500 mb-4">
            <Link href="/" className="hover:text-ocean-blue transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-warm-800 font-medium">News</span>
          </nav>

          {/* Title row with stats */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-ucsb-navy mb-1">
                Research News
              </h1>
              <p className="text-warm-600">
                Discoveries and stories from EEMB researchers
              </p>
            </div>

            {/* Compact stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-ucsb-navy">{newsData.length}</span>
                <span className="text-warm-500">articles</span>
              </div>
              <div className="w-px h-6 bg-warm-300" />
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-bold text-ucsb-navy">{years.length}</span>
                <span className="text-warm-500">years</span>
              </div>
            </div>
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
        <section className="py-8">
          <div className="container mx-auto px-4">
            {/* Section label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-2 h-2 bg-ucsb-gold rounded-full" />
              <span className="text-sm font-semibold text-warm-500 uppercase tracking-wider">Featured Stories</span>
              <div className="flex-1 h-px bg-gradient-to-r from-warm-200 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[280px]">
              {/* Hero Card - 2x2 with enhanced styling */}
              {featuredNews[0] && (
                <article className="md:col-span-2 md:row-span-2 group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-500">
                  {/* Multi-layer gradient for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ucsb-navy via-ucsb-navy/60 to-ocean-deep/20 z-10" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-ocean-blue/30 z-10" />

                  {/* Gold accent line on hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ucsb-gold via-ucsb-gold to-transparent z-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                  <Image
                    src={featuredNews[0].imageUrl || '/images/news/placeholder.jpg'}
                    alt={featuredNews[0].title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <TopicBadge topic={getTopic(featuredNews[0])} />
                      <time className="text-sm text-white/80 font-medium drop-shadow-sm">{featuredNews[0].date}</time>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-3 group-hover:text-ucsb-gold transition-colors duration-300 line-clamp-3 drop-shadow-md">
                      <Link href={`/news/${featuredNews[0].slug}`} className="hover:underline decoration-2 underline-offset-4">
                        {featuredNews[0].title}
                      </Link>
                    </h2>
                    <p className="text-white/90 line-clamp-2 mb-4 max-w-xl hidden md:block drop-shadow-sm">
                      {featuredNews[0].excerpt}
                    </p>
                    <Link
                      href={`/news/${featuredNews[0].slug}`}
                      className="inline-flex items-center gap-2 text-ucsb-gold font-semibold group-hover:gap-3 transition-all w-fit drop-shadow-sm"
                    >
                      Read Story <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              )}

              {/* Secondary Cards - 1x1 */}
              {featuredNews.slice(1, 5).map((item) => (
                <MediumCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Decorative divider between sections */}
      <div className="container mx-auto px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-warm-300 to-transparent" />
      </div>

      {/* Standard Grid - Remaining Articles */}
      {remainingNews.length > 0 && (
        <section className="py-12 pb-16">
          <div className="container mx-auto px-4">
            {/* Enhanced section header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-ocean-blue rounded-full" />
                <h2 className="text-xl font-serif font-bold text-warm-800">More Stories</h2>
                <div className="w-16 h-px bg-gradient-to-r from-ocean-blue/50 to-transparent" />
              </div>
              <span className="text-sm text-warm-500">
                Showing {Math.min(visibleCount + 5, filteredNews.length)} of {filteredNews.length}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingNews.map((item, index) => (
                <StandardCard key={item.id} item={item} index={index} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-12">
                <button
                  onClick={() => setVisibleCount(prev => prev + 9)}
                  className="group inline-flex items-center gap-2 bg-ucsb-navy text-white px-8 py-4 rounded-xl font-semibold hover:bg-ocean-deep transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
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

// Medium Card (1x1 in bento grid) - Enhanced with accent line
function MediumCard({ item }: { item: NewsItem }) {
  const topic = getTopic(item)

  return (
    <article className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-ucsb-navy via-ucsb-navy/50 to-ocean-deep/10 z-10" />

      {/* Gold accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ucsb-gold z-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />

      <Image
        src={item.imageUrl || '/images/news/placeholder.jpg'}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-5">
        <div className="flex items-center gap-2 mb-2">
          <TopicBadge topic={topic} />
        </div>
        <h3 className="text-lg font-serif font-bold text-white line-clamp-3 group-hover:text-ucsb-gold transition-colors duration-300 drop-shadow-md">
          <Link href={`/news/${item.slug}`}>
            {item.title}
          </Link>
        </h3>
        <time className="text-xs text-white/80 mt-2 font-medium drop-shadow-sm">{item.date}</time>
      </div>
    </article>
  )
}

// Standard Card (for grid below bento) - Enhanced with accent line and better shadows
function StandardCard({ item, index }: { item: NewsItem; index: number }) {
  const topic = getTopic(item)

  return (
    <article
      className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 h-80 hover:-translate-y-1"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Background image */}
      <Image
        src={item.imageUrl || '/images/news/placeholder.jpg'}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Multi-layer gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-ucsb-navy via-ucsb-navy/50 to-ocean-deep/10 z-10" />

      {/* Gold accent line on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-ucsb-gold via-ucsb-gold to-transparent z-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
        <div className="flex items-center gap-2 mb-3">
          <TopicBadge topic={topic} />
          <time className="text-xs text-white/80 font-medium drop-shadow-sm">{item.date}</time>
        </div>
        <h2 className="text-xl font-serif font-bold text-white mb-2 line-clamp-2 group-hover:text-ucsb-gold transition-colors duration-300 leading-snug drop-shadow-md">
          <Link href={`/news/${item.slug}`}>
            {item.title}
          </Link>
        </h2>
        <p className="text-white/85 text-sm line-clamp-2 mb-4 drop-shadow-sm leading-relaxed">
          {item.excerpt}
        </p>
        <Link
          href={`/news/${item.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ucsb-gold hover:text-yellow-300 transition-all drop-shadow-sm group-hover:gap-2"
        >
          Read More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </article>
  )
}
