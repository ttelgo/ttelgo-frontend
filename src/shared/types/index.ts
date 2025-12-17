// ... existing code ...

export interface FAQ {
  id: number
  question: string
  answer: string
  category?: string
  displayOrder?: number
  isActive?: boolean
}

// Admin Types
export interface AdminDashboardStats {
  totalUsers: number
  activeUsers: number
  newUsersToday: number
  newUsersThisWeek: number
  newUsersThisMonth: number
  totalOrders: number
  pendingOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number
  revenueToday: number
  revenueThisWeek: number
  revenueThisMonth: number
  totalEsims: number
  activeEsims: number
  activatedToday: number
  activatedThisWeek: number
  totalApiKeys: number
  activeApiKeys: number
  totalApiRequests: number
  apiRequestsToday: number
  averageApiResponseTime: number
  recentOrders: RecentOrder[]
  recentUsers: RecentUser[]
  topApiKeys: TopApiKey[]
  ordersByDay: Record<string, number>
  usersByDay: Record<string, number>
  revenueByDay: Record<string, number>
  apiRequestsByDay: Record<string, number>
}

export interface RecentOrder {
  id: number
  orderReference: string
  customerEmail: string
  amount: number
  status: string
  createdAt: string
}

export interface RecentUser {
  id: number
  email: string
  phone: string
  createdAt: string
}

export interface TopApiKey {
  id: number
  keyName: string
  customerEmail: string
  requestCount: number
  averageResponseTime: number
}

export interface ApiKey {
  id: number
  keyName: string
  apiKey?: string // Only shown on creation/regeneration
  customerName: string
  customerEmail: string
  isActive: boolean
  rateLimitPerMinute: number
  rateLimitPerHour: number
  rateLimitPerDay: number
  allowedIps?: string[]
  scopes?: string[]
  expiresAt?: string
  lastUsedAt?: string
  createdAt: string
  updatedAt: string
  notes?: string
  totalRequests?: number
  requestsToday?: number
  averageResponseTime?: number
}

export interface CreateApiKeyRequest {
  keyName: string
  customerName: string
  customerEmail: string
  rateLimitPerMinute?: number
  rateLimitPerHour?: number
  rateLimitPerDay?: number
  allowedIps?: string[]
  scopes?: string[]
  expiresAt?: string
  notes?: string
}

export interface UpdateApiKeyRequest {
  keyName?: string
  customerName?: string
  customerEmail?: string
  isActive?: boolean
  rateLimitPerMinute?: number
  rateLimitPerHour?: number
  rateLimitPerDay?: number
  allowedIps?: string[]
  scopes?: string[]
  expiresAt?: string
  notes?: string
}

export interface ApiUsageStats {
  totalRequests: number
  requestsToday: number
  requestsThisWeek: number
  requestsThisMonth: number
  averageResponseTime: number
  totalErrors: number
  errorRate: number
  topEndpoints: EndpointUsage[]
  statusCodeDistribution: StatusCodeCount[]
  dailyUsage: DailyUsage[]
  hourlyUsage?: Record<string, number>
}

export interface EndpointUsage {
  endpoint: string
  count: number
  averageResponseTime?: number
}

export interface StatusCodeCount {
  statusCode: number
  count: number
}

export interface DailyUsage {
  date: string
  requests: number
  errors?: number
  averageResponseTime?: number
}

// User Types
export interface UserResponse {
  id: number
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  country?: string
  city?: string
  address?: string
  postalCode?: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  referralCode?: string
  referredBy?: number
  role?: string
  createdAt?: string
  updatedAt?: string
}

export interface UpdateUserRequest {
  firstName?: string
  lastName?: string
  country?: string
  city?: string
  address?: string
  postalCode?: string
  phone?: string
}

// Order Types
export interface OrderResponse {
  id: number
  orderReference: string
  userId?: number
  bundleId?: string
  bundleName?: string
  quantity?: number
  unitPrice?: number
  totalAmount?: number
  currency?: string
  status?: string
  paymentStatus?: string
  esimId?: string
  matchingId?: string
  iccid?: string
  createdAt?: string
  updatedAt?: string
}

// Bundle Type (from plans service)
export interface Bundle {
  id: string
  name: string
  description: string
  price: number
  currency: string
  data: string
  validity: string
  countries?: string[]
  countryObjects?: Array<{ name: string; region: string; iso: string }>
  countryIso?: string
  countryName?: string
  duration: number
  dataAmount: number
  unlimited: boolean
  imageUrl?: string
  group?: string[] | null
  roamingEnabled?: boolean | string[]
  type?: string
  region?: string
  billingType?: string
  [key: string]: unknown
}

// Auth Types
export interface LoginForm {
  email: string
  password: string
}

export interface SignUpForm {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
}

export interface User {
  id: number
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  country?: string
  city?: string
  address?: string
  postalCode?: string
  isEmailVerified?: boolean
  isPhoneVerified?: boolean
  referralCode?: string
  referredBy?: number
  role?: string
  createdAt?: string
  updatedAt?: string
}

// Blog Types
export interface BlogPost {
  id: string | number
  title: string
  slug: string
  content: string
  excerpt?: string
  author?: string
  authorName?: string
  category?: string
  tags?: string | string[]
  featuredImage?: string
  image?: string
  readTime?: number
  isFeatured?: boolean
  metaTitle?: string
  metaDescription?: string
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
  isPublished?: boolean
}

// API Response Type
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// eSIM Types
export interface eSIMPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  data: string
  validity: string
  regions: string[]
  features: string[]
  popular?: boolean
  countryCount?: number
}

export interface eSIMProfile {
  id: string
  orderId: string
  planId: string
  planName: string
  status: string
  dataRemaining: string
  dataTotal: string
  validity: string
  qrCode: string
  activationDate: string
  expirationDate?: string
}

// KYC Types
export interface KYCSubmission {
  id: string
  userId: number
  documentType: string
  documentUrl: string
  status: string
  submittedAt: string
  reviewedAt?: string
  notes?: string
}

// Support Types
export interface SupportTicket {
  id: string
  userId: number
  subject: string
  message: string
  status: string
  priority?: string
  category?: string
  createdAt: string
  updatedAt?: string
  replies?: SupportTicketReply[]
}

export interface SupportTicketReply {
  id: string
  ticketId: string
  userId: number
  message: string
  isAdmin: boolean
  createdAt: string
}