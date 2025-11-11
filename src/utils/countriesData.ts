// Country data with pricing for Shop page
export interface Country {
  id: string
  name: string
  flag: string
  region: 'Asia' | 'Europe' | 'North America' | 'South America' | 'Africa' | 'Oceania' | 'Middle East'
  status: 'Open Now' | 'Coming Soon'
  prices: {
    '1GB': number
    '5GB': number
    '10GB': number
    'Unlimited': number
  }
  isTop?: boolean
  isNew?: boolean
}


// Comprehensive country list with pricing
export const countries: Country[] = [
  // Top Destinations
  { id: 'us', name: 'United States', flag: '🇺🇸', region: 'North America', status: 'Open Now', isTop: true, prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', region: 'Europe', status: 'Open Now', isTop: true, prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'japan', name: 'Japan', flag: '🇯🇵', region: 'Asia', status: 'Open Now', isTop: true, prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'france', name: 'France', flag: '🇫🇷', region: 'Europe', status: 'Open Now', isTop: true, prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'germany', name: 'Germany', flag: '🇩🇪', region: 'Europe', status: 'Open Now', isTop: true, prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'canada', name: 'Canada', flag: '🇨🇦', region: 'North America', status: 'Open Now', isTop: true, prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  { id: 'australia', name: 'Australia', flag: '🇦🇺', region: 'Oceania', status: 'Open Now', isTop: true, prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  { id: 'singapore', name: 'Singapore', flag: '🇸🇬', region: 'Asia', status: 'Open Now', isTop: true, prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  
  // Europe
  { id: 'italy', name: 'Italy', flag: '🇮🇹', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'spain', name: 'Spain', flag: '🇪🇸', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'netherlands', name: 'Netherlands', flag: '🇳🇱', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'belgium', name: 'Belgium', flag: '🇧🇪', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'switzerland', name: 'Switzerland', flag: '🇨🇭', region: 'Europe', status: 'Open Now', prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  { id: 'austria', name: 'Austria', flag: '🇦🇹', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'sweden', name: 'Sweden', flag: '🇸🇪', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'norway', name: 'Norway', flag: '🇳🇴', region: 'Europe', status: 'Open Now', prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  { id: 'denmark', name: 'Denmark', flag: '🇩🇰', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'finland', name: 'Finland', flag: '🇫🇮', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'poland', name: 'Poland', flag: '🇵🇱', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'portugal', name: 'Portugal', flag: '🇵🇹', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'greece', name: 'Greece', flag: '🇬🇷', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'ireland', name: 'Ireland', flag: '🇮🇪', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'croatia', name: 'Croatia', flag: '🇭🇷', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'czech', name: 'Czech Republic', flag: '🇨🇿', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'hungary', name: 'Hungary', flag: '🇭🇺', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'romania', name: 'Romania', flag: '🇷🇴', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'bulgaria', name: 'Bulgaria', flag: '🇧🇬', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'iceland', name: 'Iceland', flag: '🇮🇸', region: 'Europe', status: 'Open Now', prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  
  // Asia
  { id: 'china', name: 'China', flag: '🇨🇳', region: 'Asia', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'india', name: 'India', flag: '🇮🇳', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'south-korea', name: 'South Korea', flag: '🇰🇷', region: 'Asia', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'thailand', name: 'Thailand', flag: '🇹🇭', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'malaysia', name: 'Malaysia', flag: '🇲🇾', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'indonesia', name: 'Indonesia', flag: '🇮🇩', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'philippines', name: 'Philippines', flag: '🇵🇭', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'vietnam', name: 'Vietnam', flag: '🇻🇳', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'taiwan', name: 'Taiwan', flag: '🇹🇼', region: 'Asia', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'hong-kong', name: 'Hong Kong', flag: '🇭🇰', region: 'Asia', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'pakistan', name: 'Pakistan', flag: '🇵🇰', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'sri-lanka', name: 'Sri Lanka', flag: '🇱🇰', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'cambodia', name: 'Cambodia', flag: '🇰🇭', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'laos', name: 'Laos', flag: '🇱🇦', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'myanmar', name: 'Myanmar', flag: '🇲🇲', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  
  // Middle East
  { id: 'uae', name: 'United Arab Emirates', flag: '🇦🇪', region: 'Middle East', status: 'Open Now', isTop: true, prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'saudi-arabia', name: 'Saudi Arabia', flag: '🇸🇦', region: 'Middle East', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'israel', name: 'Israel', flag: '🇮🇱', region: 'Middle East', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'turkey', name: 'Turkey', flag: '🇹🇷', region: 'Middle East', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'qatar', name: 'Qatar', flag: '🇶🇦', region: 'Middle East', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'kuwait', name: 'Kuwait', flag: '🇰🇼', region: 'Middle East', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'bahrain', name: 'Bahrain', flag: '🇧🇭', region: 'Middle East', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'oman', name: 'Oman', flag: '🇴🇲', region: 'Middle East', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'jordan', name: 'Jordan', flag: '🇯🇴', region: 'Middle East', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'lebanon', name: 'Lebanon', flag: '🇱🇧', region: 'Middle East', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  
  // North America
  { id: 'mexico', name: 'Mexico', flag: '🇲🇽', region: 'North America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'costa-rica', name: 'Costa Rica', flag: '🇨🇷', region: 'North America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'panama', name: 'Panama', flag: '🇵🇦', region: 'North America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'jamaica', name: 'Jamaica', flag: '🇯🇲', region: 'North America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'bahamas', name: 'Bahamas', flag: '🇧🇸', region: 'North America', status: 'Open Now', prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  { id: 'dominican-republic', name: 'Dominican Republic', flag: '🇩🇴', region: 'North America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'guatemala', name: 'Guatemala', flag: '🇬🇹', region: 'North America', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'honduras', name: 'Honduras', flag: '🇭🇳', region: 'North America', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'nicaragua', name: 'Nicaragua', flag: '🇳🇮', region: 'North America', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'belize', name: 'Belize', flag: '🇧🇿', region: 'North America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'el-salvador', name: 'El Salvador', flag: '🇸🇻', region: 'North America', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  
  // South America
  { id: 'brazil', name: 'Brazil', flag: '🇧🇷', region: 'South America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'argentina', name: 'Argentina', flag: '🇦🇷', region: 'South America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'chile', name: 'Chile', flag: '🇨🇱', region: 'South America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'colombia', name: 'Colombia', flag: '🇨🇴', region: 'South America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'peru', name: 'Peru', flag: '🇵🇪', region: 'South America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'ecuador', name: 'Ecuador', flag: '🇪🇨', region: 'South America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'uruguay', name: 'Uruguay', flag: '🇺🇾', region: 'South America', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'paraguay', name: 'Paraguay', flag: '🇵🇾', region: 'South America', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'bolivia', name: 'Bolivia', flag: '🇧🇴', region: 'South America', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'venezuela', name: 'Venezuela', flag: '🇻🇪', region: 'South America', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  
  // Africa
  { id: 'south-africa', name: 'South Africa', flag: '🇿🇦', region: 'Africa', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'egypt', name: 'Egypt', flag: '🇪🇬', region: 'Africa', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'morocco', name: 'Morocco', flag: '🇲🇦', region: 'Africa', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'kenya', name: 'Kenya', flag: '🇰🇪', region: 'Africa', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'nigeria', name: 'Nigeria', flag: '🇳🇬', region: 'Africa', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'ghana', name: 'Ghana', flag: '🇬🇭', region: 'Africa', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'tanzania', name: 'Tanzania', flag: '🇹🇿', region: 'Africa', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'uganda', name: 'Uganda', flag: '🇺🇬', region: 'Africa', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'tunisia', name: 'Tunisia', flag: '🇹🇳', region: 'Africa', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'algeria', name: 'Algeria', flag: '🇩🇿', region: 'Africa', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  
  // Oceania
  { id: 'new-zealand', name: 'New Zealand', flag: '🇳🇿', region: 'Oceania', status: 'Open Now', isNew: true, prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  { id: 'fiji', name: 'Fiji', flag: '🇫🇯', region: 'Oceania', status: 'Open Now', isNew: true, prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  { id: 'papua-new-guinea', name: 'Papua New Guinea', flag: '🇵🇬', region: 'Oceania', status: 'Open Now', isNew: true, prices: { '1GB': 4.99, '5GB': 14.99, '10GB': 24.99, 'Unlimited': 49.99 } },
  
  // More countries (extended list)
  { id: 'russia', name: 'Russia', flag: '🇷🇺', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'ukraine', name: 'Ukraine', flag: '🇺🇦', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'serbia', name: 'Serbia', flag: '🇷🇸', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'montenegro', name: 'Montenegro', flag: '🇲🇪', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'bosnia', name: 'Bosnia and Herzegovina', flag: '🇧🇦', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'albania', name: 'Albania', flag: '🇦🇱', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'estonia', name: 'Estonia', flag: '🇪🇪', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'latvia', name: 'Latvia', flag: '🇱🇻', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'lithuania', name: 'Lithuania', flag: '🇱🇹', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'slovenia', name: 'Slovenia', flag: '🇸🇮', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'slovakia', name: 'Slovakia', flag: '🇸🇰', region: 'Europe', status: 'Open Now', prices: { '1GB': 3.49, '5GB': 11.99, '10GB': 21.99, 'Unlimited': 42.99 } },
  { id: 'kazakhstan', name: 'Kazakhstan', flag: '🇰🇿', region: 'Asia', status: 'Open Now', isNew: true, prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'uzbekistan', name: 'Uzbekistan', flag: '🇺🇿', region: 'Asia', status: 'Open Now', isNew: true, prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'mongolia', name: 'Mongolia', flag: '🇲🇳', region: 'Asia', status: 'Open Now', isNew: true, prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'nepal', name: 'Nepal', flag: '🇳🇵', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'bhutan', name: 'Bhutan', flag: '🇧🇹', region: 'Asia', status: 'Open Now', prices: { '1GB': 2.99, '5GB': 9.99, '10GB': 18.99, 'Unlimited': 39.99 } },
  { id: 'brunei', name: 'Brunei', flag: '🇧🇳', region: 'Asia', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
  { id: 'maldives', name: 'Maldives', flag: '🇲🇻', region: 'Asia', status: 'Open Now', prices: { '1GB': 3.99, '5GB': 12.99, '10GB': 22.99, 'Unlimited': 44.99 } },
]

// Add more countries to reach 200+ (extended list)
const additionalCountries: Omit<Country, 'prices'>[] = [
  // More Asian countries
  { id: 'afghanistan', name: 'Afghanistan', flag: '🇦🇫', region: 'Asia', status: 'Coming Soon' },
  { id: 'iraq', name: 'Iraq', flag: '🇮🇶', region: 'Middle East', status: 'Coming Soon' },
  { id: 'iran', name: 'Iran', flag: '🇮🇷', region: 'Middle East', status: 'Coming Soon' },
  { id: 'yemen', name: 'Yemen', flag: '🇾🇪', region: 'Middle East', status: 'Coming Soon' },
  { id: 'syria', name: 'Syria', flag: '🇸🇾', region: 'Middle East', status: 'Coming Soon' },
  { id: 'palestine', name: 'Palestine', flag: '🇵🇸', region: 'Middle East', status: 'Coming Soon' },
  { id: 'kyrgyzstan', name: 'Kyrgyzstan', flag: '🇰🇬', region: 'Asia', status: 'Open Now' },
  { id: 'tajikistan', name: 'Tajikistan', flag: '🇹🇯', region: 'Asia', status: 'Open Now' },
  { id: 'turkmenistan', name: 'Turkmenistan', flag: '🇹🇲', region: 'Asia', status: 'Open Now' },
  { id: 'east-timor', name: 'East Timor', flag: '🇹🇱', region: 'Asia', status: 'Open Now' },
  
  // More European countries
  { id: 'luxembourg', name: 'Luxembourg', flag: '🇱🇺', region: 'Europe', status: 'Open Now' },
  { id: 'malta', name: 'Malta', flag: '🇲🇹', region: 'Europe', status: 'Open Now' },
  { id: 'cyprus', name: 'Cyprus', flag: '🇨🇾', region: 'Europe', status: 'Open Now' },
  { id: 'monaco', name: 'Monaco', flag: '🇲🇨', region: 'Europe', status: 'Open Now' },
  { id: 'liechtenstein', name: 'Liechtenstein', flag: '🇱🇮', region: 'Europe', status: 'Open Now' },
  { id: 'san-marino', name: 'San Marino', flag: '🇸🇲', region: 'Europe', status: 'Open Now' },
  { id: 'andorra', name: 'Andorra', flag: '🇦🇩', region: 'Europe', status: 'Open Now' },
  { id: 'vatican', name: 'Vatican City', flag: '🇻🇦', region: 'Europe', status: 'Open Now' },
  { id: 'moldova', name: 'Moldova', flag: '🇲🇩', region: 'Europe', status: 'Open Now' },
  { id: 'belarus', name: 'Belarus', flag: '🇧🇾', region: 'Europe', status: 'Open Now' },
  { id: 'north-macedonia', name: 'North Macedonia', flag: '🇲🇰', region: 'Europe', status: 'Open Now' },
  { id: 'georgia', name: 'Georgia', flag: '🇬🇪', region: 'Asia', status: 'Open Now' },
  { id: 'armenia', name: 'Armenia', flag: '🇦🇲', region: 'Asia', status: 'Open Now' },
  { id: 'azerbaijan', name: 'Azerbaijan', flag: '🇦🇿', region: 'Asia', status: 'Open Now' },
  
  // More African countries
  { id: 'ethiopia', name: 'Ethiopia', flag: '🇪🇹', region: 'Africa', status: 'Open Now' },
  { id: 'senegal', name: 'Senegal', flag: '🇸🇳', region: 'Africa', status: 'Open Now' },
  { id: 'ivory-coast', name: 'Ivory Coast', flag: '🇨🇮', region: 'Africa', status: 'Open Now' },
  { id: 'cameroon', name: 'Cameroon', flag: '🇨🇲', region: 'Africa', status: 'Open Now' },
  { id: 'angola', name: 'Angola', flag: '🇦🇴', region: 'Africa', status: 'Open Now' },
  { id: 'mozambique', name: 'Mozambique', flag: '🇲🇿', region: 'Africa', status: 'Open Now' },
  { id: 'madagascar', name: 'Madagascar', flag: '🇲🇬', region: 'Africa', status: 'Open Now' },
  { id: 'zambia', name: 'Zambia', flag: '🇿🇲', region: 'Africa', status: 'Open Now' },
  { id: 'zimbabwe', name: 'Zimbabwe', flag: '🇿🇼', region: 'Africa', status: 'Open Now' },
  { id: 'botswana', name: 'Botswana', flag: '🇧🇼', region: 'Africa', status: 'Open Now' },
  { id: 'namibia', name: 'Namibia', flag: '🇳🇦', region: 'Africa', status: 'Open Now' },
  { id: 'mauritius', name: 'Mauritius', flag: '🇲🇺', region: 'Africa', status: 'Open Now' },
  { id: 'seychelles', name: 'Seychelles', flag: '🇸🇨', region: 'Africa', status: 'Open Now' },
  { id: 'rwanda', name: 'Rwanda', flag: '🇷🇼', region: 'Africa', status: 'Open Now' },
  { id: 'malawi', name: 'Malawi', flag: '🇲🇼', region: 'Africa', status: 'Open Now' },
  { id: 'lesotho', name: 'Lesotho', flag: '🇱🇸', region: 'Africa', status: 'Open Now' },
  { id: 'eswatini', name: 'Eswatini', flag: '🇸🇿', region: 'Africa', status: 'Open Now' },
  { id: 'libya', name: 'Libya', flag: '🇱🇾', region: 'Africa', status: 'Open Now' },
  { id: 'sudan', name: 'Sudan', flag: '🇸🇩', region: 'Africa', status: 'Open Now' },
  { id: 'mauritania', name: 'Mauritania', flag: '🇲🇷', region: 'Africa', status: 'Open Now' },
  { id: 'niger', name: 'Niger', flag: '🇳🇪', region: 'Africa', status: 'Open Now' },
  { id: 'mali', name: 'Mali', flag: '🇲🇱', region: 'Africa', status: 'Open Now' },
  { id: 'burkina-faso', name: 'Burkina Faso', flag: '🇧🇫', region: 'Africa', status: 'Open Now' },
  { id: 'benin', name: 'Benin', flag: '🇧🇯', region: 'Africa', status: 'Open Now' },
  { id: 'togo', name: 'Togo', flag: '🇹🇬', region: 'Africa', status: 'Open Now' },
  { id: 'guinea', name: 'Guinea', flag: '🇬🇳', region: 'Africa', status: 'Open Now' },
  { id: 'sierra-leone', name: 'Sierra Leone', flag: '🇸🇱', region: 'Africa', status: 'Open Now' },
  { id: 'liberia', name: 'Liberia', flag: '🇱🇷', region: 'Africa', status: 'Open Now' },
  { id: 'gambia', name: 'Gambia', flag: '🇬🇲', region: 'Africa', status: 'Open Now' },
  { id: 'guinea-bissau', name: 'Guinea-Bissau', flag: '🇬🇼', region: 'Africa', status: 'Open Now' },
  { id: 'cape-verde', name: 'Cape Verde', flag: '🇨🇻', region: 'Africa', status: 'Open Now' },
  { id: 'sao-tome', name: 'São Tomé and Príncipe', flag: '🇸🇹', region: 'Africa', status: 'Open Now' },
  { id: 'equatorial-guinea', name: 'Equatorial Guinea', flag: '🇬🇶', region: 'Africa', status: 'Open Now' },
  { id: 'gabon', name: 'Gabon', flag: '🇬🇦', region: 'Africa', status: 'Open Now' },
  { id: 'congo', name: 'Republic of Congo', flag: '🇨🇬', region: 'Africa', status: 'Open Now' },
  { id: 'dr-congo', name: 'DR Congo', flag: '🇨🇩', region: 'Africa', status: 'Open Now' },
  { id: 'central-african-republic', name: 'Central African Republic', flag: '🇨🇫', region: 'Africa', status: 'Open Now' },
  { id: 'chad', name: 'Chad', flag: '🇹🇩', region: 'Africa', status: 'Open Now' },
  { id: 'eritrea', name: 'Eritrea', flag: '🇪🇷', region: 'Africa', status: 'Open Now' },
  { id: 'djibouti', name: 'Djibouti', flag: '🇩🇯', region: 'Africa', status: 'Open Now' },
  { id: 'somalia', name: 'Somalia', flag: '🇸🇴', region: 'Africa', status: 'Open Now' },
  { id: 'comoros', name: 'Comoros', flag: '🇰🇲', region: 'Africa', status: 'Open Now' },
  { id: 'burundi', name: 'Burundi', flag: '🇧🇮', region: 'Africa', status: 'Open Now' },
  { id: 'south-sudan', name: 'South Sudan', flag: '🇸🇸', region: 'Africa', status: 'Open Now' },
  
  // More North/Central American countries
  { id: 'cuba', name: 'Cuba', flag: '🇨🇺', region: 'North America', status: 'Coming Soon' },
  { id: 'haiti', name: 'Haiti', flag: '🇭🇹', region: 'North America', status: 'Open Now', isNew: true },
  { id: 'puerto-rico', name: 'Puerto Rico', flag: '🇵🇷', region: 'North America', status: 'Open Now', isNew: true },
  { id: 'trinidad', name: 'Trinidad and Tobago', flag: '🇹🇹', region: 'North America', status: 'Open Now' },
  { id: 'barbados', name: 'Barbados', flag: '🇧🇧', region: 'North America', status: 'Open Now' },
  { id: 'antigua-barbuda', name: 'Antigua and Barbuda', flag: '🇦🇬', region: 'North America', status: 'Open Now', isNew: true },
  { id: 'st-kitts-nevis', name: 'Saint Kitts and Nevis', flag: '🇰🇳', region: 'North America', status: 'Open Now' },
  { id: 'st-lucia', name: 'Saint Lucia', flag: '🇱🇨', region: 'North America', status: 'Open Now' },
  { id: 'st-vincent', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨', region: 'North America', status: 'Open Now' },
  { id: 'grenada', name: 'Grenada', flag: '🇬🇩', region: 'North America', status: 'Open Now' },
  { id: 'dominica', name: 'Dominica', flag: '🇩🇲', region: 'North America', status: 'Open Now' },
  { id: 'british-virgin-islands', name: 'British Virgin Islands', flag: '🇻🇬', region: 'North America', status: 'Open Now' },
  { id: 'cayman-islands', name: 'Cayman Islands', flag: '🇰🇾', region: 'North America', status: 'Open Now' },
  { id: 'bermuda', name: 'Bermuda', flag: '🇧🇲', region: 'North America', status: 'Open Now' },
  { id: 'aruba', name: 'Aruba', flag: '🇦🇼', region: 'North America', status: 'Open Now' },
  { id: 'curacao', name: 'Curaçao', flag: '🇨🇼', region: 'North America', status: 'Open Now' },
  { id: 'sint-maarten', name: 'Sint Maarten', flag: '🇸🇽', region: 'North America', status: 'Open Now' },
  { id: 'anguilla', name: 'Anguilla', flag: '🇦🇮', region: 'North America', status: 'Open Now' },
  { id: 'montserrat', name: 'Montserrat', flag: '🇲🇸', region: 'North America', status: 'Open Now' },
  { id: 'turks-caicos', name: 'Turks and Caicos', flag: '🇹🇨', region: 'North America', status: 'Open Now' },
  { id: 'guadeloupe', name: 'Guadeloupe', flag: '🇬🇵', region: 'North America', status: 'Open Now' },
  { id: 'martinique', name: 'Martinique', flag: '🇲🇶', region: 'North America', status: 'Open Now' },
  { id: 'st-barthelemy', name: 'Saint Barthélemy', flag: '🇧🇱', region: 'North America', status: 'Open Now' },
  { id: 'st-martin', name: 'Saint Martin', flag: '🇲🇫', region: 'North America', status: 'Open Now' },
  { id: 'st-pierre-miquelon', name: 'Saint Pierre and Miquelon', flag: '🇵🇲', region: 'North America', status: 'Open Now' },
  { id: 'greenland', name: 'Greenland', flag: '🇬🇱', region: 'North America', status: 'Open Now' },
  { id: 'falkland-islands', name: 'Falkland Islands', flag: '🇫🇰', region: 'South America', status: 'Open Now' },
  
  // More South American countries
  { id: 'guyana', name: 'Guyana', flag: '🇬🇾', region: 'South America', status: 'Open Now' },
  { id: 'suriname', name: 'Suriname', flag: '🇸🇷', region: 'South America', status: 'Open Now' },
  { id: 'french-guiana', name: 'French Guiana', flag: '🇬🇫', region: 'South America', status: 'Open Now' },
  
  // More Oceania countries
  { id: 'samoa', name: 'Samoa', flag: '🇼🇸', region: 'Oceania', status: 'Open Now' },
  { id: 'tonga', name: 'Tonga', flag: '🇹🇴', region: 'Oceania', status: 'Open Now' },
  { id: 'vanuatu', name: 'Vanuatu', flag: '🇻🇺', region: 'Oceania', status: 'Open Now' },
  { id: 'solomon-islands', name: 'Solomon Islands', flag: '🇸🇧', region: 'Oceania', status: 'Open Now' },
  { id: 'new-caledonia', name: 'New Caledonia', flag: '🇳🇨', region: 'Oceania', status: 'Open Now' },
  { id: 'french-polynesia', name: 'French Polynesia', flag: '🇵🇫', region: 'Oceania', status: 'Open Now' },
  { id: 'guam', name: 'Guam', flag: '🇬🇺', region: 'Oceania', status: 'Open Now' },
  { id: 'american-samoa', name: 'American Samoa', flag: '🇦🇸', region: 'Oceania', status: 'Open Now' },
  { id: 'northern-mariana', name: 'Northern Mariana Islands', flag: '🇲🇵', region: 'Oceania', status: 'Open Now' },
  { id: 'palau', name: 'Palau', flag: '🇵🇼', region: 'Oceania', status: 'Open Now' },
  { id: 'micronesia', name: 'Micronesia', flag: '🇫🇲', region: 'Oceania', status: 'Open Now' },
  { id: 'marshall-islands', name: 'Marshall Islands', flag: '🇲🇭', region: 'Oceania', status: 'Open Now' },
  { id: 'kiribati', name: 'Kiribati', flag: '🇰🇮', region: 'Oceania', status: 'Open Now' },
  { id: 'nauru', name: 'Nauru', flag: '🇳🇷', region: 'Oceania', status: 'Open Now' },
  { id: 'tuvalu', name: 'Tuvalu', flag: '🇹🇻', region: 'Oceania', status: 'Open Now' },
  { id: 'cook-islands', name: 'Cook Islands', flag: '🇨🇰', region: 'Oceania', status: 'Open Now' },
  { id: 'niue', name: 'Niue', flag: '🇳🇺', region: 'Oceania', status: 'Open Now' },
  { id: 'tokelau', name: 'Tokelau', flag: '🇹🇰', region: 'Oceania', status: 'Open Now' },
  { id: 'pitcairn', name: 'Pitcairn Islands', flag: '🇵🇳', region: 'Oceania', status: 'Open Now' },
  { id: 'wallis-futuna', name: 'Wallis and Futuna', flag: '🇼🇫', region: 'Oceania', status: 'Open Now' },
  
  // More Asian countries
  { id: 'macau', name: 'Macau', flag: '🇲🇴', region: 'Asia', status: 'Open Now' },
  { id: 'north-korea', name: 'North Korea', flag: '🇰🇵', region: 'Asia', status: 'Coming Soon' },
  
  // More European countries
  { id: 'faroe-islands', name: 'Faroe Islands', flag: '🇫🇴', region: 'Europe', status: 'Open Now' },
  { id: 'isle-of-man', name: 'Isle of Man', flag: '🇮🇲', region: 'Europe', status: 'Open Now' },
  { id: 'jersey', name: 'Jersey', flag: '🇯🇪', region: 'Europe', status: 'Open Now' },
  { id: 'guernsey', name: 'Guernsey', flag: '🇬🇬', region: 'Europe', status: 'Open Now' },
  { id: 'gibraltar', name: 'Gibraltar', flag: '🇬🇮', region: 'Europe', status: 'Open Now' },
  { id: 'reunion', name: 'Réunion', flag: '🇷🇪', region: 'Africa', status: 'Open Now' },
  { id: 'mayotte', name: 'Mayotte', flag: '🇾🇹', region: 'Africa', status: 'Open Now' },
  { id: 'st-helena', name: 'Saint Helena', flag: '🇸🇭', region: 'Africa', status: 'Open Now' },
]

// Add prices to additional countries
const countriesWithPrices = additionalCountries.map(country => {
  if (country.status === 'Coming Soon') {
    return {
      ...country,
      prices: { '1GB': 0, '5GB': 0, '10GB': 0, 'Unlimited': 0 }
    }
  }
  
  // Generate prices based on region
  const basePrice = country.region === 'Asia' || country.region === 'Africa' ? 2.99 :
                    country.region === 'Europe' || country.region === 'Middle East' ? 3.99 :
                    country.region === 'North America' || country.region === 'Oceania' ? 4.99 : 3.99
  
  return {
    ...country,
    prices: {
      '1GB': basePrice,
      '5GB': Math.round(basePrice * 3.5 * 100) / 100,
      '10GB': Math.round(basePrice * 6.5 * 100) / 100,
      'Unlimited': Math.round(basePrice * 12 * 100) / 100,
    }
  }
})

// Combine all countries
export const allCountries: Country[] = [...countries, ...countriesWithPrices as Country[]]

// Helper functions
export const getCountriesByRegion = (region: string) => {
  if (region === 'All') return allCountries
  return allCountries.filter(country => country.region === region)
}

export const getTopDestinations = () => {
  return allCountries.filter(country => country.isTop)
}

export const getNewDestinations = () => {
  return allCountries.filter(country => country.isNew)
}

export const searchCountries = (query: string) => {
  const lowerQuery = query.toLowerCase()
  return allCountries.filter(country => 
    country.name.toLowerCase().includes(lowerQuery)
  )
}

