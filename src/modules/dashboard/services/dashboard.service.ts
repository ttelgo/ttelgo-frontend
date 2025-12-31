/**
 * Dashboard Service
 * Handles user dashboard data
 * Uses eSIM and order endpoints
 */

import { esimService } from '@/modules/esim/services/esim.service'

export interface OrderDetails {
  id: string
  orderId?: string
  esimId?: string
  bundleId?: string
  status?: string
  createdAt?: string
  [key: string]: unknown
}

class DashboardService {
  /**
   * Get order details
   * GET /api/v1/esim-orders/{orderId}
   */
  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    return esimService.getOrderDetails(orderId)
  }

  /**
   * Get QR code for eSIM
   * GET /api/v1/esims/{matchingId}/qr
   */
  async getQRCode(esimId: string): Promise<{ qrCode: string }> {
    const response = await esimService.getQRCode(esimId)
    return { qrCode: response.qrCode }
  }

  /**
   * Legacy methods (if backend adds these endpoints later)
   */
  async getUserESIMs(): Promise<any[]> {
    // TODO: Implement when backend adds /esims endpoint
    return []
  }

  async getUserOrders(): Promise<OrderDetails[]> {
    // TODO: Implement when backend adds /orders endpoint for current user
    return []
  }
}

export const dashboardService = new DashboardService()
