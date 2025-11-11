import { useState, useRef, useMemo, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

// Generate random price between 0.50 and 2.00
const getRandomPrice = () => {
  return (Math.random() * 1.5 + 0.5).toFixed(2)
}

// Hero Background Component - White background
const HeroBackground = () => {
  return (
    <>
      {/* White Background */}
      <div 
        className="absolute inset-0 w-full h-full bg-white"
        style={{
          zIndex: 0
        }}
      />
    </>
  )
}

const Home = () => {
  const [activeTab, setActiveTab] = useState('local')
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const [email, setEmail] = useState('')
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const regionalScrollRef = useRef<HTMLDivElement>(null)
  const journeyScrollRef = useRef<HTMLDivElement>(null)
  const location = useLocation()

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
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)

  // Journey destinations - Popular travel destinations
  const destinations = [
    { name: 'Rome, Italy', price: '0.98', image: '/IMAGES/1.jpg' },
    { name: 'London, UK', price: '0.90', image: '/IMAGES/2.jpg' },
    { name: 'Paris, France', price: '0.85', image: '/IMAGES/3.jpg' },
    { name: 'Tokyo, Japan', price: '1.25', image: '/IMAGES/1.jpg' },
    { name: 'New York, USA', price: '1.10', image: '/IMAGES/2.jpg' },
    { name: 'Barcelona, Spain', price: '0.75', image: '/IMAGES/3.jpg' },
    { name: 'Dubai, UAE', price: '0.95', image: '/IMAGES/1.jpg' },
    { name: 'Singapore', price: '0.78', image: '/IMAGES/2.jpg' },
    { name: 'Sydney, Australia', price: '1.05', image: '/IMAGES/3.jpg' },
    { name: 'Bangkok, Thailand', price: '0.65', image: '/IMAGES/1.jpg' },
    { name: 'Amsterdam, Netherlands', price: '0.88', image: '/IMAGES/2.jpg' },
    { name: 'Istanbul, Turkey', price: '0.72', image: '/IMAGES/3.jpg' },
  ]

  // Local eSIMs - keeping same for now
  const localDestinations = [
    { name: 'Australia', price: '0.54', flag: '🇦🇺' },
    { name: 'Italy', price: '0.90', flag: '🇮🇹' },
    { name: 'Turkey', price: '0.90', flag: '🇹🇷' },
    { name: 'Singapore', price: '0.78', flag: '🇸🇬' },
  ]

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
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
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
              className="max-w-[600px] lg:max-w-none relative z-20"
            >
              {/* Redeem Banner */}
              <div className="mb-4">
                <span className="text-white font-semibold text-sm uppercase tracking-wide px-3 py-1 bg-red-600/80 rounded-md inline-block" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)' }}>
                  REDEEM FREE 1GB FOR YOUR NEXT TRIP
                </span>
              </div>
              
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
              <div className="relative max-w-md">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search for your next destination"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-telgo-red focus:border-transparent text-gray-900 bg-white/95 backdrop-blur-sm relative z-0"
                />
              </div>
            </motion.div>

            {/* Right Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex relative w-full items-center justify-center"
              style={{ zIndex: 15 }}
            >
              <div className="relative w-full flex items-center justify-center">
                <img
                  src="/IMAGES/FemaleTeam.jpg"
                  alt="TTelGo Team"
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
                    console.error('Failed to load FemaleTeam.jpg');
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
              <div
                ref={journeyScrollRef}
                className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
              >
                {destinations.map((dest, index) => (
                  <div
                    key={index}
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

      {/* Popular Destinations Section */}
      <section id="popular-destinations" className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
              Popular Destinations
            </h2>
            
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
                  setActiveTab('regional')
                  setSelectedRegion(null)
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'regional'
                    ? 'bg-telgo-red text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
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
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {localDestinations.map((dest, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow cursor-pointer"
                  >
                    <div className="text-4xl mb-3">{dest.flag}</div>
                    <div className="text-gray-900 font-semibold mb-2">{dest.name}</div>
                    <div className="text-telgo-red text-sm font-medium">
                      Starting from USD {dest.price}/GB
                    </div>
                  </motion.div>
                ))}
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
                        <button
                          key={region}
                          onClick={() => setSelectedRegion(region)}
                          className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow cursor-pointer"
                        >
                          <div className="text-gray-900 font-semibold text-lg">{regionNames[region] || region}</div>
                          <div className="text-gray-600 text-sm mt-2">
                            {regionalESIMs[region as keyof typeof regionalESIMs].length} countries
                          </div>
                        </button>
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
                          <div
                            key={index}
                            className="flex-shrink-0 bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow cursor-pointer min-w-[200px]"
                          >
                            <div className="text-4xl mb-3">{dest.flag}</div>
                            <div className="text-gray-900 font-semibold mb-2">{dest.name}</div>
                            <div className="text-telgo-red text-sm font-medium">
                              Starting from USD {dest.price}/GB
                            </div>
                          </div>
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
              <div className="relative">
                <div
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
                >
                  {allCountries.map((dest, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition-shadow cursor-pointer min-w-[200px]"
                    >
                      <div className="text-4xl mb-3">{dest.flag}</div>
                      <div className="text-gray-900 font-semibold mb-2 text-sm">{dest.name}</div>
                      <div className="text-telgo-red text-sm font-medium">
                        Starting from USD {dest.price}/GB
                      </div>
                    </div>
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
            )}
          </motion.div>
        </div>
      </section>

      {/* Forget About Roaming Section */}
      <section className="py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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

            {/* Right - MockUp Image */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:flex relative w-full items-center justify-center"
            >
              <img
                src="/IMAGES/MockUp.png"
                alt="TTelGo eSIM MockUp"
                className="w-full h-auto object-contain"
                style={{ 
                  maxHeight: '700px',
                  minHeight: '400px',
                  height: 'auto',
                  width: 'auto',
                  maxWidth: '100%',
                  border: 'none',
                  outline: 'none',
                  boxShadow: 'none'
                }}
                loading="eager"
                onError={() => {
                  console.warn('MockUp image not found at /IMAGES/MockUp.png')
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-transparent">
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
