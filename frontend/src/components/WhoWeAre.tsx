import Image from 'next/image'

export default function WhoWeAre() {
  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Left: Real photo */}
          <div className="relative h-80 md:h-[450px] rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/images/about/ucsb-aerial.jpg"
              alt="Aerial view of UCSB campus where the Santa Ynez Mountains meet the Pacific Ocean"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <p className="text-white/90 text-sm">
                Our campus sits where the Santa Ynez Mountains meet the Pacific
              </p>
            </div>
          </div>

          {/* Right: Content */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-5 leading-tight">
              Where the mountains meet the sea
            </h2>

            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                EEMB is home to researchers asking big questions: How do ecosystems respond to climate change? What shapes the evolution of species? How can we protect ocean health?
              </p>
              <p>
                Our location is our laboratory. Step off campus and you're in a kelp forest. Drive an hour and you're in oak savanna, chaparral, or alpine meadow. Fly eight hours and you're at our coral reef research station in French Polynesia.
              </p>
              <p>
                This isn't just a department—it's a community of scientists working across boundaries, from microbes to ecosystems, from theory to conservation.
              </p>
            </div>

            {/* LTER highlights */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="border-l-4 border-ocean-teal pl-4">
                <div className="font-bold text-ucsb-navy">Santa Barbara Coastal LTER</div>
                <div className="text-sm text-gray-600">25 years of kelp forest research</div>
              </div>
              <div className="border-l-4 border-ucsb-coral pl-4">
                <div className="font-bold text-ucsb-navy">Moorea Coral Reef LTER</div>
                <div className="text-sm text-gray-600">Tropical reef dynamics since 2004</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
