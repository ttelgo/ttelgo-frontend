import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

const AdminLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token')
    const user = localStorage.getItem('user')
    
    if (!token || !user) {
      // Not authenticated, redirect to login
      navigate('/admin/login', { 
        state: { from: location },
        replace: true 
      })
      return
    }

    try {
      const userData = JSON.parse(user)
      // Check if user has admin role
      if (userData.role !== 'ADMIN' && userData.role !== 'SUPER_ADMIN') {
        // Not an admin, redirect to login
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        navigate('/admin/login', { 
          state: { from: location },
          replace: true 
        })
        return
      }
    } catch (e) {
      // Invalid user data, redirect to login
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      navigate('/admin/login', { 
        state: { from: location },
        replace: true 
      })
      return
    }

    setIsChecking(false)
  }, [navigate, location])

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/esims', label: 'eSIMs', icon: '📱' },
    { path: '/admin/plans', label: 'Bundles', icon: '📦' },
    { path: '/admin/blog', label: 'Blog Posts', icon: '📝' },
    { path: '/admin/faq', label: 'FAQs', icon: '❓' },
    { path: '/admin/api-keys', label: 'API Keys', icon: '🔑' },
  ]

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      // Redirect to login
      navigate('/admin/login', { replace: true })
    } catch (error) {
      // Even if logout fails, clear local storage and redirect
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      navigate('/admin/login', { replace: true })
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold">TTelGo Admin</h1>
          <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <span>←</span>
            <span>Back to Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout

