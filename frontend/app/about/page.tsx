'use client'

export default function AboutPage() {
  const milestones = [
    { year: '1960s', event: 'UCSB Biology Department established, laying the foundation for biological sciences at UCSB', icon: '🎓' },
    { year: '1972-77', event: 'Vice Chancellor Alec Alexander reallocated faculty appointments to strengthen up-and-coming departments', icon: '📈' },
    { year: '1995', event: 'EEMB faculty founded the NSF-sponsored National Center for Ecosystem Analysis and Synthesis (NCEAS) in Santa Barbara', icon: '🌊' },
    { year: '2000', event: 'NSF Long Term Ecological Research Site established in the Santa Barbara Channel', icon: '🔬' },
    { year: '2004', event: 'NSF Long Term Ecological Research Site established in Mo\'orea, French Polynesia', icon: '🏝️' },
    { year: 'Present', event: 'Recognized as a top-ranked program: Top 10 nationally in research impact, Top 3 in Marine Science, Top 10 in ecology and evolutionary biology', icon: '⭐' }
  ]

  const researchCenters = [
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
              <p className="text-sm font-semibold tracking-wide uppercase">About the Department</p>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Advancing Biological Science
            </h1>
            <p className="text-xl md:text-2xl text-white text-opacity-90 leading-relaxed mb-8">
              UCSB's biological sciences are jointly administered by EEMB and the Department of Molecular, Cellular and Developmental Biology (MCDB). With approximately 30 faculty research groups, EEMB has been at the forefront of research in ecology, evolution, and marine biology—investigating life on Earth from molecules to ecosystems.
            </p>
            <div className="flex justify-center gap-6 text-sm md:text-base flex-wrap">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-ocean-coral" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="font-medium">Established 1960s</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-ocean-coral" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                </svg>
                <span className="font-medium">Top-Ranked Program</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-ocean-coral" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                </svg>
                <span className="font-medium">Coastal Research Hub</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-gradient-to-b from-white to-ocean-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
                <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Our Purpose</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4">Mission & Vision</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Mission */}
              <div className="bg-white rounded-2xl p-10 shadow-lg border border-ocean-100 hover:shadow-xl transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean-teal to-ocean-blue rounded-xl text-white mb-6">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-ocean-blue mb-4">Our Mission</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To advance knowledge and understanding of ecology, evolution, and marine biology through innovative research and transformative education that prepares students to address environmental challenges facing our planet.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-white rounded-2xl p-10 shadow-lg border border-ocean-100 hover:shadow-xl transition">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean-coral to-ocean-sunset rounded-xl text-white mb-6">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-ocean-blue mb-4">Our Vision</h3>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To be a global leader in biological sciences, recognized for groundbreaking research, exceptional graduate education, commitment to diversity and inclusion, and dedication to environmental stewardship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-ocean-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
                <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">What Drives Us</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4">Core Values</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our department is built on principles that guide our research, teaching, and community engagement.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Scientific Excellence',
                  description: 'Pursuing rigorous, innovative research that pushes the boundaries of biological science.',
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ),
                },
                {
                  title: 'Inclusive Community',
                  description: 'Fostering diversity, equity, and inclusion in all aspects of our department.',
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                    </svg>
                  ),
                },
                {
                  title: 'Mentorship & Training',
                  description: 'Developing the next generation of scientists through dedicated mentoring and teaching.',
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                    </svg>
                  ),
                },
                {
                  title: 'Collaboration',
                  description: 'Working across disciplines and institutions to tackle complex biological questions.',
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
                    </svg>
                  ),
                },
                {
                  title: 'Environmental Stewardship',
                  description: 'Protecting and conserving biodiversity and natural ecosystems for future generations.',
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                    </svg>
                  ),
                },
                {
                  title: 'Integrity',
                  description: 'Upholding the highest ethical standards in research and academic conduct.',
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                  ),
                },
              ].map((value, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 transform border border-ocean-100">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-ocean-teal bg-opacity-10 rounded-lg text-ocean-teal mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-ocean-blue mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
                <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Our Story</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4">Department History</h2>
              <p className="text-lg text-gray-600">Over six decades of advancing biological science</p>
            </div>

            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ocean-teal via-ocean-blue to-ocean-deep"></div>

              {milestones.map((milestone, index) => (
                <div key={index} className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'}`}>
                  <div className={`flex items-center gap-6 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                    {/* Icon */}
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-ocean-teal to-ocean-blue rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg z-10">
                      {milestone.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition border border-ocean-100">
                      <p className="text-2xl font-bold text-ocean-teal mb-2">{milestone.year}</p>
                      <p className="text-gray-700 leading-relaxed">{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research Centers */}
      <section className="py-24 bg-gradient-to-b from-ocean-50 to-white">
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
              {researchCenters.map((center, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 transform border border-ocean-100">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-ocean-teal to-ocean-blue rounded-xl text-white flex items-center justify-center">
                      {center.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ocean-blue mb-2">{center.name}</h3>
                      <p className="text-gray-600 leading-relaxed">{center.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-block mb-4 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
                <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Our Impact</p>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4">By the Numbers</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { number: '~30', label: 'Faculty Groups' },
                { number: '100+', label: 'Grad Students' },
                { number: '800+', label: 'Undergrads' },
                { number: 'Top 10', label: 'Research Impact' },
                { number: 'Top 3', label: 'Marine Science' },
                { number: '60+', label: 'Years Excellence' }
              ].map((stat, index) => (
                <div key={index} className="bg-gradient-to-br from-ocean-50 to-white rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 transform border border-ocean-100">
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

      {/* Explore More Section */}
      <section className="py-16 bg-white border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-ucsb-navy mb-12">
              Learn More About EEMB
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/dei"
                className="group bg-gradient-to-br from-ocean-deep/5 to-ocean-teal/5 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-ocean-blue rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-ucsb-navy group-hover:text-ocean-blue transition-colors">
                    Diversity & Inclusion
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Explore our commitment to fostering an inclusive community through the DEI Committee and ongoing initiatives.
                </p>
              </Link>

              <Link
                href="/good-news"
                className="group bg-gradient-to-br from-ocean-blue/5 to-ocean-coral/5 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-ocean-coral rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-ucsb-navy group-hover:text-ocean-coral transition-colors">
                    Good News
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Celebrate achievements, awards, publications, grants, and milestones from our EEMB community.
                </p>
              </Link>

              <Link
                href="/memoriam"
                className="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-ucsb-navy group-hover:text-gray-700 transition-colors">
                    In Memoriam
                  </h3>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  Honor the lives and legacies of our esteemed colleagues whose contributions continue to inspire us.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-blue to-ocean-teal"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Become Part of EEMB</h2>
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
                href="/research"
                className="bg-white text-ocean-blue px-10 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition-all shadow-lg hover:-translate-y-0.5 transform"
              >
                Research Areas
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
