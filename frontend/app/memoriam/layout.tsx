import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'In Memoriam | EEMB',
  description:
    'Honoring the lives and legacies of esteemed colleagues in the Department of Ecology, Evolution & Marine Biology at UC Santa Barbara.',
}

export default function MemoriamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
