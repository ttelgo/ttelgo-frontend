import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allCountries as countriesData } from '@/modules/countries/utils/countriesData'
import { plansService } from '@/modules/plans/services/plans.service'

const ShopPlans = () => {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  // Initialize esimType from URL params, default to 'local' if no tab specified
  const initialTab = searchParams.get('tab') as 'local' | 'regional' | 'global' | null
  const [esimType, setEsimType] = useState<'local' | 'regional' | 'global'>(
    initialTab && ['local', 'regional', 'global'].includes(initialTab) ? initialTab : 'local'
  )
  const shopSearchResultsRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const apiCountriesLoadedRef = useRef(false) // Track if countries have been loaded
  const [apiCountries, setApiCountries] = useState<Array<{
    name: string
    countryIso: string
    flag: string
    price: string
    region?: string
  }>>([])
  const [regionalBundles, setRegionalBundles] = useState<typeof plansService.getBundles extends () => Promise<infer T> ? T : never>([])
  const [globalBundles, setGlobalBundles] = useState<typeof plansService.getBundles extends () => Promise<infer T> ? T : never>([])
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [regionalLoading, setRegionalLoading] = useState(true)
  const [globalLoading, setGlobalLoading] = useState(true)

  // Get tab from URL query parameter
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'local' || tab === 'regional' || tab === 'global') {
      // Only update if it's different from current type to avoid unnecessary re-renders
      if (esimType !== tab) {
        console.log('Tab changed from URL:', { from: esimType, to: tab, apiCountriesCount: apiCountries.length })
        setEsimType(tab)
        // Clear search query when tab changes from URL
        setSearchQuery('')
      }
    } else if (!tab) {
      // If no tab in URL, default to local
      if (esimType !== 'local') {
        console.log('No tab in URL, defaulting to local')
        setEsimType('local')
        setSearchParams({ tab: 'local' })
        setSearchQuery('')
      }
    }
  }, [searchParams, esimType, apiCountries.length])

  // Fetch local bundles (single country) from API - ONLY ONCE on mount
  useEffect(() => {
    // Only fetch if we haven't loaded yet (using ref to prevent re-fetching)
    if (apiCountriesLoadedRef.current) {
      console.log('apiCountries already loaded (ref check), skipping fetch. Count:', apiCountries.length)
      return
    }

    const fetchLocalBundles = async () => {
      try {
        setCountriesLoading(true)
        console.log('Fetching local bundles from API...')
        
        // Fetch local bundles from API (single country bundles)
        const localBundles = await plansService.getLocalBundles()
        console.log('Received local bundles:', localBundles.length)
        
        // Group bundles by country and calculate min price per GB
        const countryMap = new Map<string, {
          countryName: string
          countryIso: string
          bundles: typeof localBundles
          minPricePerGB: number
          region?: string
        }>()

        localBundles.forEach(bundle => {
          if (!bundle.countryName || !bundle.countryIso) return

          const existing = countryMap.get(bundle.countryIso)
          
          // Calculate price per GB for this bundle
          const dataMatch = bundle.data?.match(/(\d+(?:\.\d+)?)/)
          if (!dataMatch) return
          
          const dataGB = parseFloat(dataMatch[1])
          if (dataGB === 0 || isNaN(dataGB)) return
          
          const pricePerGB = bundle.price / dataGB

          // Get region from bundle or countriesData
          let region: string | undefined
          const countryData = countriesData.find(c => 
            c.name.toLowerCase() === bundle.countryName?.toLowerCase() ||
            c.id.toLowerCase() === bundle.countryIso?.toLowerCase()
          )
          region = countryData?.region

          if (existing) {
            existing.bundles.push(bundle)
            existing.minPricePerGB = Math.min(existing.minPricePerGB, pricePerGB)
          } else {
            countryMap.set(bundle.countryIso, {
              countryName: bundle.countryName,
              countryIso: bundle.countryIso,
              bundles: [bundle],
              minPricePerGB: pricePerGB,
              region: region,
            })
          }
        })

        // Convert to array and map to country format with flags
        const countriesFromApi = Array.from(countryMap.values()).map(country => {
          const countryData = countriesData.find(c => 
            c.name.toLowerCase() === country.countryName.toLowerCase() ||
            c.id.toLowerCase() === country.countryIso.toLowerCase()
          )

          return {
            name: country.countryName,
            countryIso: country.countryIso,
            flag: countryData?.flag || '🌍',
            price: country.minPricePerGB.toFixed(2),
            region: country.region || countryData?.region,
          }
        })

        // Sort by country name for consistent display
        countriesFromApi.sort((a, b) => a.name.localeCompare(b.name))

        console.log('Setting apiCountries with', countriesFromApi.length, 'countries')
        setApiCountries(countriesFromApi)
        apiCountriesLoadedRef.current = true // Mark as loaded
      } catch (error) {
        console.error('Error fetching local bundles from API:', error)
        // Don't reset to empty array if we already have data
        if (!apiCountriesLoadedRef.current) {
          setApiCountries([])
        }
      } finally {
        setCountriesLoading(false)
      }
    }

    fetchLocalBundles()
  }, []) // Empty deps - only run once on mount // Only fetch once on mount

  // Reuse local bundles for regional grouping (no separate API call needed)
  useEffect(() => {
    // Wait for local bundles to load, then use them for regional grouping
    if (apiCountriesLoadedRef.current && apiCountries.length > 0) {
      console.log('Reusing local bundles for regional grouping')
      // We'll fetch regional bundles only when the regional tab is active
      setRegionalLoading(false)
    }
  }, [apiCountries])

  // Fetch regional and global bundles only when their tabs are accessed
  useEffect(() => {
    if (esimType === 'regional' && regionalBundles.length === 0 && !regionalLoading) {
      const fetchRegionalBundles = async () => {
        try {
          setRegionalLoading(true)
          const bundles = await plansService.getLocalBundles()
          console.log('Fetched bundles for regional grouping:', bundles.length)
          setRegionalBundles(bundles)
        } catch (error) {
          console.error('Error fetching bundles for regional grouping:', error)
          setRegionalBundles([])
        } finally {
          setRegionalLoading(false)
        }
      }
      fetchRegionalBundles()
    }

    if (esimType === 'global' && globalBundles.length === 0 && !globalLoading) {
      const fetchGlobalBundles = async () => {
        try {
          setGlobalLoading(true)
          const bundles = await plansService.getGlobalBundles()
          console.log('Fetched global bundles:', bundles.length)
          setGlobalBundles(bundles)
        } catch (error) {
          console.error('Error fetching global bundles from API:', error)
          setGlobalBundles([])
        } finally {
          setGlobalLoading(false)
        }
      }
      fetchGlobalBundles()
    }
  }, [esimType, regionalBundles.length, globalBundles.length, regionalLoading, globalLoading])

  const handleRegionClick = (regionName: string) => {
    // Navigate to the country selection page for the selected region
    navigate(`/region/${encodeURIComponent(regionName)}`)
  }

  const handleEsimTypeChange = (type: 'local' | 'regional' | 'global') => {
    console.log('handleEsimTypeChange called:', { currentType: esimType, newType: type, apiCountriesCount: apiCountries.length, searchQuery })
    
    // Always clear search query first to ensure full list is shown
    if (searchQuery.trim()) {
      console.log('Clearing search query:', searchQuery)
      setSearchQuery('')
    }
    
    // Only update if switching to a different tab
    if (esimType === type) {
      // If clicking the same tab, just ensure search is cleared and don't update URL
      console.log('Same tab clicked, clearing search only. apiCountries count:', apiCountries.length)
      return
    }
    
    console.log('Switching tab from', esimType, 'to', type)
    setEsimType(type)
    setSearchParams({ tab: type })
  }

  // Local eSIMs - Countries from API
  const localDestinations = useMemo(() => {
    const destinations = apiCountries.map(country => ({
      name: country.name,
      flag: country.flag,
      price: country.price,
      countryIso: country.countryIso,
      region: country.region,
    }))
    console.log('Local destinations computed:', destinations.length, 'from', apiCountries.length, 'API countries')
    return destinations
  }, [apiCountries])

  // All countries for search (from API)
  const allCountriesForSearch = useMemo(() => {
    return apiCountries.map(country => ({
      name: country.name,
      flag: country.flag,
      price: country.price,
      countryIso: country.countryIso,
      region: country.region,
      status: 'Open Now' as const, // All countries from API are available
    }))
  }, [apiCountries])

  // Filter local destinations by search query
  const filteredLocalDestinations = useMemo(() => {
    console.log('filteredLocalDestinations useMemo running:', { 
      localDestinationsCount: localDestinations.length, 
      apiCountriesCount: apiCountries.length,
      searchQuery: searchQuery || '(empty)',
      searchQueryTrimmed: searchQuery?.trim() || '(empty)'
    })
    
    // Always ensure we have the full list if no search query
    if (!searchQuery || !searchQuery.trim()) {
      console.log('No search query, returning all', localDestinations.length, 'local destinations from', apiCountries.length, 'API countries')
      return localDestinations
    }
    const query = searchQuery.toLowerCase().trim()
    const filtered = localDestinations.filter(dest =>
      dest.name.toLowerCase().includes(query) ||
      dest.region?.toLowerCase().includes(query) ||
      dest.countryIso.toLowerCase().includes(query)
    )
    console.log('Filtered local destinations:', filtered.length, 'from', localDestinations.length, 'with query:', query)
    return filtered
  }, [localDestinations, searchQuery, apiCountries.length])

  // Filter countries for shop hero search dropdown (includes all countries)
  const shopSearchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return []
    }
    const query = searchQuery.toLowerCase()
    return allCountriesForSearch
      .filter(dest => 
        dest.name.toLowerCase().includes(query) ||
        dest.region?.toLowerCase().includes(query) ||
        dest.countryIso.toLowerCase().includes(query)
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
      <section className="relative py-2 md:py-4 border-b border-gray-200 overflow-visible bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 pl-0 md:pl-8 lg:pl-16 xl:pl-24"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 text-center md:text-left">
              Stay connected in over 200+ destinations worldwide
            </h1>
            <p className="text-lg text-gray-600 mb-8 text-center md:text-left">
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
                    key={result.countryIso}
                    onClick={() => handleShopCountryClick(result.name)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="text-2xl">{result.flag}</div>
                    <div className="flex-1">
                      <div className="text-gray-900 font-medium">{result.name}</div>
                      {(result.status && result.status !== 'Open Now') || result.price === 'N/A' || result.price === '0.00' ? (
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
              Local
            </button>
            <button
              onClick={() => handleEsimTypeChange('regional')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                esimType === 'regional'
                  ? 'bg-telgo-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Regional
            </button>
            <button
              onClick={() => handleEsimTypeChange('global')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                esimType === 'global'
                  ? 'bg-telgo-red text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Global
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
              {regionalLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-telgo-red"></div>
                  <p className="mt-4 text-gray-600">Loading regions...</p>
                </div>
              ) : regionalBundles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No bundles available to group by region.</p>
                  <p className="text-gray-400 text-sm mt-2">Check console for details.</p>
                </div>
              ) : (() => {
                // Group local bundles by region to create regional views
                // Since eSIMGo API returns single-country bundles, we group them by region
                const regionMap = new Map<string, {
                  region: string
                  bundles: typeof regionalBundles
                  countries: Map<string, { name: string; iso: string; flag: string }>
                  minPricePerGB: number
                }>()

                console.log('Processing bundles for regional grouping:', regionalBundles.length)
                regionalBundles.forEach(bundle => {
                  // Use countryObjects if available, otherwise fall back to countries array
                  const countryObjects = bundle.countryObjects || []
                  if (countryObjects.length === 0 && (!bundle.countries || bundle.countries.length === 0)) return

                  // Get the region from the first country object
                  const firstCountry = countryObjects[0]
                  let region = 'Unknown'
                  if (firstCountry && firstCountry.region) {
                    region = firstCountry.region
                  } else if (bundle.countries && bundle.countries.length > 0) {
                    // Fallback: try to get region from countriesData
                    const firstCountryIso = bundle.countries[0]
                    const firstCountryData = countriesData.find(c => 
                      c.id.toLowerCase() === firstCountryIso.toLowerCase()
                    )
                    region = firstCountryData?.region || 'Unknown'
                  }

                  // Calculate price per GB
                  const dataMatch = bundle.data?.match(/(\d+(?:\.\d+)?)/)
                  if (!dataMatch) return
                  const dataGB = parseFloat(dataMatch[1])
                  if (dataGB === 0 || isNaN(dataGB)) return
                  const pricePerGB = bundle.price / dataGB

                  const existing = regionMap.get(region)
                  
                  if (existing) {
                    existing.bundles.push(bundle)
                    existing.minPricePerGB = Math.min(existing.minPricePerGB, pricePerGB)
                    // Add countries from countryObjects
                    countryObjects.forEach(country => {
                      const countryData = countriesData.find(c => 
                        c.id.toLowerCase() === country.iso.toLowerCase()
                      )
                      existing.countries.set(country.iso, {
                        name: country.name,
                        iso: country.iso,
                        flag: countryData?.flag || '🌍'
                      })
                    })
                  } else {
                    const countriesMap = new Map<string, { name: string; iso: string; flag: string }>()
                    countryObjects.forEach(country => {
                      const countryData = countriesData.find(c => 
                        c.id.toLowerCase() === country.iso.toLowerCase()
                      )
                      countriesMap.set(country.iso, {
                        name: country.name,
                        iso: country.iso,
                        flag: countryData?.flag || '🌍'
                      })
                    })
                    
                    regionMap.set(region, {
                      region: region,
                      bundles: [bundle],
                      countries: countriesMap,
                      minPricePerGB: pricePerGB,
                    })
                  }
                })

                const regions = Array.from(regionMap.values())
                const filteredRegions = searchQuery.trim()
                  ? regions.filter(r => 
                      r.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      Array.from(r.countries.values()).some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    )
                  : regions

                if (filteredRegions.length === 0) {
                  return (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-lg">No regions found. Try a different search.</p>
                    </div>
                  )
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRegions.map((regionData, index) => {
                      const countryCount = regionData.countries.size
                      const sampleCountries = Array.from(regionData.countries.values()).slice(0, 6)

                      return (
                        <motion.div
                          key={regionData.region}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                          transition={{ 
                            default: { duration: 0.3, delay: index * 0.1 },
                            hover: { duration: 0.08, ease: "easeOut" }
                          }}
                          onClick={() => handleRegionClick(regionData.region)}
                          className="bg-white rounded-lg border border-gray-200 cursor-pointer overflow-hidden"
                        >
                          <div className="p-6">
                            <div className="mb-4">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{regionData.region}</h3>
                              <p className="text-sm text-gray-600">
                                {countryCount} {countryCount === 1 ? 'Country' : 'Countries'} Available
                              </p>
                              <p className="text-sm text-telgo-red mt-1">
                                From ${regionData.minPricePerGB.toFixed(2)}/GB
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {sampleCountries.map((country, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded text-sm">
                                  <span className="text-lg">{country.flag}</span>
                                  <span className="text-gray-700">{country.name}</span>
                                  </div>
                              ))}
                              {countryCount > 6 && (
                                <div className="flex items-center text-sm text-gray-500">
                                  +{countryCount - 6} more
                                </div>
                              )}
                            </div>

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
              {globalLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-telgo-red"></div>
                  <p className="mt-4 text-gray-600">Loading global plans...</p>
                      </div>
              ) : globalBundles.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">No global bundles found in API.</p>
                  <p className="text-gray-400 text-sm">
                    Global bundles are identified by: 50+ countries, roaming enabled, or group containing "global".
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Check the eSIMGo API for bundles with these characteristics.
                  </p>
                </div>
              ) : (() => {
                // Group global bundles by plan type (based on data amount ranges or group field)
                const planGroups = new Map<string, {
                  name: string
                  bundles: typeof globalBundles
                  minPricePerGB: number
                  countryCount: number
                  dataRange: { min: number; max: number }
                  durationRange: { min: number; max: number }
                }>()

                globalBundles.forEach(bundle => {
                  // Determine plan group name from bundle name or group field
                  let groupName = 'Global Plan'
                  if (bundle.group && Array.isArray(bundle.group) && bundle.group.length > 0) {
                    groupName = bundle.group[0]
                  } else if (bundle.name) {
                    // Try to extract plan type from name (e.g., "global_core", "global_max")
                    const nameLower = bundle.name.toLowerCase()
                    if (nameLower.includes('core')) groupName = 'Global Core'
                    else if (nameLower.includes('max')) groupName = 'Global Max'
                    else if (nameLower.includes('global')) groupName = 'Global Plan'
                  }

                  const existing = planGroups.get(groupName)
                  
                  // Calculate price per GB
                  const dataMatch = bundle.data?.match(/(\d+(?:\.\d+)?)/)
                  const dataGB = dataMatch ? parseFloat(dataMatch[1]) : 0
                  const pricePerGB = dataGB > 0 ? bundle.price / dataGB : bundle.price
                  
                  // Get country count from countryObjects or countries array
                  const countryCount = bundle.countryObjects?.length || bundle.countries?.length || 0

                  if (existing) {
                    existing.bundles.push(bundle)
                    existing.minPricePerGB = Math.min(existing.minPricePerGB, pricePerGB)
                    existing.countryCount = Math.max(existing.countryCount, countryCount)
                    if (dataGB > 0) {
                      existing.dataRange.min = Math.min(existing.dataRange.min, dataGB)
                      existing.dataRange.max = Math.max(existing.dataRange.max, dataGB)
                    }
                    existing.durationRange.min = Math.min(existing.durationRange.min, bundle.duration)
                    existing.durationRange.max = Math.max(existing.durationRange.max, bundle.duration)
                  } else {
                    planGroups.set(groupName, {
                      name: groupName,
                      bundles: [bundle],
                      minPricePerGB: pricePerGB,
                      countryCount: countryCount,
                      dataRange: { min: dataGB, max: dataGB },
                      durationRange: { min: bundle.duration, max: bundle.duration },
                    })
                  }
                })

                const plans = Array.from(planGroups.values())
                plans.sort((a, b) => a.minPricePerGB - b.minPricePerGB)

                return (
                  <>
                    {plans.map((plan, index) => (
              <motion.div
                        key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                        transition={{ duration: 0.1, delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                              <h3 className="text-2xl font-bold text-gray-900 mb-1">{plan.name}</h3>
                              <p className="text-sm text-gray-600 mb-3">Start from USD {plan.minPricePerGB.toFixed(2)}/GB</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                                {plan.dataRange.min > 0 && (
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                    {plan.dataRange.min === plan.dataRange.max 
                                      ? `${plan.dataRange.min}GB`
                                      : `${plan.dataRange.min}GB - ${plan.dataRange.max}GB`}
                        </span>
                                )}
                        <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium">
                                  {plan.durationRange.min === plan.durationRange.max
                                    ? `${plan.durationRange.min}DAY`
                                    : `${plan.durationRange.min}DAY - ${plan.durationRange.max}DAY`}
                        </span>
                      </div>
                              <p className="text-sm text-gray-600">Available in {plan.countryCount} Countries</p>
                    </div>
                    <button
                              onClick={() => navigate(`/global-esim?type=${plan.name.toLowerCase().replace(/\s+/g, '-')}`)}
                      className="px-6 py-2 bg-telgo-red text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Shop Now
                    </button>
                  </div>
                  <button
                            onClick={() => navigate(`/global-esim?type=${plan.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    className="text-telgo-red text-sm font-medium hover:text-red-700 transition-colors"
                  >
                    View All →
                  </button>
                </div>
              </motion.div>
                    ))}
                  </>
                )
              })()}
            </div>
          )}

          {/* Local eSIM View - All Countries */}
          {esimType === 'local' && (
            <div className="space-y-6">
              {countriesLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-telgo-red"></div>
                  <p className="mt-4 text-gray-600">Loading countries...</p>
                  <p className="mt-2 text-gray-500 text-sm">First load may take up to 60 seconds while fetching all available destinations</p>
                  <p className="mt-1 text-gray-400 text-xs">Subsequent loads will be instant (cached for 1 hour)</p>
                </div>
              ) : (
                <>
                  {/* Results Count */}
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">
                      {filteredLocalDestinations.length} {filteredLocalDestinations.length === 1 ? 'country' : 'countries'} available
                      {searchQuery.trim() && (
                        <span className="text-gray-400 text-xs ml-2">(filtered by: "{searchQuery}")</span>
                      )}
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
                          key={dest.countryIso}
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
                </>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default ShopPlans
