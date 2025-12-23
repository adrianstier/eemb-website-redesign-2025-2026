import HeroSection from '@/components/HeroSection'
import QuickNav from '@/components/QuickNav'
import WhoWeAre from '@/components/WhoWeAre'
import ResearchThemes from '@/components/ResearchThemes'
import FeaturedFaculty from '@/components/FeaturedFaculty'
import FacultyQuote from '@/components/FacultyQuote'
import FeaturedNews from '@/components/FeaturedNews'
import UpcomingEvents from '@/components/UpcomingEvents'
import PartnersSection from '@/components/PartnersSection'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="bg-white">
      <HeroSection />
      <QuickNav />
      <WhoWeAre />
      <ResearchThemes />
      <FeaturedFaculty />
      <FacultyQuote />

      {/* News and Events side by side */}
      <section className="py-16 md:py-24 bg-warm-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* News */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-0.5 bg-ucsb-coral" />
                    <span className="text-ucsb-coral text-xs font-semibold tracking-wide uppercase">
                      News
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-ucsb-navy">
                    Latest News
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="group text-sm text-ocean-blue hover:text-ocean-deep transition-colors font-medium flex items-center gap-1"
                >
                  All news
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <FeaturedNews />
            </div>

            {/* Events */}
            <div>
              <div className="flex justify-between items-center mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-6 h-0.5 bg-ocean-teal" />
                    <span className="text-ocean-teal text-xs font-semibold tracking-wide uppercase">
                      Events
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-ucsb-navy">
                    Upcoming Events
                  </h2>
                </div>
                <Link
                  href="/calendar"
                  className="group text-sm text-ocean-blue hover:text-ocean-deep transition-colors font-medium flex items-center gap-1"
                >
                  Full calendar
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </section>

      {/* Graduate Programs CTA - refined design */}
      <section className="relative py-20 md:py-28 bg-ocean-deep overflow-hidden">
        {/* Subtle background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q15 20 30 30 T60 30' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 45 Q15 35 30 45 T60 45' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3Cpath d='M0 15 Q15 5 30 15 T60 15' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-ocean-blue/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-ucsb-gold/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl relative">
          <div className="grid md:grid-cols-5 gap-10 items-center">
            {/* Left content */}
            <div className="md:col-span-3 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-ucsb-gold" />
                <span className="text-ucsb-gold text-sm font-semibold tracking-wide uppercase">
                  Graduate Programs
                </span>
              </div>

              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Interested in
                <br />
                <span className="text-ucsb-gold">Graduate School?</span>
              </h2>

              <p className="text-lg md:text-xl text-white/80 mb-8 leading-relaxed max-w-lg">
                We offer PhD and MS programs with full funding. Our students work closely with faculty on research from day one.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/academics"
                  className="group bg-ucsb-gold text-ucsb-navy px-7 py-3.5 rounded-xl font-bold hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg hover:shadow-ucsb-gold/20 focus:ring-2 focus:ring-ucsb-gold focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
                >
                  <span className="flex items-center gap-2">
                    Learn About Programs
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-semibold border border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
                >
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="font-heading text-4xl font-bold text-ucsb-gold mb-1">100%</div>
                  <div className="text-white/70 text-sm">Funding for PhD students</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                  <div className="font-heading text-4xl font-bold text-ucsb-gold mb-1">5 yrs</div>
                  <div className="text-white/70 text-sm">Average time to PhD</div>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 col-span-2">
                  <div className="font-heading text-4xl font-bold text-ucsb-gold mb-1">Top 10</div>
                  <div className="text-white/70 text-sm">Ecology program nationally</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PartnersSection />
    </div>
  )
}
