#!/bin/bash

# Quick Backend API Test
BASE_URL="http://localhost:1337"

echo "Quick Backend API Tests"
echo "======================="
echo ""

# Test 1: Faculty endpoint
echo "1. Testing Faculty API..."
curl -s "$BASE_URL/api/faculties?pagination[limit]=1" | jq '.data[0].attributes | {firstName, lastName, email}' 2>/dev/null || echo "FAIL"

# Test 2: Faculty count
echo ""
echo "2. Total Faculty Count..."
curl -s "$BASE_URL/api/faculties" | jq '.data | length' 2>/dev/null || echo "FAIL"

# Test 3: Events endpoint
echo ""
echo "3. Testing Events API..."
curl -s "$BASE_URL/api/events?pagination[limit]=1" | jq '.data[0].attributes.title' 2>/dev/null || echo "No events or FAIL"

# Test 4: News endpoint
echo ""
echo "4. Testing News API..."
curl -s "$BASE_URL/api/news?pagination[limit]=1" | jq '.data[0].attributes.title' 2>/dev/null || echo "No news or FAIL"

# Test 5: Students endpoint
echo ""
echo "5. Testing Graduate Students API..."
curl -s "$BASE_URL/api/graduate-students?pagination[limit]=1" | jq '.data[0].attributes | {firstName, lastName}' 2>/dev/null || echo "FAIL"

# Test 6: Staff endpoint
echo ""
echo "6. Testing Staff API..."
curl -s "$BASE_URL/api/staff-members?pagination[limit]=1" | jq '.data[0].attributes | {firstName, lastName}' 2>/dev/null || echo "FAIL"

# Test 7: Response times
echo ""
echo "7. Response Time Tests..."
echo -n "Faculty: "
time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL/api/faculties?pagination[limit]=10")
echo "${time}s"

echo -n "Events: "
time=$(curl -s -o /dev/null -w "%{time_total}" "$BASE_URL/api/events")
echo "${time}s"

# Test 8: Error handling
echo ""
echo "8. Error Handling..."
echo -n "404 test: "
status=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/nonexistent")
if [ "$status" = "404" ]; then
    echo "PASS (HTTP $status)"
else
    echo "FAIL (Expected 404, got $status)"
fi

# Test 9: Pagination metadata
echo ""
echo "9. Pagination Test..."
curl -s "$BASE_URL/api/faculties?pagination[limit]=5" | jq '.meta.pagination' 2>/dev/null || echo "No pagination metadata"

# Test 10: Filtering test
echo ""
echo "10. Filtering Test..."
echo -n "Active faculty count: "
curl -s "$BASE_URL/api/faculties?filters[active][\$eq]=true" | jq '.data | length' 2>/dev/null || echo "FAIL"

echo ""
echo "======================="
echo "Tests Complete!"
