import HeroSection from '@/components/HeroSection'
import WhoWeAre from '@/components/WhoWeAre'
import ImpactMetrics from '@/components/ImpactMetrics'
import ResearchThemes from '@/components/ResearchThemes'
import PartnersSection from '@/components/PartnersSection'

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <WhoWeAre />
      <ImpactMetrics />
      <ResearchThemes />
      <PartnersSection />

      {/* Call-to-action section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        {/* Background with pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-96 h-96 bg-ocean-coral/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-ocean-teal/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-[1.1] text-white">
              Ready to Join EEMB?
            </h2>
            <p className="text-xl md:text-2xl mb-14 text-white/90 leading-relaxed max-w-4xl mx-auto">
              Whether you're a prospective graduate student, potential collaborator, or member of the media, we welcome you to explore opportunities in our department.
            </p>

            {/* Three-column CTA cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-14">
              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="w-14 h-14 bg-ocean-coral rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Graduate Students</h3>
                <p className="text-white/80 text-sm mb-5 leading-relaxed">Apply to our PhD or MS programs</p>
                <a href="/academics" className="inline-flex items-center gap-1 text-ocean-coral font-semibold hover:gap-2 transition-all duration-300">
                  Learn More
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>

              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="w-14 h-14 bg-ocean-sunset rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Researchers</h3>
                <p className="text-white/80 text-sm mb-5 leading-relaxed">Explore collaborations & expertise</p>
                <a href="/people" className="inline-flex items-center gap-1 text-ocean-coral font-semibold hover:gap-2 transition-all duration-300">
                  Meet Faculty
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>

              <div className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                <div className="w-14 h-14 bg-ocean-teal rounded-xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Media & Press</h3>
                <p className="text-white/80 text-sm mb-5 leading-relaxed">Connect with our experts</p>
                <a href="/contact" className="inline-flex items-center gap-1 text-ocean-coral font-semibold hover:gap-2 transition-all duration-300">
                  Get in Touch
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </a>
              </div>
            </div>

            <div className="flex justify-center gap-5 flex-wrap">
              <a
                href="/academics"
                className="group bg-ocean-coral text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-ocean-sunset transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
              >
                <span className="inline-block group-hover:scale-105 transition-transform duration-300">
                  Apply Now
                </span>
              </a>
              <a
                href="/research"
                className="group bg-white text-ocean-blue px-10 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
              >
                <span className="inline-block group-hover:scale-105 transition-transform duration-300">
                  Explore Research
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}