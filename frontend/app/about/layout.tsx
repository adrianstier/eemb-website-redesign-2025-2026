import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | EEMB',
  description:
    'Learn about the Department of Ecology, Evolution & Marine Biology at UC Santa Barbara — our history, mission, research centers, and leadership.',
  openGraph: {
    title: 'About | EEMB',
    description: 'Learn about the Department of Ecology, Evolution & Marine Biology at UC Santa Barbara — our history, mission, research centers, and leadership.',
    type: 'website',
    siteName: 'EEMB | UC Santa Barbara',
  },
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
