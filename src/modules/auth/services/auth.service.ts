/**
 * Auth Service
 * Handles authentication API calls
 * Ready for backend integration
 */

import { apiClient } from '@/shared/services/api/client'
import type { LoginForm, SignUpForm, User } from '@/shared/types'

export interface LoginResponse {
  user: User
  token: string
}

export interface SignUpResponse {
  user: User
  token: string
}

export interface OTPRequest {
  email: string
  phone?: string
  purpose?: string // LOGIN, REGISTER, RESET_PASSWORD, etc.
}

export interface OTPVerify {
  email: string
  otp: string
}

export interface AdminRegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

export interface AdminLoginRequest {
  email: string
  password: string
}

class AuthService {
  /**
   * Login with email/password
   */
  async login(credentials: LoginForm): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials)
  }

  /**
   * Register new user
   */
  async register(data: SignUpForm): Promise<SignUpResponse> {
    return apiClient.post<SignUpResponse>('/auth/register', data)
  }

  /**
   * Request OTP for login
   */
  async requestOTP(data: OTPRequest): Promise<{ message: string }> {
    return apiClient.post('/auth/otp/request', data)
  }

  /**
   * Verify OTP and login
   */
  async verifyOTP(data: OTPVerify): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/otp/verify', data)
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/profile')
  }

  /**
   * Update user profile
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    return apiClient.put<User>('/auth/profile', data)
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    return apiClient.post('/auth/logout')
  }

  /**
   * Refresh token
   */
  async refreshToken(): Promise<{ token: string }> {
    return apiClient.post<{ token: string }>('/auth/refresh')
  }

  /**
   * Admin registration with email and password
   */
  async adminRegister(data: AdminRegisterRequest): Promise<LoginResponse> {
    const response = await apiClient.post<{ data?: LoginResponse; success?: boolean }>('/auth/admin/register', data)
    if (response.data) {
      return response.data
    }
    throw new Error('Invalid response format')
  }

  /**
   * Admin login with email and password
   */
  async adminLogin(data: AdminLoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<{ data?: LoginResponse; success?: boolean }>('/auth/admin/login', data)
    if (response.data) {
      return response.data
    }
    throw new Error('Invalid response format')
  }
}

export const authService = new AuthService()

