import { Link, useLocation, Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/esims', label: 'eSIMs', icon: '📱' },
    { path: '/admin/plans', label: 'Plans', icon: '📦' },
    { path: '/admin/blog', label: 'Blog Posts', icon: '📝' },
    { path: '/admin/faq', label: 'FAQs', icon: '❓' },
    { path: '/admin/api-keys', label: 'API Keys', icon: '🔑' },
  ]

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

        <div className="p-4 border-t border-gray-800">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition"
          >
            <span>←</span>
            <span>Back to Site</span>
          </Link>
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

