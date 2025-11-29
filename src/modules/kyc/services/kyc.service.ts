/**
 * KYC Service
 * Handles KYC verification
 */

import { apiClient } from '@/shared/services/api/client'
import type { KYCSubmission } from '@/shared/types'

export interface KYCUploadRequest {
  documentType: 'passport' | 'id_card' | 'driving_license'
  documentFile: File
}

export interface KYCStatusResponse {
  submission: KYCSubmission
  status: 'pending' | 'approved' | 'rejected'
}

class KYCService {
  /**
   * Upload KYC document
   */
  async uploadDocument(data: KYCUploadRequest): Promise<KYCSubmission> {
    const formData = new FormData()
    formData.append('documentType', data.documentType)
    formData.append('document', data.documentFile)

    return apiClient.post<KYCSubmission>('/kyc/upload', formData)
  }

  /**
   * Get KYC status
   */
  async getKYCStatus(): Promise<KYCStatusResponse> {
    return apiClient.get<KYCStatusResponse>('/kyc/status')
  }

  /**
   * Get KYC submission by ID
   */
  async getSubmission(submissionId: string): Promise<KYCSubmission> {
    return apiClient.get<KYCSubmission>(`/kyc/submissions/${submissionId}`)
  }
}

export const kycService = new KYCService()

