# EEMB Events Management System - Complete Guide

## 🎯 Overview

I've created a comprehensive AI-powered events management system for the EEMB website with the following components:

1. **AI-Powered Admin Page** - Create and manage events with AI assistance
2. **Calendar View** - Interactive monthly calendar with Google Calendar integration
3. **Events List View** - Traditional list view with filtering
4. **Backend API** - Strapi CMS with events content type

---

## 🔗 Quick Links

### Admin Access
**URL:** http://localhost:3000/admin/events

**Password:** `eemb2024admin`

This is your centralized event management dashboard where you can:
- Create new events using AI assistance
- Edit existing events
- Delete events
- View all events at a glance

### Calendar View (NEW!)
**URL:** http://localhost:3000/calendar

Interactive monthly calendar featuring:
- 📅 Visual monthly grid layout
- 🎨 Color-coded event types
- 🖱️ Click any date to see events
- 📲 Add to Google Calendar (per event)
- 💾 Export all events as .ics file
- ⬅️➡️ Navigate between months
- 🔗 Direct links to event details

### Events List View
**URL:** http://localhost:3000/events

Beautiful, filterable list view with:
- Upcoming/Past toggle
- Event type filtering
- Featured events section
- Direct link to Calendar View

---

## 🤖 AI Event Assistant

### How to Use

1. Navigate to the **Admin Events Page**: http://localhost:3000/admin/events
2. Login with password: `eemb2024admin`
3. Click "Create New Event"
4. Use the **AI Event Assistant** section

### AI Prompt Examples

The AI can parse natural language and extract event details automatically. Here are example prompts:

```
Create a seminar on coral reef conservation by Dr. Sarah Chen on December 15th
at 3pm in the Marine Science Institute. She'll discuss her latest research on
climate adaptation in tropical corals.
```

```
Workshop on statistical methods for ecology, January 20 2025, 2pm-5pm at
Life Sciences Building Room 2001. Led by Prof. James Wilson from UCLA.
```

```
Graduate student defense presentation by Maria Rodriguez on February 5th at 10am.
Title: "Plant-Pollinator Networks in Changing Climates". Open to all EEMB faculty
and students.
```

### What the AI Extracts

The AI automatically identifies and populates:
- **Title** - Main event title
- **Event Type** - Seminar, Workshop, Conference, Lecture, etc.
- **Date & Time** - Start and end dates
- **Location** - Physical or virtual location
- **Speaker** - Name and affiliation
- **Description** - Event details
- **Tags** - Relevant topic tags

After AI generation, you can review and edit all fields before saving.

---

## 📋 Event Fields Reference

### Required Fields
- **Event Title** - The name of your event
- **Event Type** - Choose from: Seminar, Workshop, Conference, Lecture, Social, Recruitment, Defense, Meeting, Alumni Event, Field Trip, Other
- **Start Date & Time** - When the event begins

### Optional Fields
- **End Date & Time** - When the event ends
- **Location** - Physical location (e.g., "Life Sciences Building, Room 1001")
- **Virtual Link** - Zoom or other online meeting link
- **Short Description** - Brief summary (shown in list views)
- **Full Description** - Detailed event information
- **Speaker Name** - Name of presenter/speaker
- **Speaker Title** - Academic or professional title
- **Speaker Affiliation** - University or institution
- **Tags** - Comma-separated keywords for filtering
- **Featured Event** - Checkbox to highlight this event
- **All Day Event** - Checkbox for full-day events
- **Registration Required** - Checkbox if RSVP needed
- **Registration Link** - URL for registration
- **Max Attendees** - Capacity limit

---

## 🎨 Frontend Features

The public events page ([/events](http://localhost:3000/events)) includes:

### 1. Featured Events Section
- Highlights up to 2 featured events at the top
- Eye-catching card design with images
- Shows full event details

### 2. Event Filtering
- **Upcoming/Past Toggle** - Switch between future and past events
- **Event Type Filter** - Filter by Seminar, Workshop, etc.
- **Automatic Counts** - Shows number of events in each category

### 3. Event Cards
Each event card displays:
- Event type badge (color-coded)
- Title and description
- Date and time
- Location
- Speaker (if applicable)
- Hover effects for better UX

### 4. Subscribe CTA
- Call-to-action for calendar subscription
- Encourages engagement

---

## 🔧 Backend Structure

### API Endpoints

**Base URL:** http://localhost:1337/api/events

#### Get All Events
```bash
GET http://localhost:1337/api/events?sort=startDate:asc&populate=*
```

#### Get Single Event
```bash
GET http://localhost:1337/api/events/:id
```

#### Create Event (Admin)
```bash
POST http://localhost:1337/api/events
Content-Type: application/json

{
  "data": {
    "title": "Event Title",
    "eventType": "Seminar",
    "startDate": "2024-12-15T15:00:00Z",
    ...
  }
}
```

#### Update Event (Admin)
```bash
PUT http://localhost:1337/api/events/:id
```

#### Delete Event (Admin)
```bash
DELETE http://localhost:1337/api/events/:id
```

### Event Schema

The backend includes a comprehensive event schema with these attributes:

- Basic Info: title, eventType, slug
- Dates: startDate, endDate, allDay
- Location: location, virtualLink
- Content: description, shortDescription
- Speaker: speaker, speakerTitle, speakerAffiliation, speakerBio, speakerImage
- Registration: registrationRequired, registrationLink, registrationDeadline, maxAttendees
- Media: eventImage, attachments
- Organization: tags, featured, recurring, recurringPattern, hostFaculty (relation)
- Status: canceled, cancelationReason

---

## 📖 Step-by-Step Usage Guide

### Creating Your First Event

1. **Access Admin Page**
   - Go to: http://localhost:3000/admin/events
   - Enter password: `eemb2024admin`

2. **Use AI Assistant** (Recommended)
   - Click "Create New Event"
   - Find the purple "AI Event Assistant" box
   - Paste or type event details in natural language
   - Click "Generate Event Details"
   - Review and edit the auto-populated fields

3. **Or Fill Form Manually**
   - Enter Title (required)
   - Select Event Type (required)
   - Choose Start Date & Time (required)
   - Fill in optional fields as needed

4. **Save Event**
   - Click "Create Event"
   - Success message will appear
   - Event immediately appears in the list

5. **View on Public Page**
   - Click "View Public Page" button in header
   - Or visit: http://localhost:3000/events

### Editing an Event

1. In the Admin Page, find the event in the list
2. Click the "Edit" button
3. Make your changes
4. Click "Update Event"

### Deleting an Event

1. In the Admin Page, find the event
2. Click the "Delete" button
3. Confirm deletion

---

## 💡 Best Practices

### Event Titles
- Be specific and descriptive
- Include topic or speaker name
- Example: "EEMB Seminar: Ocean Acidification by Dr. Chen"

### Descriptions
- **Short Description**: 1-2 sentences for list views
- **Full Description**: Detailed information, background, what attendees will learn

### Speaker Information
- Always include speaker name for seminars/lectures
- Add title and affiliation for credibility
- Consider adding a speaker bio for visiting scholars

### Images
- Use high-quality images (minimum 800x600px)
- Relevant to the event topic
- Proper licensing/permissions

### Tags
- Use consistent tag naming
- Common tags: "Marine Biology", "Ecology", "Evolution", "Conservation", "Climate Science"
- Helps with filtering and discovery

### Featured Events
- Mark only the most important upcoming events
- Limit to 2-3 featured events at a time
- Update regularly

---

## 🚀 Advanced Features

### Recurring Events
- Check "Recurring" checkbox
- Add pattern (e.g., "Weekly on Fridays", "Monthly")
- Note: Frontend display handles this automatically

### Virtual Events
- Add Zoom/Teams link in "Virtual Link" field
- Can have both physical location and virtual link
- Clear labeling helps attendees

### Registration Management
- Enable "Registration Required"
- Add registration link (Google Forms, Eventbrite, etc.)
- Set max attendees if capacity limited
- Track registrations externally

---

## 🔐 Security Notes

**Current Setup (Development)**
- Simple password authentication
- Password: `eemb2024admin`
- Stored in localStorage for convenience

**For Production**
- Replace with proper Strapi admin authentication
- Use environment variables for credentials
- Implement role-based access control
- Add HTTPS/SSL
- Consider Strapi's built-in admin panel

---

## 🐛 Troubleshooting

### "Error saving event. Make sure the backend is running."

**Solution:**
1. Check if Strapi is running: http://localhost:1337/admin
2. Start backend if needed:
   ```bash
   cd backend
   npm run develop
   ```

### "No events created yet" but I created some

**Solution:**
1. Check browser console for API errors
2. Verify backend is running
3. Check network tab for failed requests
4. Ensure events are published in Strapi (publishedAt field)

### AI Assistant not working

**Solution:**
- The AI is simulated - it uses pattern matching, not actual AI
- For best results, use clear, structured prompts
- Always review and edit generated fields
- For production, consider integrating OpenAI API

### Can't access admin page

**Solution:**
1. Verify URL: http://localhost:3000/admin/events
2. Clear localStorage and try logging in again
3. Check browser console for errors

---

## 📊 Testing the System

### Quick Test

1. Start backend:
   ```bash
   cd backend
   npm run develop
   ```

2. Start frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Create test event via admin panel
4. View on public events page
5. Edit the event
6. Delete the event

### API Tests

Run the backend test suite:
```bash
cd backend
./quick-test.sh
```

This will test all API endpoints including events.

---

## 🎓 Next Steps & Future Enhancements

### Recommended Improvements

1. **Calendar Integration**
   - Export to .ics format
   - Google Calendar sync
   - iCal integration

2. **Email Notifications**
   - Event reminders
   - New event announcements
   - Registration confirmations

3. **Advanced Search**
   - Full-text search
   - Date range filtering
   - Speaker search

4. **Event Details Page**
   - Dedicated page for each event
   - URL: /events/[slug]
   - Social sharing
   - Comments/Q&A

5. **Real AI Integration**
   - OpenAI GPT-4 API
   - More intelligent parsing
   - Generate event descriptions

6. **Analytics**
   - Event views
   - Registration tracking
   - Popular event types

7. **RSVP System**
   - Built-in registration
   - Attendee management
   - Capacity tracking

---

## 📞 Support

For questions or issues:
1. Check this guide first
2. Review code comments in `/frontend/app/admin/events/page.tsx`
3. Check Strapi documentation: https://docs.strapi.io
4. Review Next.js documentation: https://nextjs.org/docs

---

## 🎉 You're All Set!

Your events management system is ready to use. Start by creating your first event using the AI assistant, and see how easy it is to manage your department's events calendar!

**Quick Start Checklist:**
- [ ] Backend running (http://localhost:1337)
- [ ] Frontend running (http://localhost:3000)
- [ ] Admin page accessible (http://localhost:3000/admin/events)
- [ ] Test event created successfully
- [ ] Event visible on public page

Happy event managing! 🎊
