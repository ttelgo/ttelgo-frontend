/**
 * Blog Service
 * Handles blog posts
 */

import { apiClient } from '@/shared/services/api/client'
import type { BlogPost } from '@/shared/types'

export interface BlogPostsResponse {
  posts: BlogPost[]
  total: number
  page: number
  totalPages: number
}

class BlogService {
  /**
   * Get all blog posts
   */
  async getPosts(params?: {
    page?: number
    limit?: number
    tag?: string
  }): Promise<BlogPostsResponse> {
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    if (params?.tag) queryParams.append('tag', params.tag)

    const query = queryParams.toString()
    return apiClient.get<BlogPostsResponse>(`/blog${query ? `?${query}` : ''}`)
  }

  /**
   * Get blog post by slug
   */
  async getPostBySlug(slug: string): Promise<BlogPost> {
    return apiClient.get<BlogPost>(`/blog/${slug}`)
  }

  /**
   * Get featured posts
   */
  async getFeaturedPosts(): Promise<BlogPost[]> {
    const response = await apiClient.get<{ posts: BlogPost[] }>('/blog/featured')
    return response.posts
  }

  /**
   * Search blog posts
   */
  async searchPosts(query: string): Promise<BlogPost[]> {
    const response = await apiClient.get<{ posts: BlogPost[] }>(`/blog/search?q=${query}`)
    return response.posts
  }
}

export const blogService = new BlogService()

