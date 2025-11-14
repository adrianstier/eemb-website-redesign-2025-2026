# Backend Dockerfile - Strapi CMS
FROM node:18-alpine AS base

# Install dependencies for node-gyp
RUN apk update && apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

WORKDIR /srv/app

# Development stage
FROM base AS development

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build Strapi admin
RUN npm run build

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:1337/_health || exit 1

# Start Strapi in development mode
CMD ["npm", "run", "develop"]

# Production stage
FROM base AS production

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application
COPY --from=development /srv/app/dist ./dist
COPY --from=development /srv/app/build ./build
COPY --from=development /srv/app/public ./public
COPY --from=development /srv/app/src ./src
COPY --from=development /srv/app/config ./config
COPY --from=development /srv/app/database ./database

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S strapi -u 1001 -G nodejs

# Change ownership
RUN chown -R strapi:nodejs /srv/app

# Switch to non-root user
USER strapi

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:1337/_health || exit 1

# Start Strapi in production mode
CMD ["npm", "start"]