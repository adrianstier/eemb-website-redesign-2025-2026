export default function PartnersSection() {
  const partnerCategories = [
    {
      category: 'Academic Partners',
      description: 'Collaborating with leading research institutions worldwide.',
      examples: ['Smithsonian', 'Scripps Institution', 'Marine Biological Laboratory'],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
        </svg>
      ),
    },
    {
      category: 'Government Agencies',
      description: 'Working with federal and state agencies on conservation and policy.',
      examples: ['NOAA', 'CA Fish & Wildlife', 'National Parks Service'],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd"/>
        </svg>
      ),
    },
    {
      category: 'Conservation Groups',
      description: 'Partnering with NGOs to translate research into conservation action.',
      examples: ['The Nature Conservancy', 'Channel Islands Nat. Marine Sanctuary'],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"/>
        </svg>
      ),
    },
    {
      category: 'Industry Partners',
      description: 'Engaging with biotechnology and environmental consulting firms.',
      examples: ['Biotech Companies', 'Environmental Consultants', 'Data Science Firms'],
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
            <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Collaborations</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4 leading-tight">
            Research Partnerships
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We work with diverse partners to advance scientific discovery and environmental stewardship.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerCategories.map((partner, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-ocean-50 to-white rounded-xl p-6 border border-ocean-100 hover:shadow-lg transition-all hover:-translate-y-1 transform"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-ocean-teal bg-opacity-10 rounded-lg text-ocean-teal mb-4">
                {partner.icon}
              </div>
              <h3 className="text-xl font-bold text-ocean-blue mb-3">
                {partner.category}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {partner.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {partner.examples.map((example, idx) => (
                  <span
                    key={idx}
                    className="inline-block bg-white text-ocean-blue px-2 py-1 rounded text-xs font-medium border border-ocean-200"
                  >
                    {example}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-ocean-blue to-ocean-teal rounded-2xl p-12 text-center text-white shadow-xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Collaborate with EEMB
          </h3>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Interested in research partnerships, grant opportunities, or faculty expertise? We welcome collaborations that advance biological science.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a
              href="/contact"
              className="inline-block bg-white text-ocean-blue px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-90 transition shadow-lg"
            >
              Contact Us
            </a>
            <a
              href="/research"
              className="inline-block bg-white bg-opacity-10 backdrop-blur border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-opacity-20 transition"
            >
              View Research Areas
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
