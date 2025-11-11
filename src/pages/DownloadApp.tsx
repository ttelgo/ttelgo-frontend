import { useState } from 'react'
import { motion } from 'framer-motion'

// Hero Background Component - White background
const HeroBackground = () => {
  return (
    <>
      {/* White Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-white"
        style={{
          zIndex: 0
        }}
      />
    </>
  )
}

const DownloadApp = () => {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEmail('')
    }, 3000)
  }

  return (
    <div className="w-full bg-white">
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
              className="max-w-[600px] lg:max-w-none"
            >
              {/* Subtitle */}
              <div className="mb-4">
                <span className="text-xs text-telgo-red uppercase tracking-[0.2em] font-semibold">
                  DOWNLOAD THE APP, ENJOY THE DISCOUNT!
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Download App
              </h1>
              
              {/* Description */}
              <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
                Download the TTelGo app today from the Play Store or App Store for instant eSIM activation and seamless support – global connectivity is just a tap away.
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
                  placeholder="Search for your next destination"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                  style={{
                    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                  }}
                />
              </div>
            </motion.div>

            {/* Right - MockUp Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex relative w-full items-center justify-center"
              style={{ zIndex: 15 }}
            >
              <img
                src="/IMAGES/MockUp.png"
                alt="TTelGo eSIM MockUp"
                className="w-full h-auto object-contain"
                style={{ 
                  maxHeight: '600px',
                  height: 'auto',
                  width: 'auto',
                  maxWidth: '100%'
                }}
                onLoad={() => {
                  // Image loaded successfully
                }}
                onError={() => {
                  console.error('Failed to load MockUp.png');
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download the TTelGo App Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Download the TTelGo App
            </h2>
            
            {/* Red Scribble Underline */}
            <div className="flex justify-center mb-12">
              <svg className="mt-2" width="250" height="6" viewBox="0 0 250 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3C5 3 25 1.5 50 3C75 4.5 100 1.5 125 3C150 4.5 175 1.5 200 3C225 4.5 245 2 245 3" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none" style={{ filter: 'url(#scribble-download)' }}/>
                <defs>
                  <filter id="scribble-download" x="0" y="0" width="250" height="6">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
                  </filter>
                </defs>
              </svg>
            </div>

            {/* QR Code */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                {/* QR Code Image */}
                <img
                  src="/IMAGES/QRCode.jpg"
                  alt="QR Code"
                  className="w-64 h-64 object-cover"
                  onLoad={() => {
                    // Image loaded successfully
                  }}
                />
              </div>
            </div>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {/* Google Play Store Badge */}
              <motion.a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <div 
                  className="bg-black rounded-md px-3 py-2.5 flex items-center gap-2.5 cursor-pointer h-14"
                  style={{
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    minWidth: '155px'
                  }}
                >
                  {/* Google Play Icon */}
                  <img 
                    src="/IMAGES/Playstore.png" 
                    alt="Google Play" 
                    className="w-9 h-9 object-contain"
                    onError={() => {
                      console.error('Failed to load Playstore.png');
                    }}
                  />
                  <div className="flex flex-col justify-center">
                    <div className="text-[9px] text-white/90 leading-none uppercase tracking-wide" style={{ fontFamily: 'Roboto, sans-serif' }}>GET IT ON</div>
                    <div className="text-[16px] font-medium text-white leading-none mt-0.5" style={{ fontFamily: 'Roboto, sans-serif', letterSpacing: '-0.5px' }}>Google Play</div>
                  </div>
                </div>
              </motion.a>

              {/* Apple App Store Badge */}
              <motion.a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-block"
              >
                <div 
                  className="bg-black rounded-md px-3 py-2.5 flex items-center gap-2.5 cursor-pointer h-14"
                  style={{
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    minWidth: '155px'
                  }}
                >
                  {/* Apple Icon */}
                  <img 
                    src="/IMAGES/apple.png" 
                    alt="App Store" 
                    className="w-9 h-9 object-contain"
                    onError={() => {
                      console.error('Failed to load apple.png');
                    }}
                  />
                  <div className="flex flex-col justify-center">
                    <div className="text-[9px] text-white/90 leading-none" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}>Download on the</div>
                    <div className="text-[20px] font-semibold text-white leading-none mt-0.5" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif', letterSpacing: '-0.3px' }}>App Store</div>
                  </div>
                </div>
              </motion.a>
            </div>
          </motion.div>
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
                  // Fallback if image doesn't exist
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

            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 text-center text-green-600 font-medium"
              >
                Thank you for subscribing!
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default DownloadApp
