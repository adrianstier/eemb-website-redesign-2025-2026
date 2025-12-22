'use client'

import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Scroll } from 'lucide-react'

type TabId = 'overview' | 'phd' | 'ma' | 'apply' | 'funding' | 'faq' | 'resources'

export default function GraduateProgramPage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'phd', label: 'PhD Program' },
    { id: 'ma', label: 'MA Program' },
    { id: 'apply', label: 'How to Apply' },
    { id: 'funding', label: 'Financial Support' },
    { id: 'faq', label: 'FAQs' },
    { id: 'resources', label: 'Resources' },
  ]

  const researchAreas = [
    'Population and community ecology',
    'Ecosystems ecology',
    'Limnology',
    'Biological oceanography',
    'Ecological physiology',
    'Evolution and population genetics',
    'Climate science',
    'Organismal biology',
  ]

  const coreCourses = [
    { code: 'EEMB 507', name: 'Introduction to Graduate Research', term: 'Fall', units: 2 },
    { code: 'EEMB 508', name: 'Levels of Biological Organization I', term: 'Fall', units: 4 },
    { code: 'EEMB 509', name: 'Levels of Biological Organization II', term: 'Winter/Spring', units: 4 },
    { code: 'EEMB 290', name: 'Introduction to Faculty Research', term: 'Winter/Spring', units: 2 },
    { code: 'EEMB 500', name: 'Campus Orientation', term: 'Fall', units: 1 },
    { code: 'EEMB 502', name: 'Teaching Techniques', term: 'Winter', units: 2 },
  ]

  const writtenExamAreas = [
    'Ecology',
    'Behavioral Ecology',
    'Marine Biology',
    'Population Genetics',
    'Physiology',
    'Evolution',
    'Conservation Biology',
    'Ecosystems Ecology',
  ]

  const fellowships = [
    { name: 'Ellen Schamberg Burley Award', description: 'For senior graduate students presenting research at scientific meetings', amount: 'Varies' },
    { name: 'Charles A. Storke Award', description: 'Outstanding students advanced to candidacy', amount: '$2,500' },
    { name: "Chancellor's Fellowship", description: 'Campus-wide competitive fellowship', amount: 'Full support' },
    { name: 'Eugene Cota Robles Fellowship', description: 'For students contributing to diversity', amount: 'Full support' },
    { name: 'Graduate Opportunity Fellowship', description: 'For academically talented students', amount: 'Varies' },
  ]

  const faqs = [
    {
      question: 'What is the application deadline?',
      answer: 'The application deadline is December 1. All application materials must be received by this date for admission and fellowship consideration.',
    },
    {
      question: 'Is the GRE required?',
      answer: 'No. EEMB no longer considers the GRE for admission. We evaluate applicants holistically based on research experience, letters of recommendation, and statements.',
    },
    {
      question: 'Do I need to contact faculty before applying?',
      answer: 'Yes! Applicants must be accepted by a major professor before admission. We strongly encourage you to contact potential faculty mentors early in the application process.',
    },
    {
      question: 'When will I know if I have been accepted?',
      answer: 'Applications are reviewed on an ongoing basis beginning in mid-December. Most admission decisions are finalized by the end of March or early April.',
    },
    {
      question: 'What financial support can I expect?',
      answer: 'Funding is individually dependent on the admitting faculty. Most admitted students receive a combination of teaching assistantships, research assistantships, and fellowships that cover tuition, fees, and provide a living stipend.',
    },
    {
      question: "What's the difference between the Statement of Purpose and Personal History Statement?",
      answer: 'The Statement of Purpose outlines your reasons for the program, area of specialization, and academic goals. The Personal History Statement describes your background, accomplishments, and contributions to campus diversity.',
    },
  ]

  const currentChecklists = [
    {
      name: 'EEMB PhD Graduate Checklist 24-25',
      url: '/documents/graduate/EEMB-PhD-Graduate-Checklist-24-25.pdf',
      size: '171 KB',
      type: 'PhD',
    },
    {
      name: 'EEMB MA Graduate Checklist 24-25',
      url: '/documents/graduate/EEMB-MA-Graduate-Checklist-24-25.pdf',
      size: '183 KB',
      type: 'MA',
    },
  ]

  const handbooks = [
    {
      name: 'PhD Graduate Handbook 2021-22',
      url: '/documents/graduate/PhD-Graduate-Handbook-21-22.pdf',
      size: '340 KB',
      type: 'PhD',
      description: 'Complete guide to PhD program requirements, milestones, and policies',
      current: true,
    },
    {
      name: 'MA Graduate Handbook 2021-22',
      url: '/documents/graduate/MA-Graduate-Handbook-21-22.pdf',
      size: '314 KB',
      type: 'MA',
      description: 'Complete guide to MA program requirements, milestones, and policies',
      current: true,
    },
  ]

  const archivedHandbooks = {
    phd: [
      { year: '2020-21', url: '/documents/graduate/PhD-Graduate-Handbook-20-21.pdf', size: '106 KB' },
      { year: '2019-20', url: '/documents/graduate/PhD-Graduate-Handbook-19-20.pdf', size: '248 KB' },
      { year: '2017-18', url: '/documents/graduate/PhD-Graduate-Handbook-17-18.pdf', size: '630 KB' },
      { year: '2016-17', url: '/documents/graduate/PhD-Graduate-Handbook-16-17.pdf', size: '609 KB' },
      { year: '2015-16', url: '/documents/graduate/PhD-Graduate-Handbook-15-16.pdf', size: '190 KB' },
      { year: '2014-15', url: '/documents/graduate/PhD-Graduate-Handbook-14-15.pdf', size: '59 KB' },
    ],
    ma: [
      { year: '2020-21', url: '/documents/graduate/MA-Graduate-Handbook-20-21.pdf', size: '93 KB' },
      { year: '2019-20', url: '/documents/graduate/MA-Graduate-Handbook-19-20.pdf', size: '291 KB' },
      { year: '2017-18', url: '/documents/graduate/MA-Graduate-Handbook-17-18.pdf', size: '605 KB' },
      { year: '2016-17', url: '/documents/graduate/MA-Graduate-Handbook-16-17.pdf', size: '584 KB' },
      { year: '2015-16', url: '/documents/graduate/MA-Graduate-Handbook-15-16.pdf', size: '44 KB' },
      { year: '2014-15', url: '/documents/graduate/MA-Graduate-Handbook-14-15.pdf', size: '47 KB' },
    ],
  }

  const flowcharts = [
    {
      name: 'PhD Program Flowchart',
      url: '/documents/graduate/PhD-Flowchart-21-22.pdf',
      size: '294 KB',
      type: 'PhD',
    },
    {
      name: 'MA Thesis Track Flowchart',
      url: '/documents/graduate/MA-Thesis-Flowchart-21-22.pdf',
      size: '303 KB',
      type: 'MA',
    },
    {
      name: 'MA Comprehensive Exam Flowchart',
      url: '/documents/graduate/MA-Exam-Flowchart-21-22.pdf',
      size: '307 KB',
      type: 'MA',
    },
  ]

  const resources = [
    {
      name: 'Oral Presentation Rubric',
      url: '/documents/graduate/Oral-Presentation-Rubric.doc',
      size: '52 KB',
    },
    {
      name: 'Progress Report and Study Plan',
      url: '/documents/graduate/Progress-Report-Study-Plan.doc',
      size: '28 KB',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-ocean-deep via-ocean-blue to-ocean-teal text-white py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="max-w-3xl">
            <nav className="text-sm mb-4">
              <Link href="/academics" className="text-white/70 hover:text-white transition-colors">
                Academics
              </Link>
              <span className="mx-2 text-white/50">/</span>
              <span className="text-white">Graduate Program</span>
            </nav>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Graduate Program</h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed">
              Broad, interdisciplinary education leading to the Master of Arts and Doctor of Philosophy degrees
              with emphasis on ecology, evolution, marine biology, and oceanography.
            </p>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-[64px] z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <nav className="flex overflow-x-auto -mb-px" aria-label="Graduate program sections">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-ocean-blue text-ocean-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              {/* Introduction */}
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">World-Class Training in Ecology & Evolution</h2>
                  <div className="prose prose-lg text-gray-700 space-y-4">
                    <p>
                      The Department of Ecology, Evolution and Marine Biology at UC Santa Barbara offers comprehensive
                      graduate training through our PhD and MA programs. Our faculty employ experimental approaches
                      (both field and laboratory-based) as well as modeling approaches to address fundamental questions
                      in the biological sciences.
                    </p>
                    <p>
                      Students have opportunities for field work around the world, engagement in outreach activities,
                      and involvement in teaching. Our location on the California coast provides unparalleled access
                      to diverse marine and terrestrial ecosystems.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-lg font-bold text-ucsb-navy mb-4">Research Specializations</h3>
                  <ul className="space-y-2">
                    {researchAreas.map((area, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <span className="w-2 h-2 bg-ocean-teal rounded-full flex-shrink-0"></span>
                        <span className="text-gray-700">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Degree Options */}
              <div>
                <h2 className="text-2xl font-bold text-ucsb-navy mb-6 text-center">Degree Programs</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setActiveTab('phd')}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-ocean-teal to-ocean-blue rounded-xl flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ucsb-navy mb-2">Doctor of Philosophy (PhD)</h3>
                        <p className="text-gray-600 mb-3">
                          Comprehensive research training preparing students for careers in academia, government, and industry.
                        </p>
                        <div className="flex gap-3 text-sm">
                          <span className="bg-ocean-100 text-ocean-700 px-3 py-1 rounded-full">5-6 years</span>
                          <span className="bg-ocean-100 text-ocean-700 px-3 py-1 rounded-full">Full funding</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setActiveTab('ma')}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-ucsb-gold to-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Scroll className="w-7 h-7 text-ucsb-navy" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-ucsb-navy mb-2">Master of Arts (MA)</h3>
                        <p className="text-gray-600 mb-3">
                          Advanced education with thesis or comprehensive examination options for specialized training.
                        </p>
                        <div className="flex gap-3 text-sm">
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">2 years</span>
                          <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">Thesis or Exam</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Diversity Statement */}
              <div className="bg-gradient-to-r from-ocean-deep to-ocean-blue rounded-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">Commitment to Diversity</h2>
                <p className="text-white/90 leading-relaxed mb-6">
                  EEMB encourages applications from underrepresented groups in the biological sciences,
                  as well as military veterans, and students with disabilities. We are committed to building
                  a diverse and inclusive community of scholars.
                </p>
                <Link
                  href="/dei"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Learn about our DEI initiatives
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>

              {/* Contact */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Graduate Program Contact</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-ocean-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-ocean-teal" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Graduate Advisor</p>
                      <p className="text-gray-600">Hillary Young</p>
                      <p className="text-sm text-gray-500">Vice Chair, Resources</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-ocean-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-ocean-teal" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Email</p>
                      <a href="mailto:info@eemb.ucsb.edu" className="text-ocean-blue hover:text-ocean-teal transition-colors">
                        info@eemb.ucsb.edu
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-ocean-teal/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-ocean-teal" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Phone</p>
                      <a href="tel:+18058932974" className="text-ocean-blue hover:text-ocean-teal transition-colors">
                        (805) 893-2974
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PhD Program Tab */}
          {activeTab === 'phd' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">Doctor of Philosophy (PhD)</h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                  Our PhD program provides comprehensive training in ecology, evolution, and marine biology through
                  coursework, seminars, and original research. Students work with leading faculty mentors and develop
                  expertise in specific fields while maintaining broad understanding of the discipline.
                </p>
              </div>

              {/* Timeline Overview */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-6">Program Timeline</h3>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ocean-teal via-ocean-blue to-ocean-deep"></div>
                  <div className="space-y-8">
                    {[
                      { year: 'Year 1', title: 'Foundation Building', items: ['Complete core courses (EEMB 507, 508, 509)', 'Form doctoral committee', 'Begin TA training (EEMB 500, 502)', 'Rotate through research groups'] },
                      { year: 'Year 2', title: 'Written Examinations', items: ['Complete two written field examinations', 'Continue coursework as needed', 'Begin independent research', 'Complete TA requirements'] },
                      { year: 'Year 3', title: 'Oral Examination & Candidacy', items: ['Pass oral examination (dissertation proposal)', 'Advance to candidacy', 'Non-resident tuition waived (3 years)', 'Full-time research begins'] },
                      { year: 'Years 4-6', title: 'Dissertation Research', items: ['Conduct original research', 'Regular committee meetings', 'Present at conferences', 'Write and defend dissertation'] },
                    ].map((phase, index) => (
                      <div key={index} className="relative pl-12">
                        <div className="absolute left-0 w-8 h-8 bg-white border-4 border-ocean-blue rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-ocean-blue">{index + 1}</span>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="bg-ocean-blue text-white text-xs font-bold px-2 py-1 rounded">{phase.year}</span>
                            <h4 className="font-bold text-ucsb-navy">{phase.title}</h4>
                          </div>
                          <ul className="grid md:grid-cols-2 gap-1">
                            {phase.items.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                                <span className="text-ocean-teal mt-1">-</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Requirements */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-ucsb-navy mb-4">Core Coursework</h3>
                  <p className="text-gray-600 mb-4 text-sm">Required courses in the first year:</p>
                  <div className="space-y-3">
                    {coreCourses.map((course, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                        <div>
                          <p className="font-semibold text-ucsb-navy text-sm">{course.code}</p>
                          <p className="text-gray-600 text-sm">{course.name}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500">{course.term}</span>
                          <p className="text-sm font-medium text-ocean-blue">{course.units} units</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-ucsb-navy mb-4">Written Examination Areas</h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    Students select two fields: one in ecology/evolution, and one related to their research.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {writtenExamAreas.map((area, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700">
                        {area}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Committee & Examinations */}
              <div className="bg-gradient-to-br from-ocean-50 to-white rounded-xl p-6 border border-ocean-200">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Committee Requirements</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Composition</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>- Minimum 3 UC ladder faculty</li>
                      <li>- 2 must be in EEMB (including Chair)</li>
                      <li>- Form during first year</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Written Exams</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>- Complete within 2 years</li>
                      <li>- One retake allowed</li>
                      <li>- Dismissal after 4 years if incomplete</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Oral Exam</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>- Within 3 years of enrollment</li>
                      <li>- Dissertation proposal presentation</li>
                      <li>- Passing advances to candidacy</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Time Limits */}
              <div className="bg-ucsb-coral/10 border border-ucsb-coral/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Important Time Limits</h3>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-ocean-blue">6</p>
                    <p className="text-sm text-gray-600">Normative time (years)</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-ucsb-gold">7</p>
                    <p className="text-sm text-gray-600">Requires petition</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-orange-500">8</p>
                    <p className="text-sm text-gray-600">Must prove currency</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-ucsb-coral">10</p>
                    <p className="text-sm text-gray-600">Maximum (dismissal)</p>
                  </div>
                </div>
              </div>

              {/* Teaching Requirement */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Teaching Requirement</h3>
                <p className="text-gray-700 mb-4">
                  All PhD students must complete the equivalent of two quarters as a teaching assistant.
                  This includes completing EEMB 502 (Teaching Techniques) before your first TA assignment.
                </p>
                <div className="bg-ocean-teal/10 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <strong>Note:</strong> TAships at 25% or more provide partial fee remission covering tuition,
                    student service fees, and UC-SHIP health insurance.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* MA Program Tab */}
          {activeTab === 'ma' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">Master of Arts (MA)</h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                  The MA program offers advanced education in ecology, evolution, and marine biology with
                  two distinct pathways: a thesis option for those pursuing research careers, or a
                  comprehensive examination option for those seeking advanced professional training.
                </p>
              </div>

              {/* Plan Options */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-ocean-teal to-ocean-blue p-4">
                    <h3 className="text-xl font-bold text-white">Plan I: Thesis</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      Research-focused pathway culminating in an original thesis project.
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ocean-teal font-bold">-</span>
                        Minimum 30 units required
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ocean-teal font-bold">-</span>
                        At least 20 units in 200/500 series courses
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ocean-teal font-bold">-</span>
                        Up to 10 units of EEMB 596 (thesis research)
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ocean-teal font-bold">-</span>
                        Original thesis required
                      </li>
                    </ul>
                    <div className="bg-ocean-teal/10 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Best for:</strong> Students planning PhD programs or research careers
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-ucsb-gold to-orange-400 p-4">
                    <h3 className="text-xl font-bold text-ucsb-navy">Plan II: Comprehensive Exam</h3>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      Coursework-intensive pathway with comprehensive examination.
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ucsb-gold font-bold">-</span>
                        Minimum 36 units required
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ucsb-gold font-bold">-</span>
                        At least 24 units in 200/500 series courses
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ucsb-gold font-bold">-</span>
                        Up to 12 units of EEMB 596 (independent study)
                      </li>
                      <li className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-ucsb-gold font-bold">-</span>
                        Comprehensive examination required
                      </li>
                    </ul>
                    <div className="bg-yellow-100 rounded-lg p-3">
                      <p className="text-sm text-gray-700">
                        <strong>Best for:</strong> Professional careers in conservation, education, or industry
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Requirements */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Core Course Requirements</h3>
                <p className="text-gray-600 mb-4">All incoming MA students must complete these courses in their first year:</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {coreCourses.map((course, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="font-semibold text-ucsb-navy">{course.code}</p>
                      <p className="text-sm text-gray-600">{course.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{course.term} - {course.units} units</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Committee & Timeline */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-ocean-50 to-white rounded-xl p-6 border border-ocean-200">
                  <h3 className="text-xl font-bold text-ucsb-navy mb-4">Committee Requirements</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-ocean-teal font-bold">-</span>
                      Minimum 3 UC ladder faculty
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-ocean-teal font-bold">-</span>
                      2 must be in EEMB (including Chair)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-ocean-teal font-bold">-</span>
                      Form committee during first year
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-ocean-teal font-bold">-</span>
                      Meet regularly to track progress
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-ucsb-navy mb-4">Teaching Requirement</h3>
                  <p className="text-gray-700 mb-4">
                    All MA students must complete the equivalent of two quarters as a teaching assistant.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-ocean-blue rounded-full"></span>
                      <span className="text-sm text-gray-600">EEMB 500: Campus Orientation (Fall, 1 unit)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-ocean-blue rounded-full"></span>
                      <span className="text-sm text-gray-600">EEMB 502: Teaching Techniques (Winter, 2 units)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exam Areas */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Comprehensive Exam Areas (Plan II)</h3>
                <p className="text-gray-600 mb-4">
                  Students select major and minor emphasis areas from the following options:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    'Ecology', 'Behavioral Ecology', 'Marine Biology', 'Population Genetics',
                    'Physiology', 'Evolution', 'Conservation Biology', 'Ecosystems Ecology',
                    'Limnology', 'Oceanography', 'Organismal Biology', 'Climate Science',
                    'Community Ecology', 'Evolutionary Ecology', 'Microbial Ecology', 'Biogeography'
                  ].map((area, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg px-3 py-2 text-sm text-gray-700 text-center">
                      {area}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Application Tab */}
          {activeTab === 'apply' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">How to Apply</h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                  We welcome applications from students with strong academic records and research interests
                  aligned with our faculty. The application process requires careful preparation and early
                  communication with potential faculty mentors.
                </p>
              </div>

              {/* Important Alert */}
              <div className="bg-ucsb-coral/10 border-l-4 border-ucsb-coral rounded-r-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-ucsb-coral rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-ucsb-navy mb-2">Critical Requirement</h3>
                    <p className="text-gray-700">
                      <strong>Applicants must be accepted by a faculty sponsor before admission.</strong> We strongly
                      encourage you to contact potential faculty mentors early in the application process. Review
                      faculty research interests and reach out to discuss potential fit.
                    </p>
                    <Link href="/people" className="inline-flex items-center gap-2 text-ocean-blue hover:text-ocean-teal mt-3 font-medium">
                      Browse Faculty Profiles
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Deadlines */}
              <div className="bg-gradient-to-r from-ocean-deep to-ocean-blue rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Key Deadlines</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-ucsb-gold">Dec 1</p>
                    <p className="text-white/90 mt-2">Application Deadline</p>
                    <p className="text-sm text-white/70">All materials must be received</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-ucsb-gold">Nov 15</p>
                    <p className="text-white/90 mt-2">Fee Waiver Deadline</p>
                    <p className="text-sm text-white/70">2 weeks before application</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold text-ucsb-gold">Apr 15</p>
                    <p className="text-white/90 mt-2">Statement of Intent</p>
                    <p className="text-sm text-white/70">Financial deadline</p>
                  </div>
                </div>
              </div>

              {/* Requirements Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-ucsb-navy mb-4">Academic Requirements</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-ocean-teal text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">1</span>
                      <div>
                        <p className="font-semibold text-gray-800">Bachelor's Degree</p>
                        <p className="text-sm text-gray-600">In biology or related field</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-ocean-teal text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">2</span>
                      <div>
                        <p className="font-semibold text-gray-800">GPA Requirement</p>
                        <p className="text-sm text-gray-600">Recommended overall GPA of 3.0 or better</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-ocean-teal text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">3</span>
                      <div>
                        <p className="font-semibold text-gray-800">Prerequisite Coursework</p>
                        <p className="text-sm text-gray-600">Basic biology, chemistry, physics, and math courses</p>
                      </div>
                    </li>
                  </ul>
                  <div className="mt-4 bg-green-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>GRE Policy:</strong> EEMB no longer considers the GRE for admission.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-ucsb-navy mb-4">Application Materials</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-ocean-teal">-</span>
                      <div>
                        <p className="font-semibold text-gray-800">Official Transcripts</p>
                        <p className="text-sm text-gray-600">Scanned with watermark/seal from all institutions (12+ units)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-ocean-teal">-</span>
                      <div>
                        <p className="font-semibold text-gray-800">Letters of Recommendation (3)</p>
                        <p className="text-sm text-gray-600">From individuals familiar with your academic potential</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-ocean-teal">-</span>
                      <div>
                        <p className="font-semibold text-gray-800">Statement of Purpose</p>
                        <p className="text-sm text-gray-600">Max 2 pages: reasons, research experience, faculty interests</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-ocean-teal">-</span>
                      <div>
                        <p className="font-semibold text-gray-800">Personal History Statement</p>
                        <p className="text-sm text-gray-600">Min 250 words: background, accomplishments, contributions</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-ocean-teal">-</span>
                      <div>
                        <p className="font-semibold text-gray-800">Resume/CV</p>
                        <p className="text-sm text-gray-600">Max 2 pages recommended</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* International Students */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">International Student Requirements</h3>
                <p className="text-gray-600 mb-4">Non-native English speakers must demonstrate English proficiency:</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-ocean-blue">80+</p>
                    <p className="text-sm text-gray-600">TOEFL (internet-based)</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-ocean-blue">7+</p>
                    <p className="text-sm text-gray-600">IELTS (overall band score)</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold text-ocean-blue">120+</p>
                    <p className="text-sm text-gray-600">Duolingo English Test</p>
                  </div>
                </div>
              </div>

              {/* Apply Button */}
              <div className="text-center">
                <a
                  href="https://www.graddiv.ucsb.edu/admissions/how-to-apply"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-ucsb-gold text-ucsb-navy px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-400 hover:shadow-lg transition-all"
                >
                  Apply Now on Graduate Division
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          )}

          {/* Funding Tab */}
          {activeTab === 'funding' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">Financial Support</h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                  Most admitted students receive a combination of teaching assistantships, research assistantships,
                  and fellowships that cover tuition, fees, and provide a living stipend. Funding is individually
                  dependent on the admitting faculty.
                </p>
              </div>

              {/* Main Funding Types */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-ocean-teal to-ocean-blue p-4">
                    <h3 className="text-xl font-bold text-white">Teaching Assistantships (TA)</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-ocean-teal font-bold">-</span>
                        <p className="text-gray-700">Monthly salary based on appointment percentage</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-ocean-teal font-bold">-</span>
                        <p className="text-gray-700">25%+ appointment provides partial fee remission</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-ocean-teal font-bold">-</span>
                        <p className="text-gray-700">Covers: Tuition, Student Service Fee, UC-SHIP</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-ocean-teal font-bold">-</span>
                        <p className="text-gray-700">All students required to TA at least 2 quarters</p>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-ucsb-gold to-orange-400 p-4">
                    <h3 className="text-xl font-bold text-ucsb-navy">Graduate Student Research (GSR)</h3>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <span className="text-ucsb-gold font-bold">-</span>
                        <p className="text-gray-700">Grant-funded positions arranged by faculty/PI</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-ucsb-gold font-bold">-</span>
                        <p className="text-gray-700">35%+ appointment: Full fee remission</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-ucsb-gold font-bold">-</span>
                        <p className="text-gray-700">Covers: Tuition, fees, UC-SHIP, non-resident tuition</p>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-ucsb-gold font-bold">-</span>
                        <p className="text-gray-700">24-35% appointment: Partial fee remission</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Fellowships */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-6">Fellowships & Awards</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {fellowships.map((fellowship, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-ucsb-navy mb-2">{fellowship.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{fellowship.description}</p>
                      <span className="inline-block bg-ucsb-gold/20 text-ucsb-gold px-2 py-1 rounded text-sm font-semibold">
                        {fellowship.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* External Funding */}
              <div className="bg-gradient-to-br from-ocean-50 to-white rounded-xl p-6 border border-ocean-200">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">External Funding Opportunities</h3>
                <p className="text-gray-600 mb-4">
                  Students are strongly encouraged to apply for external fellowships. These prestigious awards
                  provide additional support and are highly valued by employers and academic institutions.
                </p>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    { name: 'NSF Graduate Research Fellowship', url: 'https://www.nsfgrfp.org/' },
                    { name: 'Ford Foundation Fellowship', url: 'https://sites.nationalacademies.org/PGA/FordFellowships/' },
                    { name: 'Fulbright Fellowship', url: 'https://us.fulbrightonline.org/' },
                    { name: 'NOAA/Sea Grant Fellowships', url: 'https://seagrant.noaa.gov/Fellowships' },
                  ].map((fund, index) => (
                    <a
                      key={index}
                      href={fund.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <span className="text-ocean-blue">{fund.name}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Block Grants */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Block Grants</h3>
                <p className="text-gray-700 mb-4">
                  The department has block grant funds available for continuing student support, including:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-ocean-teal/10 rounded-lg p-4 text-center">
                    <p className="font-semibold text-ucsb-navy">Quarterly Fellowship Support</p>
                    <p className="text-sm text-gray-600">Bridge funding between appointments</p>
                  </div>
                  <div className="bg-ocean-teal/10 rounded-lg p-4 text-center">
                    <p className="font-semibold text-ucsb-navy">Summer Stipends</p>
                    <p className="text-sm text-gray-600">Research support during summer</p>
                  </div>
                  <div className="bg-ocean-teal/10 rounded-lg p-4 text-center">
                    <p className="font-semibold text-ucsb-navy">Travel Funding</p>
                    <p className="text-sm text-gray-600">Conference presentation support</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">Frequently Asked Questions</h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                  Find answers to common questions about our graduate program, application process, and student life.
                </p>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-ucsb-navy mb-3 flex items-start gap-3">
                        <span className="w-8 h-8 bg-ocean-teal text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm">
                          Q
                        </span>
                        {faq.question}
                      </h3>
                      <div className="pl-11">
                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* More Help */}
              <div className="bg-gradient-to-r from-ocean-deep to-ocean-blue rounded-xl p-6 text-white text-center">
                <h3 className="text-xl font-bold mb-3">Still Have Questions?</h3>
                <p className="text-white/90 mb-4">
                  Contact our graduate program staff for additional information.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  <a
                    href="mailto:info@eemb.ucsb.edu"
                    className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                    </svg>
                    Email Us
                  </a>
                  <a
                    href="https://www.graddiv.ucsb.edu/admissions/faq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-ucsb-gold text-ucsb-navy px-6 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
                  >
                    Graduate Division FAQ
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-ucsb-navy mb-4">Graduate Resources</h2>
                <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
                  Download program checklists, handbooks, flowcharts, and forms to help guide your graduate journey.
                </p>
              </div>

              {/* Current Checklists */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Current Graduate Checklists (2024-25)</h3>
                <p className="text-gray-600 mb-4 text-sm">Interactive checklists to track your progress through the program.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentChecklists.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      download
                      className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
                    >
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        doc.type === 'PhD' ? 'bg-ocean-blue/10' : 'bg-ocean-teal/10'
                      }`}>
                        <svg className={`w-6 h-6 ${doc.type === 'PhD' ? 'text-ocean-blue' : 'text-ocean-teal'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-ucsb-navy group-hover:text-ocean-blue transition-colors">{doc.name}</p>
                        <p className="text-sm text-gray-500">PDF - {doc.size}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-ocean-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Graduate Handbooks */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Current Graduate Handbooks</h3>
                <p className="text-gray-600 mb-4 text-sm">Comprehensive guides to program requirements, policies, and milestones.</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {handbooks.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      download
                      className="flex items-start gap-4 bg-gradient-to-br from-gray-50 to-white rounded-lg p-5 border border-gray-100 hover:shadow-md transition-all group"
                    >
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        doc.type === 'PhD' ? 'bg-ocean-blue text-white' : 'bg-ocean-teal text-white'
                      }`}>
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                            doc.type === 'PhD' ? 'bg-ocean-blue/10 text-ocean-blue' : 'bg-ocean-teal/10 text-ocean-teal'
                          }`}>
                            {doc.type}
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded bg-ucsb-gold/20 text-ucsb-gold">
                            Current
                          </span>
                        </div>
                        <p className="font-semibold text-ucsb-navy group-hover:text-ocean-blue transition-colors">{doc.name}</p>
                        <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                        <p className="text-xs text-gray-400 mt-2">PDF - {doc.size}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Archived Handbooks */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Archived Graduate Handbooks</h3>
                <p className="text-gray-600 mb-4 text-sm">Previous versions of the graduate handbooks for reference.</p>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* PhD Archives */}
                  <div>
                    <h4 className="font-semibold text-ocean-blue mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                      </svg>
                      PhD Handbooks
                    </h4>
                    <div className="space-y-2">
                      {archivedHandbooks.phd.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          download
                          className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors group"
                        >
                          <span className="text-sm text-gray-700 group-hover:text-ocean-blue transition-colors">
                            {doc.year}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{doc.size}</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-ocean-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                  {/* MA Archives */}
                  <div>
                    <h4 className="font-semibold text-ocean-teal mb-3 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
                      </svg>
                      MA Handbooks
                    </h4>
                    <div className="space-y-2">
                      {archivedHandbooks.ma.map((doc, index) => (
                        <a
                          key={index}
                          href={doc.url}
                          download
                          className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2 hover:bg-gray-100 transition-colors group"
                        >
                          <span className="text-sm text-gray-700 group-hover:text-ocean-teal transition-colors">
                            {doc.year}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{doc.size}</span>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-ocean-teal transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Program Flowcharts */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Program Flowcharts</h3>
                <p className="text-gray-600 mb-4 text-sm">Visual guides showing the timeline and milestones for each degree track.</p>
                <div className="grid md:grid-cols-3 gap-4">
                  {flowcharts.map((doc, index) => (
                    <a
                      key={index}
                      href={doc.url}
                      download
                      className="flex flex-col items-center text-center bg-gray-50 rounded-lg p-5 hover:bg-gray-100 transition-colors group"
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                        doc.type === 'PhD' ? 'bg-ocean-blue/10' : 'bg-ocean-teal/10'
                      }`}>
                        <svg className={`w-8 h-8 ${doc.type === 'PhD' ? 'text-ocean-blue' : 'text-ocean-teal'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                        </svg>
                      </div>
                      <p className="font-semibold text-ucsb-navy group-hover:text-ocean-blue transition-colors text-sm">{doc.name}</p>
                      <p className="text-xs text-gray-500 mt-1">PDF - {doc.size}</p>
                    </a>
                  ))}
                </div>
              </div>

              {/* Additional Forms */}
              <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Additional Forms & Documents</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      download
                      className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors group"
                    >
                      <div className="w-12 h-12 bg-ucsb-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-ucsb-gold" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-ucsb-navy group-hover:text-ocean-blue transition-colors">{resource.name}</p>
                        <p className="text-sm text-gray-500">DOC - {resource.size}</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-ocean-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* External Resources */}
              <div className="bg-gradient-to-br from-ocean-50 to-white rounded-xl p-6 border border-ocean-200">
                <h3 className="text-xl font-bold text-ucsb-navy mb-4">Campus Resources</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { name: 'Graduate Division', url: 'https://www.graddiv.ucsb.edu/' },
                    { name: 'Graduate Student Association', url: 'https://gsa.ucsb.edu/' },
                    { name: 'Academic Services', url: 'https://www.graddiv.ucsb.edu/academic' },
                    { name: 'Financial Support', url: 'https://www.graddiv.ucsb.edu/financial' },
                    { name: 'Student Health', url: 'https://studenthealth.sa.ucsb.edu/' },
                    { name: 'Career Services', url: 'https://career.sa.ucsb.edu/' },
                  ].map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 bg-white rounded-lg p-3 hover:shadow-md transition-shadow"
                    >
                      <span className="text-ocean-blue hover:text-ocean-teal transition-colors">{link.name}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-ocean-deep to-ocean-blue">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Join EEMB?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Take the next step in your academic journey. Contact potential faculty mentors and start your application.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/people"
              className="bg-ucsb-gold text-ucsb-navy px-8 py-3 rounded-lg font-bold hover:bg-yellow-400 hover:shadow-lg transition-all"
            >
              Browse Faculty
            </Link>
            <a
              href="https://www.graddiv.ucsb.edu/admissions/how-to-apply"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 border-2 border-white/60 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 hover:border-white transition-all"
            >
              Apply Now
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
