import { ApiClient } from '@/shared/services/api/client'
import type { ApiKey, CreateApiKeyRequest, UpdateApiKeyRequest, ApiUsageStats, ApiResponse } from '@/shared/types'

const apiClient = new ApiClient()

class ApiKeyService {
  async getAllApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get<ApiResponse<ApiKey[]>>('/admin/api-keys')
    return response.data || []
  }

  async getApiKeyById(id: number): Promise<ApiKey> {
    const response = await apiClient.get<ApiResponse<ApiKey>>(`/admin/api-keys/${id}`)
    if (!response.data) throw new Error('API key not found')
    return response.data
  }

  async createApiKey(request: CreateApiKeyRequest): Promise<ApiKey> {
    const response = await apiClient.post<ApiResponse<ApiKey>>('/admin/api-keys', request)
    if (!response.data) throw new Error('Failed to create API key')
    return response.data
  }

  async updateApiKey(id: number, request: UpdateApiKeyRequest): Promise<ApiKey> {
    const response = await apiClient.put<ApiResponse<ApiKey>>(`/admin/api-keys/${id}`, request)
    if (!response.data) throw new Error('Failed to update API key')
    return response.data
  }

  async deleteApiKey(id: number): Promise<void> {
    await apiClient.delete(`/admin/api-keys/${id}`)
  }

  async regenerateApiKey(id: number): Promise<ApiKey> {
    const response = await apiClient.post<ApiResponse<ApiKey>>(`/admin/api-keys/${id}/regenerations`)
    if (!response.data) throw new Error('Failed to regenerate API key')
    return response.data
  }

  async getUsageStats(id: number, days: number = 30): Promise<ApiUsageStats> {
    const response = await apiClient.get<ApiResponse<ApiUsageStats>>(
      `/admin/api-keys/${id}/usage?days=${days}`
    )
    if (!response.data) throw new Error('Failed to load usage stats')
    return response.data
  }
}

export const apiKeyService = new ApiKeyService()

