'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Program {
  id: string
  title: string
  degree: string
  description: string
  fullDescription: string
  requirements: string[]
  courses: number
  duration: string
  icon: string
  focusAreas: string[]
  careerOutcomes: string[]
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
        'Completion of core courses in ecology, evolution, and marine biology',
        'Qualifying examination',
        'Original dissertation research',
        'Teaching requirement'
      ],
      courses: 45,
      duration: '5-6 years',
      icon: '🎓',
      focusAreas: ['Marine Conservation', 'Climate Adaptation', 'Evolutionary Biology', 'Behavioral Ecology'],
      careerOutcomes: ['Research Scientist', 'University Professor', 'Conservation Manager', 'Environmental Consultant']
    },
    {
      id: 'ms-marine-biology',
      title: 'MS in Marine Biology',
      degree: 'MS',
      description: 'Master\'s program focused on marine biological research and conservation.',
      fullDescription: 'The MS in Marine Biology provides advanced education in marine ecology, conservation, and research methods. Students engage in field research, laboratory work, and independent research projects. The program offers both thesis and non-thesis options.',
      requirements: [
        'Bachelor\'s degree in biology or related field',
        'Completion of marine biology core courses',
        'Research thesis or comprehensive examination',
        'Minimum 30 units of graduate coursework'
      ],
      courses: 32,
      duration: '2 years',
      icon: '🌊',
      focusAreas: ['Marine Conservation', 'Oceanography', 'Coral Reef Ecology', 'Marine Microbiology'],
      careerOutcomes: ['Marine Biologist', 'Conservation Scientist', 'Environmental Manager', 'Government Researcher']
    },
    {
      id: 'ms-ecology-evolution',
      title: 'MS in Ecology and Evolution',
      degree: 'MS',
      description: 'Master\'s program emphasizing ecological and evolutionary processes.',
      fullDescription: 'This program emphasizes understanding ecological and evolutionary processes across diverse organisms and environments. Students develop strong quantitative skills, engage in field and laboratory research, and prepare for diverse career paths in science.',
      requirements: [
        'Bachelor\'s degree in biology or related field',
        'Coursework in ecology, evolution, and statistics',
        'Research thesis or project',
        'Minimum 30 units of graduate coursework'
      ],
      courses: 32,
      duration: '2 years',
      icon: '🧬',
      focusAreas: ['Population Genetics', 'Ecosystem Ecology', 'Conservation Biology', 'Evolutionary Biology'],
      careerOutcomes: ['Ecologist', 'Conservation Biologist', 'Field Researcher', 'Academic Researcher']
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
      icon: '📚',
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
      icon: '🐚',
      focusAreas: ['Marine Ecology', 'Oceanography', 'Coastal Biology', 'Marine Conservation'],
      careerOutcomes: ['Environmental Manager', 'Naturalist', 'Graduate Student', 'Science Teacher']
    }
  ]

  const courses = [
    { number: 'EEMB 101', title: 'Principles of Ecology', level: 'Undergraduate' },
    { number: 'EEMB 102', title: 'Evolutionary Biology', level: 'Undergraduate' },
    { number: 'EEMB 103', title: 'Marine Biology', level: 'Undergraduate' },
    { number: 'EEMB 104', title: 'Biodiversity and Systematics', level: 'Undergraduate' },
    { number: 'EEMB 200A', title: 'Advanced Ecology Seminar', level: 'Graduate' },
    { number: 'EEMB 200B', title: 'Advanced Evolution Seminar', level: 'Graduate' },
    { number: 'EEMB 201', title: 'Quantitative Ecology', level: 'Graduate' },
    { number: 'EEMB 202', title: 'Population Genetics', level: 'Graduate' },
    { number: 'EEMB 203', title: 'Conservation Biology', level: 'Graduate' },
    { number: 'EEMB 204', title: 'Marine Ecology', level: 'Graduate' },
    { number: 'EEMB 210', title: 'Ecological Field Methods', level: 'Graduate' },
    { number: 'EEMB 220', title: 'Microbial Ecology', level: 'Graduate' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Academic Programs</h1>
            <p className="text-xl md:text-2xl text-white">
              Comprehensive education in ecology, evolution, and marine biology from the undergraduate to doctoral level.
            </p>
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-ucsb-navy mb-4">Degree Programs</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Choose from our variety of undergraduate and graduate programs designed to prepare you for a rewarding career in biological sciences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {programs.map(program => (
              <button
                key={program.id}
                onClick={() => setSelectedProgram(selectedProgram === program.id ? null : program.id)}
                className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all p-8 text-left border-2 border-gray-200 hover:border-ucsb-navy bg-gradient-to-br hover:from-blue-50"
              >
                <div className="text-5xl mb-4">{program.icon}</div>
                <span className="inline-block bg-ucsb-aqua text-white px-3 py-1 rounded-full text-sm font-bold mb-3">
                  {program.degree}
                </span>
                <h3 className="text-xl font-bold text-ucsb-navy mb-3 group-hover:text-ucsb-gold transition">
                  {program.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {program.description}
                </p>
                <div className="text-xs text-gray-500">
                  {program.duration} | {program.courses} units
                </div>
              </button>
            ))}
          </div>

          {/* Detailed View */}
          {selectedProgram && (
            <div className="mt-12 bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-8 border-l-4 border-ucsb-navy">
              {programs.find(p => p.id === selectedProgram) && (
                <div className="max-w-4xl mx-auto">
                  {(() => {
                    const program = programs.find(p => p.id === selectedProgram)!
                    return (
                      <>
                        <div className="flex items-start gap-6 mb-8">
                          <div className="text-6xl">{program.icon}</div>
                          <div className="flex-1">
                            <span className="inline-block bg-ucsb-aqua text-white px-4 py-1 rounded-full text-sm font-bold mb-3">
                              {program.degree}
                            </span>
                            <h3 className="text-3xl font-bold text-ucsb-navy mb-2">{program.title}</h3>
                            <p className="text-lg text-gray-700 mb-4">{program.description}</p>
                            <div className="flex gap-4 flex-wrap">
                              <span className="bg-ucsb-gold text-ucsb-navy px-4 py-2 rounded-full font-semibold">
                                {program.duration}
                              </span>
                              <span className="bg-ucsb-moss text-white px-4 py-2 rounded-full font-semibold">
                                {program.courses} Units
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                          {program.fullDescription}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                          <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                            <h4 className="text-xl font-bold text-ucsb-navy mb-4">Program Requirements</h4>
                            <ul className="space-y-3">
                              {program.requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <span className="text-ucsb-gold font-bold mt-1">✓</span>
                                  <span className="text-gray-700">{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                            <h4 className="text-xl font-bold text-ucsb-navy mb-4">Focus Areas</h4>
                            <div className="space-y-2 mb-6">
                              {program.focusAreas.map((area, idx) => (
                                <span key={idx} className="inline-block bg-blue-100 text-ucsb-navy px-3 py-1 rounded-full text-sm">
                                  {area}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="bg-green-50 rounded-lg p-6 border-l-4 border-ucsb-moss mb-8">
                          <h4 className="text-xl font-bold text-ucsb-navy mb-4">Career Outcomes</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {program.careerOutcomes.map((outcome, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="text-ucsb-moss text-xl">→</span>
                                <span className="text-gray-700">{outcome}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4 flex-wrap">
                          <Link
                            href="/contact"
                            className="bg-ucsb-navy text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                          >
                            Request Information
                          </Link>
                          <button
                            onClick={() => setSelectedProgram(null)}
                            className="bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                          >
                            Close Details
                          </button>
                        </div>
                      </>
                    )
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Course Catalog */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Course Catalog</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course, idx) => (
                <div key={idx} className="bg-gray-50 p-6 rounded-lg border-l-4 border-ucsb-aqua hover:shadow-md transition">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ucsb-navy mb-1">{course.number}</p>
                      <p className="text-lg font-semibold text-gray-800">{course.title}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                      course.level === 'Graduate'
                        ? 'bg-ucsb-coral text-white'
                        : 'bg-ucsb-gold text-ucsb-navy'
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
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-ucsb-navy mb-8 text-center">Student Learning Outcomes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Research Skills',
                description: 'Master field and laboratory techniques for studying ecological and evolutionary processes.'
              },
              {
                title: 'Quantitative Analysis',
                description: 'Develop competency in statistics, modeling, and data analysis for biological research.'
              },
              {
                title: 'Critical Thinking',
                description: 'Apply scientific reasoning to evaluate evidence and solve complex environmental problems.'
              },
              {
                title: 'Communication',
                description: 'Effectively communicate scientific findings to diverse audiences through writing and presentations.'
              },
              {
                title: 'Collaboration',
                description: 'Work effectively in research teams and develop professional networks.'
              },
              {
                title: 'Professional Development',
                description: 'Prepare for careers in academia, government, conservation, and industry.'
              }
            ].map((outcome, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
                <div className="text-4xl mb-4 text-ucsb-gold">★</div>
                <h3 className="text-xl font-bold text-ucsb-navy mb-3">{outcome.title}</h3>
                <p className="text-gray-600">{outcome.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-ucsb-navy to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Apply?</h2>
          <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
            Join our academic community and pursue your passion for understanding the natural world.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition">
              Apply Now
            </button>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-ucsb-navy transition"
            >
              Contact Admissions
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
