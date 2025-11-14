'use client'

import Link from 'next/link'
import { ArrowLeftIcon, PhoneIcon, ExclamationTriangleIcon, ShieldCheckIcon, HeartIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export default function WellnessPage() {
  const emergencyContacts = [
    {
      service: 'Campus Emergency',
      phone: '9-911',
      altPhone: '911',
      description: 'Life-threatening emergencies',
      details: 'From campus phone, dial 9-911. From cell phone, dial 911.',
      urgent: true
    },
    {
      service: 'Campus Police',
      phone: '805-893-3446',
      description: 'Non-emergency police assistance',
      details: 'Available 24/7 for security concerns, incident reporting, and emergency response coordination.',
      urgent: true
    },
    {
      service: 'CAPS 24/7 Counseling',
      phone: '805-893-4411',
      description: 'Confidential mental health support',
      details: 'Counseling & Psychological Services available 24 hours a day, 7 days a week. All services are confidential.',
      urgent: true,
      confidential: true
    },
    {
      service: 'CARE (Sexual Assault)',
      phone: '805-893-3778',
      description: 'Sexual assault support and resources',
      details: 'Campus Advocacy, Resources & Education. Confidential support for survivors of sexual assault and relationship violence.',
      urgent: true,
      confidential: true
    }
  ]

  const counselingServices = [
    {
      name: 'Counseling & Psychological Services (CAPS)',
      phone: '805-893-4411',
      description: 'Professional mental health counseling and crisis intervention',
      services: [
        '24/7 crisis support',
        'Individual counseling',
        'Group therapy',
        'Psychiatric services',
        'Workshops and outreach'
      ],
      confidential: true,
      website: 'https://caps.sa.ucsb.edu'
    },
    {
      name: 'CARE (Campus Advocacy, Resources & Education)',
      phone: '805-893-3778',
      description: 'Support for survivors of sexual assault, dating/domestic violence, and stalking',
      services: [
        'Crisis intervention',
        'Confidential advocacy',
        'Anonymous reporting',
        'Resource referrals',
        'Educational programs'
      ],
      confidential: true,
      website: 'https://care.ucsb.edu'
    },
    {
      name: 'Ombuds Office',
      phone: '805-893-3285',
      description: 'Confidential consultation for conflict resolution and problem-solving',
      services: [
        'Neutral conflict resolution',
        'Confidential consultation',
        'Informal dispute resolution',
        'Resource guidance',
        'Policy clarification'
      ],
      confidential: true,
      website: 'https://ombuds.ucsb.edu'
    }
  ]

  const reportingResources = [
    {
      title: 'Title IX / Sexual Harassment Compliance',
      phone: '805-893-2701',
      description: 'Report sexual harassment, discrimination, or Title IX violations',
      confidential: false,
      reportingOptions: [
        'Online reporting form',
        'In-person consultation',
        'Phone reporting',
        'Email reporting'
      ]
    },
    {
      title: 'Bias Incident Response Team',
      phone: '805-893-3596',
      description: 'Report hate crimes or bias incidents',
      confidential: false,
      note: 'Reporting does not commit you to any action. Reports can be made anonymously.',
      reportingOptions: [
        'UC Online Report Form',
        'UCSB Incident Report',
        'Phone reporting',
        'Anonymous reporting available'
      ]
    },
    {
      title: 'Ethics Point Whistle Blower Hotline',
      phone: '800-403-4744',
      description: 'Anonymous reporting for ethical concerns and policy violations',
      confidential: true,
      reportingOptions: [
        'Anonymous phone hotline',
        'Online reporting system',
        'Available 24/7',
        'Multiple language support'
      ]
    }
  ]

  const supportServices = [
    {
      name: 'ASAP (Employee/Faculty Assistance)',
      phone: '805-893-3318',
      description: 'Threat assessment, intervention, and employee wellness programs',
      audiences: ['Faculty', 'Staff']
    },
    {
      name: 'Resource Center for Sexual & Gender Diversity (RCSGD)',
      phone: '805-894-5847',
      description: 'Resources, advocacy, and community for LGBTQIA+ students',
      audiences: ['Students', 'Faculty', 'Staff']
    },
    {
      name: 'Disabled Students Program (DSP)',
      phone: '805-893-2668',
      description: 'Academic accommodations and support for students with disabilities',
      audiences: ['Students']
    },
    {
      name: 'Women\'s Center',
      phone: '805-893-3778',
      description: 'Resources, programs, and advocacy for women and gender equity',
      audiences: ['Students', 'Faculty', 'Staff']
    },
    {
      name: 'Multicultural Center',
      phone: '805-893-2250',
      description: 'Support and programs celebrating diversity and inclusion',
      audiences: ['Students', 'Faculty', 'Staff']
    },
    {
      name: 'Office of International Students & Scholars',
      phone: '805-893-2929',
      description: 'Support for international students and scholars',
      audiences: ['International Students', 'Scholars']
    },
    {
      name: 'Undocumented Student Services',
      phone: '805-893-3963',
      description: 'Support and resources for undocumented students',
      audiences: ['Students']
    },
    {
      name: 'Graduate Student Resource Center',
      phone: '805-893-3807',
      description: 'Resources and support for graduate students',
      audiences: ['Graduate Students']
    }
  ]

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
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-ocean-blue text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <HeartIcon className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Wellness & Safety Resources</h1>
          </div>
          <p className="text-xl text-white/90 max-w-3xl">
            Comprehensive support services dedicated to the wellness and safety of our campus community.
            Available 24/7 for emergencies and crisis support.
          </p>
        </div>
      </section>

      {/* Emergency Contacts - Prominent */}
      <section className="py-12 bg-red-50 border-y-4 border-red-600">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            <h2 className="text-3xl font-bold text-red-900">Emergency Contacts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-lg border-2 border-red-200 hover:border-red-400 transition">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-xl text-red-900">{contact.service}</h3>
                  {contact.confidential && (
                    <span className="flex-shrink-0 text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                      Confidential
                    </span>
                  )}
                </div>
                <a
                  href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`}
                  className="text-3xl font-bold text-red-600 hover:text-red-800 mb-2 block"
                >
                  {contact.phone}
                </a>
                {contact.altPhone && (
                  <p className="text-sm text-gray-600 mb-2">
                    Cell phone: <span className="font-semibold">{contact.altPhone}</span>
                  </p>
                )}
                <p className="text-gray-700 font-semibold mb-2">{contact.description}</p>
                <p className="text-sm text-gray-600">{contact.details}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-lg p-6 border-l-4 border-red-600">
            <p className="text-gray-700">
              <strong className="text-red-900">In case of emergency:</strong> If you are in immediate danger,
              dial <strong>9-911</strong> from a campus phone or <strong>911</strong> from a cell phone.
              For non-emergencies, contact Campus Police at <strong>805-893-3446</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Counseling Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <ChatBubbleLeftRightIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">Counseling & Support Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {counselingServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition border-t-4 border-ocean-blue">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-lg text-ucsb-navy flex-1">{service.name}</h3>
                  {service.confidential && (
                    <span className="flex-shrink-0 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-semibold ml-2">
                      Confidential
                    </span>
                  )}
                </div>
                <a
                  href={`tel:${service.phone.replace(/[^0-9]/g, '')}`}
                  className="text-xl font-bold text-ocean-blue hover:text-ocean-teal mb-3 block"
                >
                  {service.phone}
                </a>
                <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Services:</h4>
                  <ul className="space-y-1">
                    {service.services.map((item, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-ocean-blue mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {service.website && (
                  <a
                    href={service.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-ocean-blue hover:text-ocean-teal font-semibold"
                  >
                    Visit Website →
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reporting Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <ShieldCheckIcon className="w-8 h-8 text-ocean-blue" />
            <h2 className="text-3xl font-bold text-ucsb-navy">Reporting Resources</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {reportingResources.map((resource, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 shadow-md border border-gray-200">
                <h3 className="font-bold text-lg text-ucsb-navy mb-3">{resource.title}</h3>
                <a
                  href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`}
                  className="text-xl font-bold text-ocean-blue hover:text-ocean-teal mb-3 block"
                >
                  {resource.phone}
                </a>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                {resource.note && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-4 border-l-4 border-blue-400">
                    <p className="text-xs text-blue-900">{resource.note}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Reporting Options:</h4>
                  <ul className="space-y-1">
                    {resource.reportingOptions.map((option, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-ocean-blue mt-1">•</span>
                        <span>{option}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-yellow-50 rounded-lg p-6 border-l-4 border-yellow-500">
            <h3 className="font-bold text-yellow-900 mb-2">Important Reporting Information</h3>
            <p className="text-sm text-gray-700">
              Reporting a possible hate crime or bias incident <strong>does not commit you to any action</strong>.
              Reports can be made anonymously through the Ethics Point Hotline or UCSB's online reporting system.
              All reports are taken seriously and investigated appropriately.
            </p>
          </div>
        </div>
      </section>

      {/* Additional Support Services */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Additional Campus Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {supportServices.map((service, index) => (
              <div key={index} className="bg-white rounded-lg p-5 shadow-md hover:shadow-lg transition">
                <h3 className="font-bold text-ucsb-navy mb-2">{service.name}</h3>
                <a
                  href={`tel:${service.phone.replace(/[^0-9]/g, '')}`}
                  className="text-lg font-bold text-ocean-blue hover:text-ocean-teal mb-2 block"
                >
                  {service.phone}
                </a>
                <p className="text-xs text-gray-600 mb-3">{service.description}</p>
                <div className="flex gap-1 flex-wrap">
                  {service.audiences.map((aud, idx) => (
                    <span key={idx} className="text-xs bg-ocean-blue/10 text-ocean-deep px-2 py-1 rounded-full">
                      {aud}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources & Links */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-ocean-deep to-ocean-blue text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Zoommoding Incidents</h3>
              <p className="text-white/90 mb-4">
                If you experience or witness "Zoommoding" (unauthorized disruption of online classes or meetings):
              </p>
              <div className="space-y-2">
                <a href="tel:8058933446" className="block text-lg font-bold hover:text-ucsb-gold transition">
                  UCSB Police: 805-893-3446
                </a>
                <a href="mailto:security@ucsb.edu" className="block hover:text-ucsb-gold transition">
                  Security Operations: security@ucsb.edu
                </a>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl p-8">
              <h3 className="text-xl font-bold mb-4">Confidentiality Notice</h3>
              <p className="text-white/90 mb-4">
                Services marked as "Confidential" maintain strict confidentiality and will not share
                information without your consent, except in cases of imminent danger.
              </p>
              <p className="text-sm text-white/80">
                CAPS, CARE, Ombuds, and Ethics Point are confidential resources that provide safe spaces
                for discussion and support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Help Now?</h2>
          <p className="text-xl text-white/90 mb-8">
            Don't hesitate to reach out. Support is available 24/7.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <a
              href="tel:911"
              className="flex items-center gap-2 bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition justify-center text-lg"
            >
              <ExclamationTriangleIcon className="w-6 h-6" />
              Emergency: 911
            </a>
            <a
              href="tel:8058934411"
              className="flex items-center gap-2 bg-white text-ocean-blue px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition justify-center"
            >
              <PhoneIcon className="w-5 h-5" />
              CAPS 24/7: 805-893-4411
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
