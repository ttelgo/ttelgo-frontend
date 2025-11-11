import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import DownloadApp from './pages/DownloadApp'
import HelpCentre from './pages/HelpCentre'
import MyeSIM from './pages/MyeSIM'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ShopPlans from './pages/ShopPlans'
import Checkout from './pages/Checkout'

function App() {
  return (
    <Router>
      <Routes>
        {/* Login and SignUp routes without Layout (full screen, no header/footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* All other routes with Layout (with header and footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/download" element={<DownloadApp />} />
          <Route path="/help" element={<HelpCentre />} />
          <Route path="/my-esim" element={<MyeSIM />} />
          <Route path="/shop" element={<ShopPlans />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App

