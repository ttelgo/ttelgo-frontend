import { ApiClient } from '@/shared/services/api/client'
import type { AdminDashboardStats } from '@/shared/types'

const apiClient = new ApiClient()

class AdminService {
  async getDashboardStats(): Promise<AdminDashboardStats> {
    const response = await apiClient.get<{ data: AdminDashboardStats }>('/admin/dashboard')
    return response.data
  }
}

export const adminService = new AdminService()

