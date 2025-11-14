'use client'

import Link from 'next/link'
import { ArrowLeftIcon, TruckIcon, ClockIcon, MapPinIcon, DocumentTextIcon } from '@heroicons/react/24/outline'

export default function ShippingPage() {
  const services = [
    {
      title: 'Incoming Mail & Packages',
      icon: TruckIcon,
      description: 'Receiving and distributing mail and packages',
      details: [
        'Daily mail delivery to department mailboxes',
        'Package receiving and notification',
        'Signature required items',
        'Oversized/special handling items',
        'Hold for pickup service'
      ]
    },
    {
      title: 'Outgoing Shipments',
      icon: MapPinIcon,
      description: 'Shipping packages and materials',
      details: [
        'USPS, FedEx, and UPS shipping',
        'International shipping coordination',
        'Hazardous materials shipping (with proper certification)',
        'Equipment and sample shipping',
        'Return shipments'
      ]
    },
    {
      title: 'Special Services',
      icon: DocumentTextIcon,
      description: 'Additional shipping and receiving services',
      details: [
        'Freight and cargo coordination',
        'Time-sensitive deliveries',
        'Cold chain shipping',
        'Customs documentation',
        'Insurance and tracking'
      ]
    }
  ]

  const shippingAddress = {
    department: 'Ecology, Evolution, and Marine Biology',
    recipient: '[Your Name]',
    university: 'University of California, Santa Barbara',
    street: 'Santa Barbara, CA 93106-9620',
    building: 'Life Sciences Building',
    note: 'Replace [Your Name] with recipient\'s actual name'
  }

  const procedures = {
    incoming: [
      {
        title: 'Personal Mail',
        steps: [
          'Check your department mailbox daily',
          'Pick up package slips for larger items',
          'Retrieve packages from department office',
          'Sign for packages if required'
        ]
      },
      {
        title: 'Research Materials',
        steps: [
          'Provide tracking information to office',
          'Coordinate delivery timing for live/perishable materials',
          'Ensure proper storage is available',
          'Notify sender of successful delivery'
        ]
      },
      {
        title: 'Large/Heavy Items',
        steps: [
          'Coordinate delivery with department office in advance',
          'Arrange for loading dock access if needed',
          'Have assistance ready for moving items',
          'Follow safety protocols for heavy equipment'
        ]
      }
    ],
    outgoing: [
      {
        title: 'Standard Packages',
        steps: [
          'Package items securely',
          'Complete shipping label',
          'Provide account/project number for billing',
          'Drop off at department office during business hours',
          'Obtain receipt/tracking number'
        ]
      },
      {
        title: 'International Shipments',
        steps: [
          'Contact department office for customs forms',
          'Complete commercial invoice and declaration',
          'Verify export compliance requirements',
          'Allow extra processing time',
          'Obtain proper insurance'
        ]
      },
      {
        title: 'Hazardous Materials',
        steps: [
          'Contact EH&S for proper classification',
          'Use certified shipping personnel only',
          'Complete hazardous materials declaration',
          'Follow DOT regulations',
          'Schedule pickup with appropriate carrier'
        ]
      }
    ]
  }

  const guidelines = [
    {
      category: 'Packaging Requirements',
      rules: [
        'Use sturdy boxes appropriate for item weight',
        'Cushion fragile items with bubble wrap or packing peanuts',
        'Seal boxes securely with packing tape',
        'Label "FRAGILE" if contents are breakable',
        'Include packing slip inside for research materials'
      ]
    },
    {
      category: 'Billing & Accounts',
      rules: [
        'Provide valid UCSB account number (POET string)',
        'Verify account has sufficient funds',
        'Personal shipments must be paid personally',
        'Research shipments billed to grant/project accounts',
        'Obtain supervisor approval for large expenses'
      ]
    },
    {
      category: 'Restricted Items',
      rules: [
        'Biological samples require special permits',
        'Hazardous materials need EH&S approval',
        'Live animals require IACUC protocol',
        'Controlled substances need DEA licensing',
        'Some items prohibited by carrier (check regulations)'
      ]
    },
    {
      category: 'Delivery Times',
      rules: [
        'Domestic ground: 2-5 business days',
        'Domestic overnight: Next business day',
        'International: 5-14 business days (varies by destination)',
        'Allow extra time for customs clearance',
        'Plan ahead for time-sensitive materials'
      ]
    }
  ]

  const contacts = {
    department: {
      name: 'Department Office',
      services: 'General shipping and receiving',
      email: 'info@eemb.ucsb.edu',
      phone: '805-893-2974',
      hours: 'Monday-Friday, 9:00 AM - 5:00 PM'
    },
    campus: [
      {
        service: 'Campus Mail Services',
        phone: '805-893-2819',
        description: 'USPS and intercampus mail'
      },
      {
        service: 'Receiving Warehouse',
        phone: '805-893-2531',
        description: 'Large deliveries and freight'
      },
      {
        service: 'EH&S (Hazmat Shipping)',
        phone: '805-893-5813',
        description: 'Hazardous materials coordination'
      }
    ]
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
            <TruckIcon className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Shipping & Receiving</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Mail and package services for department personnel and research materials.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Services Available</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition border-t-4 border-ocean-blue">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-ocean-blue to-ocean-teal rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-ucsb-navy">{service.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ocean-blue mt-1 font-bold">•</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Shipping Address */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Shipping Address</h2>
          <div className="max-w-3xl">
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 shadow-lg border-l-4 border-ocean-blue mb-6">
              <h3 className="font-bold text-lg text-ucsb-navy mb-4">Mailing Address for EEMB</h3>
              <div className="font-mono text-gray-800 space-y-1 text-lg">
                <div>{shippingAddress.recipient}</div>
                <div>{shippingAddress.department}</div>
                <div>{shippingAddress.university}</div>
                <div>{shippingAddress.street}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm text-gray-600">
                  <strong>Building Location:</strong> {shippingAddress.building}
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
              <h4 className="font-bold text-yellow-900 mb-2">Important Address Notes</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>Always include recipient's full name on first line</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>Include "EEMB" or department name for proper routing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>For large items, notify department office in advance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-600 mt-1">•</span>
                  <span>International senders may need additional address details</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Procedures */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Shipping & Receiving Procedures</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Incoming */}
            <div>
              <h3 className="text-2xl font-bold text-ocean-blue mb-6">Receiving Packages</h3>
              <div className="space-y-6">
                {procedures.incoming.map((proc, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-green-500">
                    <h4 className="font-bold text-lg text-ucsb-navy mb-3">{proc.title}</h4>
                    <ol className="space-y-2">
                      {proc.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>

            {/* Outgoing */}
            <div>
              <h3 className="text-2xl font-bold text-ocean-blue mb-6">Sending Packages</h3>
              <div className="space-y-6">
                {procedures.outgoing.map((proc, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
                    <h4 className="font-bold text-lg text-ucsb-navy mb-3">{proc.title}</h4>
                    <ol className="space-y-2">
                      {proc.steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">{idx + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guidelines */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Shipping Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guidelines.map((guideline, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md border-t-4 border-ucsb-gold">
                <h3 className="text-lg font-bold text-ucsb-navy mb-4">{guideline.category}</h3>
                <ul className="space-y-2">
                  {guideline.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-ucsb-gold mt-1 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Hours */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <ClockIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">Hours & Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Department Contact */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-ucsb-navy mb-6">{contacts.department.name}</h3>
              <p className="text-gray-600 mb-6">{contacts.department.services}</p>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email:</p>
                  <a href={`mailto:${contacts.department.email}`} className="text-lg text-ocean-blue hover:text-ocean-teal font-semibold">
                    {contacts.department.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone:</p>
                  <a href={`tel:${contacts.department.phone.replace(/[^0-9]/g, '')}`} className="text-lg text-ocean-blue hover:text-ocean-teal font-semibold">
                    {contacts.department.phone}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Hours:</p>
                  <p className="text-gray-700">{contacts.department.hours}</p>
                </div>
              </div>
            </div>

            {/* Campus Services */}
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-ucsb-navy mb-6">Campus Shipping Services</h3>
              <div className="space-y-4">
                {contacts.campus.map((contact, index) => (
                  <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                    <h4 className="font-semibold text-ucsb-navy mb-1">{contact.service}</h4>
                    <p className="text-sm text-gray-600 mb-2">{contact.description}</p>
                    <a href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`} className="text-sm text-ocean-blue hover:text-ocean-teal font-semibold">
                      {contact.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Questions About Shipping?</h2>
          <p className="text-xl text-white/90 mb-8">
            Contact the department office for assistance with mail and package services
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="tel:8058932974"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition justify-center"
            >
              805-893-2974
            </a>
            <a
              href="mailto:info@eemb.ucsb.edu?subject=Shipping Services Inquiry"
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
