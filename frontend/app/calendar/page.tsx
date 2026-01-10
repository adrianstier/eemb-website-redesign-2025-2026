import { getAllEvents } from '@/lib/data'
import CalendarPageClient from './CalendarPageClient'

export const revalidate = 900 // Revalidate every 15 minutes

export const metadata = {
  title: 'Events Calendar | EEMB',
  description: 'View all EEMB department events in a monthly calendar format. Add events to your calendar or export to .ics.'
}

export default async function CalendarPage() {
  // Fetch all events for the calendar (no date filter for calendar view)
  const events = await getAllEvents()

  return <CalendarPageClient initialEvents={events} />
}
