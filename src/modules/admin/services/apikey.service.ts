import { ApiClient } from '@/shared/services/api/client'
import type { ApiKey, CreateApiKeyRequest, UpdateApiKeyRequest, ApiUsageStats } from '@/shared/types'

const apiClient = new ApiClient()

class ApiKeyService {
  async getAllApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get<{ data: ApiKey[] }>('/admin/api-keys')
    return response.data
  }

  async getApiKeyById(id: number): Promise<ApiKey> {
    const response = await apiClient.get<{ data: ApiKey }>(`/admin/api-keys/${id}`)
    return response.data
  }

  async createApiKey(request: CreateApiKeyRequest): Promise<ApiKey> {
    const response = await apiClient.post<{ data: ApiKey }>('/admin/api-keys', request)
    return response.data
  }

  async updateApiKey(id: number, request: UpdateApiKeyRequest): Promise<ApiKey> {
    const response = await apiClient.put<{ data: ApiKey }>(`/admin/api-keys/${id}`, request)
    return response.data
  }

  async deleteApiKey(id: number): Promise<void> {
    await apiClient.delete(`/admin/api-keys/${id}`)
  }

  async regenerateApiKey(id: number): Promise<ApiKey> {
    const response = await apiClient.post<{ data: ApiKey }>(`/admin/api-keys/${id}/regenerate`)
    return response.data
  }

  async getUsageStats(id: number, days: number = 30): Promise<ApiUsageStats> {
    const response = await apiClient.get<{ data: ApiUsageStats }>(`/admin/api-keys/${id}/usage?days=${days}`)
    return response.data
  }
}

export const apiKeyService = new ApiKeyService()

