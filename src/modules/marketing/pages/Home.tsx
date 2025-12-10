import { useState, useRef, useMemo, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allCountries as countriesData } from '@/modules/countries/utils/countriesData'
import { plansService } from '@/modules/plans/services/plans.service'
import { faqService } from '@/modules/faq/services/faq.service'
import type { FAQ } from '@/shared/types'

// Generate random price between 0.50 and 2.00
const getRandomPrice = () => {
  return (Math.random() * 1.5 + 0.5).toFixed(2)
}

// Hero Background Component - HeroStyle.png background
const HeroBackground = () => {
  return (
    <>
      {/* Hero Background Image */}
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
    </>
  )
}

const Home = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('local')
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [email, setEmail] = useState('')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [faqsLoading, setFaqsLoading] = useState(true)
  const [heroSearchQuery, setHeroSearchQuery] = useState('')
  const [destinationsSearchQuery, setDestinationsSearchQuery] = useState('')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const regionalScrollRef = useRef<HTMLDivElement>(null)
  const journeyScrollRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const searchResultsRef = useRef<HTMLDivElement>(null)
  const heroSearchInputRef = useRef<HTMLInputElement>(null)
  const destinationsSearchResultsRef = useRef<HTMLDivElement>(null)
  const destinationsSearchInputRef = useRef<HTMLInputElement>(null)

  // Handle scrolling to popular destinations section when navigating from other pages
  useEffect(() => {
    if (location.hash === '#popular-destinations') {
      setTimeout(() => {
        const element = document.getElementById('popular-destinations')
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }, [location.hash])

  // Close search dropdown when clicking outside (hero search)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const searchContainer = target.closest('.hero-search-container')
      const searchResults = searchResultsRef.current
      
      // Don't close if clicking inside search container or results dropdown
      if (!searchContainer && !(searchResults && searchResults.contains(target)) && heroSearchQuery.trim()) {
        setHeroSearchQuery('')
      }
    }

    if (heroSearchQuery.trim()) {
      // Use a small delay to allow click events on dropdown items to fire first
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [heroSearchQuery])

  // Close search dropdown when clicking outside (destinations search)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      const searchContainer = target.closest('.destinations-search-container')
      const searchResults = destinationsSearchResultsRef.current
      
      // Don't close if clicking inside search container or results dropdown
      if (!searchContainer && !(searchResults && searchResults.contains(target)) && destinationsSearchQuery.trim()) {
        setDestinationsSearchQuery('')
      }
    }

    if (destinationsSearchQuery.trim()) {
      // Use a small delay to allow click events on dropdown items to fire first
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
      }, 100)

      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [destinationsSearchQuery])
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [destinations, setDestinations] = useState<Array<{ name: string; price: string; image: string }>>([])
  const [destinationsLoading, setDestinationsLoading] = useState(true)

  // Fetch destinations with countries and prices from API (NO HARDCODED DATA)
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setDestinationsLoading(true)
        
        // Fetch all bundles from API
        const allBundles = await plansService.getBundles()
        
        // Group bundles by country and calculate min price per GB
        const countryMap = new Map<string, {
          countryName: string
          countryIso: string
          bundles: typeof allBundles
          minPricePerGB: number
        }>()

        allBundles.forEach(bundle => {
          if (!bundle.countryName || !bundle.countryIso) return

          const existing = countryMap.get(bundle.countryIso)
          
          // Calculate price per GB for this bundle (from API data only)
          let pricePerGB: number | null = null
          
          // Handle unlimited bundles - skip for price per GB calculation
          if (bundle.unlimited || bundle.dataAmount === -1) {
            // For unlimited bundles, we can't calculate price per GB
            // Skip them for the carousel as we need "per GB" pricing
            return
          }
          
          // For limited data bundles, calculate price per GB from API data
          if (bundle.dataAmount && bundle.dataAmount > 0) {
            // Convert MB to GB
            const dataGB = bundle.dataAmount / 1000
            if (dataGB > 0 && bundle.price) {
              pricePerGB = bundle.price / dataGB
            }
          } else {
            // Fallback: try to parse from bundle.data string if dataAmount not available
            const dataMatch = bundle.data?.match(/(\d+(?:\.\d+)?)/)
            if (dataMatch) {
              const dataGB = parseFloat(dataMatch[1])
              if (dataGB > 0 && bundle.price) {
                pricePerGB = bundle.price / dataGB
              }
            }
          }
          
          // Only process bundles with valid price per GB
          if (!pricePerGB || pricePerGB <= 0) return

          if (existing) {
            existing.bundles.push(bundle)
            existing.minPricePerGB = Math.min(existing.minPricePerGB, pricePerGB)
          } else {
            countryMap.set(bundle.countryIso, {
              countryName: bundle.countryName,
              countryIso: bundle.countryIso,
              bundles: [bundle],
              minPricePerGB: pricePerGB,
            })
          }
        })

        // Convert to array and sort by bundle count (most popular) or price
        const countries = Array.from(countryMap.values())
          .sort((a, b) => {
            // Sort by bundle count (descending), then by price (ascending)
            if (b.bundles.length !== a.bundles.length) {
              return b.bundles.length - a.bundles.length
            }
            return a.minPricePerGB - b.minPricePerGB
          })
          .slice(0, 12) // Take top 12 countries

        // Map to destinations - use ONLY API data (no hardcoded data)
        const destinationsWithPrices = countries.map(country => {
          // Get imageUrl from API bundles (priority: first bundle with imageUrl)
          const bundleWithImage = country.bundles.find(b => b.imageUrl)
          const apiImageUrl = bundleWithImage?.imageUrl
          
          // Use country name directly from API (no city mapping)
          // If no imageUrl from API, use a placeholder or empty string
          return {
            name: country.countryName, // Use country name from API directly
            price: country.minPricePerGB.toFixed(2), // Price from API calculation
            image: apiImageUrl || '', // Only use API imageUrl, no hardcoded fallback
          }
        })

        setDestinations(destinationsWithPrices)
      } catch (error) {
        console.error('Error fetching destinations from API:', error)
        // Fallback: show empty array or minimal fallback
        setDestinations([])
      } finally {
        setDestinationsLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  // Local eSIMs - Fetch from API (same as Shop page)
  const [localDestinationsFromApi, setLocalDestinationsFromApi] = useState<Array<{
    name: string
    flag: string
    price: string
    countryIso: string
    region?: string
  }>>([])
  const [localDestinationsLoading, setLocalDestinationsLoading] = useState(true)

  // Fetch local destinations from API (same source as Shop page)
  useEffect(() => {
    const fetchLocalDestinations = async () => {
      try {
        setLocalDestinationsLoading(true)
        const localBundles = await plansService.getLocalBundles()
        
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

          // Get region from bundle
          const region = bundle.countryObjects?.[0]?.region

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

        setLocalDestinationsFromApi(countriesFromApi)
      } catch (error) {
        console.error('Error fetching local destinations from API:', error)
        // Fallback to hardcoded data if API fails
        const fallback = countriesData
          .filter(country => country.status === 'Open Now')
          .map(country => ({
            name: country.name,
            flag: country.flag,
            price: country.prices['1GB'].toFixed(2),
            countryIso: country.id,
            region: country.region,
          }))
        setLocalDestinationsFromApi(fallback)
      } finally {
        setLocalDestinationsLoading(false)
      }
    }

    fetchLocalDestinations()
  }, [])

  // Fetch FAQs from API
  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        setFaqsLoading(true)
        const data = await faqService.getFaqs()
        setFaqs(data || [])
      } catch (error) {
        console.error('Error fetching FAQs:', error)
        setFaqs([])
      } finally {
        setFaqsLoading(false)
      }
    }

    fetchFaqs()
  }, [])

  // Use API data for local destinations
  const localDestinations = useMemo(() => {
    return localDestinationsFromApi.map(dest => ({
      name: dest.name,
      flag: dest.flag,
      price: dest.price,
      country: countriesData.find(c => c.id === dest.countryIso || c.name === dest.name) || {
        id: dest.countryIso,
        name: dest.name,
        flag: dest.flag,
        region: dest.region,
        status: 'Open Now' as const,
        prices: { '1GB': parseFloat(dest.price) }
      },
    }))
  }, [localDestinationsFromApi])

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

  // Filter countries for hero search (includes all countries)
  const heroSearchResults = useMemo(() => {
    if (!heroSearchQuery.trim()) {
      return []
    }
    const query = heroSearchQuery.toLowerCase()
    return allCountriesForSearch
      .filter(dest => 
        dest.name.toLowerCase().includes(query) ||
        dest.country.region?.toLowerCase().includes(query)
      )
      .slice(0, 10) // Show up to 10 results in dropdown
  }, [heroSearchQuery, allCountriesForSearch])

  // Filter countries for destinations search (includes all countries)
  const destinationsSearchResults = useMemo(() => {
    if (!destinationsSearchQuery.trim()) {
      return []
    }
    const query = destinationsSearchQuery.toLowerCase()
    return allCountriesForSearch
      .filter(dest => 
        dest.name.toLowerCase().includes(query) ||
        dest.country.region?.toLowerCase().includes(query)
      )
      .slice(0, 10) // Show up to 10 results in dropdown
  }, [destinationsSearchQuery, allCountriesForSearch])

  // Handle country click from search
  const handleCountryClick = (countryName: string) => {
    navigate(`/country/${encodeURIComponent(countryName)}`)
    setHeroSearchQuery('') // Clear search after navigation
  }

  // Handle country click from destinations search
  const handleDestinationsCountryClick = (countryName: string) => {
    navigate(`/country/${encodeURIComponent(countryName)}`)
    setDestinationsSearchQuery('') // Clear search after navigation
  }

  // Handle destination card click - navigate to country packages page to select package
  // Note: destination.name is now the country name directly from API (e.g., "Austria", not "Vienna, Austria")
  const handleDestinationClick = (destination: { name: string; price: string }) => {
    // Since we're using country names directly from API, use the name as-is
    // But handle cases where it might still be in "City, Country" format (backward compatibility)
    let countryName = destination.name
    
    // If name contains a comma, extract country name (e.g., "Vienna, Austria" -> "Austria")
    if (countryName.includes(', ')) {
      countryName = countryName.split(', ').pop() || countryName
    }
    
    // Map common abbreviations to full country names
    const countryNameMap: Record<string, string> = {
      'UK': 'United Kingdom',
      'USA': 'United States',
      'UAE': 'United Arab Emirates',
    }
    
    // Replace abbreviation with full name if it exists
    countryName = countryNameMap[countryName] || countryName
    
    console.log('Navigating to country packages for:', countryName)
    
    // Navigate to country packages page - bundles will be fetched from API
    navigate(`/country/${encodeURIComponent(countryName)}`)
  }

  // All 200+ countries for Global eSIMs - Generated once with fixed prices
  const allCountries = useMemo(() => {
    const countries = [
      { name: 'United States', flag: '🇺🇸' },
      { name: 'United Kingdom', flag: '🇬🇧' },
      { name: 'Canada', flag: '🇨🇦' },
      { name: 'Australia', flag: '🇦🇺' },
      { name: 'Germany', flag: '🇩🇪' },
      { name: 'France', flag: '🇫🇷' },
      { name: 'Italy', flag: '🇮🇹' },
      { name: 'Spain', flag: '🇪🇸' },
      { name: 'Japan', flag: '🇯🇵' },
      { name: 'South Korea', flag: '🇰🇷' },
      { name: 'China', flag: '🇨🇳' },
      { name: 'India', flag: '🇮🇳' },
      { name: 'Brazil', flag: '🇧🇷' },
      { name: 'Mexico', flag: '🇲🇽' },
      { name: 'Argentina', flag: '🇦🇷' },
      { name: 'Chile', flag: '🇨🇱' },
      { name: 'Turkey', flag: '🇹🇷' },
      { name: 'Russia', flag: '🇷🇺' },
      { name: 'Netherlands', flag: '🇳🇱' },
      { name: 'Belgium', flag: '🇧🇪' },
      { name: 'Switzerland', flag: '🇨🇭' },
      { name: 'Austria', flag: '🇦🇹' },
      { name: 'Sweden', flag: '🇸🇪' },
      { name: 'Norway', flag: '🇳🇴' },
      { name: 'Denmark', flag: '🇩🇰' },
      { name: 'Finland', flag: '🇫🇮' },
      { name: 'Poland', flag: '🇵🇱' },
      { name: 'Portugal', flag: '🇵🇹' },
      { name: 'Greece', flag: '🇬🇷' },
      { name: 'Ireland', flag: '🇮🇪' },
      { name: 'Singapore', flag: '🇸🇬' },
      { name: 'Malaysia', flag: '🇲🇾' },
      { name: 'Thailand', flag: '🇹🇭' },
      { name: 'Indonesia', flag: '🇮🇩' },
      { name: 'Philippines', flag: '🇵🇭' },
      { name: 'Vietnam', flag: '🇻🇳' },
      { name: 'Taiwan', flag: '🇹🇼' },
      { name: 'Hong Kong', flag: '🇭🇰' },
      { name: 'New Zealand', flag: '🇳🇿' },
      { name: 'South Africa', flag: '🇿🇦' },
      { name: 'Egypt', flag: '🇪🇬' },
      { name: 'Morocco', flag: '🇲🇦' },
      { name: 'Kenya', flag: '🇰🇪' },
      { name: 'Nigeria', flag: '🇳🇬' },
      { name: 'UAE', flag: '🇦🇪' },
      { name: 'Saudi Arabia', flag: '🇸🇦' },
      { name: 'Israel', flag: '🇮🇱' },
      { name: 'Jordan', flag: '🇯🇴' },
      { name: 'Lebanon', flag: '🇱🇧' },
      { name: 'Qatar', flag: '🇶🇦' },
      { name: 'Kuwait', flag: '🇰🇼' },
      { name: 'Bahrain', flag: '🇧🇭' },
      { name: 'Oman', flag: '🇴🇲' },
      { name: 'Iceland', flag: '🇮🇸' },
      { name: 'Luxembourg', flag: '🇱🇺' },
      { name: 'Czech Republic', flag: '🇨🇿' },
      { name: 'Hungary', flag: '🇭🇺' },
      { name: 'Romania', flag: '🇷🇴' },
      { name: 'Bulgaria', flag: '🇧🇬' },
      { name: 'Croatia', flag: '🇭🇷' },
      { name: 'Slovenia', flag: '🇸🇮' },
      { name: 'Slovakia', flag: '🇸🇰' },
      { name: 'Estonia', flag: '🇪🇪' },
      { name: 'Latvia', flag: '🇱🇻' },
      { name: 'Lithuania', flag: '🇱🇹' },
      { name: 'Belarus', flag: '🇧🇾' },
      { name: 'Ukraine', flag: '🇺🇦' },
      { name: 'Serbia', flag: '🇷🇸' },
      { name: 'Montenegro', flag: '🇲🇪' },
      { name: 'Bosnia', flag: '🇧🇦' },
      { name: 'Albania', flag: '🇦🇱' },
      { name: 'North Macedonia', flag: '🇲🇰' },
      { name: 'Moldova', flag: '🇲🇩' },
      { name: 'Georgia', flag: '🇬🇪' },
      { name: 'Armenia', flag: '🇦🇲' },
      { name: 'Azerbaijan', flag: '🇦🇿' },
      { name: 'Kazakhstan', flag: '🇰🇿' },
      { name: 'Uzbekistan', flag: '🇺🇿' },
      { name: 'Kyrgyzstan', flag: '🇰🇬' },
      { name: 'Tajikistan', flag: '🇹🇯' },
      { name: 'Turkmenistan', flag: '🇹🇲' },
      { name: 'Mongolia', flag: '🇲🇳' },
      { name: 'Bangladesh', flag: '🇧🇩' },
      { name: 'Pakistan', flag: '🇵🇰' },
      { name: 'Sri Lanka', flag: '🇱🇰' },
      { name: 'Nepal', flag: '🇳🇵' },
      { name: 'Bhutan', flag: '🇧🇹' },
      { name: 'Myanmar', flag: '🇲🇲' },
      { name: 'Cambodia', flag: '🇰🇭' },
      { name: 'Laos', flag: '🇱🇦' },
      { name: 'Brunei', flag: '🇧🇳' },
      { name: 'East Timor', flag: '🇹🇱' },
      { name: 'Papua New Guinea', flag: '🇵🇬' },
      { name: 'Fiji', flag: '🇫🇯' },
      { name: 'Samoa', flag: '🇼🇸' },
      { name: 'Tonga', flag: '🇹🇴' },
      { name: 'Vanuatu', flag: '🇻🇺' },
      { name: 'Solomon Islands', flag: '🇸🇧' },
      { name: 'Peru', flag: '🇵🇪' },
      { name: 'Colombia', flag: '🇨🇴' },
      { name: 'Venezuela', flag: '🇻🇪' },
      { name: 'Ecuador', flag: '🇪🇨' },
      { name: 'Bolivia', flag: '🇧🇴' },
      { name: 'Paraguay', flag: '🇵🇾' },
      { name: 'Uruguay', flag: '🇺🇾' },
      { name: 'Guyana', flag: '🇬🇾' },
      { name: 'Suriname', flag: '🇸🇷' },
      { name: 'French Guiana', flag: '🇬🇫' },
      { name: 'Costa Rica', flag: '🇨🇷' },
      { name: 'Panama', flag: '🇵🇦' },
      { name: 'Nicaragua', flag: '🇳🇮' },
      { name: 'Honduras', flag: '🇭🇳' },
      { name: 'Guatemala', flag: '🇬🇹' },
      { name: 'Belize', flag: '🇧🇿' },
      { name: 'El Salvador', flag: '🇸🇻' },
      { name: 'Jamaica', flag: '🇯🇲' },
      { name: 'Trinidad and Tobago', flag: '🇹🇹' },
      { name: 'Barbados', flag: '🇧🇧' },
      { name: 'Bahamas', flag: '🇧🇸' },
      { name: 'Dominican Republic', flag: '🇩🇴' },
      { name: 'Haiti', flag: '🇭🇹' },
      { name: 'Cuba', flag: '🇨🇺' },
      { name: 'Puerto Rico', flag: '🇵🇷' },
      { name: 'Algeria', flag: '🇩🇿' },
      { name: 'Tunisia', flag: '🇹🇳' },
      { name: 'Libya', flag: '🇱🇾' },
      { name: 'Sudan', flag: '🇸🇩' },
      { name: 'Ethiopia', flag: '🇪🇹' },
      { name: 'Tanzania', flag: '🇹🇿' },
      { name: 'Uganda', flag: '🇺🇬' },
      { name: 'Ghana', flag: '🇬🇭' },
      { name: 'Senegal', flag: '🇸🇳' },
      { name: 'Ivory Coast', flag: '🇨🇮' },
      { name: 'Cameroon', flag: '🇨🇲' },
      { name: 'Angola', flag: '🇦🇴' },
      { name: 'Mozambique', flag: '🇲🇿' },
      { name: 'Madagascar', flag: '🇲🇬' },
      { name: 'Zambia', flag: '🇿🇲' },
      { name: 'Zimbabwe', flag: '🇿🇼' },
      { name: 'Botswana', flag: '🇧🇼' },
      { name: 'Namibia', flag: '🇳🇦' },
      { name: 'Mauritius', flag: '🇲🇺' },
      { name: 'Seychelles', flag: '🇸🇨' },
      { name: 'Rwanda', flag: '🇷🇼' },
      { name: 'Malawi', flag: '🇲🇼' },
      { name: 'Lesotho', flag: '🇱🇸' },
      { name: 'Eswatini', flag: '🇸🇿' },
      { name: 'Malta', flag: '🇲🇹' },
      { name: 'Cyprus', flag: '🇨🇾' },
      { name: 'Monaco', flag: '🇲🇨' },
      { name: 'Liechtenstein', flag: '🇱🇮' },
      { name: 'San Marino', flag: '🇸🇲' },
      { name: 'Vatican City', flag: '🇻🇦' },
      { name: 'Andorra', flag: '🇦🇩' },
      { name: 'Iraq', flag: '🇮🇶' },
      { name: 'Iran', flag: '🇮🇷' },
      { name: 'Afghanistan', flag: '🇦🇫' },
      { name: 'Yemen', flag: '🇾🇪' },
      { name: 'Syria', flag: '🇸🇾' },
      { name: 'Palestine', flag: '🇵🇸' },
      { name: 'Maldives', flag: '🇲🇻' },
      { name: 'Mauritania', flag: '🇲🇷' },
      { name: 'Niger', flag: '🇳🇪' },
      { name: 'Mali', flag: '🇲🇱' },
      { name: 'Burkina Faso', flag: '🇧🇫' },
      { name: 'Benin', flag: '🇧🇯' },
      { name: 'Togo', flag: '🇹🇬' },
      { name: 'Guinea', flag: '🇬🇳' },
      { name: 'Sierra Leone', flag: '🇸🇱' },
      { name: 'Liberia', flag: '🇱🇷' },
      { name: 'Gambia', flag: '🇬🇲' },
      { name: 'Guinea-Bissau', flag: '🇬🇼' },
      { name: 'Cape Verde', flag: '🇨🇻' },
      { name: 'São Tomé and Príncipe', flag: '🇸🇹' },
      { name: 'Equatorial Guinea', flag: '🇬🇶' },
      { name: 'Gabon', flag: '🇬🇦' },
      { name: 'Republic of Congo', flag: '🇨🇬' },
      { name: 'DR Congo', flag: '🇨🇩' },
      { name: 'Central African Republic', flag: '🇨🇫' },
      { name: 'Chad', flag: '🇹🇩' },
      { name: 'Eritrea', flag: '🇪🇷' },
      { name: 'Djibouti', flag: '🇩🇯' },
      { name: 'Somalia', flag: '🇸🇴' },
      { name: 'Comoros', flag: '🇰🇲' },
      { name: 'Burundi', flag: '🇧🇮' },
      { name: 'South Sudan', flag: '🇸🇸' },
    ]
    return countries.map(country => ({ ...country, price: getRandomPrice() }))
  }, [])

  // Regional eSIMs - Organized by regions - Generated once with fixed prices
  const regionalESIMs = useMemo(() => {
    const regionsData = {
      europe: [
        { name: 'United Kingdom', flag: '🇬🇧' },
        { name: 'Germany', flag: '🇩🇪' },
        { name: 'France', flag: '🇫🇷' },
        { name: 'Italy', flag: '🇮🇹' },
        { name: 'Spain', flag: '🇪🇸' },
        { name: 'Netherlands', flag: '🇳🇱' },
        { name: 'Belgium', flag: '🇧🇪' },
        { name: 'Switzerland', flag: '🇨🇭' },
        { name: 'Austria', flag: '🇦🇹' },
        { name: 'Sweden', flag: '🇸🇪' },
        { name: 'Norway', flag: '🇳🇴' },
        { name: 'Denmark', flag: '🇩🇰' },
        { name: 'Finland', flag: '🇫🇮' },
        { name: 'Poland', flag: '🇵🇱' },
        { name: 'Portugal', flag: '🇵🇹' },
        { name: 'Greece', flag: '🇬🇷' },
        { name: 'Ireland', flag: '🇮🇪' },
        { name: 'Czech Republic', flag: '🇨🇿' },
        { name: 'Hungary', flag: '🇭🇺' },
        { name: 'Romania', flag: '🇷🇴' },
        { name: 'Bulgaria', flag: '🇧🇬' },
        { name: 'Croatia', flag: '🇭🇷' },
        { name: 'Slovenia', flag: '🇸🇮' },
        { name: 'Slovakia', flag: '🇸🇰' },
        { name: 'Estonia', flag: '🇪🇪' },
        { name: 'Latvia', flag: '🇱🇻' },
        { name: 'Lithuania', flag: '🇱🇹' },
        { name: 'Iceland', flag: '🇮🇸' },
        { name: 'Luxembourg', flag: '🇱🇺' },
        { name: 'Malta', flag: '🇲🇹' },
        { name: 'Cyprus', flag: '🇨🇾' },
      ],
      asia: [
        { name: 'Japan', flag: '🇯🇵' },
        { name: 'South Korea', flag: '🇰🇷' },
        { name: 'China', flag: '🇨🇳' },
        { name: 'India', flag: '🇮🇳' },
        { name: 'Singapore', flag: '🇸🇬' },
        { name: 'Malaysia', flag: '🇲🇾' },
        { name: 'Thailand', flag: '🇹🇭' },
        { name: 'Indonesia', flag: '🇮🇩' },
        { name: 'Philippines', flag: '🇵🇭' },
        { name: 'Vietnam', flag: '🇻🇳' },
        { name: 'Taiwan', flag: '🇹🇼' },
        { name: 'Hong Kong', flag: '🇭🇰' },
        { name: 'Bangladesh', flag: '🇧🇩' },
        { name: 'Pakistan', flag: '🇵🇰' },
        { name: 'Sri Lanka', flag: '🇱🇰' },
        { name: 'Nepal', flag: '🇳🇵' },
        { name: 'Bhutan', flag: '🇧🇹' },
        { name: 'Myanmar', flag: '🇲🇲' },
        { name: 'Cambodia', flag: '🇰🇭' },
        { name: 'Laos', flag: '🇱🇦' },
        { name: 'Brunei', flag: '🇧🇳' },
        { name: 'Maldives', flag: '🇲🇻' },
        { name: 'Mongolia', flag: '🇲🇳' },
        { name: 'Kazakhstan', flag: '🇰🇿' },
        { name: 'Uzbekistan', flag: '🇺🇿' },
        { name: 'Kyrgyzstan', flag: '🇰🇬' },
        { name: 'Tajikistan', flag: '🇹🇯' },
        { name: 'Turkmenistan', flag: '🇹🇲' },
        { name: 'Afghanistan', flag: '🇦🇫' },
      ],
      americas: [
        { name: 'United States', flag: '🇺🇸' },
        { name: 'Canada', flag: '🇨🇦' },
        { name: 'Mexico', flag: '🇲🇽' },
        { name: 'Brazil', flag: '🇧🇷' },
        { name: 'Argentina', flag: '🇦🇷' },
        { name: 'Chile', flag: '🇨🇱' },
        { name: 'Peru', flag: '🇵🇪' },
        { name: 'Colombia', flag: '🇨🇴' },
        { name: 'Venezuela', flag: '🇻🇪' },
        { name: 'Ecuador', flag: '🇪🇨' },
        { name: 'Bolivia', flag: '🇧🇴' },
        { name: 'Paraguay', flag: '🇵🇾' },
        { name: 'Uruguay', flag: '🇺🇾' },
        { name: 'Costa Rica', flag: '🇨🇷' },
        { name: 'Panama', flag: '🇵🇦' },
        { name: 'Nicaragua', flag: '🇳🇮' },
        { name: 'Honduras', flag: '🇭🇳' },
        { name: 'Guatemala', flag: '🇬🇹' },
        { name: 'Belize', flag: '🇧🇿' },
        { name: 'El Salvador', flag: '🇸🇻' },
        { name: 'Jamaica', flag: '🇯🇲' },
        { name: 'Trinidad and Tobago', flag: '🇹🇹' },
        { name: 'Barbados', flag: '🇧🇧' },
        { name: 'Bahamas', flag: '🇧🇸' },
        { name: 'Dominican Republic', flag: '🇩🇴' },
        { name: 'Haiti', flag: '🇭🇹' },
        { name: 'Cuba', flag: '🇨🇺' },
        { name: 'Puerto Rico', flag: '🇵🇷' },
      ],
      middleEast: [
        { name: 'UAE', flag: '🇦🇪' },
        { name: 'Saudi Arabia', flag: '🇸🇦' },
        { name: 'Israel', flag: '🇮🇱' },
        { name: 'Jordan', flag: '🇯🇴' },
        { name: 'Lebanon', flag: '🇱🇧' },
        { name: 'Qatar', flag: '🇶🇦' },
        { name: 'Kuwait', flag: '🇰🇼' },
        { name: 'Bahrain', flag: '🇧🇭' },
        { name: 'Oman', flag: '🇴🇲' },
        { name: 'Turkey', flag: '🇹🇷' },
        { name: 'Iraq', flag: '🇮🇶' },
        { name: 'Iran', flag: '🇮🇷' },
        { name: 'Yemen', flag: '🇾🇪' },
        { name: 'Syria', flag: '🇸🇾' },
        { name: 'Palestine', flag: '🇵🇸' },
      ],
      africa: [
        { name: 'South Africa', flag: '🇿🇦' },
        { name: 'Egypt', flag: '🇪🇬' },
        { name: 'Morocco', flag: '🇲🇦' },
        { name: 'Kenya', flag: '🇰🇪' },
        { name: 'Nigeria', flag: '🇳🇬' },
        { name: 'Algeria', flag: '🇩🇿' },
        { name: 'Tunisia', flag: '🇹🇳' },
        { name: 'Libya', flag: '🇱🇾' },
        { name: 'Sudan', flag: '🇸🇩' },
        { name: 'Ethiopia', flag: '🇪🇹' },
        { name: 'Tanzania', flag: '🇹🇿' },
        { name: 'Uganda', flag: '🇺🇬' },
        { name: 'Ghana', flag: '🇬🇭' },
        { name: 'Senegal', flag: '🇸🇳' },
        { name: 'Ivory Coast', flag: '🇨🇮' },
        { name: 'Cameroon', flag: '🇨🇲' },
        { name: 'Angola', flag: '🇦🇴' },
        { name: 'Mozambique', flag: '🇲🇿' },
        { name: 'Madagascar', flag: '🇲🇬' },
        { name: 'Zambia', flag: '🇿🇲' },
        { name: 'Zimbabwe', flag: '🇿🇼' },
        { name: 'Botswana', flag: '🇧🇼' },
        { name: 'Namibia', flag: '🇳🇦' },
        { name: 'Mauritius', flag: '🇲🇺' },
        { name: 'Seychelles', flag: '🇸🇨' },
        { name: 'Rwanda', flag: '🇷🇼' },
        { name: 'Malawi', flag: '🇲🇼' },
      ],
      oceania: [
        { name: 'Australia', flag: '🇦🇺' },
        { name: 'New Zealand', flag: '🇳🇿' },
        { name: 'Papua New Guinea', flag: '🇵🇬' },
        { name: 'Fiji', flag: '🇫🇯' },
        { name: 'Samoa', flag: '🇼🇸' },
        { name: 'Tonga', flag: '🇹🇴' },
        { name: 'Vanuatu', flag: '🇻🇺' },
        { name: 'Solomon Islands', flag: '🇸🇧' },
      ],
    }
    
    // Add prices to all regions
    const regionsWithPrices: Record<string, Array<{ name: string; flag: string; price: string }>> = {}
    Object.keys(regionsData).forEach(region => {
      regionsWithPrices[region] = regionsData[region as keyof typeof regionsData].map(country => ({
        ...country,
        price: getRandomPrice()
      }))
    })
    
    return regionsWithPrices
  }, [])

  const handleScroll = (direction: 'left' | 'right', ref?: React.RefObject<HTMLDivElement>) => {
    const container = ref?.current || scrollContainerRef.current
    if (container) {
      const scrollAmount = 400
      container.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      })
    }
  }

  const testimonials = [
    {
      name: 'Mike taylor',
      location: 'Malaysia',
      quote: 'I bought a 3GB eSIM valid for 30 days, used it for 13 days in London, and the service was excellent. I highly recommend it — activation is simple and it\'s ready to use instantly, no hassle.',
      image: '/IMAGES/4.jpg',
    },
    {
      name: 'Chris Thomas',
      location: 'CEO of Red Button',
      quote: 'TTelGo eSIM has transformed how we handle business travel. The activation process is seamless, and the coverage is exceptional across all our destinations.',
      image: '/IMAGES/4.jpg',
    },
    {
      name: 'Sarah Johnson',
      location: 'Travel Blogger',
      quote: 'As a frequent traveler, TTelGo eSIM has been a game-changer. No more hunting for SIM cards at airports. Just scan, activate, and you\'re connected instantly.',
      image: '/IMAGES/4.jpg',
    },
  ]


  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative py-3 md:py-5 overflow-visible">
        {/* Background Image - Covering entire section */}
        <HeroBackground />
        
        {/* Content Container with proper z-index */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-[600px] lg:max-w-none relative z-20 pl-8 lg:pl-16 xl:pl-24"
            >
              {/* Redeem Banner Button */}
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 8px 16px rgba(204, 0, 0, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden group rounded-2xl"
                  onClick={() => {
                    // Handle redeem action - can navigate to a page or show modal
                    alert('Redeem 1GB - Feature coming soon!')
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #cc0000 0%, #ff3333 100%)',
                    boxShadow: '0 4px 12px rgba(204, 0, 0, 0.25)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <span className="relative z-10 text-white font-bold text-sm uppercase tracking-wide px-6 py-3 rounded-2xl inline-flex items-center gap-2">
                    <svg 
                      className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Redeem 1GB for your next trip
                    <svg 
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                  {/* Animated background shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      ease: 'easeInOut'
                    }}
                  />
                </motion.button>
              </motion.div>
              
              {/* Main Headline */}
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] xl:text-6xl font-bold text-gray-900 mb-6 leading-[1.2]" style={{ textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
                <span>Stay connected</span>
                <br />
                <span>
                  in over{' '}
                  <span className="text-telgo-red underline decoration-2 underline-offset-4">
                    200+ destinations
                  </span>
                </span>
                <br />
                <span>worldwide</span>
              </h1>
              
              {/* Sub-headline */}
              <p className="text-lg text-gray-700 mb-8 max-w-xl font-medium">
                Scalable, secure, API-ready eSIM connectivity for businesses, travel platforms and fintech.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-md hero-search-container" style={{ zIndex: 9999 }}>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  ref={heroSearchInputRef}
                  type="text"
                  value={heroSearchQuery}
                  onChange={(e) => setHeroSearchQuery(e.target.value)}
                  placeholder="Search for your next destination"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white/95 backdrop-blur-sm relative z-0"
                />
                
                {/* Search Results Dropdown - Positioned absolutely relative to search container */}
                {heroSearchQuery.trim() && heroSearchResults.length > 0 && (
                  <div
                    ref={searchResultsRef}
                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
                  >
                    {heroSearchResults.map((result) => (
                      <div
                        key={result.country.id}
                        onClick={() => handleCountryClick(result.name)}
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
                  </div>
                )}
                
                {/* No Results Message - Positioned absolutely relative to search container */}
                {heroSearchQuery.trim() && heroSearchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-50">
                    <p className="text-gray-500 text-center">No countries found. Try a different search.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex relative w-full items-center justify-end pr-0 lg:pr-0 xl:pr-0"
              style={{ zIndex: 15 }}
            >
              <div className="relative w-full flex items-center justify-end translate-x-12 lg:translate-x-20 xl:translate-x-32">
                <img
                  src="/IMAGES/Hero Right.png"
                  alt="Hero Right"
                  className="w-full h-auto object-cover rounded-lg"
                  style={{ 
                    display: 'block',
                    maxHeight: '700px',
                    width: '100%',
                    height: 'auto'
                  }}
                  onLoad={() => {
                    // Image loaded successfully
                  }}
                  onError={() => {
                    console.error('Failed to load Hero Right.png');
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Journey Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Your Journey With TTelGo Travel eSIM
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto text-center">
              200+ destinations. Unlimited possibilities. TTelGo lets you choose the perfect data plan for your journey.
            </p>
            
            {/* Destination Cards - Horizontal Scroll */}
            <div className="relative">
              {destinationsLoading ? (
                <div className="flex gap-6 pb-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden w-[300px] animate-pulse"
                    >
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  ref={journeyScrollRef}
                  className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
                >
                  {destinations.map((dest, index) => (
                  <div
                    key={index}
                    onClick={() => handleDestinationClick(dest)}
                    className="flex-shrink-0 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer w-[300px]"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      {dest.image ? (
                        <img
                          src={dest.image}
                          alt={dest.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                            if (!target.nextElementSibling) {
                              const placeholder = document.createElement('div')
                              placeholder.className = 'w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-sm px-2'
                              placeholder.textContent = dest.name
                              target.parentNode?.appendChild(placeholder)
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500 text-sm px-2 text-center">
                          {dest.name}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="text-telgo-red font-semibold mb-1">
                        Starting from USD {dest.price}/GB
                      </div>
                      <div className="text-gray-900 font-medium">{dest.name}</div>
                    </div>
                  </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => handleScroll('left', journeyScrollRef)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-telgo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => handleScroll('right', journeyScrollRef)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-telgo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Destinations Section */}
      <section id="popular-destinations" className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto text-center">
              Explore our wide range of eSIM options for destinations around the world. Choose from local, regional, or global plans to stay connected wherever your journey takes you.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-8 destinations-search-container" style={{ zIndex: 100 }}>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                ref={destinationsSearchInputRef}
                type="text"
                value={destinationsSearchQuery}
                onChange={(e) => setDestinationsSearchQuery(e.target.value)}
                placeholder="Search for a country or destination..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white shadow-sm"
              />
              
              {/* Search Results Dropdown */}
              {destinationsSearchQuery.trim() && destinationsSearchResults.length > 0 && (
                <div
                  ref={destinationsSearchResultsRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50"
                >
                  {destinationsSearchResults.map((result) => (
                    <div
                      key={result.country.id}
                      onClick={() => handleDestinationsCountryClick(result.name)}
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
                </div>
              )}
              
              {/* No Results Message */}
              {destinationsSearchQuery.trim() && destinationsSearchResults.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl p-4 z-50">
                  <p className="text-gray-500 text-center">No countries found. Try a different search.</p>
                </div>
              )}
            </div>
            
            {/* Tabs */}
            <div className="flex gap-4 mb-8 justify-center">
              <button
                onClick={() => {
                  setActiveTab('local')
                  setSelectedRegion(null)
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'local'
                    ? 'bg-telgo-red text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Local eSIMs
              </button>
              <button
                onClick={() => {
                  navigate('/shop?tab=regional')
                }}
                className="px-6 py-2 rounded-lg font-medium transition-colors bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:bg-telgo-red hover:text-white hover:border-telgo-red"
              >
                Regional eSIMs
              </button>
              <button
                onClick={() => {
                  setActiveTab('global')
                  setSelectedRegion(null)
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'global'
                    ? 'bg-telgo-red text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Global eSIMs
              </button>
            </div>
            
            {/* Local eSIMs */}
            {activeTab === 'local' && (
              <div className="mb-6">
                {localDestinationsLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-telgo-red"></div>
                    <p className="mt-4 text-gray-600">Loading countries...</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-gray-600 text-sm">
                        {localDestinations.length} countries available
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[600px] overflow-y-auto pr-2">
                      {localDestinations.map((dest, index) => (
                    <motion.div
                      key={dest.country.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{ scale: 1.1, y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                      viewport={{ once: true }}
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
                  </>
                )}
              </div>
            )}

            {/* Regional eSIMs */}
            {activeTab === 'regional' && (
              <div className="mb-6">
                {/* Region Selection */}
                {!selectedRegion ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    {Object.keys(regionalESIMs).map((region) => {
                      const regionNames: Record<string, string> = {
                        europe: 'Europe',
                        asia: 'Asia',
                        americas: 'Americas',
                        middleEast: 'Middle East',
                        africa: 'Africa',
                        oceania: 'Oceania',
                      }
                      return (
                        <motion.button
                          key={region}
                          onClick={() => setSelectedRegion(region)}
                          whileHover={{ scale: 1.05, y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                          transition={{ duration: 0.1 }}
                          className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer"
                        >
                          <div className="text-gray-900 font-semibold text-lg">{regionNames[region] || region}</div>
                          <div className="text-gray-600 text-sm mt-2">
                            {regionalESIMs[region as keyof typeof regionalESIMs].length} countries
                          </div>
                        </motion.button>
                      )
                    })}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {selectedRegion === 'europe' ? 'Europe' :
                         selectedRegion === 'asia' ? 'Asia' :
                         selectedRegion === 'americas' ? 'Americas' :
                         selectedRegion === 'middleEast' ? 'Middle East' :
                         selectedRegion === 'africa' ? 'Africa' :
                         selectedRegion === 'oceania' ? 'Oceania' : selectedRegion}
                      </h3>
                      <button
                        onClick={() => setSelectedRegion(null)}
                        className="text-telgo-red hover:underline flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Regions
                      </button>
                    </div>
                    <div className="relative">
                      <div
                        ref={regionalScrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
                      >
                        {regionalESIMs[selectedRegion as keyof typeof regionalESIMs].map((dest, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.1, y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                            transition={{ duration: 0.1 }}
                            className="flex-shrink-0 bg-white rounded-xl shadow-md p-6 text-center cursor-pointer min-w-[200px]"
                          >
                            <div className="text-4xl mb-3">{dest.flag}</div>
                            <div className="text-gray-900 font-semibold mb-2">{dest.name}</div>
                        <div className="text-telgo-red text-sm font-medium">
                          Starting from USD {dest.price}/GB
                        </div>
                      </motion.div>
                    ))}
                  </div>
                      <button
                        onClick={() => handleScroll('left', regionalScrollRef)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
                      >
                        <svg className="w-6 h-6 text-telgo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleScroll('right', regionalScrollRef)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
                      >
                        <svg className="w-6 h-6 text-telgo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Global eSIMs */}
            {activeTab === 'global' && (
              <div className="mb-6">
                <button
                  onClick={() => navigate('/global-esim')}
                  className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg mb-4"
                >
                  View Global eSIM Plans →
                </button>
                <div className="relative">
                  <div
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
                  >
                    {allCountries.map((dest, index) => (
                      <motion.div
                        key={index}
                        onClick={() => navigate('/global-esim')}
                        whileHover={{ scale: 1.1, y: -8, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
                        transition={{ duration: 0.1 }}
                        className="flex-shrink-0 bg-white rounded-xl shadow-md p-6 text-center cursor-pointer min-w-[200px]"
                      >
                        <div className="text-4xl mb-3">{dest.flag}</div>
                        <div className="text-gray-900 font-semibold mb-2 text-sm">{dest.name}</div>
                        <div className="text-telgo-red text-sm font-medium">
                          Starting from USD {dest.price}/GB
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  <button
                    onClick={() => handleScroll('left', scrollContainerRef)}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
                    aria-label="Scroll left"
                  >
                    <svg className="w-6 h-6 text-telgo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleScroll('right', scrollContainerRef)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors z-10"
                    aria-label="Scroll right"
                  >
                    <svg className="w-6 h-6 text-telgo-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Forget About Roaming Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Forget About Roaming. Get A TTelGo eSIM And Enjoy Your Trips
              </h2>
              
              <div className="space-y-6">
                {/* Feature 1 - Highly Trusted */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <img
                      src="/IMAGES/HighlyTrusted.png"
                      alt="Highly Trusted"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Highly trusted by users worldwide
                    </h3>
                    <p className="text-gray-600">
                      Highly rated on TrustPilot, App Store, and Google Play.
                    </p>
                  </div>
                </div>
                
                {/* Feature 2 - 24/7 Support */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <img
                      src="/IMAGES/247.png"
                      alt="24/7 Live Support"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      24/7 Live support
                    </h3>
                    <p className="text-gray-600">
                      The TTelGo eSIM customer support team will be ready to help wherever you need, whenever you are.
                    </p>
                  </div>
                </div>
                
                {/* Feature 3 - Reliable */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center">
                    <img
                      src="/IMAGES/Reliable.png"
                      alt="Reliable and Affordable"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      Reliable and affordable connectivity
                    </h3>
                    <p className="text-gray-600">
                      Stay connected as you travel globally without worrying about expensive roaming fees.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - 3D Mobile Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex relative w-full items-center justify-end pr-8 lg:pr-16 xl:pr-24"
              style={{ zIndex: 15 }}
            >
              <img
                src="/IMAGES/3DMobile.png"
                alt="TTelGo eSIM 3D Mobile"
                className="w-full h-auto object-contain"
                style={{ 
                  maxHeight: '1000px',
                  minHeight: '700px',
                  height: 'auto',
                  width: 'auto',
                  maxWidth: '100%',
                  transform: 'scale(1.2)',
                  transformOrigin: 'right center',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none'
                }}
                loading="eager"
                onError={() => {
                  console.warn('3DMobile image not found at /IMAGES/3DMobile.png')
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              TTelGo eSIM FAQ
            </h2>
            
            {faqsLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-telgo-red"></div>
                <p className="mt-4 text-gray-600">Loading FAQs...</p>
              </div>
            ) : faqs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No FAQs available at the moment.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg overflow-hidden"
                    style={{
                      boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                      transition: 'box-shadow 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 16px -2px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1), 0 -6px 8px -2px rgba(0, 0, 0, 0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)'
                    }}
                  >
                    <button
                      onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                      className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-left font-medium text-gray-900">{faq.question}</span>
                      <svg
                        className={`w-5 h-5 text-telgo-red transform transition-transform ${
                          openFAQ === faq.id ? 'rotate-45' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                    {openFAQ === faq.id && (
                      <div className="px-6 pb-4 text-gray-600 whitespace-pre-line">
                        {faq.answer}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="pt-20 pb-4 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-8 lg:gap-12 items-start">
            {/* Left Section - Label, Heading, and Pagination Dots */}
            <div className="flex flex-col justify-between min-h-[400px] lg:min-h-[450px]">
              {/* Top: Label and Heading */}
              <div>
                <div className="mb-6">
                  <span className="text-xs text-gray-500 uppercase tracking-[0.2em] font-medium">
                    TESTIMONIALS
                  </span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.2]">
                  <span className="block whitespace-nowrap">What People Say</span>
                  <span className="block whitespace-nowrap">About Us.</span>
                </h2>
              </div>
              
              {/* Bottom: Pagination Dots - Horizontal */}
              <div className="flex gap-2.5 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestimonialIndex(index)}
                    className={`rounded-full transition-all duration-300 ${
                      testimonialIndex === index
                        ? 'bg-telgo-red h-2 w-8'
                        : 'bg-gray-200 h-2 w-2'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right Section - Testimonial Cards and Navigation */}
            <div className="relative">
              {/* Testimonial Cards Container */}
              <div className="relative min-h-[380px]">
                {/* Active Testimonial Card */}
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-white rounded-2xl p-8 relative z-10"
                  style={{
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  {/* Profile Picture - Centered at Top, Overlapping Card Border */}
                  <div className="flex justify-center -mt-12 mb-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-xl relative z-20 bg-white">
                      <img
                        src={testimonials[testimonialIndex].image}
                        alt={testimonials[testimonialIndex].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent && !parent.querySelector('span')) {
                            const fallback = document.createElement('span')
                            fallback.className = 'w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-bold'
                            fallback.textContent = testimonials[testimonialIndex].name.charAt(0).toUpperCase()
                            parent.appendChild(fallback)
                          }
                        }}
                      />
                      {!testimonials[testimonialIndex].image && (
                        <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 text-white text-2xl font-bold">
                          {testimonials[testimonialIndex].name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <div className="text-center mb-4 pt-2">
                    <p className="text-gray-700 text-base md:text-lg leading-[1.7] max-w-2xl mx-auto">
                      &quot;{testimonials[testimonialIndex].quote}&quot;
                    </p>
                  </div>
                  
                  {/* Name */}
                  <div className="text-center mb-0.5">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900">
                      {testimonials[testimonialIndex].name}
                    </h3>
                  </div>
                  
                  {/* Location */}
                  <div className="text-center">
                    <p className="text-gray-500 text-sm md:text-base">
                      {testimonials[testimonialIndex].location}
                    </p>
                  </div>
                </motion.div>
                
                {/* Next Testimonial Card - Partially Visible (Stacked Effect) */}
                {testimonialIndex < testimonials.length - 1 && (
                  <div
                    className="bg-white rounded-2xl p-6 absolute top-[70%] left-2 right-2 z-0"
                    style={{
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      transform: 'translateY(-20px) scale(0.94)',
                      opacity: 0.5
                    }}
                  >
                    <div className="flex justify-center -mt-10 mb-3">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md">
                        <img
                          src={testimonials[testimonialIndex + 1].image}
                          alt={testimonials[testimonialIndex + 1].name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement
                            target.style.display = 'none'
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-center pt-2">
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        {testimonials[testimonialIndex + 1].name}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {testimonials[testimonialIndex + 1].location}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Navigation Arrows - Vertical on Far Right */}
              <div className="absolute right-[-90px] top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-5">
                <button
                  onClick={() => {
                    if (testimonialIndex > 0) {
                      setTestimonialIndex(testimonialIndex - 1)
                    }
                  }}
                  disabled={testimonialIndex === 0}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    testimonialIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-telgo-red text-white hover:bg-red-700 cursor-pointer shadow-lg hover:shadow-xl'
                  }`}
                  aria-label="Previous testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (testimonialIndex < testimonials.length - 1) {
                      setTestimonialIndex(testimonialIndex + 1)
                    }
                  }}
                  disabled={testimonialIndex === testimonials.length - 1}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    testimonialIndex === testimonials.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-telgo-red text-white hover:bg-red-700 cursor-pointer shadow-lg hover:shadow-xl'
                  }`}
                  aria-label="Next testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              
              {/* Mobile Navigation Arrows - Below Cards */}
              <div className="flex justify-center gap-4 mt-4 xl:hidden">
                <button
                  onClick={() => {
                    if (testimonialIndex > 0) {
                      setTestimonialIndex(testimonialIndex - 1)
                    }
                  }}
                  disabled={testimonialIndex === 0}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    testimonialIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-telgo-red text-white hover:bg-red-700 cursor-pointer'
                  }`}
                  aria-label="Previous testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (testimonialIndex < testimonials.length - 1) {
                      setTestimonialIndex(testimonialIndex + 1)
                    }
                  }}
                  disabled={testimonialIndex === testimonials.length - 1}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    testimonialIndex === testimonials.length - 1
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-telgo-red text-white hover:bg-red-700 cursor-pointer'
                  }`}
                  aria-label="Next testimonial"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section className="py-16 bg-transparent relative">
        {/* Dots and Plus Pattern Background */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle, #cbd5e1 1px, transparent 1px),
              radial-gradient(circle, #cbd5e1 1px, transparent 1px),
              linear-gradient(45deg, transparent 48%, #cbd5e1 49%, #cbd5e1 51%, transparent 52%)
            `,
            backgroundSize: '30px 30px, 30px 30px, 20px 20px',
            backgroundPosition: '0 0, 15px 15px, 0 0'
          }}
        ></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-8 md:p-12 relative overflow-visible"
            style={{
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Paper Airplane Icon - Positioned in corner */}
            <div className="absolute -top-2 -right-2 w-20 h-20 opacity-50 z-20">
              <img 
                src="/IMAGES/PaperAirplane.png" 
                alt="Paper Airplane" 
                className="w-full h-full object-contain"
                style={{
                  filter: 'hue-rotate(240deg) saturate(1.5) brightness(1.1)'
                }}
              />
            </div>
            
            {/* Content with relative positioning */}
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 max-w-2xl text-center mx-auto">
                Subscribe to get information, latest news and other interesting offers about TTelGo
              </h2>
            
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  alert('Thank you for subscribing!')
                  setEmail('')
                }}
                className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
              >
                <div className="relative flex-1">
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent bg-white text-gray-900"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
