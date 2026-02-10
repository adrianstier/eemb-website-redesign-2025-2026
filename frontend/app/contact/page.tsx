import Link from 'next/link'
import Image from 'next/image'
import {
  Building2,
  GraduationCap,
  BookOpen,
  Microscope,
  Mail,
  Rainbow,
  MapPin,
  Clock,
  Phone,
  ExternalLink,
  LucideIcon
} from 'lucide-react'
import ContactForm from '@/components/ContactForm'
import SectionHeader from '@/components/ui/SectionHeader'
import WaveDivider from '@/components/ui/WaveDivider'

export const metadata = {
  title: 'Contact Us | EEMB',
  description: 'Get in touch with the Department of Ecology, Evolution & Marine Biology at UC Santa Barbara. Find office locations, contact information, and send us a message.',
}

interface ContactInfo {
  title: string
  description: string
  icon: LucideIcon
  details: string[]
  href?: string
}

const contactInfo: ContactInfo[] = [
    {
      title: 'Main Office',
      description: 'General inquiries and department information',
      icon: Building2,
      details: [
        'Life Sciences Building, Room 4102',
        'University of California, Santa Barbara',
        'Santa Barbara, CA 93106-9620',
        'Phone: (805) 893-2974',
        'Email: info@eemb.ucsb.edu'
      ]
    },
    {
      title: 'Graduate Program',
      description: 'Information about graduate applications and programs',
      icon: GraduationCap,
      details: [
        'Staff Graduate Advisor: Mengshu Ye',
        'Email: mengshuye@ucsb.edu',
        'Office Hours: Mon-Fri, 9am-5pm'
      ],
      href: '/academics/graduate'
    },
    {
      title: 'Undergraduate Program',
      description: 'Undergraduate majors, minors, and courses',
      icon: BookOpen,
      details: [
        'Undergraduate Advisor: Evelin Ambrocio-Silva',
        'Phone: (805) 893-4622',
        'Email: eambrocio@lifesci.ucsb.edu'
      ]
    },
    {
      title: 'Research',
      description: 'Research themes and faculty expertise',
      icon: Microscope,
      details: [
        'Marine Science Institute',
        'Explore our research areas online',
        'Contact faculty directly via profiles'
      ],
      href: '/research'
    },
    {
      title: 'Academic Personnel',
      description: 'Faculty recruitment, merit, and promotion',
      icon: Mail,
      details: [
        'Rosa Vasquez',
        'Email: rosavasquez@ucsb.edu',
        'Curriculum & faculty matters'
      ]
    },
    {
      title: 'Diversity & Inclusion',
      description: 'DEI initiatives and community support',
      icon: Rainbow,
      details: [
        'Email: eemb-dei@ucsb.edu',
        'Co-Chairs: Deron Burkepile & Cherie Briggs'
      ],
      href: '/dei'
    }
  ]

const locations = [
    {
      name: 'Life Sciences Building',
      purpose: 'Department offices, classrooms, and research labs',
      address: 'UC Santa Barbara Campus',
      hours: 'Open during regular hours'
    },
    {
      name: 'Marine Science Institute',
      purpose: 'Marine research facilities and laboratories',
      address: 'Santa Barbara Waterfront',
      hours: 'Open for authorized researchers'
    },
    {
      name: 'Field Research Stations',
      purpose: 'Field research and ecological studies',
      address: 'Various locations in California',
      hours: 'Seasonal operation'
    }
  ]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section - Compact style for utility page */}
      <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-bioluminescent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-ucsb-gold/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl relative z-10">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-ucsb-gold" />
              <p className="text-ucsb-gold font-medium text-sm tracking-widest uppercase">
                Connect With Us
              </p>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-white tracking-tight">
              Get in Touch
            </h1>

            <p className="text-lg md:text-xl text-white/85 leading-relaxed max-w-2xl">
              Have questions about our programs, research, or department?
              We're here to help.
            </p>
          </div>
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-white" className="-mt-1" />

      {/* Contact Information Grid */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
          <SectionHeader
            eyebrow="Contact Options"
            title="How to Reach Us"
            subtitle="Find the right contact for your inquiry."
            color="teal"
            align="center"
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contactInfo.map((info, idx) => {
              const cardContent = (
                <>
                  {/* Icon with gradient background */}
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-ocean-teal/10 to-bioluminescent/10 flex items-center justify-center mb-5 group-hover:from-ocean-teal/20 group-hover:to-bioluminescent/20 transition-all">
                    <info.icon className="w-7 h-7 text-ocean-teal" />
                  </div>

                  <h3 className="font-heading text-xl font-bold text-ocean-deep mb-2 group-hover:text-ocean-blue transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-warm-600 mb-4 text-sm leading-relaxed">
                    {info.description}
                  </p>

                  <div className="space-y-2 text-sm text-warm-700">
                    {info.details.map((detail, i) => (
                      <p key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-ocean-teal mt-2 shrink-0" />
                        <span>{detail}</span>
                      </p>
                    ))}
                  </div>

                  {info.href && (
                    <div className="mt-4 pt-4 border-t border-warm-200">
                      <span className="inline-flex items-center gap-2 text-sm font-semibold text-ocean-blue group-hover:text-ocean-teal transition-colors">
                        Learn more
                        <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  )}
                </>
              )

              const baseClasses = "group bg-white rounded-2xl border border-warm-200 p-6 transition-all duration-500 hover:shadow-warm-xl hover:border-ocean-teal/30 hover:-translate-y-1"

              if (info.href) {
                return (
                  <Link key={idx} href={info.href} className={`${baseClasses} cursor-pointer block`}>
                    {cardContent}
                  </Link>
                )
              }

              return (
                <div key={idx} className={baseClasses}>
                  {cardContent}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-warm-100" />

      {/* Contact Form and Locations */}
      <section className="py-16 md:py-20 bg-warm-100">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form - 3 columns */}
            <div className="lg:col-span-3">
              <SectionHeader
                eyebrow="Message"
                title="Send Us a Message"
                subtitle="We'll get back to you as soon as possible."
                color="teal"
                className="mb-8"
              />
              <div className="bg-white rounded-3xl shadow-warm-lg p-6 md:p-10 border border-warm-200">
                <ContactForm
                  subjects={[
                    'General Inquiry',
                    'Graduate Program',
                    'Undergraduate Program',
                    'Research Opportunities',
                    'Faculty Contact',
                    'Other',
                  ]}
                />
              </div>
            </div>

            {/* Locations - 2 columns */}
            <div className="lg:col-span-2">
              <SectionHeader
                eyebrow="Locations"
                title="Find Us"
                color="blue"
                className="mb-8"
              />

              <div className="space-y-4">
                {locations.map((location, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-5 border border-warm-200 hover:shadow-warm-md transition-shadow"
                  >
                    <h3 className="font-heading text-lg font-bold text-ocean-deep mb-1">
                      {location.name}
                    </h3>
                    <p className="text-warm-600 text-sm mb-3">{location.purpose}</p>
                    <div className="space-y-2 text-sm text-warm-700">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-ocean-teal shrink-0" />
                        {location.address}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-ocean-teal shrink-0" />
                        {location.hours}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Links */}
              <div className="mt-6 bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white rounded-2xl p-6 relative overflow-hidden">
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-bioluminescent/10 rounded-full blur-2xl" />

                <h3 className="font-heading text-xl font-bold mb-5 relative z-10">Quick Links</h3>
                <div className="space-y-3 relative z-10">
                  {[
                    { href: '/academics', label: 'Academic Programs' },
                    { href: '/research', label: 'Research Areas' },
                    { href: '/people', label: 'Faculty Directory' },
                    { href: '/dei', label: 'Diversity & Inclusion' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 hover:text-ucsb-gold transition-colors group"
                    >
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {link.label}
                    </Link>
                  ))}
                  <a
                    href="https://www.ucsb.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-ucsb-gold transition-colors group"
                  >
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    UCSB Main Website
                    <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-white" />

      {/* Office Hours */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl">
          <SectionHeader
            eyebrow="Hours"
            title="Office Hours & Availability"
            color="gold"
            align="center"
            className="mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-ocean-teal/5 to-bioluminescent/5 rounded-2xl p-8 border border-ocean-teal/20">
              <div className="w-12 h-12 rounded-xl bg-ocean-teal/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-ocean-teal" />
              </div>
              <h3 className="font-heading text-xl font-bold text-ocean-deep mb-4">
                Regular Office Hours
              </h3>
              <div className="space-y-2 text-warm-700">
                <p className="flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span>9:00 AM - 5:00 PM</span>
                </p>
                <p className="flex justify-between">
                  <span className="font-medium">Saturday - Sunday</span>
                  <span className="text-warm-500">Closed</span>
                </p>
              </div>
              <p className="text-sm text-warm-500 mt-4">
                Hours may vary during holidays and academic breaks.
              </p>
            </div>

            <div className="bg-gradient-to-br from-ucsb-gold/5 to-warm-100 rounded-2xl p-8 border border-ucsb-gold/20">
              <div className="w-12 h-12 rounded-xl bg-ucsb-gold/10 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-ucsb-gold" />
              </div>
              <h3 className="font-heading text-xl font-bold text-ocean-deep mb-4">
                Schedule a Meeting
              </h3>
              <p className="text-warm-700 mb-6">
                For a formal meeting with faculty or staff, please schedule in advance.
              </p>
              <a
                href="mailto:eemb@ucsb.edu?subject=Meeting%20Request"
                className="w-full inline-flex items-center justify-center gap-2 bg-ucsb-gold text-ocean-deep py-3 px-6 rounded-xl font-bold hover:bg-yellow-400 transition-all hover:shadow-md"
              >
                <Mail className="w-5 h-5" />
                Request Appointment
              </a>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider variant="bold" toColor="fill-ocean-deep" />

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-ocean-deep text-white -mt-1">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            We're Looking Forward to Hearing From You
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
            Whether you're interested in joining our community, collaborating on research,
            or simply learning more about our department—don't hesitate to reach out.
          </p>
        </div>
      </section>
    </div>
  )
}
