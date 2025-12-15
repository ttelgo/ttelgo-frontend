import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '@/modules/auth/services/auth.service'

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
  })
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [errors, setErrors] = useState<{
    email?: string
    otp?: string
    submit?: string
  }>({})
  const [touched, setTouched] = useState<{
    email?: boolean
    otp?: boolean
  }>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validateEmail = (email: string): string | undefined => {
    if (!email) {
      return 'Email is required'
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    return undefined
  }

  const validateOtp = (otp: string): string | undefined => {
    if (!otp) {
      return 'OTP is required'
    }
    if (otp.length !== 6) {
      return 'OTP must be 6 digits'
    }
    return undefined
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    let error: string | undefined
    if (name === 'email') {
      error = validateEmail(value)
    } else if (name === 'otp') {
      error = validateOtp(value)
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const emailError = validateEmail(formData.email)
    if (emailError) {
      setErrors({ email: emailError })
      setTouched({ email: true })
      return
    }

    setLoading(true)
    setErrors({})
    
    try {
      await authService.requestOTP({ email: formData.email })
      setStep('otp')
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to send OTP. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()

    const otpError = validateOtp(formData.otp)
    if (otpError) {
      setErrors({ otp: otpError })
      setTouched({ otp: true })
      return
    }

    setLoading(true)
    setErrors({})
    
    try {
      const response = await authService.verifyOTP({ email: formData.email, otp: formData.otp })
      
      // Store token
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user))
        }
      }
      
      navigate('/my-esim')
    } catch (error: any) {
      setErrors({ submit: error.message || 'Invalid OTP. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center -mt-48 -mb-52 md:py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl mx-auto bg-white md:rounded-3xl md:shadow-2xl md:overflow-hidden flex flex-col md:flex-row md:max-h-[650px]"
      >
        {/* Left Panel - Red Background with Logo (Desktop Only) */}
        <div className="hidden md:flex md:w-2/5 bg-telgo-red rounded-l-3xl items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center">
            {/* White Logo - Making all colors white including blue elements */}
            <img 
              src="/IMAGES/LogoUpdated.png" 
              alt="TTelGo Logo" 
              className="max-w-[220px] max-h-[220px] w-auto h-auto"
              style={{ 
                filter: 'brightness(0) invert(1) grayscale(100%)',
                opacity: 1
              }}
            />
          </div>
        </div>

        {/* Right Panel - Form Area */}
        <div className="w-full md:w-3/5 bg-white md:rounded-r-3xl p-4 sm:p-6 md:p-8 flex flex-col justify-center -mt-48 -mb-52 md:my-0">
          {/* Header: Logo, Language Selector, and Hamburger Menu */}
          <div className="flex justify-between items-center mb-4 md:mb-6">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/IMAGES/LogoUpdated.png" 
                alt="TTelGo Logo" 
                className="h-7 sm:h-8 md:h-10 w-auto object-contain"
              />
            </Link>
            
            {/* Right side: Language Selector and Hamburger Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Selector */}
              <div className="flex items-center gap-1 sm:gap-2 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                <span className="text-xs sm:text-sm font-medium">English (UK)</span>
                <svg 
                  width="10" 
                  height="10" 
                  viewBox="0 0 12 12" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="sm:w-3 sm:h-3"
                >
                  <path d="M6 9L1 4H11L6 9Z" fill="#374151"/>
                </svg>
              </div>
              
              {/* Hamburger Menu - Mobile Only */}
              <button
                className="md:hidden p-1.5 sm:p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Container */}
          <div className="max-w-md mx-auto w-full">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Sign Up</h1>

            {step === 'email' ? (
              <form onSubmit={handleRequestOtp} className="space-y-4 sm:space-y-5">
                {/* Email Input */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-4 py-3 sm:py-2.5 rounded-lg bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-900 text-base sm:text-sm ${
                      touched.email && errors.email ? 'focus:ring-2 focus:ring-red-500 border border-red-300' : 'focus:ring-2 focus:ring-telgo-red border border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                      boxShadow: touched.email && errors.email
                        ? '0 6px 8px -1px rgba(239, 68, 68, 0.2), 0 3px 5px -1px rgba(239, 68, 68, 0.15), 0 -3px 5px -1px rgba(239, 68, 68, 0.15)'
                        : '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                      transition: 'box-shadow 0.3s ease'
                    }}
                    onBlur={handleBlur}
                  />
                  {touched.email && errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Request OTP Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-telgo-red text-white py-3 sm:py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg mt-6 sm:mt-8 text-base sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 sm:space-y-5">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    OTP sent to <strong>{formData.email}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setStep('email')}
                    className="text-xs text-telgo-red hover:underline mt-1"
                  >
                    Change email
                  </button>
                </div>

                {/* OTP Input */}
                <div>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={handleChange}
                    maxLength={6}
                    disabled={loading}
                    className={`w-full px-4 py-3 sm:py-2.5 rounded-lg bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-900 text-base sm:text-sm text-center tracking-widest border ${
                      touched.otp && errors.otp ? 'focus:ring-2 focus:ring-red-500 border-red-300' : 'focus:ring-2 focus:ring-telgo-red border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    style={{
                      boxShadow: touched.otp && errors.otp
                        ? '0 6px 8px -1px rgba(239, 68, 68, 0.2), 0 3px 5px -1px rgba(239, 68, 68, 0.15), 0 -3px 5px -1px rgba(239, 68, 68, 0.15)'
                        : '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                      transition: 'box-shadow 0.3s ease'
                    }}
                    onBlur={handleBlur}
                  />
                  {touched.otp && errors.otp && (
                    <p className="mt-1 text-xs text-red-500">{errors.otp}</p>
                  )}
                </div>

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-xs text-red-600">{errors.submit}</p>
                  </div>
                )}

                {/* Verify OTP Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-telgo-red text-white py-3 sm:py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg mt-6 sm:mt-8 text-base sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Sign Up'}
                </button>
              </form>
            )}

            {/* Login Link */}
            <div className="text-center text-gray-600 mb-4 sm:mb-6 text-sm">
              Already have an Account?{' '}
              <Link to="/login" className="text-telgo-red font-bold hover:underline">
                Login
              </Link>
            </div>

            {/* Separator */}
            <div className="flex items-center justify-center mb-4">
              <span className="text-gray-500 text-xs">— OR —</span>
            </div>

            {/* Social Login Buttons */}
            <div className="flex flex-row gap-4 sm:gap-5 justify-center">
              {/* Google Signup Button */}
              <a
                href="#"
                className="flex items-center justify-center w-12 h-12 bg-white rounded-lg hover:bg-gray-50 social-button"
                style={{
                  boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                  transition: 'box-shadow 0.3s ease, background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 16px -2px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1), 0 -6px 8px -2px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)'
                }}
                title="Sign up with Google"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.6 10.2273C19.6 9.51819 19.5364 8.83637 19.4182 8.18182H10V12.05H15.3818C15.15 13.3 14.4455 14.3591 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2727 19.6 10.2273Z" fill="#4285F4"/>
                  <path d="M10 20C12.7 20 14.9636 19.1045 16.6182 17.5773L13.3864 15.0682C12.4909 15.6682 11.3455 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z" fill="#34A853"/>
                  <path d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z" fill="#FBBC05"/>
                  <path d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8227 5.47273L16.6909 2.60455C14.9591 0.990909 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z" fill="#EA4335"/>
                </svg>
              </a>

              {/* Facebook Signup Button */}
              <a
                href="#"
                className="flex items-center justify-center w-12 h-12 bg-[#1877F2] rounded-lg hover:bg-[#166FE5] social-button"
                style={{
                  boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                  transition: 'box-shadow 0.3s ease, background-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 12px 16px -2px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1), 0 -6px 8px -2px rgba(0, 0, 0, 0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)'
                }}
                title="Sign up with Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 0C4.48 0 0 4.48 0 10C0 14.84 3.44 18.87 8 19.8V13H6V10H8V7.5C8 5.57 9.57 4 11.5 4H14V7H12C11.45 7 11 7.45 11 8V10H14V13H11V19.95C16.05 19.45 20 15.19 20 10C20 4.48 15.52 0 10 0Z" fill="white"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp
