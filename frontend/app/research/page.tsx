import Image from 'next/image'
import Link from 'next/link'
import WaveDivider from '@/components/ui/WaveDivider'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import ResearchThemeAccordion from '@/components/research/ResearchThemeAccordion'
import type { ResearchThemeData } from '@/components/research/ResearchThemeAccordion'
import { getAllResearchAreasWithFaculty, getFacultyCount, getStudentCount } from '@/lib/data/research'

// Supplementary display data keyed by slug — enriches DB records with UI-specific fields
// (subtitles, questions, images, colors) that aren't stored in the research_areas table
const themeDisplayData: Record<string, {
  subtitle: string
  questions: string[]
  image: string
  color: string
  facultyFocusMap?: Record<string, string>
}> = {
  'marine-ecosystems': {
    subtitle: 'From kelp forests to coral reefs',
    questions: [
      'How do herbivores and predators structure coral reef communities?',
      'What mechanisms control diversity and function in marine plankton?',
      'How will ocean acidification affect marine organisms?',
      'Can sustainable aquaculture help feed a growing world?',
    ],
    image: '/images/about/marine-reef.jpg',
    color: 'ocean-teal',
    facultyFocusMap: {
      'burkepile': 'Coral reef ecology & herbivory',
      'hofmann': 'Ocean acidification & physiology',
      'mccauley': 'Marine megafauna & conservation',
      'froehlich': 'Sustainable aquaculture',
      'iglesias-rodriguez': 'Phytoplankton & ocean carbon',
      'thurber': 'Deep-sea & Antarctic ecology',
    },
  },
  'terrestrial-ecology': {
    subtitle: 'Plants, fire, and ecosystem change',
    questions: [
      'How do invasive species transform native ecosystems?',
      'What drives vegetation dynamics in fire-prone landscapes?',
      'How do plants and microbes interact to cycle nutrients?',
      'Can we restore degraded ecosystems to health?',
    ],
    image: '/images/about/campus-lagoon.jpg',
    color: 'kelp-500',
    facultyFocusMap: {
      'dantonio': 'Invasion biology & restoration',
      'anderegg': 'Plant drought physiology',
      'schimel': 'Soil microbial ecology',
      'zhou': 'Savanna carbon dynamics',
      'thellman': 'Freshwater ecosystem change',
    },
  },
  'evolution-genetics': {
    subtitle: 'How life diversifies and adapts',
    questions: [
      'How do flowers evolve to attract different pollinators?',
      'What genetic changes underlie the evolution of complex traits?',
      'How do genomes and organelles coevolve?',
      'What drives speciation and adaptive radiation?',
    ],
    image: '/images/about/evolution-flower.jpg',
    color: 'ucsb-gold',
    facultyFocusMap: {
      'hodges': 'Flower evolution in Aquilegia',
      'oakley': 'Bioluminescence & eye evolution',
      'mazer': 'Plant evolutionary ecology',
      'sharbrough': 'Cytonuclear coevolution',
      'martinez-gomez': 'Plant macroevolution',
      'yi': 'Epigenetics & genome evolution',
    },
  },
  'disease-ecology': {
    subtitle: 'Pathogens in populations and ecosystems',
    questions: [
      'Why do some populations collapse from disease while others persist?',
      'How do parasites influence ecosystem structure and function?',
      'What environmental factors drive disease emergence?',
      'Can we predict and prevent wildlife disease outbreaks?',
    ],
    image: '/images/about/kelp-banner.jpg',
    color: 'ucsb-coral',
    facultyFocusMap: {
      'briggs': 'Amphibian disease dynamics',
      'kuris': 'Parasite ecology',
      'young': 'Zoonotic disease & defaunation',
      'vega-thurber': 'Coral microbiome & disease',
    },
  },
  'microbial-ecology': {
    subtitle: 'The hidden majority of life',
    questions: [
      'How do microbial communities assemble and function?',
      'What controls nitrogen cycling in the ocean?',
      'How do plant-microbe symbioses evolve?',
      'What role do viruses play in ecosystem processes?',
    ],
    image: '/images/about/ucsb-aerial.jpg',
    color: 'ocean-blue',
    facultyFocusMap: {
      'santoro': 'Marine nitrogen cycling',
      'wilbanks': 'Sulfur bacteria metabolism',
      'oono': 'Plant-fungal symbioses',
      'shay': 'Microbial community ecology',
    },
  },
}

// Hardcoded fallback data — used when the research_areas table is empty
const fallbackResearchThemes: ResearchThemeData[] = [
  {
    id: 'marine-ecosystems',
    title: 'Marine Ecosystems',
    subtitle: 'From kelp forests to coral reefs',
    description: 'Our marine ecologists study the complex dynamics of ocean ecosystems\u2014from California kelp forests to tropical coral reefs in Moorea. We investigate how herbivory, productivity, and climate change shape these vital habitats.',
    questions: [
      'How do herbivores and predators structure coral reef communities?',
      'What mechanisms control diversity and function in marine plankton?',
      'How will ocean acidification affect marine organisms?',
      'Can sustainable aquaculture help feed a growing world?',
    ],
    image: '/images/about/marine-reef.jpg',
    color: 'ocean-teal',
    faculty: [
      { name: 'Deron Burkepile', focus: 'Coral reef ecology & herbivory', slug: 'burkepile' },
      { name: 'Gretchen Hofmann', focus: 'Ocean acidification & physiology', slug: 'hofmann' },
      { name: 'Douglas McCauley', focus: 'Marine megafauna & conservation', slug: 'mccauley' },
      { name: 'Halley Froehlich', focus: 'Sustainable aquaculture', slug: 'froehlich' },
      { name: 'D\u00e9bora Iglesias-Rodriguez', focus: 'Phytoplankton & ocean carbon', slug: 'iglesias-rodriguez' },
      { name: 'Andrew Thurber', focus: 'Deep-sea & Antarctic ecology', slug: 'thurber' },
    ],
  },
  {
    id: 'terrestrial-ecology',
    title: 'Terrestrial Ecology',
    subtitle: 'Plants, fire, and ecosystem change',
    description: 'From California chaparral to African savannas to Arctic tundra, we study how plant communities respond to disturbance, invasion, and global change. Our work spans biogeochemistry, restoration ecology, and ecosystem dynamics.',
    questions: [
      'How do invasive species transform native ecosystems?',
      'What drives vegetation dynamics in fire-prone landscapes?',
      'How do plants and microbes interact to cycle nutrients?',
      'Can we restore degraded ecosystems to health?',
    ],
    image: '/images/about/campus-lagoon.jpg',
    color: 'kelp-500',
    faculty: [
      { name: "Carla D'Antonio", focus: 'Invasion biology & restoration', slug: 'dantonio' },
      { name: 'Leander Anderegg', focus: 'Plant drought physiology', slug: 'anderegg' },
      { name: 'Joshua Schimel', focus: 'Soil microbial ecology', slug: 'schimel' },
      { name: 'Yong Zhou', focus: 'Savanna carbon dynamics', slug: 'zhou' },
      { name: 'Audrey Thellman', focus: 'Freshwater ecosystem change', slug: 'thellman' },
    ],
  },
  {
    id: 'evolution-genetics',
    title: 'Evolution & Genetics',
    subtitle: 'How life diversifies and adapts',
    description: 'We investigate evolutionary processes from molecular to macroevolutionary scales. Our faculty study plant speciation, animal bioluminescence, genome evolution, and the genetic basis of adaptation.',
    questions: [
      'How do flowers evolve to attract different pollinators?',
      'What genetic changes underlie the evolution of complex traits?',
      'How do genomes and organelles coevolve?',
      'What drives speciation and adaptive radiation?',
    ],
    image: '/images/about/evolution-flower.jpg',
    color: 'ucsb-gold',
    faculty: [
      { name: 'Scott Hodges', focus: 'Flower evolution in Aquilegia', slug: 'hodges' },
      { name: 'Todd Oakley', focus: 'Bioluminescence & eye evolution', slug: 'oakley' },
      { name: 'Susan Mazer', focus: 'Plant evolutionary ecology', slug: 'mazer' },
      { name: 'Joel Sharbrough', focus: 'Cytonuclear coevolution', slug: 'sharbrough' },
      { name: 'Jes\u00fas Mart\u00ednez-G\u00f3mez', focus: 'Plant macroevolution', slug: 'martinez-gomez' },
      { name: 'Soojin Yi', focus: 'Epigenetics & genome evolution', slug: 'yi' },
    ],
  },
  {
    id: 'disease-ecology',
    title: 'Disease Ecology',
    subtitle: 'Pathogens in populations and ecosystems',
    description: 'We study how diseases spread through populations, how parasites structure communities, and how environmental change affects disease dynamics\u2014from amphibian chytrid to zoonotic spillover.',
    questions: [
      'Why do some populations collapse from disease while others persist?',
      'How do parasites influence ecosystem structure and function?',
      'What environmental factors drive disease emergence?',
      'Can we predict and prevent wildlife disease outbreaks?',
    ],
    image: '/images/about/kelp-banner.jpg',
    color: 'ucsb-coral',
    faculty: [
      { name: 'Cherie Briggs', focus: 'Amphibian disease dynamics', slug: 'briggs' },
      { name: 'Armand Kuris', focus: 'Parasite ecology', slug: 'kuris' },
      { name: 'Hillary Young', focus: 'Zoonotic disease & defaunation', slug: 'young' },
      { name: 'Rebecca Vega Thurber', focus: 'Coral microbiome & disease', slug: 'vega-thurber' },
    ],
  },
  {
    id: 'microbial-ecology',
    title: 'Microbial Ecology',
    subtitle: 'The hidden majority of life',
    description: 'Microbes drive global biogeochemical cycles and form intimate partnerships with plants and animals. We study microbial communities from the open ocean to forest soils to the guts of animals.',
    questions: [
      'How do microbial communities assemble and function?',
      'What controls nitrogen cycling in the ocean?',
      'How do plant-microbe symbioses evolve?',
      'What role do viruses play in ecosystem processes?',
    ],
    image: '/images/about/ucsb-aerial.jpg',
    color: 'ocean-blue',
    faculty: [
      { name: 'Alyson Santoro', focus: 'Marine nitrogen cycling', slug: 'santoro' },
      { name: 'Lizzy Wilbanks', focus: 'Sulfur bacteria metabolism', slug: 'wilbanks' },
      { name: 'Ryoko Oono', focus: 'Plant-fungal symbioses', slug: 'oono' },
      { name: 'Jackie Shay', focus: 'Microbial community ecology', slug: 'shay' },
    ],
  },
]

// Hardcoded research highlights
const fallbackResearchHighlights = [
  {
    title: 'Understanding Amphibian Declines',
    description: 'Dr. Briggs combines mathematical modeling with field studies to understand why some frog populations collapse from chytrid fungus while others persist.',
    faculty: 'Cherie Briggs',
    theme: 'Disease Ecology',
  },
  {
    title: 'Coral Reefs Under Pressure',
    description: 'The Burkepile Lab studies how herbivorous fish maintain coral reef health, working in California, the Caribbean, and our Moorea research station.',
    faculty: 'Deron Burkepile',
    theme: 'Marine Ecosystems',
  },
  {
    title: 'The Evolution of Flower Form',
    description: 'Using Aquilegia (columbine) as a model system, we investigate how pollinators drive the evolution of floral diversity and speciation.',
    faculty: 'Scott Hodges',
    theme: 'Evolution & Genetics',
  },
  {
    title: 'Deep-Sea Methane Seeps',
    description: 'Dr. Thurber explores the strange ecosystems that thrive at methane seeps, from Antarctic shelf to the deep Pacific, where microbes and invertebrates form the base of food webs.',
    faculty: 'Andrew Thurber',
    theme: 'Marine Ecosystems',
  },
]

// Long-term ecological research sites (stable data, not in DB)
const lterSites = [
  {
    name: 'Santa Barbara Coastal LTER',
    description: "Since 2000, we've studied how climate variability, ocean processes, and human activities shape Southern California coastal ecosystems\u2014from giant kelp forests to sandy beaches.",
    image: '/images/about/kelp-banner.jpg',
    link: 'https://sbclter.msi.ucsb.edu/',
    stats: ['25 years', 'Kelp forests', 'Climate impacts'],
  },
  {
    name: 'Moorea Coral Reef LTER',
    description: 'On the island of Moorea in French Polynesia, we investigate how coral reef ecosystems respond to disturbances like cyclones, bleaching, and predator outbreaks.',
    image: '/images/about/marine-reef.jpg',
    link: 'https://mcr.lternet.edu/',
    stats: ['Since 2004', 'Coral dynamics', 'Tropical Pacific'],
  },
]

/**
 * Transform DB research areas into the display format used by the accordion component.
 * Merges DB data (name, description, faculty list) with supplementary display data
 * (subtitles, questions, images, colors) from the themeDisplayData map.
 */
function transformDbToThemes(
  dbAreas: Awaited<ReturnType<typeof getAllResearchAreasWithFaculty>>
): ResearchThemeData[] {
  return dbAreas.map((area) => {
    const slug = area.slug || area.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const display = themeDisplayData[slug]

    // Map DB faculty to display format
    const faculty = area.faculty.map((f) => {
      const facultySlug = f.slug || `${f.first_name}-${f.last_name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      // Use the focus map if available, fall back to short_bio, then a generic label
      const focus = display?.facultyFocusMap?.[facultySlug]
        || f.short_bio
        || 'Faculty'
      return {
        name: `${f.first_name} ${f.last_name}`,
        focus,
        slug: facultySlug,
      }
    })

    return {
      id: slug,
      title: area.name,
      subtitle: display?.subtitle || area.description?.slice(0, 50) || '',
      description: area.description || '',
      questions: display?.questions || [],
      image: display?.image || '/images/about/ucsb-aerial.jpg',
      color: display?.color || 'ocean-teal',
      faculty,
    }
  })
}

export default async function ResearchPage() {
  // Fetch data from Supabase in parallel
  const [dbResearchAreas, facultyCount, studentCount] = await Promise.all([
    getAllResearchAreasWithFaculty(),
    getFacultyCount(),
    getStudentCount(),
  ])

  // Use DB data if available, otherwise fall back to hardcoded data
  const researchThemes: ResearchThemeData[] = dbResearchAreas.length > 0
    ? transformDbToThemes(dbResearchAreas)
    : fallbackResearchThemes

  // Use dynamic counts if available, otherwise use hardcoded fallbacks
  const statFacultyCount = facultyCount > 0 ? facultyCount : 35
  const statStudentCount = studentCount > 0 ? studentCount : 100

  // Research highlights stay hardcoded (no DB table for these)
  const researchHighlights = fallbackResearchHighlights

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <Image
          src="/images/about/kelp-banner.jpg"
          alt="Giant kelp forest in the Santa Barbara Channel"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep via-ocean-deep/70 to-ocean-deep/40" />

        {/* Subtle texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 30 Q15 20 30 30 T60 30' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-6xl">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-0.5 bg-ucsb-gold" />
              <p className="text-ucsb-gold font-medium text-sm tracking-widest uppercase">
                Research Excellence
              </p>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-[1.1] text-white tracking-tight">
              Questions That
              <br />
              <span className="text-ucsb-gold">Matter for the Planet</span>
            </h1>

            <p className="text-lg md:text-xl mb-8 text-white/85 leading-relaxed max-w-2xl">
              From the molecular machinery of cells to the dynamics of global ecosystems,
              EEMB researchers tackle fundamental questions about how life works—and how
              we can protect it.
            </p>

            <div className="flex gap-4 flex-wrap">
              <a
                href="#themes"
                className="bg-ucsb-gold text-ucsb-navy px-7 py-3.5 rounded-xl font-bold hover:bg-yellow-400 transition-all duration-300 hover:shadow-lg"
              >
                Explore Research Themes
              </a>
              <Link
                href="/people"
                className="bg-white/10 backdrop-blur-sm text-white px-7 py-3.5 rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition-all"
              >
                Meet Our Faculty
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider variant="bold" toColor="fill-white" className="-mt-1" />

      {/* Research Themes Section */}
      <section id="themes" className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          {/* Section header */}
          <div className="max-w-2xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-ocean-blue" />
              <span className="text-ocean-blue text-sm font-semibold tracking-wide uppercase">
                Research Themes
              </span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-4">
              What We Study
            </h2>
            <p className="text-warm-600 text-lg leading-relaxed">
              Our research spans {researchThemes.length} interconnected themes. Click any theme to see
              the questions driving our work and the faculty leading the way.
            </p>
          </div>

          {/* Theme cards — interactive accordion (client component) */}
          <ResearchThemeAccordion themes={researchThemes} />
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-warm-100" />

      {/* Research Highlights */}
      <section className="py-16 md:py-24 bg-warm-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <ScrollReveal direction="up" duration={500}>
            <div className="max-w-2xl mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-ocean-teal" />
                <span className="text-ocean-teal text-sm font-semibold tracking-wide uppercase">
                  Research Highlights
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-4">
                Stories From the Lab & Field
              </h2>
              <p className="text-warm-600 text-lg leading-relaxed">
                A glimpse into the diverse questions driving our research.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            {researchHighlights.map((highlight, idx) => (
              <ScrollReveal key={idx} delay={idx * 100} duration={500} direction="up">
                <article className="h-full bg-white rounded-2xl p-6 shadow-warm-md hover:shadow-warm-xl transition-all duration-300 border border-warm-200 group hover:-translate-y-1">
                  <div>
                    <span className="text-xs font-bold text-ocean-teal uppercase tracking-wide">
                      {highlight.theme}
                    </span>
                    <h3 className="font-heading text-lg font-bold text-ucsb-navy mt-1 mb-2 group-hover:text-ocean-blue transition-colors">
                      {highlight.title}
                    </h3>
                    <p className="text-warm-600 text-sm leading-relaxed mb-3">
                      {highlight.description}
                    </p>
                    <p className="text-sm font-medium text-ocean-blue">
                      — {highlight.faculty}
                    </p>
                  </div>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-white" />

      {/* LTER Sites */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <ScrollReveal direction="up" duration={500}>
            <div className="max-w-2xl mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-0.5 bg-ucsb-gold" />
                <span className="text-ucsb-gold text-sm font-semibold tracking-wide uppercase">
                  Long-Term Research
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-ucsb-navy mb-4">
                LTER Sites
              </h2>
              <p className="text-warm-600 text-lg leading-relaxed">
                EEMB leads two of the nation&apos;s Long-Term Ecological Research sites,
                enabling multi-decadal studies of ecosystem dynamics.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {lterSites.map((site, idx) => (
              <ScrollReveal key={site.name} delay={idx * 150} duration={500} direction="up">
                <article className="group h-full bg-white rounded-2xl overflow-hidden shadow-warm-md hover:shadow-warm-xl transition-all duration-500 border border-warm-200 hover:-translate-y-1">
                <div className="relative h-56">
                  <Image
                    src={site.image}
                    alt={site.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-deep/80 via-ocean-deep/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-heading text-xl font-bold text-white mb-2">
                      {site.name}
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                      {site.stats.map((stat) => (
                        <span
                          key={stat}
                          className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-md text-xs text-white font-medium"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-warm-600 leading-relaxed mb-4">
                    {site.description}
                  </p>
                  <a
                    href={site.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-ocean-blue font-semibold hover:text-ocean-deep transition-colors group/link"
                  >
                    <span className="link-underline">Visit LTER site</span>
                    <svg className="w-4 h-4 transition-transform group-hover/link:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider variant="subtle" toColor="fill-warm-100" />

      {/* Stats Section */}
      <section className="py-16 md:py-20 bg-warm-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <ScrollReveal direction="up" duration={500}>
            <div className="text-center mb-12">
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-ucsb-navy">
                Research by the Numbers
              </h2>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: statFacultyCount, suffix: '+', label: 'Faculty', sublabel: 'across all ranks' },
              { value: statStudentCount, suffix: '+', label: 'Grad Students', sublabel: 'PhD & Masters' },
              { value: 2, label: 'LTER Sites', sublabel: 'coastal & coral reef' },
              { value: 25, prefix: '$', suffix: 'M+', label: 'Annual Funding', sublabel: 'NSF, NIH, NOAA' },
            ].map((stat, idx) => (
              <ScrollReveal key={idx} delay={idx * 100} duration={500} direction="up">
                <div className="bg-white rounded-2xl p-6 text-center shadow-warm-md border border-warm-200 hover:shadow-warm-xl hover:border-ocean-teal/30 transition-all duration-500 group">
                  <AnimatedCounter
                    end={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    className="text-3xl md:text-4xl text-ocean-blue group-hover:scale-105 transition-transform duration-300"
                    labelClassName="hidden"
                  />
                  <p className="font-semibold text-ucsb-navy mt-1">{stat.label}</p>
                  <p className="text-xs text-warm-600 mt-1">{stat.sublabel}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider variant="bold" toColor="fill-ocean-deep" />

      {/* CTA Section */}
      <section className="bg-ocean-deep text-white py-16 md:py-20 -mt-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Join Our Research Community
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            Whether you&apos;re a prospective graduate student, potential collaborator,
            or simply curious about our work, we&apos;d love to hear from you.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/academics/graduate"
              className="bg-ucsb-gold text-ucsb-navy px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 transition-all"
            >
              Graduate Programs
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold border border-white/30 hover:bg-white/20 transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
