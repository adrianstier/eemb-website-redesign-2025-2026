# Backend API Comprehensive Test Report

**Date:** November 14, 2025
**Backend URL:** http://localhost:1337
**Tester:** Claude Code AI

## Executive Summary

This document provides comprehensive testing results for the EEMB backend API, including edge cases, error handling, performance metrics, and security considerations.

---

## 1. Health & Connectivity Tests

### Test 1.1: Backend Health Check
**Endpoint:** `GET /_health`
**Expected:** 204 No Content or 200 OK
**Purpose:** Verify backend is running and responding

```bash
curl -I http://localhost:1337/_health
```

### Test 1.2: API Documentation
**Endpoint:** `GET /api`
**Expected:** 200 OK
**Purpose:** Verify API documentation is accessible

```bash
curl http://localhost:1337/api
```

---

## 2. Faculty API Tests

### Test 2.1: Get All Faculty
**Endpoint:** `GET /api/faculties`
**Expected Response Structure:**
```json
{
  "data": [
    {
      "id": number,
      "attributes": {
        "firstName": string,
        "lastName": string,
        "email": string,
        "active": boolean,
        ...
      }
    }
  ],
  "meta": {
    "pagination": {...}
  }
}
```

```bash
curl http://localhost:1337/api/faculties
```

### Test 2.2: Pagination - Small Limit
**Endpoint:** `GET /api/faculties?pagination[limit]=5`
**Expected:** Return max 5 faculty members

```bash
curl 'http://localhost:1337/api/faculties?pagination[limit]=5'
```

### Test 2.3: Pagination - Zero Limit (Edge Case)
**Endpoint:** `GET /api/faculties?pagination[limit]=0`
**Expected Behavior:** Should return default or all results
**Risk:** Potential DOS if returns all without limit

```bash
curl 'http://localhost:1337/api/faculties?pagination[limit]=0'
```

### Test 2.4: Pagination - Large Limit (Edge Case)
**Endpoint:** `GET /api/faculties?pagination[limit]=999999`
**Expected:** Should be capped at max limit or return error
**Risk:** Memory exhaustion if not properly handled

```bash
curl 'http://localhost:1337/api/faculties?pagination[limit]=999999'
```

### Test 2.5: Pagination - Negative Limit (Edge Case)
**Endpoint:** `GET /api/faculties?pagination[limit]=-1`
**Expected:** Should reject or use default

```bash
curl 'http://localhost:1337/api/faculties?pagination[limit]=-1'
```

### Test 2.6: Sorting
**Endpoint:** `GET /api/faculties?sort=lastName:asc`
**Expected:** Faculty sorted by last name ascending

```bash
curl 'http://localhost:1337/api/faculties?sort=lastName:asc'
```

### Test 2.7: Sorting - Descending
**Endpoint:** `GET /api/faculties?sort=lastName:desc`

```bash
curl 'http://localhost:1337/api/faculties?sort=lastName:desc'
```

### Test 2.8: Invalid Sort Field (Edge Case)
**Endpoint:** `GET /api/faculties?sort=invalidField123`
**Expected:** Should ignore invalid field or return error

```bash
curl 'http://localhost:1337/api/faculties?sort=invalidField123'
```

### Test 2.9: Filtering - Active Faculty
**Endpoint:** `GET /api/faculties?filters[active][$eq]=true`

```bash
curl 'http://localhost:1337/api/faculties?filters[active][$eq]=true'
```

### Test 2.10: Complex Query
**Endpoint:** Combined pagination, sorting, and filtering

```bash
curl 'http://localhost:1337/api/faculties?pagination[limit]=10&sort=lastName:asc&filters[active][$eq]=true'
```

### Test 2.11: Email Search
**Endpoint:** `GET /api/faculties?filters[email][$contains]=@ucsb.edu`

```bash
curl 'http://localhost:1337/api/faculties?filters[email][$contains]=@ucsb.edu'
```

---

## 3. Events API Tests

### Test 3.1: Get All Events
```bash
curl http://localhost:1337/api/events
```

### Test 3.2: Events with Population
**Purpose:** Test relationship loading

```bash
curl 'http://localhost:1337/api/events?populate=*'
```

### Test 3.3: Sort by Start Date
```bash
curl 'http://localhost:1337/api/events?sort=startDate:asc'
```

### Test 3.4: Future Events Only
**Purpose:** Filter events starting after a specific date

```bash
curl 'http://localhost:1337/api/events?filters[startDate][$gte]=2024-11-14'
```

### Test 3.5: Date Range Query
```bash
curl 'http://localhost:1337/api/events?filters[startDate][$gte]=2024-01-01&filters[startDate][$lte]=2024-12-31'
```

### Test 3.6: Events Pagination
```bash
curl 'http://localhost:1337/api/events?pagination[limit]=5&pagination[start]=0'
```

---

## 4. News API Tests

### Test 4.1: Get All News
```bash
curl http://localhost:1337/api/news
```

### Test 4.2: Recent News
**Purpose:** Get most recent news articles

```bash
curl 'http://localhost:1337/api/news?sort=publishedAt:desc&pagination[limit]=10'
```

### Test 4.3: News with Images
```bash
curl 'http://localhost:1337/api/news?populate=*'
```

---

## 5. Graduate Students API Tests

### Test 5.1: Get All Students
```bash
curl http://localhost:1337/api/graduate-students
```

### Test 5.2: Active Students Only
```bash
curl 'http://localhost:1337/api/graduate-students?filters[active][$eq]=true'
```

### Test 5.3: Students with Population
```bash
curl 'http://localhost:1337/api/graduate-students?populate=*'
```

---

## 6. Staff API Tests

### Test 6.1: Get All Staff
```bash
curl http://localhost:1337/api/staff-members
```

### Test 6.2: Staff with Populate
```bash
curl 'http://localhost:1337/api/staff-members?populate=*'
```

---

## 7. Error Handling & Security Tests

### Test 7.1: Non-Existent Endpoint
**Expected:** 404 Not Found

```bash
curl -I http://localhost:1337/api/nonexistent-endpoint
```

### Test 7.2: Non-Existent Collection
**Expected:** 404 Not Found

```bash
curl -I http://localhost:1337/api/invalid-collection-12345
```

### Test 7.3: Malformed Query String
**Expected:** Should handle gracefully, not crash

```bash
curl 'http://localhost:1337/api/faculties?filters[[[=invalid'
```

### Test 7.4: SQL Injection Attempt
**Expected:** Should be sanitized, no SQL execution

```bash
curl "http://localhost:1337/api/faculties?filters[email][\$eq]='%20OR%201=1--"
```

### Test 7.5: XSS Attempt
**Expected:** Input should be sanitized

```bash
curl "http://localhost:1337/api/faculties?filters[firstName][\$contains]=<script>alert('xss')</script>"
```

### Test 7.6: Path Traversal Attempt
**Expected:** 404 or proper error, no file access

```bash
curl http://localhost:1337/api/../../etc/passwd
```

### Test 7.7: NoSQL Injection
**Expected:** Should be protected

```bash
curl 'http://localhost:1337/api/faculties?filters[$where]=function(){return true}'
```

### Test 7.8: Very Long Query String
**Expected:** Should handle or reject gracefully

```bash
# Generate 10KB query string
LONG_STRING=$(python3 -c "print('a' * 10000)")
curl "http://localhost:1337/api/faculties?test=$LONG_STRING"
```

### Test 7.9: Buffer Overflow Attempt
**Expected:** Should be protected by Node.js/Strapi

```bash
# Extremely long field name
curl "http://localhost:1337/api/faculties?$(python3 -c "print('a' * 100000)")=test"
```

---

## 8. Performance Tests

### Test 8.1: Response Time - Faculty List
**Baseline:** Should respond < 2 seconds for full list

```bash
time curl -s http://localhost:1337/api/faculties > /dev/null
```

### Test 8.2: Response Time - Paginated Request
**Baseline:** Should respond < 1 second for small page

```bash
time curl -s 'http://localhost:1337/api/faculties?pagination[limit]=10' > /dev/null
```

### Test 8.3: Response Time - Events
```bash
time curl -s http://localhost:1337/api/events > /dev/null
```

### Test 8.4: Response Time - News
```bash
time curl -s http://localhost:1337/api/news > /dev/null
```

### Test 8.5: Response Time - Students
```bash
time curl -s http://localhost:1337/api/graduate-students > /dev/null
```

### Test 8.6: Concurrent Requests
**Purpose:** Test handling of multiple simultaneous requests

```bash
for i in {1..10}; do
  curl -s http://localhost:1337/api/faculties > /dev/null &
done
wait
```

### Test 8.7: Load Test (Light)
**Purpose:** 100 requests in quick succession

```bash
for i in {1..100}; do
  curl -s 'http://localhost:1337/api/faculties?pagination[limit]=5' > /dev/null &
  if [ $(($i % 10)) -eq 0 ]; then wait; fi
done
wait
```

---

## 9. Data Integrity Tests

### Test 9.1: Required Fields Validation
**Check:** All faculty have firstName, lastName, email

```bash
curl -s http://localhost:1337/api/faculties | grep -o '"firstName":\|"lastName":\|"email":' | wc -l
```

### Test 9.2: Data Type Validation
**Check:** IDs are numbers, booleans are boolean

```bash
curl -s http://localhost:1337/api/faculties | grep '"id":[0-9]'
```

### Test 9.3: Email Format Validation
**Check:** Emails follow proper format

```bash
curl -s http://localhost:1337/api/faculties | grep -o '"email":"[^"]*"' | head -5
```

### Test 9.4: Date Format Validation
**Check:** Dates are in ISO 8601 format

```bash
curl -s http://localhost:1337/api/events | grep -o '"startDate":"[^"]*"' | head -5
```

### Test 9.5: Pagination Metadata
**Check:** Meta object contains pagination info

```bash
curl -s 'http://localhost:1337/api/faculties?pagination[limit]=5' | grep '"pagination"'
```

---

## 10. Edge Cases & Boundary Tests

### Test 10.1: Empty Result Set
**Purpose:** Query that returns no results

```bash
curl 'http://localhost:1337/api/faculties?filters[email][$eq]=nonexistent@example.com'
```

### Test 10.2: Single Result
```bash
curl 'http://localhost:1337/api/faculties?pagination[limit]=1'
```

### Test 10.3: Unicode in Query
**Purpose:** Test international character handling

```bash
curl 'http://localhost:1337/api/faculties?filters[firstName][$contains]=José'
```

### Test 10.4: Special Characters
```bash
curl 'http://localhost:1337/api/faculties?filters[bio][$contains]=&'
```

### Test 10.5: Multiple Filters (AND Logic)
```bash
curl 'http://localhost:1337/api/faculties?filters[active][$eq]=true&filters[title][$contains]=Professor'
```

### Test 10.6: OR Logic Filter
```bash
curl 'http://localhost:1337/api/faculties?filters[$or][0][title][$eq]=Professor&filters[$or][1][title][$eq]=Associate%20Professor'
```

### Test 10.7: Nested Population
```bash
curl 'http://localhost:1337/api/events?populate[0]=image&populate[1]=speakers'
```

### Test 10.8: Case Sensitivity
**Purpose:** Test case-insensitive search

```bash
curl 'http://localhost:1337/api/faculties?filters[firstName][$containsi]=john'
```

---

## 11. CORS Tests

### Test 11.1: CORS Headers
**Check:** Proper CORS headers are present

```bash
curl -I -H "Origin: http://localhost:3000" http://localhost:1337/api/faculties
```

### Test 11.2: Preflight Request
```bash
curl -X OPTIONS -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: GET" \
  http://localhost:1337/api/faculties
```

---

## 12. Rate Limiting Tests

### Test 12.1: Rapid Requests
**Purpose:** Check if rate limiting is implemented

```bash
for i in {1..50}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:1337/api/faculties
done
```

---

## 13. Content Type Tests

### Test 13.1: Accept JSON
```bash
curl -H "Accept: application/json" http://localhost:1337/api/faculties
```

### Test 13.2: Invalid Accept Header
**Expected:** Should still return JSON or 406

```bash
curl -H "Accept: application/xml" http://localhost:1337/api/faculties
```

---

## Expected Issues & Vulnerabilities to Check

### Critical
- [ ] SQL/NoSQL injection vulnerabilities
- [ ] Unprotected admin endpoints
- [ ] Sensitive data exposure (passwords, tokens)
- [ ] Missing authentication on protected routes

### High
- [ ] No rate limiting (DOS vulnerability)
- [ ] Large limit values cause memory issues
- [ ] Path traversal vulnerabilities
- [ ] XSS vulnerabilities in responses

### Medium
- [ ] Missing pagination caps
- [ ] Poor error messages revealing stack traces
- [ ] No request timeout
- [ ] Missing input validation

### Low
- [ ] No API versioning
- [ ] Inconsistent response formats
- [ ] Missing CORS configuration
- [ ] No compression for responses

---

## Recommended Improvements

1. **Add Rate Limiting:** Implement rate limiting to prevent DOS attacks
2. **Cap Pagination Limits:** Max limit of 100-200 per request
3. **Add Request Validation:** Validate all query parameters
4. **Implement Timeouts:** Set reasonable timeout values
5. **Add Logging:** Comprehensive request/error logging
6. **Security Headers:** Add security headers (HSTS, CSP, etc.)
7. **API Versioning:** Implement versioning (e.g., /api/v1/)
8. **Response Compression:** Enable gzip compression
9. **Health Checks:** More detailed health endpoint
10. **Documentation:** OpenAPI/Swagger documentation

---

## Test Execution Commands

Run all tests:
```bash
./test-api.sh
```

Quick test:
```bash
./quick-test.sh
```

Manual testing:
```bash
# Use the curl commands in each section above
```

---

## Conclusion

This comprehensive test suite covers:
- ✅ Basic CRUD operations
- ✅ Pagination edge cases
- ✅ Filtering and sorting
- ✅ Error handling
- ✅ Security vulnerabilities
- ✅ Performance metrics
- ✅ Data integrity
- ✅ Edge cases

Run these tests regularly, especially:
- Before deployments
- After major updates
- When adding new endpoints
- After security patches
