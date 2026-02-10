import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin, GraduationCap, Globe, Beaker } from 'lucide-react'
import { getStudentBySlug, getAllStudentSlugs } from '@/lib/data'

export const revalidate = 900 // Revalidate every 15 minutes

export async function generateStaticParams() {
  const slugs = await getAllStudentSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const student = await getStudentBySlug(slug)

    if (!student) {
      return { title: 'Student Not Found' }
    }

    const fullName = student.full_name || `${student.first_name} ${student.last_name}`
    return {
      title: `${fullName} | EEMB Graduate Student`,
      description: student.short_bio || `Learn about ${fullName}'s research in the EEMB department at UC Santa Barbara.`
    }
  } catch {
    return { title: 'EEMB Graduate Student' }
  }
}

export default async function StudentProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const student = await getStudentBySlug(slug)

  if (!student) {
    notFound()
  }

  const fullName = student.full_name || `${student.first_name} ${student.last_name}`
  const researchInterests = Array.isArray(student.research_interests) ? student.research_interests.filter((i): i is string => typeof i === 'string') : []
  const hasResearchLinks = student.lab_website || student.personal_website || student.google_scholar || student.orcid
  const hasSocialLinks = student.twitter || student.linkedin

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
              {student.photo_url ? (
                <Image
                  src={student.photo_url}
                  alt={fullName}
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-4xl font-bold">
                  {student.first_name[0]}{student.last_name?.[0] || ''}
                </span>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 leading-tight">
                {fullName}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-medium mb-1">
                {student.degree_program ? `${student.degree_program} ` : ''}Student
              </p>
              <p className="text-base md:text-lg text-white/80">
                Department of Ecology, Evolution, and Marine Biology
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
                  {student.email && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-1">Email</p>
                        <a
                          href={`mailto:${student.email}`}
                          className="text-ocean-teal hover:text-ocean-deep hover:underline break-words font-medium transition-colors duration-150"
                        >
                          {student.email}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {student.phone && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-1">Phone</p>
                        <a
                          href={`tel:${student.phone}`}
                          className="text-warm-700 hover:text-ocean-teal font-medium transition-colors duration-150"
                        >
                          {student.phone}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Office */}
                  {student.office && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-1">Office</p>
                        <p className="text-warm-700 font-medium">{student.office}</p>
                      </div>
                    </div>
                  )}

                  {/* Program Info */}
                  {(student.year_entered || student.expected_graduation) && (
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-ocean-teal/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-ocean-teal" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-warm-500 uppercase tracking-wide mb-1">Program</p>
                        <p className="text-warm-700 font-medium">
                          {student.year_entered && `Entered ${student.year_entered}`}
                          {student.year_entered && student.expected_graduation && ' · '}
                          {student.expected_graduation && `Expected ${student.expected_graduation}`}
                        </p>
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
                      {student.lab_website && (
                        <a
                          href={student.lab_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-warm-100 transition-colors duration-150 group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-ocean-teal/10 flex items-center justify-center group-hover:bg-ocean-teal/20 transition-colors flex-shrink-0">
                            <Beaker className="w-5 h-5 text-ocean-teal" />
                          </div>
                          <span className="font-medium text-warm-700 group-hover:text-ocean-teal transition-colors">Lab Website</span>
                        </a>
                      )}

                      {student.personal_website && (
                        <a
                          href={student.personal_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-warm-100 transition-colors duration-150 group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-ocean-teal/10 flex items-center justify-center group-hover:bg-ocean-teal/20 transition-colors flex-shrink-0">
                            <Globe className="w-5 h-5 text-ocean-teal" />
                          </div>
                          <span className="font-medium text-warm-700 group-hover:text-ocean-teal transition-colors">Personal Website</span>
                        </a>
                      )}

                      {student.google_scholar && (
                        <a
                          href={student.google_scholar}
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

                      {student.orcid && (
                        <a
                          href={`https://orcid.org/${student.orcid}`}
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

                {/* Social Links */}
                {hasSocialLinks && (
                  <div className="mt-6 pt-6 border-t border-warm-200">
                    <h3 className="text-sm font-bold text-warm-700 uppercase tracking-wide mb-3">
                      Social
                    </h3>
                    <div className="flex gap-3">
                      {student.twitter && (
                        <a
                          href={student.twitter.startsWith('http') ? student.twitter : `https://twitter.com/${student.twitter}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-lg bg-warm-100 flex items-center justify-center hover:bg-[#1DA1F2] hover:text-white text-warm-500 transition-colors duration-150"
                          aria-label="Twitter"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        </a>
                      )}
                      {student.linkedin && (
                        <a
                          href={student.linkedin.startsWith('http') ? student.linkedin : `https://linkedin.com/in/${student.linkedin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-10 h-10 rounded-lg bg-warm-100 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white text-warm-500 transition-colors duration-150"
                          aria-label="LinkedIn"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
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
                <h2 className="text-2xl font-display font-bold text-ocean-deep mb-4">About</h2>
                <div className="prose prose-warm max-w-none">
                  {student.bio ? (
                    <p className="text-warm-700 whitespace-pre-line leading-relaxed">
                      {student.bio}
                    </p>
                  ) : student.short_bio ? (
                    <p className="text-warm-700 whitespace-pre-line leading-relaxed">
                      {student.short_bio}
                    </p>
                  ) : (
                    <div className="relative py-12 text-center">
                      {/* Decorative background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-ocean-teal/5 to-bioluminescent/5 rounded-xl"></div>
                      <div className="relative">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-ocean-teal/20 to-ocean-blue/20 flex items-center justify-center">
                          <GraduationCap className="w-10 h-10 text-ocean-teal" />
                        </div>
                        <p className="text-warm-600 font-medium mb-2">
                          Graduate researcher in training
                        </p>
                        <p className="text-warm-500 text-sm max-w-md mx-auto">
                          {student.first_name} is a {student.degree_program ? `${student.degree_program} ` : ''}student{student.advisor ? ` in the ${student.advisor.last_name} lab` : ''} working on exciting research in ecology, evolution, and marine biology.
                        </p>
                        {student.email && (
                          <a
                            href={`mailto:${student.email}`}
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-ocean-teal/10 text-ocean-teal font-medium rounded-lg hover:bg-ocean-teal hover:text-white transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                            Get in Touch
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>

              {/* Research Interests */}
              {researchInterests.length > 0 && (
                <article className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-ocean-teal to-ocean-blue p-6 md:p-8">
                    <h2 className="text-2xl font-display font-bold text-white">Research Interests</h2>
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

              {/* Advisor Information */}
              {student.advisor && (
                <article className="bg-white rounded-2xl shadow-warm-sm border border-warm-200 p-6 md:p-8">
                  <h2 className="text-2xl font-display font-bold text-ocean-deep mb-4">Advisor</h2>
                  {(() => {
                    const advisorContent = (
                      <>
                        {student.advisor.photo_url ? (
                          <Image
                            src={student.advisor.photo_url}
                            alt={student.advisor.full_name || `${student.advisor.first_name} ${student.advisor.last_name}`}
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-ocean-teal/10 flex items-center justify-center">
                            <span className="text-ocean-teal font-bold text-xl">
                              {student.advisor.first_name[0]}{student.advisor.last_name[0]}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-ocean-deep">
                            {student.advisor.full_name || `${student.advisor.first_name} ${student.advisor.last_name}`}
                          </p>
                          <p className="text-sm text-warm-500">{student.advisor.title}</p>
                        </div>
                      </>
                    )

                    return student.advisor.slug ? (
                      <Link
                        href={`/people/faculty/${student.advisor.slug}`}
                        className="flex items-center gap-4 p-4 rounded-xl bg-warm-50 hover:bg-warm-100 transition-colors"
                      >
                        {advisorContent}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-4 p-4 rounded-xl bg-warm-50">
                        {advisorContent}
                      </div>
                    )
                  })()}
                </article>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
