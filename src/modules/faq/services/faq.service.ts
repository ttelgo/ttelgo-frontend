/**
 * FAQ Service
 * Handles FAQs - fetches from backend API
 */

import { apiClient } from '@/shared/services/api/client'
import type { FAQ, ApiResponse } from '@/shared/types'

class FaqService {
  /**
   * Get all active FAQs
   */
  async getFaqs(category?: string): Promise<FAQ[]> {
    const query = category ? `?category=${category}` : ''
    const response = await apiClient.get<ApiResponse<FAQ[]>>(`/faq${query}`)
    return response.data
  }

  /**
   * Get all FAQ categories
   */
  async getCategories(): Promise<string[]> {
    const response = await apiClient.get<ApiResponse<string[]>>('/faq/categories')
    return response.data
  }

  // ========== Admin Methods ==========
  
  /**
   * Get all FAQs including inactive (admin only)
   */
  async getAllFaqsAdmin(): Promise<FAQ[]> {
    const response = await apiClient.get<ApiResponse<FAQ[]>>('/faq/admin/all')
    return response.data
  }

  /**
   * Get FAQ by ID (admin only)
   */
  async getFaqById(id: number): Promise<FAQ> {
    const response = await apiClient.get<ApiResponse<FAQ>>(`/faq/admin/${id}`)
    return response.data
  }

  /**
   * Create new FAQ (admin only)
   */
  async createFaq(faq: {
    question: string
    answer: string
    displayOrder?: number
    isActive?: boolean
    category?: string
  }): Promise<FAQ> {
    const response = await apiClient.post<ApiResponse<FAQ>>('/faq', faq)
    return response.data
  }

  /**
   * Update FAQ (admin only)
   */
  async updateFaq(id: number, faq: {
    question?: string
    answer?: string
    displayOrder?: number
    isActive?: boolean
    category?: string
  }): Promise<FAQ> {
    const response = await apiClient.put<ApiResponse<FAQ>>(`/faq/${id}`, faq)
    return response.data
  }

  /**
   * Delete FAQ (admin only)
   */
  async deleteFaq(id: number): Promise<void> {
    await apiClient.delete(`/faq/${id}`)
  }
}

export const faqService = new FaqService()

