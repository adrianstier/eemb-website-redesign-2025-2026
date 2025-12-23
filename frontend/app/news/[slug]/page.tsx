'use client'

import { use, useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Calendar, ArrowLeft, Share2, ExternalLink, Clock, BookOpen, ArrowRight } from 'lucide-react'
import newsData from '@/data/news.json'

interface NewsItem {
  id: number
  title: string
  slug: string
  date: string
  excerpt: string
  content?: string
  imageUrl: string
  originalImageUrl: string
  originalUrl?: string
}

// Topic inference (same as listing page for consistency)
const topics = [
  { id: 'marine', label: 'Marine & Ocean', color: 'bg-ocean-blue', textColor: 'text-ocean-blue' },
  { id: 'climate', label: 'Climate & Environment', color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  { id: 'ecology', label: 'Ecology', color: 'bg-amber-500', textColor: 'text-amber-600' },
  { id: 'evolution', label: 'Evolution & Genetics', color: 'bg-purple-500', textColor: 'text-purple-600' },
  { id: 'conservation', label: 'Conservation', color: 'bg-teal-500', textColor: 'text-teal-600' },
  { id: 'faculty', label: 'Faculty & Awards', color: 'bg-ucsb-gold', textColor: 'text-yellow-700' },
]

function inferTopic(title: string, excerpt: string): string {
  const text = (title + ' ' + excerpt).toLowerCase()
  if (text.includes('coral') || text.includes('ocean') || text.includes('marine') || text.includes('sea') || text.includes('fish') || text.includes('kelp') || text.includes('shark')) return 'marine'
  if (text.includes('climate') || text.includes('carbon') || text.includes('temperature') || text.includes('warming')) return 'climate'
  if (text.includes('conservation') || text.includes('protected') || text.includes('wildlife') || text.includes('endangered')) return 'conservation'
  if (text.includes('evolution') || text.includes('genome') || text.includes('gene') || text.includes('species')) return 'evolution'
  if (text.includes('award') || text.includes('fellow') || text.includes('professor') || text.includes('grant') || text.includes('honor')) return 'faculty'
  return 'ecology'
}

// Calculate reading time
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

// Extract a compelling quote from content for pull quote
function extractPullQuote(content: string): string | null {
  const paragraphs = content.split('\n\n').filter(p => p.length > 100)

  // Look for sentences with quotes or compelling statements
  for (const para of paragraphs.slice(1, 5)) {
    // Look for direct quotes
    const quoteMatch = para.match(/"([^"]{50,200})"/)
    if (quoteMatch) {
      return quoteMatch[1]
    }
  }

  // If no quotes, find a compelling sentence
  for (const para of paragraphs.slice(1, 4)) {
    const sentences = para.match(/[^.!?]+[.!?]+/g) || []
    for (const sentence of sentences) {
      if (sentence.length > 80 && sentence.length < 200) {
        return sentence.trim()
      }
    }
  }

  return null
}

// Progress bar component
function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollProgress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(scrollProgress)
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-warm-200">
      <div
        className="h-full bg-gradient-to-r from-ocean-blue to-ocean-teal transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// Topic badge component
function TopicBadge({ topic }: { topic: string }) {
  const topicData = topics.find(t => t.id === topic) || topics[3]
  return (
    <span className={`${topicData.color} text-white text-xs font-semibold px-3 py-1.5 rounded-full`}>
      {topicData.label}
    </span>
  )
}

// Pull quote component
function PullQuote({ quote }: { quote: string }) {
  return (
    <blockquote className="relative my-12 mx-auto max-w-2xl">
      <div className="absolute -left-4 -top-4 text-8xl font-serif text-ocean-teal/20 leading-none select-none">"</div>
      <p className="relative text-2xl md:text-3xl font-serif text-warm-800 leading-relaxed italic pl-8 pr-4 border-l-4 border-ocean-teal">
        {quote}
      </p>
      <div className="absolute -right-2 -bottom-8 text-8xl font-serif text-ocean-teal/20 leading-none select-none rotate-180">"</div>
    </blockquote>
  )
}

// Enhanced paragraph with drop cap for first paragraph
function ArticleParagraph({ text, isFirst }: { text: string; isFirst: boolean }) {
  if (isFirst && text.length > 50) {
    const firstLetter = text.charAt(0)
    const restOfText = text.slice(1)

    return (
      <p className="text-lg text-warm-700 leading-[1.8] mb-6 first-paragraph">
        <span className="float-left text-6xl md:text-7xl font-serif font-bold text-ocean-deep leading-[0.8] mr-3 mt-1">
          {firstLetter}
        </span>
        {restOfText}
      </p>
    )
  }

  return (
    <p className="text-lg text-warm-700 leading-[1.8] mb-6">
      {text}
    </p>
  )
}

export default function NewsArticlePage({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
  // Handle both sync params (development) and async params (production)
  const resolvedParams = typeof (params as Promise<{ slug: string }>).then === 'function'
    ? use(params as Promise<{ slug: string }>)
    : params as { slug: string }
  const article = (newsData as NewsItem[]).find(item => item.slug === resolvedParams.slug)

  // Parallax effect for hero
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Memoize article processing
  const articleData = useMemo(() => {
    if (!article) return null

    const content = article.content || article.excerpt
    const readingTime = calculateReadingTime(content)
    const topic = inferTopic(article.title, article.excerpt)
    const pullQuote = content.length > 500 ? extractPullQuote(content) : null
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0)

    return { readingTime, topic, pullQuote, paragraphs }
  }, [article])

  if (!article || !articleData) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-warm-400" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-warm-800 mb-4">Article Not Found</h1>
          <p className="text-warm-600 mb-8">The news article you're looking for doesn't exist or has been moved.</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-ocean-blue text-white px-6 py-3 rounded-xl font-semibold hover:bg-ocean-deep transition shadow-lg hover:shadow-xl"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
        </div>
      </div>
    )
  }

  // Get related articles (same topic or adjacent in the list)
  const slug = resolvedParams.slug
  const currentIndex = newsData.findIndex((item: NewsItem) => item.slug === slug)
  const relatedArticles = (newsData as NewsItem[])
    .filter((item, index) => {
      if (index === currentIndex) return false
      // Prefer same topic
      const itemTopic = inferTopic(item.title, item.excerpt)
      return itemTopic === articleData.topic
    })
    .slice(0, 3)

  // If not enough same-topic articles, fill with adjacent
  if (relatedArticles.length < 3) {
    const additionalArticles = (newsData as NewsItem[])
      .filter((item, index) => index !== currentIndex && !relatedArticles.includes(item))
      .slice(0, 3 - relatedArticles.length)
    relatedArticles.push(...additionalArticles)
  }

  const { readingTime, topic, pullQuote, paragraphs } = articleData

  // Insert pull quote after 2nd paragraph if available
  const pullQuoteIndex = paragraphs.length > 3 ? 2 : -1

  return (
    <div className="min-h-screen bg-warm-50">
      <ReadingProgress />

      {/* Hero Section with Parallax Image */}
      <section className="relative bg-ucsb-navy text-white overflow-hidden">
        {/* Strong gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ucsb-navy via-ucsb-navy/80 to-black/60 z-10" />

        {/* Additional scrim at bottom for title area */}
        <div className="absolute bottom-0 left-0 right-0 h-[60%] bg-gradient-to-t from-ucsb-navy via-ucsb-navy/90 to-transparent z-10" />

        {/* Parallax image container */}
        <div
          className="relative h-[450px] md:h-[550px] lg:h-[600px]"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        >
          <Image
            src={article.imageUrl || '/images/news/placeholder.jpg'}
            alt={article.title}
            fill
            className="object-cover scale-110"
            priority
          />
        </div>

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4 pb-12 md:pb-16">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm text-white/80 mb-6 drop-shadow-md">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/news" className="hover:text-white transition">News</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white truncate max-w-[200px]">{article.title}</span>
            </nav>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 mb-5">
              <TopicBadge topic={topic} />
              <div className="flex items-center gap-2 text-white/90 drop-shadow-sm">
                <Calendar className="w-4 h-4" />
                <time className="text-sm font-medium">{article.date}</time>
              </div>
              <div className="flex items-center gap-2 text-white/90 drop-shadow-sm">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">{readingTime} min read</span>
              </div>
            </div>

            {/* Title with text shadow for readability */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold max-w-4xl leading-[1.15] tracking-tight drop-shadow-lg" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5), 0 4px 40px rgba(0,0,0,0.3)' }}>
              {article.title}
            </h1>
          </div>
        </div>

        {/* Decorative wave at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-30">
          <svg viewBox="0 0 1440 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 48h1440V24c-120 16-360 24-720 24S120 40 0 24v24z" fill="#FAFAF8"/>
          </svg>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Lead paragraph / excerpt */}
            <div className="mb-10">
              <p className="text-xl md:text-2xl text-warm-700 leading-relaxed font-medium relative pl-6 border-l-4 border-ocean-teal">
                {article.excerpt}
              </p>
            </div>

            {/* Article Body */}
            <article className="prose-custom">
              {paragraphs.map((paragraph, index) => {
                // Skip if this paragraph is the same as excerpt
                if (index === 0 && paragraph === article.excerpt) return null

                return (
                  <div key={index}>
                    <ArticleParagraph
                      text={paragraph}
                      isFirst={index === 0 || (index === 1 && paragraphs[0] === article.excerpt)}
                    />

                    {/* Insert pull quote after specified paragraph */}
                    {index === pullQuoteIndex && pullQuote && (
                      <PullQuote quote={pullQuote} />
                    )}
                  </div>
                )
              })}
            </article>

            {/* Divider */}
            <div className="my-12 h-px bg-gradient-to-r from-transparent via-warm-300 to-transparent" />

            {/* Source attribution */}
            <div className="flex items-center gap-4 text-warm-500 text-sm italic mb-8">
              <div className="w-12 h-px bg-warm-300" />
              <p>Originally published on the EEMB website</p>
            </div>

            {/* Share Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-warm-100 rounded-2xl border border-warm-200">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-warm-700 font-medium">Share this article:</span>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: article.title,
                        text: article.excerpt,
                        url: window.location.href,
                      })
                    } else {
                      navigator.clipboard.writeText(window.location.href)
                    }
                  }}
                  className="inline-flex items-center gap-2 bg-white text-warm-700 px-4 py-2 rounded-lg border border-warm-200 hover:bg-warm-50 hover:border-warm-300 transition shadow-sm"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
              {article.originalUrl && (
                <a
                  href={article.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ocean-blue text-white px-4 py-2 rounded-lg hover:bg-ocean-deep transition shadow-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Original
                </a>
              )}
            </div>

            {/* Back Button */}
            <div className="mt-10">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-ocean-blue font-semibold hover:text-ocean-deep transition group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to All News
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      <section className="py-16 bg-gradient-to-b from-warm-100 to-warm-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-1 bg-ocean-teal rounded-full" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-warm-800">Continue Reading</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {relatedArticles.map((item, index) => {
              const itemTopic = inferTopic(item.title, item.excerpt)
              return (
                <article
                  key={item.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-warm-200 hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative h-52 overflow-hidden bg-warm-100">
                    <Image
                      src={item.imageUrl || '/images/news/placeholder.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-3 left-3">
                      <TopicBadge topic={itemTopic} />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-warm-500 mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <time>{item.date}</time>
                    </div>
                    <h3 className="text-lg font-serif font-bold text-warm-800 line-clamp-2 group-hover:text-ocean-blue transition mb-3">
                      <Link href={`/news/${item.slug}`}>{item.title}</Link>
                    </h3>
                    <Link
                      href={`/news/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-ocean-blue hover:text-ocean-deep transition"
                    >
                      Read Article
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-ucsb-navy text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">Stay Connected</h2>
            <p className="text-white/80 mb-8">
              Follow the latest discoveries and breakthroughs from our faculty and students.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-lg hover:shadow-xl"
            >
              Browse All News
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
