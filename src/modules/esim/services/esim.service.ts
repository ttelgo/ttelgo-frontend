/**
 * eSIM Service
 * Handles eSIM management and activation
 * Integrates with backend API
 */

import { apiClient } from '@/shared/services/api/client'

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
  orderReference?: string // UUID for QR code endpoint - this is the key field!
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
   * Activate bundle (Create Order)
   * POST /api/esims/activate
   */
  async activateBundle(data: ActivateBundleRequest): Promise<ActivateBundleResponse> {
    return apiClient.post<ActivateBundleResponse>('/esims/activate', data)
  }

  /**
   * Get QR code for eSIM
   * GET /api/esims/qr/{esimId}
   */
  async getQRCode(esimId: string): Promise<QRCodeResponse> {
    return apiClient.get<QRCodeResponse>(`/esims/qr/${esimId}`)
  }

  /**
   * Get order details
   * GET /api/esims/orders/{orderId}
   */
  async getOrderDetails(orderId: string): Promise<OrderDetails> {
    return apiClient.get<OrderDetails>(`/esims/orders/${orderId}`)
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
