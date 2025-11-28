-- Categorize faculty by research areas: ecology, evolution, marine-biology
-- Based on their research_interests JSON field

-- Armand Kuris - Has Ecology, Ecosystem Ecology, Disease Ecology, Population and Community Ecology + Marine Biology
UPDATE faculties SET research_areas = 'ecology,evolution,marine-biology' WHERE id = 84;

-- Leander Anderegg - Has Ecology, Ecosystem Ecology, Population and Community Ecology
UPDATE faculties SET research_areas = 'ecology' WHERE id = 74;

-- Cherie Briggs - Has Disease Ecology, Ecology, Population and Community Ecology
UPDATE faculties SET research_areas = 'ecology' WHERE id = 75;

-- Deron Burkepile - Has Ecosystem Ecology, Population and Community Ecology + Marine Biology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 76;

-- Jenn Caselle - Has Ecology, Ecosystem Ecology, Population and Community Ecology + Marine Biology + Aquatic Biology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 117;

-- Ivia Closset - No clear research interests (advisor listed)
UPDATE faculties SET research_areas = NULL WHERE id = 119;

-- Carla D'Antonio - Has Ecology, Ecosystem Ecology, Population and Community Ecology
UPDATE faculties SET research_areas = 'ecology' WHERE id = 77;

-- John Damuth - Empty research interests
UPDATE faculties SET research_areas = NULL WHERE id = 123;

-- Christopher Evelyn - No clear research interests (advisor listed)
UPDATE faculties SET research_areas = NULL WHERE id = 125;

-- Thomas Even - Has Ecology, Population and Community Ecology + Aquatic Biology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 78;

-- Halley Froehlich - Has Marine Biology, Ecology, Population and Community Ecology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 79;

-- James Gately - No clear research interests (advisor listed)
UPDATE faculties SET research_areas = NULL WHERE id = 129;

-- Scott Hodges - Has Ecology, Evolution, Evolutionary Ecology, Evolutionary Genetics, Macroevolution
UPDATE faculties SET research_areas = 'ecology,evolution' WHERE id = 80;

-- Gretchen Hofmann - Has Marine Biology
UPDATE faculties SET research_areas = 'marine-biology' WHERE id = 81;

-- Débora Iglesias-Rodriguez - Has Ecology, Ecosystem Ecology, Population and Community Ecology + Marine Biology, Biological Oceanography + Aquatic Biology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 82;

-- Susan J. Mazer - Has Ecology, Evolution, Evolutionary Ecology, Evolutionary Genetics, Population and Community Ecology
UPDATE faculties SET research_areas = 'ecology,evolution' WHERE id = 88;

-- Anna James - Has climate change on marine microbial (marine-related)
UPDATE faculties SET research_areas = 'marine-biology' WHERE id = 83;

-- Kevin Lafferty - Has Disease Ecology, Ecology, Ecosystem Ecology, Population and Community Ecology + Macroevolution + Marine Biology + Aquatic Biology
UPDATE faculties SET research_areas = 'ecology,evolution,marine-biology' WHERE id = 136;

-- John Latto - Has Population and community ecology
UPDATE faculties SET research_areas = 'ecology' WHERE id = 85;

-- Sally MacIntyre - Has Ecology, Ecosystem Ecology + Aquatic Biology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 86;

-- Jesús Martínez-Gómez - Has Evolution, Evolutionary Genetics, Macroevolution
UPDATE faculties SET research_areas = 'evolution' WHERE id = 87;

-- Douglas McCauley - Has Ecosystem Ecology, Population and Community Ecology + Marine Biology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 89;

-- Holly Moeller - Has Population and Community Ecology + Biological Oceanography
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 90;

-- Nick Nidzieko - coastal physical oceanographer
UPDATE faculties SET research_areas = 'marine-biology' WHERE id = 91;

-- Todd Oakley - Has Evolution, Evolutionary Ecology, Evolutionary Genetics, Macroevolution + Marine Biology + Aquatic Biology
UPDATE faculties SET research_areas = 'evolution,marine-biology' WHERE id = 92;

-- Ryoko Oono - Has Evolutionary Ecology, Evolutionary Genetics, Population and Community Ecology
UPDATE faculties SET research_areas = 'ecology,evolution' WHERE id = 93;

-- Ferdinand Pfab - No clear research interests (advisors listed)
UPDATE faculties SET research_areas = NULL WHERE id = 149;

-- Stephen Proulx - Has Evolution, Evolutionary Ecology, Evolutionary Genetics
UPDATE faculties SET research_areas = 'evolution' WHERE id = 94;

-- Joel Rothman - Has Evolution, Evolutionary Genetics, Macroevolution
UPDATE faculties SET research_areas = 'evolution' WHERE id = 95;

-- Alyson Santoro - Has Ecosystem Ecology, Evolutionary Ecology, Population and Community Ecology + Biological Oceanography
UPDATE faculties SET research_areas = 'ecology,evolution,marine-biology' WHERE id = 96;

-- Joshua Schimel - Has Ecology, Ecosystem Ecology
UPDATE faculties SET research_areas = 'ecology' WHERE id = 97;

-- Joel Sharbrough - Has Evolutionary Genetics, Evolution + Aquatic Biology
UPDATE faculties SET research_areas = 'evolution,marine-biology' WHERE id = 98;

-- Jackie Shay - Has Ecology, Ecosystem Ecology, Population and Community Ecology, Evolutionary Ecology
UPDATE faculties SET research_areas = 'ecology,evolution' WHERE id = 99;

-- Adrian Stier - Has Ecology, Population and Community Ecology + Marine Biology + Aquatic Biology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 100;

-- Samuel Sweet - Has Evolution, Evolutionary Ecology, Macroevolution, Population and Community Ecology
UPDATE faculties SET research_areas = 'ecology,evolution' WHERE id = 101;

-- Audrey Thellman - Has Ecology, Ecosystem Ecology
UPDATE faculties SET research_areas = 'ecology' WHERE id = 102;

-- Andrew Thurber - Has Ecology, Ecosystem Ecology, Population and Community Ecology + Marine Biology, Biological Oceanography + Aquatic Biology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 103;

-- Thomas Turner - Has Evolution, Evolutionary Genetics + Marine Biology
UPDATE faculties SET research_areas = 'evolution,marine-biology' WHERE id = 104;

-- Rebecca Vega Thurber - Has Disease Ecology + Marine Biology
UPDATE faculties SET research_areas = 'ecology,marine-biology' WHERE id = 105;

-- Lizzy Wilbanks - Has Ecosystem Ecology, Evolutionary Ecology, Population and Community Ecology + Biological Oceanography
UPDATE faculties SET research_areas = 'ecology,evolution,marine-biology' WHERE id = 106;

-- Soojin Yi - Has Evolution, Evolutionary Ecology, Evolutionary Genetics + Marine Biology
UPDATE faculties SET research_areas = 'evolution,marine-biology' WHERE id = 107;

-- Hillary Young - Has Disease Ecology, Ecology, Population and Community Ecology
UPDATE faculties SET research_areas = 'ecology' WHERE id = 108;

-- Yong Zhou - Has Ecology, Ecosystem Ecology, Population and Community Ecology
UPDATE faculties SET research_areas = 'ecology' WHERE id = 109;
