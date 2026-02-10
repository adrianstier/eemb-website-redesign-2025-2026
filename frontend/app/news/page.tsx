import { getAllNews } from '@/lib/data/news'
import NewsPageClient from './NewsPageClient'
import type { Metadata } from 'next'

export const revalidate = 900

export const metadata: Metadata = {
  title: 'News | EEMB',
  description: 'Latest news from the Department of Ecology, Evolution, and Marine Biology at UC Santa Barbara.',
}

// Server component for data fetching
export default async function NewsPage() {
  const articles = await getAllNews()

  // Transform to match the expected NewsItem interface
  const newsData = articles.map(article => {
    let topic = 'ecology'
    if (article.tags) {
      const tagsArray = Array.isArray(article.tags) ? article.tags : []
      if (tagsArray.length > 0 && typeof tagsArray[0] === 'string') {
        topic = tagsArray[0]
      }
    }

    return {
      id: article.id,
      title: article.title || '',
      slug: article.slug || '',
      date: article.publish_date
        ? new Date(article.publish_date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })
        : 'Unknown date',
      excerpt: article.excerpt || '',
      imageUrl: article.image_url || '/images/news/placeholder.jpg',
      originalImageUrl: article.image_url || '',
      topic,
      featured: article.featured || false
    }
  })

  return <NewsPageClient newsData={newsData} />
}
