import { motion } from 'framer-motion'
import { useState } from 'react'

// Hero Background Component - Image background (unused, commented out)
// const _HeroBackground = () => {
//   return (
//     <>
//       {/* Image background */}
//       <div 
//         className="absolute inset-0 w-full h-full"
//         style={{
//           zIndex: 0,
//           backgroundImage: 'url(/IMAGES/travels.jpg)',
//           backgroundSize: 'cover',
//           backgroundPosition: 'center',
//           backgroundRepeat: 'no-repeat'
//         }}
//       />
//       {/* Overlay for better text readability */}
//       <div 
//         className="absolute inset-0 w-full h-full bg-black/20"
//         style={{
//           zIndex: 1
//         }}
//       />
//     </>
//   )
// }

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call for form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
      
      // Reset status after 5 seconds
      setTimeout(() => {
        setSubmitStatus('idle')
      }, 5000)
    }, 1500)
  }

  const contactMethods = [
    {
      icon: (
        <img 
          src="/IMAGES/gmail.png" 
          alt="Email" 
          className="w-8 h-8 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      ),
      title: 'Email Us',
      description: 'Send us an email anytime',
      contact: 'support@ttelgo.com',
      link: 'mailto:support@ttelgo.com',
      color: 'bg-blue-500'
    },
    {
      icon: (
        <img 
          src="/IMAGES/whatsapp.png" 
          alt="WhatsApp" 
          className="w-8 h-8 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      ),
      title: 'Call Us',
      description: 'Mon-Fri from 8am to 6pm',
      contact: '+44 7818 984385',
      link: 'https://wa.me/447818984385',
      color: 'bg-green-500'
    },
    {
      icon: (
        <img 
          src="/IMAGES/placeholder.png" 
          alt="Location" 
          className="w-8 h-8 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      ),
      title: 'Visit Us',
      description: 'Come say hello at our office',
      contact: 'London, United Kingdom',
      link: 'https://www.google.com/maps/search/?api=1&query=71-75+Shelton+Street,+Covent+Garden,+London,+WC2H+9JQ',
      color: 'bg-purple-500'
    },
    {
      icon: (
        <img 
          src="/IMAGES/live.png" 
          alt="Live Chat" 
          className="w-8 h-8 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
          }}
        />
      ),
      title: 'Live Chat',
      description: '24/7 customer support',
      contact: 'Start a conversation',
      link: '#',
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="w-full">
      {/* Hero Section - Merged with Navbar */}
      <section 
        className="relative pb-36 md:pb-44 overflow-hidden bg-white"
        style={{
          paddingTop: '4rem' // Space for navbar
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ paddingTop: '4rem' }}>
          <div className="flex items-center justify-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-[800px] relative z-20 text-center"
            >
              {/* Subtitle */}
              <div className="mb-4">
                <span className="text-xs text-gray-600 uppercase tracking-[0.2em] font-semibold">
                  GET IN TOUCH
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-telgo-red mb-6 leading-tight">
                Contact Us
              </h1>
              
              {/* Description */}
              <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
                Have a question or need assistance? We're here to help! Reach out to our team and we'll get back to you as soon as possible.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ways to Reach Us
            </h2>
            <div className="flex justify-center">
              <svg className="mt-2" width="200" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 3C5 3 20 1.5 40 3C60 4.5 80 1.5 100 3C120 4.5 140 1.5 160 3C180 4.5 195 2 195 3" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <motion.a
                key={index}
                href={method.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-start mb-2 group-hover:scale-110 transition-transform">
                  {method.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <p className="text-telgo-red font-medium text-sm">{method.contact}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-transparent relative">
        {/* Dots Pattern Background */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle, #cbd5e1 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            backgroundPosition: '0 0'
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 md:p-12 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
              </div>

              {/* Subject Input */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                    placeholder="How can we help?"
                  />
                </div>
              </div>

              {/* Message Textarea */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-12 py-4 bg-telgo-red text-white rounded-lg font-semibold text-lg transition-colors ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </motion.button>
              </div>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-center"
                >
                  <p className="font-medium">✓ Message sent successfully! We'll get back to you soon.</p>
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </section>

      {/* Office Location Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 md:p-12 shadow-lg"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left - Office Info */}
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  Our Office
                  <svg className="mt-2" width="120" height="4" viewBox="0 0 120 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 2C2 2 12 1 24 2C36 3 48 1 60 2C72 3 84 1 96 2C108 3 118 1 118 2" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" fill="none"/>
                  </svg>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-start">
                      <img 
                        src="/IMAGES/placeholder.png" 
                        alt="Address" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                      <p className="text-gray-600">
                        TikTel Ltd. (UK)<br />
                        71-75 Shelton Street, Covent Garden<br />
                        London, WC2H 9JQ, United Kingdom
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-start">
                      <img 
                        src="/IMAGES/working-time.png" 
                        alt="Business Hours" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Business Hours</h4>
                      <p className="text-gray-600">
                        Monday - Friday: 8:00 AM - 6:00 PM GMT<br />
                        Saturday - Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Google Map */}
              <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden border-2 border-gray-300">
                <iframe
                  src="https://www.google.com/maps?q=71-75+Shelton+Street,+Covent+Garden,+London,+WC2H+9JQ&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="TikTel Ltd. Office Location - 71-75 Shelton Street, Covent Garden, London, WC2H 9JQ"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact

