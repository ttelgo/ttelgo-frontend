/**
 * Payment Service
 * Handles Stripe payment integration
 */

import { apiClient } from '@/shared/services/api/client'
import type { ApiResponse } from '@/shared/types'

export interface CreatePaymentIntentRequest {
  amount?: number // Optional - will be fetched from bundle if not provided
  currency: string // e.g., "usd"
  bundleId: string
  bundleName?: string
  quantity?: number
  customerEmail?: string
}

export interface CreatePaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
  publishableKey: string
  orderId: number
}

class PaymentService {
  /**
   * Create a payment intent for checkout
   * POST /api/payments/intent
   */
  async createPaymentIntent(
    request: CreatePaymentIntentRequest
  ): Promise<CreatePaymentIntentResponse> {
    try {
      const response = await apiClient.post<ApiResponse<CreatePaymentIntentResponse>>(
        '/payments/intent',
        request
      )
      // Check if response has success field and data
      if (response && typeof response === 'object') {
        if ('success' in response && !response.success) {
          throw new Error((response as any).message || 'Failed to create payment intent')
        }
        if ('data' in response) {
          return response.data
        }
      }
      // Fallback: assume response is the data directly
      return response as CreatePaymentIntentResponse
    } catch (error: any) {
      // Extract error message from API response
      const errorMessage = error.message || 
                          (error.response?.data?.message) || 
                          (typeof error === 'string' ? error : 'Failed to create payment intent. Please try again.')
      throw new Error(errorMessage)
    }
  }

  /**
   * Confirm payment (usually called after client-side confirmation)
   * POST /api/payments/confirm?paymentIntentId=pi_xxx
   */
  async confirmPayment(paymentIntentId: string): Promise<void> {
    await apiClient.post(`/payments/confirm?paymentIntentId=${paymentIntentId}`)
  }

  /**
   * Activate eSIM after payment confirmation
   * POST /api/esims/activate-after-payment?orderId=123
   */
  async activateEsimAfterPayment(orderId: number): Promise<any> {
    return apiClient.post(`/esims/activate-after-payment?orderId=${orderId}`)
  }
}

export const paymentService = new PaymentService()

