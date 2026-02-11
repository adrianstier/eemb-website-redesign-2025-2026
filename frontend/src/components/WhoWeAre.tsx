'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useInView } from '@/hooks/useInView'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export default function WhoWeAre() {
  const prefersReducedMotion = useReducedMotion()
  const { ref, isInView } = useInView<HTMLElement>({
    threshold: 0.1,
    skip: prefersReducedMotion,
  })

  return (
    <section ref={ref} className="py-24 md:py-32 lg:py-40 bg-warm-50 overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ocean-teal/[0.03] rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ucsb-gold/[0.03] rounded-full blur-3xl" />

      <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-7xl relative">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left: Photo collage with asymmetric design */}
          <div className={`lg:col-span-5 relative transition-all duration-1000 delay-100 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
            {/* Main image */}
            <div className="relative">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/ucsb-aerial.jpg"
                  alt="Aerial view of UCSB campus where the Santa Ynez Mountains meet the Pacific Ocean"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-ocean-deep/20 to-transparent" />

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-white font-medium text-lg">
                    Where mountains meet the sea
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    UCSB's coastal campus
                  </p>
                </div>
              </div>

              {/* Floating accent image */}
              <div className="absolute -bottom-8 -right-8 w-40 h-40 md:w-52 md:h-52 rounded-2xl overflow-hidden shadow-warm-xl border-4 border-warm-50 hidden md:block">
                <Image
                  src="/images/about/marine-reef.jpg"
                  alt="Coral reef research"
                  fill
                  sizes="208px"
                  className="object-cover"
                />
              </div>

              {/* Decorative blob */}
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-bioluminescent/10 rounded-full blur-2xl" />
            </div>
          </div>

          {/* Right: Content */}
          <div className={`lg:col-span-7 transition-all duration-1000 delay-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
            {/* Eyebrow */}
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12 bg-gradient-to-r from-ocean-teal to-transparent" />
              <span className="text-ocean-teal text-sm font-semibold tracking-[0.2em] uppercase">
                Who We Are
              </span>
            </div>

            <h2 className="font-heading text-display-sm font-bold text-ocean-deep mb-8 leading-tight">
              A department shaped by
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-ocean-blue to-ocean-teal">
                place and purpose
              </span>
            </h2>

            <div className="space-y-6 text-warm-600 text-lg leading-relaxed mb-10">
              <p>
                Walk out of our building and you're at the edge of the Pacific. Drive an hour inland and you're in oak woodland. Fly eight hours and you're at our coral reef research station in French Polynesia.
              </p>
              <p>
                This isn't just geography—it's opportunity. Our researchers work across ecosystems, from genes to global patterns, asking questions that matter: How do species adapt to change? What makes ecosystems resilient? How can science inform conservation?
              </p>
            </div>

            {/* LTER highlights */}
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <Link
                href="/research#sbc-lter"
                className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-warm-200 hover:border-ocean-teal/30 hover:shadow-warm-lg transition-all duration-500"
              >
                <div className="w-1.5 h-16 bg-gradient-to-b from-ocean-teal to-ocean-blue rounded-full shrink-0" />
                <div>
                  <div className="font-heading font-bold text-ocean-deep group-hover:text-ocean-blue transition-colors">
                    Santa Barbara Coastal LTER
                  </div>
                  <div className="text-sm text-warm-600 mt-1">
                    25 years of kelp forest research
                  </div>
                </div>
              </Link>
              <Link
                href="/research#mcr-lter"
                className="group flex items-start gap-4 p-5 bg-white rounded-2xl border border-warm-200 hover:border-sunset-400/30 hover:shadow-warm-lg transition-all duration-500"
              >
                <div className="w-1.5 h-16 bg-gradient-to-b from-sunset-400 to-ucsb-coral rounded-full shrink-0" />
                <div>
                  <div className="font-heading font-bold text-ocean-deep group-hover:text-ocean-blue transition-colors">
                    Moorea Coral Reef LTER
                  </div>
                  <div className="text-sm text-warm-600 mt-1">
                    Tropical reef dynamics since 2004
                  </div>
                </div>
              </Link>
            </div>

            {/* Learn more link */}
            <Link
              href="/about"
              className="group inline-flex items-center gap-3 text-ocean-blue font-semibold text-lg hover:gap-4 transition-all duration-300"
            >
              Learn more about our department
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
