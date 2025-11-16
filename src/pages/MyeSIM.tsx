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

const MyeSIM = () => {
  const [iccid, setIccid] = useState('')
  const [email, setEmail] = useState('')
  const [subscribeEmail, setSubscribeEmail] = useState('')

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    alert('eSIM lookup submitted!')
    setIccid('')
    setEmail('')
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for subscribing!')
    setSubscribeEmail('')
  }

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-3 md:py-5 overflow-hidden">
        <HeroBackground />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">
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
                  ACCESS YOUR ESIM DASHBOARD
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                My eSIM
                <svg className="mt-2" width="140" height="6" viewBox="0 0 140 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3C2 3 10 1 20 2C30 3 40 1 50 2C60 3 70 1 80 2C90 3 100 1 110 2C120 3 130 1 138 3" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </svg>
              </h1>
              
              {/* Tagline */}
              <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
                TTelGo (Your) eSIM: Travel smart, connect instantly – no physical SIM, no limits.
              </p>
            </motion.div>

            {/* Right - eSIM Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex relative w-full items-center justify-end pr-8 lg:pr-16 xl:pr-24"
              style={{ zIndex: 15 }}
            >
              <img
                src="/IMAGES/eSIM.png"
                alt="eSIM Technology"
                className="w-full max-w-lg h-auto object-contain"
                onLoad={() => {
                  // Image loaded successfully
                }}
                onError={() => {
                  console.error('Failed to load eSIM.png');
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Manage My eSIMs Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Illustration */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:flex relative w-full items-center justify-center"
            >
              <img
                src="/IMAGES/CCID.png"
                alt="CCID eSIM"
                className="relative w-full max-w-lg h-auto object-contain"
                style={{ 
                  position: 'relative',
                  zIndex: 10
                }}
                onLoad={() => {
                  // Image loaded successfully
                }}
                onError={() => {
                  console.error('Failed to load CCID.png');
                }}
              />
            </motion.div>

            {/* Right - Manage My eSIMs Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Manage My eSIMs
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Track your TTelGo eSIM with ease. Enter your ICCID or email, or sign in for full access.
              </p>
              
              <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Used Google or Apple to buy? Just log in with your social account to manage your eSIMs instantly.
              </p>

              <form onSubmit={handleConfirm} className="space-y-6">
                {/* ICCID Input */}
                <div>
                  <label htmlFor="iccid" className="block text-sm font-medium text-gray-700 mb-2">
                    ICCID
                  </label>
                  <input
                    type="text"
                    id="iccid"
                    value={iccid}
                    onChange={(e) => setIccid(e.target.value)}
                    placeholder="Enter your ICCID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                    style={{
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                    style={{
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                  />
                </div>

                {/* Confirm Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  Confirm
                </button>
              </form>
            </motion.div>
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
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
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

export default MyeSIM
