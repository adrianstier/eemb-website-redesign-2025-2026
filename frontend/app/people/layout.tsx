import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'People | EEMB',
  description:
    'Browse the faculty, staff, and graduate students of the Department of Ecology, Evolution & Marine Biology at UC Santa Barbara.',
}

export default function PeopleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
