import Image from 'next/image'
import Link from 'next/link'

export default function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      {/* Real EEMB photo background */}
      <Image
        src="/images/about/kelp-banner.jpg"
        alt="Giant kelp forest in the Santa Barbara Channel"
        fill
        className="object-cover"
        priority
      />

      {/* Gradient overlay - style guide pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep/90 via-ocean-blue/70 to-ocean-teal/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 max-w-6xl">
        <div className="max-w-2xl">
          <p className="text-ucsb-gold font-semibold mb-3 text-sm tracking-wide uppercase">
            UC Santa Barbara
          </p>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] text-white">
            Ecology, Evolution &<br />
            Marine Biology
          </h1>

          <p className="text-lg md:text-xl mb-8 text-white/90 leading-relaxed">
            From the kelp forests of the Santa Barbara Channel to the coral reefs of Moorea—we study life across ecosystems, scales, and continents.
          </p>

          {/* Stats */}
          <div className="flex gap-8 mb-10 text-white">
            <div>
              <div className="text-3xl font-bold">25</div>
              <div className="text-sm text-white/70">Faculty</div>
            </div>
            <div>
              <div className="text-3xl font-bold">100+</div>
              <div className="text-sm text-white/70">Grad Students</div>
            </div>
            <div>
              <div className="text-3xl font-bold">2</div>
              <div className="text-sm text-white/70">LTER Sites</div>
            </div>
          </div>

          {/* CTA buttons - style guide compliant */}
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/people"
              className="bg-ucsb-gold text-ucsb-navy px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 hover:shadow-lg transition-all focus:ring-2 focus:ring-ucsb-gold focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
            >
              Meet Our Faculty
            </Link>
            <Link
              href="/research"
              className="bg-white/10 text-white border-2 border-white/60 px-6 py-3 rounded-lg font-semibold hover:bg-white/20 hover:border-white transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
            >
              Explore Research
            </Link>
          </div>
        </div>
      </div>

      {/* Photo credit */}
      <p className="absolute bottom-3 right-4 text-white/50 text-xs">
        Giant kelp (Macrocystis pyrifera) · Santa Barbara Channel
      </p>
    </section>
  )
}
