import { motion } from 'framer-motion'
import { useState } from 'react'

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

const About = () => {
  const [email, setEmail] = useState('')
  const [, setTeamIndex] = useState(0)

  const teamMembers = [
    {
      name: 'Henry Bennett',
      avatar: '/IMAGES/Man1.jpg',
      initial: 'H'
    },
    {
      name: 'Elizabeth Turner',
      avatar: '/IMAGES/Man2.jpg',
      initial: 'E'
    },
    {
      name: 'John Carvan',
      avatar: '/IMAGES/Man3.jpg',
      initial: 'J'
    },
  ]

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
              className="max-w-3xl lg:max-w-none pl-8 lg:pl-16 xl:pl-24"
            >
              {/* Subtitle */}
              <div className="mb-4 text-center lg:text-left">
                <span className="text-xs text-gray-600 uppercase tracking-[0.2em] font-medium">
                  WE CONNECT. GLOBALLY.
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight text-center lg:text-left">
                About Us
                <svg className="mt-2 mx-auto lg:mx-0" width="120" height="6" viewBox="0 0 120 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3C2 3 15 1 30 2.5C45 4 60 2 75 3C90 4 105 2 118 3" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </svg>
              </h1>
              
              {/* Description */}
              <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium text-center lg:text-left">
                TTelGo powered by TikTel Ltd. UK - a telecom innovator driving digital transformation across global connectivity.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto lg:mx-0">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for your next destination"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                />
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-end pr-8 lg:pr-16 xl:pr-24"
            >
              <img
                src="/IMAGES/ABouttt.png"
                alt="About Us"
                className="w-full max-w-xl h-auto object-contain rounded-lg"
                style={{ 
                  position: 'relative',
                  zIndex: 10
                }}
                onLoad={() => {
                  // Image loaded successfully
                }}
                onError={() => {
                  console.error('Failed to load ABouttt.png');
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Title */}
      <section className="py-8 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              About TTelGo from TikTel Ltd. UK
            </h2>
            <div className="flex justify-center">
              <svg className="mt-2" width="200" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3C5 3 20 1.5 40 3C60 4.5 80 1.5 100 3C120 4.5 140 1.5 160 3C180 4.5 195 2 195 3" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none" style={{ filter: 'url(#scribble)' }}/>
                <defs>
                  <filter id="scribble" x="0" y="0" width="200" height="6">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1"/>
                  </filter>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TTelGo Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                TTelGo
                <svg className="mt-2" width="100" height="4" viewBox="0 0 100 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2C2 2 10 1 20 2C30 3 40 1 50 2C60 3 70 1 80 2C90 3 98 1 98 2" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </svg>
              </h3>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                TTelGo&apos;s mission is to empower global travel by connecting people through curated local insights and seamless digital access - eliminating the burden of costly data roaming in a connected world.
              </p>
              <div className="relative inline-block">
                <button className="px-8 py-3 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors relative z-10">
                  View More
                </button>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full -z-0"></div>
              </div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex relative w-full items-center justify-center"
            >
              <img
                src="/IMAGES/6G.png"
                alt="6G Technology"
                className="relative w-full max-w-md h-auto object-contain"
                style={{ 
                  position: 'relative',
                  zIndex: 10,
                  maxHeight: '400px'
                }}
                onLoad={() => {
                  // Image loaded successfully
                }}
                onError={() => {
                  console.error('Failed to load 6G.png');
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* TikTel Ltd. Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="hidden lg:flex relative w-full items-center justify-center lg:order-1"
            >
              <img
                src="/IMAGES/TikTel.png"
                alt="TikTel Ltd."
                className="relative w-full max-w-md h-auto object-contain"
                style={{ 
                  position: 'relative',
                  zIndex: 10,
                  maxHeight: '400px'
                }}
                onLoad={() => {
                  // Image loaded successfully
                }}
                onError={() => {
                  console.error('Failed to load TikTel.png');
                }}
              />
            </motion.div>

            {/* Right Text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:order-2"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                TikTel Ltd.
                <svg className="mt-2" width="120" height="4" viewBox="0 0 120 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 2C2 2 12 1 24 2C36 3 48 1 60 2C72 3 84 1 96 2C108 3 118 1 118 2" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none"/>
                </svg>
              </h3>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-xl">
                TikTel Ltd. UK is a future-focused managed telecom services provider, driving digital transformation through secure connectivity, scalable infrastructure, and advanced eSIM innovation.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-xl">
                From AI and IT to fiber networks and cloud solutions, TikTel empowers businesses to thrive in a hyper-connected world - with TTelGo as its flagship eSIM platform, delivering instant, borderless mobile access across 200+ global destinations.
              </p>
              <div className="relative inline-block">
                <button className="px-8 py-3 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors relative z-10">
                  View More
                </button>
                <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full -z-0"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Meet the TTelGO team
            </h2>
            <div className="flex justify-center">
              <svg className="mt-2" width="200" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3C5 3 20 1.5 40 3C60 4.5 80 1.5 100 3C120 4.5 140 1.5 160 3C180 4.5 195 2 195 3" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
          </motion.div>

          {/* Team Members */}
          <div className="relative max-w-5xl mx-auto">
            {/* Navigation Arrows - Desktop */}
            <button
              onClick={() => setTeamIndex((prev) => (prev === 0 ? teamMembers.length - 1 : prev - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-gray-200 hover:bg-gray-300 rounded-full p-3 z-10 transition-colors hidden xl:block"
              aria-label="Previous team member"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 justify-items-center">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center"
                >
                  {/* Avatar with Light Pink Background */}
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-pink-100 p-2 mb-4 flex items-center justify-center mx-auto" style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}>
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-pink-100">
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent && !parent.querySelector('span')) {
                              const fallback = document.createElement('span')
                              fallback.className = 'text-3xl md:text-4xl font-bold text-gray-400'
                              fallback.textContent = member.initial
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      ) : (
                        <span className="text-3xl md:text-4xl font-bold text-gray-400">{member.initial}</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Red Trapezoidal Name Tag */}
                  <div 
                    className="bg-telgo-red px-5 py-2 md:px-6 md:py-2.5 text-white font-semibold text-sm md:text-base relative mx-auto"
                    style={{
                      clipPath: 'polygon(12% 0, 88% 0, 100% 100%, 0 100%)',
                      minWidth: '150px',
                      textAlign: 'center',
                      lineHeight: '1.2'
                    }}
                  >
                    {member.name}
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              onClick={() => setTeamIndex((prev) => (prev === teamMembers.length - 1 ? 0 : prev + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-gray-200 hover:bg-gray-300 rounded-full p-3 z-10 transition-colors hidden xl:block"
              aria-label="Next team member"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
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
            className="rounded-2xl p-8 md:p-12 relative overflow-visible bg-white"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            
            {/* Paper Airplane Icon - Purple */}
            <div className="absolute -top-2 -right-2 w-20 h-20 opacity-50 z-20">
              <img 
                src="/IMAGES/PaperAirplane.png" 
                alt="Paper Airplane" 
                className="w-full h-full object-contain"
                style={{ filter: 'hue-rotate(240deg) saturate(1.5) brightness(1.1)' }}
              />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 max-w-2xl text-center mx-auto">
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
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent bg-white text-gray-900"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors whitespace-nowrap"
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

export default About
