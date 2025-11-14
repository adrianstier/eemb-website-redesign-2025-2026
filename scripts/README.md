# EEMB Scripts - Automation & Utilities

**Purpose:** Helper scripts for development, deployment, and maintenance

## Directory Structure

```
scripts/
├── data-import/         # Import scraped data to Strapi
├── backup/              # Database backup scripts
├── deploy/              # Deployment automation
└── utils/               # Development utilities
```

## Planned Scripts (To Be Created)

### Data Import (Week 1-2)
- `import_faculty.py` - Import faculty from scraped CSV to Strapi
- `import_alumni.py` - Import alumni data
- `import_pages.py` - Import page content
- `upload_images.py` - Upload images to Cloudinary

### Backup Scripts
- `backup_database.sh` - PostgreSQL backup
- `backup_media.sh` - Cloudinary media backup
- `restore_database.sh` - Database restoration

### Deployment
- `deploy_backend.sh` - Deploy Strapi to Railway
- `deploy_frontend.sh` - Deploy Next.js to Vercel
- `health_check.sh` - Verify deployments

### Development Utilities
- `seed_database.py` - Seed development data
- `clean_database.py` - Reset database
- `generate_types.sh` - Generate TypeScript types from Strapi

## Usage Examples

```bash
# Import faculty data (after scraping)
python scripts/data-import/import_faculty.py \
  --csv scraping/data/faculty-cleaned.csv \
  --api http://localhost:1337

# Backup database
./scripts/backup/backup_database.sh

# Deploy to production
./scripts/deploy/deploy_backend.sh --env production
```

## Environment Variables

Scripts will use `.env` files:
- `.env.development` - Local development
- `.env.staging` - Staging environment
- `.env.production` - Production

## Dependencies

- Python 3.11+ (for data scripts)
- Node.js 18+ (for TypeScript generation)
- PostgreSQL client (for backups)
- AWS CLI (for S3 backups, if used)