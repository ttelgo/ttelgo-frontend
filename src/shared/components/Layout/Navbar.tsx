import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Logo = () => {
  const [imgError, setImgError] = useState(false)

  if (imgError) {
    return (
      <div className="w-20 h-20 bg-telgo-red rounded-lg flex items-center justify-center">
        <span className="text-white font-bold text-2xl">T</span>
      </div>
    )
  }

  return (
    <img 
      src="/IMAGES/LogoUpdated.png" 
      alt="TTelGo Logo" 
      className="h-12 md:h-14 w-auto object-contain"
      onError={() => setImgError(true)}
    />
  )
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/download', label: 'Download App' },
    { path: '/help', label: 'Help Center' },
    { path: '/my-esim', label: 'My eSIM' },
    { path: '/about', label: 'About Us' },
    { path: '/login', label: 'Log In' },
  ]

  return (
    <nav 
      className="relative z-50 bg-white transition-all duration-300"
      style={{
        boxShadow: 'none',
        borderBottom: 'none',
        backgroundColor: '#ffffff'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-telgo-red border-b-2 border-telgo-red'
                    : 'text-gray-700 hover:text-telgo-red'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side - Shop Plans Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/shop"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-telgo-red rounded-lg hover:bg-red-700 transition-colors"
            >
              <img 
                src="/IMAGES/CART.png" 
                alt="Cart" 
                className="w-4 h-4 object-contain brightness-0 invert"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
              Shop Plans
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-700 hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
            style={{
              boxShadow: 'none',
              borderTop: 'none'
            }}
          >
            <div className="px-4 pt-2 pb-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(link.path)
                      ? 'text-telgo-red bg-red-50'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link
                  to="/shop"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-md text-base font-medium text-white bg-telgo-red hover:bg-red-700"
                >
                  <img 
                    src="/IMAGES/CART.png" 
                    alt="Cart" 
                    className="w-4 h-4 object-contain brightness-0 invert"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  Shop Plans
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar

