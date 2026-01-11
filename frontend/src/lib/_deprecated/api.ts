/**
 * API utility module with consistent error handling
 * Provides type-safe API calls with proper error handling
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1337'

/**
 * Custom API Error class with status code
 */
export class APIError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Network Error class for connection issues
 */
export class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}

/**
 * API response wrapper type
 */
export interface APIResponse<T> {
  data: T
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

/**
 * Fetch options with additional configuration
 */
interface FetchOptions extends RequestInit {
  timeout?: number
  retry?: number
  params?: Record<string, string | number | boolean>
}

/**
 * Build URL with query parameters
 */
function buildURL(endpoint: string, params?: Record<string, string | number | boolean>): string {
  const url = new URL(`${API_URL}${endpoint}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
  }

  return url.toString()
}

/**
 * Main fetch function with error handling and retries
 */
export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = 30000,
    retry = 1,
    params,
    ...fetchOptions
  } = options

  const url = buildURL(endpoint, params)

  // Create abort controller for timeout
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  // Merge default headers
  const headers = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

  let lastError: Error | null = null

  // Retry logic
  for (let attempt = 0; attempt < retry; attempt++) {
    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      // Check if response is ok
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new APIError(
          response.status,
          errorData.error?.message || `API Error: ${response.status} ${response.statusText}`,
          errorData
        )
      }

      // Parse JSON response
      const data = await response.json()
      return data
    } catch (error) {
      lastError = error as Error

      // Don't retry on client errors (4xx)
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        throw error
      }

      // Don't retry on abort
      if ((error as any)?.name === 'AbortError') {
        throw new NetworkError('Request timeout')
      }

      // Retry on network errors
      if (attempt < retry - 1) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
        continue
      }
    }
  }

  clearTimeout(timeoutId)

  // Throw last error if all retries failed
  if (lastError instanceof Error) {
    throw lastError
  }

  throw new NetworkError('Unknown error occurred')
}

/**
 * GET request helper
 */
export async function get<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  options?: FetchOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'GET',
    params,
    ...options,
  })
}

/**
 * POST request helper
 */
export async function post<T, D = any>(
  endpoint: string,
  data?: D,
  options?: FetchOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  })
}

/**
 * PUT request helper
 */
export async function put<T, D = any>(
  endpoint: string,
  data?: D,
  options?: FetchOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
    ...options,
  })
}

/**
 * DELETE request helper
 */
export async function del<T>(
  endpoint: string,
  options?: FetchOptions
): Promise<T> {
  return fetchAPI<T>(endpoint, {
    method: 'DELETE',
    ...options,
  })
}

/**
 * Specific API endpoints for EEMB
 */
export const api = {
  // Faculty endpoints
  faculty: {
    getAll: (limit = 200) =>
      get<APIResponse<any[]>>('/api/faculties', {
        'pagination[limit]': limit
      }),
    getOne: (slug: string) =>
      get<APIResponse<any>>(`/api/faculties/${slug}`),
  },

  // Staff endpoints
  staff: {
    getAll: (limit = 100) =>
      get<APIResponse<any[]>>('/api/staff-members', {
        'pagination[limit]': limit
      }),
  },

  // Students endpoints
  students: {
    getAll: (limit = 100) =>
      get<APIResponse<any[]>>('/api/graduate-students', {
        'pagination[limit]': limit
      }),
  },

  // News endpoints
  news: {
    getAll: (limit = 20) =>
      get<APIResponse<any[]>>('/api/news', {
        'pagination[limit]': limit
      }),
    getOne: (slug: string) =>
      get<APIResponse<any>>(`/api/news/${slug}`),
  },

  // Events endpoints
  events: {
    getAll: (limit = 20) =>
      get<APIResponse<any[]>>('/api/events', {
        'pagination[limit]': limit
      }),
    getOne: (id: number) =>
      get<APIResponse<any>>(`/api/events/${id}`),
  },

  // Contact form
  contact: {
    submit: (data: any) =>
      post<{ success: boolean; message: string }>('/api/contact', data),
  },
}

/**
 * Error handler helper
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    // Handle specific API errors
    switch (error.status) {
      case 400:
        return 'Invalid request. Please check your input.'
      case 401:
        return 'Authentication required.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      case 503:
        return 'Service temporarily unavailable. Please try again later.'
      default:
        return error.message || `API Error: ${error.status}`
    }
  }

  if (error instanceof NetworkError) {
    return 'Network connection failed. Please check your internet connection.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'An unexpected error occurred.'
}