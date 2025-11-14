'use client'

export default function ResearchPage() {
  const researchAreas = [
    {
      id: 'ecology',
      title: 'Ecology',
      description: 'Ecologists work across a broad range of biological organization, from processes acting within individual organisms, to populations of a single species, to sets of species that occur together in communities or interact with their physical environment in ecosystems.',
      fullDescription: 'Ecology is a large, diverse and vibrant field of science. Ecologists use both theory and empiricism, and work in the field and the laboratory. EEMB ecologists strive to generate new understanding of the relationship between organisms and their biotic and abiotic environment. One approach is driven by generating and testing general ideas in ecology—EEMB faculty have made important contributions to the development of general ecological theory. The second approach focuses on problems specific to particular ecological systems such as deserts, the tundra, the coastal ocean, lakes, and streams.',
      image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80',
      credit: 'Pale Swallowtail (Papilio eurymedon) pollinating. Credit: Michelle Lee',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
        </svg>
      ),
    },
    {
      id: 'evolution',
      title: 'Evolution',
      description: 'The modern theory of evolution forms the theoretical foundation for our understanding of biology. Evolutionary biologists gain insight by seeing biological problems in four dimensions.',
      fullDescription: 'The modern theory of evolution forms the theoretical foundation for our understanding of biology. Indeed, Theodosius Dobzhansky famously proclaimed that "nothing makes sense in biology except in the light of evolution." Evolutionary biologists in UCSB pursue this challenge from many angles, including population genetics, evolutionary physiology, and phylogenetics. Understanding biodiversity, from diversity in human drug response to diversity of species in undisturbed ecosystems, requires a better understanding of how changes in DNA lead to changes in organisms. The integration of ecology and evolution is therefore a core goal of our department.',
      image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&q=80',
      credit: 'Clarkia unguiculata, an insect-pollinated wildflower. Courtesy of Mazer Lab. Credit: Susan Mazer',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd"/>
        </svg>
      ),
    },
    {
      id: 'marine-biology',
      title: 'Marine Biology',
      description: 'Marine Biology encompasses the broad study of marine organisms, their behaviors, and their interactions with the environment.',
      fullDescription: 'As the only major research university in the country located entirely on the ocean, UCSB faculty are uniquely positioned to study the sea. EEMB faculty investigate aspects of marine biology that provide the basic understanding of ocean biota at the organismal, population and ecosystem level required to solve pressing marine issues related to human use and environmental change. Research on genetics and evolution provides critical insight into how environmental factors influence an organism\'s physiology and behavior, and ultimately the ecological functions of marine ecosystems and the services that they provide. EEMB offers a broad array of research ranging from microbial and organismal physiology to coral reef, coastal, deep sea, and open ocean ecology.',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
      credit: 'Palmyra atoll coral reef. Credit: Kevin Lafferty',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block mb-6 px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full border border-white border-opacity-30">
              <p className="text-sm font-semibold tracking-wide uppercase">Research Excellence</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              EEMB Research
            </h1>
            <p className="text-xl md:text-2xl text-white leading-relaxed">
              EEMB researchers use their scientific understanding to address some of the world's most pressing environmental issues.
            </p>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="py-24 bg-gradient-to-b from-white to-ocean-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
                <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Research Focus</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4">Core Research Areas</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our research spans ecology, evolution, and marine biology—integrating across scales from molecules to ecosystems.
              </p>
            </div>

            <div className="space-y-16">
              {researchAreas.map((area, index) => (
                <div
                  key={area.id}
                  className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 items-center`}
                >
                  {/* Image */}
                  <div className="w-full lg:w-1/2">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group">
                      <img
                        src={area.image}
                        alt={area.title}
                        className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/50 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-xs">
                        {area.credit}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="w-full lg:w-1/2">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean-teal to-ocean-blue rounded-xl text-white mb-6">
                      {area.icon}
                    </div>
                    <h3 className="text-3xl font-bold text-ocean-blue mb-4">{area.title}</h3>
                    <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                      {area.description}
                    </p>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {area.fullDescription}
                    </p>
                    <a
                      href={`/people?filter=${area.id}`}
                      className="inline-flex items-center gap-2 text-ocean-teal font-semibold hover:gap-3 transition-all"
                    >
                      View {area.title} Faculty
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Impact */}
      <section className="py-24 bg-ocean-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
                <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Research Impact</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4">By the Numbers</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '$25M+', label: 'Annual Funding' },
                { number: '65+', label: 'Faculty' },
                { number: '100+', label: 'Graduate Students' },
                { number: '50+', label: 'Research Groups' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 transform border border-ocean-100"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-ocean-teal to-ocean-blue bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Facilities */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
                <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Our Facilities</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4">Research Centers & Reserves</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                World-class facilities supporting cutting-edge research in ecology, evolution, and marine biology.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  name: 'Marine Science Institute',
                  description: 'Dedicated research facility for marine ecology, oceanography, and coastal science.',
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z" clipRule="evenodd"/>
                    </svg>
                  ),
                },
                {
                  name: 'Cheadle Center for Biodiversity',
                  description: 'Focus on ecological restoration and conservation of California\'s natural habitats.',
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"/>
                    </svg>
                  ),
                },
                {
                  name: 'Coal Oil Point Reserve',
                  description: 'Natural reserve supporting research on coastal ecology and conservation.',
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  ),
                },
                {
                  name: 'Sedgwick Reserve',
                  description: 'Field research station for terrestrial ecology and biodiversity studies.',
                  icon: (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                    </svg>
                  ),
                },
              ].map((facility, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 transform border border-ocean-100"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-ocean-teal to-ocean-blue rounded-xl text-white flex items-center justify-center">
                      {facility.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ocean-blue mb-2">{facility.name}</h3>
                      <p className="text-gray-600 leading-relaxed">{facility.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-blue to-ocean-teal"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Research Community</h2>
            <p className="text-xl text-white text-opacity-90 mb-10 leading-relaxed">
              Whether you're interested in graduate programs, research collaborations, or learning more about our work, we invite you to connect with us.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <a
                href="/academics"
                className="bg-ocean-coral text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-ocean-sunset transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
              >
                Graduate Programs
              </a>
              <a
                href="/people"
                className="bg-white text-ocean-blue px-10 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:-translate-y-0.5 transform"
              >
                Meet Our Faculty
              </a>
              <a
                href="/contact"
                className="bg-white bg-opacity-10 backdrop-blur border-2 border-white text-white px-10 py-4 rounded-lg font-bold text-lg hover:bg-opacity-20 transition-all hover:-translate-y-0.5 transform"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
