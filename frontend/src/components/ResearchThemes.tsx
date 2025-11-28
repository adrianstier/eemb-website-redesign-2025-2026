import Image from 'next/image'
import Link from 'next/link'

export default function ResearchThemes() {
  const themes = [
    {
      title: 'Marine Ecology',
      description: 'Kelp forests, coral reefs, plankton dynamics, fisheries—our marine research spans the California coast to tropical Pacific.',
      image: '/images/about/marine-reef.jpg',
      faculty: ['Burkepile', 'McCauley', 'Hofmann', 'Moeller'],
    },
    {
      title: 'Evolution & Genetics',
      description: 'From plant speciation to animal bioluminescence, we study how life diversifies and adapts.',
      image: '/images/about/evolution-flower.jpg',
      faculty: ['Hodges', 'Oakley', 'Mazer', 'Sharbrough'],
    },
    {
      title: 'Ecology & Ecosystems',
      description: 'Population dynamics, disease ecology, plant communities, ecosystem function—across terrestrial and aquatic systems.',
      image: '/images/about/campus-lagoon.jpg',
      faculty: ['Briggs', "D'Antonio", 'Schimel', 'Oono'],
    },
  ]

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-3">
            What We Study
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our research spans three interconnected themes, with many faculty working at the intersections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {themes.map((theme, index) => (
            <article
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="relative h-44 overflow-hidden">
                <Image
                  src={theme.image}
                  alt={`${theme.title} research at EEMB`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-ucsb-navy mb-2 group-hover:text-ocean-blue transition-colors">
                  {theme.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {theme.description}
                </p>
                <div className="text-xs text-gray-500">
                  <span className="font-medium text-gray-700">Faculty include: </span>
                  {theme.faculty.join(', ')}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/research"
            className="inline-block text-ocean-blue font-semibold hover:text-ocean-teal transition-colors"
          >
            View all research areas →
          </Link>
        </div>
      </div>
    </section>
  )
}
