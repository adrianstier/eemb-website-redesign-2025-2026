export default function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Full-width ocean imagery background */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(10, 31, 46, 0.6) 0%, rgba(26, 107, 148, 0.6) 100%), url("https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1920&q=80")',
          backgroundPosition: 'center',
        }}
      />

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/30 via-transparent to-transparent"></div>

      {/* Content overlay */}
      <div className="relative z-10 text-center text-white px-4 py-20 max-w-6xl mx-auto">
        {/* Department badge */}
        <div className="inline-block mb-8 px-5 py-2.5 bg-white/10 backdrop-blur-md rounded-full border border-white/30 hover:bg-white/15 transition-all duration-300 animate-fade-in">
          <p className="text-sm font-semibold tracking-wider uppercase text-white/90">University of California, Santa Barbara</p>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-[1.1] tracking-tight animate-fade-in-up">
          Ecology, Evolution &<br />
          <span className="bg-gradient-to-r from-ocean-coral via-ocean-sunset to-ocean-teal bg-clip-text text-transparent">
            Marine Biology
          </span>
        </h1>

        <p className="text-xl md:text-2xl mb-12 text-white/90 leading-relaxed max-w-3xl mx-auto font-light animate-fade-in-up animation-delay-200">
          World-class research. Exceptional graduate training. Coastal California setting.
        </p>

        {/* Quick highlights */}
        <div className="flex justify-center gap-6 md:gap-10 mb-12 flex-wrap text-sm md:text-base animate-fade-in animation-delay-300">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 transition-all duration-300">
            <svg className="w-5 h-5 text-ocean-coral" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span className="font-semibold text-white">Top 10 Ranked</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 transition-all duration-300">
            <svg className="w-5 h-5 text-ocean-coral" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
            </svg>
            <span className="font-semibold text-white">65+ Faculty</span>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 transition-all duration-300">
            <svg className="w-5 h-5 text-ocean-coral" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd"/>
              <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z"/>
            </svg>
            <span className="font-semibold text-white">50+ Research Labs</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 flex-wrap animate-fade-in animation-delay-400">
          <a
            href="/academics"
            className="group bg-ocean-coral text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-ocean-sunset transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
          >
            <span className="inline-block group-hover:scale-105 transition-transform duration-300">
              Apply to Graduate Program
            </span>
          </a>
          <a
            href="/people"
            className="group bg-white/10 backdrop-blur-md border-2 border-white/40 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/20 hover:border-white/60 transition-all duration-300 hover:-translate-y-1 transform"
          >
            <span className="inline-block group-hover:scale-105 transition-transform duration-300">
              Meet Our Faculty
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}