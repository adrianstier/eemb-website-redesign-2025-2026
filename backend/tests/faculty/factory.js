// Faculty Factory for Testing
const { faker } = require('@faker-js/faker')

/**
 * Create mock faculty data
 * @param {Object} overrides - Optional field overrides
 * @returns {Object} Faculty data object
 */
const createFaculty = (overrides = {}) => {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()

  return {
    first_name: firstName,
    last_name: lastName,
    title: faker.helpers.arrayElement(['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer']),
    email: faker.internet.email({ firstName, lastName, provider: 'ucsb.edu' }),
    phone: faker.phone.number('(805) ###-####'),
    office: `LSB ${faker.number.int({ min: 1000, max: 4999 })}`,
    bio: faker.lorem.paragraphs(3),
    research_interests: faker.helpers.arrayElements([
      'Marine Biology',
      'Ecology',
      'Evolution',
      'Climate Change',
      'Conservation Biology',
      'Molecular Biology',
      'Genomics',
      'Coral Reef Ecology',
      'Ocean Acidification',
      'Biodiversity',
    ], { min: 2, max: 5 }),
    education: [
      {
        degree: 'PhD',
        institution: faker.helpers.arrayElement(['Harvard University', 'Stanford University', 'MIT', 'Yale University']),
        year: faker.number.int({ min: 1990, max: 2010 }),
      },
      {
        degree: 'BS',
        institution: faker.helpers.arrayElement(['UC Berkeley', 'UCLA', 'UCSB', 'UC Davis']),
        year: faker.number.int({ min: 1985, max: 2005 }),
      },
    ],
    website: faker.internet.url(),
    active: true,
    publications: [],
    ...overrides,
  }
}

/**
 * Create multiple faculty members
 * @param {Number} count - Number of faculty to create
 * @param {Object} overrides - Optional field overrides for all
 * @returns {Array} Array of faculty data objects
 */
const createFacultyBatch = (count = 10, overrides = {}) => {
  return Array.from({ length: count }, () => createFaculty(overrides))
}

/**
 * Create faculty with specific research area
 * @param {String} researchArea - Research area
 * @returns {Object} Faculty data object
 */
const createFacultyWithResearch = (researchArea) => {
  return createFaculty({
    research_interests: [researchArea, ...faker.helpers.arrayElements([
      'Climate Change',
      'Conservation Biology',
      'Biodiversity',
    ], 2)],
  })
}

/**
 * Create emeritus faculty
 * @returns {Object} Faculty data object
 */
const createEmeritusFaculty = () => {
  return createFaculty({
    title: 'Professor Emeritus',
    active: false,
    retired_at: faker.date.past({ years: 5 }),
  })
}

module.exports = {
  createFaculty,
  createFacultyBatch,
  createFacultyWithResearch,
  createEmeritusFaculty,
}