import { createClient, createStaticClient } from '@/lib/supabase/server'
import type { NewsArticle, Faculty, Database } from '@/lib/supabase/types'

type NewsCategory = Database['public']['Enums']['news_category']

export type NewsWithFaculty = NewsArticle & {
  related_faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug'>[]
}

// Type for the nested select result from Supabase
type NewsWithNestedFaculty = NewsArticle & {
  news_faculty: Array<{
    faculty: Pick<Faculty, 'id' | 'first_name' | 'last_name' | 'slug'>
  }>
}

/**
 * Transform the nested Supabase result into our NewsWithFaculty type
 */
function transformNewsWithFaculty(article: NewsWithNestedFaculty): NewsWithFaculty {
  const { news_faculty, ...rest } = article
  return {
    ...rest,
    related_faculty: news_faculty?.map(nf => nf.faculty).filter(Boolean) || []
  }
}

/**
 * Get all published news articles
 * Uses a single query with nested selects (no N+1 problem)
 */
export async function getAllNews(options?: {
  limit?: number
  offset?: number
  category?: NewsCategory
}): Promise<NewsWithFaculty[]> {
  const supabase = await createClient()

  let query = supabase
    .from('news_articles')
    .select(`
      *,
      news_faculty(
        faculty:faculty_id(
          id,
          first_name,
          last_name,
          slug
        )
      )
    `)
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

  return (articles as NewsWithNestedFaculty[] || []).map(transformNewsWithFaculty)
}

/**
 * Get a single news article by slug
 * Uses a single query with nested selects
 */
export async function getNewsBySlug(slug: string): Promise<NewsWithFaculty | null> {
  const supabase = await createClient()

  const { data: article, error } = await supabase
    .from('news_articles')
    .select(`
      *,
      news_faculty(
        faculty:faculty_id(
          id,
          first_name,
          last_name,
          slug
        )
      )
    `)
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (error || !article) {
    console.error('Error fetching news by slug:', error)
    return null
  }

  return transformNewsWithFaculty(article as NewsWithNestedFaculty)
}

/**
 * Get featured news articles
 * Uses a single query with nested selects
 */
export async function getFeaturedNews(limit: number = 3): Promise<NewsWithFaculty[]> {
  const supabase = await createClient()

  const { data: articles, error } = await supabase
    .from('news_articles')
    .select(`
      *,
      news_faculty(
        faculty:faculty_id(
          id,
          first_name,
          last_name,
          slug
        )
      )
    `)
    .eq('published', true)
    .eq('featured', true)
    .order('publish_date', { ascending: false })
    .limit(limit)

  if (error || !articles) {
    return []
  }

  return (articles as NewsWithNestedFaculty[] || []).map(transformNewsWithFaculty)
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
