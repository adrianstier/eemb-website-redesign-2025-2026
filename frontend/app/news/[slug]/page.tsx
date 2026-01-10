import { notFound } from 'next/navigation'
import { getNewsBySlug, getAllNewsSlugs, getAllNews } from '@/lib/data'
import NewsArticleClient from './NewsArticleClient'

export const revalidate = 900 // Revalidate every 15 minutes

export async function generateStaticParams() {
  const slugs = await getAllNewsSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)

  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: `${article.title} | EEMB News`,
    description: article.excerpt || `Read about ${article.title} from the EEMB department at UC Santa Barbara.`,
    openGraph: {
      title: article.title,
      description: article.excerpt || undefined,
      images: article.image_url ? [article.image_url] : undefined,
    }
  }
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)

  if (!article) {
    notFound()
  }

  // Get related articles (same category or recent)
  const allNews = await getAllNews({ limit: 10 })
  const relatedArticles = allNews
    .filter(a => a.id !== article.id)
    .filter(a => a.category === article.category || !article.category)
    .slice(0, 3)

  // If not enough related, fill with recent
  if (relatedArticles.length < 3) {
    const additional = allNews
      .filter(a => a.id !== article.id && !relatedArticles.some(r => r.id === a.id))
      .slice(0, 3 - relatedArticles.length)
    relatedArticles.push(...additional)
  }

  return (
    <NewsArticleClient
      article={article}
      relatedArticles={relatedArticles}
    />
  )
}
