import HeroSection from '@/components/HeroSection'
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
    <div>
      <HeroSection />
      <WhoWeAre />
      <ResearchThemes />
      <FeaturedFaculty />
      <FacultyQuote />

      {/* News and Events side by side */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-10">
            {/* News */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-ucsb-navy">Latest News</h2>
                <Link
                  href="/news"
                  className="text-sm text-ocean-blue hover:text-ocean-teal transition-colors font-medium"
                >
                  All news →
                </Link>
              </div>
              <FeaturedNews />
            </div>

            {/* Events */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-ucsb-navy">Upcoming Events</h2>
                <Link
                  href="/calendar"
                  className="text-sm text-ocean-blue hover:text-ocean-teal transition-colors font-medium"
                >
                  Full calendar →
                </Link>
              </div>
              <UpcomingEvents />
            </div>
          </div>
        </div>
      </section>

      {/* Graduate Programs CTA */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Interested in Graduate School?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            We offer PhD and MS programs with full funding. Our students work closely with faculty on research from day one.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/academics"
              className="bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 hover:shadow-lg transition-all focus:ring-2 focus:ring-ucsb-gold focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
            >
              Learn About Programs
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 text-white border-2 border-white/60 px-8 py-3 rounded-lg font-semibold hover:bg-white/20 hover:border-white transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <PartnersSection />
    </div>
  )
}
