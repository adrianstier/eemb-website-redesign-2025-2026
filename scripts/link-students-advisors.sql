-- Link students to their advisors
-- First, get faculty IDs for matching

-- Ivanna Arrizon Elizarraras -> Gretchen Hofmann
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Ivanna%' AND f.full_name LIKE '%Hofmann%';

-- An Bui -> Adrian Stier (primary)
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%An Bui%' AND f.full_name LIKE '%Adrian Stier%';

-- Noe Castaneda -> Deron Burkepile
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Noe Castaneda%' AND f.full_name LIKE '%Burkepile%';

-- Braulio Castillo -> Lizzy Wilbanks
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Braulio%' AND f.full_name LIKE '%Wilbanks%';

-- Laura Dagg -> Carla D'Antonio
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Laura Dagg%' AND f.full_name LIKE "%D'Antonio%";

-- Zhujin Mavis Ding -> Ryoko Oono
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Ding%' AND f.full_name LIKE '%Oono%';

-- Eric Fairbanks -> Douglas McCauley
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Fairbanks%' AND f.full_name LIKE '%McCauley%';

-- Eddie Fuques-Villalba -> Rebecca Vega Thurber
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Fuques%' AND f.full_name LIKE '%Vega Thurber%';

-- Devin Gamble -> Susan J. Mazer
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Gamble%' AND f.full_name LIKE '%Mazer%';

-- Kenneth Gilliland -> Samuel Sweet
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Gilliland%' AND f.full_name LIKE '%Sweet%';

-- Phoebe Hall -> Todd Oakley
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Phoebe Hall%' AND f.full_name LIKE '%Oakley%';

-- Ruby Harris-Gavin -> Hillary Young
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Harris-Gavin%' AND f.full_name LIKE '%Hillary Young%';

-- Samantha Jerry -> Holly Moeller
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Samantha Jerry%' AND f.full_name LIKE '%Moeller%';

-- Mackenzie Kawahara -> Rebecca Vega Thurber
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Kawahara%' AND f.full_name LIKE '%Vega Thurber%';

-- Hannah Lyford -> Steve Gaines (need to check if exists)
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Lyford%' AND f.full_name LIKE '%Gaines%';

-- Stephanie Ma -> Carla D'Antonio
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Stephanie Ma%' AND f.full_name LIKE "%D'Antonio%";

-- Adriane McDonald -> Gretchen Hofmann
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Adriane McDonald%' AND f.full_name LIKE '%Hofmann%';

-- Siena McKim -> Thomas Turner
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%McKim%' AND f.full_name LIKE '%Thomas Turner%';

-- Anna Mele -> Susan J. Mazer
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Anna Mele%' AND f.full_name LIKE '%Mazer%';

-- Nury Molina -> Deron Burkepile
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Nury Molina%' AND f.full_name LIKE '%Burkepile%';

-- Sekou Noble-Kuchera -> Yong Zhou
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Noble-Kuchera%' AND f.full_name LIKE '%Yong Zhou%';

-- Caitlin Nordheim -> Cherie Briggs
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Nordheim%' AND f.full_name LIKE '%Briggs%';

-- Sibelle O'Donnell -> Rebecca Vega Thurber
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE "%O'Donnell%" AND f.full_name LIKE '%Vega Thurber%';

-- Sunni Patton -> Rebecca Vega Thurber
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Sunni Patton%' AND f.full_name LIKE '%Vega Thurber%';

-- Gwendolyn Pohlmann -> Ryoko Oono
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Pohlmann%' AND f.full_name LIKE '%Oono%';

-- Julianna Renzi -> Deron Burkepile
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Renzi%' AND f.full_name LIKE '%Burkepile%';

-- Kacie Ring -> Cherie Briggs
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Kacie Ring%' AND f.full_name LIKE '%Briggs%';

-- Imani Russell -> Cherie Briggs
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Imani Russell%' AND f.full_name LIKE '%Briggs%';

-- Charlie Thrift -> Hillary Young
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Charlie Thrift%' AND f.full_name LIKE '%Hillary Young%';

-- Nehir Toklu -> Yong Zhou
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Toklu%' AND f.full_name LIKE '%Yong Zhou%';

-- Bridget Vincent -> Todd Oakley
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Bridget Vincent%' AND f.full_name LIKE '%Oakley%';

-- Zoe Welch -> Debora Iglesias-Rodriguez
INSERT INTO graduate_students_advisor_links (graduate_student_id, faculty_id)
SELECT gs.id, f.id FROM graduate_students gs, faculties f 
WHERE gs.full_name LIKE '%Zoe Welch%' AND f.full_name LIKE '%Iglesias%';
