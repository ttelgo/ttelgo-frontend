import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '@/modules/auth/services/auth.service'

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirmPassword?: string; submit?: string }>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean; confirmPassword?: boolean }>({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Check if already logged in and has admin token
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user')
    if (token && user) {
      try {
        const userData = JSON.parse(user)
        // Check if user has admin role (this will be verified by backend, but we can check here too)
        if (userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN') {
          // Redirect to admin dashboard
          const from = location.state?.from?.pathname || '/admin/dashboard'
          navigate(from, { replace: true })
        }
      } catch (e) {
        // Invalid user data, continue with login
      }
    }
  }, [navigate, location])

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
      return 'Password must be at least 8 characters long'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    let confirmPasswordError: string | undefined
    
    if (mode === 'register') {
      confirmPasswordError = validateConfirmPassword(formData.confirmPassword, formData.password)
    }
    
    if (emailError || passwordError || confirmPasswordError) {
      setErrors({ 
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError
      })
      setTouched({ 
        email: true, 
        password: true, 
        confirmPassword: mode === 'register' 
      })
      return
    }

    setLoading(true)
    setErrors({})
    
    try {
      let response
      
      if (mode === 'register') {
        // Register with email and password
        response = await authService.adminRegister({
          email: formData.email,
          password: formData.password,
        })
      } else {
        // Login with email and password
        response = await authService.adminLogin({
          email: formData.email,
          password: formData.password,
        })
      }
      
      // Store token and user data
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user))
          
          // Check if user has admin role
          const userRole = (response.user as any).role
          if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
            // User doesn't have admin role
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user')
            setErrors({ 
              submit: 'Access denied. You do not have administrator privileges. Please contact your system administrator.' 
            })
            setLoading(false)
            return
          }
        }
      }
      
      // Redirect to admin dashboard
      const from = location.state?.from?.pathname || '/admin/dashboard'
      navigate(from, { replace: true })
    } catch (error: any) {
      // Extract error message from ApiError or ApiResponse format
      let errorMessage = mode === 'register' ? 'Registration failed. Please try again.' : 'Invalid email or password.'
      
      if (error && typeof error === 'object') {
        // Check for ApiError format (from apiClient)
        if (error.message) {
          errorMessage = error.message
        } 
        // Check for nested error structures
        else if (error.errors) {
          if (typeof error.errors === 'string') {
            errorMessage = error.errors
          } else if (error.errors.message) {
            errorMessage = error.errors.message
          } else if (error.errors.details && error.errors.details.fieldErrors) {
            // Extract first field error
            const fieldErrors = error.errors.details.fieldErrors
            if (Array.isArray(fieldErrors) && fieldErrors.length > 0) {
              const firstError = fieldErrors[0]
              errorMessage = firstError.message || `Validation error: ${firstError.field}`
            }
          }
        }
      }
      
      setErrors({ submit: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">TTelGo Admin</h1>
          <p className="text-blue-100 mt-1">Administrator Portal</p>
        </div>

        {/* Form Container */}
        <div className="p-8">
          {/* Mode Toggle */}
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setMode('login')
                setErrors({})
                setFormData({ email: '', password: '', confirmPassword: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                mode === 'login'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register')
                setErrors({})
                setFormData({ email: '', password: '', confirmPassword: '' })
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                mode === 'register'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === 'login' ? 'Admin Login' : 'Admin Registration'}
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            {mode === 'login' 
              ? 'Enter your email and password to access the admin panel'
              : 'Create a new administrator account with email and password'
            }
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition ${
                  touched.email && errors.email
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                } ${loading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'}
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition ${
                  touched.password && errors.password
                    ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                } ${loading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input (only for registration) */}
            {mode === 'register' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={loading}
                  className={`w-full px-4 py-3 rounded-lg border focus:outline-none transition ${
                    touched.confirmPassword && errors.confirmPassword
                      ? 'border-red-500 focus:ring-2 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  } ${loading ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}`}
                />
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (mode === 'login' ? 'Logging in...' : 'Registering...') : (mode === 'login' ? 'Login' : 'Register')}
            </button>
          </form>

          {/* Info Message */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              <strong>Note:</strong> Only users with administrator privileges can access this portal.
              {mode === 'register' && ' New accounts will need to be granted admin access by a system administrator.'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin

