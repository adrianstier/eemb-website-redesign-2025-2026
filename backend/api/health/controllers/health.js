// Health Check Controller for Strapi
'use strict'

/**
 * Health check controller
 * Provides endpoints for monitoring application health
 */

module.exports = {
  /**
   * Basic health check
   * GET /api/health
   */
  async check(ctx) {
    ctx.body = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    }
  },

  /**
   * Detailed health check with dependencies
   * GET /api/health/live
   */
  async live(ctx) {
    const checks = {
      api: 'ok',
      database: 'unknown',
      redis: 'unknown',
      storage: 'unknown',
    }

    // Check database connection
    try {
      await strapi.db.connection.raw('SELECT 1')
      checks.database = 'ok'
    } catch (error) {
      checks.database = 'error'
      strapi.log.error('Database health check failed:', error)
    }

    // Check Redis connection (if configured)
    if (strapi.redis) {
      try {
        await strapi.redis.ping()
        checks.redis = 'ok'
      } catch (error) {
        checks.redis = 'error'
        strapi.log.error('Redis health check failed:', error)
      }
    } else {
      checks.redis = 'not_configured'
    }

    // Check storage (Cloudinary)
    if (process.env.CLOUDINARY_URL) {
      try {
        const cloudinary = require('cloudinary').v2
        await cloudinary.api.ping()
        checks.storage = 'ok'
      } catch (error) {
        checks.storage = 'error'
        strapi.log.error('Storage health check failed:', error)
      }
    } else {
      checks.storage = 'not_configured'
    }

    const allHealthy = Object.values(checks).every(
      status => status === 'ok' || status === 'not_configured'
    )

    ctx.status = allHealthy ? 200 : 503
    ctx.body = {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
      version: strapi.config.get('info.version', '1.0.0'),
      uptime: process.uptime(),
    }
  },

  /**
   * Readiness check for load balancers
   * GET /api/health/ready
   */
  async ready(ctx) {
    const isReady = strapi.isLoaded && !strapi.isReloading

    ctx.status = isReady ? 200 : 503
    ctx.body = {
      ready: isReady,
      timestamp: new Date().toISOString(),
    }
  },

  /**
   * Application metrics
   * GET /api/health/metrics
   */
  async metrics(ctx) {
    const memUsage = process.memoryUsage()
    const cpuUsage = process.cpuUsage()

    // Get database stats
    let dbStats = {}
    try {
      const result = await strapi.db.connection.raw(`
        SELECT
          COUNT(*) as total_connections,
          COUNT(*) FILTER (WHERE state = 'active') as active_connections,
          COUNT(*) FILTER (WHERE state = 'idle') as idle_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      `)
      dbStats = result.rows[0] || {}
    } catch (error) {
      strapi.log.error('Failed to get database stats:', error)
    }

    // Get content stats
    const contentStats = {}
    const contentTypes = ['faculties', 'alumnis', 'articles', 'events']

    for (const type of contentTypes) {
      try {
        contentStats[type] = await strapi.db.query(`api::${type}.${type}`).count()
      } catch (error) {
        contentStats[type] = 0
      }
    }

    ctx.body = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
      },
      cpu: {
        user: Math.round(cpuUsage.user / 1000000),
        system: Math.round(cpuUsage.system / 1000000),
      },
      database: dbStats,
      content: contentStats,
      version: {
        node: process.version,
        strapi: strapi.config.get('info.strapi', '4.x'),
        app: strapi.config.get('info.version', '1.0.0'),
      },
    }
  },

  /**
   * Application info
   * GET /api/health/info
   */
  async info(ctx) {
    ctx.body = {
      name: 'EEMB Website API',
      version: strapi.config.get('info.version', '1.0.0'),
      description: 'UC Santa Barbara EEMB Department Website Backend',
      environment: process.env.NODE_ENV || 'development',
      features: {
        authentication: true,
        fileUpload: !!process.env.CLOUDINARY_URL,
        emailService: !!process.env.SMTP_HOST,
        caching: !!strapi.redis,
        search: !!process.env.ALGOLIA_APP_ID,
      },
      documentation: '/documentation',
      support: 'eemb-it@ucsb.edu',
    }
  },
}