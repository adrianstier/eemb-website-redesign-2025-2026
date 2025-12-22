import Image from 'next/image'
import Link from 'next/link'
import WaveDivider from './ui/WaveDivider'

export default function ResearchThemes() {
  const themes = [
    {
      title: 'Marine Ecology',
      description: 'Kelp forests, coral reefs, plankton dynamics, fisheries—our marine research spans the California coast to tropical Pacific.',
      image: '/images/about/marine-reef.jpg',
      faculty: ['Burkepile', 'McCauley', 'Hofmann', 'Moeller'],
      color: 'from-ocean-blue to-ocean-teal',
      accentColor: 'bg-ocean-teal',
    },
    {
      title: 'Evolution & Genetics',
      description: 'From plant speciation to animal bioluminescence, we study how life diversifies and adapts.',
      image: '/images/about/evolution-flower.jpg',
      faculty: ['Hodges', 'Oakley', 'Mazer', 'Sharbrough'],
      color: 'from-ucsb-gold to-sunset',
      accentColor: 'bg-ucsb-gold',
    },
    {
      title: 'Ecology & Ecosystems',
      description: 'Population dynamics, disease ecology, plant communities, ecosystem function—across terrestrial and aquatic systems.',
      image: '/images/about/campus-lagoon.jpg',
      faculty: ['Briggs', "D'Antonio", 'Schimel', 'Oono'],
      color: 'from-kelp-500 to-kelp-400',
      accentColor: 'bg-kelp-500',
    },
  ]

  return (
    <>
      <WaveDivider variant="subtle" toColor="fill-warm-100" flip />
      <section className="py-16 md:py-24 bg-warm-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Section header - asymmetric alignment */}
          <div className="max-w-xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-ocean-blue" />
              <span className="text-ocean-blue text-sm font-semibold tracking-wide uppercase">
                Research
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-4">
              What We Study
            </h2>
            <p className="text-warm-600 text-lg leading-relaxed">
              Our research spans three interconnected themes, with many faculty working at the intersections.
            </p>
          </div>

          {/* Cards with refined hover effects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {themes.map((theme, index) => (
              <article
                key={index}
                className="group bg-white rounded-2xl overflow-hidden shadow-warm-md hover:shadow-warm-xl transition-all duration-500 border border-warm-200 hover:border-warm-300"
                style={{
                  transform: 'translateY(0)',
                  transition: 'transform 0.5s ease-out, box-shadow 0.5s ease-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                {/* Image with overlay */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={theme.image}
                    alt={`${theme.title} research at EEMB`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Gradient overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${theme.color} opacity-0 group-hover:opacity-30 transition-opacity duration-500`} />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white ${theme.accentColor} shadow-lg`}>
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Active Research
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-7">
                  <h3 className="font-heading text-xl lg:text-2xl font-bold text-ucsb-navy mb-3 group-hover:text-ocean-blue transition-colors duration-300">
                    {theme.title}
                  </h3>
                  <p className="text-warm-600 text-sm leading-relaxed mb-5">
                    {theme.description}
                  </p>

                  {/* Faculty list with refined styling */}
                  <div className="pt-4 border-t border-warm-200">
                    <div className="text-xs text-warm-500 mb-2 font-medium uppercase tracking-wide">
                      Faculty include
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {theme.faculty.map((name) => (
                        <span
                          key={name}
                          className="text-xs px-2 py-1 bg-warm-100 text-warm-700 rounded-md"
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* CTA link with animated underline */}
          <div className="text-center mt-12">
            <Link
              href="/research"
              className="group inline-flex items-center gap-2 text-ocean-blue font-semibold hover:text-ocean-deep transition-colors"
            >
              <span className="link-underline">View all research areas</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      <WaveDivider variant="subtle" toColor="fill-white" />
    </>
  )
}
