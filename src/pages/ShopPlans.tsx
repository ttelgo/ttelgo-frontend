import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { regionalPlans } from '@/utils/regionalPlansData'

const ShopPlans = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [esimType, setEsimType] = useState<'local' | 'regional' | 'global'>('global')

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

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-white py-8 md:py-12 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Stay connected in over 200+ destinations worldwide
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find your destination around the world
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for your destination in over 200+ countries and regions"
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white text-lg"
                  style={{
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* eSIM Type Tabs */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex gap-3 mb-6">
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
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          onClick={() => handleRegionClick(region)}
                          className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
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
              {/* Global - 54 and 82 Countries Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Global</h3>
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
                      onClick={() => navigate('/global-esim')}
                      className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Shop Now
                    </button>
                  </div>
                  <button
                    onClick={() => navigate('/global-esim')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    View All →
                  </button>
                </div>
              </motion.div>

              {/* Global-EX - 106 and 112 Countries Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">Global-EX</h3>
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
                      onClick={() => navigate('/global-esim')}
                      className="px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Shop Now
                    </button>
                  </div>
                  <button
                    onClick={() => navigate('/global-esim')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                  >
                    View All →
                  </button>
                </div>
              </motion.div>
            </div>
          )}

          {/* Local eSIM View - Placeholder */}
          {esimType === 'local' && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Local eSIM plans coming soon!</p>
              <p className="text-gray-400">Check out our Regional and Global eSIM plans for now.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ShopPlans
