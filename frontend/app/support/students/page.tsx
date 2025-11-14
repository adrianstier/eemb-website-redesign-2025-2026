'use client'

import Link from 'next/link'
import { ArrowLeftIcon, EnvelopeIcon, AcademicCapIcon, BookOpenIcon, UserGroupIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function StudentServicesPage() {
  const advisors = [
    {
      name: 'Mengshu Ye',
      title: 'Staff Graduate Advisor',
      email: 'mengshuye@ucsb.edu',
      audience: 'Graduate Students',
      services: [
        'Graduate program requirements',
        'Course planning and scheduling',
        'Academic progress monitoring',
        'Qualifying exam preparation',
        'Thesis and dissertation guidance',
        'TA assignment coordination'
      ],
      officeHours: 'By appointment'
    },
    {
      name: 'Ellery Wilkie',
      title: 'Undergraduate Advisor',
      email: 'ewilkie@lifesci.ucsb.edu',
      audience: 'Undergraduate Students',
      services: [
        'Major declaration and requirements',
        'Course selection and planning',
        'Prerequisite guidance',
        'Graduation requirements',
        'Research opportunities',
        'Career planning'
      ],
      officeHours: 'By appointment'
    }
  ]

  const graduateResources = [
    {
      title: 'Program Requirements',
      icon: BookOpenIcon,
      description: 'Understand the requirements for your graduate program',
      resources: [
        'Course requirements (45 units minimum)',
        'Teaching requirements (3 quarters)',
        'Qualifying exam procedures',
        'Dissertation requirements',
        'Timeline and milestones',
        'Graduate Division policies'
      ]
    },
    {
      title: 'Academic Support',
      icon: AcademicCapIcon,
      description: 'Resources to support your academic success',
      resources: [
        'Writing support and workshops',
        'Research presentation skills',
        'Statistical consulting',
        'Library research assistance',
        'Graduate student mentoring',
        'Study groups and peer support'
      ]
    },
    {
      title: 'Funding & Opportunities',
      icon: UserGroupIcon,
      description: 'Financial support and professional development',
      resources: [
        'TA and GSR positions',
        'Fellowship opportunities',
        'Travel grants',
        'Research funding',
        'Conference support',
        'Professional development funds'
      ]
    }
  ]

  const undergraduateResources = [
    {
      title: 'Major Requirements',
      icon: BookOpenIcon,
      description: 'Requirements for the EEMB major',
      resources: [
        'Lower division prerequisites',
        'Upper division core courses',
        'Elective requirements',
        'Laboratory requirements',
        'Minimum GPA requirements',
        'Graduation checklist'
      ]
    },
    {
      title: 'Research Opportunities',
      icon: AcademicCapIcon,
      description: 'Get involved in research',
      resources: [
        'Finding a research mentor',
        'EEMB 199 Independent Study',
        'Undergraduate research grants',
        'Summer research programs',
        'Senior thesis opportunities',
        'Lab volunteer positions'
      ]
    },
    {
      title: 'Career Development',
      icon: UserGroupIcon,
      description: 'Prepare for your future career',
      resources: [
        'Internship opportunities',
        'Career counseling',
        'Graduate school preparation',
        'Professional skills workshops',
        'Networking events',
        'Alumni connections'
      ]
    }
  ]

  const importantDates = [
    {
      category: 'Quarter System',
      dates: [
        'Week 0: Instruction begins',
        'Week 2: Last day to add courses',
        'Week 3: Last day to drop without "W"',
        'Week 10: Finals week',
        'Check academic calendar for exact dates'
      ]
    },
    {
      category: 'Graduate Milestones',
      dates: [
        'Year 1: Complete coursework',
        'Year 2: Qualifying exams',
        'Year 3-5: Dissertation research',
        'Year 5-6: Dissertation defense',
        'Timeline varies by student and project'
      ]
    }
  ]

  const accommodations = {
    title: 'Disability Accommodations',
    description: 'The Disabled Students Program (DSP) provides academic accommodations for students with documented disabilities.',
    contact: {
      office: 'Disabled Students Program',
      phone: '805-893-2668',
      email: 'dsp@sa.ucsb.edu',
      website: 'https://dsp.sa.ucsb.edu'
    },
    services: [
      'Testing accommodations',
      'Note-taking services',
      'Accessible course materials',
      'Assistive technology',
      'Priority registration',
      'Housing accommodations'
    ],
    process: [
      '1. Register with DSP',
      '2. Provide documentation',
      '3. Meet with DSP counselor',
      '4. Receive accommodation letter',
      '5. Share letter with instructors'
    ]
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/support" className="flex items-center gap-2 text-ocean-blue hover:text-ocean-teal transition">
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Support Services
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Student Services</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Academic advising and support for graduate and undergraduate students in the EEMB department.
          </p>
        </div>
      </section>

      {/* Academic Advisors */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Academic Advisors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {advisors.map((advisor, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg border-t-4 border-ocean-blue">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {getInitials(advisor.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-ucsb-navy mb-1">{advisor.name}</h3>
                    <p className="text-lg text-ocean-blue font-semibold mb-2">{advisor.title}</p>
                    <span className="inline-block bg-ucsb-gold/20 text-ucsb-navy px-3 py-1 rounded-full text-sm font-semibold">
                      {advisor.audience}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Contact:</p>
                    <a href={`mailto:${advisor.email}`} className="text-ocean-blue hover:text-ocean-teal transition font-medium">
                      {advisor.email}
                    </a>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Office Hours:</p>
                    <p className="text-gray-700">{advisor.officeHours}</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-gray-700 mb-3">Services Provided:</h4>
                  <ul className="space-y-2">
                    {advisor.services.map((service, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-ocean-blue mt-1 font-bold">•</span>
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6">
                  <a
                    href={`mailto:${advisor.email}?subject=Advising Appointment Request`}
                    className="block text-center bg-ocean-blue text-white px-6 py-3 rounded-lg font-semibold hover:bg-ocean-deep transition"
                  >
                    Schedule Appointment
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Graduate Student Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Graduate Student Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {graduateResources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-purple-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ucsb-navy">{resource.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <ul className="space-y-2">
                    {resource.resources.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-purple-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Undergraduate Resources */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Undergraduate Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {undergraduateResources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <div key={index} className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-l-4 border-green-500">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ucsb-navy">{resource.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <ul className="space-y-2">
                    {resource.resources.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Disability Accommodations */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">{accommodations.title}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <p className="text-gray-700 mb-6">{accommodations.description}</p>

              <div className="mb-6">
                <h3 className="font-bold text-lg text-ucsb-navy mb-3">Contact DSP</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-semibold">Office:</span> {accommodations.contact.office}
                  </p>
                  <a href={`tel:${accommodations.contact.phone.replace(/[^0-9]/g, '')}`} className="block text-ocean-blue hover:text-ocean-teal font-semibold">
                    {accommodations.contact.phone}
                  </a>
                  <a href={`mailto:${accommodations.contact.email}`} className="block text-ocean-blue hover:text-ocean-teal">
                    {accommodations.contact.email}
                  </a>
                  <a href={accommodations.contact.website} target="_blank" rel="noopener noreferrer" className="block text-ocean-blue hover:text-ocean-teal">
                    {accommodations.contact.website} →
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-lg text-ucsb-navy mb-3">Available Services</h3>
                <ul className="space-y-2">
                  {accommodations.services.map((service, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-ocean-blue mt-1">•</span>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="font-bold text-lg text-ucsb-navy mb-4">How to Get Accommodations</h3>
              <div className="space-y-4">
                {accommodations.process.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-ocean-blue text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <p className="text-gray-700 pt-1">{step.substring(3)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-blue-50 rounded-lg p-4 border-l-4 border-ocean-blue">
                <p className="text-sm text-gray-700">
                  <strong className="text-ocean-deep">Note:</strong> It's best to register with DSP early in the quarter
                  to ensure accommodations are in place before you need them. The process can take 2-3 weeks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Dates */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <CalendarIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">Important Dates & Milestones</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {importantDates.map((dateGroup, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md border-l-4 border-ucsb-gold">
                <h3 className="font-bold text-xl text-ucsb-navy mb-4">{dateGroup.category}</h3>
                <ul className="space-y-2">
                  {dateGroup.dates.map((date, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-ucsb-gold mt-1">•</span>
                      <span>{date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Academic Advising?</h2>
          <p className="text-xl text-white/90 mb-8">
            Our advisors are here to help you succeed in your academic journey
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="mailto:mengshuye@ucsb.edu?subject=Graduate Advising Appointment"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition justify-center"
            >
              <EnvelopeIcon className="w-5 h-5" />
              Graduate Advising
            </a>
            <a
              href="mailto:ewilkie@lifesci.ucsb.edu?subject=Undergraduate Advising Appointment"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition justify-center"
            >
              <EnvelopeIcon className="w-5 h-5" />
              Undergraduate Advising
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
