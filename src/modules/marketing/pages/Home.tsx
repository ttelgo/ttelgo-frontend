import { useState, useMemo, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { allCountries as countriesData } from '@/modules/countries/utils/countriesData'

// Generate random price between 0.50 and 2.00
const getRandomPrice = () => {
  return (Math.random() * 1.5 + 0.5).toFixed(2)
}

// Hero Background Component - Image background
const HeroBackground = () => {
  return (
    <>
      {/* Image background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 0,
          backgroundImage: 'url(/IMAGES/travels.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Overlay for better text readability */}
      <div 
        className="absolute inset-0 w-full h-full bg-black/20"
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
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
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

  // Automatically scroll to the popular destinations section when navigating from other pages using hash
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

  // Journey destinations - Popular travel destinations
  const destinations = [
    { name: 'Rome, Italy', price: '0.98', image: '/IMAGES/Cities/Rome.jpg' },
    { name: 'London, UK', price: '0.90', image: '/IMAGES/Cities/London.jpg' },
    { name: 'Paris, France', price: '0.85', image: '/IMAGES/Cities/Paris.jpg' },
    { name: 'Tokyo, Japan', price: '1.25', image: '/IMAGES/Cities/Korea.jpg' },
    { name: 'New York, USA', price: '1.10', image: '/IMAGES/Cities/NewYork.jpg' },
    { name: 'Barcelona, Spain', price: '0.75', image: '/IMAGES/Cities/Barcelona.jpg' },
    { name: 'Dubai, UAE', price: '0.95', image: '/IMAGES/Cities/Dubai.jpg' },
    { name: 'Singapore', price: '0.78', image: '/IMAGES/Cities/Singapore.jpg' },
    { name: 'Sydney, Australia', price: '1.05', image: '/IMAGES/Cities/Sydney.jpg' },
    { name: 'Bangkok, Thailand', price: '0.65', image: '/IMAGES/Cities/Thailand.jpg' },
    { name: 'Amsterdam, Netherlands', price: '0.88', image: '/IMAGES/Cities/Amsterdam.jpg' },
    { name: 'Istanbul, Turkey', price: '0.72', image: '/IMAGES/Cities/Istabul.jpg' },
  ]

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
  const handleDestinationClick = (destination: { name: string; price: string }) => {
    // Extract country name from destination (e.g., "Rome, Italy" -> "Italy")
    let countryName = destination.name.split(', ').pop() || destination.name
    
    // Map common abbreviations to full country names
    const countryNameMap: Record<string, string> = {
      'UK': 'United Kingdom',
      'USA': 'United States',
      'UAE': 'United Arab Emirates',
    }
    
    // Replace abbreviation with full name if it exists
    countryName = countryNameMap[countryName] || countryName
    
    // Navigate to the country packages page where users can browse and select their preferred eSIM plan
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

  const faqs = [
    { id: '1', question: 'What is eSIM?', answer: 'An eSIM (embedded SIM) is a digital SIM card that allows you to activate a cellular plan without a physical SIM card.' },
    { id: '2', question: 'Is my device compatible with TTelGo eSIM?', answer: 'Most modern smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, and Samsung Galaxy S20 and newer.' },
    { id: '3', question: 'How to install eSIM?', answer: 'Go to your device settings, select "Add Cellular Plan", scan the QR code we provide, and follow the on-screen instructions.' },
    { id: '4', question: 'What if I run out of data?', answer: 'You can purchase additional data packs or upgrade to a higher plan through your account dashboard.' },
    { id: '5', question: 'Is hotspot and tethering supported?', answer: 'Yes, most of our plans support hotspot and tethering. Check your plan details to confirm.' },
    { id: '6', question: 'Does the eSIM include a Local Phone Number?', answer: 'No, our eSIMs are data-only and do not include a phone number for calls or SMS.' },
    { id: '7', question: 'How much data do I need while travelling?', answer: 'This depends on your usage. Light users may need 1-2GB per week, while heavy users may need 5GB or more.' },
    { id: '8', question: 'How does using an eSIM compare to Pocket WiFi?', answer: 'eSIM is more convenient as it doesn\'t require carrying an extra device, and it works directly in your phone.' },
    { id: '9', question: 'Are there long-term plans available?', answer: 'Yes, we offer plans with validity periods ranging from 7 days to 30 days, with options to extend or add more data.' },
    { id: '10', question: 'Can I keep my primary SIM while using TTelGo eSIM?', answer: 'Yes, most devices support dual SIM functionality, allowing you to use both your primary SIM and TTelGo eSIM simultaneously.' },
  ]

  return (
    <div className="w-full">
      {/* Hero Section - Merged with Navbar */}
      <section 
        className="relative overflow-hidden bg-white mt-12"
        style={{
          paddingTop: '3rem', // Space for navbar
          paddingBottom: '4rem' // Fixed bottom padding instead of minHeight
        }}
      >
        {/* Content Container with proper z-index */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-8 pb-2">
          <div className="flex items-center gap-8 lg:gap-12">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex-1 max-w-[800px] relative z-20 pl-8 lg:pl-16 xl:pl-24"
            >
              {/* Redeem Banner Button */}
              <motion.div 
                className="mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="relative overflow-hidden group rounded-2xl bg-gradient-to-r from-telgo-red to-red-600 hover:bg-white transition-colors duration-300"
                  onClick={() => {
                    // Handle redeem action - can navigate to a page or show modal
                    alert('Redeem 1GB - Feature coming soon!')
                  }}
                  style={{
                    boxShadow: '0 4px 12px rgba(204, 0, 0, 0.25)'
                  }}
                >
                  <span className="relative z-10 text-white group-hover:text-black font-bold text-sm uppercase tracking-wide px-6 py-3 rounded-2xl inline-flex items-center gap-2 transition-colors duration-300">
                    <svg 
                      className="w-5 h-5 group-hover:text-black transition-colors duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                    </svg>
                    Redeem 1GB for your next trip
                    <svg 
                      className="w-4 h-4 group-hover:text-black transition-colors duration-300" 
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
              <h1 className="text-3xl md:text-4xl lg:text-[3rem] xl:text-5xl font-bold text-gray-900 mb-6 leading-[1.2]">
                <span>Stay connected</span>
                <br />
                <span>
                  in over{' '}
                  <span 
                    className="text-telgo-red underline decoration-2 underline-offset-4"
                  >
                    200+ destinations
                  </span>
                </span>
                <br />
                <span>worldwide</span>
              </h1>
              
              {/* View All Plans Button */}
              <motion.button
                onClick={() => {
                  const element = document.getElementById('popular-destinations')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mb-8 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-telgo-red to-red-600 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                View All Plans
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
              
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
            
            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex flex-1 items-center justify-center relative z-20 pr-8 lg:pr-16 xl:pr-24"
              style={{ marginTop: '-1.5rem' }}
            >
              <img 
                src="/IMAGES/HeroRRR.png" 
                alt="Hero illustration" 
                className="w-full h-auto max-w-xl object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Journey Section */}
      <section className="pt-4 pb-16 bg-transparent relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              Top 10 Destinations
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto text-center">
              Explore our top 10 most popular destinations. Discover the perfect eSIM plan for your next adventure.
            </p>
            
            {/* Destination Cards - Horizontal Scroll */}
            <div className="relative">
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
                      <img
                        src={dest.image}
                        alt={dest.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          if (!target.nextElementSibling) {
                            const placeholder = document.createElement('div')
                            placeholder.className = 'w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-gray-500'
                            placeholder.textContent = dest.name
                            target.parentNode?.appendChild(placeholder)
                          }
                        }}
                      />
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

      {/* All Destinations Section */}
      <section id="popular-destinations" className="pt-0 pb-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
              All Destinations
            </h2>
            <p className="text-lg text-gray-600 mb-4 max-w-2xl mx-auto text-center">
              Browse all available destinations and find the perfect eSIM plan for your travels.
            </p>
            <p className="text-sm text-gray-500 mb-6 max-w-2xl mx-auto text-center">
              Please dial <span className="font-bold">*#06#</span> to check device compatibility, if EID exist then your device is compatible.
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
      <section className="pt-0 pb-16 bg-transparent -mt-44">
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
                Why Choose Us
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
      <section id="faq" className="pt-0 pb-16 bg-transparent -mt-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              TTelGo FAQs
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
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
                    <span className="text-left font-medium text-gray-900">
                      <span className="text-telgo-red font-semibold mr-2">{index + 1}.</span>
                      {faq.question}
                    </span>
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
                    <div className="px-6 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="pt-0 pb-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-8 lg:gap-12 items-start">
            {/* Left Section - Label and Heading */}
            <div className="flex flex-col">
              {/* Top: Label and Heading */}
              <div>
                <div className="mb-6">
                  <span className="text-xs text-gray-500 uppercase tracking-[0.2em] font-medium">
                    TESTIMONIALS
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-[1.2]">
                  <span className="block whitespace-nowrap">What People Say</span>
                  <span className="block whitespace-nowrap">About Us.</span>
                </h2>
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
      <section className="pt-0 pb-16 bg-transparent relative -mt-8">
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
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full pl-12 pr-4 py-2.5 rounded-lg bg-white focus:outline-none transition-all placeholder-gray-400 text-gray-900 text-sm focus:ring-2 focus:ring-telgo-red"
                    style={{
                      boxShadow: '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)',
                      transition: 'box-shadow 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow = '0 12px 16px -2px rgba(0, 0, 0, 0.15), 0 6px 8px -2px rgba(0, 0, 0, 0.1), 0 -6px 8px -2px rgba(0, 0, 0, 0.1)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.08), 0 -3px 5px -1px rgba(0, 0, 0, 0.08)'
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-telgo-red text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap text-sm"
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
