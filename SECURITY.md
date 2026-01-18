# Security Documentation

This document outlines security practices, configuration requirements, and deployment checklists for the EEMB website.

## Table of Contents

- [Security Architecture](#security-architecture)
- [Environment Variables](#environment-variables)
- [Authentication & Authorization](#authentication--authorization)
- [API Security](#api-security)
- [Deployment Checklist](#deployment-checklist)
- [Incident Response](#incident-response)
- [Security Contacts](#security-contacts)

---

## Security Architecture

### Frontend (Next.js)

- **Authentication**: Google OAuth via Supabase Auth
- **Authorization**: Role-based access control (RBAC) via `user_roles` table
- **Session Management**: Supabase handles session tokens with automatic refresh
- **Security Headers**: CSP, X-Frame-Options, HSTS configured in `next.config.js`

### Backend (Supabase)

- **Database**: PostgreSQL with Row Level Security (RLS)
- **API**: Auto-generated REST and GraphQL with RLS enforcement
- **Storage**: Supabase Storage with bucket-level policies

### Security Headers

The following headers are configured in `frontend/next.config.js`:

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | Strict policy | Prevents XSS attacks |
| X-Frame-Options | DENY | Prevents clickjacking |
| X-Content-Type-Options | nosniff | Prevents MIME sniffing |
| Referrer-Policy | strict-origin-when-cross-origin | Controls referrer information |
| Strict-Transport-Security | max-age=31536000 | Enforces HTTPS |
| Permissions-Policy | Restrictive | Limits browser features |

---

## Environment Variables

### Generating Secure Secrets

Always use cryptographically secure random values for secrets:

```bash
# Generate a 32-byte (256-bit) random string
openssl rand -base64 32

# Generate a 64-byte (512-bit) random string for high-security keys
openssl rand -base64 64

# Generate a hex string
openssl rand -hex 32
```

### Required Variables

#### Frontend (`frontend/.env.local`)

| Variable | Description | Security Notes |
|----------|-------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Public, but validate RLS policies |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | Public, relies on RLS for security |
| `REVALIDATION_TOKEN` | Webhook authentication | **Must be secure random, min 32 chars** |
| `CONTACT_EMAIL` | Contact form recipient | No secrets, but don't expose personal emails |

#### Backend (`backend/.env`)

| Variable | Description | Security Notes |
|----------|-------------|----------------|
| `APP_KEYS` | Application encryption keys | **Generate 4 unique 256-bit keys** |
| `API_TOKEN_SALT` | API token hashing salt | **Generate unique 256-bit value** |
| `ADMIN_JWT_SECRET` | Admin panel JWT signing | **Generate unique 256-bit value** |
| `JWT_SECRET` | API JWT signing | **Generate unique 256-bit value** |
| `TRANSFER_TOKEN_SALT` | Data transfer token salt | **Generate unique 256-bit value** |
| `DATABASE_PASSWORD` | PostgreSQL password | **Never use default in production** |

### Example Secure Configuration

```bash
# Generate all backend secrets at once
echo "APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
```

---

## Authentication & Authorization

### OAuth Flow

1. User clicks "Sign in with Google"
2. Redirected to Google OAuth consent screen
3. Google redirects to `/auth/callback` with authorization code
4. Supabase exchanges code for tokens
5. Session established with secure cookies

### Protected Routes

Routes protected by authentication middleware:

- `/admin/*` - Requires admin role
- `/faculty/profile/*` - Requires authenticated user

### Role-Based Access Control

Roles are stored in the `user_roles` table:

| Role | Access Level |
|------|--------------|
| `admin` | Full access to admin panel and all APIs |
| `faculty` | Can edit own profile |
| `staff` | Can edit own profile |

### Supabase RLS Policies

**Critical**: Ensure RLS is enabled and policies are correctly configured:

```sql
-- Example: Only admins can modify user_roles
CREATE POLICY "Admins can manage roles"
ON user_roles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Example: Users can view their own role
CREATE POLICY "Users can view own role"
ON user_roles
FOR SELECT
USING (user_id = auth.uid());
```

---

## API Security

### Rate Limiting

The contact form API (`/api/contact`) implements rate limiting:

- **Window**: 1 hour
- **Max Requests**: 5 per IP per window
- **Response**: 429 Too Many Requests when exceeded

### Input Validation

All API endpoints validate:

- Required fields presence
- Field length limits
- Email format validation
- Data type validation via TypeScript

### Bot Protection

Contact form uses honeypot field technique:

- Hidden `website` field in form
- If filled, submission silently rejected
- Legitimate users never see this field

---

## Deployment Checklist

### Pre-Deployment Security Review

- [ ] **Secrets**: All environment variables use unique, secure random values
- [ ] **Dependencies**: Run `npm audit` and fix critical/high vulnerabilities
- [ ] **RLS Policies**: Verify all Supabase tables have appropriate RLS policies
- [ ] **CORS**: Verify CORS only allows production domains
- [ ] **CSP**: Test Content Security Policy doesn't break functionality
- [ ] **HTTPS**: Confirm SSL/TLS certificate is valid and HSTS is enabled

### Production Environment

- [ ] `NODE_ENV=production` is set
- [ ] Debug logging is disabled
- [ ] Error messages don't expose internal details
- [ ] Database uses strong credentials (not defaults)
- [ ] Backups are configured and tested

### Monitoring

- [ ] Error tracking (Sentry) is configured
- [ ] Security logging is enabled
- [ ] Alerting for suspicious activity is set up
- [ ] Regular security scan schedule established

---

## Incident Response

### Security Issue Reporting

If you discover a security vulnerability:

1. **Do not** create a public GitHub issue
2. Email security concerns to: `eemb-web@ucsb.edu`
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment

### Response Process

1. **Acknowledge** - Confirm receipt within 24 hours
2. **Assess** - Evaluate severity and impact
3. **Remediate** - Develop and test fix
4. **Deploy** - Push fix to production
5. **Notify** - Inform affected parties if necessary

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| Critical | Active exploitation, data breach | Immediate |
| High | Easily exploitable, significant impact | 24 hours |
| Medium | Requires specific conditions | 1 week |
| Low | Minor impact, defense in depth | Next release |

---

## Security Contacts

| Role | Contact |
|------|---------|
| Website Administrator | eemb-web@ucsb.edu |
| UCSB IT Security | security@ucsb.edu |
| Department Contact | EEMB Main Office |

---

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-01-18 | 1.0 | Initial security documentation |

---

*This document should be reviewed and updated quarterly or after any significant security changes.*
