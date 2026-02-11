import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research | EEMB',
  description:
    'Explore research themes in ecology, evolution, and marine biology at UC Santa Barbara — from kelp forests and coral reefs to disease ecology and microbial communities.',
  openGraph: {
    title: 'Research | EEMB',
    description: 'Explore research themes in ecology, evolution, and marine biology at UC Santa Barbara — from kelp forests and coral reefs to disease ecology and microbial communities.',
    type: 'website',
    siteName: 'EEMB | UC Santa Barbara',
  },
}

export default function ResearchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
