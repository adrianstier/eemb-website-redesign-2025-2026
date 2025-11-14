#!/bin/bash

# Comprehensive Backend API Test Suite
# Tests all endpoints with edge cases and error scenarios

set -e

BASE_URL="http://localhost:1337"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

echo "========================================="
echo "EEMB Backend Comprehensive Test Suite"
echo "========================================="
echo ""

# Helper function to test endpoint
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    local description="$4"

    echo -n "Testing: $name... "

    response=$(curl -s -w "\n%{http_code}" "$url" 2>&1)
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | sed '$d')

    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
        ((PASSED++))
        if [ -n "$description" ]; then
            echo "  → $description"
        fi
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected $expected_status, got $http_code)"
        ((FAILED++))
        echo "  URL: $url"
        echo "  Response: ${body:0:200}"
        return 1
    fi
}

# Helper function to check response contains data
test_has_data() {
    local name="$1"
    local url="$2"
    local field="$3"

    echo -n "Testing: $name... "

    response=$(curl -s "$url" 2>&1)

    if echo "$response" | grep -q "\"$field\""; then
        echo -e "${GREEN}✓ PASS${NC} (Contains '$field')"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Missing '$field')"
        ((FAILED++))
        echo "  Response: ${response:0:200}"
        return 1
    fi
}

# Helper to test performance
test_performance() {
    local name="$1"
    local url="$2"
    local max_time="$3"

    echo -n "Performance: $name... "

    time_total=$(curl -s -o /dev/null -w "%{time_total}" "$url" 2>&1)

    # Convert to milliseconds for comparison
    time_ms=$(echo "$time_total * 1000" | bc | cut -d'.' -f1)
    max_ms=$(echo "$max_time * 1000" | bc | cut -d'.' -f1)

    if [ "$time_ms" -lt "$max_ms" ]; then
        echo -e "${GREEN}✓ PASS${NC} (${time_total}s < ${max_time}s)"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ SLOW${NC} (${time_total}s >= ${max_time}s)"
        ((WARNINGS++))
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. HEALTH & CONNECTIVITY TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Health endpoint (if exists) - 204 No Content is valid for health checks
test_endpoint "Health endpoint" "$BASE_URL/_health" "204" "Backend is healthy and responding"

# Test 2: API root
test_endpoint "API root" "$BASE_URL/api" "200" "API documentation accessible"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. FACULTY ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 3: Get all faculty
test_endpoint "GET /api/faculties" "$BASE_URL/api/faculties" "200"
test_has_data "Faculty has data array" "$BASE_URL/api/faculties" "data"
test_has_data "Faculty has attributes" "$BASE_URL/api/faculties" "attributes"

# Test 4: Pagination - small limit
test_endpoint "Faculty pagination (limit=5)" "$BASE_URL/api/faculties?pagination%5Blimit%5D=5" "200"

# Test 5: Pagination - zero limit (edge case)
test_endpoint "Faculty pagination (limit=0)" "$BASE_URL/api/faculties?pagination%5Blimit%5D=0" "200"

# Test 6: Pagination - large limit
test_endpoint "Faculty pagination (limit=999)" "$BASE_URL/api/faculties?pagination%5Blimit%5D=999" "200"

# Test 7: Pagination - negative limit (edge case)
test_endpoint "Faculty pagination (negative limit)" "$BASE_URL/api/faculties?pagination%5Blimit%5D=-1" "200"

# Test 8: Sorting
test_endpoint "Faculty sort by lastName" "$BASE_URL/api/faculties?sort=lastName" "200"
test_endpoint "Faculty sort descending" "$BASE_URL/api/faculties?sort=lastName:desc" "200"

# Test 9: Invalid sort field
test_endpoint "Faculty invalid sort field" "$BASE_URL/api/faculties?sort=invalidField123" "200"

# Test 10: Filtering
test_endpoint "Faculty filter active" "$BASE_URL/api/faculties?filters%5Bactive%5D%5B%24eq%5D=true" "200"

# Test 11: Complex query
test_endpoint "Faculty complex query" "$BASE_URL/api/faculties?pagination%5Blimit%5D=10&sort=lastName&filters%5Bactive%5D%5B%24eq%5D=true" "200"

# Test 12: Special characters in query
test_endpoint "Faculty with special chars" "$BASE_URL/api/faculties?filters%5Bemail%5D%5B%24contains%5D=%40ucsb.edu" "200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. EVENTS ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 13: Get all events
test_endpoint "GET /api/events" "$BASE_URL/api/events" "200"

# Test 14: Events with populate
test_endpoint "Events with populate" "$BASE_URL/api/events?populate=*" "200"

# Test 15: Events sorting by date
test_endpoint "Events sort by startDate" "$BASE_URL/api/events?sort=startDate:asc" "200"

# Test 16: Events date filtering
test_endpoint "Events future filter" "$BASE_URL/api/events?filters%5BstartDate%5D%5B%24gte%5D=2024-01-01" "200"

# Test 17: Events pagination
test_endpoint "Events pagination" "$BASE_URL/api/events?pagination%5Blimit%5D=5" "200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. NEWS ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 18: Get all news
test_endpoint "GET /api/news" "$BASE_URL/api/news" "200"

# Test 19: News with populate
test_endpoint "News with populate" "$BASE_URL/api/news?populate=*" "200"

# Test 20: News sorting
test_endpoint "News sort by publishedAt" "$BASE_URL/api/news?sort=publishedAt:desc" "200"

# Test 21: News pagination
test_endpoint "News pagination" "$BASE_URL/api/news?pagination%5Blimit%5D=10" "200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. GRADUATE STUDENTS ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 22: Get graduate students
test_endpoint "GET /api/graduate-students" "$BASE_URL/api/graduate-students" "200"

# Test 23: Students with populate
test_endpoint "Students with populate" "$BASE_URL/api/graduate-students?populate=*" "200"

# Test 24: Students filtering
test_endpoint "Students filter active" "$BASE_URL/api/graduate-students?filters%5Bactive%5D%5B%24eq%5D=true" "200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. STAFF ENDPOINTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 25: Get staff members
test_endpoint "GET /api/staff-members" "$BASE_URL/api/staff-members" "200"

# Test 26: Staff with populate
test_endpoint "Staff with populate" "$BASE_URL/api/staff-members?populate=*" "200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. ERROR HANDLING TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 27: Non-existent endpoint
test_endpoint "404 - Non-existent endpoint" "$BASE_URL/api/nonexistent" "404"

# Test 28: Non-existent collection
test_endpoint "404 - Non-existent collection" "$BASE_URL/api/invalid-collection-12345" "404"

# Test 29: Malformed query
test_endpoint "Malformed query string" "$BASE_URL/api/faculties?filters%5B%5B%5B=invalid" "200"

# Test 30: SQL injection attempt
test_endpoint "SQL injection protection" "$BASE_URL/api/faculties?filters%5Bemail%5D%5B%24eq%5D='; DROP TABLE faculties;--" "200"

# Test 31: XSS attempt
test_endpoint "XSS protection" "$BASE_URL/api/faculties?filters%5BfirstName%5D%5B%24contains%5D=<script>alert('xss')</script>" "200"

# Test 32: Path traversal attempt
test_endpoint "Path traversal protection" "$BASE_URL/api/../../etc/passwd" "404"

# Test 33: Very long query string
LONG_QUERY=$(printf 'a%.0s' {1..10000})
test_endpoint "Very long query string" "$BASE_URL/api/faculties?test=$LONG_QUERY" "200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. PERFORMANCE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 34-38: Response times
test_performance "Faculty list response time" "$BASE_URL/api/faculties" "2.0"
test_performance "Faculty with limit response" "$BASE_URL/api/faculties?pagination%5Blimit%5D=5" "1.0"
test_performance "Events list response time" "$BASE_URL/api/events" "2.0"
test_performance "News list response time" "$BASE_URL/api/news" "2.0"
test_performance "Students list response time" "$BASE_URL/api/graduate-students" "2.0"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "9. DATA INTEGRITY TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 39: Check faculty has required fields
echo -n "Faculty data structure check... "
FACULTY_DATA=$(curl -s "$BASE_URL/api/faculties?pagination%5Blimit%5D=1")
if echo "$FACULTY_DATA" | grep -q '"firstName"' && \
   echo "$FACULTY_DATA" | grep -q '"lastName"' && \
   echo "$FACULTY_DATA" | grep -q '"email"'; then
    echo -e "${GREEN}✓ PASS${NC} (Has required fields)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Missing required fields)"
    ((FAILED++))
fi

# Test 40: Check events has date fields
echo -n "Events data structure check... "
EVENTS_DATA=$(curl -s "$BASE_URL/api/events?pagination%5Blimit%5D=1")
if echo "$EVENTS_DATA" | grep -q '"title"'; then
    echo -e "${GREEN}✓ PASS${NC} (Has title field)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Missing title field)"
    ((FAILED++))
fi

# Test 41: Check pagination metadata
echo -n "Pagination metadata check... "
PAGINATED=$(curl -s "$BASE_URL/api/faculties?pagination%5Blimit%5D=5")
if echo "$PAGINATED" | grep -q '"meta"'; then
    echo -e "${GREEN}✓ PASS${NC} (Has pagination metadata)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (No pagination metadata)"
    ((WARNINGS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "10. CONCURRENT REQUEST TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 42: Multiple concurrent requests
echo -n "Concurrent requests (5 simultaneous)... "
START_TIME=$(date +%s)
for i in {1..5}; do
    curl -s "$BASE_URL/api/faculties?pagination%5Blimit%5D=10" > /dev/null &
done
wait
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

if [ $DURATION -lt 5 ]; then
    echo -e "${GREEN}✓ PASS${NC} (Completed in ${DURATION}s)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ SLOW${NC} (Took ${DURATION}s)"
    ((WARNINGS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST SUMMARY"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "Tests Passed:    ${GREEN}$PASSED${NC}"
echo -e "Tests Failed:    ${RED}$FAILED${NC}"
echo -e "Warnings:        ${YELLOW}$WARNINGS${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    SUCCESS_RATE=$(echo "scale=1; $PASSED * 100 / $TOTAL" | bc)
    echo "Success Rate: ${SUCCESS_RATE}%"
fi

echo ""
echo "========================================="

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}All critical tests passed!${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review.${NC}"
    exit 1
fi
