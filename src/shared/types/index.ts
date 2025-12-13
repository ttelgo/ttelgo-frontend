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

// Bundle Types (re-exported from plans service for convenience)
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
  roamingEnabled?: boolean
  [key: string]: unknown
}

// eSIM Plan Types
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
  bundleId?: string
}

export interface eSIMProfile {
  id: string
  esimId: string
  matchingId?: string
  iccid?: string
  qrCode?: string
  activationCode?: string
  status: string
  plan?: eSIMPlan
  orderId?: string
}

// Auth Types
export interface LoginForm {
  email: string
  password: string
}

export interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
  firstName?: string
  lastName?: string
}

export interface User {
  id: number
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  role?: string
  createdAt?: string
  updatedAt?: string
}

// Blog Types
export interface BlogPost {
  id: number
  title: string
  content: string
  excerpt?: string
  author?: string
  authorName?: string
  imageUrl?: string
  image?: string
  featuredImage?: string
  publishedAt?: string
  createdAt?: string
  updatedAt?: string
  tags?: string[] | string
  category?: string
  isPublished?: boolean
  isFeatured?: boolean
  slug?: string
  readTime?: string
  metaTitle?: string
  metaDescription?: string
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// KYC Types
export interface KYCSubmission {
  userId: number
  documentType: string
  documentNumber: string
  documentImage?: string
  status?: string
  submittedAt?: string
}

// Support Types
export interface SupportTicket {
  id: number
  userId?: number
  email: string
  subject: string
  message: string
  status?: string
  priority?: string
  createdAt?: string
  updatedAt?: string
}