/**
 * Blog Service
 * Handles blog posts - fetches from backend API
 */

import { apiClient } from '@/shared/services/api/client'
import type { BlogPost, ApiResponse } from '@/shared/types'

export interface BlogPostsResponse {
  posts: BlogPost[]
  total: number
  page: number
  totalPages: number
  limit: number
}

class BlogService {
  /**
   * Get all blog posts (published only)
   */
  async getPosts(params?: {
    page?: number
    limit?: number
    category?: string
    tag?: string
    search?: string
  }): Promise<BlogPostsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page !== undefined) queryParams.append('page', params.page.toString())
    if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
    if (params?.category) queryParams.append('category', params.category)
    if (params?.tag) queryParams.append('tag', params.tag)
    if (params?.search) queryParams.append('search', params.search)

    const query = queryParams.toString()
    const response = await apiClient.get<ApiResponse<BlogPostsResponse>>(`/blog${query ? `?${query}` : ''}`)
    return response.data
  }

  /**
   * Get blog post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost> {
    const response = await apiClient.get<ApiResponse<BlogPost>>(`/blog/${slug}`)
    return response.data
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts(limit?: number): Promise<BlogPost[]> {
    const query = limit ? `?limit=${limit}` : ''
    const response = await apiClient.get<ApiResponse<BlogPost[]>>(`/blog/featured${query}`)
    return response.data
  }

  /**
   * Search blog posts
   */
  async searchPosts(query: string, page?: number, limit?: number): Promise<BlogPostsResponse> {
    const queryParams = new URLSearchParams()
    queryParams.append('q', query)
    if (page !== undefined) queryParams.append('page', page.toString())
    if (limit !== undefined) queryParams.append('limit', limit.toString())

    const response = await apiClient.get<ApiResponse<BlogPostsResponse>>(`/blog/search?${queryParams.toString()}`)
    return response.data
  }

  // ========== Admin Methods ==========
  
  /**
   * Get all blog posts including unpublished (admin only)
   */
  async getAllPostsAdmin(page?: number, limit?: number): Promise<BlogPostsResponse> {
    const queryParams = new URLSearchParams()
    if (page !== undefined) queryParams.append('page', page.toString())
    if (limit !== undefined) queryParams.append('limit', limit.toString())

    const query = queryParams.toString()
    const response = await apiClient.get<ApiResponse<BlogPostsResponse>>(`/blog/admin/all${query ? `?${query}` : ''}`)
    return response.data
  }

  /**
   * Get blog post by ID (admin only)
   */
  async getPostById(id: number): Promise<BlogPost> {
    const response = await apiClient.get<ApiResponse<BlogPost>>(`/blog/admin/${id}`)
    return response.data
  }

  /**
   * Create new blog post (admin only)
   */
  async createPost(post: {
    slug: string
    title: string
    excerpt?: string
    content: string
    featuredImage?: string
    category: string
    readTime?: string
    isFeatured?: boolean
    isPublished?: boolean
    authorId?: number
    authorName?: string
    metaTitle?: string
    metaDescription?: string
    tags?: string
  }): Promise<BlogPost> {
    const response = await apiClient.post<ApiResponse<BlogPost>>('/blog', post)
    return response.data
  }

  /**
   * Update blog post (admin only)
   */
  async updatePost(id: number, post: {
    slug?: string
    title?: string
    excerpt?: string
    content?: string
    featuredImage?: string
    category?: string
    readTime?: string
    isFeatured?: boolean
    isPublished?: boolean
    authorName?: string
    metaTitle?: string
    metaDescription?: string
    tags?: string
  }): Promise<BlogPost> {
    const response = await apiClient.put<ApiResponse<BlogPost>>(`/blog/${id}`, post)
    return response.data
  }

  /**
   * Delete blog post (admin only)
   */
  async deletePost(id: number): Promise<void> {
    await apiClient.delete(`/blog/${id}`)
  }
}

export const blogService = new BlogService()

