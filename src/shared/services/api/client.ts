/**
 * API Client
 * Centralized HTTP client for backend API integration
 * Ready for Spring Boot backend integration
 */

import { apiKeyConfig } from '@/shared/utils/apiKeyConfig'

// Use proxy in development (via Vite), full URL in production
// When using Vite proxy, use relative path '/api'
// When not using proxy, use full URL 'http://localhost:8080/api'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.DEV ? '/api' : 'http://localhost:8080/api')

export interface ApiError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export class ApiClient {
  private baseURL: string

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const isFormData = options.body instanceof FormData
    
    const config: RequestInit = {
      headers: {
        // Don't set Content-Type for FormData, browser will set it with boundary
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
      },
      ...options,
    }

    // API key is REQUIRED for all requests (except auth endpoints)
    // Check if this is an auth endpoint that doesn't need API key
    const isAuthEndpoint = endpoint.startsWith('/auth/')
    const isHealthEndpoint = endpoint.startsWith('/health/')
    
    if (!isAuthEndpoint && !isHealthEndpoint) {
      const apiKey = apiKeyConfig.getApiKey()
      const apiSecret = apiKeyConfig.getApiSecret()
      
      if (!apiKey) {
        const error: ApiError = {
          message: 'API key is required. Please configure your API key in the admin panel or set VITE_API_KEY environment variable.',
          status: 401,
        }
        throw error
      }
      
      config.headers = {
        ...config.headers,
        'X-API-Key': apiKey,
      }
      
      if (apiSecret) {
        config.headers = {
          ...config.headers,
          'X-API-Secret': apiSecret,
        }
      }
    }
    
    // Add auth token if available (for user authentication - used in addition to API key)
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw {
          message: errorData.message || response.statusText,
          status: response.status,
          errors: errorData.errors,
        } as ApiError
      }

      return await response.json()
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) {
        throw error
      }
      console.error('API Request failed:', error)
      throw {
        message: 'Network error. Please check your connection.',
        status: 0,
      } as ApiError
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' })
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const body = data instanceof FormData 
      ? data 
      : data ? JSON.stringify(data) : undefined
    
    return this.request<T>(endpoint, {
      method: 'POST',
      body,
    })
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' })
  }
}

// Export singleton instance
export const apiClient = new ApiClient()

