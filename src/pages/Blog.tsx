import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      slug: 'ultimate-guide-esim-travel-2024',
      title: 'The Ultimate Guide to eSIM Travel in 2024: Stay Connected Anywhere',
      excerpt: 'Discover how eSIM technology is revolutionizing travel connectivity. Learn everything you need to know about using eSIMs for seamless global internet access, from activation to cost savings.',
      image: '/IMAGES/Cities/Rome.jpg',
      date: 'January 15, 2024',
      readTime: '7 min read',
      category: 'Travel Tips'
    },
    {
      id: 2,
      slug: 'save-money-esim-vs-roaming',
      title: 'How to Save Money on International Data: eSIM vs Traditional Roaming',
      excerpt: 'Stop overpaying for international data. This comprehensive comparison reveals how eSIM technology can save you up to 90% compared to traditional roaming charges while providing better coverage.',
      image: '/IMAGES/Cities/Paris.jpg',
      date: 'January 10, 2024',
      readTime: '7 min read',
      category: 'Money Saving'
    },
    {
      id: 3,
      slug: 'esim-setup-guide-beginners',
      title: 'eSIM Setup Guide for Beginners: Get Connected in 5 Minutes',
      excerpt: 'New to eSIM? This step-by-step guide walks you through everything from checking device compatibility to activating your first eSIM plan. Perfect for first-time users.',
      image: '/IMAGES/Cities/London.jpg',
      date: 'January 5, 2024',
      readTime: '7 min read',
      category: 'How-To Guide'
    }
  ]

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative py-4 md:py-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              TTelGo Blog
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Expert travel tips, eSIM guides, and insights to help you stay connected around the world
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <Link to={`/blog/${post.slug}`}>
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-telgo-red text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-telgo-red transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center text-telgo-red font-semibold text-sm">
                      Read More
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Blog

