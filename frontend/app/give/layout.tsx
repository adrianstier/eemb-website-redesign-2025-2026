import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Give to EEMB | UC Santa Barbara',
  description:
    'Support excellence in ecology, evolution, and marine biology at UC Santa Barbara. Your gift helps address environmental challenges and train the next generation of scientists.',
}

export default function GiveLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
