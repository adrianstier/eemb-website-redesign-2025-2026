'use client'

import Link from 'next/link'
import { ArrowLeftIcon, EnvelopeIcon, PhoneIcon, UserGroupIcon, BanknotesIcon, KeyIcon, AcademicCapIcon, DocumentTextIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline'

export default function AdministrationPage() {
  const staff = [
    {
      name: 'Andrea Jorgensen',
      title: 'Academic Business Officer',
      email: 'amjorgen@ucsb.edu',
      phone: '',
      responsibilities: 'Overall business operations and departmental management',
      services: ['Budget management', 'Financial planning', 'Department operations', 'Policy compliance']
    },
    {
      name: 'Rosa Vasquez',
      title: 'Academic Personnel',
      email: 'rosavasquez@ucsb.edu',
      phone: '',
      responsibilities: 'Faculty recruitment, merit & promotion cases, curriculum planning',
      services: ['Faculty recruitment', 'Merit reviews', 'Promotion cases', 'Curriculum planning', 'Academic appointments']
    },
    {
      name: 'Danielle Perez',
      title: 'Departmental Assistant',
      email: 'dcperez@ucsb.edu',
      phone: '',
      responsibilities: 'General administrative support and department operations',
      services: ['Front desk support', 'General inquiries', 'Department coordination', 'Event support']
    },
    {
      name: 'Haley Martin',
      title: 'Director of Finance',
      email: 'haleymartin@ucsb.edu',
      phone: '',
      responsibilities: 'Procurement, accounts payable, recharges, fund management',
      services: ['Procurement', 'Accounts payable', 'Recharge systems', 'Fund management', 'Budget tracking']
    },
    {
      name: 'Mengshu Ye',
      title: 'Staff Graduate Advisor',
      email: 'mengshuye@ucsb.edu',
      phone: '',
      responsibilities: 'Graduate student support and advising',
      services: ['Graduate advising', 'Program requirements', 'Student support', 'Academic planning']
    },
    {
      name: 'Ellery Wilkie',
      title: 'Undergraduate Advisor',
      email: 'ewilkie@lifesci.ucsb.edu',
      phone: '',
      responsibilities: 'Undergraduate program advising and student support',
      services: ['Major advising', 'Course planning', 'Degree requirements', 'Student support']
    }
  ]

  const serviceAreas = [
    {
      icon: AcademicCapIcon,
      title: 'Academic Personnel',
      description: 'Management of faculty recruitment, merit and promotion cases, and curriculum planning.',
      services: [
        'Faculty recruitment processes',
        'Merit review submissions',
        'Promotion case preparation',
        'Curriculum development support',
        'Academic appointment processing'
      ],
      contact: 'Rosa Vasquez',
      email: 'rosavasquez@ucsb.edu'
    },
    {
      icon: KeyIcon,
      title: 'Facilities & Operations',
      description: 'Building access, office space, and departmental equipment management.',
      services: [
        'Key requests and management',
        'Building access control',
        'Office space allocation',
        'Equipment requests',
        'Maintenance coordination'
      ],
      contact: 'Danielle Perez',
      email: 'dcperez@ucsb.edu'
    },
    {
      icon: BanknotesIcon,
      title: 'Finance & Procurement',
      description: 'Procurement services, accounts payable, recharge systems, and fund management.',
      services: [
        'Purchase orders and procurement',
        'Invoice processing',
        'Recharge account management',
        'Budget monitoring',
        'Financial reporting'
      ],
      contact: 'Haley Martin',
      email: 'haleymartin@ucsb.edu'
    },
    {
      icon: ClipboardDocumentListIcon,
      title: 'Instructional Support',
      description: 'Support for teaching activities, course evaluations, and accommodations.',
      services: [
        'DSP accommodation coordination',
        'Course evaluation management',
        'Classroom scheduling',
        'Teaching assistant coordination',
        'Instructional materials'
      ],
      contact: 'Danielle Perez',
      email: 'dcperez@ucsb.edu'
    },
    {
      icon: DocumentTextIcon,
      title: 'Reimbursements',
      description: 'Processing travel, entertainment, and supply expense reimbursements.',
      services: [
        'Travel reimbursement processing',
        'Conference expense claims',
        'Entertainment expenses',
        'Supply purchases',
        'Documentation requirements'
      ],
      contact: 'Haley Martin',
      email: 'haleymartin@ucsb.edu'
    },
    {
      icon: UserGroupIcon,
      title: 'Staff Personnel & Payroll',
      description: 'Management of non-academic personnel and payroll administration.',
      services: [
        'Staff hiring processes',
        'Payroll administration',
        'Benefits coordination',
        'Performance reviews',
        'Employee relations'
      ],
      contact: 'Andrea Jorgensen',
      email: 'amjorgen@ucsb.edu'
    }
  ]

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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Administration</h1>
          <p className="text-xl text-white/90 max-w-3xl">
            Departmental financial management and business operations in support of faculty, students, researchers, visitors, and staff.
          </p>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Service Areas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {serviceAreas.map((area, index) => {
              const Icon = area.icon
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition border-l-4 border-ocean-blue">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-ucsb-navy mb-2">{area.title}</h3>
                      <p className="text-gray-600 text-sm">{area.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-sm text-gray-700 mb-3">Services Provided:</h4>
                    <ul className="space-y-2">
                      {area.services.map((service, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-ocean-blue mt-1">•</span>
                          <span>{service}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">Contact:</p>
                    <p className="font-semibold text-ucsb-navy">{area.contact}</p>
                    <a href={`mailto:${area.email}`} className="text-sm text-ocean-blue hover:text-ocean-teal transition">
                      {area.email}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Staff Directory */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Administrative Staff</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md border border-gray-200 hover:shadow-xl transition">
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                    {getInitials(member.name)}
                  </div>
                  <h3 className="font-bold text-lg text-ucsb-navy mb-1">{member.name}</h3>
                  <p className="text-sm text-ocean-blue font-semibold mb-4">{member.title}</p>
                </div>

                <div className="space-y-3 mb-4">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-ocean-teal transition justify-center"
                  >
                    <EnvelopeIcon className="w-4 h-4" />
                    {member.email}
                  </a>
                  {member.phone && (
                    <a
                      href={`tel:${member.phone.replace(/[^0-9]/g, '')}`}
                      className="flex items-center gap-2 text-sm text-gray-700 hover:text-ocean-teal transition justify-center"
                    >
                      <PhoneIcon className="w-4 h-4" />
                      {member.phone}
                    </a>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-xs text-gray-500 mb-2 text-center">Responsibilities:</p>
                  <p className="text-sm text-gray-700 leading-relaxed text-center mb-3">
                    {member.responsibilities}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.services.slice(0, 3).map((service, idx) => (
                      <span key={idx} className="text-xs bg-ocean-blue/10 text-ocean-deep px-2 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">General Administrative Contact</h2>
          <p className="text-lg text-white/90 mb-8">
            For general administrative inquiries, please contact the department office
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="tel:8058932974"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition justify-center"
            >
              <PhoneIcon className="w-5 h-5" />
              805-893-2974
            </a>
            <a
              href="mailto:info@eemb.ucsb.edu"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition justify-center"
            >
              <EnvelopeIcon className="w-5 h-5" />
              info@eemb.ucsb.edu
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
