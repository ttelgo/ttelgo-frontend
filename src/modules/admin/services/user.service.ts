import { ApiClient } from '@/shared/services/api/client'
import type { UserResponse, UpdateUserRequest, ApiResponse } from '@/shared/types'

const apiClient = new ApiClient()

class AdminUserService {
  async getAllUsers(page: number = 0, size: number = 50): Promise<UserResponse[]> {
    const response = await apiClient.get<ApiResponse<UserResponse[]>>(
      `/admin/users?page=${page}&size=${size}`
    )
    return response.data || []
  }

  async getUserById(id: number): Promise<UserResponse> {
    const response = await apiClient.get<ApiResponse<UserResponse>>(`/admin/users/${id}`)
    if (!response.data) throw new Error('User not found')
    return response.data
  }

  async updateUser(id: number, request: UpdateUserRequest): Promise<UserResponse> {
    const response = await apiClient.put<ApiResponse<UserResponse>>(`/admin/users/${id}`, request)
    if (!response.data) throw new Error('Failed to update user')
    return response.data
  }

  async deleteUser(id: number): Promise<void> {
    await apiClient.delete(`/admin/users/${id}`)
  }
}

export const adminUserService = new AdminUserService()

