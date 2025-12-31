/**
 * Countries Service
 * Handles countries and destinations API calls
 * Integrates with eSIMGo API via backend
 */

import { apiClient } from '@/shared/services/api/client'

export interface Country {
  id: string
  code: string
  name: string
  flag: string
  region: string
  plansAvailable: number
  popular?: boolean
}

export interface CountriesResponse {
  countries: Country[]
  total: number
}

class CountriesService {
  /**
   * Get all countries/destinations
   */
  async getCountries(params?: {
    region?: string
    search?: string
    popular?: boolean
  }): Promise<CountriesResponse> {
    const queryParams = new URLSearchParams()
    if (params?.region) queryParams.append('region', params.region)
    if (params?.search) queryParams.append('search', params.search)
    if (params?.popular) queryParams.append('popular', 'true')

    const query = queryParams.toString()
    return apiClient.get<CountriesResponse>(`/countries${query ? `?${query}` : ''}`)
  }

  /**
   * Get country by code
   */
  async getCountryByCode(countryCode: string): Promise<Country> {
    return apiClient.get<Country>(`/countries/${countryCode}`)
  }

  /**
   * Get popular destinations
   */
  async getPopularDestinations(): Promise<Country[]> {
    const response = await this.getCountries({ popular: true })
    return response.countries
  }

  /**
   * Search countries
   */
  async searchCountries(query: string): Promise<Country[]> {
    const response = await this.getCountries({ search: query })
    return response.countries
  }
}

export const countriesService = new CountriesService()

