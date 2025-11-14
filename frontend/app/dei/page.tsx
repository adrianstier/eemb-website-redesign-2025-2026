'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Initiative {
  id: string
  title: string
  description: string
  fullDescription: string
  icon: string
  leader: string
  contact: string
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
      icon: '🎓',
      leader: 'DEI Committee',
      contact: 'eemb-dei@ucsb.edu'
    },
    {
      id: 'mentorship',
      title: 'Mentorship Programs',
      description: 'Comprehensive mentoring for underrepresented students to support their success.',
      fullDescription: 'Our departmental mentorship programs pair students from underrepresented backgrounds with faculty and advanced graduate student mentors. Programs include academic support, career guidance, and professional development workshops.',
      icon: '🤝',
      leader: 'Dr. James Wilson',
      contact: 'jwilson@ucsb.edu'
    },
    {
      id: 'bias-training',
      title: 'Unconscious Bias Training',
      description: 'Regular training for faculty and staff on recognizing and addressing implicit bias.',
      fullDescription: 'All faculty, staff, and graduate teaching assistants participate in evidence-based training on unconscious bias, inclusive teaching, and creating welcoming learning environments.',
      icon: '🧠',
      leader: 'Dr. Angela Martinez',
      contact: 'amartinez@ucsb.edu'
    },
    {
      id: 'accessibility',
      title: 'Accessibility & Accommodations',
      description: 'Ensuring all students have equal access to educational opportunities and resources.',
      fullDescription: 'We work closely with Disabled Students Program (DSP) to provide accommodations for students with disabilities. Our facilities and curriculum are designed to be accessible, and we continuously work to improve our accessibility practices.',
      icon: '♿',
      leader: 'Dr. Robert Chen',
      contact: 'rchen@ucsb.edu'
    },
    {
      id: 'diversity-seminar',
      title: 'Diversity in Biology Seminar',
      description: 'Monthly seminars celebrating diverse perspectives and experiences in biological sciences.',
      fullDescription: 'This seminar series features speakers from underrepresented groups in biology discussing their research, career paths, and experiences in STEM. Open to all students, these events highlight diverse role models and foster inclusive community.',
      icon: '🎤',
      leader: 'Dr. Lisa Wong',
      contact: 'lwong@ucsb.edu'
    },
    {
      id: 'family-support',
      title: 'Graduate Student Family Support',
      description: 'Support programs for graduate students with family responsibilities.',
      fullDescription: 'We provide childcare subsidies, parental leave policies, lactation rooms, and flexible scheduling to support graduate students who are parents or have other family responsibilities.',
      icon: '👨‍👩‍👧‍👦',
      leader: 'Dr. Patricia Johnson',
      contact: 'pjohnson@ucsb.edu'
    },
    {
      id: 'lgbtq-support',
      title: 'LGBTQ+ Inclusion',
      description: 'Creating a welcoming and affirming environment for LGBTQ+ members of our community.',
      fullDescription: 'Our department is committed to creating an inclusive environment for LGBTQ+ students, faculty, and staff. We use affirming language, support gender diversity, and actively work to address discrimination.',
      icon: '🌈',
      leader: 'Dr. Michael Torres',
      contact: 'mtorres@ucsb.edu'
    },
    {
      id: 'first-gen',
      title: 'First-Generation Support',
      description: 'Targeted support for first-generation college students navigating higher education.',
      fullDescription: 'First-generation students face unique challenges in higher education. We provide navigation support, peer mentoring, financial resources, and community to help first-gen students thrive.',
      icon: '⭐',
      leader: 'Dr. Carlos Rodriguez',
      contact: 'crodriguez@ucsb.edu'
    }
  ]

  const resources = [
    {
      title: 'Disabled Students Program (DSP)',
      description: 'Accommodations and support for students with disabilities.',
      link: '#'
    },
    {
      title: 'Office of Diversity, Equity & Inclusion',
      description: 'Campus-wide DEI resources and initiatives.',
      link: '#'
    },
    {
      title: 'UCSB Counseling & Psychological Services',
      description: 'Mental health support for students.',
      link: '#'
    },
    {
      title: 'Women in Science',
      description: 'Support and mentoring for women in STEM.',
      link: '#'
    },
    {
      title: 'International Student Programs',
      description: 'Support for international students.',
      link: '#'
    },
    {
      title: 'Financial Aid Office',
      description: 'Scholarships and financial support.',
      link: '#'
    }
  ]

  const statistics = [
    { label: 'Women in Department', value: '45%' },
    { label: 'International Students', value: '32%' },
    { label: 'First-Generation Students', value: '28%' },
    { label: 'Underrepresented Minorities', value: '22%' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Diversity, Equity & Inclusion</h1>
            <p className="text-xl md:text-2xl text-white">
              Creating a welcoming, inclusive community where all students, faculty, and staff can thrive and contribute their unique perspectives and talents.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-ucsb-navy mb-4">Our Commitment to DEI</h2>
            <p className="text-lg text-gray-700">
              The Department of Ecology, Evolution and Marine Biology is committed to creating an environment that celebrates and respects diversity in all its forms. We recognize that diverse perspectives strengthen our research, enhance learning, and better equip us to address global environmental challenges. We are dedicated to recruiting and retaining talented individuals from underrepresented groups, fostering an inclusive culture, and working actively to dismantle barriers to equity in our department and the broader scientific community.
            </p>
          </div>
        </div>
      </section>

      {/* DEI Committee */}
      <section className="py-16 bg-gradient-to-br from-ocean-deep/5 to-ocean-teal/5">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-ucsb-navy mb-6 text-center">DEI Committee</h2>
            <p className="text-lg text-gray-700 mb-8 text-center">
              {committeeInfo.description}
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              {committeeInfo.chairs.map((chair, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-ocean-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {chair.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-ucsb-navy">{chair.name}</h3>
                      <p className="text-gray-600">{chair.role}</p>
                      <a href={`mailto:${chair.email}`} className="text-ocean-blue hover:underline text-sm">
                        {chair.email}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                For DEI-related inquiries, please contact: <a href="mailto:eemb-dei@ucsb.edu" className="text-ocean-blue hover:underline font-semibold">eemb-dei@ucsb.edu</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-12 text-center">Departmental Demographics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Initiatives Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-12 text-center">Our Initiatives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {initiatives.map(initiative => (
              <button
                key={initiative.id}
                onClick={() => setExpandedInitiative(expandedInitiative === initiative.id ? null : initiative.id)}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-6 text-left border-2 border-gray-200 hover:border-purple-600"
              >
                <div className="text-4xl mb-4">{initiative.icon}</div>
                <h3 className="text-lg font-bold text-ucsb-navy mb-2 group-hover:text-purple-600 transition">
                  {initiative.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {initiative.description}
                </p>
              </button>
            ))}
          </div>

          {/* Detailed View */}
          {expandedInitiative && (
            <div className="mt-12 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-lg p-8 border-l-4 border-purple-600">
              {initiatives.find(i => i.id === expandedInitiative) && (
                <div className="max-w-3xl mx-auto">
                  {(() => {
                    const initiative = initiatives.find(i => i.id === expandedInitiative)!
                    return (
                      <>
                        <div className="flex items-start gap-6 mb-8">
                          <div className="text-6xl">{initiative.icon}</div>
                          <div className="flex-1">
                            <h3 className="text-3xl font-bold text-ucsb-navy mb-2">{initiative.title}</h3>
                            <p className="text-lg text-gray-700">{initiative.description}</p>
                          </div>
                        </div>

                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                          {initiative.fullDescription}
                        </p>

                        <div className="bg-white rounded-lg p-6 border-l-4 border-purple-600">
                          <p className="text-sm text-gray-600 mb-2">Program Lead:</p>
                          <p className="font-semibold text-ucsb-navy mb-3">{initiative.leader}</p>
                          <p className="text-sm text-gray-600 mb-1">Contact:</p>
                          <a href={`mailto:${initiative.contact}`} className="text-purple-600 font-semibold hover:underline">
                            {initiative.contact}
                          </a>
                        </div>

                        <button
                          onClick={() => setExpandedInitiative(null)}
                          className="mt-6 bg-ucsb-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Resources & Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, idx) => (
              <a
                key={idx}
                href={resource.link}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-purple-600"
              >
                <h3 className="text-lg font-bold text-ucsb-navy mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <span className="text-purple-600 font-semibold hover:underline">Learn More →</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Belonging Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Building Belonging</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Inclusive Environment',
                description: 'We are committed to creating spaces where every member of our community feels valued, respected, and able to bring their authentic selves to work and study.',
                icon: '🏠'
              },
              {
                title: 'Celebrate Diversity',
                description: 'We celebrate the unique backgrounds, perspectives, and experiences that our diverse community members bring to our department and to science.',
                icon: '🎉'
              },
              {
                title: 'Equity in Opportunity',
                description: 'We actively work to ensure that all students have equal access to opportunities for research, mentoring, and professional development.',
                icon: '🚀'
              }
            ].map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-8 border-2 border-purple-200 hover:border-purple-600 transition">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-ucsb-navy mb-3">{item.title}</h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">We Welcome You</h2>
          <p className="text-lg text-gray-100 mb-8 max-w-2xl mx-auto">
            Whether you're a prospective student, a current member of our community, or someone interested in learning more about our DEI efforts, we'd love to hear from you.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/contact"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get in Touch
            </Link>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 transition">
              Join Our Community
            </button>
          </div>
        </div>
      </section>

      {/* DEI Statement Footer */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h3 className="text-2xl font-bold mb-4">Our DEI Commitment</h3>
          <p className="text-gray-300 leading-relaxed">
            As scientists dedicated to understanding and protecting the natural world, we recognize that environmental challenges disproportionately affect communities that are already marginalized. A diverse, equitable, and inclusive scientific community better understands these complex issues and develops more effective solutions. We are committed to continuously improving our department's practices and working toward a science community where everyone belongs and can thrive.
          </p>
        </div>
      </section>
    </div>
  )
}
