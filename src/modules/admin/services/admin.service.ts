import { ApiClient } from '@/shared/services/api/client'
import type { AdminDashboardStats, ApiResponse } from '@/shared/types'

const apiClient = new ApiClient()

class AdminService {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await apiClient.get<ApiResponse<AdminDashboardStats>>('/admin/dashboard')
    if (!response.data) throw new Error('Failed to load dashboard stats')
    return response.data
  }
}

export const adminService = new AdminService()

