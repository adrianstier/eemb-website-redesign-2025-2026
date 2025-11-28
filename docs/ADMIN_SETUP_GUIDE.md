# EEMB Admin Dashboard Setup Guide

## Overview

The EEMB website now has a fully functional admin dashboard where you can manage all people data (faculty, students, and staff) directly through a web interface.

## Features

✅ **Secure Authentication** - Login with username/password
✅ **Faculty Management** - Edit profiles, bios, research interests, contact info
✅ **Student Management** - Edit graduate student profiles and advisors
✅ **Staff Management** - Edit staff positions and responsibilities
✅ **Real-time Updates** - Changes are immediately reflected on the website
✅ **Search & Filter** - Quickly find people to edit
✅ **Responsive Design** - Works on desktop and mobile

## Access Points

1. **Custom Admin Panel**: http://localhost:3000/admin
   - Beautiful, user-friendly interface
   - Integrated with your website design
   - Easy-to-use edit forms

2. **Strapi CMS Panel**: http://localhost:1337/admin
   - Full CMS capabilities
   - Advanced content management
   - Database administration

## Getting Started

### Step 1: Create an Admin User

Run the registration script:

```bash
node scripts/create-admin-user.js
```

You'll be prompted to enter:
- Username (e.g., `admin`)
- Email (e.g., `admin@eemb.ucsb.edu`)
- Password (choose a secure password)

### Step 2: Login

1. Navigate to http://localhost:3000/admin
2. Enter your username/email and password
3. Click "Sign In"

### Step 3: Start Managing People

From the dashboard, click on:
- **Manage Faculty** - Edit 65 faculty profiles
- **Manage Students** - Edit 35 graduate student profiles
- **Manage Staff** - Edit 19 staff member profiles

## Managing People

### Faculty Management

1. Click "Manage Faculty" from the dashboard
2. Use the search box to find a specific faculty member
3. Click "Edit" on any profile
4. Update any of these fields:
   - Full Name
   - Title
   - Email
   - Phone
   - Office
   - Bio
   - Research Interests (comma-separated)
   - Lab Website
   - Google Scholar URL
   - ORCID
5. Click "Save Changes"

### Student Management

1. Click "Manage Students" from the dashboard
2. Search for a student
3. Click "Edit" and update:
   - Full Name
   - Email
   - Phone
   - Office
   - Degree Program (PhD/MS)
   - Advisor
4. Click "Save Changes"

### Staff Management

1. Click "Manage Staff" from the dashboard
2. Find the staff member
3. Click "Edit" and update:
   - Full Name
   - Title/Position
   - Email
   - Phone
   - Office
   - Department
   - Responsibilities (comma-separated)
4. Click "Save Changes"

## Security Features

- **JWT Authentication** - Secure token-based login
- **Protected Routes** - All admin pages require authentication
- **Local Storage** - Tokens stored securely in browser
- **Auto-redirect** - Logged out users redirected to login

## Advanced: Strapi CMS

For advanced users, the full Strapi admin panel provides:

1. **Content Types** - Modify database schemas
2. **Media Library** - Upload and manage images
3. **User Roles** - Configure permissions
4. **API Tokens** - Generate API keys
5. **Plugins** - Install extensions

Access at: http://localhost:1337/admin

### Creating a Strapi Admin User

The first time you access http://localhost:1337/admin, you'll be prompted to create an admin account. This is separate from the regular admin user.

## Troubleshooting

### "Invalid credentials" error
- Double-check username/email and password
- Ensure you ran the create-admin-user script
- Try registering a new user

### Changes not showing on website
- Hard refresh the browser (Cmd+Shift+R or Ctrl+Shift+R)
- Check that the backend is running on port 1337
- Verify the frontend is running on port 3000

### Can't access admin panel
- Ensure both backend and frontend servers are running:
  ```bash
  # Terminal 1 - Backend
  cd backend && npm run develop

  # Terminal 2 - Frontend
  cd frontend && npm run dev
  ```

### Logged out unexpectedly
- Tokens expire after a period of inactivity
- Simply log in again

## Database Structure

The admin panel manages these Strapi collections:

- **faculties** - 65 faculty members (professors, researchers, emeriti, lecturers)
- **graduate-students** - 35 PhD and MS students
- **staff-members** - 19 staff positions

All changes are stored in: `backend/.tmp/data.db` (SQLite database)

## API Endpoints

If you need to integrate with external tools:

- `GET /api/faculties` - List all faculty
- `PUT /api/faculties/:id` - Update a faculty member
- `GET /api/graduate-students` - List all students
- `PUT /api/graduate-students/:id` - Update a student
- `GET /api/staff-members` - List all staff
- `PUT /api/staff-members/:id` - Update a staff member

All API requests require an `Authorization: Bearer <token>` header.

## Best Practices

1. **Regular Backups** - Periodically backup `backend/.tmp/data.db`
2. **Strong Passwords** - Use unique, complex passwords
3. **Test Changes** - Preview changes on the public site
4. **Consistent Formatting** - Use consistent formatting for phone numbers, emails, etc.
5. **Research Interests** - Use commas to separate multiple interests

## Support

For issues or questions:
- Check the [Strapi Documentation](https://docs.strapi.io/)
- Review the [Next.js Documentation](https://nextjs.org/docs)
- Consult the project's GitHub repository

---

**Version**: 1.0
**Last Updated**: November 2025
**Maintained By**: EEMB Web Team
