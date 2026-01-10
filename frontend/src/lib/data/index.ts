// Faculty
export {
  getAllFaculty,
  getFacultyBySlug,
  getFacultyAcceptingStudents,
  getFacultyByResearchArea,
  getAllFacultySlugs,
  type FacultyWithResearch
} from './faculty'

// Graduate Students
export {
  getAllStudents,
  getStudentBySlug,
  getStudentsByAdvisor,
  getStudentsByProgram,
  getAllStudentSlugs,
  type StudentWithDetails
} from './students'

// Staff
export {
  getAllStaff,
  getStaffBySlug,
  getStaffByDepartment,
  getAllStaffSlugs
} from './staff'

// News
export {
  getAllNews,
  getNewsBySlug,
  getFeaturedNews,
  getNewsCount,
  getAllNewsSlugs,
  getNewsCategories,
  type NewsWithFaculty
} from './news'

// Events
export {
  getUpcomingEvents,
  getPastEvents,
  getEventBySlug,
  getFeaturedEvents,
  getEventsByDateRange,
  getAllEvents,
  getAllEventSlugs,
  getEventTypes,
  type EventWithHost
} from './events'

// Research Areas
export {
  getAllResearchAreas,
  getFeaturedResearchAreas,
  getResearchAreaBySlug,
  getResearchAreasByCategory,
  getAllResearchAreaSlugs,
  type ResearchAreaWithFaculty
} from './research'

// Testimonials
export {
  getAllTestimonials,
  getFeaturedTestimonials,
  type TestimonialWithStudent
} from './testimonials'

// Contact
export {
  submitContactForm,
  getContactSubmissions,
  updateContactStatus
} from './contact'
