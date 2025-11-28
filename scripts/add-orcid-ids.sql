-- Add high-confidence ORCID IDs for faculty (1 match each - very likely correct)
-- Generated from ORCID_SEARCH_RESULTS.md

UPDATE faculties SET orcid = '0000-0002-5144-7254' WHERE full_name = 'Leander Anderegg';
UPDATE faculties SET orcid = '0000-0002-0395-9650' WHERE full_name = 'Carla D''Antonio';
UPDATE faculties SET orcid = '0000-0001-7322-1523' WHERE full_name = 'Halley Froehlich';
UPDATE faculties SET orcid = '0000-0003-0931-1238' WHERE full_name = 'Gretchen Hofmann';
UPDATE faculties SET orcid = '0009-0009-6817-8423' WHERE full_name = 'John Latto';
UPDATE faculties SET orcid = '0000-0003-3644-7237' WHERE full_name = 'Sally MacIntyre';
UPDATE faculties SET orcid = '0000-0002-8100-653X' WHERE full_name = 'Douglas McCauley';
UPDATE faculties SET orcid = '0000-0002-9335-0039' WHERE full_name = 'Holly Moeller';
UPDATE faculties SET orcid = '0000-0003-4859-0030' WHERE full_name = 'Ryoko Oono';
UPDATE faculties SET orcid = '0000-0003-0307-1907' WHERE full_name = 'Stephen Proulx';
UPDATE faculties SET orcid = '0000-0002-6844-1377' WHERE full_name = 'Joel Rothman';
UPDATE faculties SET orcid = '0000-0002-1022-6623' WHERE full_name = 'Joshua Schimel';
UPDATE faculties SET orcid = '0000-0002-3642-1662' WHERE full_name = 'Joel Sharbrough';
UPDATE faculties SET orcid = '0009-0001-7421-092X' WHERE full_name = 'Jackie Shay';
UPDATE faculties SET orcid = '0000-0002-4704-4145' WHERE full_name = 'Adrian Stier';
UPDATE faculties SET orcid = '0000-0003-3716-6664' WHERE full_name = 'Audrey Thellman';
UPDATE faculties SET orcid = '0000-0003-3516-2061' WHERE full_name = 'Rebecca Vega Thurber';
UPDATE faculties SET orcid = '0000-0003-0449-8582' WHERE full_name = 'Hillary Young';
UPDATE faculties SET orcid = '0000-0002-6993-8991' WHERE full_name = 'Alice Alldredge';
UPDATE faculties SET orcid = '0000-0003-3432-2297' WHERE full_name = 'Mark Brzezinski';
UPDATE faculties SET orcid = '0009-0006-3724-0149' WHERE full_name = 'James Childress';
UPDATE faculties SET orcid = '0000-0002-6286-3296' WHERE full_name = 'Ivia Closset';
UPDATE faculties SET orcid = '0000-0002-1635-9726' WHERE full_name = 'John Damuth';
UPDATE faculties SET orcid = '0000-0002-7557-7627' WHERE full_name = 'John A. Endler';
UPDATE faculties SET orcid = '0000-0002-7644-9678' WHERE full_name = 'Christopher Evelyn';
UPDATE faculties SET orcid = '0000-0002-6343-8208' WHERE full_name = 'James Gately';
UPDATE faculties SET orcid = '0000-0002-3015-3484' WHERE full_name = 'Sally Holbrook';
UPDATE faculties SET orcid = '0000-0003-4013-8138' WHERE full_name = 'Bruce Mahall';
UPDATE faculties SET orcid = '0000-0003-0619-841X' WHERE full_name = 'John M. Melack';
UPDATE faculties SET orcid = '0000-0002-3838-0411' WHERE full_name = 'Roger Nisbet';
UPDATE faculties SET orcid = '0000-0002-3379-5204' WHERE full_name = 'Ferdinand Pfab';
UPDATE faculties SET orcid = '0000-0002-9674-4244' WHERE full_name = 'Russell Schmitt';

-- Check results
SELECT full_name, orcid FROM faculties WHERE orcid IS NOT NULL AND orcid != '' ORDER BY last_name;
