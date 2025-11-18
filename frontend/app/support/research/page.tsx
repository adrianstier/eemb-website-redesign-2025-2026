'use client'

import Link from 'next/link'
import { ArrowLeftIcon, WrenchScrewdriverIcon, BeakerIcon, HomeModernIcon, CameraIcon, MapIcon } from '@heroicons/react/24/outline'

export default function ResearchServicesPage() {
  const facilities = [
    {
      name: 'EEMB Shop',
      icon: WrenchScrewdriverIcon,
      description: 'Equipment fabrication, repair, and technical support for research projects.',
      services: [
        'Custom equipment fabrication',
        'Equipment repair and maintenance',
        'Technical consultation',
        'Material sourcing',
        'Field equipment preparation',
        'Safety equipment maintenance'
      ],
      location: 'Life Sciences Building',
      contact: {
        info: 'Contact department administration for shop services',
        email: 'info@eemb.ucsb.edu',
        phone: '805-893-2974'
      },
      hours: 'Contact for availability',
      notes: 'The EEMB Shop provides essential technical support for research equipment and specialized fabrication needs.'
    },
    {
      name: 'Biology Greenhouse',
      icon: HomeModernIcon,
      description: 'Controlled environment facilities for plant research and cultivation.',
      services: [
        'Climate-controlled growing spaces',
        'Experimental plot allocation',
        'Plant care and maintenance',
        'Irrigation systems',
        'Growth chamber access',
        'Seed storage facilities'
      ],
      location: 'Adjacent to Life Sciences Building',
      contact: {
        info: 'Contact department for greenhouse access',
        email: 'info@eemb.ucsb.edu',
        phone: '805-893-2974'
      },
      hours: 'Contact for access hours',
      notes: 'Shared facility supporting botanical and ecological research. Advance reservation required for space allocation.'
    },
    {
      name: 'Marine Operations',
      icon: MapIcon,
      description: 'Support for marine field research, diving operations, and coastal studies.',
      services: [
        'Research vessel coordination',
        'Dive operations support',
        'Field equipment deployment',
        'Coastal access permits',
        'Marine specimen collection',
        'Safety and logistics planning'
      ],
      location: 'Marine Science Institute (MSI)',
      contact: {
        info: 'Marine Operations Office',
        email: 'Contact MSI for marine operations',
        phone: '805-893-2675'
      },
      hours: 'By arrangement',
      notes: 'Coordinates marine field research activities. Requires dive certification for underwater research.'
    },
    {
      name: 'NRI/MCDB Microscopy Facility',
      icon: CameraIcon,
      description: 'Advanced imaging and microscopy services for biological research.',
      services: [
        'Confocal microscopy',
        'Electron microscopy (SEM/TEM)',
        'Live cell imaging',
        'Image analysis software',
        'Sample preparation support',
        'Training and consultation'
      ],
      location: 'Neuroscience Research Institute',
      contact: {
        info: 'NRI Microscopy Facility',
        website: 'https://www.nri.ucsb.edu/microscopy',
        email: 'Contact NRI for facility access'
      },
      hours: '24/7 access for trained users',
      notes: 'Shared facility with MCDB. Training required before independent use. Fee structure applies for usage.'
    }
  ]

  const researchSupport = [
    {
      title: 'Field Research Support',
      description: 'Planning and executing field research projects',
      items: [
        'Field site access and permits',
        'Equipment checkout and rental',
        'Vehicle reservations',
        'Safety protocols and training',
        'Field work insurance',
        'Emergency communication systems'
      ]
    },
    {
      title: 'Laboratory Resources',
      description: 'Core laboratory facilities and equipment',
      items: [
        'Shared equipment access',
        'Chemical and supply ordering',
        'Waste disposal services',
        'Laboratory safety training',
        'Equipment maintenance',
        'Core facilities across campus'
      ]
    },
    {
      title: 'Data & Computing',
      description: 'Computational resources for research',
      items: [
        'High-performance computing (HPC)',
        'Data storage solutions',
        'Statistical software licenses',
        'Bioinformatics support',
        'GIS and spatial analysis tools',
        'Database management'
      ]
    }
  ]

  const safety = {
    title: 'Research Safety & Compliance',
    items: [
      {
        name: 'Laboratory Safety',
        description: 'Training and protocols for safe lab work',
        requirements: ['EH&S safety training', 'Lab-specific protocols', 'PPE requirements', 'Emergency procedures']
      },
      {
        name: 'Field Work Safety',
        description: 'Safety requirements for field research',
        requirements: ['Field safety training', 'Emergency communication', 'First aid certification', 'Weather monitoring']
      },
      {
        name: 'Dive Safety',
        description: 'Requirements for underwater research',
        requirements: ['Scientific diving certification', 'Medical clearance', 'Dive plan approval', 'Buddy system compliance']
      },
      {
        name: 'IACUC Protocols',
        description: 'Animal research compliance',
        requirements: ['IACUC approval', 'Animal handling training', 'Protocol adherence', 'Annual renewals']
      }
    ]
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2)
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
          <div className="flex items-center gap-4 mb-4">
            <BeakerIcon className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Research Services</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Comprehensive support for research activities including specialized facilities, equipment, and technical services.
          </p>
        </div>
      </section>

      {/* Research Facilities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Research Facilities</h2>
          <div className="space-y-8">
            {facilities.map((facility, index) => {
              const Icon = facility.icon
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-ocean-blue hover:shadow-xl transition">
                  <div className="p-8">
                    <div className="flex items-start gap-6 mb-6">
                      <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-xl flex items-center justify-center">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-ucsb-navy mb-2">{facility.name}</h3>
                        <p className="text-gray-600 text-lg mb-4">{facility.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapIcon className="w-4 h-4 text-ocean-blue" />
                            <span className="text-gray-700">{facility.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">Hours:</span>
                            <span className="text-gray-700">{facility.hours}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Services Provided:</h4>
                        <ul className="space-y-2">
                          {facility.services.map((service, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-ocean-blue mt-1 font-bold">•</span>
                              <span>{service}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-3">Contact Information:</h4>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-gray-700">{facility.contact.info}</p>
                          {facility.contact.email && (
                            <a href={`mailto:${facility.contact.email}`} className="block text-sm text-ocean-blue hover:text-ocean-teal">
                              {facility.contact.email}
                            </a>
                          )}
                          {facility.contact.phone && (
                            <a href={`tel:${facility.contact.phone.replace(/[^0-9]/g, '')}`} className="block text-sm text-ocean-blue hover:text-ocean-teal font-semibold">
                              {facility.contact.phone}
                            </a>
                          )}
                          {facility.contact.website && (
                            <a href={facility.contact.website} target="_blank" rel="noopener noreferrer" className="block text-sm text-ocean-blue hover:text-ocean-teal">
                              {facility.contact.website} →
                            </a>
                          )}
                        </div>

                        {facility.notes && (
                          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-ocean-blue">
                            <p className="text-xs text-gray-700">{facility.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Research Support Services */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Additional Research Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {researchSupport.map((support, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-t-4 border-ucsb-gold">
                <h3 className="text-xl font-bold text-ucsb-navy mb-3">{support.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{support.description}</p>
                <ul className="space-y-2">
                  {support.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-ucsb-gold mt-1 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Safety & Compliance */}
      <section className="py-16 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-4">{safety.title}</h2>
          <p className="text-gray-700 mb-8 max-w-3xl">
            All research activities must comply with university safety regulations and protocols.
            Training and certification requirements vary by research activity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {safety.items.map((item, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-red-500">
                <h3 className="text-lg font-bold text-ucsb-navy mb-2">{item.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                <h4 className="font-semibold text-sm text-gray-700 mb-2">Requirements:</h4>
                <ul className="space-y-1">
                  {item.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-red-500 mt-1">•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="font-bold text-yellow-900 mb-2">Important Safety Information</h3>
            <p className="text-sm text-gray-700">
              All researchers must complete required safety training before beginning work.
              Contact EH&S (Environmental Health & Safety) at <a href="tel:8058935813" className="text-ocean-blue hover:text-ocean-teal font-semibold">805-893-5813</a> for
              training schedules and compliance requirements. Emergency contact: <strong>9-911</strong> (campus) or <strong>911</strong> (cell).
            </p>
          </div>
        </div>
      </section>

      {/* Campus Research Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Campus-Wide Research Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-ucsb-navy mb-2">CNSI (California NanoSystems Institute)</h3>
              <p className="text-sm text-gray-600 mb-3">Advanced materials characterization and nanofabrication</p>
              <a href="https://www.cnsi.ucsb.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-blue hover:text-ocean-teal">
                cnsi.ucsb.edu →
              </a>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-ucsb-navy mb-2">NCEAS (National Center for Ecological Analysis)</h3>
              <p className="text-sm text-gray-600 mb-3">Ecological data synthesis and collaborative research</p>
              <a href="https://www.nceas.ucsb.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-blue hover:text-ocean-teal">
                nceas.ucsb.edu →
              </a>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-ucsb-navy mb-2">UCSB Library</h3>
              <p className="text-sm text-gray-600 mb-3">Research data services, archives, and collections</p>
              <a href="https://www.library.ucsb.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-blue hover:text-ocean-teal">
                library.ucsb.edu →
              </a>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-ucsb-navy mb-2">Office of Research</h3>
              <p className="text-sm text-gray-600 mb-3">Funding opportunities, compliance, and research administration</p>
              <a href="https://www.research.ucsb.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-blue hover:text-ocean-teal">
                research.ucsb.edu →
              </a>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-ucsb-navy mb-2">Center for Science and Engineering Partnerships</h3>
              <p className="text-sm text-gray-600 mb-3">Outreach and education programs</p>
              <a href="https://www.csep.ucsb.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-blue hover:text-ocean-teal">
                csep.ucsb.edu →
              </a>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-white rounded-lg p-6 shadow-md">
              <h3 className="font-bold text-ucsb-navy mb-2">Research Computing</h3>
              <p className="text-sm text-gray-600 mb-3">High-performance computing and data storage</p>
              <a href="https://ccs.ucsb.edu" target="_blank" rel="noopener noreferrer" className="text-sm text-ocean-blue hover:text-ocean-teal">
                ccs.ucsb.edu →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Research Support?</h2>
          <p className="text-xl text-white/90 mb-8">
            Contact the department for information about research facilities and services
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="tel:8058932974"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition justify-center"
            >
              805-893-2974
            </a>
            <a
              href="mailto:info@eemb.ucsb.edu?subject=Research Services Inquiry"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition justify-center"
            >
              info@eemb.ucsb.edu
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
