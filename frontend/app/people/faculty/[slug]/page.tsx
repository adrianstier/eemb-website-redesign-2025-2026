import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, Globe, GraduationCap, Users } from 'lucide-react'
import { getFacultyBySlug, getAllFacultySlugs, getStudentsByAdvisor } from '@/lib/data'

export const revalidate = 900 // Revalidate every 15 minutes

export async function generateStaticParams() {
  const slugs = await getAllFacultySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const faculty = await getFacultyBySlug(slug)

  if (!faculty) {
    return { title: 'Faculty Not Found' }
  }

  return {
    title: `${faculty.full_name || `${faculty.first_name} ${faculty.last_name}`} | EEMB Faculty`,
    description: faculty.short_bio || `Learn about ${faculty.full_name}'s research in the EEMB department at UC Santa Barbara.`
  }
}

export default async function FacultyProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const faculty = await getFacultyBySlug(slug)

  if (!faculty) {
    notFound()
  }

  const students = faculty.id ? await getStudentsByAdvisor(faculty.id) : []
  const fullName = faculty.full_name || `${faculty.first_name} ${faculty.last_name}`
  const researchInterests = faculty.research_interests as string[] | null
  const hasResearchLinks = faculty.lab_website || faculty.google_scholar || faculty.orcid

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Back Link */}
          <Link
            href="/people"
            className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-150 mb-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ocean-deep rounded px-2 py-1 -ml-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">Back to Directory</span>
          </Link>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Image */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 flex-shrink-0 rounded-full overflow-hidden bg-white/20 flex items-center justify-center border-4 border-white shadow-lg">
              {faculty.photo_url ? (
                <Image
                  src={faculty.photo_url}
                  alt={fullName}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-4xl font-bold">
                  {faculty.first_name[0]}{faculty.last_name?.[0] || ''}
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 leading-tight">
                {fullName}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium mb-1">
                {faculty.title}
              </p>
              <p className="text-base md:text-lg text-white/80">
                Department of {faculty.department || 'EEMB'}
              </p>
              {faculty.accepting_students && (
                <div className="mt-4 inline-flex items-center gap-2 bg-ucsb-gold text-ocean-deep px-4 py-2 rounded-full text-sm font-semibold">
                  <Users className="w-4 h-4" />
                  Accepting Graduate Students
                  {faculty.accepting_students_note && (
                    <span className="text-ocean-deep/70">({faculty.accepting_students_note})</span>
                  )}
                </div>
              )}
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
                  {faculty.email && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-1">Email</p>
                        <a
                          href={`mailto:${faculty.email}`}
                          className="text-ocean-teal hover:text-ocean-deep hover:underline break-words font-medium transition-colors duration-150"
                        >
                          {faculty.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {faculty.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-1">Phone</p>
                        <a
                          href={`tel:${faculty.phone}`}
                          className="text-warm-700 hover:text-ocean-teal font-medium transition-colors duration-150"
                        >
                          {faculty.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Office */}
                  {faculty.office && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-1">Office</p>
                        <p className="text-warm-700 font-medium">{faculty.office}</p>
                      </div>
                    </div>
                  )}

                  {/* Office Hours */}
                  {faculty.office_hours && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-1">Office Hours</p>
                        <p className="text-warm-700 font-medium">{faculty.office_hours}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Research Links */}
                {hasResearchLinks && (
                  <div className="mt-6 pt-6 border-t border-warm-200">
                    <h3 className="text-sm font-bold text-warm-700 uppercase tracking-wide mb-3">
                      Research Links
                    </h3>
                    <div className="space-y-2">
                      {faculty.lab_website && (
                        <a
                          href={faculty.lab_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-warm-100 transition-colors duration-150 group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-ocean-teal/10 flex items-center justify-center group-hover:bg-ocean-teal/20 transition-colors flex-shrink-0">
                            <Globe className="w-5 h-5 text-ocean-teal" />
                          </div>
                          <span className="font-medium text-warm-700 group-hover:text-ocean-teal transition-colors">Lab Website</span>
                        </a>
                      )}

                      {faculty.google_scholar && (
                        <a
                          href={faculty.google_scholar}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-warm-100 transition-colors duration-150 group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-ocean-teal/10 flex items-center justify-center group-hover:bg-ocean-teal/20 transition-colors flex-shrink-0">
                            <GraduationCap className="w-5 h-5 text-ocean-teal" />
                          </div>
                          <span className="font-medium text-warm-700 group-hover:text-ocean-teal transition-colors">Google Scholar</span>
                        </a>
                      )}

                      {faculty.orcid && (
                        <a
                          href={`https://orcid.org/${faculty.orcid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-warm-100 transition-colors duration-150 group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-ocean-teal/10 flex items-center justify-center group-hover:bg-ocean-teal/20 transition-colors flex-shrink-0">
                            <span className="text-ocean-teal font-bold text-xs">iD</span>
                          </div>
                          <span className="font-medium text-warm-700 group-hover:text-ocean-teal transition-colors">ORCID iD</span>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* Biography */}
              <article className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 p-6 md:p-8">
                <h2 className="text-2xl font-display font-bold text-ocean-deep mb-4">Biography</h2>
                <div className="prose prose-warm max-w-none">
                  {faculty.bio ? (
                    <p className="text-warm-700 whitespace-pre-line leading-relaxed">
                      {faculty.bio}
                    </p>
                  ) : faculty.short_bio ? (
                    <p className="text-warm-700 whitespace-pre-line leading-relaxed">
                      {faculty.short_bio}
                    </p>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-warm-500 italic">Biography coming soon</p>
                    </div>
                  )}
                </div>
              </article>

              {/* Research Interests */}
              {researchInterests && researchInterests.length > 0 && (
                <article className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-ocean-teal to-ocean-blue p-6 md:p-8">
                    <h2 className="text-2xl font-display font-bold text-white">Research Focus</h2>
                  </div>
                  <div className="p-6 md:p-8">
                    <div className="flex flex-wrap gap-2">
                      {researchInterests.map((interest, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-4 py-2 bg-ocean-teal/10 border border-ocean-teal/20 text-ocean-teal rounded-full text-sm font-medium"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              )}

              {/* Research Areas from database */}
              {faculty.research_areas && faculty.research_areas.length > 0 && (
                <article className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 p-6 md:p-8">
                  <h2 className="text-2xl font-display font-bold text-ocean-deep mb-4">Research Areas</h2>
                  <div className="flex flex-wrap gap-3">
                    {faculty.research_areas.map((area) => (
                      <Link
                        key={area.id}
                        href={`/research/${area.slug}`}
                        className="inline-flex items-center px-4 py-2 bg-warm-100 text-warm-700 rounded-lg text-sm font-medium hover:bg-ocean-teal hover:text-white transition-colors"
                      >
                        {area.name}
                      </Link>
                    ))}
                  </div>
                </article>
              )}

              {/* Graduate Students */}
              {students.length > 0 && (
                <article className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 p-6 md:p-8">
                  <h2 className="text-2xl font-display font-bold text-ocean-deep mb-4">Graduate Students</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {students.map((student) => (
                      <Link
                        key={student.id}
                        href={`/people/students/${student.slug}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-warm-100 transition-colors"
                      >
                        {student.photo_url ? (
                          <Image
                            src={student.photo_url}
                            alt={student.full_name || `${student.first_name} ${student.last_name}`}
                            width={48}
                            height={48}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-ocean-teal/10 flex items-center justify-center">
                            <span className="text-ocean-teal font-bold">
                              {student.first_name[0]}{student.last_name[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-ocean-deep">
                            {student.full_name || `${student.first_name} ${student.last_name}`}
                          </p>
                          <p className="text-sm text-warm-500">{student.degree_program}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </article>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
