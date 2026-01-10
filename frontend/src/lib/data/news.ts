import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { NewsArticle, Faculty, Database } from '@/lib/supabase/types'

type NewsCategory = Database['public']['Enums']['news_category']

export type NewsWithFaculty = NewsArticle & {
  related_faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug'>[]
}

/**
 * Get all published news articles
 */
export async function getAllNews(options?: {
  limit?: number
  offset?: number
  category?: NewsCategory
}): Promise<NewsWithFaculty[]> {
  const supabase = await createClient()

  let query = supabase
    .from('news_articles')
    .select('*')
    .eq('published', true)
    .order('pinned', { ascending: false })
    .order('publish_date', { ascending: false })

  if (options?.category) {
    query = query.eq('category', options.category)
  }

  if (options?.limit) {
    query = query.limit(options.limit)
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data: articles, error } = await query

  if (error) {
    console.error('Error fetching news:', error)
    return []
  }

  // Get related faculty for each article
  const articlesWithFaculty = await Promise.all(
    articles.map(async (article) => {
      const { data: facultyIds } = await supabase
        .from('news_faculty')
        .select('faculty_id')
        .eq('news_id', article.id)

      if (!facultyIds || facultyIds.length === 0) {
        return { ...article, related_faculty: [] }
      }

      const { data: faculty } = await supabase
        .from('faculty')
        .select('id, first_name, last_name, slug')
        .in('id', facultyIds.map(f => f.faculty_id))

      return { ...article, related_faculty: faculty || [] }
    })
  )

  return articlesWithFaculty
}

/**
 * Get a single news article by slug
 */
export async function getNewsBySlug(slug: string): Promise<NewsWithFaculty | null> {
  const supabase = await createClient()

  const { data: article, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !article) {
    console.error('Error fetching news by slug:', error)
    return null
  }

  // Get related faculty
  const { data: facultyIds } = await supabase
    .from('news_faculty')
    .select('faculty_id')
    .eq('news_id', article.id)

  if (!facultyIds || facultyIds.length === 0) {
    return { ...article, related_faculty: [] }
  }

  const { data: faculty } = await supabase
    .from('faculty')
    .select('id, first_name, last_name, slug')
    .in('id', facultyIds.map(f => f.faculty_id))

  return { ...article, related_faculty: faculty || [] }
}

/**
 * Get featured news articles
 */
export async function getFeaturedNews(limit: number = 3): Promise<NewsWithFaculty[]> {
  const supabase = await createClient()

  const { data: articles, error } = await supabase
    .from('news_articles')
    .select('*')
    .eq('published', true)
    .eq('featured', true)
    .order('publish_date', { ascending: false })
    .limit(limit)

  if (error || !articles) {
    return []
  }

  // Get related faculty for each article
  const articlesWithFaculty = await Promise.all(
    articles.map(async (article) => {
      const { data: facultyIds } = await supabase
        .from('news_faculty')
        .select('faculty_id')
        .eq('news_id', article.id)

      if (!facultyIds || facultyIds.length === 0) {
        return { ...article, related_faculty: [] }
      }

      const { data: faculty } = await supabase
        .from('faculty')
        .select('id, first_name, last_name, slug')
        .in('id', facultyIds.map(f => f.faculty_id))

      return { ...article, related_faculty: faculty || [] }
    })
  )

  return articlesWithFaculty
}

/**
 * Get news count for pagination
 */
export async function getNewsCount(category?: NewsCategory): Promise<number> {
  const supabase = await createClient()

  let query = supabase
    .from('news_articles')
    .select('id', { count: 'exact', head: true })
    .eq('published', true)

  if (category) {
    query = query.eq('category', category)
  }

  const { count, error } = await query

  if (error) {
    console.error('Error fetching news count:', error)
    return 0
  }

  return count || 0
}

/**
 * Get all news slugs for static generation
 * Uses createStaticClient to avoid cookie issues during build
 */
export async function getAllNewsSlugs(): Promise<string[]> {
  const supabase = createStaticClient()

  const { data, error } = await supabase
    .from('news_articles')
    .select('slug')
    .eq('published', true)
    .not('slug', 'is', null)

  if (error || !data) {
    return []
  }

  return data.map(n => n.slug).filter((slug): slug is string => slug !== null)
}

/**
 * Get news categories with counts
 */
export async function getNewsCategories(): Promise<{ category: string; count: number }[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('news_articles')
    .select('category')
    .eq('published', true)
    .not('category', 'is', null)

  if (error || !data) {
    return []
  }

  // Count by category
  const categoryCounts = data.reduce((acc, article) => {
    const cat = article.category
    if (cat) {
      acc[cat] = (acc[cat] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)

  return Object.entries(categoryCounts).map(([category, count]) => ({
    category,
    count
  }))
}
