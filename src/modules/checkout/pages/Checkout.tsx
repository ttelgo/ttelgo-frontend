import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { eSIMPlan } from '@/shared/types'
import { paymentService, type CreatePaymentIntentRequest } from '@/modules/payment/services/payment.service'

// Stripe promise - will be initialized with publishable key
let stripePromise: Promise<any> | null = null

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get plan from location state or create a default one
  const planFromState = (location.state as { plan?: eSIMPlan | any })?.plan
  const defaultPlan: eSIMPlan = {
    id: '1',
    name: 'Global eSIM Plan',
    description: 'Global coverage plan',
    price: 29.99,
    currency: 'USD',
    data: '10GB',
    validity: '30 days',
    regions: ['Global'],
    features: ['Global Coverage', '24/7 Support'],
  }
  
  const plan: eSIMPlan = planFromState 
    ? {
        id: planFromState.id || defaultPlan.id,
        name: planFromState.name || defaultPlan.name,
        description: planFromState.description || defaultPlan.description,
        price: typeof planFromState.price === 'string' 
          ? parseFloat(planFromState.price) 
          : (planFromState.price || defaultPlan.price),
        currency: planFromState.currency || defaultPlan.currency,
        data: planFromState.data || defaultPlan.data,
        validity: planFromState.validity || defaultPlan.validity,
        regions: planFromState.regions || defaultPlan.regions,
        features: planFromState.features || defaultPlan.features,
        popular: planFromState.popular || false,
      }
    : defaultPlan

  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal' | 'bank'>('stripe')
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  })
  const [billingData, setBillingData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    country: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [paymentIntent, setPaymentIntent] = useState<any>(null)
  const [orderId, setOrderId] = useState<number | null>(null)
  const [stripePublishableKey, setStripePublishableKey] = useState<string | null>(null)
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false)

  // Format currency symbol
  const getCurrencySymbol = (currency: string) => {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
    }
    return symbols[currency] || currency
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  // Reset payment intent when payment method changes away from Stripe
  useEffect(() => {
    if (paymentMethod !== 'stripe') {
      setPaymentIntent(null)
      setOrderId(null)
      setStripePublishableKey(null)
      setIsLoadingPaymentIntent(false)
      // Clear any payment-related errors
      if (errors.submit && errors.submit.includes('payment')) {
        setErrors({ ...errors, submit: '' })
      }
    }
  }, [paymentMethod])

  // Create payment intent when Stripe is selected and email is available
  useEffect(() => {
    // Only proceed if Stripe is selected
    if (paymentMethod !== 'stripe') {
      return
    }

    // Debounce email validation to prevent too many API calls
    const email = billingData.email?.trim() || ''
    const isValidEmail = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    
    // Don't create if email is invalid or payment intent already exists
    if (!isValidEmail || paymentIntent) {
      return
    }

    // Prevent multiple simultaneous requests
    let isCancelled = false

    const createPaymentIntent = async () => {
      if (isCancelled) return

      try {
        setIsLoadingPaymentIntent(true)
        const bundleId = (plan as any).bundleId || plan.id
        
        const request: CreatePaymentIntentRequest = {
          amount: plan.price,
          currency: plan.currency?.toLowerCase() || 'usd',
          bundleId: bundleId,
          bundleName: plan.name,
          quantity: 1,
          customerEmail: billingData.email,
        }

        const response = await paymentService.createPaymentIntent(request)
        
        if (isCancelled) return

        // Store the full response which includes clientSecret
        setPaymentIntent({
          clientSecret: response.clientSecret,
          paymentIntentId: response.paymentIntentId,
          publishableKey: response.publishableKey,
          orderId: response.orderId
        })
        setOrderId(response.orderId)
        setStripePublishableKey(response.publishableKey)
        
        // Initialize Stripe with publishable key
        if (!stripePromise && response.publishableKey) {
          stripePromise = loadStripe(response.publishableKey)
        }
        
        // Clear any previous errors
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.submit
          return newErrors
        })
      } catch (err: any) {
        if (isCancelled) return
        
        console.error('Failed to create payment intent:', err)
        const errorMessage = err.message || err.response?.data?.message || 'Failed to initialize payment. Please refresh the page.'
        setErrors({ submit: errorMessage })
      } finally {
        if (!isCancelled) {
          setIsLoadingPaymentIntent(false)
        }
      }
    }

    // Debounce the API call - wait 800ms after user stops typing
    const timeoutId = setTimeout(() => {
      createPaymentIntent()
    }, 800)

    return () => {
      isCancelled = true
      clearTimeout(timeoutId)
    }
  }, [plan.id, billingData.email, paymentMethod]) // Removed paymentIntent from dependencies to prevent loops

  const validateBilling = () => {
    const newErrors: Record<string, string> = {}
    
    // Email validation
    const email = billingData.email?.trim() || ''
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email address'
    }
    
    // First name validation
    const firstName = billingData.firstName?.trim() || ''
    if (!firstName) {
      newErrors.firstName = 'First name is required'
    }
    
    // Last name validation
    const lastName = billingData.lastName?.trim() || ''
    if (!lastName) {
      newErrors.lastName = 'Last name is required'
    }
    
    // Country validation
    const country = billingData.country?.trim() || ''
    if (!country) {
      newErrors.country = 'Country is required'
    }
    
    // Address validation
    const address = billingData.address?.trim() || ''
    if (!address) {
      newErrors.address = 'Address is required'
    }
    
    // City validation
    const city = billingData.city?.trim() || ''
    if (!city) {
      newErrors.city = 'City is required'
    }
    
    // ZIP code validation
    const zipCode = billingData.zipCode?.trim() || ''
    if (!zipCode) {
      newErrors.zipCode = 'ZIP code is required'
    }
    
    return newErrors
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    setCardData({ ...cardData, cardNumber: formatted })
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: '' })
    }
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    setCardData({ ...cardData, expiryDate: formatted })
    if (errors.expiryDate) {
      setErrors({ ...errors, expiryDate: '' })
    }
  }

  // Stripe payment handler (used by StripeCheckoutForm component)
  const handleStripePayment = async (stripe: any, elements: any, cardElement?: any) => {
    if (!stripe || !elements || !paymentIntent || !orderId) {
      throw new Error('Payment not initialized. Please wait a moment and try again.')
    }

    setIsProcessing(true)
    setErrors({})

    try {
      // Validate billing information first
      const billingErrors = validateBilling()
      if (Object.keys(billingErrors).length > 0) {
        setErrors(billingErrors)
        setIsProcessing(false)
        const firstErrorField = Object.keys(billingErrors)[0]
        const element = document.getElementById(firstErrorField)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          element.focus()
        }
        return
      }

      // Get card element - use provided element or get it fresh
      let cardElementToUse = cardElement
      
      // If element not provided, get it fresh from elements
      if (!cardElementToUse) {
        try {
          cardElementToUse = elements.getElement(CardElement) || elements.getElement('card')
        } catch (e) {
          console.error('Error getting card element:', e)
        }
      }
      
      // Verify element is valid
      if (!cardElementToUse) {
        throw new Error('Card element is not accessible. Please ensure the card form is fully loaded and try again.')
      }
      
      // Additional validation: ensure element is actually mounted
      if (typeof cardElementToUse !== 'object' || cardElementToUse === null) {
        throw new Error('Card element is invalid. Please refresh the page and try again.')
      }

      // Confirm payment with Stripe
      const { error: confirmError, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: cardElementToUse,
            billing_details: {
              name: `${billingData.firstName} ${billingData.lastName}`,
              email: billingData.email,
              phone: billingData.phone || undefined,
              address: {
                line1: billingData.address,
                city: billingData.city,
                state: billingData.state || undefined,
                postal_code: billingData.zipCode,
                country: billingData.country,
              },
            },
          },
        }
      )

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment failed')
      }

      if (confirmedPayment?.status === 'succeeded' && orderId) {
        // Confirm payment on backend
        await paymentService.confirmPayment(confirmedPayment.id)

        // Activate eSIM after payment confirmation
        const activationResponse = await paymentService.activateEsimAfterPayment(orderId)
        
        // Extract order reference for QR code
        const orderReference = activationResponse?.orderReference || activationResponse?.id
        const matchingId = activationResponse?.order?.[0]?.esims?.[0]?.matchingId
        const iccid = activationResponse?.order?.[0]?.esims?.[0]?.iccid

        setIsProcessing(false)
        setShowSuccess(true)
        
        // Redirect to My eSIM with orderReference (for QR code)
        setTimeout(() => {
          const params = new URLSearchParams()
          if (orderId) params.set('orderId', orderId.toString())
          if (orderReference) params.set('esimId', orderReference)
          if (matchingId) params.set('matchingId', matchingId)
          if (iccid) params.set('iccid', iccid)
          
          navigate(`/my-esim?${params.toString()}`, { 
            state: { 
              plan, 
              order: activationResponse,
              esimId: orderReference,
              matchingId: matchingId,
              iccid: iccid,
              success: true 
            } 
          })
        }, 1500)
      } else {
        throw new Error('Payment not completed')
      }
    } catch (error) {
      console.error('Payment failed:', error)
      setIsProcessing(false)
      setErrors({ 
        submit: error instanceof Error ? error.message : 'Payment failed. Please try again.' 
      })
    }
  }

  // Legacy handler for non-Stripe payment methods
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (paymentMethod === 'stripe') {
      // Stripe payment is handled by StripeCheckoutForm component
      return
    }
    
    // Clear previous errors
    setErrors({})
    
    // Validate billing information
    const billingErrors = validateBilling()
    if (Object.keys(billingErrors).length > 0) {
      setErrors(billingErrors)
      const firstErrorField = Object.keys(billingErrors)[0]
      const element = document.getElementById(firstErrorField)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        element.focus()
      }
      return
    }
    
    setIsProcessing(true)
    setErrors({})

    // For PayPal and Bank Transfer, show coming soon message
    setErrors({ 
      submit: `${paymentMethod === 'paypal' ? 'PayPal' : 'Bank Transfer'} payment is coming soon. Please use Stripe for now.` 
    })
    setIsProcessing(false)
  }

  // Calculate totals
  const subtotal = plan.price
  const tax = 0 // No tax for demo
  const processingFee = 0 // No fee for demo
  const total = subtotal + tax + processingFee

  // Stripe Elements options - only when we have a client secret
  const elementsOptions: StripeElementsOptions | undefined = paymentIntent?.clientSecret
    ? {
        clientSecret: paymentIntent.clientSecret,
        appearance: {
          theme: 'stripe' as const,
        },
      }
    : undefined

  // Stripe Checkout Form Component (inline) - handles card input and payment only
  const StripeCheckoutForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const [cardElementReady, setCardElementReady] = useState(false)
    const cardElementRef = useRef<any>(null)

    // Note: We don't need to store the element in a ref
    // The onReady callback will tell us when it's ready
    // We'll get it fresh from elements when needed

    const handlePayment = async () => {
      if (!stripe || !elements || !paymentIntent) {
        setErrors({ submit: 'Payment not initialized. Please wait a moment and try again.' })
        return
      }

      // Ensure the element is ready before proceeding
      if (!cardElementReady) {
        setErrors({ submit: 'Card element is not ready. Please wait for the card form to load completely.' })
        return
      }

      // Always get the element fresh from elements - don't use stored ref
      // This ensures we're using the current mounted element
      let cardElement = null
      try {
        cardElement = elements.getElement(CardElement) || elements.getElement('card')
      } catch (e) {
        console.error('Error getting card element:', e)
      }

      if (!cardElement) {
        setErrors({ submit: 'Card element is not accessible. Please refresh the page and try again.' })
        return
      }

      // Call the parent handler with the fresh element reference
      try {
        await handleStripePayment(stripe, elements, cardElement)
      } catch (error: any) {
        // Error is already handled in handleStripePayment
        console.error('Payment error:', error)
      }
    }

    return (
      <div className="space-y-6">
        {/* Card Details */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Card Details</h3>
            <div className="flex gap-2">
              <div className="text-xs text-gray-500">Secured by</div>
              <div className="font-bold text-blue-600">Stripe</div>
            </div>
          </div>
          
          <div>
            <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
              Card Information
            </label>
            <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-telgo-red focus-within:border-transparent bg-white"
              style={{
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
              }}
            >
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#32325d',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#fa755a',
                      iconColor: '#fa755a',
                    },
                  },
                }}
                onReady={() => {
                  // Element is ready - we can now use it
                  setCardElementReady(true)
                }}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={isProcessing || !stripe || !elements || !paymentIntent || !cardElementReady}
          className="w-full py-4 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-6"
          style={{
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }}
        >
          {isProcessing 
            ? 'Processing Payment...' 
            : !cardElementReady
            ? 'Loading card form...'
            : `Pay - ${getCurrencySymbol(plan.currency)}${total.toFixed(2)}`
          }
        </button>
        
        {errors.submit && (
          <p className="text-sm text-red-600 text-center mt-2">{errors.submit}</p>
        )}
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </motion.div>

        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-800 font-semibold">Payment successful!</p>
                <p className="text-green-700 text-sm">Redirecting to your eSIM dashboard...</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-lg p-6 md:p-8 mb-6"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="mb-6 space-y-3">
                {/* Stripe/Credit Card */}
                <label 
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'stripe' ? 'border-telgo-red bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={() => setPaymentMethod('stripe')}
                    className="sr-only"
                  />
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 border border-gray-200"
                      style={{
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <img 
                        src="/IMAGES/Credit.png" 
                        alt="Credit Card" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Credit/Debit Card</div>
                      <div className="text-sm text-gray-600">Visa, Mastercard, Amex, Discover</div>
                      {paymentMethod === 'stripe' && (
                        <div className="text-xs text-gray-500 mt-1">Secured by Stripe</div>
                      )}
                    </div>
                  </div>
                  {paymentMethod === 'stripe' && (
                    <svg className="w-6 h-6 text-telgo-red" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>

                {/* PayPal */}
                <label 
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'paypal' ? 'border-telgo-red bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="sr-only"
                  />
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 border border-gray-200"
                      style={{
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <img 
                        src="/IMAGES/Paypal.png" 
                        alt="PayPal" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">PayPal</div>
                      <div className="text-sm text-gray-600">Pay with your PayPal account</div>
                    </div>
                  </div>
                  {paymentMethod === 'paypal' && (
                    <svg className="w-6 h-6 text-telgo-red" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>

                {/* Bank Account */}
                <label 
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'bank' ? 'border-telgo-red bg-red-50' : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="sr-only"
                  />
                  <div className="flex items-center flex-1">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 border border-gray-200"
                      style={{
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                      }}
                    >
                      <img 
                        src="/IMAGES/Bank.png" 
                        alt="Bank Transfer" 
                        className="w-8 h-8 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }} 
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">Bank Transfer</div>
                      <div className="text-sm text-gray-600">Direct bank transfer (1-3 business days)</div>
                    </div>
                  </div>
                  {paymentMethod === 'bank' && (
                    <svg className="w-6 h-6 text-telgo-red" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              </div>

              {/* Payment Forms */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Stripe Card Form */}
                {paymentMethod === 'stripe' && stripePublishableKey && stripePromise && elementsOptions && paymentIntent?.clientSecret && (
                  <Elements 
                    stripe={stripePromise} 
                    options={elementsOptions}
                  >
                    <StripeCheckoutForm />
                  </Elements>
                )}
                
                {paymentMethod === 'stripe' && !stripePublishableKey && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center py-8">
                      {isLoadingPaymentIntent ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-telgo-red"></div>
                          <span className="ml-3 text-gray-600">Initializing secure payment...</span>
                        </>
                      ) : (
                        <div className="text-center">
                          <p className="text-gray-600 mb-2">Please enter your email address above to initialize payment.</p>
                          {errors.submit && (
                            <p className="text-sm text-red-600 mt-2">{errors.submit}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* PayPal Form */}
                {paymentMethod === 'paypal' && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center mb-4">
                      <img 
                        src="/IMAGES/Paypal.png" 
                        alt="PayPal" 
                        className="h-8 mr-3"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">PayPal Checkout</h3>
                        <p className="text-sm text-gray-600">You will be redirected to PayPal to complete your payment securely.</p>
                      </div>
                    </div>
                    <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        <strong>Note:</strong> After clicking "Pay with PayPal", you'll be redirected to PayPal's secure payment page. 
                        Once payment is confirmed, you'll be redirected back to complete your order.
                      </p>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Form */}
                {paymentMethod === 'bank' && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Bank Transfer Details</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Bank transfers may take 1-3 business days to process. Your eSIM will be activated once payment is confirmed.
                      </p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Important:</strong> Please include your order reference in the transfer description. 
                        Bank details will be provided after order confirmation.
                      </p>
                    </div>
                    <div>
                      <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700 mb-2">
                        Account Holder Name
                      </label>
                      <input
                        type="text"
                        id="bankAccount"
                        placeholder="Enter account holder name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                        style={{
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Billing Information */}
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Billing Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                        <input
                          type="email"
                          id="email"
                          value={billingData.email}
                          onChange={(e) => {
                            const value = e.target.value
                            setBillingData({ ...billingData, email: value })
                            // Clear error when user starts typing
                            if (errors.email && value.trim()) {
                              setErrors({ ...errors, email: '' })
                            }
                          }}
                          onBlur={() => {
                            // Validate on blur
                            const email = billingData.email?.trim() || ''
                            if (!email) {
                              setErrors({ ...errors, email: 'Email is required' })
                            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                              setErrors({ ...errors, email: 'Invalid email address' })
                            } else {
                              setErrors({ ...errors, email: '' })
                            }
                          }}
                        placeholder="your.email@example.com"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.email 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-telgo-red focus:border-transparent'
                        } text-gray-900 bg-white`}
                        style={{
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          value={billingData.firstName}
                          onChange={(e) => {
                            const value = e.target.value
                            setBillingData({ ...billingData, firstName: value })
                            // Clear error when user starts typing
                            if (errors.firstName && value.trim()) {
                              setErrors({ ...errors, firstName: '' })
                            }
                          }}
                          onBlur={() => {
                            // Validate on blur
                            if (!billingData.firstName?.trim()) {
                              setErrors({ ...errors, firstName: 'First name is required' })
                            } else {
                              setErrors({ ...errors, firstName: '' })
                            }
                          }}
                          placeholder="John"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.firstName 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-telgo-red focus:border-transparent'
                          } text-gray-900 bg-white`}
                          style={{
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                          }}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          value={billingData.lastName}
                          onChange={(e) => {
                            const value = e.target.value
                            setBillingData({ ...billingData, lastName: value })
                            // Clear error when user starts typing
                            if (errors.lastName && value.trim()) {
                              setErrors({ ...errors, lastName: '' })
                            }
                          }}
                          onBlur={() => {
                            // Validate on blur
                            if (!billingData.lastName?.trim()) {
                              setErrors({ ...errors, lastName: 'Last name is required' })
                            } else {
                              setErrors({ ...errors, lastName: '' })
                            }
                          }}
                          placeholder="Doe"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.lastName 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-telgo-red focus:border-transparent'
                          } text-gray-900 bg-white`}
                          style={{
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                          }}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={billingData.phone}
                        onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white"
                        style={{
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                        Country <span className="text-red-500">*</span>
                      </label>
                        <input
                          type="text"
                          id="country"
                          value={billingData.country}
                          onChange={(e) => {
                            const value = e.target.value
                            setBillingData({ ...billingData, country: value })
                            // Clear error when user starts typing
                            if (errors.country && value.trim()) {
                              setErrors({ ...errors, country: '' })
                            }
                          }}
                          onBlur={() => {
                            // Validate on blur
                            if (!billingData.country?.trim()) {
                              setErrors({ ...errors, country: 'Country is required' })
                            } else {
                              setErrors({ ...errors, country: '' })
                            }
                          }}
                        placeholder="United States"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.country 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-telgo-red focus:border-transparent'
                        } text-gray-900 bg-white`}
                        style={{
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }}
                      />
                      {errors.country && (
                        <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                        <input
                          type="text"
                          id="address"
                          value={billingData.address}
                          onChange={(e) => {
                            const value = e.target.value
                            setBillingData({ ...billingData, address: value })
                            // Clear error when user starts typing
                            if (errors.address && value.trim()) {
                              setErrors({ ...errors, address: '' })
                            }
                          }}
                          onBlur={() => {
                            // Validate on blur
                            if (!billingData.address?.trim()) {
                              setErrors({ ...errors, address: 'Address is required' })
                            } else {
                              setErrors({ ...errors, address: '' })
                            }
                          }}
                        placeholder="123 Main Street"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                          errors.address 
                            ? 'border-red-500 focus:ring-red-500' 
                            : 'border-gray-300 focus:ring-telgo-red focus:border-transparent'
                        } text-gray-900 bg-white`}
                        style={{
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                        }}
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="city"
                          value={billingData.city}
                          onChange={(e) => {
                            const value = e.target.value
                            setBillingData({ ...billingData, city: value })
                            // Clear error when user starts typing
                            if (errors.city && value.trim()) {
                              setErrors({ ...errors, city: '' })
                            }
                          }}
                          onBlur={() => {
                            // Validate on blur
                            if (!billingData.city?.trim()) {
                              setErrors({ ...errors, city: 'City is required' })
                            } else {
                              setErrors({ ...errors, city: '' })
                            }
                          }}
                          placeholder="New York"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.city 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-telgo-red focus:border-transparent'
                          } text-gray-900 bg-white`}
                          style={{
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                          }}
                        />
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                        )}
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          value={billingData.zipCode}
                          onChange={(e) => {
                            const value = e.target.value
                            setBillingData({ ...billingData, zipCode: value })
                            // Clear error when user starts typing
                            if (errors.zipCode && value.trim()) {
                              setErrors({ ...errors, zipCode: '' })
                            }
                          }}
                          onBlur={() => {
                            // Validate on blur
                            if (!billingData.zipCode?.trim()) {
                              setErrors({ ...errors, zipCode: 'ZIP code is required' })
                            } else {
                              setErrors({ ...errors, zipCode: '' })
                            }
                          }}
                          placeholder="10001"
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            errors.zipCode 
                              ? 'border-red-500 focus:ring-red-500' 
                              : 'border-gray-300 focus:ring-telgo-red focus:border-transparent'
                          } text-gray-900 bg-white`}
                          style={{
                            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                          }}
                        />
                        {errors.zipCode && (
                          <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit Button - Only for non-Stripe payment methods */}
                {paymentMethod !== 'stripe' && (
                  <>
                    <button
                      type="submit"
                      disabled={isProcessing || showSuccess}
                      className="w-full py-4 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg mt-6"
                      style={{
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                      }}
                    >
                      {isProcessing 
                        ? 'Processing...' 
                        : showSuccess
                        ? 'Success!'
                        : `Complete Purchase - ${getCurrencySymbol(plan.currency)}${total.toFixed(2)}`
                      }
                    </button>
                    
                    {errors.submit && (
                      <p className="text-sm text-red-600 text-center mt-2">{errors.submit}</p>
                    )}
                  </>
                )}

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>
                    Your payment is secure and encrypted
                    {paymentMethod === 'stripe' && ' by Stripe'}
                  </span>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg p-6 sticky top-24"
              style={{
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
              }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start pb-4 border-b">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 mb-1">{plan.name}</div>
                    <div className="text-sm text-gray-600 mb-2">{plan.description}</div>
                    {plan.regions && plan.regions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {plan.regions.map((region, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {region}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="text-sm text-gray-600">{plan.data} • {plan.validity}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{getCurrencySymbol(plan.currency)}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{getCurrencySymbol(plan.currency)}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Processing Fee</span>
                  <span>{getCurrencySymbol(plan.currency)}{processingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t-2">
                  <span>Total</span>
                  <span className="text-telgo-red">{getCurrencySymbol(plan.currency)}{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Instant eSIM activation upon payment</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">24/7 customer support included</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">30-day money-back guarantee</span>
                </div>
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">Secure payment processing</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
