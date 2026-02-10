'use client'

import Image from 'next/image'
import Link from 'next/link'
import WaveDivider from '@/components/ui/WaveDivider'

// Real graduate student perspectives
const studentVoices = [
  {
    quote: "What drew me to EEMB was the chance to study kelp forest ecology literally steps from my lab. I can run an experiment in the morning and be diving at Campus Point in the afternoon.",
    name: "PhD Student",
    year: "4th Year PhD",
    advisor: "Marine Ecology",
    research: "Kelp forest community dynamics",
  },
  {
    quote: "The collaborative culture here is genuine. My committee includes faculty from three different research groups, and that cross-pollination has shaped my dissertation in ways I never expected.",
    name: "Graduate Student",
    year: "3rd Year PhD",
    advisor: "Disease Ecology",
    research: "Disease ecology modeling",
  },
  {
    quote: "I came for the marine biology, but discovered a passion for evolution. EEMB gave me the flexibility to pivot my research focus while still finishing in five years.",
    name: "Recent PhD Graduate",
    year: "PhD Alumni",
    advisor: "Evolutionary Biology",
    research: "Bioluminescence evolution",
  },
]

// Why EEMB - specific differentiators
const whyEemb = [
  {
    title: "Research at Your Doorstep",
    description: "Our campus sits between the Santa Ynez Mountains and the Pacific Ocean. Kelp forests, tide pools, chaparral, and oak woodlands are all within a short walk or drive.",
    highlight: "5 min to Campus Point reef",
  },
  {
    title: "Two LTER Sites",
    description: "EEMB leads both the Santa Barbara Coastal and Moorea Coral Reef Long-Term Ecological Research programs—decades of data at your fingertips.",
    highlight: "25+ years of ecosystem data",
  },
  {
    title: "Full Funding, No GRE",
    description: "We fund our graduate students through teaching, research assistantships, and fellowships. We evaluate you holistically—not by a standardized test score.",
    highlight: "100% of admitted students funded",
  },
  {
    title: "Faculty Who Mentor",
    description: "With 35+ faculty and ~100 graduate students, you'll get real mentorship. Most labs have 3-6 grad students, not 15.",
    highlight: "Low student-to-faculty ratio",
  },
]

// Real research experiences available
const researchExperiences = [
  {
    title: "Moorea Field Station",
    location: "French Polynesia",
    description: "Conduct coral reef research at our Gump Station on the island of Moorea. Many students spend a field season here.",
    image: "/images/about/marine-reef.jpg",
  },
  {
    title: "Santa Barbara Coastal LTER",
    location: "Local waters",
    description: "Join ongoing kelp forest research with access to boats, dive equipment, and long-term monitoring data.",
    image: "/images/about/kelp-banner.jpg",
  },
  {
    title: "Sedgwick Reserve",
    location: "Santa Ynez Valley",
    description: "Study oak woodland and grassland ecology at our 6,000-acre UC Natural Reserve, 40 minutes from campus.",
    image: "/images/about/campus-lagoon.jpg",
  },
]

// Program quick facts
const programFacts = {
  phd: {
    duration: "5-6 years typical",
    requirements: "Coursework, qualifying exams, original dissertation",
    funding: "Full support: TA/RA + fellowships",
    outcomes: "Academia, government agencies, conservation NGOs, industry",
  },
  ma: {
    duration: "2 years",
    requirements: "Coursework + thesis OR comprehensive exam",
    funding: "TA appointments + fellowships available",
    outcomes: "PhD programs, research technician, conservation careers",
  },
}

export default function AcademicsPage() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section - More personal and inviting */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <Image
          src="/images/about/ucsb-aerial.jpg"
          alt="UCSB campus where mountains meet the sea"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/70 to-ocean-deep/40" />

        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q15 20 30 30 T60 30' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-ucsb-gold" />
              <p className="text-ucsb-gold font-medium text-sm tracking-widest uppercase">
                Graduate Programs
              </p>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] text-white tracking-tight">
              Your Research
              <br />
              <span className="text-ucsb-gold">Starts Here</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 text-white/85 leading-relaxed max-w-2xl">
              Join a community of scientists asking big questions—from the genetics of adaptation
              to the fate of coral reefs. PhD and MA programs with full funding, no GRE required.
            </p>

            <div className="flex gap-4 flex-wrap">
              <Link
                href="/academics/graduate"
                className="bg-ucsb-gold text-ucsb-navy px-7 py-3.5 rounded-xl font-bold hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg"
              >
                Explore Graduate Programs
              </Link>
              <Link
                href="/people"
                className="bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition-all"
              >
                Find a Faculty Mentor
              </Link>
            </div>

            {/* Key stats inline */}
            <div className="mt-10 flex gap-8 flex-wrap">
              <div>
                <div className="text-3xl font-bold text-ucsb-gold">Dec 1</div>
                <div className="text-white/70 text-sm">Application Deadline</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-ucsb-gold">No GRE</div>
                <div className="text-white/70 text-sm">Required</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-ucsb-gold">100%</div>
                <div className="text-white/70 text-sm">Students Funded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider variant="bold" toColor="fill-white" className="-mt-1" />

      {/* Why EEMB Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-ocean-blue" />
              <span className="text-ocean-blue text-sm font-semibold tracking-wide uppercase">
                Why EEMB
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-4">
              What Makes Us Different
            </h2>
            <p className="text-warm-600 text-lg leading-relaxed">
              It&apos;s not just our rankings—it&apos;s our location, our culture, and our commitment
              to training scientists who make a difference.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {whyEemb.map((item, idx) => (
              <article
                key={idx}
                className="group bg-white rounded-2xl p-6 shadow-warm-md hover:shadow-warm-xl transition-all duration-300 border border-warm-200"
              >
                <div className="flex items-start gap-4">
                  <div className="w-1 h-16 bg-gradient-to-b from-ocean-teal to-ocean-blue rounded-full shrink-0" />
                  <div>
                    <h3 className="font-heading text-xl font-bold text-ucsb-navy mb-2 group-hover:text-ocean-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-warm-600 leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <span className="inline-block px-3 py-1 bg-ocean-teal/10 text-ocean-teal text-sm font-semibold rounded-full">
                      {item.highlight}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-warm-100" />

      {/* Student Voices Section */}
      <section className="py-16 md:py-24 bg-warm-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-ocean-teal" />
              <span className="text-ocean-teal text-sm font-semibold tracking-wide uppercase">
                Student Voices
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-4">
              Hear From Our Graduate Students
            </h2>
            <p className="text-warm-600 text-lg leading-relaxed">
              The best way to understand what it&apos;s like here? Listen to the people doing the work.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {studentVoices.map((student, idx) => (
              <article
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-warm-md border border-warm-200 flex flex-col"
              >
                <div className="mb-4">
                  <svg className="w-8 h-8 text-ocean-teal/30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                </div>
                <blockquote className="text-warm-700 leading-relaxed mb-6 flex-1">
                  &ldquo;{student.quote}&rdquo;
                </blockquote>
                <div className="border-t border-warm-200 pt-4">
                  <div className="font-semibold text-ucsb-navy">{student.name}</div>
                  <div className="text-sm text-warm-600">{student.year} • {student.advisor}</div>
                  <div className="text-sm text-ocean-blue mt-1">{student.research}</div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-white" />

      {/* Degree Programs */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-ucsb-gold" />
              <span className="text-ucsb-gold text-sm font-semibold tracking-wide uppercase">
                Degree Programs
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-4">
              PhD & MA in Ecology, Evolution, and Marine Biology
            </h2>
            <p className="text-warm-600 text-lg leading-relaxed">
              Whether you&apos;re aiming for a research career or want to deepen your expertise
              before moving into policy, education, or conservation—we have a path for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* PhD Program */}
            <div className="bg-gradient-to-br from-ocean-deep to-ocean-blue rounded-2xl overflow-hidden">
              <div className="p-8 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">PhD</span>
                  <span className="text-white/70">{programFacts.phd.duration}</span>
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Doctor of Philosophy</h3>
                <p className="text-white/80 leading-relaxed mb-6">
                  Our PhD program trains independent researchers through coursework, qualifying exams,
                  and original dissertation research. You&apos;ll work closely with a faculty mentor
                  while building expertise in your chosen area.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <span className="text-ucsb-gold">-</span>
                    <span className="text-white/90">Full funding: TA, RA, and fellowship support</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-ucsb-gold">-</span>
                    <span className="text-white/90">Field work opportunities worldwide</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-ucsb-gold">-</span>
                    <span className="text-white/90">Collaborative, interdisciplinary environment</span>
                  </div>
                </div>
                <Link
                  href="/academics/graduate"
                  className="inline-flex items-center gap-2 bg-ucsb-gold text-ucsb-navy px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition-all"
                >
                  PhD Program Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* MA Program */}
            <div className="bg-white rounded-2xl border-2 border-warm-200 overflow-hidden">
              <div className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-ocean-teal/10 text-ocean-teal rounded-full text-sm font-bold">MA</span>
                  <span className="text-warm-500">{programFacts.ma.duration}</span>
                </div>
                <h3 className="font-heading text-2xl font-bold text-ucsb-navy mb-4">Master of Arts</h3>
                <p className="text-warm-600 leading-relaxed mb-6">
                  Two pathways: Plan I (thesis) for those heading to PhD programs or research careers,
                  or Plan II (comprehensive exam) for those seeking advanced training for professional careers.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-2">
                    <span className="text-ocean-teal">-</span>
                    <span className="text-warm-700">Thesis or comprehensive exam options</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-ocean-teal">-</span>
                    <span className="text-warm-700">TA funding available</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-ocean-teal">-</span>
                    <span className="text-warm-700">Strong preparation for PhD or professional careers</span>
                  </div>
                </div>
                <Link
                  href="/academics/graduate"
                  className="inline-flex items-center gap-2 bg-ocean-teal text-white px-6 py-3 rounded-xl font-bold hover:bg-ocean-blue transition-all"
                >
                  MA Program Details
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-warm-100" />

      {/* Research Experiences */}
      <section className="py-16 md:py-24 bg-warm-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-ocean-blue" />
              <span className="text-ocean-blue text-sm font-semibold tracking-wide uppercase">
                Field Experiences
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-4">
              Your Lab Extends Beyond Campus
            </h2>
            <p className="text-warm-600 text-lg leading-relaxed">
              From local kelp forests to tropical coral reefs, our students conduct research
              in some of the world&apos;s most spectacular ecosystems.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {researchExperiences.map((exp, idx) => (
              <article
                key={idx}
                className="group bg-white rounded-2xl overflow-hidden shadow-warm-md hover:shadow-warm-xl transition-all duration-500 border border-warm-200"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={exp.image}
                    alt={exp.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-ocean-deep/30 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-bold text-ucsb-gold uppercase tracking-wide">
                      {exp.location}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-white mt-1">
                      {exp.title}
                    </h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-warm-600 text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-white" />

      {/* Application Timeline */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-ucsb-coral" />
              <span className="text-ucsb-coral text-sm font-semibold tracking-wide uppercase">
                How to Apply
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-4">
              Ready to Take the Next Step?
            </h2>
            <p className="text-warm-600 text-lg leading-relaxed">
              Our application process is straightforward, but start early—especially when
              reaching out to potential faculty mentors.
            </p>
          </div>

          <div className="bg-warm-100 rounded-2xl p-8 border border-warm-200">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-ocean-teal text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">1</div>
                <h4 className="font-semibold text-ucsb-navy mb-2">Find Your Mentor</h4>
                <p className="text-sm text-warm-600">
                  Browse faculty profiles and reach out to discuss research fit. This is required before admission.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-ocean-blue text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">2</div>
                <h4 className="font-semibold text-ucsb-navy mb-2">Prepare Materials</h4>
                <p className="text-sm text-warm-600">
                  Transcripts, 3 letters of recommendation, statement of purpose, personal history statement.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-ocean-deep text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold">3</div>
                <h4 className="font-semibold text-ucsb-navy mb-2">Apply by Dec 1</h4>
                <p className="text-sm text-warm-600">
                  Submit your application through the UC Santa Barbara Graduate Division portal.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-ucsb-gold text-ucsb-navy rounded-full flex items-center justify-center mx-auto mb-3 font-bold">4</div>
                <h4 className="font-semibold text-ucsb-navy mb-2">Decisions by April</h4>
                <p className="text-sm text-warm-600">
                  Admitted students visit campus and make their decision by April 15.
                </p>
              </div>
            </div>
          </div>

          {/* Important note */}
          <div className="mt-8 bg-ucsb-coral/10 border border-ucsb-coral/30 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-ucsb-coral/20 rounded-full flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-ucsb-coral" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-ucsb-navy mb-1">Contact Faculty First</h4>
                <p className="text-warm-700">
                  Applicants must be accepted by a faculty sponsor before admission. We strongly encourage you
                  to reach out to potential mentors early in the process. Review their recent publications
                  and explain why your research interests align.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              href="/academics/graduate"
              className="bg-ucsb-gold text-ucsb-navy px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all hover:shadow-lg"
            >
              Full Application Details
            </Link>
            <Link
              href="/people"
              className="bg-ocean-blue text-white px-8 py-4 rounded-xl font-semibold hover:bg-ocean-deep transition-all hover:shadow-lg"
            >
              Browse Faculty Profiles
            </Link>
          </div>
        </div>
      </section>

      <WaveDivider variant="bold" toColor="fill-ocean-deep" />

      {/* Final CTA */}
      <section className="bg-ocean-deep text-white py-16 md:py-20 -mt-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Questions? We&apos;re Here to Help.
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Reach out to our graduate program staff or connect with current students
            to learn more about life at EEMB.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="mailto:info@eemb.ucsb.edu"
              className="bg-ucsb-gold text-ucsb-navy px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all"
            >
              Email Graduate Program
            </a>
            <Link
              href="/contact"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
