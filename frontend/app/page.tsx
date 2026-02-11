import { Metadata } from 'next'
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
import { getAllFaculty, getUpcomingEvents, getAllNews, getFeaturedResearchAreas } from '@/lib/data'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

export const metadata: Metadata = {
  openGraph: {
    title: 'EEMB - Ecology, Evolution & Marine Biology | UC Santa Barbara',
    description: 'Department of Ecology, Evolution and Marine Biology at UC Santa Barbara. Where the Santa Ynez Mountains meet the Pacific, we ask questions that matter.',
    type: 'website',
    siteName: 'EEMB | UC Santa Barbara',
  },
}

export const revalidate = 900 // Revalidate every 15 minutes

export default async function HomePage() {
  // Fetch data server-side in parallel
  const [faculty, events, news, researchAreas] = await Promise.all([
    getAllFaculty(),
    getUpcomingEvents({ limit: 5 }),
    getAllNews({ limit: 5 }),
    getFeaturedResearchAreas()
  ])

  return (
    <div className="bg-warm-50">
      {/* Hero with cinematic intro */}
      <HeroSection />

      {/* Quick navigation for different visitor types */}
      <QuickNav />

      {/* About section with asymmetric layout */}
      <WhoWeAre />

      {/* Research areas - magazine style */}
      <ResearchThemes researchAreas={researchAreas} />

      {/* Featured faculty - dynamic grid */}
      <FeaturedFaculty initialFaculty={faculty} />

      {/* Faculty testimonial - immersive quote */}
      <FacultyQuote />

      {/* News and Events side by side */}
      <section className="py-20 md:py-28 bg-warm-100 relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 topo-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ocean-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-ocean-teal/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl relative">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
            {/* News Column */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-10 bg-gradient-to-r from-ocean-blue to-transparent" />
                    <span className="text-ocean-blue text-xs font-semibold tracking-[0.2em] uppercase">
                      News
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-ocean-deep">
                    Latest Updates
                  </h2>
                </div>
                <Link
                  href="/news"
                  className="group flex items-center gap-2 text-sm text-ocean-blue hover:text-ocean-deep transition-colors font-semibold"
                >
                  All news
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <FeaturedNews initialNews={news} />
            </div>

            {/* Events Column */}
            <div>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px w-10 bg-gradient-to-r from-ocean-teal to-transparent" />
                    <span className="text-ocean-teal text-xs font-semibold tracking-[0.2em] uppercase">
                      Events
                    </span>
                  </div>
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-ocean-deep">
                    Upcoming Events
                  </h2>
                </div>
                <Link
                  href="/calendar"
                  className="group flex items-center gap-2 text-sm text-ocean-teal hover:text-ocean-deep transition-colors font-semibold"
                >
                  Full calendar
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <UpcomingEvents initialEvents={events} />
            </div>
          </div>
        </div>
      </section>

      {/* Graduate Programs CTA - immersive dark section */}
      <section className="relative py-24 md:py-32 bg-ocean-deep overflow-hidden">
        {/* Animated wave background */}
        <div className="absolute inset-0">
          <svg className="absolute bottom-0 left-0 right-0 text-white/[0.02] h-80" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z">
              <animate
                attributeName="d"
                dur="12s"
                repeatCount="indefinite"
                values="
                  M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z;
                  M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,128C672,117,768,139,864,160C960,181,1056,203,1152,192C1248,181,1344,139,1392,117.3L1440,96L1440,320L0,320Z;
                  M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,144C672,139,768,181,864,197.3C960,213,1056,203,1152,181.3C1248,160,1344,128,1392,112L1440,96L1440,320L0,320Z
                "
              />
            </path>
          </svg>
        </div>

        {/* Decorative orbs */}
        <div className="absolute top-20 right-20 w-[500px] h-[500px] bg-bioluminescent/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-ucsb-gold/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

        {/* Subtle pattern */}
        <div className="absolute inset-0 topo-pattern opacity-[0.02]" />

        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl relative">
          <div className="grid md:grid-cols-5 gap-12 lg:gap-16 items-center">
            {/* Left content */}
            <div className="md:col-span-3 text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-0.5 bg-gradient-to-r from-ucsb-gold to-transparent" />
                <span className="text-ucsb-gold text-sm font-semibold tracking-[0.2em] uppercase">
                  Graduate Programs
                </span>
              </div>

              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-[1.1]">
                Shape the future of
                <br />
                <span className="bg-gradient-to-r from-ucsb-gold via-sunset-400 to-ucsb-gold bg-clip-text text-transparent">
                  ecological science
                </span>
              </h2>

              <p className="text-lg md:text-xl text-white/70 mb-10 leading-relaxed max-w-lg">
                Join a community of scholars at the forefront of discovery. Our PhD and MS programs offer full funding, world-class mentorship, and access to extraordinary research ecosystems.
              </p>

              <div className="flex gap-4 flex-wrap">
                <Link
                  href="/academics/graduate"
                  className="group bg-ucsb-gold text-ocean-deep px-8 py-4 rounded-xl font-bold hover:shadow-glow-gold transition-all duration-300 focus:ring-2 focus:ring-ucsb-gold focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
                >
                  <span className="flex items-center gap-3">
                    Explore Programs
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/20 hover:bg-white/15 hover:border-white/40 transition-all duration-300 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none"
                >
                  Contact Graduate Advisor
                </Link>
              </div>
            </div>

            {/* Right - Stats */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-bioluminescent/30 transition-all duration-500">
                  <AnimatedCounter
                    end={100}
                    suffix="%"
                    className="text-4xl lg:text-5xl text-ucsb-gold group-hover:scale-105 transition-transform"
                    labelClassName="text-white/60 text-sm"
                    label="Funding for PhD students"
                  />
                </div>
                <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-bioluminescent/30 transition-all duration-500">
                  <AnimatedCounter
                    end={5}
                    suffix=" yrs"
                    className="text-4xl lg:text-5xl text-bioluminescent group-hover:scale-105 transition-transform"
                    labelClassName="text-white/60 text-sm"
                    label="Average time to PhD"
                  />
                </div>
                <div className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-bioluminescent/30 transition-all duration-500 col-span-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-heading text-4xl lg:text-5xl font-bold text-white group-hover:scale-105 transition-transform">Top</span>
                    <AnimatedCounter
                      end={10}
                      className="text-4xl lg:text-5xl text-white group-hover:scale-105 transition-transform"
                      labelClassName="hidden"
                    />
                    <div className="text-white/60 text-sm">Ecology program nationally</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Partners */}
      <PartnersSection />
    </div>
  )
}
