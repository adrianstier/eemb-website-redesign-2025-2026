-- Create memorials table for In Memoriam page
CREATE TABLE IF NOT EXISTS memorials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT,
  birth_year INTEGER,
  death_year INTEGER,
  photo_url TEXT,
  bio TEXT,
  legacy TEXT,
  research_areas TEXT[],
  external_links JSONB DEFAULT '[]',
  slug TEXT UNIQUE NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE memorials ENABLE ROW LEVEL SECURITY;

-- Public read access (memorials are publicly viewable)
CREATE POLICY "Public read access" ON memorials FOR SELECT USING (true);

-- Admin-only write access
CREATE POLICY "Admin insert" ON memorials FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin update" ON memorials FOR UPDATE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admin delete" ON memorials FOR DELETE USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- Seed data from existing hardcoded memorial entries
INSERT INTO memorials (name, title, birth_year, death_year, bio, legacy, research_areas, external_links, slug, display_order)
VALUES
  (
    'John Damuth',
    'Professor Emeritus',
    1943,
    2024,
    'John Damuth was a distinguished evolutionary biologist and ecologist whose groundbreaking research on body size and energy use in mammals transformed our understanding of ecological scaling relationships.',
    'Professor Damuth''s work on the "Energetic Equivalence Rule" remains foundational in ecology. His mentorship of graduate students and collaborative spirit left an indelible mark on the department. He will be remembered for his intellectual curiosity, kindness, and dedication to understanding the natural world.',
    ARRAY['Evolutionary Biology', 'Ecology', 'Mammalian Evolution'],
    '[]'::jsonb,
    'john-damuth',
    1
  ),
  (
    'Allen Stewart-Oaten',
    'Professor Emeritus',
    1945,
    2024,
    'Allen Stewart-Oaten was a pioneering statistician and ecologist who revolutionized environmental impact assessment through his development of the BACI (Before-After-Control-Impact) design.',
    'Professor Stewart-Oaten''s statistical methods for environmental monitoring are used worldwide and have been instrumental in assessing ecological impacts of human activities. His rigorous approach to statistical ecology and his mentorship of students across disciplines created a lasting legacy in environmental science.',
    ARRAY['Biostatistics', 'Environmental Impact Assessment', 'Ecological Statistics'],
    '[]'::jsonb,
    'allen-stewart-oaten',
    2
  ),
  (
    'Robert Kent "Bob" Trench',
    'Professor Emeritus',
    1935,
    2022,
    'Bob Trench was a pioneering marine biologist whose research on coral-algal symbiosis fundamentally advanced our understanding of reef ecosystems.',
    'Professor Trench''s work on zooxanthellae and coral symbiosis laid crucial groundwork for understanding coral bleaching and reef health. His dedication to marine biology and his warm mentorship style inspired generations of marine scientists.',
    ARRAY['Marine Biology', 'Coral Reef Ecology', 'Symbiosis'],
    '[{"title": "Global Coral Memorial", "url": "https://www.globalcoral.org/robert-kent-trench-in-memoriam-2/"}]'::jsonb,
    'bob-trench',
    3
  ),
  (
    'Joseph Hurd Connell',
    'Professor Emeritus',
    1923,
    2020,
    'Joseph Connell was one of the most influential ecologists of the 20th century, known for his pioneering work on competition, predation, and community ecology.',
    'Professor Connell''s research on barnacles and the intermediate disturbance hypothesis revolutionized community ecology. His elegant field experiments and theoretical insights continue to shape ecological thinking. He was a beloved mentor and a giant in the field of ecology.',
    ARRAY['Community Ecology', 'Marine Ecology', 'Competition Theory'],
    '[{"title": "Chancellor''s Memorial", "url": "https://chancellor.ucsb.edu/memos/2020-09-28-sad-news-professor-emeritus-joseph-hurd-connell"}]'::jsonb,
    'joe-connell',
    4
  ),
  (
    'Adrian M. Wenner',
    'Professor Emeritus',
    1928,
    2023,
    'Adrian Wenner was a distinguished behavioral ecologist whose controversial research on bee navigation challenged prevailing theories about honey bee communication.',
    'Professor Wenner''s meticulous research on how honey bees find food sources sparked important scientific debates about animal communication. His dedication to empirical evidence and scientific rigor, along with his mentorship of students, left a profound impact on behavioral ecology.',
    ARRAY['Behavioral Ecology', 'Animal Communication', 'Bee Navigation'],
    '[{"title": "CCS Memorial", "url": "https://ccs.ucsb.edu/news/2023/memoriam-professor-adrian-m-wenner-ccs-provost-1989-1993-remembered-1928-2023"}]'::jsonb,
    'adrian-wenner',
    5
  );
