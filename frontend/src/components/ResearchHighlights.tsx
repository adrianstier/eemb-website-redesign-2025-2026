import Link from 'next/link'
import { Waves, Dna, Bug, Microscope, LucideIcon } from 'lucide-react'

interface Highlight {
  title: string
  description: string
  icon: LucideIcon
  link: string
}

export default function ResearchHighlights() {
  const highlights: Highlight[] = [
    {
      title: 'Climate Change & Marine Ecosystems',
      description: 'Understanding how ocean warming and acidification affect marine biodiversity and ecosystem functions.',
      icon: Waves,
      link: '/research/climate-marine'
    },
    {
      title: 'Evolution & Biodiversity',
      description: 'Investigating the mechanisms driving species evolution and maintaining biological diversity.',
      icon: Dna,
      link: '/research/evolution'
    },
    {
      title: 'Conservation Biology',
      description: 'Developing science-based strategies for protecting endangered species and habitats.',
      icon: Bug,
      link: '/research/conservation'
    },
    {
      title: 'Microbial Ecology',
      description: 'Exploring the role of microorganisms in ecosystem processes and global biogeochemical cycles.',
      icon: Microscope,
      link: '/research/microbial'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-4">Research Excellence</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our faculty and students are at the forefront of discovery, tackling some of the most pressing environmental challenges of our time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {highlights.map((item) => (
            <Link
              key={item.link}
              href={item.link}
              className="group"
            >
              <div className="bg-gradient-to-br from-ucsb-navy to-blue-700 text-white p-6 rounded-lg h-full hover:shadow-xl transition-all transform hover:-translate-y-1">
                <div className="mb-4">
                  <item.icon className="w-12 h-12 text-ucsb-gold" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-semibold mb-3 group-hover:text-ucsb-gold transition">
                  {item.title}
                </h3>
                <p className="text-gray-200">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/research" className="inline-block bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
            Explore All Research Areas
          </Link>
        </div>
      </div>
    </section>
  )
}