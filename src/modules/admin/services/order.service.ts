import { ApiClient } from '@/shared/services/api/client'
import type { OrderResponse } from '@/shared/types'

const apiClient = new ApiClient()

class AdminOrderService {
  async getAllOrders(page: number = 0, size: number = 50, status?: string): Promise<OrderResponse[]> {
    let url = `/admin/orders?page=${page}&size=${size}`
    if (status) {
      url += `&status=${status}`
    }
    const response = await apiClient.get<{ data: OrderResponse[] }>(url)
    return response.data
  }

  async getOrderById(id: number): Promise<OrderResponse> {
    const response = await apiClient.get<{ data: OrderResponse }>(`/admin/orders/${id}`)
    return response.data
  }
}

export const adminOrderService = new AdminOrderService()

