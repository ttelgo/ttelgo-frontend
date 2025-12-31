import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allCountries, Country } from '@/modules/countries/utils/countriesData'
import { regionalPlans } from '@/modules/plans/utils/regionalPlansData'
import { plansService, type Bundle } from '@/modules/plans/services/plans.service'
import { getCountryIso } from '@/modules/countries/utils/countryIsoMap'

const CountryPackages = () => {
  const navigate = useNavigate()
  const { countryName } = useParams<{ countryName: string }>()
  const [selectedDataSize, setSelectedDataSize] = useState<'1GB' | '5GB' | '10GB' | 'Unlimited'>('5GB')
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actualRegion, setActualRegion] = useState<string | null>(null) // Store region from API

  // Decode country name from URL
  const decodedCountryName = countryName ? decodeURIComponent(countryName) : ''

  // Find country data - try multiple sources (memoized to prevent infinite loops)
  const country = useMemo(() => {
    if (!decodedCountryName) return null
    
    // First, try to find in allCountries
    const foundInAllCountries = allCountries.find(
      c => c.name.toLowerCase() === decodedCountryName.toLowerCase()
    )
    if (foundInAllCountries) return foundInAllCountries

    // Second, try to find in regional plans
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

    // Third, if not found, create a country object from the URL name
    // This allows countries from API to work even if not in allCountries
    // We'll fetch bundles and get the ISO from the API response
    return {
      id: decodedCountryName.toLowerCase().replace(/\s+/g, '-'),
      name: decodedCountryName,
      flag: '🌍', // Default flag
      region: 'Unknown' as Country['region'],
      status: 'Open Now' as const,
      prices: {
        '1GB': 3.99,
        '5GB': 12.99,
        '10GB': 22.99,
        'Unlimited': 44.99,
      },
    } as Country
  }, [decodedCountryName])
  
  // Track if we've already fetched to prevent infinite loops
  const hasFetchedRef = useRef(false)
  const lastCountryNameRef = useRef<string>('')

  // Reset fetch flag and region when country name changes
  useEffect(() => {
    if (lastCountryNameRef.current !== decodedCountryName) {
      hasFetchedRef.current = false
      lastCountryNameRef.current = decodedCountryName
      setActualRegion(null) // Reset region when country changes
    }
  }, [decodedCountryName])

  // Fetch bundles from API (NO HARDCODED BUNDLE DATA)
  // This ensures all bundle information (prices, data amounts, validity) comes from the eSIMGo API
  useEffect(() => {
    const fetchBundles = async () => {
      if (!country || !decodedCountryName) return
      
      // Prevent infinite loop - only fetch if country name changed
      if (hasFetchedRef.current && lastCountryNameRef.current === decodedCountryName) {
        console.log('Skipping fetch - already fetched for this country')
        return
      }
      
      // Mark as fetched and update ref
      hasFetchedRef.current = true
      lastCountryNameRef.current = decodedCountryName
      
      try {
        setLoading(true)
        setError(null)
        
        console.log('Fetching bundles for country from API:', country.name)
        
        // Strategy 1: Try to get ISO code from hardcoded map (fallback only)
        // Note: We prefer getting ISO from API bundles if available
        let countryIso = getCountryIso(country.name)
        
        // Strategy 2: If no ISO in map, try to get it from API bundles
        if (!countryIso) {
          console.log('No ISO in map, fetching all bundles to find ISO...')
          const allBundles = await plansService.getBundles()
          
          // Find a bundle with matching country name to get the ISO and region
          const matchingBundle = allBundles.find(b => 
            b.countryName?.toLowerCase() === country.name.toLowerCase()
          )
          
          if (matchingBundle?.countryIso) {
            countryIso = matchingBundle.countryIso
            console.log('Found ISO from API bundle:', countryIso)
          }
          
          // Extract region from bundle's countryObjects
          if (matchingBundle?.countryObjects && matchingBundle.countryObjects.length > 0) {
            const regionFromBundle = matchingBundle.countryObjects[0].region
            if (regionFromBundle && regionFromBundle !== 'Unknown') {
              setActualRegion(regionFromBundle)
              console.log('Found region from API bundle:', regionFromBundle)
            }
          }
        }
        
        // Strategy 3: Fetch bundles using ISO if available (PRIMARY METHOD - API CALL)
        if (countryIso) {
          try {
            console.log('Fetching bundles from API using ISO:', countryIso)
            const countryBundles = await plansService.getBundlesByCountry(countryIso)
            console.log('Received bundles from API:', countryBundles.length)
            
            if (countryBundles.length > 0) {
              // Extract region from first bundle if available
              const firstBundle = countryBundles[0]
              if (firstBundle?.countryObjects && firstBundle.countryObjects.length > 0) {
                const regionFromBundle = firstBundle.countryObjects[0].region
                if (regionFromBundle && regionFromBundle !== 'Unknown') {
                  setActualRegion(regionFromBundle)
                  console.log('Found region from bundle:', regionFromBundle)
                }
              }
              
              setBundles(countryBundles)
              setSelectedBundle(null)
              return
            }
          } catch (isoError) {
            console.warn('Failed to fetch by ISO, trying fallback:', isoError)
          }
        }
        
        // Strategy 4: Fallback - filter all bundles by country name (API CALL)
        console.log('Using fallback: fetching all bundles from API and filtering by country name')
        const allBundles = await plansService.getBundles() // API call to get all bundles
        const filteredBundles = allBundles.filter(b => {
          const bundleCountryName = b.countryName?.toLowerCase()
          const bundleCountryIso = b.countryIso?.toLowerCase()
          const searchName = country.name.toLowerCase()
          
          return bundleCountryName === searchName || 
                 bundleCountryIso === searchName ||
                 bundleCountryName?.includes(searchName) ||
                 searchName.includes(bundleCountryName || '')
        })
        
        console.log('Filtered bundles:', filteredBundles.length)
        
        // Extract region from first filtered bundle if available
        if (filteredBundles.length > 0) {
          const firstBundle = filteredBundles[0]
          if (firstBundle?.countryObjects && firstBundle.countryObjects.length > 0) {
            const regionFromBundle = firstBundle.countryObjects[0].region
            if (regionFromBundle && regionFromBundle !== 'Unknown') {
              setActualRegion(regionFromBundle)
              console.log('Found region from filtered bundle:', regionFromBundle)
            }
          }
          
          setBundles(filteredBundles)
          setSelectedBundle(null)
        } else {
          // No bundles found - show error but don't show "Country Not Found"
          setError('No bundles available for this country at the moment.')
          setBundles([])
        }
      } catch (err) {
        console.error('Failed to fetch bundles:', err)
        const errorMessage = err instanceof Error ? err.message : 'Failed to load bundles'
        setError(errorMessage)
        setBundles([])
      } finally {
        setLoading(false)
      }
    }

    fetchBundles()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedCountryName]) // Only depend on decodedCountryName to prevent infinite loops

  // Don't show "Country Not Found" anymore - we create a country object from URL
  // Only show error if bundles failed to load
  if (!country) {
    return (
      <div className="w-full min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Invalid Country</h1>
          <p className="text-gray-600 mb-6">The country name in the URL is invalid.</p>
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

  const handleBuyNow = (bundle?: Bundle) => {
    // If bundle is provided from API, use it; otherwise create from mock data
    const plan = bundle ? {
      id: bundle.id,
      name: bundle.description || bundle.name || `${country.name} - ${bundle.data}`,
      description: bundle.description || `${bundle.data} eSIM plan for ${country.name}`,
      price: bundle.price,
      currency: bundle.currency || 'USD',
      data: bundle.data || selectedDataSize,
      validity: bundle.validity || '30 days',
      regions: bundle.countryName ? [bundle.countryName] : [country.region],
      features: [],
      popular: false,
      bundleId: bundle.id, // Store bundle ID for API calls (bundle.id corresponds to bundle.name from API)
    } : {
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
      <section className="relative py-2 md:py-4 border-b border-gray-200 overflow-hidden">
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
                // Use actual region from API if available, otherwise use country.region
                const regionName = actualRegion || country.region
                // If region is still "Unknown", navigate to shop instead
                if (regionName === 'Unknown') {
                  navigate('/shop?tab=local')
                } else {
                  navigate(`/region/${encodeURIComponent(regionName)}`)
                }
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-telgo-red mb-4 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to {actualRegion || (country.region && (country.region as string) !== 'Unknown' ? country.region : 'Shop')}
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
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-telgo-red"></div>
                    <p className="mt-4 text-gray-600">Loading bundles...</p>
                  </div>
                ) : error ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-yellow-800 text-sm">{error}</p>
                    <p className="text-yellow-700 text-xs mt-2">Showing default plans</p>
                  </div>
                ) : null}

                {!loading && (
                  <div className="space-y-4">
                    {/* Display bundles from API when available, otherwise fall back to mock data */}
                    {bundles.length > 0 ? (
                      bundles.map((bundle) => (
                        <button
                          key={bundle.id}
                          onClick={() => setSelectedBundle(bundle)}
                          className={`w-full flex items-center justify-between p-4 border-2 rounded-lg transition-all ${
                            selectedBundle?.id === bundle.id
                              ? 'border-telgo-red bg-red-50 shadow-md hover:shadow-lg'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              selectedBundle?.id === bundle.id
                                ? 'border-telgo-red bg-telgo-red'
                                : 'border-gray-300'
                            }`}>
                              {selectedBundle?.id === bundle.id && (
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="text-left">
                              <div className="font-semibold text-gray-900 text-lg">{bundle.data}</div>
                              <div className="text-sm text-gray-600">{bundle.validity}</div>
                              {bundle.description && (
                                <div className="text-xs text-gray-500 mt-1 line-clamp-2">{bundle.description}</div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900 text-xl">
                              {bundle.currency || 'USD'} {bundle.price.toFixed(2)}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      // Fallback to mock data plans - only show after loading is complete
                      dataSizes.map((size) => (
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
                      ))
                    )}
                  </div>
                )}

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
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-telgo-red"></div>
                    <p className="mt-4 text-gray-600 text-sm">Loading...</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-3 pb-4 border-b">
                        <div className="text-4xl">{country.flag}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{country.name}</div>
                          <div className="text-sm text-gray-600">
                            {selectedBundle 
                              ? `${selectedBundle.data} • ${selectedBundle.validity}`
                              : bundles.length > 0 
                                ? 'Select a bundle'
                                : `${selectedDataSize} • 30 days`
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>
                          {selectedBundle 
                            ? `${selectedBundle.currency || 'USD'} ${selectedBundle.price.toFixed(2)}`
                            : bundles.length > 0
                              ? '—'
                              : `$${country.prices[selectedDataSize].toFixed(2)}`
                          }
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tax</span>
                        <span>$0.00</span>
                      </div>
                      <div className="flex justify-between font-bold text-xl text-gray-900 pt-3 border-t-2">
                        <span>Total</span>
                        <span className="text-telgo-red">
                          {selectedBundle 
                            ? `${selectedBundle.currency || 'USD'} ${selectedBundle.price.toFixed(2)}`
                            : bundles.length > 0
                              ? '—'
                              : `$${country.prices[selectedDataSize].toFixed(2)}`
                          }
                        </span>
                      </div>
                    </div>

                    {bundles.length > 0 ? (
                      selectedBundle ? (
                        <button
                          onClick={() => handleBuyNow(selectedBundle)}
                          disabled={country.status !== 'Open Now'}
                          className="w-full py-4 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                          style={{
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                          }}
                        >
                          {country.status === 'Open Now' ? 'Proceed to Checkout' : 'Coming Soon'}
                        </button>
                      ) : (
                        <p className="text-sm text-gray-600 text-center py-4">
                          Select a bundle above to proceed
                        </p>
                      )
                    ) : (
                      <button
                        onClick={() => handleBuyNow()}
                        disabled={country.status !== 'Open Now'}
                        className="w-full py-4 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                        style={{
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}
                      >
                        {country.status === 'Open Now' ? 'Proceed to Checkout' : 'Coming Soon'}
                      </button>
                    )}
                  </>
                )}

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

