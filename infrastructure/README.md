# EEMB Infrastructure - DevOps & Deployment

**Purpose:** Infrastructure as Code, deployment configurations, and monitoring

## Directory Structure

```
infrastructure/
├── docker/              # Docker configurations
├── terraform/           # Infrastructure as Code (if needed)
├── nginx/               # Nginx configurations
├── monitoring/          # Monitoring and logging
└── ci-cd/               # GitHub Actions workflows
```

## Services Architecture

### Production Stack
- **Frontend:** Vercel (Next.js)
- **Backend:** Railway or DigitalOcean (Strapi)
- **Database:** Supabase (PostgreSQL)
- **Media:** Cloudinary (CDN)
- **DNS:** UCSB IT managed

### Development Stack
- **Frontend:** localhost:3000 (Next.js dev server)
- **Backend:** localhost:1337 (Strapi dev server)
- **Database:** Local PostgreSQL or Supabase
- **Media:** Local uploads or Cloudinary dev

## Environment Configuration

### Required Services

1. **Vercel** (Frontend hosting)
   - Automatic deploys from GitHub
   - Edge functions
   - Analytics

2. **Railway/DigitalOcean** (Backend hosting)
   - Strapi application
   - Auto-scaling
   - SSL certificates

3. **Supabase** (Database)
   - PostgreSQL 14+
   - Automatic backups
   - Connection pooling

4. **Cloudinary** (Media CDN)
   - Image optimization
   - Responsive images
   - Video support

## CI/CD Pipeline (To Be Created)

```yaml
# .github/workflows/deploy.yml
- Run tests
- Build applications
- Deploy to staging
- Run E2E tests
- Deploy to production (manual approval)
```

## Monitoring

- **Uptime:** Vercel Analytics
- **Errors:** Sentry
- **Performance:** Lighthouse CI
- **Security:** Dependabot

## Security Considerations

- SSL/TLS everywhere
- Environment variables for secrets
- Database connection pooling
- Rate limiting on API
- CORS configuration
- CSP headers

## Backup Strategy

- **Database:** Daily automated backups (Supabase)
- **Media:** Cloudinary handles backups
- **Code:** GitHub repository
- **Configurations:** Version controlled

## Disaster Recovery

- **RTO (Recovery Time Objective):** < 4 hours
- **RPO (Recovery Point Objective):** < 24 hours
- **Backup retention:** 30 days
- **Test recovery:** Monthly

## Cost Estimates

### Monthly Costs
- Vercel Pro: $20/month
- Railway/DigitalOcean: $20-40/month
- Supabase: $25/month
- Cloudinary: $89/month
- **Total:** ~$150-175/month

### Annual Costs
- ~$1,800-2,100/year infrastructure
- Domain: Managed by UCSB IT
- SSL: Included with hosting