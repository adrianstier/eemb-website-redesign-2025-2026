import Image from 'next/image'
import Link from 'next/link'
import WaveDivider from './ui/WaveDivider'

export default function HeroSection() {
  return (
    <>
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Real EEMB photo background */}
        <Image
          src="/images/about/kelp-banner.jpg"
          alt="Giant kelp forest in the Santa Barbara Channel"
          fill
          className="object-cover"
          priority
        />

        {/* Simplified overlay - single color with gradient for depth, not 3-color AI look */}
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/70 to-ocean-deep/40" />

        {/* Subtle topographic texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q15 20 30 30 T60 30' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 45 Q15 35 30 45 T60 45' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 15 Q15 5 30 15 T60 15' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 max-w-6xl">
          <div className="max-w-2xl">
            {/* Eyebrow with gold accent */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-ucsb-gold" />
              <p className="text-ucsb-gold font-medium text-sm tracking-widest uppercase">
                UC Santa Barbara
              </p>
            </div>

            {/* Main headline - now using serif for personality */}
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] text-white tracking-tight">
              Ecology, Evolution &
              <br />
              <span className="text-ucsb-gold">Marine Biology</span>
            </h1>

            {/* Subtitle - warmer, more conversational */}
            <p className="text-lg md:text-xl mb-10 text-white/85 leading-relaxed max-w-xl">
              From kelp forests to coral reefs, we study how life evolves and ecosystems function—asking questions that matter for the planet.
            </p>

            {/* Stats with refined styling */}
            <div className="flex gap-10 mb-12">
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-heading font-bold tracking-tight">25</div>
                <div className="text-sm text-white/60 mt-1 font-medium">Faculty</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-heading font-bold tracking-tight">100+</div>
                <div className="text-sm text-white/60 mt-1 font-medium">Grad Students</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-white">
                <div className="text-4xl md:text-5xl font-heading font-bold tracking-tight">2</div>
                <div className="text-sm text-white/60 mt-1 font-medium">LTER Sites</div>
              </div>
            </div>

            {/* CTA buttons - refined with better hierarchy */}
            <div className="flex gap-4 flex-wrap">
              <Link
                href="/people"
                className="group bg-ucsb-gold text-ucsb-navy px-7 py-3.5 rounded-xl font-bold hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-ucsb-gold/20 focus:ring-2 focus:ring-ucsb-gold focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
              >
                <span className="flex items-center gap-2">
                  Meet Our Faculty
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
              <Link
                href="/research"
                className="bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-semibold border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
              >
                Explore Research
              </Link>
            </div>
          </div>
        </div>

        {/* Photo credit - more subtle */}
        <p className="absolute bottom-4 right-4 text-white/40 text-xs font-medium">
          <span className="italic">Macrocystis pyrifera</span> · Santa Barbara Channel
        </p>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Wave divider transitioning to next section */}
      <WaveDivider variant="bold" toColor="fill-white" className="-mt-1" />
    </>
  )
}
