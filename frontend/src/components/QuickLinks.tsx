import Link from 'next/link'
import { Users, GraduationCap, Microscope, Globe, LucideIcon } from 'lucide-react'

interface QuickLink {
  title: string
  description: string
  icon: LucideIcon
  href: string
}

export default function QuickLinks() {
  const links: QuickLink[] = [
    {
      title: 'Faculty Directory',
      description: 'Meet our world-class researchers and educators',
      icon: Users,
      href: '/faculty'
    },
    {
      title: 'Graduate Programs',
      description: 'Explore our PhD and Masters programs',
      icon: GraduationCap,
      href: '/academics'
    },
    {
      title: 'Research Areas',
      description: 'Discover our cutting-edge research',
      icon: Microscope,
      href: '/research'
    },
    {
      title: 'Alumni Network',
      description: 'Connect with our global community',
      icon: Globe,
      href: '/alumni'
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="mb-4">
                <link.icon className="w-10 h-10 text-ocean-blue" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-ucsb-navy mb-2">
                {link.title}
              </h3>
              <p className="text-gray-600">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}