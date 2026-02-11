'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Heart, GraduationCap, FlaskConical, Users, Globe, Mail, Phone, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react'

export default function GivePage() {
  const [expandedSections, setExpandedSections] = useState<{ [key: number]: boolean }>({})

  const toggleSection = (index: number) => {
    setExpandedSections(prev => ({ ...prev, [index]: !prev[index] }))
  }

  const givingPriorities = [
    {
      icon: Globe,
      title: 'Unrestricted Support',
      description: 'Flexible funding for departmental needs',
      benefits: [
        'Address the most pressing departmental needs',
        'Support emerging opportunities and initiatives',
        'Provide funding where it\'s needed most',
        'Enable quick response to new challenges',
        'Sustain ongoing programs and operations'
      ],
      details: {
        intro: 'Unrestricted gifts provide the EEMB Department with maximum flexibility to respond to the greatest needs and most promising opportunities. These gifts allow us to:',
        points: [
          'Seize emerging opportunities in research and education',
          'Address unexpected challenges quickly and effectively',
          'Support initiatives that may not qualify for restricted funding',
          'Maintain and enhance core programs and facilities',
          'Invest in strategic priorities identified by department leadership'
        ],
        impact: 'Your unrestricted gift empowers department leadership to allocate resources where they will have the greatest impact on advancing our mission of excellence in ecology, evolution, and marine biology.'
      },
      color: 'from-ocean-blue to-ocean-teal'
    },
    {
      icon: GraduationCap,
      title: 'Graduate Support',
      description: 'Empowering the next generation of scientists',
      benefits: [
        'Graduate student fellowships and stipends',
        'Research travel and conference attendance',
        'Field work and research equipment',
        'Professional development opportunities',
        'Tuition support and academic resources'
      ],
      details: {
        intro: 'Graduate students are the engine of discovery in EEMB. Your support helps attract and retain the brightest minds from around the world.',
        fellowships: [
          {
            name: 'EEMB Alumni Graduate Fellowship',
            description: 'Supports outstanding graduate students pursuing research in ecology, evolution, or marine biology',
            level: 'Endowed Fellowship: $200,000+; Full-Year Fellowship: $50,000+; Quarter Fellowship: $15,000+'
          },
          {
            name: 'Robert Haller Fellowship',
            description: 'Awarded to graduate students conducting research in marine biology',
            level: 'Endowed Fellowship: $200,000+; Annual Award: $25,000+'
          },
          {
            name: 'Ellen Schamberg Burley Award',
            description: 'Supports graduate student research in evolutionary biology',
            level: 'Endowed Award: $100,000+; Annual Award: $10,000+'
          },
          {
            name: 'Field Research Support',
            description: 'Provides funding for graduate student field work, equipment, and travel',
            level: 'Any amount makes a difference'
          }
        ],
        impact: 'Fellowship support allows students to focus on their research, attend conferences, publish their findings, and develop into leading scientists and educators.'
      },
      color: 'from-ocean-blue to-ocean-teal'
    },
    {
      icon: Users,
      title: 'Undergraduate Support',
      description: 'Enriching undergraduate education and research',
      benefits: [
        'Field trips and hands-on learning experiences',
        'Undergraduate research opportunities',
        'Laboratory equipment and supplies',
        'Academic scholarships and awards',
        'Student organization and activity support'
      ],
      details: {
        intro: 'Hands-on learning experiences are essential for undergraduate education in the biological sciences. Your support provides students with opportunities that transform their education.',
        needs: [
          {
            category: 'Field Trip Support',
            description: 'Transportation, lodging, and meals for field courses and research trips',
            cost: '$5,000-$15,000 per trip'
          },
          {
            category: 'Laboratory Equipment',
            items: [
              'Compound microscopes: $2,000-$5,000 each',
              'Stereomicroscopes: $1,500-$3,000 each',
              'Spectrophotometers: $8,000-$15,000',
              'PCR machines: $10,000-$20,000',
              'Centrifuges: $3,000-$8,000'
            ]
          },
          {
            category: 'Research Supplies',
            description: 'Reagents, consumables, and materials for student research projects',
            cost: '$500-$2,000 per student per year'
          },
          {
            category: 'Summer Research Stipends',
            description: 'Support for undergraduates conducting independent research',
            cost: '$5,000-$8,000 per student for 10-week program'
          }
        ],
        impact: 'These experiences help students develop critical thinking skills, gain practical knowledge, and prepare for careers in science, medicine, conservation, and education.'
      },
      color: 'from-ocean-teal to-bioluminescent'
    },
    {
      icon: FlaskConical,
      title: 'Faculty, Research & Facilities',
      description: 'Advancing cutting-edge research and innovation',
      benefits: [
        'Endowed chairs and professorships',
        'Postdoctoral fellowships',
        'State-of-the-art research equipment',
        'Facility improvements and upgrades',
        'Collaborative research initiatives'
      ],
      details: {
        intro: 'World-class faculty and facilities are the foundation of research excellence. Major gifts in this area have transformative impact on the department.',
        opportunities: [
          {
            type: 'Endowed Chair',
            description: 'Provides permanent funding to recruit and retain distinguished faculty members',
            level: '$500,000 or more',
            impact: 'Endowed chairs elevate the stature of the department and provide faculty with resources for innovative research, graduate student mentoring, and academic leadership.'
          },
          {
            type: 'Named Professorship',
            description: 'Recognizes faculty excellence and supports research initiatives',
            level: '$250,000-$500,000',
            impact: 'Professorships provide flexible funding for research, equipment, travel, and graduate student support.'
          },
          {
            type: 'Postdoctoral Fellowships',
            description: 'Supports early-career scientists pursuing advanced research',
            level: '$75,000-$100,000 per year',
            impact: 'Postdoctoral fellows bring fresh perspectives, collaborate with faculty and students, and often become future leaders in their fields.'
          },
          {
            type: 'Major Research Equipment',
            description: 'Advanced instrumentation enabling cutting-edge research',
            examples: [
              'Flow cytometer: $100,000-$250,000',
              'DNA sequencer: $150,000-$500,000',
              'Confocal microscope: $300,000-$600,000',
              'Mass spectrometer: $250,000-$800,000'
            ]
          },
          {
            type: 'Lecture Series',
            description: 'Brings distinguished speakers to campus to share latest research',
            level: '$50,000-$100,000 endowment',
            impact: 'Lecture series expose students and faculty to new ideas, foster collaboration, and raise the profile of the department.'
          }
        ]
      },
      color: 'from-ucsb-navy to-ocean-deep'
    }
  ]

  const impactStories = [
    {
      title: 'Addressing Environmental Challenges',
      description: 'Your support helps our faculty and students tackle critical environmental issues through groundbreaking research in ecology, evolution, and marine biology.',
      icon: Globe
    },
    {
      title: 'Training Future Leaders',
      description: 'Donations enable us to provide world-class education and mentorship, preparing the next generation of environmental scientists and problem-solvers.',
      icon: GraduationCap
    },
    {
      title: 'Advancing Scientific Discovery',
      description: 'Philanthropic support accelerates research discoveries that shape our understanding of life on Earth and inform conservation strategies worldwide.',
      icon: FlaskConical
    }
  ]

  const waysToGive = [
    {
      method: 'Online',
      description: 'Make a secure online donation through the UCSB giving portal',
      action: 'Give Online',
      link: 'https://giving.ucsb.edu/Funds/Dept/ecology-evolution-and-marine-biology',
      icon: CheckCircle
    },
    {
      method: 'Mail',
      description: 'Send a check payable to "UC Santa Barbara Foundation" with "EEMB" in the memo line',
      address: 'UC Santa Barbara Foundation, 6580 Hollister Ave., Suite 120, Goleta, CA 93117',
      icon: Mail
    },
    {
      method: 'Contact',
      description: 'Speak with our development officer about major gifts, planned giving, or endowments',
      contact: 'Bethany Innocenti',
      icon: Phone
    }
  ]

  const contact = {
    name: 'Bethany Innocenti',
    title: 'Development for the Sciences',
    phone: '805-893-4963',
    email: 'bethany.innocenti@ucsb.edu',
    description: 'Bethany is available to discuss giving opportunities, answer questions, and help you make a meaningful impact on EEMB.'
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
              <Heart className="w-16 h-16" />
              <h1 className="text-5xl md:text-6xl font-bold">Give to EEMB</h1>
            </div>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Support excellence in ecology, evolution, and marine biology. Your gift helps us address
              environmental challenges and prepare the next generation of scientists who will shape our planet's future.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <a
                href="https://giving.ucsb.edu/Funds/Dept/ecology-evolution-and-marine-biology"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-ucsb-gold text-ucsb-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 transition text-center"
              >
                Donate Now
              </a>
              <a
                href="#contact"
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition text-center border border-white/30"
              >
                Contact Development
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-ucsb-navy mb-6">
              Excellence in the Fundamental Sciences
            </h2>
            <p className="text-lg text-warm-700 leading-relaxed mb-8">
              The Department of Ecology, Evolution and Marine Biology is committed to excellence in the
              fundamental sciences of ecology and evolution from genes to ecosystems. Your support helps
              sustain world-class scholars and promising students who are dedicated to understanding and
              solving the environmental challenges of our time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              {impactStories.map((story, index) => {
                const Icon = story.icon
                return (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-ucsb-navy mb-3">{story.title}</h3>
                    <p className="text-sm text-warm-600">{story.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Giving Priorities */}
      <section className="py-12 bg-gradient-to-br from-warm-50 to-ocean-blue/5">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-ucsb-navy mb-4 text-center">Giving Priorities</h2>
          <p className="text-center text-warm-600 mb-12 max-w-3xl mx-auto">
            Your contribution in any of these areas makes a direct impact on our ability to advance
            scientific discovery and educate future leaders in environmental science.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {givingPriorities.map((priority, index) => {
              const Icon = priority.icon
              const isExpanded = expandedSections[index]

              return (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all">
                  <div className={`bg-gradient-to-r ${priority.color} p-6`}>
                    <div className="flex items-center gap-4 text-white">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{priority.title}</h3>
                        <p className="text-white/90 text-sm">{priority.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="font-semibold text-warm-700 mb-4">Your gift supports:</h4>
                    <ul className="space-y-3 mb-6">
                      {priority.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-warm-700">
                          <CheckCircle className="w-5 h-5 text-ocean-teal flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Expandable Details Section */}
                    <button
                      onClick={() => toggleSection(index)}
                      className="w-full flex items-center justify-between bg-gradient-to-r from-warm-50 to-ocean-blue/5 px-4 py-3 rounded-lg hover:from-warm-100 hover:to-ocean-blue/10 transition border border-warm-200"
                    >
                      <span className="font-semibold text-ocean-blue">Learn More About Giving Opportunities</span>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-ocean-blue" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-ocean-blue" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-4 space-y-4 border-t border-warm-200 pt-4">
                        <p className="text-sm text-warm-700 leading-relaxed">
                          {priority.details.intro}
                        </p>

                        {/* Unrestricted Support Details */}
                        {priority.details.points && (
                          <ul className="space-y-2">
                            {priority.details.points.map((point: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-warm-700">
                                <span className="text-ocean-blue mt-1">•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {/* Graduate Support Fellowships */}
                        {priority.details.fellowships && (
                          <div className="space-y-3">
                            <h5 className="font-semibold text-ocean-deep">Named Fellowships & Awards:</h5>
                            {priority.details.fellowships.map((fellowship: any, idx: number) => (
                              <div key={idx} className="bg-ocean-blue/5 rounded-lg p-4 border-l-4 border-ocean-blue">
                                <h6 className="font-bold text-ocean-deep mb-1">{fellowship.name}</h6>
                                <p className="text-sm text-warm-700 mb-2">{fellowship.description}</p>
                                <p className="text-xs text-ocean-blue font-semibold">{fellowship.level}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Undergraduate Support Needs */}
                        {priority.details.needs && (
                          <div className="space-y-3">
                            <h5 className="font-semibold text-ocean-deep">Priority Needs:</h5>
                            {priority.details.needs.map((need: any, idx: number) => (
                              <div key={idx} className="bg-ocean-teal/5 rounded-lg p-4 border-l-4 border-ocean-teal">
                                <h6 className="font-bold text-ocean-deep mb-2">{need.category}</h6>
                                {need.description && (
                                  <p className="text-sm text-warm-700 mb-1">{need.description}</p>
                                )}
                                {need.cost && (
                                  <p className="text-xs text-ocean-teal font-semibold">{need.cost}</p>
                                )}
                                {need.items && (
                                  <ul className="space-y-1 mt-2">
                                    {need.items.map((item: string, itemIdx: number) => (
                                      <li key={itemIdx} className="text-sm text-warm-700 ml-4">
                                        <span className="text-ocean-teal">→</span> {item}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Faculty & Research Opportunities */}
                        {priority.details.opportunities && (
                          <div className="space-y-3">
                            <h5 className="font-semibold text-ocean-deep">Major Giving Opportunities:</h5>
                            {priority.details.opportunities.map((opp: any, idx: number) => (
                              <div key={idx} className="bg-ocean-blue/5 rounded-lg p-4 border-l-4 border-ucsb-navy">
                                <div className="flex items-start justify-between mb-2">
                                  <h6 className="font-bold text-ocean-deep">{opp.type}</h6>
                                  {opp.level && (
                                    <span className="text-xs bg-ucsb-navy text-white px-2 py-1 rounded-full whitespace-nowrap ml-2">
                                      {opp.level}
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-warm-700 mb-2">{opp.description}</p>
                                {opp.impact && (
                                  <p className="text-xs text-ocean-blue italic">{opp.impact}</p>
                                )}
                                {opp.examples && (
                                  <ul className="space-y-1 mt-2">
                                    {opp.examples.map((example: string, exIdx: number) => (
                                      <li key={exIdx} className="text-sm text-warm-700 ml-4">
                                        <span className="text-ocean-blue">→</span> {example}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {priority.details.impact && (
                          <div className="bg-gradient-to-r from-ucsb-gold/10 to-ucsb-gold/5 rounded-lg p-4 border-l-4 border-ucsb-gold">
                            <p className="text-sm text-ocean-deep font-medium italic">
                              <strong>Impact:</strong> {priority.details.impact}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Ways to Give */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-ucsb-navy mb-12 text-center">Ways to Give</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {waysToGive.map((way, index) => {
              const Icon = way.icon
              return (
                <div key={index} className="bg-gradient-to-br from-warm-50 to-white rounded-xl p-8 shadow-md hover:shadow-lg transition border-t-4 border-ocean-blue">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ucsb-navy">{way.method}</h3>
                  </div>
                  <p className="text-warm-700 mb-6">{way.description}</p>

                  {way.link && (
                    <a
                      href={way.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-ocean-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-ocean-deep transition"
                    >
                      {way.action}
                    </a>
                  )}

                  {way.address && (
                    <div className="bg-ocean-blue/5 rounded-lg p-4 border-l-4 border-ocean-blue">
                      <p className="text-xs text-warm-600 mb-1 font-semibold">Mail to:</p>
                      <p className="text-sm text-warm-700">{way.address}</p>
                      <p className="text-xs text-warm-600 mt-2">Include "EEMB" in the memo line</p>
                    </div>
                  )}

                  {way.contact && (
                    <div className="bg-ocean-blue/5 rounded-lg p-4 border-l-4 border-ocean-blue">
                      <p className="text-sm text-warm-700 mb-1">Contact: <span className="font-semibold">{way.contact}</span></p>
                      <p className="text-xs text-warm-600">See contact information below</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Development Contact */}
      <section id="contact" className="py-16 bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Questions About Giving?</h2>
              <p className="text-xl text-white/90">
                Contact our development officer to discuss how you can make an impact
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6">
                    <span className="text-4xl font-bold">BI</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{contact.name}</h3>
                  <p className="text-lg text-white/80 mb-6">{contact.title}</p>
                  <p className="text-white/90 mb-6">{contact.description}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone className="w-5 h-5" />
                      <p className="text-sm text-white/80">Phone</p>
                    </div>
                    <a
                      href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                      className="text-2xl font-bold hover:text-ucsb-gold transition"
                    >
                      {contact.phone}
                    </a>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-5 h-5" />
                      <p className="text-sm text-white/80">Email</p>
                    </div>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-lg font-semibold hover:text-ucsb-gold transition break-all"
                    >
                      {contact.email}
                    </a>
                  </div>

                  <a
                    href={`mailto:${contact.email}?subject=Giving to EEMB`}
                    className="block w-full text-center bg-ucsb-gold text-ucsb-navy px-8 py-4 rounded-lg font-bold hover:bg-yellow-400 transition"
                  >
                    Get in Touch
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tax Information */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-ocean-blue/5 to-ocean-teal/5 rounded-xl p-8 border-l-4 border-ocean-blue">
              <h3 className="text-xl font-bold text-ucsb-navy mb-4">Tax Information</h3>
              <div className="space-y-3 text-sm text-warm-700">
                <p>
                  <strong>The UC Santa Barbara Foundation</strong> is a 501(c)(3) nonprofit organization.
                  Your gift is tax-deductible to the extent allowed by law.
                </p>
                <p>
                  <strong>Tax ID:</strong> Federal Tax ID #95-2087711
                </p>
                <p>
                  All donations will be acknowledged with a receipt for tax purposes. For questions about
                  tax deductibility, please consult your tax advisor or contact Bethany Innocenti.
                </p>
              </div>
            </div>

            <div className="mt-8 bg-ucsb-gold/10 rounded-lg p-6 border-l-4 border-ucsb-gold">
              <h4 className="font-bold text-ocean-deep mb-2">Other Ways to Support EEMB</h4>
              <ul className="space-y-2 text-sm text-warm-700">
                <li className="flex items-start gap-2">
                  <span className="text-ucsb-gold mt-1">•</span>
                  <span><strong>Planned Giving:</strong> Include EEMB in your estate plans through bequests, trusts, or beneficiary designations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ucsb-gold mt-1">•</span>
                  <span><strong>Matching Gifts:</strong> Many employers match charitable contributions—check if your company participates</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ucsb-gold mt-1">•</span>
                  <span><strong>Stock Gifts:</strong> Donating appreciated securities can provide significant tax benefits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-ucsb-gold mt-1">•</span>
                  <span><strong>IRA Charitable Rollover:</strong> If you're 70½ or older, you can make tax-free gifts from your IRA</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* General Department Contact */}
      <section className="py-12 bg-warm-100">
        <div className="container mx-auto px-4 text-center">
          <p className="text-warm-600 mb-4">For general department inquiries</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a href="tel:8058932974" className="text-ocean-blue hover:text-ocean-teal font-semibold">
              805-893-2974
            </a>
            <span className="text-warm-600 hidden md:inline">|</span>
            <a href="mailto:info@eemb.ucsb.edu" className="text-ocean-blue hover:text-ocean-teal font-semibold">
              info@eemb.ucsb.edu
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
