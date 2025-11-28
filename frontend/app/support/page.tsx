'use client'

import { useState } from 'react'
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
  ExclamationTriangleIcon,
  MapPinIcon,
  UserGroupIcon,
  BanknotesIcon,
  HomeModernIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

// Types
interface StaffMember {
  name: string
  title: string
  email: string
  phone?: string
  responsibilities: string
}

export default function SupportPage() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['staff']))
  const [searchQuery, setSearchQuery] = useState('')

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

  // Staff Directory - consolidated
  const adminStaff: StaffMember[] = [
    { name: 'Andrea Jorgensen', title: 'Management Services Officer', email: 'andrea.jorgensen@lifesci.ucsb.edu', responsibilities: 'Business operations, department management' },
    { name: 'Rosa Vasquez', title: 'Academic Personnel', email: 'rosavasquez@ucsb.edu', responsibilities: 'Faculty recruitment, merit & promotion' },
    { name: 'Danielle Perez', title: 'Departmental Assistant', email: 'dcperez@ucsb.edu', responsibilities: 'Front desk, keys & access' },
    { name: 'Haley Martin', title: 'Director of Finance', email: 'haleymartin@ucsb.edu', responsibilities: 'Procurement, accounts payable' },
  ]

  const academicAdvisors: StaffMember[] = [
    { name: 'Mengshu Ye', title: 'Graduate Advisor', email: 'mengshuye@ucsb.edu', responsibilities: 'Graduate program, qualifying exams' },
    { name: 'Evelin Ambrocio-Silva', title: 'Undergraduate Advisor', email: 'eambrocio@lifesci.ucsb.edu', phone: '805-893-4622', responsibilities: 'Major requirements, graduation' },
    { name: 'Ellery Wilkie', title: 'Undergraduate Advisor', email: 'ewilkie@lifesci.ucsb.edu', responsibilities: 'Biology majors, course planning' },
  ]

  const leadership = [
    { name: 'Todd Oakley', title: 'Department Chair', email: 'oakley@ucsb.edu', phone: '805-893-4715', office: 'LSB 4101' },
    { name: 'Hillary Young', title: 'Vice Chair Resources', email: 'hillary.young@lifesci.ucsb.edu', phone: '805-893-4681', office: 'Noble 2116' },
    { name: 'Stephen Proulx', title: 'Vice Chair Curriculum', email: 'sproul@ucsb.edu', office: 'LSB 4109' },
  ]

  // Compact contact card component
  const ContactCard = ({ name, title, email, phone, extra }: { name: string; title: string; email: string; phone?: string; extra?: string }) => (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-ocean-blue/30 hover:shadow-sm transition-all">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ocean-blue to-ocean-teal flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
        {name.split(' ').map(n => n[0]).join('')}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-gray-900 text-sm">{name}</p>
        <p className="text-xs text-ocean-blue">{title}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0 mt-0.5">
          <a href={`mailto:${email}`} className="text-xs text-gray-500 hover:text-ocean-blue">{email.split('@')[0]}@...</a>
          {phone && <a href={`tel:${phone}`} className="text-xs text-gray-500 hover:text-ocean-blue">{phone}</a>}
          {extra && <span className="text-xs text-gray-400">{extra}</span>}
        </div>
      </div>
    </div>
  )

  // Section content components
  const StaffDirectoryContent = () => (
    <div className="space-y-6">
      {/* Leadership - horizontal on desktop */}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Leadership</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {leadership.map((l, i) => (
            <ContactCard key={i} name={l.name} title={l.title} email={l.email} phone={l.phone} extra={l.office} />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Staff */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Administrative Staff</h4>
          <div className="space-y-2">
            {adminStaff.map((s, i) => (
              <ContactCard key={i} name={s.name} title={s.title} email={s.email} />
            ))}
          </div>
        </div>

        {/* Academic Advisors */}
        <div>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Academic Advisors</h4>
          <div className="space-y-2">
            {academicAdvisors.map((a, i) => (
              <ContactCard key={i} name={a.name} title={a.title} email={a.email} phone={a.phone} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const StudentServicesContent = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg border border-purple-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-purple-500"></span>
          <h4 className="font-semibold text-gray-900">Graduate Students</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Contact <a href="mailto:mengshuye@ucsb.edu" className="text-purple-600 font-medium hover:underline">Mengshu Ye</a>
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          {['Program requirements', 'Qualifying exams', 'Dissertation guidance', 'TA/GSR positions', 'Fellowships'].map((item, i) => (
            <li key={i} className="flex items-center gap-2"><ChevronRightIcon className="w-3 h-3 text-purple-400" />{item}</li>
          ))}
        </ul>
      </div>

      <div className="p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          <h4 className="font-semibold text-gray-900">Undergraduate Students</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Contact <a href="mailto:eambrocio@lifesci.ucsb.edu" className="text-green-600 font-medium hover:underline">Evelin</a> or <a href="mailto:ewilkie@lifesci.ucsb.edu" className="text-green-600 font-medium hover:underline">Ellery</a>
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          {['Major declaration', 'Course planning', 'Graduation petitions', 'Research (EEMB 199)', 'Career guidance'].map((item, i) => (
            <li key={i} className="flex items-center gap-2"><ChevronRightIcon className="w-3 h-3 text-green-400" />{item}</li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-2 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
        <div>
          <span className="font-medium text-gray-900">Disability Accommodations (DSP)</span>
          <span className="text-sm text-gray-500 ml-2">Testing, note-taking, accessible materials</span>
        </div>
        <a href="tel:8058932668" className="px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition">
          805-893-2668
        </a>
      </div>
    </div>
  )

  const ResearchServicesContent = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { name: 'EEMB Shop', icon: WrenchScrewdriverIcon, desc: 'Equipment fabrication & repair', location: 'Life Sciences', contact: 'info@eemb.ucsb.edu' },
          { name: 'Greenhouse', icon: HomeModernIcon, desc: 'Climate-controlled growing spaces', location: 'Adjacent to LSB', contact: 'info@eemb.ucsb.edu' },
          { name: 'Marine Operations', icon: MapPinIcon, desc: 'Vessels, diving, coastal access', location: 'MSI', contact: '805-893-2675' },
          { name: 'Microscopy Facility', icon: CameraIcon, desc: 'Confocal, SEM/TEM imaging', location: 'NRI', contact: 'nri.ucsb.edu/microscopy' },
        ].map((f, i) => {
          const Icon = f.icon
          return (
            <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-100">
              <Icon className="w-6 h-6 text-ocean-blue flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{f.name}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
                <p className="text-xs text-gray-400">{f.location} • <span className="text-ocean-blue">{f.contact}</span></p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-sm text-gray-700">
          <strong className="text-amber-800">Safety & Compliance:</strong> Lab safety, field work, dive certification, IACUC protocols.
          Contact EH&S: <a href="tel:8058935813" className="font-medium text-amber-700">805-893-5813</a>
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { name: 'CNSI', url: 'cnsi.ucsb.edu' },
          { name: 'NCEAS', url: 'nceas.ucsb.edu' },
          { name: 'Office of Research', url: 'research.ucsb.edu' },
          { name: 'Research Computing', url: 'ccs.ucsb.edu' },
          { name: 'Library', url: 'library.ucsb.edu' },
        ].map((r, i) => (
          <a key={i} href={`https://${r.url}`} target="_blank" rel="noopener noreferrer"
             className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-medium text-gray-700 transition">
            {r.name} ↗
          </a>
        ))}
      </div>
    </div>
  )

  const FacilitiesContent = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { title: 'Conference Rooms', desc: 'LSB 1001, 4001, Noble Hall', action: 'Book via EMS' },
        { title: 'Keys & Access', desc: 'Building, lab, after-hours', action: 'dcperez@ucsb.edu' },
        { title: 'Equipment', desc: 'AV, projectors, field gear', action: 'Contact front desk' },
        { title: 'Maintenance', desc: 'HVAC, electrical, plumbing', action: 'Facilities Mgmt' },
      ].map((item, i) => (
        <div key={i} className="p-3 bg-gray-50 rounded-lg">
          <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
          <p className="text-xs text-gray-500 mb-1">{item.desc}</p>
          <p className="text-xs text-ocean-blue">{item.action}</p>
        </div>
      ))}
    </div>
  )

  const FinanceContent = () => (
    <div className="space-y-3">
      <p className="text-sm text-gray-600">
        Contact <a href="mailto:haleymartin@ucsb.edu" className="text-ocean-blue font-medium">Haley Martin</a> for all finance matters
      </p>
      <div className="grid grid-cols-3 gap-3">
        {[
          { title: 'Procurement', items: ['Purchase orders', 'P-Card', 'Vendor setup'] },
          { title: 'Reimbursements', items: ['Travel', 'Supplies', 'Conference fees'] },
          { title: 'Fund Management', items: ['Budgets', 'Grants', 'Recharges'] },
        ].map((section, i) => (
          <div key={i} className="p-3 bg-amber-50 rounded-lg border border-amber-100">
            <p className="font-semibold text-gray-900 text-sm mb-2">{section.title}</p>
            <ul className="text-xs text-gray-600 space-y-0.5">
              {section.items.map((item, j) => <li key={j}>• {item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )

  const TechnicalContent = () => (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
      <div>
        <p className="font-semibold text-gray-900">UCSB IT Help Desk</p>
        <p className="text-sm text-gray-500">Network, email, software, VPN, printing, security</p>
      </div>
      <div className="flex items-center gap-2">
        <a href="mailto:help@ucsb.edu" className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-gray-300 transition">
          help@ucsb.edu
        </a>
        <a href="tel:8058932400" className="px-3 py-1.5 bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition">
          805-893-2400
        </a>
      </div>
    </div>
  )

  const ShippingContent = () => (
    <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
      <div>
        <p className="font-semibold text-gray-900">Mail & Shipping</p>
        <p className="text-sm text-gray-500">Mailroom in LSB • FedEx/UPS available • Hazmat requires special handling</p>
      </div>
      <div className="text-right text-sm">
        <p className="text-gray-700">EEMB, UC Santa Barbara</p>
        <p className="text-gray-500">Santa Barbara, CA 93106-9620</p>
      </div>
    </div>
  )

  const WellnessContent = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {[
          { name: 'CAPS', phone: '805-893-4411', note: '24/7 Mental Health', highlight: true },
          { name: 'Title IX', phone: '805-893-2701', note: 'Sexual Harassment' },
          { name: 'Ombuds', phone: '805-893-3285', note: 'Conflict Resolution' },
          { name: 'Employee Assist', phone: '805-893-3318', note: 'Faculty/Staff' },
          { name: 'RCSGD', phone: '805-894-5847', note: 'LGBTQIA+ Resources' },
          { name: 'Ethics Hotline', phone: '800-403-4744', note: 'Anonymous' },
        ].map((r, i) => (
          <a key={i} href={`tel:${r.phone.replace(/[^0-9]/g, '')}`}
             className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
               r.highlight ? 'bg-teal-50 border-teal-200 hover:border-teal-300' : 'bg-white border-gray-100 hover:border-gray-200'
             }`}>
            <p className="font-semibold text-gray-900 text-sm">{r.name}</p>
            <p className="text-ocean-blue font-medium text-sm">{r.phone}</p>
            <p className="text-xs text-gray-500">{r.note}</p>
          </a>
        ))}
      </div>
      <p className="text-xs text-gray-500 text-center">
        Also: Women's Center • Multicultural Center • International Students • Legal Resource Center
      </p>
    </div>
  )

  const EmergencyContent = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { service: 'Campus Emergency', phone: '9-911', desc: 'From campus phone' },
        { service: 'Campus Police', phone: '805-893-3446', desc: 'Non-emergency' },
        { service: 'CAPS Crisis', phone: '805-893-4411', desc: '24/7 counseling' },
        { service: 'CARE', phone: '805-893-3778', desc: 'Sexual assault support' },
      ].map((c, i) => (
        <a key={i} href={`tel:${c.phone.replace(/[^0-9]/g, '')}`}
           className="p-4 bg-red-50 rounded-lg border border-red-100 hover:border-red-200 hover:shadow-sm transition-all text-center">
          <p className="text-xs text-red-600 uppercase tracking-wide font-medium">{c.service}</p>
          <p className="text-xl font-bold text-red-700 my-1">{c.phone}</p>
          <p className="text-xs text-gray-500">{c.desc}</p>
        </a>
      ))}
    </div>
  )

  // All sections with metadata
  const sections = [
    { id: 'staff', icon: UserGroupIcon, title: 'Staff Directory', count: 10, content: <StaffDirectoryContent /> },
    { id: 'students', icon: AcademicCapIcon, title: 'Student Services', count: null, content: <StudentServicesContent /> },
    { id: 'research', icon: BeakerIcon, title: 'Research Facilities', count: 4, content: <ResearchServicesContent /> },
    { id: 'facilities', icon: BuildingOfficeIcon, title: 'Facilities', count: null, content: <FacilitiesContent /> },
    { id: 'finance', icon: BanknotesIcon, title: 'Finance', count: null, content: <FinanceContent /> },
    { id: 'technical', icon: ComputerDesktopIcon, title: 'IT Support', count: null, content: <TechnicalContent /> },
    { id: 'shipping', icon: TruckIcon, title: 'Mail & Shipping', count: null, content: <ShippingContent /> },
    { id: 'wellness', icon: HeartIcon, title: 'Wellness', count: 6, content: <WellnessContent /> },
    { id: 'emergency', icon: ExclamationTriangleIcon, title: 'Emergency', count: null, content: <EmergencyContent /> },
  ]

  // Filter sections by search
  const filteredSections = searchQuery
    ? sections.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : sections

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Hero */}
      <section className="bg-gradient-to-r from-ucsb-navy to-blue-800 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Support Services</h1>
              <p className="text-blue-200 text-sm mt-1">Find contacts, resources, and services</p>
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-ucsb-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Navigation - Scrollable on mobile */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            {sections.map(s => {
              const Icon = s.icon
              const isActive = expandedSections.has(s.id)
              const isEmergency = s.id === 'emergency'
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    if (!expandedSections.has(s.id)) {
                      toggleSection(s.id)
                    }
                    setTimeout(() => {
                      document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }, 100)
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap flex-shrink-0 border ${
                    isEmergency
                      ? isActive
                        ? 'bg-red-500 text-white border-red-500'
                        : 'bg-red-900/40 text-red-100 border-red-400/50 hover:bg-red-800/50'
                      : isActive
                        ? 'bg-white text-gray-900 border-white'
                        : 'bg-blue-900/40 text-blue-100 border-blue-300/30 hover:bg-blue-800/50 hover:border-blue-300/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{s.title}</span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-6">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Main Contact Banner */}
          <div className="mb-5 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-ocean-blue/10 flex items-center justify-center flex-shrink-0">
                  <BuildingOfficeIcon className="w-5 h-5 text-ocean-blue" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">EEMB Main Office</p>
                  <p className="text-xs text-gray-500">Life Sciences Building</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-13 sm:pl-0">
                <a href="mailto:info@eemb.ucsb.edu" className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-600 transition">
                  <EnvelopeIcon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">info@eemb.ucsb.edu</span>
                  <span className="sm:hidden">Email</span>
                </a>
                <a href="tel:8058932974" className="flex items-center gap-1.5 px-3 py-1.5 bg-ocean-blue hover:bg-ocean-deep text-white rounded-lg text-xs font-medium transition">
                  <PhoneIcon className="w-3.5 h-3.5" />
                  805-893-2974
                </a>
              </div>
            </div>
          </div>

          {/* Accordion Sections */}
          <div className="space-y-3">
            {filteredSections.map((section) => {
              const Icon = section.icon
              const isExpanded = expandedSections.has(section.id)
              const isEmergency = section.id === 'emergency'

              return (
                <div
                  key={section.id}
                  id={section.id}
                  className={`bg-white rounded-xl overflow-hidden transition-shadow ${
                    isExpanded ? 'shadow-md' : 'shadow-sm hover:shadow-md'
                  } ${isEmergency ? 'ring-1 ring-red-200' : ''}`}
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className={`w-full px-5 py-4 flex items-center gap-3 text-left transition ${
                      isExpanded ? 'border-b border-gray-100' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
                      isEmergency
                        ? 'bg-red-100 text-red-600'
                        : isExpanded
                          ? 'bg-ocean-blue text-white'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-semibold ${isEmergency ? 'text-red-800' : 'text-gray-900'}`}>
                        {section.title}
                        {section.count && <span className="ml-2 text-sm font-normal text-gray-400">({section.count})</span>}
                      </h3>
                    </div>
                    <ChevronDownIcon
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-[2000px]' : 'max-h-0'}`}>
                    <div className={`px-5 py-4 ${isEmergency ? 'bg-red-50/50' : ''}`}>
                      {section.content}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {filteredSections.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500">No services found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-3 px-4 py-2 bg-ocean-blue text-white rounded-lg text-sm font-medium hover:bg-ocean-deep transition"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
