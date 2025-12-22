'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  Scroll,
  BookOpen,
  Shell,
  Microscope,
  BarChart3,
  Lightbulb,
  FileText,
  Handshake,
  Target,
  LucideIcon
} from 'lucide-react'

interface Program {
  id: string
  title: string
  degree: string
  description: string
  fullDescription: string
  requirements: string[]
  courses: number
  duration: string
  icon: LucideIcon
  focusAreas: string[]
  careerOutcomes: string[]
  link?: string
}

export default function AcademicsPage() {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null)

  const programs: Program[] = [
    {
      id: 'phd-ecology',
      title: 'PhD in Ecology, Evolution and Marine Biology',
      degree: 'PhD',
      description: 'Doctoral program offering research training in ecology, evolution, and marine biology.',
      fullDescription: 'Our PhD program provides comprehensive training in ecology, evolution, and marine biology through coursework, seminars, and original research. Students work with leading faculty mentors, collaborate across research areas, and develop expertise in specific fields while maintaining broad understanding of the discipline.',
      requirements: [
        'Bachelor\'s degree in biology or related field',
        'Completion of core courses (EEMB 507, 508, 509)',
        'Written and oral qualifying examinations',
        'Original dissertation research',
        'Two quarters of TA service'
      ],
      courses: 45,
      duration: '5-6 years',
      icon: GraduationCap,
      focusAreas: ['Marine Conservation', 'Climate Adaptation', 'Evolutionary Biology', 'Behavioral Ecology'],
      careerOutcomes: ['Research Scientist', 'University Professor', 'Conservation Manager', 'Environmental Consultant'],
      link: '/academics/graduate'
    },
    {
      id: 'ma-eemb',
      title: 'MA in Ecology, Evolution and Marine Biology',
      degree: 'MA',
      description: 'Master\'s program with thesis or comprehensive exam options.',
      fullDescription: 'The MA program offers advanced education with two pathways: Plan I (thesis, 30 units) for research careers, or Plan II (comprehensive exam, 36 units) for professional training. Both options include core coursework and TA experience.',
      requirements: [
        'Bachelor\'s degree in biology or related field',
        'Completion of core courses (EEMB 507, 508, 509)',
        'Thesis OR comprehensive examination',
        'Two quarters of TA service'
      ],
      courses: 30,
      duration: '2 years',
      icon: Scroll,
      focusAreas: ['Marine Biology', 'Population Genetics', 'Ecosystem Ecology', 'Conservation Biology'],
      careerOutcomes: ['Research Technician', 'Conservation Scientist', 'Environmental Manager', 'PhD Student'],
      link: '/academics/graduate'
    },
    {
      id: 'bs-ecology-evolution',
      title: 'BS in Ecology, Evolution and Marine Biology',
      degree: 'BS',
      description: 'Undergraduate major providing comprehensive training in ecology, evolution, and marine biology.',
      fullDescription: 'Our undergraduate major offers a solid foundation in ecology, evolution, and marine biology with flexibility to specialize in areas of interest. Students gain hands-on research experience, engage in field studies, and develop critical thinking skills.',
      requirements: [
        'Completion of core biology courses',
        'Courses in ecology, evolution, and marine biology',
        'Chemistry and physics prerequisites',
        'Laboratory and field courses',
        'Senior capstone project'
      ],
      courses: 60,
      duration: '4 years',
      icon: BookOpen,
      focusAreas: ['Field Biology', 'Laboratory Techniques', 'Research Methods', 'Environmental Science'],
      careerOutcomes: ['Graduate Student', 'Research Technician', 'Field Biologist', 'Environmental Professional']
    },
    {
      id: 'minor-marine-science',
      title: 'Minor in Marine Science',
      degree: 'Minor',
      description: 'Complementary program for students interested in marine science alongside their major.',
      fullDescription: 'The Marine Science minor provides undergraduate students with focused training in marine ecology, oceanography, and marine conservation. Students complete courses in marine biology and oceanography while maintaining their primary major.',
      requirements: [
        'Completion of at least 20 units in marine science',
        'Courses in marine biology, oceanography, and marine ecology',
        'Approval by marine science advisor'
      ],
      courses: 20,
      duration: '1-2 years',
      icon: Shell,
      focusAreas: ['Marine Ecology', 'Oceanography', 'Coastal Biology', 'Marine Conservation'],
      careerOutcomes: ['Environmental Manager', 'Naturalist', 'Graduate Student', 'Science Teacher']
    }
  ]

  const courses = [
    { number: 'EEMB 101', title: 'Principles of Ecology', level: 'Undergraduate' },
    { number: 'EEMB 102', title: 'Evolutionary Biology', level: 'Undergraduate' },
    { number: 'EEMB 103', title: 'Marine Biology', level: 'Undergraduate' },
    { number: 'EEMB 104', title: 'Biodiversity and Systematics', level: 'Undergraduate' },
    { number: 'EEMB 507', title: 'Introduction to Graduate Research', level: 'Graduate' },
    { number: 'EEMB 508', title: 'Levels of Biological Organization I', level: 'Graduate' },
    { number: 'EEMB 509', title: 'Levels of Biological Organization II', level: 'Graduate' },
    { number: 'EEMB 201', title: 'Quantitative Ecology', level: 'Graduate' },
    { number: 'EEMB 202', title: 'Population Genetics', level: 'Graduate' },
    { number: 'EEMB 203', title: 'Conservation Biology', level: 'Graduate' },
    { number: 'EEMB 204', title: 'Marine Ecology', level: 'Graduate' },
    { number: 'EEMB 210', title: 'Ecological Field Methods', level: 'Graduate' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Academic Programs</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Comprehensive education in ecology, evolution, and marine biology from the undergraduate to doctoral level.
            </p>
          </div>
        </div>
      </section>

      {/* Graduate Programs Highlight */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="bg-gradient-to-r from-ocean-deep to-ocean-blue rounded-2xl p-8 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block bg-ucsb-gold text-ucsb-navy px-3 py-1 rounded-full text-sm font-bold mb-4">
                  Graduate Programs
                </span>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">PhD & MA Programs</h2>
                <p className="text-white/90 mb-6 leading-relaxed">
                  World-class training in ecology, evolution, and marine biology. Our graduate students work closely
                  with faculty on cutting-edge research from day one, with full funding available.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Full Funding</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">No GRE Required</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm">December 1 Deadline</span>
                </div>
                <Link
                  href="/academics/graduate"
                  className="inline-flex items-center gap-2 bg-ucsb-gold text-ucsb-navy px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 transition-all"
                >
                  Explore Graduate Programs
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-ucsb-gold">40+</p>
                  <p className="text-sm text-white/80">Faculty Mentors</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-ucsb-gold">100+</p>
                  <p className="text-sm text-white/80">Grad Students</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-ucsb-gold">Top 3</p>
                  <p className="text-sm text-white/80">Marine Science</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-ucsb-gold">2</p>
                  <p className="text-sm text-white/80">LTER Sites</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">All Degree Programs</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our variety of undergraduate and graduate programs designed to prepare you for a rewarding career in biological sciences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {programs.map(program => (
              <div
                key={program.id}
                className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div>
                    <program.icon className="w-10 h-10 text-ocean-blue" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        program.degree === 'PhD' ? 'bg-ocean-blue text-white' :
                        program.degree === 'MA' ? 'bg-ocean-teal text-white' :
                        program.degree === 'BS' ? 'bg-ucsb-gold text-ucsb-navy' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {program.degree}
                      </span>
                      <span className="text-xs text-gray-500">{program.duration}</span>
                    </div>
                    <h3 className="text-lg font-bold text-ucsb-navy mb-2 group-hover:text-ocean-blue transition">
                      {program.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {program.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {program.focusAreas.slice(0, 3).map((area, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {area}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      {program.link ? (
                        <Link
                          href={program.link}
                          className="text-sm text-ocean-blue hover:text-ocean-teal font-medium inline-flex items-center gap-1"
                        >
                          Learn More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      ) : (
                        <button
                          onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
                          className="text-sm text-ocean-blue hover:text-ocean-teal font-medium"
                        >
                          {selectedProgram === program.id ? 'Hide Details' : 'View Details'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedProgram === program.id && !program.link && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-gray-700 mb-4 leading-relaxed">{program.fullDescription}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-ucsb-navy mb-2">Requirements</h4>
                        <ul className="space-y-1">
                          {program.requirements.map((req, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-ocean-teal">-</span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-ucsb-navy mb-2">Career Outcomes</h4>
                        <ul className="space-y-1">
                          {program.careerOutcomes.map((outcome, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                              <span className="text-ucsb-gold">-</span>
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-8 text-center">Sample Courses</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ucsb-navy mb-1">{course.number}</p>
                      <p className="text-gray-700">{course.title}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${
                      course.level === 'Graduate'
                        ? 'bg-ocean-blue/10 text-ocean-blue'
                        : 'bg-ucsb-gold/20 text-ucsb-navy'
                    }`}>
                      {course.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Learning Outcomes */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-8 text-center">Student Learning Outcomes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Research Skills',
                description: 'Master field and laboratory techniques for studying ecological and evolutionary processes.',
                icon: Microscope
              },
              {
                title: 'Quantitative Analysis',
                description: 'Develop competency in statistics, modeling, and data analysis for biological research.',
                icon: BarChart3
              },
              {
                title: 'Critical Thinking',
                description: 'Apply scientific reasoning to evaluate evidence and solve complex environmental problems.',
                icon: Lightbulb
              },
              {
                title: 'Communication',
                description: 'Effectively communicate scientific findings to diverse audiences through writing and presentations.',
                icon: FileText
              },
              {
                title: 'Collaboration',
                description: 'Work effectively in research teams and develop professional networks.',
                icon: Handshake
              },
              {
                title: 'Professional Development',
                description: 'Prepare for careers in academia, government, conservation, and industry.',
                icon: Target
              }
            ].map((outcome, idx) => (
              <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition">
                <div className="mb-3">
                  <outcome.icon className="w-8 h-8 text-ocean-blue" />
                </div>
                <h3 className="text-lg font-bold text-ucsb-navy mb-2">{outcome.title}</h3>
                <p className="text-gray-600 text-sm">{outcome.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join our academic community and pursue your passion for understanding the natural world.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/academics/graduate"
              className="bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 hover:shadow-lg transition-all"
            >
              Graduate Programs
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-ocean-blue transition-all"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
