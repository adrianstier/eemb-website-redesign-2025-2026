'use client'

import Link from 'next/link'
import { ArrowLeftIcon, BuildingOfficeIcon, KeyIcon, ComputerDesktopIcon, PresentationChartBarIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function FacilitiesPage() {
  const conferenceRooms = [
    {
      name: 'Main Conference Room',
      location: 'Life Sciences Building',
      capacity: 'Contact for details',
      equipment: [
        'Projector and screen',
        'Video conferencing capability',
        'Whiteboard',
        'Conference phone',
        'WiFi access'
      ],
      usage: 'Classes, seminars, meetings',
      booking: 'Faculty and staff only'
    },
    {
      name: 'Seminar Rooms',
      location: 'Various locations in Life Sciences',
      capacity: 'Varies by room',
      equipment: [
        'Presentation equipment',
        'Seating arrangements',
        'Audio/visual systems',
        'Internet connectivity'
      ],
      usage: 'Seminars, small meetings, study groups',
      booking: 'Faculty, staff, and graduate students'
    }
  ]

  const keyAccess = {
    title: 'Building Access & Keys',
    description: 'Key and access card management for EEMB facilities',
    services: [
      {
        name: 'Office Keys',
        description: 'Keys for faculty and staff offices',
        process: [
          'Request through department administration',
          'Complete key assignment form',
          'Provide UCSB ID',
          'Sign key agreement',
          'Return keys upon departure'
        ],
        contact: 'Danielle Perez - dcperez@ucsb.edu'
      },
      {
        name: 'Lab Access',
        description: 'Card access to research laboratories',
        process: [
          'Authorized by PI or lab manager',
          'Submit access request form',
          'Complete safety training',
          'Receive access card programming',
          'Access logged for security'
        ],
        contact: 'Department Administration - info@eemb.ucsb.edu'
      },
      {
        name: 'After-Hours Access',
        description: 'Building access outside normal hours',
        process: [
          'Available to authorized personnel',
          'UCSB access card required',
          'Building security protocols apply',
          'Emergency contact required on file',
          'Report any security concerns'
        ],
        contact: 'Campus Police - 805-893-3446'
      }
    ]
  }

  const equipment = {
    title: 'Department Equipment',
    categories: [
      {
        name: 'Presentation Equipment',
        items: [
          'Portable projectors',
          'Laptop computers',
          'Wireless presenters',
          'Poster boards',
          'Display easels',
          'Extension cords and adapters'
        ],
        availability: 'Check-out system through department office'
      },
      {
        name: 'Field Equipment',
        items: [
          'Field sampling gear',
          'GPS units',
          'Cameras and recording devices',
          'Safety equipment',
          'Transportation coordination',
          'Permit documentation'
        ],
        availability: 'Reserve through research coordinators'
      },
      {
        name: 'Teaching Equipment',
        items: [
          'Classroom materials',
          'Laboratory supplies',
          'Demonstration equipment',
          'Student safety gear',
          'Course-specific equipment'
        ],
        availability: 'Coordinate with instructional support'
      }
    ]
  }

  const officeSpace = {
    title: 'Office & Work Space',
    spaces: [
      {
        type: 'Faculty Offices',
        description: 'Individual offices for faculty members',
        features: ['Desk and seating', 'Bookshelves', 'Computer connection', 'Phone line', 'Window (most offices)'],
        allocation: 'Assigned by department chair'
      },
      {
        type: 'Graduate Student Offices',
        description: 'Shared office space for graduate students',
        features: ['Desk space', 'Storage', 'Computer workstation', 'Shared printer access', 'Study areas'],
        allocation: 'Coordinated through graduate advisor'
      },
      {
        type: 'Postdoc Offices',
        description: 'Office space for postdoctoral researchers',
        features: ['Desk and computer', 'Storage space', 'Phone access', 'Close to lab facilities'],
        allocation: 'Arranged with supervising faculty'
      },
      {
        type: 'Visitor Offices',
        description: 'Temporary office space for visiting scholars',
        features: ['Desk and seating', 'Computer access', 'WiFi', 'Short-term arrangement'],
        allocation: 'Contact department administration'
      }
    ]
  }

  const maintenance = {
    title: 'Facilities Maintenance',
    info: 'Report facilities issues and maintenance requests',
    services: [
      {
        category: 'Urgent Repairs',
        description: 'Immediate attention needed (safety hazards, water leaks, etc.)',
        contact: 'Physical Facilities',
        phone: '805-893-2611',
        hours: '24/7 emergency response'
      },
      {
        category: 'General Maintenance',
        description: 'Routine repairs and maintenance requests',
        contact: 'Work Order System',
        method: 'Submit online through Facilities Management',
        hours: 'Business hours response'
      },
      {
        category: 'Custodial Services',
        description: 'Cleaning and waste removal',
        contact: 'Building Services',
        phone: '805-893-2711',
        hours: 'Regular schedule, special events by request'
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
            <BuildingOfficeIcon className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Facilities & Operations</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Building access, conference rooms, office space, and departmental equipment management.
          </p>
        </div>
      </section>

      {/* Conference Room Reservations */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <PresentationChartBarIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">Conference Room Reservations</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {conferenceRooms.map((room, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition border-l-4 border-ocean-blue">
                <h3 className="text-2xl font-bold text-ucsb-navy mb-4">{room.name}</h3>
                <div className="space-y-3 mb-6">
                  <div>
                    <span className="text-sm text-gray-500">Location:</span>
                    <p className="text-gray-700 font-medium">{room.location}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Capacity:</span>
                    <p className="text-gray-700 font-medium">{room.capacity}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Usage:</span>
                    <p className="text-gray-700 font-medium">{room.usage}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Booking:</span>
                    <p className="text-gray-700 font-medium">{room.booking}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Available Equipment:</h4>
                  <ul className="space-y-2">
                    {room.equipment.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-ocean-blue mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 border-l-4 border-ocean-blue">
            <h3 className="text-xl font-bold text-ucsb-navy mb-4">How to Reserve Conference Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Reservation Process:</h4>
                <ol className="space-y-2">
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 bg-ocean-blue text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Contact department office to check availability</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 bg-ocean-blue text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Provide event details (date, time, purpose, attendees)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 bg-ocean-blue text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Confirm equipment needs (projector, teleconferencing, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 bg-ocean-blue text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>Receive confirmation and access instructions</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="flex-shrink-0 w-6 h-6 bg-ocean-blue text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                    <span>Return room to original condition after use</span>
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-3">Contact for Reservations:</h4>
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <p className="text-gray-700 mb-3">Department Office</p>
                  <a href="tel:8058932974" className="block text-lg font-bold text-ocean-blue hover:text-ocean-teal mb-2">
                    805-893-2974
                  </a>
                  <a href="mailto:info@eemb.ucsb.edu?subject=Conference Room Reservation" className="block text-sm text-ocean-blue hover:text-ocean-teal">
                    info@eemb.ucsb.edu
                  </a>
                  <p className="text-xs text-gray-500 mt-3">
                    Please request reservations at least 48 hours in advance when possible.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Keys & Access */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <KeyIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">{keyAccess.title}</h2>
          </div>
          <p className="text-gray-700 mb-8 max-w-3xl">{keyAccess.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {keyAccess.services.map((service, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
                <h3 className="text-xl font-bold text-ucsb-navy mb-3">{service.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                <h4 className="font-semibold text-sm text-gray-700 mb-2">Process:</h4>
                <ol className="space-y-2 mb-4">
                  {service.process.map((step, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-ocean-blue font-bold">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Contact:</p>
                  <p className="text-sm text-ocean-blue font-medium">{service.contact}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="font-bold text-yellow-900 mb-2">Important Key & Access Information</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Do not duplicate keys or share access cards</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Report lost or stolen keys immediately to Campus Police (805-893-3446)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Return all keys and access cards when leaving the department</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600 mt-1">•</span>
                <span>Lock doors and secure facilities when leaving</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Equipment */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <ComputerDesktopIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">{equipment.title}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {equipment.categories.map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border-t-4 border-ucsb-gold">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">{category.name}</h3>
                <ul className="space-y-2 mb-6">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-ucsb-gold mt-1 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Availability:</p>
                  <p className="text-sm text-gray-700">{category.availability}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Office Space */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">{officeSpace.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {officeSpace.spaces.map((space, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 shadow-md">
                <h3 className="text-xl font-bold text-ucsb-navy mb-3">{space.type}</h3>
                <p className="text-sm text-gray-600 mb-4">{space.description}</p>

                <h4 className="font-semibold text-sm text-gray-700 mb-2">Features:</h4>
                <ul className="space-y-1 mb-4">
                  {space.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <span className="text-ocean-blue mt-1">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Allocation:</p>
                  <p className="text-sm text-gray-700">{space.allocation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Maintenance */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-4">{maintenance.title}</h2>
          <p className="text-gray-700 mb-8">{maintenance.info}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {maintenance.services.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-bold text-ucsb-navy mb-3">{service.category}</h3>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>

                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Contact:</p>
                    <p className="text-sm font-semibold text-gray-700">{service.contact}</p>
                  </div>
                  {service.phone && (
                    <a href={`tel:${service.phone.replace(/[^0-9]/g, '')}`} className="block text-lg font-bold text-ocean-blue hover:text-ocean-teal">
                      {service.phone}
                    </a>
                  )}
                  {service.method && (
                    <p className="text-sm text-gray-700">{service.method}</p>
                  )}
                  <p className="text-xs text-gray-500">{service.hours}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Facilities Questions?</h2>
          <p className="text-xl text-white/90 mb-8">
            Contact the department office for facilities and operations support
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="tel:8058932974"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition justify-center"
            >
              805-893-2974
            </a>
            <a
              href="mailto:info@eemb.ucsb.edu?subject=Facilities Inquiry"
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
