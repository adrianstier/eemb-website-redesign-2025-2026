import type { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/server'

const BASE_URL = 'https://eemb.ucsb.edu'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient()

  // Static pages with their change frequencies and priorities
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/research`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/people`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/academics`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/academics/graduate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/news`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/events`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/calendar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/dei`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/give`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/support`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/good-news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/memoriam`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/alumni`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Fetch dynamic slugs and updated_at timestamps from Supabase
  // Each query is wrapped in a try/catch so a single failure doesn't break the whole sitemap

  let facultyPages: MetadataRoute.Sitemap = []
  try {
    const { data: faculty } = await supabase
      .from('faculty')
      .select('slug, updated_at')
      .not('slug', 'is', null)

    if (faculty) {
      facultyPages = faculty
        .filter((f): f is typeof f & { slug: string } => f.slug !== null)
        .map((f) => ({
          url: `${BASE_URL}/people/faculty/${f.slug}`,
          lastModified: f.updated_at ? new Date(f.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
    }
  } catch (error) {
    console.error('Sitemap: Error fetching faculty slugs:', error)
  }

  let studentPages: MetadataRoute.Sitemap = []
  try {
    const { data: students } = await supabase
      .from('graduate_students')
      .select('slug, updated_at')
      .eq('active', true)
      .not('slug', 'is', null)

    if (students) {
      studentPages = students
        .filter((s): s is typeof s & { slug: string } => s.slug !== null)
        .map((s) => ({
          url: `${BASE_URL}/people/students/${s.slug}`,
          lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
    }
  } catch (error) {
    console.error('Sitemap: Error fetching student slugs:', error)
  }

  let staffPages: MetadataRoute.Sitemap = []
  try {
    const { data: staff } = await supabase
      .from('staff')
      .select('slug, updated_at')
      .eq('active', true)
      .not('slug', 'is', null)

    if (staff) {
      staffPages = staff
        .filter((s): s is typeof s & { slug: string } => s.slug !== null)
        .map((s) => ({
          url: `${BASE_URL}/people/staff/${s.slug}`,
          lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
        }))
    }
  } catch (error) {
    console.error('Sitemap: Error fetching staff slugs:', error)
  }

  let newsPages: MetadataRoute.Sitemap = []
  try {
    const { data: news } = await supabase
      .from('news_articles')
      .select('slug, updated_at')
      .eq('published', true)
      .not('slug', 'is', null)

    if (news) {
      newsPages = news
        .filter((n): n is typeof n & { slug: string } => n.slug !== null)
        .map((n) => ({
          url: `${BASE_URL}/news/${n.slug}`,
          lastModified: n.updated_at ? new Date(n.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
    }
  } catch (error) {
    console.error('Sitemap: Error fetching news slugs:', error)
  }

  let eventPages: MetadataRoute.Sitemap = []
  try {
    const { data: events } = await supabase
      .from('events')
      .select('slug, updated_at')
      .not('slug', 'is', null)

    if (events) {
      eventPages = events
        .filter((e): e is typeof e & { slug: string } => e.slug !== null)
        .map((e) => ({
          url: `${BASE_URL}/events/${e.slug}`,
          lastModified: e.updated_at ? new Date(e.updated_at) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }))
    }
  } catch (error) {
    console.error('Sitemap: Error fetching event slugs:', error)
  }

  return [
    ...staticPages,
    ...facultyPages,
    ...studentPages,
    ...staffPages,
    ...newsPages,
    ...eventPages,
  ]
}
