import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { esimService } from '@/modules/esim/services/esim.service'
import { processQRCodeData } from '@/shared/utils/qrCodeUtils'

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

const MyeSIM = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const matchingIdFromUrl = searchParams.get('matchingId')
  const iccidFromUrl = searchParams.get('iccid')
  const esimIdFromUrl = searchParams.get('esimId') // Legacy support
  
  const [iccid, setIccid] = useState('')
  const [email, setEmail] = useState('')
  const [subscribeEmail, setSubscribeEmail] = useState('')
  
  // Order and QR code state
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [qrCode, setQrCode] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [matchingId] = useState<string | null>(matchingIdFromUrl || esimIdFromUrl || null)
  const [esimId] = useState<string | null>(matchingIdFromUrl || esimIdFromUrl || null)

  // Fetch order details and QR code if orderId/esimId is present
  useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId && !esimIdFromUrl && !matchingIdFromUrl) return

      try {
        setLoading(true)
        setError(null)

        // Priority: esimId (UUID) > orderId > matchingId
        // The QR code endpoint needs a UUID, not matchingId
        let qrCodeId: string | null = null

        // First priority: Use esimId from URL if available (it's already the UUID we need)
        if (esimIdFromUrl) {
          qrCodeId = esimIdFromUrl
          console.log('Using esimId from URL (highest priority):', qrCodeId)
          
          // Still try to fetch order details for display purposes if we have orderId
          if (orderId && orderId !== 'unknown') {
            try {
              console.log('Fetching order details for display purposes, orderId:', orderId)
              const order = await esimService.getOrderDetails(orderId)
              setOrderDetails(order)
            } catch (orderError) {
              console.warn('Could not fetch order details (non-critical):', orderError)
            }
          }
        } else if (orderId && orderId !== 'unknown') {
          // Second priority: Try to get order details to extract the UUID
          try {
            console.log('Fetching order details for orderId:', orderId)
            const order = await esimService.getOrderDetails(orderId)
            setOrderDetails(order)
            
            // Extract UUID from order details
            qrCodeId = order.esimId || order.id
            console.log('Order details:', order, 'eSIM UUID for QR:', qrCodeId)
          } catch (orderError) {
            console.warn('Could not fetch order details:', orderError)
            // Fallback to using orderId as UUID if it looks like UUID
            if (orderId && orderId.includes('-') && orderId.length > 30) {
              qrCodeId = orderId
              console.log('Using orderId as UUID (looks like UUID):', qrCodeId)
            }
          }
        }

        // Fallback option: attempt to use matchingId (note: this may not work as QR code endpoint requires UUID)
        if (!qrCodeId && matchingIdFromUrl) {
          qrCodeId = matchingIdFromUrl
          console.log('Using matchingId (may not work):', qrCodeId)
        }

        // Get QR code using UUID
        if (qrCodeId) {
          console.log('Fetching QR code for UUID:', qrCodeId)
          try {
            const { qrCode: qr } = await esimService.getQRCode(qrCodeId)
            if (qr) {
              console.log('Raw QR code received, processing...')
              // Process QR code (extract from ZIP if needed)
              const processedQR = await processQRCodeData(qr)
              setQrCode(processedQR)
              console.log('QR code processed and ready for display')
              setError(null)
            } else {
              setError('QR code not available yet. Please refresh in a moment.')
            }
          } catch (qrError) {
            console.error('Failed to fetch QR code:', qrError)
            const errorMsg = qrError instanceof Error ? qrError.message : 'Unknown error'
            if (errorMsg.includes('No eSIMs found')) {
              setError('QR code not found. The eSIM ID may be incorrect. Please check the order details or try purchasing a new bundle.')
            } else if (errorMsg.includes('extract')) {
              setError('QR code received but could not be processed. Please try again.')
            } else {
              setError('Order created but QR code not available yet. Please refresh in a moment.')
            }
          }
        } else {
          setError('Unable to determine eSIM ID. Please check the order details.')
        }
      } catch (err) {
        console.error('Failed to fetch order data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    fetchOrderData()
  }, [orderId, esimIdFromUrl, matchingIdFromUrl])

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // User can enter UUID (eSIM ID) or orderId
    const inputValue = iccid.trim() // Reusing iccid field for input
    
    if (!inputValue) {
      alert('Please enter an eSIM ID (UUID) or Order ID to look up your QR code.')
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Check if input looks like UUID (has dashes) or try as orderId first
      let qrCodeId = inputValue
      // Explicitly type as any so TypeScript understands the shape once populated
      let fetchedOrderDetails: any = null
      
      // Try to get order details first (helps populate order info)
      // If input looks like UUID, try using it as orderId to get details
      if (inputValue.includes('-') && inputValue.length > 30) {
        // Looks like UUID - try to get order details using it
        try {
          console.log('Input looks like UUID, fetching order details for:', inputValue)
          fetchedOrderDetails = await esimService.getOrderDetails(inputValue)
          qrCodeId = fetchedOrderDetails.esimId || fetchedOrderDetails.id || inputValue
          console.log('Got order details, eSIM UUID for QR:', qrCodeId)
        } catch (orderErr) {
          console.log('Could not fetch order details, will use input as UUID directly:', orderErr)
          qrCodeId = inputValue
        }
      } else {
        // Doesn't look like UUID, definitely try as orderId
        try {
          console.log('Input does not look like UUID, fetching order details for:', inputValue)
          fetchedOrderDetails = await esimService.getOrderDetails(inputValue)
          qrCodeId = fetchedOrderDetails.esimId || fetchedOrderDetails.id || inputValue
          console.log('Got eSIM UUID from order:', qrCodeId)
        } catch (orderErr) {
          console.warn('Could not fetch order details, trying input as UUID:', orderErr)
          qrCodeId = inputValue
        }
      }
      
      // Set order details if we got them
      if (fetchedOrderDetails) {
        setOrderDetails(fetchedOrderDetails)
      }
      
      console.log('Fetching QR code for UUID:', qrCodeId)
      const { qrCode: qr } = await esimService.getQRCode(qrCodeId)
      
      if (qr) {
        console.log('Raw QR code received, length:', qr.length, 'first 50 chars:', qr.substring(0, 50))
        try {
          // Process QR code (extract from ZIP if needed)
          console.log('Processing QR code data...')
          const processedQR = await processQRCodeData(qr)
          console.log('QR code processed successfully, setting state...')
          setQrCode(processedQR)
          console.log('QR code state updated, should display now')
          setError(null)
          
          // Update URL with esimId and orderId
          const params = new URLSearchParams()
          params.set('esimId', qrCodeId)
          if (fetchedOrderDetails?.orderId || fetchedOrderDetails?.id) {
            params.set('orderId', fetchedOrderDetails.orderId || fetchedOrderDetails.id || qrCodeId)
          }
          if (fetchedOrderDetails?.iccid) {
            params.set('iccid', fetchedOrderDetails.iccid)
          }
          window.history.replaceState({}, '', `/my-esim?${params.toString()}`)
        } catch (processError) {
          console.error('Error processing QR code:', processError)
          setError(`Failed to process QR code: ${processError instanceof Error ? processError.message : 'Unknown error'}. Please try again.`)
          setQrCode('') // Clear any partial QR code
        }
      } else {
        setError('QR code not found. Please verify the eSIM ID (UUID).')
        setQrCode('') // Clear QR code
      }
    } catch (err) {
      console.error('Failed to fetch QR code:', err)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      if (errorMsg.includes('No eSIMs found')) {
        setError('QR code not found. The eSIM ID may be incorrect. Please check the UUID format (e.g., 2bda1476-a32d-4ad2-8a11-b975b6437fc3).')
      } else if (errorMsg.includes('extract') || errorMsg.includes('ZIP')) {
        setError('QR code received but could not be processed. Please try again.')
      } else {
        setError('Failed to load QR code. Please check the eSIM ID and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    alert('Thank you for subscribing!')
    setSubscribeEmail('')
  }

  return (
    <div className="w-full">
      {/* Hero Section - Merged with Navbar */}
      <section 
        className="relative pb-16 md:pb-24 overflow-hidden bg-white"
        style={{
          paddingTop: '2rem' // Space for navbar
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" style={{ paddingTop: '2rem' }}>
          <div className="flex items-center justify-between gap-8">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 relative z-20 text-left"
            >
              {/* Subtitle */}
              <div className="mb-4">
                <span className="text-xs text-gray-600 uppercase tracking-[0.2em] font-semibold">
                  ACCESS YOUR ESIM DASHBOARD
                </span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-telgo-red mb-6 leading-tight">
                My eSIM
              </h1>
              
              {/* Tagline */}
              <p className="text-lg text-gray-700 mb-8 leading-relaxed font-medium">
                TTelGo (Your) eSIM: Travel smart, connect instantly – no physical SIM, no limits.
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
                src="/IMAGES/eSIM.png" 
                alt="eSIM" 
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

      {/* Order Details & QR Code Section - Show when orderId, esimId, or qrCode is present */}
      {(orderId || matchingIdFromUrl || esimIdFromUrl || qrCode) && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="bg-white rounded-lg p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-telgo-red mb-4"></div>
                <p className="text-gray-600">Loading your eSIM details...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <p className="text-red-800 font-semibold mb-2">Error loading order</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            ) : (orderDetails || qrCode) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-lg p-8 shadow-lg"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your eSIM is Ready!</h2>
                
                <div className={`grid gap-8 ${qrCode && (orderDetails || orderId || esimIdFromUrl) ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                  {/* Order Details - Only show if we have order details or URL params */}
                  {(orderDetails || orderId || esimIdFromUrl || matchingIdFromUrl) && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>
                      <div className="space-y-3">
                        {(orderId || orderDetails?.orderId || orderDetails?.id) && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="font-medium text-gray-900">{orderId || orderDetails?.orderId || orderDetails?.id}</span>
                          </div>
                        )}
                        {(esimIdFromUrl || matchingId || esimId || orderDetails?.esimId) && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">eSIM ID / Matching ID:</span>
                            <span className="font-medium text-gray-900">{esimIdFromUrl || matchingId || esimId || orderDetails?.esimId}</span>
                          </div>
                        )}
                        {(iccidFromUrl || orderDetails?.iccid) && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">ICCID:</span>
                            <span className="font-medium text-gray-900">{iccidFromUrl || orderDetails?.iccid}</span>
                          </div>
                        )}
                        {orderDetails?.status && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className={`font-medium ${
                              orderDetails.status === 'active' ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {orderDetails.status}
                            </span>
                          </div>
                        )}
                        {orderDetails?.bundleId && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Bundle:</span>
                            <span className="font-medium text-gray-900">{orderDetails.bundleId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* QR Code */}
                  {qrCode && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">QR Code for Activation</h3>
                      <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center">
                        <img 
                          src={qrCode} 
                          alt="eSIM QR Code" 
                          className="max-w-full h-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            setError('Failed to load QR code image')
                          }}
                        />
                      </div>
                      <p className="text-sm text-gray-600 mt-4 text-center">
                        Scan this QR code with your device to activate your eSIM
                      </p>
                    </div>
                  )}
                </div>

                {!qrCode && (esimId || orderDetails?.esimId || orderId) && (
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm mb-2">
                      QR code is being generated. Please wait a moment or refresh the page.
                    </p>
                    <button
                      onClick={async () => {
                        // Use esimId (UUID) from order details or URL
                        let qrEsimId = esimId || orderDetails?.esimId || esimIdFromUrl
                        
                        // If we have orderId but no esimId, try to get it from order details
                        if (!qrEsimId && orderId && orderId !== 'unknown') {
                          try {
                            const order = await esimService.getOrderDetails(orderId)
                            qrEsimId = order.esimId || order.id
                            setOrderDetails(order)
                          } catch (err) {
                            console.warn('Could not fetch order details:', err)
                          }
                        }
                        
                        // Fallback to orderId if it looks like UUID
                        if (!qrEsimId && orderId && orderId.includes('-') && orderId.length > 30) {
                          qrEsimId = orderId
                        }
                        
                        if (qrEsimId) {
                          try {
                            setLoading(true)
                            setError(null)
                            console.log('Refreshing QR code for UUID:', qrEsimId)
                            const { qrCode: qr } = await esimService.getQRCode(qrEsimId)
                            if (qr) {
                              console.log('Raw QR code received, processing...')
                              // Process QR code (extract from ZIP if needed)
                              const processedQR = await processQRCodeData(qr)
                              setQrCode(processedQR)
                              console.log('QR code processed and ready for display')
                            } else {
                              setError('QR code not ready yet. Please try again in a moment.')
                            }
                          } catch (err) {
                            console.error('Failed to fetch QR code:', err)
                            const errorMsg = err instanceof Error ? err.message : 'Unknown error'
                            if (errorMsg.includes('extract')) {
                              setError('QR code received but could not be processed. Please try again.')
                            } else {
                              setError('Failed to load QR code. Please verify the eSIM ID (UUID) is correct.')
                            }
                          } finally {
                            setLoading(false)
                          }
                        } else {
                          setError('Unable to determine eSIM ID. Please enter the UUID manually.')
                        }
                      }}
                      className="text-sm text-yellow-900 underline hover:text-yellow-700"
                    >
                      Refresh QR Code
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Manage My eSIMs Section */}
      <section className="pt-0 pb-16 bg-transparent">
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
                {/* eSIM ID (UUID) / Order ID Input */}
                <div>
                  <label htmlFor="iccid" className="block text-sm font-medium text-gray-700 mb-2">
                    eSIM ID (UUID) or Order ID
                  </label>
                  <input
                    type="text"
                    id="iccid"
                    value={iccid}
                    onChange={(e) => setIccid(e.target.value)}
                    placeholder="Enter eSIM ID (UUID, e.g., 2bda1476-a32d-4ad2-8a11-b975b6437fc3) or Order ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                    style={{
                      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                    }}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Enter the eSIM ID (UUID format) from your order to retrieve your QR code. 
                    <br />
                    Example: <code className="text-xs bg-gray-100 px-1 rounded">2bda1476-a32d-4ad2-8a11-b975b6437fc3</code>
                  </p>
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
                  disabled={loading}
                  className="w-full px-6 py-3 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {loading ? 'Loading QR Code...' : 'Get QR Code'}
                </button>
              </form>
            </motion.div>
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
