'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  Handshake,
  Brain,
  Accessibility,
  Mic,
  Users,
  Rainbow,
  Star,
  Home,
  PartyPopper,
  Rocket,
  LucideIcon
} from 'lucide-react'

interface Initiative {
  id: string
  title: string
  description: string
  fullDescription: string
  icon: LucideIcon
}

export default function DEIPage() {
  const [expandedInitiative, setExpandedInitiative] = useState<string | null>(null)

  // DEI Committee information
  const committeeInfo = {
    chairs: [
      { name: 'Deron Burkepile', role: 'Co-Chair', email: 'dburkepile@ucsb.edu' },
      { name: 'Cherie Briggs', role: 'Co-Chair', email: 'briggs@ucsb.edu' }
    ],
    description: 'The EEMB DEI Committee works to promote diversity, equity, and inclusion throughout our department. We develop and implement initiatives to create a welcoming environment for all members of our community.'
  }

  const initiatives: Initiative[] = [
    {
      id: 'recruitment',
      title: 'Inclusive Recruitment',
      description: 'Actively recruiting diverse students and faculty from underrepresented groups in STEM.',
      fullDescription: 'We have implemented comprehensive recruitment strategies targeting students from underrepresented backgrounds in biology and environmental sciences. Our efforts include partnerships with community colleges, minority-serving institutions, and outreach programs in K-12 schools.',
      icon: GraduationCap,
    },
    {
      id: 'mentorship',
      title: 'Mentorship Programs',
      description: 'Comprehensive mentoring for underrepresented students to support their success.',
      fullDescription: 'Our departmental mentorship programs pair students from underrepresented backgrounds with faculty and advanced graduate student mentors. Programs include academic support, career guidance, and professional development workshops.',
      icon: Handshake,
    },
    {
      id: 'bias-training',
      title: 'Unconscious Bias Training',
      description: 'Regular training for faculty and staff on recognizing and addressing implicit bias.',
      fullDescription: 'All faculty, staff, and graduate teaching assistants participate in evidence-based training on unconscious bias, inclusive teaching, and creating welcoming learning environments.',
      icon: Brain,
    },
    {
      id: 'accessibility',
      title: 'Accessibility & Accommodations',
      description: 'Ensuring all students have equal access to educational opportunities and resources.',
      fullDescription: 'We work closely with Disabled Students Program (DSP) to provide accommodations for students with disabilities. Our facilities and curriculum are designed to be accessible, and we continuously work to improve our accessibility practices.',
      icon: Accessibility,
    },
    {
      id: 'diversity-seminar',
      title: 'Diversity in Biology Seminar',
      description: 'Monthly seminars celebrating diverse perspectives and experiences in biological sciences.',
      fullDescription: 'This seminar series features speakers from underrepresented groups in biology discussing their research, career paths, and experiences in STEM. Open to all students, these events highlight diverse role models and foster inclusive community.',
      icon: Mic,
    },
    {
      id: 'family-support',
      title: 'Graduate Student Family Support',
      description: 'Support programs for graduate students with family responsibilities.',
      fullDescription: 'We provide childcare subsidies, parental leave policies, lactation rooms, and flexible scheduling to support graduate students who are parents or have other family responsibilities.',
      icon: Users,
    },
    {
      id: 'lgbtq-support',
      title: 'LGBTQ+ Inclusion',
      description: 'Creating a welcoming and affirming environment for LGBTQ+ members of our community.',
      fullDescription: 'Our department is committed to creating an inclusive environment for LGBTQ+ students, faculty, and staff. We use affirming language, support gender diversity, and actively work to address discrimination.',
      icon: Rainbow,
    },
    {
      id: 'first-gen',
      title: 'First-Generation Support',
      description: 'Targeted support for first-generation college students navigating higher education.',
      fullDescription: 'First-generation students face unique challenges in higher education. We provide navigation support, peer mentoring, financial resources, and community to help first-gen students thrive.',
      icon: Star,
    }
  ]

  const resources = [
    {
      title: 'Disabled Students Program (DSP)',
      description: 'Accommodations and support for students with disabilities.',
      link: 'https://dsp.sa.ucsb.edu/'
    },
    {
      title: 'Office of Diversity, Equity & Inclusion',
      description: 'Campus-wide DEI resources and initiatives.',
      link: 'https://diversity.ucsb.edu/'
    },
    {
      title: 'UCSB Counseling & Psychological Services',
      description: 'Mental health support for students.',
      link: 'https://caps.sa.ucsb.edu/'
    },
    {
      title: 'Title IX & Sexual Harassment',
      description: 'Resources for reporting and addressing sexual harassment and misconduct.',
      link: 'https://titleix.ucsb.edu/'
    },
    {
      title: 'Office of the Ombuds',
      description: 'Confidential conflict resolution and support.',
      link: 'https://ombuds.ucsb.edu/'
    },
    {
      title: 'Office of International Students & Scholars',
      description: 'Support for international students.',
      link: 'https://oiss.sa.ucsb.edu/'
    },
    {
      title: 'Financial Aid Office',
      description: 'Scholarships and financial support.',
      link: 'https://www.finaid.ucsb.edu/'
    }
  ]

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">Diversity, Equity & Inclusion</h1>
            <p className="text-lg md:text-xl text-white/90">
              Creating a welcoming, inclusive community where all students, faculty, and staff can thrive and contribute their unique perspectives and talents.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 bg-white border-b border-warm-200">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-ocean-deep mb-4">Our Commitment to DEI</h2>
            <p className="text-lg text-warm-700">
              The Department of Ecology, Evolution and Marine Biology is committed to creating an environment that celebrates and respects diversity in all its forms. We recognize that diverse perspectives strengthen our research, enhance learning, and better equip us to address global environmental challenges. We are dedicated to recruiting and retaining talented individuals from underrepresented groups, fostering an inclusive culture, and working actively to dismantle barriers to equity in our department and the broader scientific community.
            </p>
          </div>
        </div>
      </section>

      {/* DEI Committee */}
      <section className="py-12 bg-gradient-to-br from-ocean-deep/5 to-ocean-teal/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-ocean-deep mb-6 text-center">DEI Committee</h2>
            <p className="text-lg text-warm-700 mb-8 text-center">
              {committeeInfo.description}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {committeeInfo.chairs.map((chair, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-warm-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {chair.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ocean-deep">{chair.name}</h3>
                      <p className="text-warm-600">{chair.role}</p>
                      <a href={`mailto:${chair.email}`} className="text-ocean-blue hover:underline text-sm">
                        {chair.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-warm-600">
                For DEI-related inquiries, please contact: <a href="mailto:eemb-dei@ucsb.edu" className="text-ocean-blue hover:underline font-semibold">eemb-dei@ucsb.edu</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ocean-deep mb-12 text-center">Our Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {initiatives.map(initiative => (
              <button
                key={initiative.id}
                onClick={() => setExpandedInitiative(expandedInitiative === initiative.id ? null : initiative.id)}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-left border-2 border-warm-200 hover:border-ocean-teal"
              >
                <div className="mb-4">
                  <initiative.icon className="w-10 h-10 text-ocean-teal" />
                </div>
                <h3 className="text-lg font-bold text-ocean-deep mb-2 group-hover:text-ocean-teal transition">
                  {initiative.title}
                </h3>
                <p className="text-sm text-warm-600">
                  {initiative.description}
                </p>
              </button>
            ))}
          </div>

          {/* Detailed View */}
          {expandedInitiative && (
            <div className="mt-12 bg-gradient-to-br from-ocean-teal/5 to-bioluminescent/5 rounded-xl shadow-lg p-8 border-l-4 border-ocean-teal">
              {initiatives.find(i => i.id === expandedInitiative) && (
                <div className="max-w-3xl mx-auto">
                  {(() => {
                    const initiative = initiatives.find(i => i.id === expandedInitiative)!
                    return (
                      <>
                        <div className="flex items-start gap-6 mb-8">
                          <div>
                            <initiative.icon className="w-16 h-16 text-ocean-teal" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-3xl font-bold text-ocean-deep mb-2">{initiative.title}</h3>
                            <p className="text-lg text-warm-700">{initiative.description}</p>
                          </div>
                        </div>

                        <p className="text-lg text-warm-700 mb-8 leading-relaxed">
                          {initiative.fullDescription}
                        </p>

                        <div className="bg-white rounded-lg p-6 border-l-4 border-ocean-teal">
                          <p className="text-sm text-warm-600 mb-2">For more information:</p>
                          <a href="mailto:eemb-dei@ucsb.edu" className="text-ocean-teal font-semibold hover:underline">
                            eemb-dei@ucsb.edu
                          </a>
                        </div>

                        <button
                          onClick={() => setExpandedInitiative(null)}
                          className="mt-6 bg-ocean-deep text-white px-8 py-3 rounded-lg font-semibold hover:bg-ocean-blue transition"
                        >
                          Close Details
                        </button>
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Resources */}
      <section className="py-12 bg-warm-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ocean-deep mb-8 text-center">Resources & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-ocean-teal"
              >
                <h3 className="text-lg font-bold text-ocean-deep mb-2">{resource.title}</h3>
                <p className="text-warm-600 mb-4">{resource.description}</p>
                <span className="text-ocean-teal font-semibold hover:underline">Learn More &rarr;</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Belonging Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ocean-deep mb-8 text-center">Building Belonging</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Inclusive Environment',
                description: 'We are committed to creating spaces where every member of our community feels valued, respected, and able to bring their authentic selves to work and study.',
                icon: Home
              },
              {
                title: 'Celebrate Diversity',
                description: 'We celebrate the unique backgrounds, perspectives, and experiences that our diverse community members bring to our department and to science.',
                icon: PartyPopper
              },
              {
                title: 'Equity in Opportunity',
                description: 'We actively work to ensure that all students have equal access to opportunities for research, mentoring, and professional development.',
                icon: Rocket
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-ocean-teal/5 to-bioluminescent/5 rounded-lg p-8 border-2 border-ocean-teal/20 hover:border-ocean-teal transition">
                <div className="mb-4">
                  <item.icon className="w-12 h-12 text-ocean-teal" />
                </div>
                <h3 className="text-xl font-bold text-ocean-deep mb-3">{item.title}</h3>
                <p className="text-warm-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">We Welcome You</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you&apos;re a prospective student, a current member of our community, or someone interested in learning more about our DEI efforts, we&apos;d love to hear from you.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="bg-ucsb-gold text-ocean-deep px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition"
            >
              Get in Touch
            </Link>
            <a
              href="mailto:eemb-dei@ucsb.edu?subject=DEI%20Community%20Interest"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-ocean-deep transition"
            >
              Join Our Community
            </a>
          </div>
        </div>
      </section>

      {/* DEI Statement Footer */}
      <section className="py-12 bg-ocean-deep text-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h3 className="text-2xl font-bold mb-4">Our DEI Commitment</h3>
          <p className="text-white/80 leading-relaxed">
            As scientists dedicated to understanding and protecting the natural world, we recognize that environmental challenges disproportionately affect communities that are already marginalized. A diverse, equitable, and inclusive scientific community better understands these complex issues and develops more effective solutions. We are committed to continuously improving our department&apos;s practices and working toward a science community where everyone belongs and can thrive.
          </p>
        </div>
      </section>
    </div>
  )
}
