import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allCountries, getTopDestinations, getNewDestinations, searchCountries, Country } from '@/utils/countriesData'

const ShopPlans = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [destinationType, setDestinationType] = useState<'All' | 'Top' | 'New'>('All')
  const [selectedRegion, setSelectedRegion] = useState<string>('All')

  const regions = ['All', 'Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania', 'Middle East']

  // Filter countries based on destination type
  const filteredByType = useMemo(() => {
    if (destinationType === 'Top') return getTopDestinations()
    if (destinationType === 'New') return getNewDestinations()
    return allCountries
  }, [destinationType])

  // Filter by region
  const filteredByRegion = useMemo(() => {
    if (selectedRegion === 'All') return filteredByType
    return filteredByType.filter(country => country.region === selectedRegion)
  }, [filteredByType, selectedRegion])

  // Filter by search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return filteredByRegion
    return searchCountries(searchQuery).filter(country => 
      filteredByRegion.some(c => c.id === country.id)
    )
  }, [filteredByRegion, searchQuery])

  const handleBuyNow = (country: Country, dataSize: '1GB' | '5GB' | '10GB' | 'Unlimited') => {
    // Create plan object from country and selected data size
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
                  placeholder="Search for a destination..."
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

      {/* Filters Section */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Destination Type Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setDestinationType('All')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                destinationType === 'All'
                  ? 'bg-telgo-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All destinations
            </button>
            <button
              onClick={() => setDestinationType('Top')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                destinationType === 'Top'
                  ? 'bg-telgo-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Top destinations
            </button>
            <button
              onClick={() => setDestinationType('New')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
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
                className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                  selectedRegion === region
                    ? 'border-telgo-red text-telgo-red'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
      </section>
    </div>
  )
}

export default ShopPlans
