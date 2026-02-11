import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Briefcase, Building2 } from 'lucide-react'
import { getStaffBySlug, getAllStaffSlugs } from '@/lib/data'

export const revalidate = 900 // Revalidate every 15 minutes

export async function generateStaticParams() {
  const slugs = await getAllStaffSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const staff = await getStaffBySlug(slug)

    if (!staff) {
      return { title: 'Staff Member Not Found' }
    }

    return {
      title: `${staff.full_name || `${staff.first_name} ${staff.last_name}`} | EEMB Staff`,
      description: staff.short_bio || `${staff.full_name || `${staff.first_name} ${staff.last_name}`}${staff.title ? ` - ${staff.title}` : ''} in the EEMB department at UC Santa Barbara.`
    }
  } catch {
    return { title: 'EEMB Staff' }
  }
}

export default async function StaffProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const staff = await getStaffBySlug(slug)

  if (!staff) {
    notFound()
  }

  const fullName = staff.full_name || `${staff.first_name} ${staff.last_name}`

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-12 md:py-16 overflow-hidden">
        {/* Decorative wave pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="currentColor" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,165.3C672,171,768,213,864,218.7C960,224,1056,192,1152,165.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="container mx-auto px-4 max-w-6xl relative">
          {/* Back Link */}
          <Link
            href="/people"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-150 mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-deep rounded px-2 py-1 -ml-2 group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Directory</span>
          </Link>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Image */}
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-xl"></div>
              <div className="relative w-full h-full rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-4 border-white shadow-2xl">
                {staff.photo_url ? (
                  <Image
                    src={staff.photo_url}
                    alt={fullName}
                    width={144}
                    height={144}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white text-4xl font-bold">
                    {staff.first_name[0]}{staff.last_name?.[0] || ''}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 leading-tight">
                {fullName}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-lg md:text-xl text-white/90 font-medium mb-1">
                <Briefcase className="w-5 h-5" />
                <span>{staff.title || 'Staff'}</span>
              </div>
              <p className="text-base md:text-lg text-white/80">
                Department of {staff.department || 'EEMB'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Sidebar - Contact Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 p-6 lg:sticky lg:top-6">
                <h2 className="text-lg font-bold text-ocean-deep mb-4">
                  Contact Information
                </h2>

                <div className="space-y-4">
                  {/* Email */}
                  {staff.email && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-warm-600 uppercase tracking-wide mb-1">Email</p>
                        <a
                          href={`mailto:${staff.email}`}
                          className="text-ocean-teal hover:text-ocean-deep hover:underline break-words font-medium transition-colors duration-150"
                        >
                          {staff.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {staff.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warm-600 uppercase tracking-wide mb-1">Phone</p>
                        <a
                          href={`tel:${staff.phone}`}
                          className="text-warm-700 hover:text-ocean-teal font-medium transition-colors duration-150"
                        >
                          {staff.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Office */}
                  {staff.office && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warm-600 uppercase tracking-wide mb-1">Office</p>
                        <p className="text-warm-700 font-medium">{staff.office}</p>
                      </div>
                    </div>
                  )}

                  {/* Department */}
                  {staff.department && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warm-600 uppercase tracking-wide mb-1">Department</p>
                        <p className="text-warm-700 font-medium">{staff.department}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* LinkedIn */}
                {staff.linkedin && (
                  <div className="mt-6 pt-6 border-t border-warm-200">
                    <a
                      href={staff.linkedin.startsWith('http') ? staff.linkedin : `https://linkedin.com/in/${staff.linkedin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-[#0077B5]/10 hover:bg-[#0077B5] text-[#0077B5] hover:text-white transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="font-medium">Connect on LinkedIn</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* About Section */}
              <article className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 p-6 md:p-8">
                <h2 className="text-2xl font-display font-bold text-ocean-deep mb-4">About</h2>
                <div className="prose prose-warm max-w-none">
                  {staff.bio ? (
                    <p className="text-warm-700 whitespace-pre-line leading-relaxed">
                      {staff.bio}
                    </p>
                  ) : staff.short_bio ? (
                    <p className="text-warm-700 whitespace-pre-line leading-relaxed">
                      {staff.short_bio}
                    </p>
                  ) : (
                    <div className="relative py-12 text-center">
                      {/* Decorative background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-ocean-teal/5 to-bioluminescent/5 rounded-xl"></div>
                      <div className="relative">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-ocean-teal/20 to-ocean-blue/20 flex items-center justify-center">
                          <svg className="w-8 h-8 text-ocean-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <p className="text-warm-600 font-medium mb-2">
                          {fullName} keeps EEMB running smoothly
                        </p>
                        <p className="text-warm-600 text-sm max-w-md mx-auto">
                            {staff.title
                            ? <>As {staff.title.toLowerCase().startsWith('a') || staff.title.toLowerCase().startsWith('e') || staff.title.toLowerCase().startsWith('i') || staff.title.toLowerCase().startsWith('o') || staff.title.toLowerCase().startsWith('u') ? 'an' : 'a'} {staff.title}, {staff.first_name} plays a vital role in supporting our department&apos;s research and educational mission.</>
                            : <>{staff.first_name} plays a vital role in supporting our department&apos;s research and educational mission.</>
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </article>

              {/* Role Highlights */}
              <article className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 overflow-hidden">
                <div className="bg-gradient-to-r from-ocean-teal to-ocean-blue p-6 md:p-8">
                  <h2 className="text-2xl font-display font-bold text-white">Role & Responsibilities</h2>
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 p-4 bg-warm-50 rounded-xl">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ocean-teal to-ocean-blue flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-ocean-deep">{staff.title || 'Staff'}</p>
                      <p className="text-warm-600 text-sm">Department of {staff.department || 'Ecology, Evolution & Marine Biology'}</p>
                    </div>
                  </div>
                </div>
              </article>

              {/* Contact CTA */}
              <article className="bg-gradient-to-br from-ocean-deep to-ocean-blue rounded-2xl p-6 md:p-8 text-white">
                <h2 className="text-xl font-display font-bold mb-3">Get in Touch</h2>
                <p className="text-white/80 mb-6">
                  Have questions or need assistance? {staff.first_name} is here to help.
                </p>
                {staff.email && (
                  <a
                    href={`mailto:${staff.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-ucsb-gold text-ocean-deep font-semibold rounded-xl hover:bg-white transition-colors duration-300"
                  >
                    <Mail className="w-5 h-5" />
                    Send an Email
                  </a>
                )}
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
