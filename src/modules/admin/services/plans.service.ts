/**
 * Admin Plans Service
 * Handles paginated plan/bundle fetching for admin panel
 */

import { apiClient } from '@/shared/services/api/client'
import type { Bundle } from '@/shared/types'

export interface PaginatedBundlesResponse {
  bundles: Bundle[]
  // Note: eSIMGo API may not return total count, so we'll track it client-side
}

class AdminPlansService {
  /**
   * Get all plans complete (loads all plans for client-side filtering)
   * GET /api/admin/plans/all
   */
  async getAllPlansComplete(): Promise<PaginatedBundlesResponse> {
    const response = await apiClient.get<{ data: { bundles: any[] } }>(
      '/admin/plans/all'
    )

    // Transform API bundles to frontend Bundle format
    const bundles = (response.data?.bundles || []).map(this.transformBundle)
    return { bundles }
  }

  /**
   * Get all plans with pagination and search (legacy endpoint)
   * GET /api/admin/plans?page=1&perPage=20&search=term
   */
  async getAllPlans(
    page: number = 1,
    perPage: number = 20,
    direction: string = 'asc',
    orderBy?: string,
    search?: string
  ): Promise<PaginatedBundlesResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      perPage: perPage.toString(),
      direction,
    })
    if (orderBy) {
      params.append('orderBy', orderBy)
    }
    if (search && search.trim()) {
      params.append('search', search.trim())
    }

    const response = await apiClient.get<{ data: { bundles: any[] } }>(
      `/admin/plans?${params.toString()}`
    )

    // Transform API bundles to frontend Bundle format
    const bundles = (response.data?.bundles || []).map(this.transformBundle)
    return { bundles }
  }

  /**
   * Get regional bundles filtered by region
   * GET /api/admin/plans/regional?region=Europe
   */
  async getRegionalBundlesByRegion(region?: string): Promise<PaginatedBundlesResponse> {
    const params = new URLSearchParams()
    if (region && region.trim()) {
      params.append('region', region.trim())
    }

    const response = await apiClient.get<{ data: { bundles: any[] } }>(
      `/admin/plans/regional?${params.toString()}`
    )

    const bundles = (response.data?.bundles || []).map(this.transformBundle)
    return { bundles }
  }

  /**
   * Get list of available regions
   * GET /api/admin/plans/regions
   */
  async getAvailableRegions(): Promise<string[]> {
    const response = await apiClient.get<{ data: string[] }>('/admin/plans/regions')
    return response.data || []
  }

  /**
   * Transform API bundle to frontend Bundle format
   */
  private transformBundle(apiBundle: any): Bundle {
    // Format data amount
    let dataDisplay: string
    if (apiBundle.unlimited || apiBundle.dataAmount === -1) {
      dataDisplay = 'Unlimited'
    } else if (apiBundle.dataAmount >= 1000) {
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
    const countryIsos = apiBundle.countries?.map((c: any) => c.iso) || []

    // Determine type based on countries count, country name, and roamingEnabled
    let type = 'Local'
    
    // Check country name for global indicators
    const firstCountryName = countryName || ''
    const firstCountryIso = countryIso || ''
    const isGlobalByName = firstCountryName.includes('Global') ||
                          firstCountryName.includes('Europe + USA') ||
                          firstCountryName === 'Asia' ||
                          firstCountryName === 'Oceania' ||
                          firstCountryName === 'North America' ||
                          firstCountryName === 'Middle East' ||
                          firstCountryName === 'CENAM' ||
                          firstCountryName === 'CIS' ||
                          firstCountryName === 'Europe Lite' ||
                          firstCountryName === 'Europe+' ||
                          firstCountryIso.includes('Global')
    
    // Check groups for global indicators
    const groups = apiBundle.group || []
    const isGlobalByGroup = groups.some((g: string) => 
      g && (g.toLowerCase().includes('global') || 
           g.toLowerCase().includes('long duration'))
    )
    
    // Check roamingEnabled - if it's an array with many countries, it's global
    const roamingEnabled = apiBundle.roamingEnabled
    const isGlobalByRoaming = Array.isArray(roamingEnabled) && roamingEnabled.length >= 10
    
    // Determine type
    if (apiBundle.countries?.length >= 80 || isGlobalByName || isGlobalByGroup || isGlobalByRoaming) {
      type = 'Global'
    } else if (apiBundle.countries?.length >= 2) {
      type = 'Regional'
    }

    return {
      id: apiBundle.name,
      name: apiBundle.name,
      description: apiBundle.description || '',
      price: apiBundle.price || 0,
      currency: 'USD',
      data: dataDisplay,
      validity: validityDisplay,
      countries: countryIsos,
      countryObjects: apiBundle.countries || [],
      countryIso: countryIso,
      countryName: countryName,
      duration: apiBundle.duration || 0,
      dataAmount: apiBundle.dataAmount || 0,
      unlimited: apiBundle.unlimited || false,
      imageUrl: apiBundle.imageUrl,
      group: apiBundle.group,
      type: type,
      region: firstCountry?.region,
      roamingEnabled: apiBundle.roamingEnabled,
      billingType: apiBundle.billingType,
    }
  }
}

export const adminPlansService = new AdminPlansService()

