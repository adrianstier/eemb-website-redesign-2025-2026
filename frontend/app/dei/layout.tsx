import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Diversity, Equity & Inclusion | EEMB',
  description:
    'EEMB is committed to creating a welcoming, inclusive community. Learn about our DEI initiatives, resources, and support programs.',
}

export default function DEILayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
