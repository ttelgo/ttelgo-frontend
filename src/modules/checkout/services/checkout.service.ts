/**
 * Checkout Service
 * Handles checkout and order creation
 * Uses eSIM activation endpoint for order creation
 */

import { esimService, type ActivateBundleRequest } from '@/modules/esim/services/esim.service'

export interface CheckoutRequest {
  bundleId: string // Bundle ID (e.g., "esim_1GB_7D_GB_V2")
  quantity?: number
  assign?: boolean
  allowReassign?: boolean
}

export interface CheckoutResponse {
  orderId?: string // May not be in response
  esimId?: string // matchingId from esims array
  iccid?: string // ICCID from esims array
  matchingId?: string // For QR code
  qrCode?: string
  order?: Array<{
    esims: Array<{
      iccid: string
      matchingId: string
      smdpAddress: string
    }>
    type?: string
    item?: string
    iccids?: string[]
    quantity?: number
    subTotal?: number
    pricePerUnit?: number
    allowReassign?: boolean
    [key: string]: unknown
  }>
  total?: number
  [key: string]: unknown
}

class CheckoutService {
  /**
   * Create order (checkout) - Uses activate bundle endpoint
   * POST /api/esims/activate
   */
  async createOrder(data: CheckoutRequest): Promise<CheckoutResponse> {
    // Get userId from localStorage if user is logged in
    let userId: number | undefined
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.id) {
          userId = user.id
        }
      }
    } catch (e) {
      console.warn('Could not parse user from localStorage:', e)
    }

    const activateRequest: ActivateBundleRequest = {
      type: 'transaction',
      assign: data.assign ?? true,
      userId: userId, // Include userId if user is logged in
      order: [
        {
          type: 'bundle',
          item: data.bundleId,
          quantity: data.quantity || 1,
          allowReassign: data.allowReassign ?? false,
        },
      ],
    }

    const response = await esimService.activateBundle(activateRequest)
    
    console.log('Activation response:', response)
    
    // Extract matchingId and iccid from response structure
    let matchingId: string | undefined
    let iccid: string | undefined
    let esimUuid: string | undefined // This is the UUID needed for QR code (orderReference)
    
    // PRIORITY 1: orderReference is the UUID for QR code endpoint
    if (response.orderReference) {
      esimUuid = response.orderReference
      console.log('Found orderReference (UUID for QR code):', esimUuid)
    }
    
    // PRIORITY 2: Check if response has an id field (UUID) - this is what QR code endpoint needs
    if (!esimUuid && (response as any).id) {
      esimUuid = (response as any).id
      console.log('Found eSIM UUID in response.id:', esimUuid)
    }
    
    // PRIORITY 3: Also check for esimId field (might be UUID)
    if (!esimUuid && response.esimId) {
      esimUuid = response.esimId
      console.log('Found esimId in response:', esimUuid)
    }
    
    // Extract matchingId and iccid from order structure
    if (response.order && response.order.length > 0) {
      const firstOrder = response.order[0]
      if (firstOrder.esims && firstOrder.esims.length > 0) {
        const firstEsim = firstOrder.esims[0]
        matchingId = firstEsim.matchingId
        iccid = firstEsim.iccid
        console.log('Extracted matchingId:', matchingId, 'ICCID:', iccid)
      }
    }
    
    // The QR code endpoint needs orderReference (UUID), not the matchingId
    return {
      ...response,
      orderId: response.orderReference || response.orderId || esimUuid || matchingId || iccid || '',
      esimId: esimUuid || response.orderReference || response.esimId || matchingId || iccid, // UUID for QR code (orderReference)
      matchingId: matchingId, // Keep for reference (this is NOT the UUID for QR code)
      iccid: iccid,
      qrCode: response.qrCode,
    } as CheckoutResponse
  }

  /**
   * Get order details
   * GET /api/esims/orders/{orderId}
   */
  async getOrder(orderId: string) {
    return esimService.getOrderDetails(orderId)
  }

  /**
   * Legacy methods for backward compatibility
   */
  async createCheckout(data: CheckoutRequest): Promise<CheckoutResponse> {
    return this.createOrder(data)
  }
}

export const checkoutService = new CheckoutService()
