import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogService } from '@/modules/blog/services/blog.service'
import type { BlogPost } from '@/shared/types'

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchPost()
    }
  }, [slug])

  const fetchPost = async () => {
    if (!slug) return
    try {
      setLoading(true)
      setError(null)
      const postData = await blogService.getPostBySlug(slug)
      setPost(postData)
    } catch (err) {
      console.error('Error fetching blog post:', err)
      setError('Failed to load blog post. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-telgo-red"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="w-full min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-red-600 mb-4">{error || 'Blog post not found'}</p>
          <Link
            to="/blog"
            className="px-6 py-2 bg-telgo-red text-white rounded-lg hover:bg-red-700 transition-colors inline-block"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : ''

  // Parse content - if it contains HTML, render it; otherwise treat as plain text with line breaks
  const renderContent = () => {
    if (!post.content) return null
    
    // Check if content contains HTML tags
    if (post.content.includes('<') && post.content.includes('>')) {
      return <div dangerouslySetInnerHTML={{ __html: post.content }} />
    }
    
    // Otherwise, treat as plain text with line breaks
    return post.content.split('\n').map((paragraph, index) => {
      if (paragraph.trim() === '') return null
      
      // Check if it's a heading (starts with #)
      if (paragraph.trim().startsWith('#')) {
        const level = paragraph.trim().match(/^#+/)?.[0].length || 1
        const text = paragraph.trim().replace(/^#+\s*/, '')
        const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag
            key={index}
            className={`font-bold text-gray-900 mb-4 mt-6 ${
              level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl'
            }`}
          >
            {text}
          </HeadingTag>
        )
      }
      
      return (
        <p key={index} className="mb-4 text-gray-700 leading-relaxed">
          {paragraph}
        </p>
      )
    })
  }

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-telgo-red">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-telgo-red">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Tag */}
        <div className="mb-4">
          <span className="bg-telgo-red text-white px-3 py-1 rounded-full text-xs font-semibold">
            {post.category || 'Blog'}
          </span>
        </div>

        {/* Date and Read Time */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
          {formattedDate && <span>{formattedDate}</span>}
          {formattedDate && post.readTime && <span>•</span>}
          {post.readTime && <span>{post.readTime}</span>}
        </div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          {post.title}
        </motion.h1>

        {/* Featured Image */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 rounded-lg overflow-hidden"
          >
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
              }}
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-lg max-w-none"
        >
          {renderContent()}
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 bg-telgo-red rounded-lg p-8 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Get Your First eSIM Today</h2>
          <p className="text-lg mb-6 opacity-90">
            Easy setup, instant activation, and 24/7 support
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-white text-telgo-red rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop eSIM Plans
          </Link>
        </motion.div>

        {/* Back to Blog Link */}
        <div className="mt-8">
          <Link
            to="/blog"
            className="flex items-center gap-2 text-gray-600 hover:text-telgo-red transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Blog
          </Link>
        </div>
      </article>
    </div>
  )
}

export default BlogPostDetail

