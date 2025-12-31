/**
 * eSIM Service
 * Handles eSIM management and activation
 * Integrates with backend API
 */

import { apiClient } from '@/shared/services/api/client'
import type { ApiResponse } from '@/shared/types'

export interface ActivateBundleRequest {
  type: 'transaction'
  assign: boolean
  userId?: number // Optional user ID for database records
  order: Array<{
    type: 'bundle'
    item: string // Bundle ID (e.g., "esim_1GB_7D_GB_V2")
    quantity: number
    allowReassign: boolean
  }>
}

export interface ESIMInfo {
  iccid: string
  matchingId: string
  smdpAddress: string
}

export interface OrderItem {
  esims: ESIMInfo[]
  type: string
  item: string
  iccids: string[]
  quantity: number
  subTotal: number
  pricePerUnit: number
  allowReassign: boolean
  [key: string]: unknown // Index signature for additional fields
}

export interface ActivateBundleResponse {
  order: OrderItem[]
  total: number
  currency?: string
  status?: string
  statusMessage?: string
  orderReference?: string // UUID identifier required for QR code endpoint retrieval
  createdDate?: string
  assigned?: boolean
  // Legacy fields for backward compatibility
  esimId?: string
  orderId?: string
  qrCode?: string
  [key: string]: unknown
}

export interface QRCodeResponse {
  qrCode: string
  [key: string]: unknown
}

export interface OrderDetails {
  id: string
  orderId?: string
  esimId?: string
  bundleId?: string
  status?: string
  [key: string]: unknown // For any additional fields from backend
}

class ESIMService {
  /**
   * Create an eSIM order (legacy direct provisioning)
   * POST /api/v1/esim-orders
   */
  async activateBundle(data: ActivateBundleRequest): Promise<ActivateBundleResponse> {
    const response = await apiClient.post<ApiResponse<ActivateBundleResponse>>('/esim-orders', data)
    if (!response.data) throw new Error('Failed to create eSIM order')
    return response.data
  }

  /**
   * Get QR code for eSIM
   * GET /api/v1/esims/{matchingId}/qr
   */
  async getQRCode(esimId: string): Promise<QRCodeResponse> {
    const response = await apiClient.get<ApiResponse<QRCodeResponse>>(`/esims/${esimId}/qr`)
    if (!response.data) throw new Error('Failed to load QR code')
    return response.data
  }

  /**
   * Get order details
   * GET /api/v1/esim-orders/{orderId}
   */
  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    const response = await apiClient.get<ApiResponse<OrderDetails>>(`/esim-orders/${orderId}`)
    if (!response.data) throw new Error('Failed to load order details')
    return response.data
  }

  /**
   * Legacy methods for backward compatibility
   */
  async activateESIM(data: ActivateBundleRequest): Promise<ActivateBundleResponse> {
    return this.activateBundle(data)
  }

  async getESIMQRCode(esimId: string): Promise<QRCodeResponse> {
    return this.getQRCode(esimId)
  }
}

export const esimService = new ESIMService()
