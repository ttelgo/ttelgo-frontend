import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  const location = useLocation()
  const prevPathnameRef = useRef(location.pathname)
  
  // Scroll to top on route change
  useEffect(() => {
    // Always scroll to top when pathname changes
    if (prevPathnameRef.current !== location.pathname) {
      // Scroll to top immediately
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      prevPathnameRef.current = location.pathname
    }
    
    // Handle hash anchors after a brief delay to ensure page is rendered
    if (location.hash) {
      const timer = setTimeout(() => {
        const element = document.querySelector(location.hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [location.pathname, location.hash])
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-white"
    >
      <main className="flex-grow">
        <Navbar />
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout

