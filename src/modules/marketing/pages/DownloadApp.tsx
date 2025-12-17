import { useState } from 'react'
import { motion } from 'framer-motion'

const DownloadApp = () => {
  const [email, setEmail] = useState('')

  return (
    <div className="w-full">
      {/* Hero Section - Merged with Navbar */}
      <section 
        className="relative pb-4 md:pb-12 overflow-hidden bg-white mt-8"
        style={{
          paddingTop: '0rem' // Space for navbar
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ paddingTop: '0rem' }}>
          <div className="flex items-center justify-between gap-8">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 relative z-20 text-center"
            >
            {/* Subtitle */}
            <div className="mb-4">
              <span className="text-xs text-gray-600 uppercase tracking-[0.2em] font-semibold">
                DOWNLOAD THE APP, ENJOY THE DISCOUNT!
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-telgo-red mb-4 leading-tight">
              Download App
            </h1>
            
            {/* Description */}
            <p className="text-lg text-gray-700 mb-6 leading-relaxed font-medium">
              Download the TTelGo app today from the Play Store or App Store for instant eSIM activation and seamless support – global connectivity is just a tap away.
            </p>
            </motion.div>
            
            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex flex-1 items-center justify-center relative z-20"
            >
              <img 
                src="/IMAGES/3DMobile.png" 
                alt="3D Mobile" 
                className="w-full h-auto max-w-xl object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Download the TTelGo App Section */}
      <section className="pt-4 pb-4 bg-transparent border-t border-gray-200">
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
            <div className="mb-8 flex justify-center -mt-12">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center -mt-8 mb-8">
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
                    style={{ width: '36px', height: '36px' }}
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
                    style={{ width: '36px', height: '36px' }}
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
      <section className="pt-4 pb-16 bg-transparent relative border-t border-gray-200">
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

            {/* Content with relative positioning */}
            <div className="relative z-10">
              <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 text-center mx-auto px-2 md:px-4 leading-relaxed">
                Subscribe to get information, latest news and other interesting offers about TTelGo
              </h2>
            
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert('Thank you for subscribing!')
                  setEmail('')
                }}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-900 text-sm focus:ring-2 focus:ring-telgo-red"
                    style={{
                      boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                      transition: 'box-shadow 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 16px -2px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1), 0 -6px 8px -2px rgba(0, 0, 0, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)'
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap text-sm"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default DownloadApp
