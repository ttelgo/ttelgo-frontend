import { useState } from 'react'
import { motion } from 'framer-motion'

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

const HelpCentre = () => {
  const [email, setEmail] = useState('')
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null)

  const helpTopics = [
    {
      id: 1,
      title: 'Quick Help for Your eSIM Setup',
      description: 'TTelGo eSIM not working? Find quick fixes for activation and signal issues to get you connected quickly.',
      content: (
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Activation Issues</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Ensure your device supports eSIM technology</li>
              <li>Check that you have a stable internet connection during activation</li>
              <li>Verify the QR code is scanned correctly without any obstructions</li>
              <li>Restart your device if activation fails</li>
              <li>Make sure you're not trying to activate while roaming</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Signal Issues</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Check if eSIM is enabled in your device settings</li>
              <li>Verify that data roaming is enabled for the eSIM</li>
              <li>Ensure you're in a covered area (check coverage map)</li>
              <li>Try manually selecting the network operator</li>
              <li>Contact support if issues persist after troubleshooting</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Understanding Your eSIM Plan',
      description: 'Learn how your TTelGo plan works, including validity periods, extras, and data usage monitoring.',
      content: (
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Plan Validity</h4>
            <p className="mb-2">Your eSIM plan validity period starts from the moment of activation. Plans typically range from 7 days to 365 days depending on your selected package.</p>
            <p>Once activated, the validity countdown begins regardless of data usage.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Data Usage</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Monitor your data usage through the TTelGo app</li>
              <li>Data speeds may vary based on network conditions</li>
              <li>Unused data does not roll over to the next period</li>
              <li>You can purchase additional data packs if needed</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Extras & Add-ons</h4>
            <p>You can purchase additional data, extend validity, or add hotspot capabilities through the app or website at any time.</p>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Transactions, Billing & Refunds',
      description: 'Find support for payments, invoices, refunds, and billing issues – all in one convenient place.',
      content: (
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Payment Methods</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Credit/Debit Cards (Visa, Mastercard, American Express)</li>
              <li>PayPal</li>
              <li>Bank Transfer</li>
              <li>Apple Pay and Google Pay (in-app)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Invoices</h4>
            <p className="mb-2">All invoices are automatically sent to your registered email address. You can also download invoices from your account dashboard.</p>
            <p>Invoices include VAT where applicable and are available in multiple currencies.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Refunds</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Refunds are available for unactivated eSIMs within 30 days of purchase</li>
              <li>Partial refunds may apply for activated plans based on usage</li>
              <li>Refund requests can be submitted through the support portal</li>
              <li>Processing time: 5-10 business days</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      id: 4,
      title: 'Update & Manage Your TTelGo eSIM',
      description: 'TTelGo account help – update your information, reset passwords, and manage settings in just a few simple steps.',
      content: (
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Account Management</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Update your email, phone number, and billing address from Account Settings</li>
              <li>Change your password anytime through the security settings</li>
              <li>Enable two-factor authentication for enhanced security</li>
              <li>Manage payment methods and billing preferences</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Password Reset</h4>
            <p className="mb-2">If you've forgotten your password:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Click "Forgot Password" on the login page</li>
              <li>Enter your registered email address</li>
              <li>Check your email for the reset link</li>
              <li>Follow the instructions to create a new password</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">eSIM Settings</h4>
            <p>Manage your active eSIMs, view usage statistics, and configure data limits directly from your account dashboard or mobile app.</p>
          </div>
        </div>
      ),
    },
    {
      id: 5,
      title: 'TTelGo eSIM Discounts & Benefits',
      description: 'Unlock TTelGo promo codes and referral rewards – apply them in-app and start saving on your next eSIM purchase.',
      content: (
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Promo Codes</h4>
            <p className="mb-2">Apply promo codes during checkout to receive discounts on your eSIM purchase. Codes can be entered in the payment section.</p>
            <p>Subscribe to our newsletter to receive exclusive promo codes and special offers.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Referral Program</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Refer friends and earn credits for each successful referral</li>
              <li>Both you and your friend receive benefits</li>
              <li>Share your unique referral code via email, social media, or direct link</li>
              <li>Track your referrals and rewards in the app</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Loyalty Benefits</h4>
            <p>Frequent travelers enjoy additional benefits including priority support, exclusive deals, and early access to new destinations.</p>
          </div>
        </div>
      ),
    },
    {
      id: 6,
      title: 'About eSIM',
      description: 'Explore eSIM technology: digital activation, no physical SIMs required, and smarter mobile experiences for modern travelers.',
      content: (
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">What is eSIM?</h4>
            <p className="mb-2">eSIM (embedded SIM) is a digital SIM card that's built into your device. Unlike traditional SIM cards, eSIMs don't require physical installation and can be activated instantly via QR code.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>No physical SIM card needed - activate instantly</li>
              <li>Store multiple eSIM profiles on one device</li>
              <li>Switch between plans without changing cards</li>
              <li>Perfect for travelers - no SIM card swapping</li>
              <li>More secure and environmentally friendly</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Device Compatibility</h4>
            <p>eSIM is supported on most modern smartphones including iPhone XS and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer, and many other devices. Check your device specifications to confirm compatibility.</p>
          </div>
        </div>
      ),
    },
    {
      id: 7,
      title: 'About TTelGo eSIM',
      description: 'Discover how TTelGo eSIM, powered by TikTel Ltd, delivers global data connectivity across 200+ destinations worldwide.',
      fullWidth: true,
      content: (
        <div className="space-y-4 text-gray-700">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Who We Are</h4>
            <p className="mb-2">TTelGo is powered by TikTel Ltd. UK, a future-focused managed telecom services provider driving digital transformation through secure connectivity, scalable infrastructure, and advanced eSIM innovation.</p>
            <p>We specialize in delivering instant, borderless mobile access across 200+ global destinations.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Our Mission</h4>
            <p>TTelGo's mission is to empower global travel by connecting people through curated local insights and seamless digital access - eliminating the burden of costly data roaming in a connected world.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Coverage</h4>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>200+ destinations worldwide</li>
              <li>Local, regional, and global eSIM plans</li>
              <li>High-speed 4G/5G connectivity</li>
              <li>24/7 customer support</li>
              <li>Instant activation and QR code delivery</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Why Choose TTelGo?</h4>
            <p>We combine cutting-edge eSIM technology with exceptional customer service, offering flexible plans that adapt to your travel needs. Whether you're a business traveler, digital nomad, or vacationer, TTelGo keeps you connected wherever you go.</p>
          </div>
        </div>
      ),
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for subscribing!')
    setEmail('')
  }

  const handleTopicToggle = (topicId: number) => {
    setExpandedTopic(prevExpanded => prevExpanded === topicId ? null : topicId)
  }

  return (
    <div className="w-full">
      {/* Hero Section - Merged with Navbar */}
      <section 
        className="relative pb-8 md:pb-16 overflow-hidden bg-white -mt-16"
        style={{
          paddingTop: '4rem' // Space for navbar
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ paddingTop: '4rem' }}>
          <div className="flex items-center justify-between gap-8">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 relative z-20 text-left -mt-8"
            >
              {/* Subtitle */}
              <div className="mb-4">
                <span className="text-xs text-gray-600 uppercase tracking-[0.2em] font-semibold">
                  WE&apos;RE HERE - DAY OR NIGHT, ANYTIME.
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-telgo-red mb-6 leading-tight">
                Help Center
              </h1>
              
              {/* Description */}
              <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
                Our support team is available 24/7 – and we&apos;re always happy to help you stay connected.
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
                src="/IMAGES/Hellp.png" 
                alt="Help Center" 
                className="w-full h-auto max-w-md object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content - Help Topics */}
      <section className="pt-0 pb-16 bg-transparent mt-4">
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
          <div className="grid grid-cols-1 gap-6" style={{ alignItems: 'start' }}>
            {helpTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg p-6"
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  alignSelf: 'start',
                  height: 'auto'
                }}
              >
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {topic.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {topic.description}
                </p>
                
                {/* Expandable Content */}
                {expandedTopic === topic.id && topic.content && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden mb-4 pt-4 border-t border-gray-200"
                  >
                    {topic.content}
                  </motion.div>
                )}
                
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleTopicToggle(topic.id)
                  }}
                  className="text-telgo-red font-semibold hover:underline inline-flex items-center gap-1 transition-transform"
                  type="button"
                >
                  {expandedTopic === topic.id ? 'Less' : 'More'}
                  <motion.svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    animate={{ rotate: expandedTopic === topic.id ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section className="pt-8 pb-16 bg-transparent relative">
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
