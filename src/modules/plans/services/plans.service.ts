/**
 * Plans Service
 * Handles eSIM plans/bundles API calls
 * Integrates with backend API
 */

import { apiClient } from '@/shared/services/api/client'
import type { ApiResponse } from '@/shared/types'

/**
 * Raw bundle response from API
 */
export interface ApiBundle {
  name: string
  description: string
  countries: Array<{
    name: string
    region: string
    iso: string
  }>
  dataAmount: number // in MB, -1 for unlimited
  duration: number // in days
  autostart: boolean
  unlimited: boolean
  roamingEnabled: boolean
  imageUrl?: string
  price: number
  group: string | null
  billingType: string
  potentialSpeeds: unknown
}

/**
 * Transformed bundle for frontend use
 */
export interface Bundle {
  id: string // Uses bundle.name as ID
  name: string
  description: string
  price: number
  currency: string // Defaults to USD
  data: string // Formatted from dataAmount (e.g., "1GB", "Unlimited")
  validity: string // Formatted from duration (e.g., "7 days", "30 days")
  countries?: string[] // Country ISO codes (for backward compatibility)
  countryObjects?: Array<{ name: string; region: string; iso: string }> // Full country objects
  countryIso?: string // First country ISO
  countryName?: string // First country name
  duration: number // Days
  dataAmount: number // MB
  unlimited: boolean
  imageUrl?: string
  group?: string[] | null
  roamingEnabled?: boolean
  [key: string]: unknown // For any additional fields
}

export interface BundlesResponse {
  bundles: ApiBundle[]
}

/**
 * Transform API bundle to frontend bundle format
 */
function transformBundle(apiBundle: ApiBundle): Bundle {
  try {
    // Format data amount
    let dataDisplay: string
    if (apiBundle.unlimited || apiBundle.dataAmount === -1) {
      dataDisplay = 'Unlimited'
    } else if (apiBundle.dataAmount >= 1000) {
      // Convert MB to GB, keep 1 decimal place if needed
      const gb = apiBundle.dataAmount / 1000
      dataDisplay = gb % 1 === 0 ? `${gb}GB` : `${gb.toFixed(1)}GB`
    } else {
      dataDisplay = `${apiBundle.dataAmount}MB`
    }

    // Format validity
    const validityDisplay = `${apiBundle.duration} ${apiBundle.duration === 1 ? 'day' : 'days'}`

    // Get country info
    const firstCountry = apiBundle.countries?.[0]
    const countryIso = firstCountry?.iso
    const countryName = firstCountry?.name
    const countryIsos = apiBundle.countries?.map(c => c.iso) || []

    return {
      id: apiBundle.name, // Use bundle name as identifier since the API doesn't provide a separate ID field
      name: apiBundle.name,
      description: apiBundle.description || '',
      price: apiBundle.price || 0,
      currency: 'USD', // Default currency
      data: dataDisplay,
      validity: validityDisplay,
      countries: countryIsos, // ISO codes for backward compatibility
      countryObjects: apiBundle.countries || [], // Full country objects for regional/global grouping
      countryIso: countryIso,
      countryName: countryName,
      duration: apiBundle.duration || 0,
      dataAmount: apiBundle.dataAmount || 0,
      unlimited: apiBundle.unlimited || false,
      imageUrl: apiBundle.imageUrl,
      group: apiBundle.group ? (Array.isArray(apiBundle.group) ? apiBundle.group : [apiBundle.group]) : null,
      // Keep original fields for reference
      autostart: apiBundle.autostart,
      roamingEnabled: apiBundle.roamingEnabled,
      billingType: apiBundle.billingType,
    }
  } catch (error) {
    console.error('Error transforming bundle:', apiBundle, error)
    throw new Error(`Failed to transform bundle: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

class PlansService {
  /**
   * Get all bundles/plans
   * GET /api/v1/bundles
   * Requests all bundles by using a large size parameter
   */
  async getBundles(): Promise<Bundle[]> {
    // Request all bundles by using a large size (backend returns all if size >= 1000)
    const response = await apiClient.get<ApiResponse<BundlesResponse>>('/bundles?size=10000')
    const apiBundles = response.data?.bundles || []
    return apiBundles.map(transformBundle)
  }

  /**
   * Get bundles by country
   * GET /api/v1/bundles?countryIso={code}
   */
  async getBundlesByCountry(countryIso: string): Promise<Bundle[]> {
    try {
      console.log('Fetching bundles for country ISO:', countryIso)
      const response = await apiClient.get<ApiResponse<BundlesResponse>>(
        `/bundles?countryIso=${countryIso}`
      )
      console.log('Raw API response:', response)
      
      // Handle response structure
      const apiBundles = response?.data?.bundles || []
      console.log('Extracted bundles array:', apiBundles)
      
      if (apiBundles.length === 0) {
        console.warn('No bundles found for country ISO:', countryIso)
      }
      
      const transformedBundles = apiBundles.map(transformBundle)
      console.log('Transformed bundles:', transformedBundles)
      return transformedBundles
    } catch (error) {
      console.error('Error fetching bundles by country:', error)
      throw error
    }
  }

  /**
   * Get bundle details by ID (name)
   * GET /api/v1/bundles/{bundleId}
   */
  async getBundleById(bundleId: string): Promise<Bundle> {
    const response = await apiClient.get<ApiResponse<ApiBundle>>(`/bundles/${bundleId}`)
    if (!response.data) throw new Error('Bundle not found')
    return transformBundle(response.data)
  }

  /**
   * Get local eSIM bundles (single country)
   * GET /api/v1/bundles?type=local
   * Requests all bundles by using a large size parameter
   */
  async getLocalBundles(): Promise<Bundle[]> {
    // Request all bundles by using a large size (backend returns all if size >= 1000)
    const response = await apiClient.get<ApiResponse<BundlesResponse>>('/bundles?type=local&size=10000')
    const apiBundles = response.data?.bundles || []
    return apiBundles.map(transformBundle)
  }

  /**
   * Get regional eSIM bundles (multiple countries in a region)
   * GET /api/v1/bundles?type=regional
   * Requests all bundles by using a large size parameter
   */
  async getRegionalBundles(): Promise<Bundle[]> {
    // Request all bundles by using a large size (backend returns all if size >= 1000)
    const response = await apiClient.get<ApiResponse<BundlesResponse>>('/bundles?type=regional&size=10000')
    const apiBundles = response.data?.bundles || []
    return apiBundles.map(transformBundle)
  }

  /**
   * Get global eSIM bundles (many countries globally)
   * GET /api/v1/bundles?type=global
   * Requests all bundles by using a large size parameter
   */
  async getGlobalBundles(): Promise<Bundle[]> {
    // Request all bundles by using a large size (backend returns all if size >= 1000)
    const response = await apiClient.get<ApiResponse<BundlesResponse>>('/bundles?type=global&size=10000')
    const apiBundles = response.data?.bundles || []
    return apiBundles.map(transformBundle)
  }

  /**
   * Legacy methods for backward compatibility
   */
  async getPlans(): Promise<Bundle[]> {
    return this.getBundles()
  }

  async getPlansByCountry(countryCode: string): Promise<Bundle[]> {
    return this.getBundlesByCountry(countryCode)
  }

  async getPlanById(planId: string): Promise<Bundle> {
    return this.getBundleById(planId)
  }
}

export const plansService = new PlansService()
