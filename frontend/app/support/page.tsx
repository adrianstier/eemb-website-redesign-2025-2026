'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  AcademicCapIcon,
  WrenchScrewdriverIcon,
  BeakerIcon,
  ComputerDesktopIcon,
  HeartIcon,
  TruckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ExclamationTriangleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface StaffMember {
  name: string
  title: string
  email: string
  responsibilities: string
}

interface Service {
  icon: any
  title: string
  description: string
  href: string
  audience: string[]
}

interface EmergencyContact {
  service: string
  phone: string
  description: string
  urgent: boolean
}

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAudience, setSelectedAudience] = useState('all')
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Staff Directory
  const staff: StaffMember[] = [
    {
      name: 'Andrea Jorgensen',
      title: 'Academic Business Officer',
      email: 'amjorgen@ucsb.edu',
      responsibilities: 'Overall business operations and departmental management'
    },
    {
      name: 'Rosa Vasquez',
      title: 'Academic Personnel',
      email: 'rosavasquez@ucsb.edu',
      responsibilities: 'Faculty recruitment, merit & promotion cases, curriculum planning'
    },
    {
      name: 'Danielle Perez',
      title: 'Departmental Assistant',
      email: 'dcperez@ucsb.edu',
      responsibilities: 'General administrative support and department operations'
    },
    {
      name: 'Haley Martin',
      title: 'Director of Finance',
      email: 'haleymartin@ucsb.edu',
      responsibilities: 'Procurement, accounts payable, recharges, fund management'
    },
    {
      name: 'Mengshu Ye',
      title: 'Staff Graduate Advisor',
      email: 'mengshuye@ucsb.edu',
      responsibilities: 'Graduate student support and advising'
    },
    {
      name: 'Ellery Wilkie',
      title: 'Undergraduate Advisor',
      email: 'ewilkie@lifesci.ucsb.edu',
      responsibilities: 'Undergraduate program advising and student support'
    }
  ]

  // Emergency Contacts
  const emergencyContacts: EmergencyContact[] = [
    {
      service: 'Campus Emergency',
      phone: '9-911',
      description: 'Life-threatening emergencies (from campus phone)',
      urgent: true
    },
    {
      service: 'Campus Police',
      phone: '805-893-3446',
      description: 'Non-emergency police assistance',
      urgent: true
    },
    {
      service: 'CAPS 24/7 Counseling',
      phone: '805-893-4411',
      description: 'Confidential mental health support, available 24/7',
      urgent: true
    },
    {
      service: 'CARE (Sexual Assault)',
      phone: '805-893-3778',
      description: 'Confidential sexual assault support and resources',
      urgent: true
    }
  ]

  // Campus Wellness Resources
  const wellnessResources = [
    {
      name: 'Title IX / Sexual Harassment',
      phone: '805-893-2701',
      description: 'Report sexual harassment or discrimination',
      confidential: false
    },
    {
      name: 'Ombuds Office',
      phone: '805-893-3285',
      description: 'Confidential consultation services for conflicts',
      confidential: true
    },
    {
      name: 'ASAP (Employee Assistance)',
      phone: '805-893-3318',
      description: 'Faculty/staff assistance and threat management',
      confidential: false
    },
    {
      name: 'RCSGD (LGBTQIA+ Center)',
      phone: '805-894-5847',
      description: 'Resources and advocacy for LGBTQIA+ community',
      confidential: false
    },
    {
      name: 'Bias Incident Response',
      phone: '805-893-3596',
      description: 'Report hate crimes or bias incidents',
      confidential: false
    },
    {
      name: 'Ethics Point Hotline',
      phone: '800-403-4744',
      description: 'Anonymous whistleblower reporting',
      confidential: true
    }
  ]

  // Service Categories
  const services: Service[] = [
    {
      icon: BuildingOfficeIcon,
      title: 'Administration',
      description: 'Departmental financial management, business operations, personnel support',
      href: '/support/administration',
      audience: ['faculty', 'staff']
    },
    {
      icon: AcademicCapIcon,
      title: 'Student Services',
      description: 'Graduate and undergraduate advising, academic support',
      href: '/support/students',
      audience: ['students']
    },
    {
      icon: BeakerIcon,
      title: 'Research Services',
      description: 'EEMB Shop, Greenhouse, Marine Operations, Microscopy Facility',
      href: '/support/research',
      audience: ['faculty', 'students', 'staff']
    },
    {
      icon: WrenchScrewdriverIcon,
      title: 'Facilities',
      description: 'Conference room reservations, equipment, building access',
      href: '/support/facilities',
      audience: ['faculty', 'staff']
    },
    {
      icon: ComputerDesktopIcon,
      title: 'Technical Support',
      description: 'IT support, user accounts, network access, desktop help',
      href: '/support/technical',
      audience: ['faculty', 'staff', 'students']
    },
    {
      icon: HeartIcon,
      title: 'Wellness & Safety',
      description: 'Campus resources for mental health, safety, and wellbeing',
      href: '/support/wellness',
      audience: ['faculty', 'staff', 'students', 'public']
    },
    {
      icon: TruckIcon,
      title: 'Shipping & Receiving',
      description: 'Departmental mail and package services',
      href: '/support/shipping',
      audience: ['faculty', 'staff']
    }
  ]

  // Leadership contacts
  const leadership = [
    {
      name: 'Todd Oakley',
      title: 'Department Chair, Professor',
      phone: '805-893-4715',
      email: 'oakley@ucsb.edu',
      office: 'Life Sciences 4101'
    },
    {
      name: 'Hillary Young',
      title: 'Vice Chair Resources, Professor',
      phone: '805-893-4681',
      email: 'hillary.young@lifesci.ucsb.edu',
      office: 'Noble Hall 2116'
    },
    {
      name: 'Stephen Proulx',
      title: 'Vice Chair Curriculum, Professor',
      phone: '',
      email: 'sproul@ucsb.edu',
      office: 'Life Sciences 4109'
    }
  ]

  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAudience = selectedAudience === 'all' || service.audience.includes(selectedAudience)
    return matchesSearch && matchesAudience
  })

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Support Services</h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8">
              Comprehensive support for faculty, staff, students, and researchers in the EEMB department.
            </p>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search for services, resources, or staff..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-4 focus:ring-ucsb-gold/50 focus:outline-none"
                />
              </div>
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="px-6 py-4 rounded-lg text-gray-900 focus:ring-4 focus:ring-ucsb-gold/50 focus:outline-none bg-white"
              >
                <option value="all">All Services</option>
                <option value="faculty">Faculty</option>
                <option value="staff">Staff</option>
                <option value="students">Students</option>
                <option value="public">Public</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts - Prominent Section */}
      <section className="py-12 bg-red-50 border-y-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-red-900">Emergency Contacts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md border-2 border-red-200 hover:border-red-400 transition">
                <h3 className="font-bold text-lg text-red-900 mb-2">{contact.service}</h3>
                <a
                  href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                  className="text-2xl font-bold text-red-600 hover:text-red-800 mb-2 block"
                >
                  {contact.phone}
                </a>
                <p className="text-sm text-gray-700">{contact.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-white rounded-lg p-6 border-l-4 border-red-600">
            <p className="text-gray-700">
              <strong className="text-red-900">Important:</strong> From a campus phone, dial <strong>9-911</strong> for emergencies.
              From a cell phone, dial <strong>911</strong>. For non-emergencies, contact Campus Police at <strong>805-893-3446</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Support Services</h2>

          {filteredServices.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 text-lg">No services found matching your search.</p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedAudience('all')
                }}
                className="mt-4 px-6 py-2 bg-ocean-blue text-white rounded-lg hover:bg-ocean-deep transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => {
                const Icon = service.icon
                return (
                  <Link
                    key={index}
                    href={service.href}
                    className="group bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all border-2 border-transparent hover:border-ocean-teal"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-lg flex items-center justify-center group-hover:scale-110 transition">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-ucsb-navy mb-2 group-hover:text-ocean-teal transition">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {service.description}
                        </p>
                        <div className="mt-3 flex gap-2 flex-wrap">
                          {service.audience.map(aud => (
                            <span
                              key={aud}
                              className="text-xs px-2 py-1 bg-ocean-blue/10 text-ocean-deep rounded-full"
                            >
                              {aud}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Administrative Staff Directory */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Administrative Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-lg transition">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {getInitials(member.name)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-ucsb-navy mb-1">{member.name}</h3>
                    <p className="text-sm text-ocean-blue font-semibold mb-2">{member.title}</p>
                    <a
                      href={`mailto:${member.email}`}
                      className="text-sm text-gray-600 hover:text-ocean-teal transition block mb-3"
                    >
                      {member.email}
                    </a>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {member.responsibilities}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wellness & Safety Resources */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheckIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">Campus Wellness & Safety Resources</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wellnessResources.map((resource, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-lg text-ucsb-navy flex-1">{resource.name}</h3>
                  {resource.confidential && (
                    <span className="flex-shrink-0 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold">
                      Confidential
                    </span>
                  )}
                </div>
                {resource.phone && (
                  <a
                    href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                    className="text-xl font-bold text-ocean-blue hover:text-ocean-teal mb-2 block"
                  >
                    {resource.phone}
                  </a>
                )}
                <p className="text-sm text-gray-600">{resource.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg p-6 border-l-4 border-ocean-blue">
            <h3 className="font-bold text-lg text-ucsb-navy mb-3">Additional Campus Resources</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-sm text-gray-700">• Women's Center</div>
              <div className="text-sm text-gray-700">• Multicultural Center</div>
              <div className="text-sm text-gray-700">• International Students</div>
              <div className="text-sm text-gray-700">• Legal Resource Center</div>
              <div className="text-sm text-gray-700">• Graduate Diversity</div>
              <div className="text-sm text-gray-700">• Undocumented Student Services</div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              For more information about these resources, visit the
              <a href="https://www.ucsb.edu" className="text-ocean-blue hover:text-ocean-teal ml-1">
                UCSB campus resources page
              </a>.
            </p>
          </div>

          <div className="mt-6 bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <p className="text-sm text-gray-700">
              <strong className="text-yellow-900">Reporting Information:</strong> Reporting a possible hate crime
              or bias incident does not commit you to any action. Reports can be made anonymously through the
              Ethics Point Hotline or UCSB's online reporting system.
            </p>
          </div>
        </div>
      </section>

      {/* Department Leadership */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Department Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((leader, index) => (
              <div key={index} className="bg-gradient-to-br from-ucsb-navy to-blue-800 text-white rounded-xl p-8 shadow-lg">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {getInitials(leader.name)}
                </div>
                <h3 className="text-xl font-bold mb-2">{leader.name}</h3>
                <p className="text-sm text-white/80 mb-4">{leader.title}</p>
                <div className="space-y-2 text-sm">
                  {leader.phone && (
                    <a href={`tel:${leader.phone.replace(/[^0-9]/g, '')}`} className="block hover:text-ucsb-gold transition">
                      <PhoneIcon className="w-4 h-4 inline mr-2" />
                      {leader.phone}
                    </a>
                  )}
                  <a href={`mailto:${leader.email}`} className="block hover:text-ucsb-gold transition">
                    <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                    {leader.email}
                  </a>
                  <p className="text-white/80">
                    <BuildingOfficeIcon className="w-4 h-4 inline mr-2" />
                    {leader.office}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Contact */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">General Department Contact</h2>
          <p className="text-xl mb-8">For general inquiries and information</p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a
              href="tel:8058932974"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <PhoneIcon className="w-5 h-5" />
              805-893-2974
            </a>
            <a
              href="mailto:info@eemb.ucsb.edu"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              <EnvelopeIcon className="w-5 h-5" />
              info@eemb.ucsb.edu
            </a>
          </div>
          <div className="mt-8 text-white/80">
            <p>Ecology, Evolution, and Marine Biology</p>
            <p>University of California, Santa Barbara</p>
            <p>Santa Barbara, CA 93106-9620</p>
          </div>
        </div>
      </section>
    </div>
  )
}
