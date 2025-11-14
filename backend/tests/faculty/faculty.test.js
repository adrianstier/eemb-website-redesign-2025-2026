// Faculty API Tests
const request = require('supertest')
const { setupStrapi, cleanupStrapi } = require('../helpers/strapi')
const { createFaculty, createFacultyBatch } = require('./factory')

describe('Faculty API', () => {
  let strapi
  let authToken

  beforeAll(async () => {
    strapi = await setupStrapi()

    // Create test user and get auth token
    const response = await request(strapi.server)
      .post('/api/auth/local')
      .send({
        identifier: 'test@example.com',
        password: 'Test1234',
      })

    authToken = response.body.jwt
  })

  afterAll(async () => {
    await cleanupStrapi(strapi)
  })

  describe('GET /api/faculties', () => {
    it('should return all faculty members', async () => {
      const response = await request(strapi.server)
        .get('/api/faculties')
        .expect(200)
        .expect('Content-Type', /json/)

      expect(response.body).toHaveProperty('data')
      expect(Array.isArray(response.body.data)).toBe(true)
      expect(response.body).toHaveProperty('meta')
    })

    it('should filter faculty by active status', async () => {
      const response = await request(strapi.server)
        .get('/api/faculties?filters[active][$eq]=true')
        .expect(200)

      response.body.data.forEach(faculty => {
        expect(faculty.attributes.active).toBe(true)
      })
    })

    it('should filter faculty by research area', async () => {
      const researchArea = 'Marine Biology'
      const response = await request(strapi.server)
        .get(`/api/faculties?filters[research_interests][$contains]=${researchArea}`)
        .expect(200)

      response.body.data.forEach(faculty => {
        expect(faculty.attributes.research_interests).toContain(researchArea)
      })
    })

    it('should paginate results', async () => {
      const response = await request(strapi.server)
        .get('/api/faculties?pagination[page]=1&pagination[pageSize]=10')
        .expect(200)

      expect(response.body.meta.pagination).toMatchObject({
        page: 1,
        pageSize: 10,
      })
      expect(response.body.data.length).toBeLessThanOrEqual(10)
    })

    it('should sort faculty by last name', async () => {
      const response = await request(strapi.server)
        .get('/api/faculties?sort=last_name:asc')
        .expect(200)

      const lastNames = response.body.data.map(f => f.attributes.last_name)
      const sortedLastNames = [...lastNames].sort()
      expect(lastNames).toEqual(sortedLastNames)
    })

    it('should populate relations when requested', async () => {
      const response = await request(strapi.server)
        .get('/api/faculties?populate=publications,courses')
        .expect(200)

      if (response.body.data.length > 0) {
        const faculty = response.body.data[0]
        expect(faculty.attributes).toHaveProperty('publications')
        expect(faculty.attributes).toHaveProperty('courses')
      }
    })
  })

  describe('GET /api/faculties/:id', () => {
    let testFaculty

    beforeAll(async () => {
      // Create a test faculty member
      const facultyData = createFaculty()
      const response = await request(strapi.server)
        .post('/api/faculties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: facultyData })

      testFaculty = response.body.data
    })

    it('should return a specific faculty member', async () => {
      const response = await request(strapi.server)
        .get(`/api/faculties/${testFaculty.id}`)
        .expect(200)

      expect(response.body.data.id).toBe(testFaculty.id)
      expect(response.body.data.attributes.email).toBe(testFaculty.attributes.email)
    })

    it('should return 404 for non-existent faculty', async () => {
      await request(strapi.server)
        .get('/api/faculties/999999')
        .expect(404)
    })

    it('should populate all relations with wildcard', async () => {
      const response = await request(strapi.server)
        .get(`/api/faculties/${testFaculty.id}?populate=*`)
        .expect(200)

      const attributes = response.body.data.attributes
      expect(attributes).toHaveProperty('createdAt')
      expect(attributes).toHaveProperty('updatedAt')
    })
  })

  describe('POST /api/faculties', () => {
    it('should create a new faculty member with authentication', async () => {
      const facultyData = createFaculty()

      const response = await request(strapi.server)
        .post('/api/faculties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: facultyData })
        .expect(200)

      expect(response.body.data.attributes.email).toBe(facultyData.email)
      expect(response.body.data.attributes.first_name).toBe(facultyData.first_name)
    })

    it('should fail without authentication', async () => {
      const facultyData = createFaculty()

      await request(strapi.server)
        .post('/api/faculties')
        .send({ data: facultyData })
        .expect(403)
    })

    it('should validate required fields', async () => {
      const invalidData = {
        title: 'Professor',
        // Missing required fields: first_name, last_name, email
      }

      const response = await request(strapi.server)
        .post('/api/faculties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: invalidData })
        .expect(400)

      expect(response.body.error).toBeDefined()
      expect(response.body.error.details).toContainEqual(
        expect.objectContaining({
          path: expect.arrayContaining(['first_name']),
        })
      )
    })

    it('should validate email format', async () => {
      const facultyData = createFaculty({ email: 'invalid-email' })

      const response = await request(strapi.server)
        .post('/api/faculties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: facultyData })
        .expect(400)

      expect(response.body.error.message).toContain('email')
    })

    it('should generate slug from name', async () => {
      const facultyData = createFaculty({
        first_name: 'John',
        last_name: 'Doe',
      })

      const response = await request(strapi.server)
        .post('/api/faculties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: facultyData })
        .expect(200)

      expect(response.body.data.attributes.slug).toBe('john-doe')
    })
  })

  describe('PUT /api/faculties/:id', () => {
    let testFaculty

    beforeEach(async () => {
      const facultyData = createFaculty()
      const response = await request(strapi.server)
        .post('/api/faculties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: facultyData })

      testFaculty = response.body.data
    })

    it('should update faculty information', async () => {
      const updateData = {
        office: 'New Office LSB 5000',
        phone: '(805) 123-4567',
      }

      const response = await request(strapi.server)
        .put(`/api/faculties/${testFaculty.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: updateData })
        .expect(200)

      expect(response.body.data.attributes.office).toBe(updateData.office)
      expect(response.body.data.attributes.phone).toBe(updateData.phone)
    })

    it('should not update without authentication', async () => {
      await request(strapi.server)
        .put(`/api/faculties/${testFaculty.id}`)
        .send({ data: { office: 'New Office' } })
        .expect(403)
    })

    it('should return 404 for non-existent faculty', async () => {
      await request(strapi.server)
        .put('/api/faculties/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: { office: 'New Office' } })
        .expect(404)
    })
  })

  describe('DELETE /api/faculties/:id', () => {
    let testFaculty

    beforeEach(async () => {
      const facultyData = createFaculty()
      const response = await request(strapi.server)
        .post('/api/faculties')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: facultyData })

      testFaculty = response.body.data
    })

    it('should delete a faculty member', async () => {
      await request(strapi.server)
        .delete(`/api/faculties/${testFaculty.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200)

      // Verify deletion
      await request(strapi.server)
        .get(`/api/faculties/${testFaculty.id}`)
        .expect(404)
    })

    it('should not delete without authentication', async () => {
      await request(strapi.server)
        .delete(`/api/faculties/${testFaculty.id}`)
        .expect(403)
    })

    it('should return 404 for non-existent faculty', async () => {
      await request(strapi.server)
        .delete('/api/faculties/999999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404)
    })
  })

  describe('Search functionality', () => {
    beforeAll(async () => {
      // Create test data
      await createFacultyBatch(5)
    })

    it('should search faculty by name', async () => {
      const searchTerm = 'John'
      const response = await request(strapi.server)
        .get(`/api/faculties?filters[$or][0][first_name][$contains]=${searchTerm}&filters[$or][1][last_name][$contains]=${searchTerm}`)
        .expect(200)

      response.body.data.forEach(faculty => {
        const fullName = `${faculty.attributes.first_name} ${faculty.attributes.last_name}`
        expect(fullName.toLowerCase()).toContain(searchTerm.toLowerCase())
      })
    })

    it('should perform full-text search', async () => {
      const searchTerm = 'biology'
      const response = await request(strapi.server)
        .get(`/api/search?q=${searchTerm}&type=faculty`)
        .expect(200)

      expect(response.body.data).toBeDefined()
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })
})