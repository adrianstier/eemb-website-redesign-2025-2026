import Image from 'next/image'

export default function WhoWeAre() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: Photo with asymmetric styling */}
          <div className="md:col-span-5 relative">
            {/* Decorative background element */}
            <div className="absolute -top-4 -left-4 w-full h-full bg-ocean-teal/10 rounded-2xl -z-10" />

            <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-warm-xl">
              <Image
                src="/images/about/ucsb-aerial.jpg"
                alt="Aerial view of UCSB campus where the Santa Ynez Mountains meet the Pacific Ocean"
                fill
                className="object-cover"
              />
              {/* Caption overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/50 to-transparent p-5">
                <p className="text-white/90 text-sm font-medium">
                  Where the Santa Ynez Mountains meet the Pacific
                </p>
              </div>
            </div>

            {/* Floating accent - kelp illustration hint */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-ucsb-gold/10 rounded-full blur-2xl" />
          </div>

          {/* Right: Content with improved typography */}
          <div className="md:col-span-7">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-ocean-teal" />
              <span className="text-ocean-teal text-sm font-semibold tracking-wide uppercase">
                Who We Are
              </span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-6 leading-tight">
              Where the mountains
              <br />
              <span className="text-ocean-blue">meet the sea</span>
            </h2>

            <div className="space-y-5 text-warm-700 text-lg leading-relaxed">
              <p>
                EEMB is home to researchers asking big questions: How do ecosystems respond to climate change? What shapes the evolution of species? How can we protect ocean health?
              </p>
              <p>
                Our location is our laboratory. Step off campus and you're in a kelp forest. Drive an hour and you're in oak savanna, chaparral, or alpine meadow. Fly eight hours and you're at our coral reef research station in French Polynesia.
              </p>
              <p className="text-warm-600">
                This isn't just a department—it's a community of scientists working across boundaries, from microbes to ecosystems, from theory to conservation.
              </p>
            </div>

            {/* LTER highlights - redesigned with cards */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="group p-5 bg-warm-100 rounded-xl border border-warm-200 hover:border-ocean-teal/30 hover:shadow-warm-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-12 bg-gradient-to-b from-ocean-teal to-ocean-blue rounded-full shrink-0" />
                  <div>
                    <div className="font-heading font-bold text-ucsb-navy group-hover:text-ocean-blue transition-colors">
                      Santa Barbara Coastal LTER
                    </div>
                    <div className="text-sm text-warm-600 mt-1">
                      25 years of kelp forest research
                    </div>
                  </div>
                </div>
              </div>
              <div className="group p-5 bg-warm-100 rounded-xl border border-warm-200 hover:border-ucsb-coral/30 hover:shadow-warm-md transition-all duration-300">
                <div className="flex items-start gap-3">
                  <div className="w-1 h-12 bg-gradient-to-b from-ucsb-coral to-sunset rounded-full shrink-0" />
                  <div>
                    <div className="font-heading font-bold text-ucsb-navy group-hover:text-ocean-blue transition-colors">
                      Moorea Coral Reef LTER
                    </div>
                    <div className="text-sm text-warm-600 mt-1">
                      Tropical reef dynamics since 2004
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
