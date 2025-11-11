import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allCountries, getTopDestinations, getNewDestinations, searchCountries, Country } from '@/utils/countriesData'
import { regionalPlans, getPlansByContinent, RegionalPlan } from '@/utils/regionalPlansData'

const ShopPlans = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [esimType, setEsimType] = useState<'local' | 'regional' | 'global'>('global')
  const [destinationType, setDestinationType] = useState<'All' | 'Top' | 'New'>('All')
  const [selectedRegion, setSelectedRegion] = useState<string>('All')

  // Get tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'local' || tab === 'regional' || tab === 'global') {
      setEsimType(tab)
    }
  }, [searchParams])

  const regions = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East']

  // Filter countries based on destination type (for Global eSIM)
  const filteredByType = useMemo(() => {
    if (destinationType === 'Top') return getTopDestinations()
    if (destinationType === 'New') return getNewDestinations()
    return allCountries
  }, [destinationType])

  // Filter by region (for Global eSIM)
  const filteredByRegion = useMemo(() => {
    if (selectedRegion === 'All') return filteredByType
    return filteredByType.filter(country => country.region === selectedRegion)
  }, [filteredByType, selectedRegion])

  // Filter by search query (for Global eSIM)
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return filteredByRegion
    return searchCountries(searchQuery).filter(country => 
      filteredByRegion.some(c => c.id === country.id)
    )
  }, [filteredByRegion, searchQuery])

  // Filter regional plans by search query
  const filteredRegionalPlans = useMemo(() => {
    if (!searchQuery.trim()) return regionalPlans
    const lowerQuery = searchQuery.toLowerCase()
    return regionalPlans.filter(plan => 
      plan.name.toLowerCase().includes(lowerQuery) ||
      plan.countries.some(country => country.name.toLowerCase().includes(lowerQuery))
    )
  }, [searchQuery])

  // Group regional plans by continent
  const regionalPlansByContinent = useMemo(() => {
    return getPlansByContinent()
  }, [])

  const handleBuyNow = (country: Country, dataSize: '1GB' | '5GB' | '10GB' | 'Unlimited') => {
    const plan = {
      id: `${country.id}-${dataSize}`,
      name: `${country.name} - ${dataSize}`,
      description: `${dataSize} eSIM plan for ${country.name}`,
      price: country.prices[dataSize],
      currency: 'USD',
      data: dataSize,
      validity: dataSize === 'Unlimited' ? '30 days' : '30 days',
      regions: [country.region],
      features: [
        `${dataSize} Data`,
        '30 Days Validity',
        `${country.region} Coverage`,
        'High Speed',
        '24/7 Support'
      ],
      popular: country.isTop || false,
    }
    navigate('/checkout', { state: { plan } })
  }

  const handleRegionalPlanShop = (regionalPlan: RegionalPlan) => {
    // Navigate to a detailed view or checkout with regional plan
    const plan = {
      id: regionalPlan.id,
      name: `${regionalPlan.name} Regional eSIM`,
      description: `Regional eSIM plan covering ${regionalPlan.countryCount} countries`,
      price: regionalPlan.pricePerGB * 5, // Default to 5GB
      currency: regionalPlan.currency,
      data: '5GB',
      validity: '30 days',
      regions: [regionalPlan.continent],
      features: [
        `${regionalPlan.countryCount} Countries`,
        '30 Days Validity',
        `${regionalPlan.continent} Coverage`,
        'High Speed',
        '24/7 Support'
      ],
      popular: false,
    }
    navigate('/checkout', { state: { plan } })
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

          {/* Filters for Global eSIM */}
          {esimType === 'global' && (
            <>
              {/* Destination Type Tabs */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setDestinationType('All')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    destinationType === 'All'
                      ? 'bg-telgo-red text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All destinations
                </button>
                <button
                  onClick={() => setDestinationType('Top')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    destinationType === 'Top'
                      ? 'bg-telgo-red text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Top destinations
                </button>
                <button
                  onClick={() => setDestinationType('New')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    destinationType === 'New'
                      ? 'bg-telgo-red text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  New destinations
                </button>
              </div>

              {/* Region Filters */}
              <div className="flex flex-wrap gap-3">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedRegion(region)}
                    className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                      selectedRegion === region
                        ? 'border-telgo-red text-telgo-red'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Regional eSIM View */}
          {esimType === 'regional' && (
            <div className="space-y-12">
              {Object.entries(regionalPlansByContinent).map(([continent, plans]) => {
                if (plans.length === 0) return null
                
                const filteredPlans = searchQuery.trim()
                  ? plans.filter(plan => 
                      plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      plan.countries.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                  : plans

                if (filteredPlans.length === 0) return null

                return (
                  <div key={continent}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{continent}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPlans.map((plan, index) => (
                        <motion.div
                          key={plan.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                        >
                          <div className="p-6">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                                <p className="text-sm text-gray-600">Start from {plan.currency} {plan.pricePerGB.toFixed(2)}/GB</p>
                              </div>
                              <button
                                onClick={() => handleRegionalPlanShop(plan)}
                                className="px-4 py-2 bg-telgo-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                              >
                                Shop Now
                              </button>
                            </div>

                            {/* Country Count */}
                            <p className="text-sm text-gray-600 mb-4">
                              Available in {plan.countryCount} {plan.countryCount === 1 ? 'Country' : 'Countries'}
                            </p>

                            {/* Country Flags */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              {plan.countries.slice(0, 6).map((country, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-sm">
                                  <span className="text-lg">{country.flag}</span>
                                  <span className="text-gray-700">{country.name}</span>
                                </div>
                              ))}
                              {plan.countries.length > 6 && (
                                <div className="flex items-center text-sm text-gray-500">
                                  +{plan.countries.length - 6} more
                                </div>
                              )}
                            </div>

                            {/* View All Link */}
                            <button
                              onClick={() => handleRegionalPlanShop(plan)}
                              className="text-telgo-red text-sm font-medium hover:text-red-700 transition-colors"
                            >
                              View All →
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )
              })}

              {/* No Results */}
              {filteredRegionalPlans.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No regional plans found. Try a different search.</p>
                </div>
              )}
            </div>
          )}

          {/* Global eSIM View (Existing Country Grid) */}
          {esimType === 'global' && (
            <>
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-gray-600">
                  {filteredCountries.length} {filteredCountries.length === 1 ? 'destination' : 'destinations'} found
                </p>
              </div>

              {/* Countries Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCountries.map((country, index) => (
                  <motion.div
                    key={country.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="p-4">
                      {/* Country Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                          {country.flag}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{country.name}</h3>
                          <div className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                            country.status === 'Open Now'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {country.status}
                          </div>
                        </div>
                      </div>

                      {/* Pricing Options */}
                      {country.status === 'Open Now' ? (
                        <div className="space-y-2 mb-4">
                          <button
                            onClick={() => handleBuyNow(country, '1GB')}
                            className="w-full flex items-center justify-between p-2.5 border border-gray-200 rounded-lg hover:border-telgo-red hover:bg-red-50 transition-colors group"
                          >
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">1GB</span>
                            <span className="font-semibold text-gray-900">${country.prices['1GB'].toFixed(2)}</span>
                          </button>
                          <button
                            onClick={() => handleBuyNow(country, '5GB')}
                            className="w-full flex items-center justify-between p-2.5 border border-gray-200 rounded-lg hover:border-telgo-red hover:bg-red-50 transition-colors group"
                          >
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">5GB</span>
                            <span className="font-semibold text-gray-900">${country.prices['5GB'].toFixed(2)}</span>
                          </button>
                          <button
                            onClick={() => handleBuyNow(country, '10GB')}
                            className="w-full flex items-center justify-between p-2.5 border border-gray-200 rounded-lg hover:border-telgo-red hover:bg-red-50 transition-colors group"
                          >
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">10GB</span>
                            <span className="font-semibold text-gray-900">${country.prices['10GB'].toFixed(2)}</span>
                          </button>
                          <button
                            onClick={() => handleBuyNow(country, 'Unlimited')}
                            className="w-full flex items-center justify-between p-2.5 border border-gray-200 rounded-lg hover:border-telgo-red hover:bg-red-50 transition-colors group"
                          >
                            <span className="text-sm text-gray-700 group-hover:text-gray-900">Unlimited</span>
                            <span className="font-semibold text-gray-900">${country.prices['Unlimited'].toFixed(2)}</span>
                          </button>
                        </div>
                      ) : (
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg text-center">
                          <p className="text-sm text-gray-500">Coming soon</p>
                        </div>
                      )}

                      {/* Buy Button */}
                      {country.status === 'Open Now' && (
                        <button
                          onClick={() => handleBuyNow(country, '5GB')}
                          className="w-full py-2.5 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
                        >
                          Buy
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* No Results */}
              {filteredCountries.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No destinations found. Try a different search or filter.</p>
                </div>
              )}
            </>
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
