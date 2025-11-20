export default function WhoWeAre() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-b from-white to-ocean-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Content */}
          <div>
            <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
              <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">About Us</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-ocean-blue mb-5 leading-tight">
              A Premier Department for Biological Science
            </h2>
            <div className="space-y-4 text-base text-gray-700 leading-relaxed">
              <p>
                The Department of Ecology, Evolution, and Marine Biology at UC Santa Barbara is a vibrant community of researchers and educators pushing the boundaries of biological science.
              </p>
              <p>
                Our faculty and students investigate fundamental questions about life on Earth—from the molecular basis of adaptation to the dynamics of entire ecosystems.
              </p>
              <p className="font-medium text-ocean-blue">
                Our coastal California location provides unparalleled access to diverse marine and terrestrial environments, making EEMB an ideal place for transformative research and graduate training.
              </p>
            </div>

            <div className="mt-6 flex gap-4 flex-wrap">
              <a
                href="/research"
                className="inline-flex items-center gap-2 text-ocean-teal font-semibold hover:gap-3 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-teal focus-visible:ring-offset-2 rounded"
              >
                Explore Our Research
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right: Key Features */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-150">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-ocean-teal bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-ocean-teal" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-ocean-blue text-base mb-1">PhD & MS Programs</h3>
                  <p className="text-gray-600 text-sm">Rigorous graduate training combining coursework with hands-on research</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-150">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-ocean-coral bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-ocean-coral" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-ocean-blue text-base mb-1">Cutting-Edge Research</h3>
                  <p className="text-gray-600 text-sm">From genomics to ecosystem science, marine to terrestrial systems</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-150">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-ocean-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-ocean-blue" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-ocean-blue text-base mb-1">Coastal California Location</h3>
                  <p className="text-gray-600 text-sm">Unparalleled access to diverse marine and terrestrial ecosystems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
