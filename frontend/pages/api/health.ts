// Health Check API for Next.js Frontend
import type { NextApiRequest, NextApiResponse } from 'next'

interface HealthStatus {
  status: string
  timestamp: string
  uptime: number
  environment: string
  version: string
  checks?: {
    [key: string]: string
  }
}

/**
 * Health check endpoint for monitoring
 * GET /api/health
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthStatus>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
    })
  }

  const checks: { [key: string]: string } = {
    frontend: 'ok',
    api: 'unknown',
  }

  // Check API connectivity
  if (process.env.NEXT_PUBLIC_API_URL) {
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/health`
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Short timeout for health check
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        checks.api = 'ok'
      } else {
        checks.api = 'error'
      }
    } catch (error) {
      checks.api = 'error'
      console.error('API health check failed:', error)
    }
  } else {
    checks.api = 'not_configured'
  }

  const allHealthy = Object.values(checks).every(
    status => status === 'ok' || status === 'not_configured'
  )

  res.status(allHealthy ? 200 : 503).json({
    status: allHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
    checks,
  })
}