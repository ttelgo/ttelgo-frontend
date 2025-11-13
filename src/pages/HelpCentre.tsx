import { useState } from 'react'
import { motion } from 'framer-motion'

// Hero Background Component - HeroStyle.png background
const HeroBackground = () => {
  return (
    <>
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 0,
          backgroundImage: 'url(/IMAGES/HeroStyle.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Overlay for better text readability */}
      <div 
        className="absolute inset-0 w-full h-full bg-white/50"
        style={{
          zIndex: 1
        }}
      />
    </>
  )
}

const HelpCentre = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [email, setEmail] = useState('')

  const helpTopics = [
    {
      id: 1,
      title: 'Quick Help for Your eSIM Setup',
      description: 'TTelGo eSIM not working? Find quick fixes for activation and signal issues....',
    },
    {
      id: 2,
      title: 'Understanding Your eSIM Plan',
      description: 'Learn how your TTelGo plan works, including validity, extras, and data usage....',
    },
    {
      id: 3,
      title: 'Transactions, Billing & Refunds',
      description: 'Find support for payments, invoices, refunds, and billing issues – all in one place....',
    },
    {
      id: 4,
      title: 'Update & Manage Your TTelGo eSIM',
      description: 'TTelGo account help – update info, reset passwords, and manage settings in a few steps....',
    },
    {
      id: 5,
      title: 'TTelGo eSIM Discounts & Benefits',
      description: 'Unlock TTelGo promo codes and referral rewards – apply in-app and start saving...',
    },
    {
      id: 6,
      title: 'About eSIM',
      description: 'Explore eSIM tech: digital activation, no physical SIMs, and smarter mobile experiences...',
    },
    {
      id: 7,
      title: 'About TTelGo eSIM',
      description: 'Discover how TTelGo eSIM, powered by TikTel Ltd, delivers global data across 200+ destinations...',
      fullWidth: true,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for subscribing!')
    setEmail('')
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <HeroBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-[600px] lg:max-w-none pl-8 lg:pl-16 xl:pl-24"
            >
              {/* Subtitle */}
              <div className="mb-4">
                <span className="text-xs text-telgo-red uppercase tracking-[0.2em] font-semibold">
                  WE&apos;RE HERE - DAY OR NIGHT, ANYTIME.
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Help Center
                <svg className="mt-2" width="180" height="6" viewBox="0 0 180 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3C2 3 12 1 24 2.5C36 4 48 2 60 3C72 4 84 2 96 3C108 4 120 2 132 3C144 4 156 2 168 3C178 4 178 2 178 3" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none" style={{ filter: 'url(#scribble-help)' }}/>
                  <defs>
                    <filter id="scribble-help" x="0" y="0" width="180" height="6">
                      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
                    </filter>
                  </defs>
                </svg>
              </h1>
              
              {/* Description */}
              <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
                Our support team is available 24/7 – and we&apos;re always happy to help you stay connected.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for articles..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                  style={{
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                />
              </div>
            </motion.div>

            {/* Right - HelpCentre Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex relative w-full items-center justify-end pr-8 lg:pr-16 xl:pr-24"
              style={{ zIndex: 15 }}
            >
              <img
                src="/IMAGES/HelpCentre.jpg"
                alt="Help Centre"
                className="w-full max-w-lg h-auto object-contain"
                loading="lazy"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content - Help Topics */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              TTelGo Help Center
            </h2>
            <div className="flex justify-center">
              <svg className="mt-2" width="250" height="6" viewBox="0 0 250 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3C5 3 25 1.5 50 3C75 4.5 100 1.5 125 3C150 4.5 175 1.5 200 3C225 4.5 245 2 245 3" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none" style={{ filter: 'url(#scribble-center)' }}/>
                <defs>
                  <filter id="scribble-center" x="0" y="0" width="250" height="6">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
                  </filter>
                </defs>
              </svg>
            </div>
          </motion.div>

          {/* Help Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {helpTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white rounded-lg p-6 ${topic.fullWidth ? 'md:col-span-2' : ''}`}
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {topic.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {topic.description}
                </p>
                <a
                  href="#"
                  className="text-telgo-red font-semibold hover:underline inline-flex items-center gap-1"
                >
                  More
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="py-16 bg-transparent relative">
        {/* Dots and Plus Pattern Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle, #cbd5e1 1px, transparent 1px),
              radial-gradient(circle, #cbd5e1 1px, transparent 1px),
              linear-gradient(45deg, transparent 48%, #cbd5e1 49%, #cbd5e1 51%, transparent 52%)
            `,
            backgroundSize: '30px 30px, 30px 30px, 20px 20px',
            backgroundPosition: '0 0, 15px 15px, 0 0'
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 md:p-12 relative overflow-visible"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Purple Paper Airplane Icon */}
            <div className="absolute -top-2 -right-2 w-20 h-20 opacity-50 z-20">
              <img
                src="/IMAGES/PaperAirplane.png"
                alt="Paper Airplane"
                className="w-full h-full object-contain"
                style={{
                  filter: 'hue-rotate(240deg) saturate(1.5) brightness(1.1)'
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>

            {/* Heading */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
              Subscribe to get information, latest news and other interesting offers about TTelGo
            </h2>

            {/* Email Input and Subscribe Button */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent bg-white text-gray-900"
                  style={{
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors whitespace-nowrap"
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HelpCentre
