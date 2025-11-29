/**
 * Shared Type Definitions
 * Types used across multiple modules
 * Based on TTelGo project scope
 */

// User types
export interface User {
  id: string
  email: string
  name?: string
  phone?: string
  createdAt: string
  kycStatus?: KYCStatus
}

export type KYCStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted'

// Authentication types
export interface LoginRequest {
  email: string
  otp?: string
  password?: string
}

export interface SignUpRequest {
  email: string
  name?: string
  phone?: string
  referralCode?: string
  password?: string
}

// Form types (for UI forms)
export interface LoginForm {
  email: string
  password: string
}

export interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
  referralCode?: string
  name?: string
  phone?: string
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken?: string
}

// Country & Destination types
export interface Country {
  id: string
  code: string
  name: string
  flag?: string
  region?: string
  planCount?: number
}

// eSIM Plan types
export interface eSIMPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  data: string // e.g., "5GB", "Unlimited"
  validity: string // e.g., "30 days"
  countries?: string[] // Country codes (optional for backward compatibility)
  regions?: string[]
  features: string[]
  popular?: boolean
  type?: 'country' | 'regional' | 'global'
}

// Order & Payment types
export interface Order {
  id: string
  userId: string
  planId: string
  planName: string
  amount: number
  currency: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  completedAt?: string
}

export type OrderStatus = 'pending' | 'completed' | 'cancelled' | 'refunded'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface PaymentIntent {
  clientSecret: string
  orderId: string
}

// eSIM Management types
export interface eSIMProfile {
  id: string
  orderId: string
  planId: string
  planName: string
  qrCode?: string
  activationCode?: string
  smdpAddress?: string
  status: eSIMStatus
  dataRemaining?: string
  dataTotal?: string
  validity: string
  activationDate?: string
  expirationDate?: string
  country?: string
}

export type eSIMStatus = 'active' | 'inactive' | 'expired' | 'pending' | 'installed'

// KYC types
export interface KYCSubmission {
  id: string
  userId: string
  documentType: string
  documentUrl: string
  status: KYCStatus
  submittedAt: string
  reviewedAt?: string
  rejectionReason?: string
}

// Support types
export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
}

export interface SupportTicket {
  id: string
  userId?: string
  subject: string
  message: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
}

// Blog types
export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  publishedAt: string
  imageUrl?: string
  tags?: string[]
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Common types
export interface SelectOption {
  value: string
  label: string
}
