import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from '@/shared/components/Layout/Layout'

// Marketing module
import Home from '@/modules/marketing/pages/Home'
import About from '@/modules/marketing/pages/About'
import DownloadApp from '@/modules/marketing/pages/DownloadApp'

// Auth module
import Login from '@/modules/auth/pages/Login'
import SignUp from '@/modules/auth/pages/SignUp'

// Countries module
import RegionCountries from '@/modules/countries/pages/RegionCountries'
import CountryPackages from '@/modules/countries/pages/CountryPackages'

// Plans module
import ShopPlans from '@/modules/plans/pages/ShopPlans'
import GlobalESIMPlans from '@/modules/plans/pages/GlobalESIMPlans'

// Checkout module
import Checkout from '@/modules/checkout/pages/Checkout'

// Dashboard module
import MyeSIM from '@/modules/dashboard/pages/MyeSIM'

// Support module
import HelpCentre from '@/modules/support/pages/HelpCentre'
import Contact from '@/modules/support/pages/Contact'

// Blog module
import Blog from '@/modules/blog/pages/Blog'
import BlogPostDetail from '@/modules/blog/pages/BlogPostDetail'
import AdminBlogManagement from '@/modules/blog/pages/AdminBlogManagement'

// FAQ module
import Faq from '@/modules/faq/pages/Faq'
import AdminFaqManagement from '@/modules/faq/pages/AdminFaqManagement'

// Admin module
import AdminLayout from '@/modules/admin/components/AdminLayout'
import AdminDashboard from '@/modules/admin/pages/AdminDashboard'
import ApiKeyManagement from '@/modules/admin/pages/ApiKeyManagement'
import UserManagement from '@/modules/admin/pages/UserManagement'
import OrderManagement from '@/modules/admin/pages/OrderManagement'
import EsimManagement from '@/modules/admin/pages/EsimManagement'
import PlanManagement from '@/modules/admin/pages/PlanManagement'

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes - Separate layout (no frontend navbar/footer) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="esims" element={<EsimManagement />} />
          <Route path="plans" element={<PlanManagement />} />
          <Route path="blog" element={<AdminBlogManagement />} />
          <Route path="faq" element={<AdminFaqManagement />} />
          <Route path="api-keys" element={<ApiKeyManagement />} />
        </Route>

        {/* All other routes with Layout (frontend navbar/footer) */}
        <Route element={<Layout />}>
          {/* Marketing routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/download" element={<DownloadApp />} />
          
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Countries routes */}
          <Route path="/region/:regionName" element={<RegionCountries />} />
          <Route path="/country/:countryName" element={<CountryPackages />} />
          
          {/* Plans routes */}
          <Route path="/shop" element={<ShopPlans />} />
          <Route path="/global-esim" element={<GlobalESIMPlans />} />
          
          {/* Checkout route */}
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Dashboard route */}
          <Route path="/my-esim" element={<MyeSIM />} />
          
          {/* Support routes */}
          <Route path="/help" element={<HelpCentre />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Blog routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostDetail />} />
          
          {/* FAQ routes */}
          <Route path="/faq" element={<Faq />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
