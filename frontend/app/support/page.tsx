'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Phone, Mail, Building2, ChevronDown, ChevronRight, Clock } from 'lucide-react'

// Types
interface Person {
  name: string
  title: string
  email: string
  phone?: string
  office?: string
  responsibilities?: string
  image?: string
}

export default function SupportPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['leadership']))

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Leadership with photos - statically defined
  const leadership: Person[] = [
    { name: 'Todd Oakley', title: 'Department Chair', email: 'oakley@ucsb.edu', phone: '805-893-4715', office: 'Life Sciences 4101' },
    { name: 'Hillary Young', title: 'Vice Chair, Resources', email: 'hillary.young@lifesci.ucsb.edu', phone: '805-893-4681', office: 'Noble Hall 2116' },
    { name: 'Stephen Proulx', title: 'Vice Chair, Curriculum', email: 'sproul@ucsb.edu', office: 'Life Sciences 4109' },
  ]

  // Administrative Staff
  const adminStaff: Person[] = [
    { name: 'Andrea Jorgensen', title: 'Academic Business Officer', email: 'amjorgen@ucsb.edu', responsibilities: 'Overall business operations and departmental management' },
    { name: 'Rosa Vasquez', title: 'Academic Personnel', email: 'rosavasquez@ucsb.edu', responsibilities: 'Faculty recruitment, merit & promotion cases, curriculum planning' },
    { name: 'Danielle Perez', title: 'Departmental Assistant', email: 'dcperez@ucsb.edu', responsibilities: 'General administrative support, keys & building access' },
    { name: 'Haley Martin', title: 'Director of Finance', email: 'haleymartin@ucsb.edu', responsibilities: 'Procurement, accounts payable, recharges, fund management' },
  ]

  // Academic Advisors
  const gradAdvisors: Person[] = [
    { name: 'Mengshu Ye', title: 'Staff Graduate Advisor', email: 'mengshuye@ucsb.edu', responsibilities: 'Graduate student support, qualifying exams, dissertation committees' },
  ]

  const undergradAdvisors: Person[] = [
    { name: 'Evelin Ambrocio-Silva', title: 'Undergraduate Advisor', email: 'eambrocio@lifesci.ucsb.edu', phone: '805-893-4622', responsibilities: 'Major requirements, graduation petitions, course planning' },
    { name: 'Ellery Wilkie', title: 'Undergraduate Advisor', email: 'ewilkie@lifesci.ucsb.edu', responsibilities: 'Undergraduate program advising and student support' },
  ]

  // Research & Technical Staff
  const technicalStaff: Person[] = [
    { name: 'Ryan Langlo', title: 'Shop Superintendent', email: 'ryan.langlo@lifesci.ucsb.edu', phone: '805-893-7286', responsibilities: 'EEMB Machine Shop - custom equipment fabrication, repairs' },
    { name: 'Cameron Hannah-Bick', title: 'Greenhouse Manager', email: 'cameron.hannah-bick@lifesci.ucsb.edu', phone: '805-893-2867', responsibilities: 'Research greenhouse operations' },
    { name: 'Christoph Pierre', title: 'Director of Marine Operations', email: 'christoph.pierre@lifesci.ucsb.edu', phone: '805-893-2873', responsibilities: 'Research vessels, scientific diving, coastal access' },
    { name: 'Christian Orsini', title: 'Assistant Diver/Collector', email: 'christian.orsini@lifesci.ucsb.edu', phone: '805-893-2873', responsibilities: 'Diving support and specimen collection' },
    { name: 'Paul Diaz', title: 'Purchasing Manager', email: 'pdiaz@lifesci.ucsb.edu', phone: '805-893-3234', responsibilities: 'Bio Receiving, shipping & receiving' },
  ]

  // Emergency Contacts
  const emergencyContacts = [
    { service: 'Campus Emergency', phone: '9-911', description: 'Life-threatening emergencies (from campus phone)' },
    { service: 'Campus Police', phone: '805-893-3446', description: 'Non-emergency police assistance' },
    { service: 'CAPS 24/7 Crisis Line', phone: '805-893-4411', description: 'Confidential mental health support, available 24/7' },
    { service: 'CARE (Sexual Assault)', phone: '805-893-3778', description: 'Confidential sexual assault support' },
  ]

  // Wellness Resources
  const wellnessResources = [
    { name: 'Title IX / Sexual Harassment', phone: '805-893-2701', description: 'Report sexual harassment or discrimination' },
    { name: 'Ombuds Office', phone: '805-893-3285', description: 'Confidential consultation for conflicts', confidential: true },
    { name: 'Employee Assistance (ASAP)', phone: '805-893-3318', description: 'Faculty/staff assistance and support' },
    { name: 'RCSGD (LGBTQIA+ Center)', phone: '805-894-5847', description: 'Resources for LGBTQIA+ community' },
    { name: 'Disability Services (DSP)', phone: '805-893-2668', description: 'Testing accommodations and accessible materials' },
    { name: 'Ethics Point Hotline', phone: '800-403-4744', description: 'Anonymous whistleblower reporting', confidential: true },
  ]

  // Research Facilities
  const facilities = [
    { name: 'EEMB Machine Shop', location: 'Life Sciences Building', description: 'Custom equipment fabrication, repairs, modifications' },
    { name: 'Research Greenhouse', location: 'Adjacent to LSB', description: 'Climate-controlled growing facilities for experiments' },
    { name: 'Marine Operations', location: 'Marine Science Institute', description: 'Research vessels, scientific diving, coastal site access', phone: '805-893-2675' },
    { name: 'Microscopy Facility', location: 'NRI Building', description: 'Confocal, SEM/TEM imaging services' },
  ]

  // Conference Rooms
  const conferenceRooms = [
    '4164 Bio 2 (Clarke Carbon)',
    '4301 Life Sciences',
    '4307 Life Sciences',
    '3103 Marine Biotechnology',
    '1231 Noble Hall',
    '2221 Noble Hall',
  ]

  // Components
  const PersonCard = ({ person, showPhoto = false, showResponsibilities = false }: { person: Person; showPhoto?: boolean; showResponsibilities?: boolean }) => (
    <div className="p-4 bg-white border border-warm-200 rounded-lg">
      <div className="flex items-start gap-4">
        {showPhoto && (
          <div className="w-14 h-14 rounded-full bg-warm-200 flex items-center justify-center text-warm-500 font-medium overflow-hidden flex-shrink-0">
            {person.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={person.image} alt={person.name} className="w-full h-full object-cover" />
            ) : (
              person.name.split(' ').map(n => n[0]).join('')
            )}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-warm-800">{person.name}</p>
          <p className="text-sm text-warm-500">{person.title}</p>
          {showResponsibilities && person.responsibilities && (
            <p className="text-sm text-warm-600 mt-1">{person.responsibilities}</p>
          )}
          <div className="mt-2 space-y-1 text-sm">
            <a href={`mailto:${person.email}`} className="block text-ocean-blue hover:underline">{person.email}</a>
            {person.phone && <a href={`tel:${person.phone.replace(/[^0-9]/g, '')}`} className="block text-warm-600">{person.phone}</a>}
            {person.office && <p className="text-warm-500">{person.office}</p>}
          </div>
        </div>
      </div>
    </div>
  )

  const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => {
    const isExpanded = expandedSections.has(id)
    return (
      <div id={id} className="border border-warm-200 rounded-lg bg-white">
        <button
          onClick={() => toggleSection(id)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-warm-50 transition-colors"
        >
          <h3 className="font-medium text-warm-800">{title}</h3>
          <ChevronDown className={`w-5 h-5 text-warm-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
        {isExpanded && (
          <div className="px-6 pb-6 border-t border-warm-100">
            <div className="pt-4">{children}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Header */}
      <section className="bg-ucsb-navy text-white">
        <div className="container mx-auto px-4 py-12">
          <nav className="flex items-center gap-2 text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Support</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-serif font-bold">Department Support</h1>
          <p className="mt-2 text-white/80 max-w-xl">
            Resources and contacts for faculty, staff, students, and researchers.
          </p>
        </div>
      </section>

      {/* Main Office Bar */}
      <section className="border-b border-warm-200 bg-white">
        <div className="container mx-auto px-4 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Building2 className="w-8 h-8 text-ocean-blue flex-shrink-0" />
              <div>
                <p className="font-medium text-warm-800">EEMB Main Office</p>
                <p className="text-sm text-warm-500">Life Sciences Building, Room 4102</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-warm-600">
              <Clock className="w-4 h-4" />
              <span>Mon–Fri, 8:00am – 5:00pm</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <a href="tel:8058932974" className="flex items-center gap-2 text-ocean-blue font-medium">
                <Phone className="w-4 h-4" />
                805-893-2974
              </a>
              <a href="mailto:info@eemb.ucsb.edu" className="flex items-center gap-2 text-ocean-blue font-medium">
                <Mail className="w-4 h-4" />
                info@eemb.ucsb.edu
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts - Always Visible */}
      <section className="bg-red-50 border-b border-red-200">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold text-red-800 mb-4">Emergency Contacts</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emergencyContacts.map((contact, i) => (
              <div key={i} className="bg-white p-4 rounded-lg border border-red-200">
                <p className="text-sm font-medium text-red-800">{contact.service}</p>
                <a href={`tel:${contact.phone.replace(/[^0-9]/g, '')}`} className="text-xl font-bold text-red-600 hover:text-red-700">
                  {contact.phone}
                </a>
                <p className="text-xs text-warm-600 mt-1">{contact.description}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-red-700 mt-4">
            <strong>Note:</strong> From a campus phone, dial 9-911 for emergencies. From a cell phone, dial 911.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4 max-w-4xl space-y-4">

          {/* Leadership */}
          <Section id="leadership" title="Department Leadership">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {leadership.map((person, i) => (
                <PersonCard key={i} person={person} showPhoto />
              ))}
            </div>
          </Section>

          {/* Administrative Staff */}
          <Section id="admin" title="Administrative Staff">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {adminStaff.map((person, i) => (
                <PersonCard key={i} person={person} showResponsibilities />
              ))}
            </div>
          </Section>

          {/* Academic Advisors */}
          <Section id="advisors" title="Academic Advisors">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-medium text-warm-600 mb-3 uppercase tracking-wide">Graduate Students</h4>
                <div className="grid grid-cols-1 gap-4">
                  {gradAdvisors.map((person, i) => (
                    <PersonCard key={i} person={person} showResponsibilities />
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-warm-600 mb-3 uppercase tracking-wide">Undergraduate Students</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {undergradAdvisors.map((person, i) => (
                    <PersonCard key={i} person={person} showResponsibilities />
                  ))}
                </div>
              </div>
            </div>
          </Section>

          {/* Research & Technical Staff */}
          <Section id="technical" title="Research & Technical Staff">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {technicalStaff.map((person, i) => (
                <PersonCard key={i} person={person} showResponsibilities />
              ))}
            </div>
          </Section>

          {/* Research Facilities */}
          <Section id="facilities" title="Research Facilities">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {facilities.map((facility, i) => (
                <div key={i} className="p-4 bg-warm-50 rounded-lg">
                  <p className="font-medium text-warm-800">{facility.name}</p>
                  <p className="text-sm text-warm-600 mt-1">{facility.description}</p>
                  <p className="text-sm text-warm-500 mt-2">{facility.location}</p>
                  {facility.phone && (
                    <a href={`tel:${facility.phone.replace(/[^0-9]/g, '')}`} className="text-sm text-ocean-blue mt-1 block">
                      {facility.phone}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Conference Rooms */}
          <Section id="rooms" title="Conference Rooms">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {conferenceRooms.map((room, i) => (
                <div key={i} className="p-3 bg-warm-50 rounded-lg text-sm text-warm-700">
                  {room}
                </div>
              ))}
            </div>
            <p className="text-sm text-warm-500 mt-4">
              Reserve conference rooms through <a href="https://ems.ucsb.edu" className="text-ocean-blue hover:underline">UCSB EMS</a>.
            </p>
          </Section>

          {/* IT Support */}
          <Section id="it" title="IT & Technical Support">
            <div className="p-4 bg-warm-50 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-warm-800">UCSB Help Desk</p>
                  <p className="text-sm text-warm-600">Network, email, software, VPN, printing</p>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <a href="mailto:help@ucsb.edu" className="text-ocean-blue">help@ucsb.edu</a>
                  <a href="tel:8058932400" className="text-ocean-blue">805-893-2400</a>
                </div>
              </div>
            </div>
          </Section>

          {/* Wellness Resources */}
          <Section id="wellness" title="Wellness & Support Resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {wellnessResources.map((resource, i) => (
                <div key={i} className="p-4 bg-warm-50 rounded-lg">
                  <p className="font-medium text-warm-800">{resource.name}</p>
                  <p className="text-sm text-warm-600">{resource.description}</p>
                  <a href={`tel:${resource.phone.replace(/[^0-9]/g, '')}`} className="text-sm text-ocean-blue mt-2 block">
                    {resource.phone}
                  </a>
                  {resource.confidential && (
                    <span className="inline-block mt-2 text-xs bg-warm-200 text-warm-600 px-2 py-0.5 rounded">Confidential</span>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {/* Finance & Procurement */}
          <Section id="finance" title="Finance & Procurement">
            <div className="space-y-4">
              <PersonCard person={adminStaff.find(s => s.name === 'Haley Martin')!} showResponsibilities />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 bg-warm-50 rounded-lg">
                  <p className="font-medium text-warm-800">Procurement</p>
                  <ul className="text-sm text-warm-600 mt-2 space-y-1">
                    <li>• Purchase orders</li>
                    <li>• P-Card purchases</li>
                    <li>• Vendor setup</li>
                  </ul>
                </div>
                <div className="p-4 bg-warm-50 rounded-lg">
                  <p className="font-medium text-warm-800">Reimbursements</p>
                  <ul className="text-sm text-warm-600 mt-2 space-y-1">
                    <li>• Travel expenses</li>
                    <li>• Supply purchases</li>
                    <li>• Conference fees</li>
                  </ul>
                </div>
                <div className="p-4 bg-warm-50 rounded-lg">
                  <p className="font-medium text-warm-800">Fund Management</p>
                  <ul className="text-sm text-warm-600 mt-2 space-y-1">
                    <li>• Budget reports</li>
                    <li>• Grant accounts</li>
                    <li>• Recharges</li>
                  </ul>
                </div>
              </div>
            </div>
          </Section>

          {/* Shipping & Mail */}
          <Section id="shipping" title="Shipping & Receiving">
            <div className="p-4 bg-warm-50 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-warm-800">Departmental Mail & Packages</p>
                  <p className="text-sm text-warm-600 mt-1">Contact Paul Diaz for shipping/receiving questions</p>
                  <a href="mailto:pdiaz@lifesci.ucsb.edu" className="text-sm text-ocean-blue mt-2 block">pdiaz@lifesci.ucsb.edu</a>
                  <a href="tel:8058933234" className="text-sm text-ocean-blue">805-893-3234</a>
                </div>
                <div className="text-right">
                  <p className="font-medium text-warm-700">Mailing Address</p>
                  <p className="text-sm text-warm-600">
                    EEMB Department<br />
                    University of California<br />
                    Santa Barbara, CA 93106-9620
                  </p>
                </div>
              </div>
            </div>
          </Section>

          {/* Campus Resources */}
          <Section id="campus" title="Campus Resources">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a href="https://cnsi.ucsb.edu" target="_blank" rel="noopener noreferrer" className="p-4 bg-warm-50 rounded-lg hover:bg-warm-100 transition">
                <p className="font-medium text-warm-800">CNSI</p>
                <p className="text-sm text-warm-600">California NanoSystems Institute</p>
              </a>
              <a href="https://nceas.ucsb.edu" target="_blank" rel="noopener noreferrer" className="p-4 bg-warm-50 rounded-lg hover:bg-warm-100 transition">
                <p className="font-medium text-warm-800">NCEAS</p>
                <p className="text-sm text-warm-600">National Center for Ecological Analysis & Synthesis</p>
              </a>
              <a href="https://research.ucsb.edu" target="_blank" rel="noopener noreferrer" className="p-4 bg-warm-50 rounded-lg hover:bg-warm-100 transition">
                <p className="font-medium text-warm-800">Office of Research</p>
                <p className="text-sm text-warm-600">Grants, compliance, research development</p>
              </a>
              <a href="https://csc.ucsb.edu" target="_blank" rel="noopener noreferrer" className="p-4 bg-warm-50 rounded-lg hover:bg-warm-100 transition">
                <p className="font-medium text-warm-800">Center for Scientific Computing</p>
                <p className="text-sm text-warm-600">High-performance computing resources</p>
              </a>
              <a href="https://library.ucsb.edu" target="_blank" rel="noopener noreferrer" className="p-4 bg-warm-50 rounded-lg hover:bg-warm-100 transition">
                <p className="font-medium text-warm-800">UCSB Library</p>
                <p className="text-sm text-warm-600">Journals, databases, research support</p>
              </a>
              <a href="https://ehs.ucsb.edu" target="_blank" rel="noopener noreferrer" className="p-4 bg-warm-50 rounded-lg hover:bg-warm-100 transition">
                <p className="font-medium text-warm-800">Environmental Health & Safety</p>
                <p className="text-sm text-warm-600">Lab safety, training, compliance</p>
              </a>
            </div>
          </Section>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 bg-white border-t border-warm-200">
        <div className="container mx-auto px-4 text-center">
          <p className="text-warm-600 mb-4">Can't find what you need?</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:info@eemb.ucsb.edu" className="px-6 py-3 border border-warm-300 rounded-lg text-warm-700 hover:border-warm-400 hover:bg-warm-50 transition">
              Email Us
            </a>
            <a href="tel:8058932974" className="px-6 py-3 bg-ocean-blue text-white rounded-lg hover:bg-ocean-deep transition">
              Call 805-893-2974
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
