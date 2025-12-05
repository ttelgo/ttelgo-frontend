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
import TermsAndConditions from '@/modules/support/pages/TermsAndConditions'
import PrivacyPolicy from '@/modules/support/pages/PrivacyPolicy'

// Blog module
import Blog from '@/modules/blog/pages/Blog'
import UltimateGuideESIMTravel from '@/modules/blog/pages/UltimateGuideESIMTravel'
import SaveMoneyESIMvsRoaming from '@/modules/blog/pages/SaveMoneyESIMvsRoaming'
import ESIMSetupGuideBeginners from '@/modules/blog/pages/ESIMSetupGuideBeginners'

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes with Layout */}
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
          <Route path="/terms" element={<TermsAndConditions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          {/* Blog routes */}
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/ultimate-guide-esim-travel-2024" element={<UltimateGuideESIMTravel />} />
          <Route path="/blog/save-money-esim-vs-roaming" element={<SaveMoneyESIMvsRoaming />} />
          <Route path="/blog/esim-setup-guide-beginners" element={<ESIMSetupGuideBeginners />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
