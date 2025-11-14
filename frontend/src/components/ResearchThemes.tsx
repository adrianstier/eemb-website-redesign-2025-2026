export default function ResearchThemes() {
  const themes = [
    {
      title: 'Marine Biology',
      description: 'From molecular mechanisms to ecosystem dynamics, we study marine life across all scales—investigating biodiversity, physiology, and ecological interactions in ocean environments.',
      color: 'ocean-teal',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&q=80',
    },
    {
      title: 'Evolution & Genetics',
      description: 'Understanding the genetic basis of adaptation, speciation, and evolutionary change. Our research spans population genetics, phylogenetics, and genomics.',
      color: 'ocean-coral',
      image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=600&q=80',
    },
    {
      title: 'Ecology & Conservation',
      description: 'Investigating community dynamics, ecosystem function, and conservation strategies across marine, freshwater, and terrestrial systems.',
      color: 'ocean-sunset',
      image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=600&q=80',
    },
    {
      title: 'Global Change Biology',
      description: 'Examining how organisms and ecosystems respond to climate change, ocean acidification, and other anthropogenic impacts on the environment.',
      color: 'ocean-blue',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-5xl md:text-6xl font-bold text-ocean-blue mb-6 text-center leading-tight">
          Research Areas
        </h2>
        <p className="text-lg text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Our faculty and students conduct research across the full breadth of ecology, evolution, and marine biology.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {themes.map((theme, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
            >
              {/* Image background */}
              <div
                className="relative h-64 bg-cover bg-center"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(10, 31, 46, 0.5) 0%, rgba(31, 163, 202, 0.5) 100%), url("${theme.image}")`,
                }}
              >
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-3xl font-bold mb-3">
                    {theme.title}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="bg-white p-6">
                <p className="text-gray-700 leading-relaxed">
                  {theme.description}
                </p>
                <div className={`h-1 w-12 bg-${theme.color} mt-6`} />
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <a
            href="/research"
            className="inline-block bg-ocean-blue text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-ocean-teal transition shadow-lg"
          >
            View All Research Areas
          </a>
        </div>
      </div>
    </section>
  )
}
