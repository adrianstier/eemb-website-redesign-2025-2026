import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Department Support | EEMB',
  description:
    'Find contacts, resources, and support for faculty, staff, students, and researchers in the EEMB department at UC Santa Barbara.',
}

export default function SupportLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
