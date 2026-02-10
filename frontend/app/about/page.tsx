'use client'

import Link from 'next/link'
import Image from 'next/image'
import {
  GraduationCap,
  TrendingUp,
  Globe,
  Waves,
  TreePalm,
  Microscope,
  Star,
  Sun,
  Lightbulb,
  Bug,
  Users,
  Handshake,
  LucideIcon
} from 'lucide-react'

export default function AboutPage() {
  const milestones: { year: string; event: string; icon: LucideIcon }[] = [
    { year: '1960s', event: 'UCSB Biology Department established, laying the foundation for biological sciences at UCSB', icon: GraduationCap },
    { year: '1972-77', event: 'Vice Chancellor Alec Alexander strategically reallocated faculty appointments to strengthen ecology and marine biology', icon: TrendingUp },
    { year: '1995', event: 'EEMB faculty founded NCEAS (National Center for Ecological Analysis and Synthesis), pioneering synthesis science worldwide', icon: Globe },
    { year: '2000', event: 'NSF Santa Barbara Coastal Long Term Ecological Research Site established, enabling decades of kelp forest monitoring', icon: Waves },
    { year: '2004', event: 'NSF Moorea Coral Reef LTER established in French Polynesia, expanding our tropical research footprint', icon: TreePalm },
    { year: '2010s', event: 'Department grows to 40+ research groups, becomes top-ranked program in marine science and ecology', icon: Microscope },
    { year: 'Present', event: 'Recognized globally: Top 10 in research impact, Top 3 in Marine Science, leading climate change and biodiversity research', icon: Star }
  ]

  const researchCenters = [
    {
      name: 'Marine Science Institute',
      description: 'Premier research facility for marine ecology, oceanography, and coastal science with direct ocean access.',
      link: 'https://msi.ucsb.edu',
    },
    {
      name: 'NCEAS',
      description: 'The National Center for Ecological Analysis and Synthesis, founded by EEMB faculty, pioneering synthesis science.',
      link: 'https://www.nceas.ucsb.edu',
    },
    {
      name: 'Santa Barbara Coastal LTER',
      description: 'Long-term ecological research site monitoring kelp forests and coastal ecosystems since 2000.',
      link: 'https://sbclter.msi.ucsb.edu',
    },
    {
      name: 'Moorea Coral Reef LTER',
      description: 'World-class tropical research station in French Polynesia studying coral reef dynamics.',
      link: 'https://mcr.lternet.edu',
    },
    {
      name: 'Cheadle Center for Biodiversity',
      description: 'Focus on ecological restoration and conservation of California\'s native ecosystems.',
      link: 'https://www.ccber.ucsb.edu',
    },
    {
      name: 'Coal Oil Point & Sedgwick Reserves',
      description: 'UC Natural Reserve System sites supporting coastal and terrestrial field research.',
      link: 'https://www.nrs.ucsb.edu',
    },
  ]

  const whyEEMB: { title: string; description: string; icon: LucideIcon }[] = [
    {
      title: 'Unparalleled Coastal Location',
      description: 'Our campus sits directly on the Pacific Ocean, providing immediate access to kelp forests, rocky intertidal zones, sandy beaches, and the Santa Barbara Channel—a biodiversity hotspot.',
      icon: Waves,
    },
    {
      title: 'Year-Round Fieldwork',
      description: 'California\'s Mediterranean climate enables field research 365 days a year, from local coastal habitats to the Sierra Nevada, Mojave Desert, and Channel Islands.',
      icon: Sun,
    },
    {
      title: 'Birthplace of Synthesis Science',
      description: 'EEMB faculty founded NCEAS in 1995, revolutionizing how ecologists collaborate and analyze data at global scales. This legacy of innovation continues today.',
      icon: Lightbulb,
    },
    {
      title: 'Two Long-Term Ecological Research Sites',
      description: 'Direct access to NSF-funded LTER sites in the Santa Barbara Channel and Moorea, French Polynesia—enabling research from temperate to tropical ecosystems.',
      icon: Microscope,
    },
    {
      title: 'Marine + Terrestrial Integration',
      description: 'Unlike purely marine programs, EEMB integrates marine biology with terrestrial ecology and evolution, enabling unique cross-ecosystem research.',
      icon: Bug,
    },
    {
      title: 'Channel Islands Access',
      description: 'Research partnerships with Channel Islands National Park and Marine Sanctuary provide access to pristine island ecosystems just offshore.',
      icon: TreePalm,
    },
  ]

  const researchHighlights = [
    {
      area: 'Climate Change Ecology',
      description: 'Understanding how ecosystems respond to warming oceans, drought, and changing fire regimes across California and beyond.',
      image: '/images/about/kelp-banner.jpg',
    },
    {
      area: 'Marine Conservation',
      description: 'From coral reef restoration to sustainable fisheries, developing science-based solutions for ocean health.',
      image: '/images/about/coral-reef.jpg',
    },
    {
      area: 'Evolutionary Genomics',
      description: 'Uncovering the genetic basis of adaptation and speciation using cutting-edge sequencing and computational approaches.',
      image: '/images/about/evolution-flower.jpg',
    },
  ]

  const globalReach = [
    { location: 'Santa Barbara Channel', type: 'LTER Site', description: 'Kelp forest ecosystem research' },
    { location: 'Moorea, French Polynesia', type: 'LTER Site', description: 'Coral reef dynamics' },
    { location: 'Channel Islands', type: 'Field Site', description: 'Island ecology & conservation' },
    { location: 'Antarctica', type: 'Research Expeditions', description: 'Polar marine biology' },
    { location: 'Kenya', type: 'International Partnership', description: 'Savanna ecology' },
    { location: 'Alaska & Arctic', type: 'Field Research', description: 'Tundra & permafrost ecology' },
    { location: 'Hawaii', type: 'Collaborative Research', description: 'Invasion biology' },
    { location: 'Panama', type: 'Tropical Research', description: 'Rainforest ecology' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Real Photo */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src="/images/about/kelp-banner.jpg"
          alt="Giant kelp forest in Santa Barbara Channel"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/90 via-ocean-deep/50 to-transparent"></div>

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 max-w-6xl pb-12">
            <div className="max-w-3xl">
              <div className="inline-block mb-4 px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                <p className="text-xs font-semibold tracking-wide uppercase text-white">About EEMB</p>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight text-white">
                Where Land Meets Sea,<br />Science Meets Discovery
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                For over 60 years, UC Santa Barbara's Department of Ecology, Evolution, and Marine Biology has been at the forefront of understanding life on Earth—from molecules to ecosystems, from local kelp forests to global climate patterns.
              </p>
            </div>
          </div>
        </div>

        <p className="absolute bottom-2 right-4 text-white/60 text-xs">
          Photo: Giant kelp (Macrocystis pyrifera) in the Santa Barbara Channel
        </p>
      </section>

      {/* Why EEMB - The Differentiator Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal/10 rounded-full">
              <p className="text-xs font-semibold text-ocean-teal uppercase tracking-wide">Our Advantage</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">Why EEMB at UCSB?</h2>
            <p className="text-warm-600 max-w-3xl mx-auto text-lg">
              No other ecology program offers our unique combination of location, facilities, and research culture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyEEMB.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-warm-200 shadow-md hover:shadow-xl transition-all duration-200">
                <div className="mb-4">
                  <item.icon className="w-10 h-10 text-ocean-blue" />
                </div>
                <h3 className="text-lg font-bold text-ucsb-navy mb-2">{item.title}</h3>
                <p className="text-warm-600 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Break - Campus/Coast Photo */}
      <section className="relative h-64 md:h-80">
        <Image
          src="/images/about/ucsb-aerial.jpg"
          alt="UCSB campus aerial view showing coastline"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep/80 to-transparent flex items-center">
          <div className="container mx-auto px-4 max-w-6xl">
            <blockquote className="max-w-xl text-white">
              <p className="text-2xl md:text-3xl font-light italic leading-relaxed">
                "The only major research university in the US where the campus borders the Pacific Ocean"
              </p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Mission - Rewritten to be EEMB-specific */}
      <section className="py-12 md:py-16 bg-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal/10 rounded-full">
                <p className="text-xs font-semibold text-ocean-teal uppercase tracking-wide">Our Purpose</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-6">What We Do</h2>
              <div className="space-y-4 text-warm-700 leading-relaxed">
                <p>
                  We study <strong>how living organisms interact with their environments and with each other</strong>—from the behavior and physiology of individual organisms to the functioning of entire ecosystems.
                </p>
                <p>
                  Our research spans the tree of life, from microbes to mammals, and addresses some of the most pressing questions of our time: How will ecosystems respond to climate change? What drives biodiversity? How can we sustainably manage fisheries and forests?
                </p>
                <p>
                  With <strong>40+ faculty research groups</strong>, we train the next generation of scientists through rigorous graduate programs and hands-on undergraduate research experiences.
                </p>
              </div>
            </div>
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/about/campus-lagoon.jpg"
                alt="UCSB Campus Lagoon"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Research Highlights */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-ucsb-coral/10 rounded-full">
              <p className="text-xs font-semibold text-ucsb-coral uppercase tracking-wide">Research Impact</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">Research That Matters</h2>
            <p className="text-warm-600 max-w-2xl mx-auto">
              Our faculty lead groundbreaking research addressing critical environmental challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {researchHighlights.map((highlight, index) => (
              <div key={index} className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-200">
                <div className="relative h-48">
                  <Image
                    src={highlight.image}
                    alt={highlight.area}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 to-transparent"></div>
                  <h3 className="absolute bottom-4 left-4 right-4 text-xl font-bold text-white">{highlight.area}</h3>
                </div>
                <div className="p-5 bg-white">
                  <p className="text-warm-600 text-sm leading-relaxed">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/research" className="inline-flex items-center gap-2 bg-ocean-blue text-white px-8 py-3 rounded-lg font-semibold hover:bg-ocean-deep transition-colors focus:ring-2 focus:ring-ocean-blue focus:ring-offset-2 focus:outline-none">
              Explore All Research Areas
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Global Research Reach */}
      <section className="py-12 md:py-16 bg-ocean-deep text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-white/20 rounded-full">
              <p className="text-xs font-semibold uppercase tracking-wide">Global Impact</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Research Around the World</h2>
            <p className="text-white/80 max-w-2xl mx-auto">
              EEMB researchers conduct fieldwork on every continent, from Arctic tundra to tropical coral reefs.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {globalReach.map((site, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-lg p-4 hover:bg-white/20 transition-colors">
                <p className="font-bold text-ucsb-gold mb-1">{site.location}</p>
                <p className="text-xs text-white/60 uppercase tracking-wide mb-2">{site.type}</p>
                <p className="text-sm text-white/80">{site.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Centers & Facilities */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal/10 rounded-full">
              <p className="text-xs font-semibold text-ocean-teal uppercase tracking-wide">Our Facilities</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">World-Class Research Infrastructure</h2>
            <p className="text-warm-600 max-w-2xl mx-auto">
              Access to premier research centers, long-term study sites, and natural reserves.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {researchCenters.map((center, index) => (
              <a
                key={index}
                href={center.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-lg p-6 border border-warm-200 shadow-md hover:shadow-xl hover:border-ocean-blue/30 transition-all duration-200"
              >
                <h3 className="text-lg font-bold text-ucsb-navy mb-2 group-hover:text-ocean-blue transition-colors">
                  {center.name}
                  <svg className="inline-block w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </h3>
                <p className="text-warm-600 text-sm leading-relaxed">{center.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-12 md:py-16 bg-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal/10 rounded-full">
              <p className="text-xs font-semibold text-ocean-teal uppercase tracking-wide">Our Story</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-3">Six Decades of Discovery</h2>
            <p className="text-warm-600">From a small biology department to a globally recognized research powerhouse</p>
          </div>

          <div className="relative">
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ocean-teal via-ocean-blue to-ocean-deep"></div>

            {milestones.map((milestone, index) => (
              <div key={index} className={`relative mb-8 md:mb-10 ${index % 2 === 0 ? 'md:pr-1/2' : 'md:pl-1/2 md:ml-auto'}`}>
                <div className={`flex items-center gap-4 md:gap-6 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-ocean-teal to-ocean-blue rounded-full flex items-center justify-center shadow-lg z-10">
                    <milestone.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div className="flex-1 bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow duration-200 border border-warm-200">
                    <p className="text-xl font-bold text-ocean-teal mb-2">{milestone.year}</p>
                    <p className="text-warm-700 text-sm leading-relaxed">{milestone.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* By the Numbers */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal/10 rounded-full">
              <p className="text-xs font-semibold text-ocean-teal uppercase tracking-wide">Our Impact</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-3">EEMB By the Numbers</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { number: '40+', label: 'Research Groups' },
              { number: '100+', label: 'Grad Students' },
              { number: '800+', label: 'Undergrad Majors' },
              { number: 'Top 3', label: 'Marine Science' },
              { number: 'Top 10', label: 'Research Impact' },
              { number: '2', label: 'LTER Sites' }
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center border border-warm-200 shadow-md hover:shadow-xl transition-shadow duration-200">
                <div className="text-3xl md:text-4xl font-bold text-ocean-blue mb-2">
                  {stat.number}
                </div>
                <p className="text-xs md:text-sm text-warm-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-12 md:py-16 bg-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal/10 rounded-full">
              <p className="text-xs font-semibold text-ocean-teal uppercase tracking-wide">Department Leadership</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-3">Meet Our Leadership</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { role: 'Department Chair', name: 'Todd Oakley', title: 'Professor', slug: 'todd-oakley', color: 'from-ocean-teal to-ocean-blue' },
              { role: 'Vice Chair, Resources', name: 'Hillary Young', title: 'Professor', slug: 'hillary-young', color: 'from-ucsb-coral to-orange-400' },
              { role: 'Vice Chair, Curriculum', name: 'Stephen Proulx', title: 'Professor', slug: 'stephen-proulx', color: 'from-ocean-blue to-ocean-deep' },
            ].map((leader, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-warm-200 hover:shadow-xl transition-shadow text-center">
                <div className={`w-20 h-20 bg-gradient-to-br ${leader.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <svg className="w-10 h-10 text-white/80" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs font-semibold text-ocean-teal uppercase tracking-wide mb-2">{leader.role}</p>
                <h3 className="text-lg font-bold text-ucsb-navy">{leader.name}</h3>
                <p className="text-warm-500 text-sm mb-4">{leader.title}</p>
                <Link href={`/people/faculty/${leader.slug}`} className="inline-flex items-center gap-1 text-ocean-blue font-semibold text-sm hover:gap-2 hover:text-ocean-teal transition-all">
                  View Profile
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <div className="inline-block mb-3 px-3 py-1 bg-ocean-teal/10 rounded-full">
                <p className="text-xs font-semibold text-ocean-teal uppercase tracking-wide">Visit Us</p>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-6">Contact & Location</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-ocean-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-ocean-teal" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-warm-800">Department Address</p>
                    <p className="text-warm-600 text-sm">
                      Department of Ecology, Evolution & Marine Biology<br/>
                      University of California, Santa Barbara<br/>
                      Santa Barbara, CA 93106-9620
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-ocean-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-ocean-teal" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-warm-800">Phone</p>
                    <a href="tel:+18058932974" className="text-ocean-blue hover:text-ocean-teal transition-colors">(805) 893-2974</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-ocean-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-ocean-teal" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-warm-800">Email</p>
                    <a href="mailto:info@eemb.ucsb.edu" className="text-ocean-blue hover:text-ocean-teal transition-colors">info@eemb.ucsb.edu</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative h-80 md:h-auto rounded-xl overflow-hidden shadow-lg">
              <Image
                src="/images/about/marine-reef.jpg"
                alt="Marine research - fish on coral reef"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/60 to-transparent flex items-end p-6">
                <p className="text-white text-sm">Chlorurus frontalis foraging on reef. Photo: Katie Davis</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore More */}
      <section className="py-12 md:py-16 bg-warm-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-ucsb-navy mb-10">Explore EEMB</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { href: '/people', label: 'People', desc: 'Faculty, students & staff', icon: Users },
              { href: '/research', label: 'Research', desc: 'Explore our research areas', icon: Microscope },
              { href: '/academics', label: 'Academics', desc: 'Graduate & undergrad programs', icon: GraduationCap },
              { href: '/dei', label: 'DEI', desc: 'Diversity & inclusion', icon: Handshake },
            ].map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="group bg-white rounded-xl p-6 border border-warm-200 shadow-md hover:shadow-xl hover:border-ocean-blue/30 transition-all text-center"
              >
                <div className="mb-3 flex justify-center">
                  <link.icon className="w-10 h-10 text-ocean-blue" />
                </div>
                <h3 className="font-bold text-ucsb-navy group-hover:text-ocean-blue transition-colors">{link.label}</h3>
                <p className="text-warm-500 text-sm">{link.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-deep to-ocean-blue"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join EEMB?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you're a prospective graduate student, researcher, or collaborator, we'd love to hear from you.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/academics" className="bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 hover:shadow-lg transition-all focus:ring-2 focus:ring-ucsb-gold focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none">
              Graduate Programs
            </Link>
            <Link href="/contact" className="bg-white/10 border-2 border-white/60 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 hover:border-white transition-all focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-ocean-deep focus:outline-none">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
