#!/bin/bash

# Comprehensive Events & Calendar System Test
# Tests backend API, frontend pages, and integrations

BASE_URL="http://localhost:1337"
FRONTEND_URL="http://localhost:3000"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
WARNINGS=0

echo "========================================="
echo "EEMB Events & Calendar System Test Suite"
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
        return 1
    fi
}

# Helper to check if string exists in response
test_contains() {
    local name="$1"
    local url="$2"
    local search_string="$3"

    echo -n "Testing: $name... "

    response=$(curl -s "$url" 2>&1)

    if echo "$response" | grep -q "$search_string"; then
        echo -e "${GREEN}✓ PASS${NC} (Contains '$search_string')"
        ((PASSED++))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Missing '$search_string')"
        ((FAILED++))
        return 1
    fi
}

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. BACKEND API TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Backend Health
test_endpoint "Backend health check" "$BASE_URL/_health" "204" "Backend is running"

# Test 2: Events API endpoint exists
echo -n "Testing: Events API endpoint... "
response=$(curl -s "$BASE_URL/api/events" 2>&1)
if echo "$response" | grep -q '"data"'; then
    echo -e "${GREEN}✓ PASS${NC} (API responding)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (No events or API issue)"
    ((WARNINGS++))
fi

# Test 3: Events API with population
test_endpoint "Events API with populate" "$BASE_URL/api/events?populate=*" "200"

# Test 4: Events API with sorting
test_endpoint "Events API sorting" "$BASE_URL/api/events?sort=startDate:asc" "200"

# Test 5: Events API with pagination
test_endpoint "Events API pagination" "$BASE_URL/api/events?pagination[limit]=10" "200"

# Test 6: Events API with filters
test_endpoint "Events API filtering" "$BASE_URL/api/events?filters[eventType][\$eq]=Seminar" "200"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. FRONTEND PAGE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if frontend is running
echo -n "Testing: Frontend server... "
if curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL" | grep -q "200"; then
    echo -e "${GREEN}✓ PASS${NC} (Frontend running)"
    ((PASSED++))
    FRONTEND_RUNNING=true
else
    echo -e "${RED}✗ FAIL${NC} (Frontend not running)"
    echo "  → Start with: cd frontend && npm run dev"
    ((FAILED++))
    FRONTEND_RUNNING=false
fi

if [ "$FRONTEND_RUNNING" = true ]; then
    # Test 7: Events page exists
    test_endpoint "Events list page" "$FRONTEND_URL/events" "200"

    # Test 8: Calendar page exists
    test_endpoint "Calendar page" "$FRONTEND_URL/calendar" "200"

    # Test 9: Admin events page exists
    test_endpoint "Admin events page" "$FRONTEND_URL/admin/events" "200"

    # Test 10: Check calendar page has calendar grid
    test_contains "Calendar has monthly grid" "$FRONTEND_URL/calendar" "grid grid-cols-7"

    # Test 11: Check events page has filter
    test_contains "Events page has filters" "$FRONTEND_URL/events" "Event Types"

    # Test 12: Check admin page has login
    test_contains "Admin page has authentication" "$FRONTEND_URL/admin/events" "Password"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. NAVIGATION TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$FRONTEND_RUNNING" = true ]; then
    # Test 13: Header has calendar link
    echo -n "Testing: Header calendar link... "
    if curl -s "$FRONTEND_URL" | grep -q 'href="/calendar"'; then
        echo -e "${GREEN}✓ PASS${NC} (Calendar in navigation)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Calendar link missing)"
        ((FAILED++))
    fi

    # Test 14: Events page links to calendar
    echo -n "Testing: Events → Calendar link... "
    if curl -s "$FRONTEND_URL/events" | grep -q 'Calendar View'; then
        echo -e "${GREEN}✓ PASS${NC} (Link exists)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Link missing)"
        ((FAILED++))
    fi

    # Test 15: Calendar page links to events
    echo -n "Testing: Calendar → Events link... "
    if curl -s "$FRONTEND_URL/calendar" | grep -q 'List View'; then
        echo -e "${GREEN}✓ PASS${NC} (Link exists)"
        ((PASSED++))
    else
        echo -e "${RED}✗ FAIL${NC} (Link missing)"
        ((FAILED++))
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. CALENDAR FEATURE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$FRONTEND_RUNNING" = true ]; then
    # Test 16: Calendar has export button
    test_contains "Calendar export button" "$FRONTEND_URL/calendar" "Export All Events"

    # Test 17: Calendar has month navigation
    test_contains "Calendar month navigation" "$FRONTEND_URL/calendar" "Previous month"

    # Test 18: Calendar has Google Calendar integration text
    test_contains "Google Calendar mention" "$FRONTEND_URL/calendar" "Google Calendar"

    # Test 19: Calendar has color legend
    test_contains "Calendar legend" "$FRONTEND_URL/calendar" "Event Types"

    # Test 20: Calendar has today button
    test_contains "Calendar today button" "$FRONTEND_URL/calendar" "Today"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. ADMIN PAGE FEATURE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ "$FRONTEND_RUNNING" = true ]; then
    # Test 21: Admin has AI assistant
    test_contains "Admin AI assistant" "$FRONTEND_URL/admin/events" "AI Event Assistant"

    # Test 22: Admin has login form
    test_contains "Admin login form" "$FRONTEND_URL/admin/events" "Enter admin password"

    # Test 23: Admin has demo password note
    test_contains "Admin demo password" "$FRONTEND_URL/admin/events" "eemb2024admin"

    # Test 24: Admin has logout button text
    test_contains "Admin logout functionality" "$FRONTEND_URL/admin/events" "Logout"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6. FILE STRUCTURE TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 25: Calendar page file exists
echo -n "Testing: Calendar page file... "
if [ -f "frontend/app/calendar/page.tsx" ]; then
    echo -e "${GREEN}✓ PASS${NC} (File exists)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (File missing)"
    ((FAILED++))
fi

# Test 26: Admin events page file exists
echo -n "Testing: Admin events page file... "
if [ -f "frontend/app/admin/events/page.tsx" ]; then
    echo -e "${GREEN}✓ PASS${NC} (File exists)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (File missing)"
    ((FAILED++))
fi

# Test 27: Events page file exists
echo -n "Testing: Events list page file... "
if [ -f "frontend/app/events/page.tsx" ]; then
    echo -e "${GREEN}✓ PASS${NC} (File exists)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (File missing)"
    ((FAILED++))
fi

# Test 28: Backend event schema exists
echo -n "Testing: Backend event schema... "
if [ -f "backend/src/api/event/content-types/event/schema.json" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Schema exists)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Schema missing)"
    ((FAILED++))
fi

# Test 29: Documentation exists
echo -n "Testing: Events system guide... "
if [ -f "EVENTS_SYSTEM_GUIDE.md" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Documentation exists)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Documentation missing)"
    ((WARNINGS++))
fi

# Test 30: Calendar guide exists
echo -n "Testing: Calendar integration guide... "
if [ -f "CALENDAR_INTEGRATION_GUIDE.md" ]; then
    echo -e "${GREEN}✓ PASS${NC} (Guide exists)"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠ WARNING${NC} (Guide missing)"
    ((WARNINGS++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7. CODE QUALITY CHECKS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 31: Calendar page has proper imports
echo -n "Testing: Calendar imports... "
if grep -q "useState.*useEffect" frontend/app/calendar/page.tsx 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC} (React hooks imported)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Missing imports)"
    ((FAILED++))
fi

# Test 32: Calendar has Google Calendar function
echo -n "Testing: Google Calendar integration code... "
if grep -q "generateGoogleCalendarUrl" frontend/app/calendar/page.tsx 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC} (Function exists)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Function missing)"
    ((FAILED++))
fi

# Test 33: Calendar has ICS export function
echo -n "Testing: ICS export code... "
if grep -q "downloadICS\|exportAllEvents" frontend/app/calendar/page.tsx 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC} (Export functions exist)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Export functions missing)"
    ((FAILED++))
fi

# Test 34: Admin page has AI function
echo -n "Testing: AI assistant code... "
if grep -q "handleAiGenerate" frontend/app/admin/events/page.tsx 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC} (AI function exists)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (AI function missing)"
    ((FAILED++))
fi

# Test 35: Admin page has authentication
echo -n "Testing: Admin authentication code... "
if grep -q "isAuthenticated\|handleLogin" frontend/app/admin/events/page.tsx 2>/dev/null; then
    echo -e "${GREEN}✓ PASS${NC} (Auth code exists)"
    ((PASSED++))
else
    echo -e "${RED}✗ FAIL${NC} (Auth code missing)"
    ((FAILED++))
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8. INTEGRATION TESTS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 36: Check if backend and frontend can communicate
echo -n "Testing: Backend-Frontend connection... "
if [ "$FRONTEND_RUNNING" = true ]; then
    if curl -s "$FRONTEND_URL/events" | grep -q "fetchEvents\|http://localhost:1337"; then
        echo -e "${GREEN}✓ PASS${NC} (Connection configured)"
        ((PASSED++))
    else
        echo -e "${YELLOW}⚠ WARNING${NC} (Cannot verify)"
        ((WARNINGS++))
    fi
else
    echo -e "${YELLOW}⚠ SKIP${NC} (Frontend not running)"
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
    SUCCESS_RATE=$(echo "scale=1; $PASSED * 100 / $TOTAL" | bc 2>/dev/null || echo "N/A")
    echo "Success Rate: ${SUCCESS_RATE}%"
fi

echo ""
echo "========================================="

# Recommendations
echo ""
echo -e "${BLUE}📋 RECOMMENDATIONS:${NC}"
echo ""

if [ "$FRONTEND_RUNNING" != true ]; then
    echo "• Start frontend: cd frontend && npm run dev"
fi

echo "• Create test events via admin panel:"
echo "  http://localhost:3000/admin/events"
echo ""
echo "• Test calendar view:"
echo "  http://localhost:3000/calendar"
echo ""
echo "• Test Google Calendar integration:"
echo "  1. Create an event in admin"
echo "  2. View it on calendar"
echo "  3. Click 'Add to Google Calendar'"
echo ""
echo "• Test .ics export:"
echo "  1. Go to calendar page"
echo "  2. Click 'Export All Events'"
echo "  3. Import file into calendar app"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ All critical tests passed!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some tests failed. Review above.${NC}"
    exit 1
fi
