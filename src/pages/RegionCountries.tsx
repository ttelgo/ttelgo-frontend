import { useState, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { regionalPlans } from '@/utils/regionalPlansData'
import { allCountries, Country } from '@/utils/countriesData'

const RegionCountries = () => {
  const navigate = useNavigate()
  const { regionName } = useParams<{ regionName: string }>()
  const [searchQuery, setSearchQuery] = useState('')

  // Decode region name from URL
  const decodedRegionName = regionName ? decodeURIComponent(regionName) : ''

  // Map region names from regional plans to country data regions
  // Note: 'America' in regional plans includes both North and South America
  const regionMapping: Record<string, string[]> = {
    'Europe': ['Europe'],
    'Asia': ['Asia'],
    'America': ['North America', 'South America'], // America includes both
    'Africa': ['Africa'],
    'Middle East': ['Middle East'],
  }

  // Note: regionCountriesFromPlans is used indirectly through the country matching logic below

  // Get full country data for countries in this region
  const countriesInRegion = useMemo(() => {
    // First, get countries from regional plans
    const countryMap = new Map<string, { name: string; flag: string }>()
    regionalPlans
      .filter(plan => plan.continent === decodedRegionName)
      .forEach(plan => {
        plan.countries.forEach(country => {
          if (!countryMap.has(country.name)) {
            countryMap.set(country.name, country)
          }
        })
      })

    // Match with allCountries data where possible
    const matchedCountries: Array<Country & { flag: string }> = []
    const unmatchedCountries: Array<{ name: string; flag: string }> = []

    countryMap.forEach((planCountry, countryName) => {
      const fullCountry = allCountries.find(
        c => c.name.toLowerCase() === countryName.toLowerCase()
      )
      if (fullCountry) {
        matchedCountries.push({ ...fullCountry, flag: planCountry.flag })
      } else {
        unmatchedCountries.push(planCountry)
      }
    })

    // Add countries from allCountries that match the region but aren't in regional plans
    const mappedRegions = regionMapping[decodedRegionName] || [decodedRegionName]
    allCountries
      .filter(country => mappedRegions.includes(country.region))
      .forEach(country => {
        if (!matchedCountries.some(c => c.id === country.id)) {
          matchedCountries.push(country)
        }
      })
    return [...matchedCountries, ...unmatchedCountries.map(c => ({
      id: c.name.toLowerCase().replace(/\s+/g, '-'),
      name: c.name,
      flag: c.flag,
      region: (mappedRegions[0] || decodedRegionName) as Country['region'],
      status: 'Open Now' as const,
      prices: {
        '1GB': 3.99,
        '5GB': 12.99,
        '10GB': 22.99,
        'Unlimited': 44.99,
      },
    }))]
  }, [decodedRegionName])

  // Filter countries by search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countriesInRegion
    const lowerQuery = searchQuery.toLowerCase()
    return countriesInRegion.filter(country =>
      country.name.toLowerCase().includes(lowerQuery)
    )
  }, [countriesInRegion, searchQuery])

  const handleCountryClick = (country: Country | { name: string; flag: string; id: string }) => {
    navigate(`/country/${encodeURIComponent(country.name)}`)
  }

  return (
    <div className="w-full bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative py-8 md:py-12 border-b border-gray-200 overflow-hidden">
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
            className="mb-8 pl-8 lg:pl-16 xl:pl-24"
          >
            <button
              onClick={() => navigate('/shop?tab=regional')}
              className="flex items-center gap-2 text-gray-600 hover:text-telgo-red mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Regions
            </button>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {decodedRegionName} Countries
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Select a country to view available eSIM packages
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl">
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
                  placeholder={`Search countries in ${decodedRegionName}...`}
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

      {/* Countries Grid */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              {filteredCountries.length} {filteredCountries.length === 1 ? 'country' : 'countries'} found
            </p>
          </div>

          {/* Countries Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCountries.map((country, index) => (
              <motion.div
                key={country.id || country.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() => handleCountryClick(country)}
                className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-all cursor-pointer overflow-hidden"
              >
                <div className="p-6 text-center">
                  {/* Country Flag */}
                  <div className="text-6xl mb-4">{country.flag}</div>
                  
                  {/* Country Name */}
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{country.name}</h3>
                  
                  {/* Status Badge */}
                  {'status' in country && (
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                      country.status === 'Open Now'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {country.status}
                    </div>
                  )}

                  {/* View Packages Button */}
                  <button className="w-full py-2.5 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors mt-4">
                    View Packages →
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* No Results */}
          {filteredCountries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No countries found. Try a different search.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default RegionCountries

