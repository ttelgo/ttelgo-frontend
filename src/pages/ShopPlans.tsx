import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { regionalPlans } from '@/utils/regionalPlansData'
import { allCountries as countriesData } from '@/utils/countriesData'

const ShopPlans = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [esimType, setEsimType] = useState<'local' | 'regional' | 'global'>('global')
  const shopSearchResultsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  // Get tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'local' || tab === 'regional' || tab === 'global') {
      setEsimType(tab)
    }
  }, [searchParams])

  const handleRegionClick = (regionName: string) => {
    // Navigate to country selection page for this region
    navigate(`/region/${encodeURIComponent(regionName)}`)
  }

  const handleEsimTypeChange = (type: 'local' | 'regional' | 'global') => {
    setEsimType(type)
    setSearchParams({ tab: type })
  }

  // Local eSIMs - All 200+ countries (Open Now only for display)
  const localDestinations = useMemo(() => {
    return countriesData
      .filter(country => country.status === 'Open Now')
      .map(country => ({
        name: country.name,
        flag: country.flag,
        price: country.prices['1GB'].toFixed(2), // Price per GB from 1GB plan
        country: country, // Keep full country object for navigation
      }))
  }, [])

  // All countries for search (including Coming Soon)
  const allCountriesForSearch = useMemo(() => {
    return countriesData.map(country => ({
      name: country.name,
      flag: country.flag,
      price: country.prices?.['1GB']?.toFixed(2) || 'N/A', // Price per GB from 1GB plan, or N/A if no prices
      country: country, // Keep full country object for navigation
      status: country.status,
    }))
  }, [])

  // Filter local destinations by search query
  const filteredLocalDestinations = useMemo(() => {
    if (!searchQuery.trim()) {
      return localDestinations
    }
    const query = searchQuery.toLowerCase()
    return localDestinations.filter(dest =>
      dest.name.toLowerCase().includes(query) ||
      dest.country.region?.toLowerCase().includes(query)
    )
  }, [localDestinations, searchQuery])

  // Filter countries for shop hero search dropdown (includes all countries)
  const shopSearchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }
    const query = searchQuery.toLowerCase()
    return allCountriesForSearch
      .filter(dest => 
        dest.name.toLowerCase().includes(query) ||
        dest.country.region?.toLowerCase().includes(query)
      )
      .slice(0, 10) // Show up to 10 results in dropdown
  }, [searchQuery, allCountriesForSearch])

  // Handle country click from shop search
  const handleShopCountryClick = (countryName: string) => {
    navigate(`/country/${encodeURIComponent(countryName)}`)
    setSearchQuery('') // Clear search after navigation
  }

  // Update dropdown position when search query changes or window scrolls/resizes
  const updateDropdownPosition = useCallback(() => {
    if (searchQuery.trim() && searchInputRef.current) {
      const inputRect = searchInputRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: inputRect.bottom + window.scrollY + 8, // 8px for mt-2
        left: inputRect.left + window.scrollX,
        width: inputRect.width
      })
    }
  }, [searchQuery])

  useEffect(() => {
    updateDropdownPosition()
    
    if (searchQuery.trim()) {
      window.addEventListener('scroll', updateDropdownPosition, true)
      window.addEventListener('resize', updateDropdownPosition)
      
      return () => {
        window.removeEventListener('scroll', updateDropdownPosition, true)
        window.removeEventListener('resize', updateDropdownPosition)
      }
    }
  }, [searchQuery, updateDropdownPosition])

  // Close shop search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const searchContainer = target.closest('.shop-search-container')
      const searchResults = shopSearchResultsRef.current
      
      if (!searchContainer && !(searchResults && searchResults.contains(target)) && searchQuery.trim()) {
        // Don't clear search, just close dropdown - user might want to see filtered results
      }
    }

    if (searchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [searchQuery])

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="relative py-2 md:py-4 border-b border-gray-200 overflow-visible">
        {/* Background Image */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            zIndex: 0,
            backgroundImage: 'url(/IMAGES/HeroStyle.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        />
        {/* Overlay for better text readability */}
        <div 
          className="absolute inset-0 w-full h-full bg-white/50"
          style={{
            zIndex: 1
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 pl-8 lg:pl-16 xl:pl-24"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Stay connected in over 200+ destinations worldwide
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find your destination around the world
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto shop-search-container" style={{ zIndex: 9999 }}>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your destination in over 200+ countries and regions"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white text-lg relative z-0"
                  style={{
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
            </div>
            
            {/* Search Results Dropdown - Rendered via Portal */}
            {searchQuery.trim() && shopSearchResults.length > 0 && typeof window !== 'undefined' && createPortal(
              <div
                ref={shopSearchResultsRef}
                className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto"
                style={{ 
                  zIndex: 10000,
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`
                }}
              >
                {shopSearchResults.map((result) => (
                  <div
                    key={result.country.id}
                    onClick={() => handleShopCountryClick(result.name)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-2xl">{result.flag}</div>
                    <div className="flex-1">
                      <div className="text-gray-900 font-medium">{result.name}</div>
                      {result.status === 'Coming Soon' || result.price === 'N/A' || result.price === '0.00' ? (
                        <div className="text-sm text-orange-600 font-medium">Coming Soon</div>
                      ) : (
                        <div className="text-sm text-gray-500">From ${result.price}/GB</div>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
              </div>,
              document.body
            )}
            
            {/* No Results Message - Rendered via Portal */}
            {searchQuery.trim() && shopSearchResults.length === 0 && typeof window !== 'undefined' && createPortal(
              <div 
                className="fixed bg-white border border-gray-200 rounded-lg shadow-2xl p-4"
                style={{ 
                  zIndex: 10000,
                  top: `${dropdownPosition.top}px`,
                  left: `${dropdownPosition.left}px`,
                  width: `${dropdownPosition.width}px`
                }}
              >
                <p className="text-gray-500 text-center">No countries found. Try a different search.</p>
              </div>,
              document.body
            )}
          </motion.div>
        </div>
      </section>

      {/* eSIM Type Tabs */}
      <section className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 mb-6 justify-center">
            <button
              onClick={() => handleEsimTypeChange('local')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                esimType === 'local'
                  ? 'bg-telgo-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Local eSIM
            </button>
            <button
              onClick={() => handleEsimTypeChange('regional')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                esimType === 'regional'
                  ? 'bg-telgo-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {esimType === 'regional' && (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
              Regional eSIM
            </button>
            <button
              onClick={() => handleEsimTypeChange('global')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                esimType === 'global'
                  ? 'bg-telgo-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Global eSIM
            </button>
          </div>

        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Regional eSIM View */}
          {esimType === 'regional' && (
            <div className="space-y-8">
              {/* Get unique regions from regional plans */}
              {(() => {
                const uniqueRegions = Array.from(new Set(regionalPlans.map(plan => plan.continent)))
                const filteredRegions = searchQuery.trim()
                  ? uniqueRegions.filter(region => 
                      region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      regionalPlans.some(plan => 
                        plan.continent === region && 
                        plan.countries.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                      )
                    )
                  : uniqueRegions

                if (filteredRegions.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No regions found. Try a different search.</p>
                    </div>
                  )
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRegions.map((region, index) => {
                      // Get all countries in this region from regional plans
                      const regionCountries = new Set<string>()
                      regionalPlans
                        .filter(plan => plan.continent === region)
                        .forEach(plan => {
                          plan.countries.forEach(country => regionCountries.add(country.name))
                        })
                      
                      const countryCount = regionCountries.size
                      const sampleCountries = Array.from(regionCountries).slice(0, 6)

                      return (
                        <motion.div
                          key={region}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                          transition={{ 
                            default: { duration: 0.3, delay: index * 0.1 },
                            hover: { duration: 0.08, ease: "easeOut" }
                          }}
                          onClick={() => handleRegionClick(region)}
                          className="bg-white rounded-lg border border-gray-200 cursor-pointer overflow-hidden"
                        >
                          <div className="p-6">
                            {/* Header */}
                            <div className="mb-4">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{region}</h3>
                              <p className="text-sm text-gray-600">
                                {countryCount} {countryCount === 1 ? 'Country' : 'Countries'} Available
                              </p>
                            </div>

                            {/* Sample Country Flags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {sampleCountries.map((countryName, idx) => {
                                // Find the country flag from regional plans
                                const countryInfo = regionalPlans
                                  .find(plan => plan.continent === region)
                                  ?.countries.find(c => c.name === countryName)
                                
                                return countryInfo ? (
                                  <div key={idx} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-sm">
                                    <span className="text-lg">{countryInfo.flag}</span>
                                    <span className="text-gray-700">{countryInfo.name}</span>
                                  </div>
                                ) : null
                              })}
                              {countryCount > 6 && (
                                <div className="flex items-center text-sm text-gray-500">
                                  +{countryCount - 6} more
                                </div>
                              )}
                            </div>

                            {/* View Countries Button */}
                            <button
                              className="w-full py-2.5 bg-telgo-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                            >
                              View Countries →
                            </button>
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                )
              })()}
            </div>
          )}

          {/* Global eSIM View - Plan Cards */}
          {esimType === 'global' && (
            <div className="space-y-6">
              {/* Global Core - 54 and 82 Countries Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                transition={{ duration: 0.1 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Global Core</h3>
                      <p className="text-sm text-gray-600 mb-3">Start from USD 2.17/GB</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                          10GB - 50GB
                        </span>
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                          30DAY - 365DAY
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Available in 54 / 82 Countries</p>
                    </div>
                    <button
                      onClick={() => navigate('/global-esim?type=global')}
                      className="px-6 py-2 bg-telgo-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Shop Now
                    </button>
                  </div>
                  <button
                    onClick={() => navigate('/global-esim?type=global')}
                    className="text-telgo-red text-sm font-medium hover:text-red-700 transition-colors"
                  >
                    View All →
                  </button>
                </div>
              </motion.div>

              {/* Global Max - 106 and 112 Countries Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                transition={{ duration: 0.1 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Global Max</h3>
                      <p className="text-sm text-gray-600 mb-3">Start from USD 7.20/GB</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                          1GB - 5GB
                        </span>
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                          1DAY - 30DAY
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Available in 106 / 112 Countries</p>
                    </div>
                    <button
                      onClick={() => navigate('/global-esim?type=global-ex')}
                      className="px-6 py-2 bg-telgo-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Shop Now
                    </button>
                  </div>
                  <button
                    onClick={() => navigate('/global-esim?type=global-ex')}
                    className="text-telgo-red text-sm font-medium hover:text-red-700 transition-colors"
                  >
                    View All →
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Local eSIM View - All Countries */}
          {esimType === 'local' && (
            <div className="space-y-6">
              {/* Results Count */}
              <div className="mb-4">
                <p className="text-gray-600 text-sm">
                  {filteredLocalDestinations.length} {filteredLocalDestinations.length === 1 ? 'country' : 'countries'} available
                </p>
              </div>

              {/* Countries Grid */}
              {filteredLocalDestinations.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No countries found. Try a different search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredLocalDestinations.map((dest, index) => (
                    <motion.div
                      key={dest.country.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1, y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                      transition={{ 
                        default: { duration: 0.3, delay: Math.min(index * 0.02, 0.5) },
                        hover: { duration: 0.08, ease: "easeOut" }
                      }}
                      onClick={() => navigate(`/country/${encodeURIComponent(dest.name)}`)}
                      className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer"
                    >
                      <div className="text-4xl mb-3">{dest.flag}</div>
                      <div className="text-gray-900 font-semibold mb-2">{dest.name}</div>
                      <div className="text-telgo-red text-sm font-medium">
                        From ${dest.price}/GB
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ShopPlans
