import { notFound } from 'next/navigation'
import { getEventBySlug, getAllEventSlugs, getUpcomingEvents } from '@/lib/data'
import EventDetailClient from './EventDetailClient'

export const revalidate = 900 // Revalidate every 15 minutes

export async function generateStaticParams() {
  const slugs = await getAllEventSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    return { title: 'Event Not Found' }
  }

  return {
    title: `${event.title} | EEMB Events`,
    description: event.short_description || event.description || `Join us for ${event.title} at EEMB.`,
    openGraph: {
      title: event.title,
      description: event.short_description || event.description || undefined,
      images: event.speaker_image_url ? [event.speaker_image_url] : undefined,
    }
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  // Get related/upcoming events
  const upcomingEvents = await getUpcomingEvents({ limit: 4 })
  const relatedEvents = upcomingEvents.filter(e => e.id !== event.id).slice(0, 3)

  return <EventDetailClient event={event} relatedEvents={relatedEvents} />
}
