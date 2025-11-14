export default function ImpactMetrics() {
  const metrics = [
    {
      number: '65+',
      label: 'Faculty Members',
      description: 'Award-winning researchers and educators',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
        </svg>
      ),
    },
    {
      number: '100+',
      label: 'Graduate Students',
      description: 'PhD and MS students conducting cutting-edge research',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
        </svg>
      ),
    },
    {
      number: '50+',
      label: 'Research Groups',
      description: 'Spanning ecology, evolution, and marine biology',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z" clipRule="evenodd"/>
        </svg>
      ),
    },
    {
      number: 'Top 10',
      label: 'National Ranking',
      description: 'Ecology & evolutionary biology programs',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ),
    },
  ]

  return (
    <section className="py-20 bg-ocean-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-3 py-1 bg-ocean-teal bg-opacity-10 rounded-full">
            <p className="text-sm font-semibold text-ocean-teal uppercase tracking-wide">Our Impact</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-ocean-blue mb-4 leading-tight">
            Excellence by the Numbers
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our department brings together world-class researchers, talented students, and extensive resources.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 text-center shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 transform border border-ocean-100"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ocean-teal to-ocean-blue rounded-xl text-white mb-4">
                {metric.icon}
              </div>
              <div className="text-5xl font-bold bg-gradient-to-r from-ocean-teal to-ocean-blue bg-clip-text text-transparent mb-3">
                {metric.number}
              </div>
              <h3 className="text-xl font-bold text-ocean-blue mb-2">
                {metric.label}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
