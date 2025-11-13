import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allCountries, Country } from '@/utils/countriesData'
import { regionalPlans } from '@/utils/regionalPlansData'

const CountryPackages = () => {
  const navigate = useNavigate()
  const { countryName } = useParams<{ countryName: string }>()
  const [selectedDataSize, setSelectedDataSize] = useState<'1GB' | '5GB' | '10GB' | 'Unlimited'>('5GB')

  // Decode country name from URL
  const decodedCountryName = countryName ? decodeURIComponent(countryName) : ''

  // Find country data
  const country = allCountries.find(
    c => c.name.toLowerCase() === decodedCountryName.toLowerCase()
  ) || (() => {
    // If not found in allCountries, try to find in regional plans
    for (const plan of regionalPlans) {
      const planCountry = plan.countries.find(
        c => c.name.toLowerCase() === decodedCountryName.toLowerCase()
      )
      if (planCountry) {
        return {
          id: planCountry.name.toLowerCase().replace(/\s+/g, '-'),
          name: planCountry.name,
          flag: planCountry.flag,
          region: 'Europe' as Country['region'],
          status: 'Open Now' as const,
          prices: {
            '1GB': 3.99,
            '5GB': 12.99,
            '10GB': 22.99,
            'Unlimited': 44.99,
          },
        } as Country
      }
    }
    return null
  })()

  if (!country) {
    return (
      <div className="w-full min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Country Not Found</h1>
          <p className="text-gray-600 mb-6">The country you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/shop?tab=regional')}
            className="px-6 py-3 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    )
  }

  const handleBuyNow = () => {
    const plan = {
      id: `${country.id}-${selectedDataSize}`,
      name: `${country.name} - ${selectedDataSize}`,
      description: `${selectedDataSize} eSIM plan for ${country.name}`,
      price: country.prices[selectedDataSize],
      currency: 'USD',
      data: selectedDataSize,
      validity: selectedDataSize === 'Unlimited' ? '30 days' : '30 days',
      regions: [country.region],
      features: [
        `${selectedDataSize} Data`,
        '30 Days Validity',
        `${country.region} Coverage`,
        'High Speed',
        '24/7 Support'
      ],
      popular: 'isTop' in country ? country.isTop : false,
    }
    navigate('/checkout', { state: { plan } })
  }

  const dataSizes: Array<'1GB' | '5GB' | '10GB' | 'Unlimited'> = ['1GB', '5GB', '10GB', 'Unlimited']

  return (
    <div className="w-full min-h-screen">
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
              onClick={() => {
                const regionName = country.region
                navigate(`/region/${encodeURIComponent(regionName)}`)
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-telgo-red mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {country.region}
            </button>
            <div className="flex items-center gap-6 mb-4">
              <div className="text-7xl">{country.flag}</div>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                  {country.name}
                </h1>
                <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  country.status === 'Open Now'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {country.status}
                </div>
              </div>
            </div>
            <p className="text-lg text-gray-600">
              Choose your data plan and stay connected in {country.name}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Package Selection */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-lg p-6 md:p-8"
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Data Plan</h2>
                
                <div className="space-y-4">
                  {dataSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedDataSize(size)}
                      className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                        selectedDataSize === size
                          ? 'border-telgo-red bg-red-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedDataSize === size
                            ? 'border-telgo-red bg-telgo-red'
                            : 'border-gray-300'
                        }`}>
                          {selectedDataSize === size && (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-gray-900 text-lg">{size}</div>
                          <div className="text-sm text-gray-600">30 days validity</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-xl">
                          ${country.prices[size].toFixed(2)}
                        </div>
                        {size !== 'Unlimited' && (
                          <div className="text-sm text-gray-500">
                            ${(country.prices[size] / parseFloat(size)).toFixed(2)}/GB
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Features */}
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">Instant Activation</div>
                        <div className="text-sm text-gray-600">Get connected immediately</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">High-Speed Data</div>
                        <div className="text-sm text-gray-600">4G/5G network coverage</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">24/7 Support</div>
                        <div className="text-sm text-gray-600">Always here to help</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <div className="font-medium text-gray-900">No Contract</div>
                        <div className="text-sm text-gray-600">Cancel anytime</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-lg p-6 sticky top-4"
                style={{
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 pb-4 border-b">
                    <div className="text-4xl">{country.flag}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{country.name}</div>
                      <div className="text-sm text-gray-600">{selectedDataSize} • 30 days</div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${country.prices[selectedDataSize].toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>$0.00</span>
                  </div>
                  <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t-2">
                    <span>Total</span>
                    <span className="text-telgo-red">${country.prices[selectedDataSize].toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleBuyNow}
                  disabled={country.status !== 'Open Now'}
                  className="w-full py-4 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                  style={{
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {country.status === 'Open Now' ? 'Proceed to Checkout' : 'Coming Soon'}
                </button>

                <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm mt-6">
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">Instant eSIM activation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700">30-day money-back guarantee</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CountryPackages

