import { ApiClient } from '@/shared/services/api/client'
import type { ApiResponse } from '@/shared/types'

const apiClient = new ApiClient()

export interface EsimResponse {
  id: number
  esimUuid?: string
  orderId?: number
  userId?: number
  bundleId?: string
  bundleName?: string
  matchingId?: string
  iccid?: string
  smdpAddress?: string
  status?: string
  activatedAt?: string
  expiresAt?: string
  createdAt?: string
  updatedAt?: string
}

class AdminEsimService {
  async getAllEsims(page: number = 0, size: number = 50, status?: string): Promise<EsimResponse[]> {
    let url = `/admin/esims?page=${page}&size=${size}`
    if (status) {
      url += `&status=${status}`
    }
    const response = await apiClient.get<ApiResponse<EsimResponse[]>>(url)
    return response.data || []
  }

  async getEsimById(id: number): Promise<EsimResponse> {
    const response = await apiClient.get<ApiResponse<EsimResponse>>(`/admin/esims/${id}`)
    if (!response.data) throw new Error('eSIM not found')
    return response.data
  }
}

export const adminEsimService = new AdminEsimService()

