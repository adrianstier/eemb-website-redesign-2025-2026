# 📅 Calendar & Google Calendar Integration Guide

## Overview

Your EEMB website now has a beautiful interactive calendar with full Google Calendar integration! Visitors can view events in a monthly grid, add individual events to their Google Calendar, or export the entire calendar.

---

## 🔗 Access the Calendar

**Calendar URL:** http://localhost:3000/calendar

The calendar link is now in the main navigation header, making it easily accessible from any page.

---

## ✨ Key Features

### 1. Interactive Monthly Calendar
- **Visual Grid Layout** - See all your events in a traditional monthly calendar view
- **Color-Coded Events** - Each event type has its own color for easy identification:
  - 🔵 Blue = Seminar
  - 🟣 Purple = Workshop
  - 🟢 Green = Conference
  - 🟡 Yellow = Lecture
  - 🩷 Pink = Social
  - 🔷 Teal = Field Trip
  - 🔴 Red = Defense
  - ⚫ Gray = Other
- **Today Highlighting** - Current date is highlighted in blue
- **Month Navigation** - Easily navigate between months with arrow buttons
- **Quick "Today" Button** - Jump back to the current month instantly

### 2. Click Any Date
When you click on a date:
- Sidebar shows all events for that day
- Each event displays:
  - Event type badge (color-coded)
  - Title and time
  - Location
  - Speaker (if applicable)
  - Action buttons

### 3. Google Calendar Integration

#### Add Individual Events
Every event has an **"Add to Google Calendar"** button that:
- Opens Google Calendar in a new tab
- Pre-fills all event details (title, date, time, location, description)
- Allows user to confirm and save to their calendar
- Works with personal Google accounts

#### How It Works
1. Click any event in the calendar
2. Click "Add to Google Calendar" button
3. Google Calendar opens with event details pre-filled
4. Click "Save" to add to your calendar

### 4. Export as .ics Files

#### Single Event Export
- Each event has a **"Download .ics"** button
- Creates a standard iCalendar (.ics) file
- Can be imported into:
  - Google Calendar
  - Apple Calendar
  - Microsoft Outlook
  - Any calendar app that supports .ics format

#### Full Calendar Export
- **"Export All Events"** button in the header
- Downloads entire calendar as single .ics file
- Includes all events (past and future)
- Perfect for bulk import or backup

### 5. Event Details Integration
- Click "View Details →" to see full event information
- Seamlessly links to the events list page
- Click event titles in the calendar grid to view details

---

## 🎯 How to Use Google Calendar Features

### Method 1: Add Single Event to Google Calendar

1. Go to http://localhost:3000/calendar
2. Click on any date with events
3. In the sidebar, find the event you want
4. Click **"Add to Google Calendar"** button
5. Google Calendar opens in new tab
6. Review event details
7. Click "Save" to add to your calendar

### Method 2: Download and Import .ics File

1. Go to http://localhost:3000/calendar
2. Click on event date in sidebar
3. Click **"Download .ics"** button
4. Save the .ics file to your computer
5. Open your calendar app (Google Calendar, Apple Calendar, etc.)
6. Import the .ics file:
   - **Google Calendar:** Settings → Import & Export → Select file → Import
   - **Apple Calendar:** File → Import → Select file
   - **Outlook:** File → Open & Export → Import/Export → Select file

### Method 3: Export Entire Calendar

1. Go to http://localhost:3000/calendar
2. Click **"Export All Events"** button in top right
3. Save `eemb-events.ics` file
4. Import into your calendar app using steps above
5. All EEMB events are now in your calendar!

---

## 📱 Mobile Support

The calendar is fully responsive and works great on:
- Desktop computers
- Tablets
- Mobile phones

On mobile:
- Calendar grid adjusts to smaller screens
- Easy touch navigation
- Tap any date to see events
- All Google Calendar features work

---

## 🔄 Auto-Sync with Backend

The calendar automatically pulls events from your Strapi backend:
- No manual updates needed
- When you create an event in admin panel, it appears immediately
- Edit/delete events in admin, calendar updates automatically
- Always shows the latest event data

---

## 💡 Tips for Best Results

### For Admins Creating Events

1. **Always add event type** - Ensures proper color coding on calendar
2. **Include location** - Helps users know where to go
3. **Add descriptions** - Exported to Google Calendar
4. **Mark important events as "Featured"** - Highlights them on the events list page

### For Users/Visitors

1. **Use "Add to Google Calendar"** for one-time events
2. **Export full calendar** if you want all events at once
3. **Re-export periodically** to get new events
4. **Set Google Calendar reminders** after importing

### For Recurring Events

- Mark event as "Recurring" in admin panel
- Describe pattern (e.g., "Weekly on Fridays")
- Users will see pattern in event description
- Consider creating separate event entries for each occurrence for better calendar integration

---

## 🛠️ Technical Details

### iCalendar (.ics) Format
The exported files use the standard iCalendar format (RFC 5545), which includes:
- `VCALENDAR` - Calendar container
- `VEVENT` - Each event
- `DTSTART/DTEND` - Start and end times
- `SUMMARY` - Event title
- `DESCRIPTION` - Full event details
- `LOCATION` - Event location
- `UID` - Unique identifier

### Google Calendar URL Format
Events use Google Calendar's public URL scheme:
```
https://calendar.google.com/calendar/render?
  action=TEMPLATE
  &text=[Event Title]
  &dates=[Start]/[End]
  &details=[Description]
  &location=[Location]
```

### Browser Compatibility
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔐 Privacy & Security

### No Login Required
- Viewing calendar: No login needed
- Adding to Google Calendar: Uses user's Google account
- Exporting .ics: No account needed

### Data Privacy
- Calendar data comes from public events API
- No personal user data collected
- Google Calendar integration uses Google's secure OAuth
- .ics files contain only public event information

---

## 📊 Calendar Statistics

View event statistics at a glance:
- Total events in selected month
- Events per day (shown on calendar grid)
- Multiple events indicated with "+X more" badge
- Legend shows all event type colors

---

## 🚀 Future Enhancements

Possible improvements for the calendar:

1. **Subscribe to Calendar URL**
   - Generate unique calendar feed URL
   - Users subscribe in Google Calendar
   - Automatic updates without re-importing

2. **Filter by Event Type**
   - Show only specific event types
   - Toggle event types on/off

3. **Search Events**
   - Search by title, speaker, or location
   - Highlight matching dates

4. **Week View**
   - Alternative week-by-week layout
   - Better for viewing detailed schedules

5. **RSVP Integration**
   - Track who's attending
   - Send automatic reminders

---

## 🎓 Quick Start Checklist

For Department Admins:
- [ ] Review calendar at http://localhost:3000/calendar
- [ ] Test adding an event to your Google Calendar
- [ ] Export calendar and import to your personal calendar
- [ ] Share calendar URL with faculty and students
- [ ] Update department website to link to calendar

For Faculty/Students:
- [ ] Bookmark http://localhost:3000/calendar
- [ ] Export full calendar to your Google Calendar
- [ ] Set reminders for important seminars
- [ ] Check calendar regularly for new events

---

## 📞 Support

### Common Issues

**Q: Events not showing on calendar?**
- Check if backend is running (http://localhost:1337)
- Verify events are published in Strapi admin
- Refresh the page

**Q: Google Calendar button not working?**
- Check if popup blockers are disabled
- Try right-click → "Open in new tab"
- Ensure you're logged into Google account

**Q: .ics file not importing?**
- Check file downloaded completely
- Try different calendar app
- Verify .ics file isn't corrupted (open in text editor)

**Q: Calendar showing wrong times?**
- Check your timezone settings
- Verify event times in admin panel
- Browser timezone detection should handle this automatically

---

## 🎉 You're All Set!

Your calendar integration is complete and ready to use! The calendar provides an intuitive way for your community to:

- **View** all events at a glance
- **Plan** their schedules around department activities
- **Add** events to their personal calendars
- **Share** events with colleagues
- **Stay** informed about upcoming seminars and workshops

Visit the calendar now: **http://localhost:3000/calendar**

Happy scheduling! 📅✨
