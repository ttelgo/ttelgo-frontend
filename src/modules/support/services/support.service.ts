/**
 * Support Service
 * Handles support tickets and FAQs
 */

import { apiClient } from '@/shared/services/api/client'
import type { FAQ, SupportTicket } from '@/shared/types'

export interface SupportTicketRequest {
  subject: string
  message: string
  category?: string
}

export interface FAQsResponse {
  faqs: FAQ[]
  categories: string[]
}

class SupportService {
  /**
   * Get all FAQs
   */
  async getFAQs(category?: string): Promise<FAQsResponse> {
    const query = category ? `?category=${category}` : ''
    return apiClient.get<FAQsResponse>(`/support/faqs${query}`)
  }

  /**
   * Search FAQs
   */
  async searchFAQs(query: string): Promise<FAQ[]> {
    const response = await apiClient.get<{ faqs: FAQ[] }>(`/support/faqs/search?q=${query}`)
    return response.faqs
  }

  /**
   * Create support ticket
   */
  async createTicket(data: SupportTicketRequest): Promise<SupportTicket> {
    return apiClient.post<SupportTicket>('/support/tickets', data)
  }

  /**
   * Get user tickets
   */
  async getUserTickets(): Promise<SupportTicket[]> {
    return apiClient.get<SupportTicket[]>('/support/tickets')
  }

  /**
   * Get ticket by ID
   */
  async getTicket(ticketId: string): Promise<SupportTicket> {
    return apiClient.get<SupportTicket>(`/support/tickets/${ticketId}`)
  }

  /**
   * Reply to ticket
   */
  async replyToTicket(ticketId: string, message: string): Promise<SupportTicket> {
    return apiClient.post<SupportTicket>(`/support/tickets/${ticketId}/reply`, { message })
  }
}

export const supportService = new SupportService()

