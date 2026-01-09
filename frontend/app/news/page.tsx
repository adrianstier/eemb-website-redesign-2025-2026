import { createClient } from '@/lib/supabase/server'
import NewsPageClient from './NewsPageClient'

// Server component for data fetching
export default async function NewsPage() {
  const supabase = await createClient()

  // Fetch all news articles from Supabase
  const { data: articles, error } = await supabase
    .from('news_articles')
    .select('*')
    .order('publish_date', { ascending: false })

  if (error) {
    console.error('Error fetching news:', error)
  }

  // Transform Supabase data to match the expected NewsItem interface
  const newsData = (articles || []).map(article => {
    // Parse tags - could be JSON array or null
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
