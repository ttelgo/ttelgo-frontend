import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  const location = useLocation()
  const prevPathnameRef = useRef(location.pathname)
  
  // Scroll to top on route change (but preserve hash anchors)
  useEffect(() => {
    // Only scroll to top when pathname changes (not when hash changes)
    // This allows anchor links (like #popular-destinations) to work
    if (prevPathnameRef.current !== location.pathname) {
      // If there's a hash, let the page handle scrolling to it
      // Otherwise, scroll to top
      if (!location.hash) {
        window.scrollTo(0, 0)
      }
      prevPathnameRef.current = location.pathname
    }
  }, [location.pathname, location.hash])
  
  // Hide footer on login and signup pages
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup'
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 50%, #fce7e7 100%)',
        backgroundAttachment: 'fixed'
      }}
    >
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout

