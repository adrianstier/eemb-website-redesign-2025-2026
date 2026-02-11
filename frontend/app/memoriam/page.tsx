import { getAllMemorials } from '@/lib/data/memorials'
import type { Memorial } from '@/lib/data/memorials'
import InMemoriamClient from './InMemoriamClient'

// Hardcoded fallback data in case the memorials table doesn't exist or returns empty
const fallbackMemorials: Memorial[] = [
  {
    id: 1,
    name: 'John Damuth',
    title: 'Professor Emeritus',
    birth_year: 1943,
    death_year: 2024,
    photo_url: null,
    bio: 'John Damuth was a distinguished evolutionary biologist and ecologist whose groundbreaking research on body size and energy use in mammals transformed our understanding of ecological scaling relationships.',
    legacy: 'Professor Damuth\'s work on the "Energetic Equivalence Rule" remains foundational in ecology. His mentorship of graduate students and collaborative spirit left an indelible mark on the department. He will be remembered for his intellectual curiosity, kindness, and dedication to understanding the natural world.',
    research_areas: ['Evolutionary Biology', 'Ecology', 'Mammalian Evolution'],
    external_links: [],
    slug: 'john-damuth',
    display_order: 1,
    created_at: null,
    updated_at: null,
  },
  {
    id: 2,
    name: 'Allen Stewart-Oaten',
    title: 'Professor Emeritus',
    birth_year: 1945,
    death_year: 2024,
    photo_url: null,
    bio: 'Allen Stewart-Oaten was a pioneering statistician and ecologist who revolutionized environmental impact assessment through his development of the BACI (Before-After-Control-Impact) design.',
    legacy: 'Professor Stewart-Oaten\'s statistical methods for environmental monitoring are used worldwide and have been instrumental in assessing ecological impacts of human activities. His rigorous approach to statistical ecology and his mentorship of students across disciplines created a lasting legacy in environmental science.',
    research_areas: ['Biostatistics', 'Environmental Impact Assessment', 'Ecological Statistics'],
    external_links: [],
    slug: 'allen-stewart-oaten',
    display_order: 2,
    created_at: null,
    updated_at: null,
  },
  {
    id: 3,
    name: 'Robert Kent "Bob" Trench',
    title: 'Professor Emeritus',
    birth_year: 1935,
    death_year: 2022,
    photo_url: null,
    bio: 'Bob Trench was a pioneering marine biologist whose research on coral-algal symbiosis fundamentally advanced our understanding of reef ecosystems.',
    legacy: 'Professor Trench\'s work on zooxanthellae and coral symbiosis laid crucial groundwork for understanding coral bleaching and reef health. His dedication to marine biology and his warm mentorship style inspired generations of marine scientists.',
    research_areas: ['Marine Biology', 'Coral Reef Ecology', 'Symbiosis'],
    external_links: [
      {
        title: 'Global Coral Memorial',
        url: 'https://www.globalcoral.org/robert-kent-trench-in-memoriam-2/'
      }
    ],
    slug: 'bob-trench',
    display_order: 3,
    created_at: null,
    updated_at: null,
  },
  {
    id: 4,
    name: 'Joseph Hurd Connell',
    title: 'Professor Emeritus',
    birth_year: 1923,
    death_year: 2020,
    photo_url: null,
    bio: 'Joseph Connell was one of the most influential ecologists of the 20th century, known for his pioneering work on competition, predation, and community ecology.',
    legacy: 'Professor Connell\'s research on barnacles and the intermediate disturbance hypothesis revolutionized community ecology. His elegant field experiments and theoretical insights continue to shape ecological thinking. He was a beloved mentor and a giant in the field of ecology.',
    research_areas: ['Community Ecology', 'Marine Ecology', 'Competition Theory'],
    external_links: [
      {
        title: 'Chancellor\'s Memorial',
        url: 'https://chancellor.ucsb.edu/memos/2020-09-28-sad-news-professor-emeritus-joseph-hurd-connell'
      }
    ],
    slug: 'joe-connell',
    display_order: 4,
    created_at: null,
    updated_at: null,
  },
  {
    id: 5,
    name: 'Adrian M. Wenner',
    title: 'Professor Emeritus',
    birth_year: 1928,
    death_year: 2023,
    photo_url: null,
    bio: 'Adrian Wenner was a distinguished behavioral ecologist whose controversial research on bee navigation challenged prevailing theories about honey bee communication.',
    legacy: 'Professor Wenner\'s meticulous research on how honey bees find food sources sparked important scientific debates about animal communication. His dedication to empirical evidence and scientific rigor, along with his mentorship of students, left a profound impact on behavioral ecology.',
    research_areas: ['Behavioral Ecology', 'Animal Communication', 'Bee Navigation'],
    external_links: [
      {
        title: 'CCS Memorial',
        url: 'https://ccs.ucsb.edu/news/2023/memoriam-professor-adrian-m-wenner-ccs-provost-1989-1993-remembered-1928-2023'
      }
    ],
    slug: 'adrian-wenner',
    display_order: 5,
    created_at: null,
    updated_at: null,
  },
]

export default async function InMemoriamPage() {
  // Fetch from Supabase, fall back to hardcoded data if empty or error
  let memorials = await getAllMemorials()

  if (!memorials || memorials.length === 0) {
    memorials = fallbackMemorials
  }

  return <InMemoriamClient memorials={memorials} />
}
