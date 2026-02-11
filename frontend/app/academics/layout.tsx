import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Graduate Programs | EEMB',
  description:
    'Explore PhD and MA programs in Ecology, Evolution & Marine Biology at UC Santa Barbara. Full funding, no GRE required, world-class research opportunities.',
  openGraph: {
    title: 'Graduate Programs | EEMB',
    description: 'Explore PhD and MA programs in Ecology, Evolution & Marine Biology at UC Santa Barbara. Full funding, no GRE required, world-class research opportunities.',
    type: 'website',
    siteName: 'EEMB | UC Santa Barbara',
  },
}

export default function AcademicsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
