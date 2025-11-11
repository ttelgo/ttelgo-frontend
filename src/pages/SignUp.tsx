import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<{
    email?: string
    password?: string
    confirmPassword?: string
  }>({})
  const [touched, setTouched] = useState<{
    email?: boolean
    password?: boolean
    confirmPassword?: boolean
  }>({})
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

  const validatePassword = (password: string): string | undefined => {
    if (!password) {
      return 'Password is required'
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters'
    }
    return undefined
  }

  const validateConfirmPassword = (confirmPassword: string, password: string): string | undefined => {
    if (!confirmPassword) {
      return 'Please confirm your password'
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match'
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
    } else if (name === 'password') {
      error = validatePassword(value)
    } else if (name === 'confirmPassword') {
      error = validateConfirmPassword(value, formData.password)
    }

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: {
      email?: string
      password?: string
      confirmPassword?: string
    } = {}
    newErrors.email = validateEmail(formData.email)
    newErrors.password = validatePassword(formData.password)
    newErrors.confirmPassword = validateConfirmPassword(
      formData.confirmPassword,
      formData.password
    )

    setErrors(newErrors)
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    })

    const hasErrors = Object.values(newErrors).some((error) => error !== undefined)

    if (!hasErrors) {
      // Mock signup - redirect to My eSIM page
      console.log('Sign up successful:', formData)
      navigate('/my-esim')
    }
  }

  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center py-8 md:py-12">
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
        <div className="w-full md:w-3/5 bg-white md:rounded-r-3xl p-6 md:p-8 flex flex-col justify-center">
          {/* Header: Logo and Language Selector */}
          <div className="flex justify-between items-center mb-6">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <img 
                src="/IMAGES/LogoUpdated.png" 
                alt="TTelGo Logo" 
                className="h-8 md:h-10 w-auto object-contain"
              />
            </Link>
            
            {/* Language Selector */}
            <div className="flex items-center gap-2 text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
              <span className="text-sm font-medium">English (UK)</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 12 12" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L1 4H11L6 9Z" fill="#374151"/>
              </svg>
            </div>
          </div>

          {/* Form Container */}
          <div className="max-w-md mx-auto w-full">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Sign Up</h1>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 rounded-lg bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-900 text-sm ${
                    touched.email && errors.email ? 'focus:ring-2 focus:ring-red-500' : 'focus:ring-2 focus:ring-telgo-red'
                  }`}
                  style={{
                    boxShadow: touched.email && errors.email
                      ? '0 6px 8px -1px rgba(239, 68, 68, 0.2), 0 3px 5px -1px rgba(239, 68, 68, 0.15), 0 -3px 5px -1px rgba(239, 68, 68, 0.15)'
                      : '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                    transition: 'box-shadow 0.3s ease'
                  }}
                  onFocus={(e) => {
                    if (!touched.email || !errors.email) {
                      e.currentTarget.style.boxShadow = '0 12px 16px -2px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1), 0 -6px 8px -2px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onBlur={(e) => {
                    if (touched.email && errors.email) {
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(239, 68, 68, 0.2), 0 3px 5px -1px rgba(239, 68, 68, 0.15), 0 -3px 5px -1px rgba(239, 68, 68, 0.15)'
                    } else {
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)'
                    }
                    handleBlur(e)
                  }}
                />
                {touched.email && errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password Input */}
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 pr-12 rounded-lg bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-900 text-sm ${
                    touched.password && errors.password ? 'focus:ring-2 focus:ring-red-500' : 'focus:ring-2 focus:ring-telgo-red'
                  }`}
                  style={{
                    boxShadow: touched.password && errors.password
                      ? '0 6px 8px -1px rgba(239, 68, 68, 0.2), 0 3px 5px -1px rgba(239, 68, 68, 0.15), 0 -3px 5px -1px rgba(239, 68, 68, 0.15)'
                      : '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                    transition: 'box-shadow 0.3s ease'
                  }}
                  onFocus={(e) => {
                    if (!touched.password || !errors.password) {
                      e.currentTarget.style.boxShadow = '0 12px 16px -2px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1), 0 -6px 8px -2px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onBlur={(e) => {
                    if (touched.password && errors.password) {
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(239, 68, 68, 0.2), 0 3px 5px -1px rgba(239, 68, 68, 0.15), 0 -3px 5px -1px rgba(239, 68, 68, 0.15)'
                    } else {
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)'
                    }
                    handleBlur(e)
                  }}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2C7.24 2 5 4.24 5 7V9H4C3.45 9 3 9.45 3 10V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V10C17 9.45 16.55 9 16 9H15V7C15 4.24 12.76 2 10 2ZM10 4C11.66 4 13 5.34 13 7V9H7V7C7 5.34 8.34 4 10 4Z"
                      fill="#6B7280"
                    />
                  </svg>
                </div>
                {touched.password && errors.password && (
                  <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 pr-12 rounded-lg bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-900 text-sm ${
                    touched.confirmPassword && errors.confirmPassword ? 'focus:ring-2 focus:ring-red-500' : 'focus:ring-2 focus:ring-telgo-red'
                  }`}
                  style={{
                    boxShadow: touched.confirmPassword && errors.confirmPassword
                      ? '0 6px 8px -1px rgba(239, 68, 68, 0.2), 0 3px 5px -1px rgba(239, 68, 68, 0.15), 0 -3px 5px -1px rgba(239, 68, 68, 0.15)'
                      : '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                    transition: 'box-shadow 0.3s ease'
                  }}
                  onFocus={(e) => {
                    if (!touched.confirmPassword || !errors.confirmPassword) {
                      e.currentTarget.style.boxShadow = '0 12px 16px -2px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1), 0 -6px 8px -2px rgba(0, 0, 0, 0.1)'
                    }
                  }}
                  onBlur={(e) => {
                    if (touched.confirmPassword && errors.confirmPassword) {
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(239, 68, 68, 0.2), 0 3px 5px -1px rgba(239, 68, 68, 0.15), 0 -3px 5px -1px rgba(239, 68, 68, 0.15)'
                    } else {
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)'
                    }
                    handleBlur(e)
                  }}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10 2C7.24 2 5 4.24 5 7V9H4C3.45 9 3 9.45 3 10V17C3 17.55 3.45 18 4 18H16C16.55 18 17 17.55 17 17V10C17 9.45 16.55 9 16 9H15V7C15 4.24 12.76 2 10 2ZM10 4C11.66 4 13 5.34 13 7V9H7V7C7 5.34 8.34 4 10 4Z"
                      fill="#6B7280"
                    />
                  </svg>
                </div>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                className="w-full bg-telgo-red text-white py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg mt-8 text-sm"
              >
                Sign Up
              </button>

              {/* Login Link */}
              <div className="text-center text-gray-600 mb-6 text-sm">
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
              <div className="flex flex-col sm:flex-row gap-5 justify-center">
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
                  title="Sign up with Facebook"
                >
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 0C4.48 0 0 4.48 0 10C0 14.84 3.44 18.87 8 19.8V13H6V10H8V7.5C8 5.57 9.57 4 11.5 4H14V7H12C11.45 7 11 7.45 11 8V10H14V13H11V19.95C16.05 19.45 20 15.19 20 10C20 4.48 15.52 0 10 0Z" fill="#1877F2"/>
                  </svg>
                </a>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp
