// Regional eSIM Plans Data
export interface RegionalPlan {
  id: string
  name: string
  pricePerGB: number
  currency: string
  countryCount: number
  countries: Array<{ name: string; flag: string }>
  continent: 'Europe' | 'Asia' | 'America' | 'Africa' | 'Middle East'
  description?: string
}

export const regionalPlans: RegionalPlan[] = [
  // Europe
  {
    id: 'eu-us-ca',
    name: 'EU-US-CA',
    pricePerGB: 2.30,
    currency: 'USD',
    countryCount: 41,
    continent: 'Europe',
    countries: [
      { name: 'Albania', flag: '🇦🇱' },
      { name: 'Austria', flag: '🇦🇹' },
      { name: 'Belgium', flag: '🇧🇪' },
      { name: 'Bulgaria', flag: '🇧🇬' },
      { name: 'Canada', flag: '🇨🇦' },
      { name: 'Croatia', flag: '🇭🇷' },
      { name: 'Czech Republic', flag: '🇨🇿' },
      { name: 'Denmark', flag: '🇩🇰' },
      { name: 'Estonia', flag: '🇪🇪' },
      { name: 'Finland', flag: '🇫🇮' },
      { name: 'France', flag: '🇫🇷' },
      { name: 'Germany', flag: '🇩🇪' },
      { name: 'Greece', flag: '🇬🇷' },
      { name: 'Hungary', flag: '🇭🇺' },
      { name: 'Ireland', flag: '🇮🇪' },
      { name: 'Italy', flag: '🇮🇹' },
      { name: 'Latvia', flag: '🇱🇻' },
      { name: 'Lithuania', flag: '🇱🇹' },
      { name: 'Luxembourg', flag: '🇱🇺' },
      { name: 'Netherlands', flag: '🇳🇱' },
      { name: 'Poland', flag: '🇵🇱' },
      { name: 'Portugal', flag: '🇵🇹' },
      { name: 'Romania', flag: '🇷🇴' },
      { name: 'Slovakia', flag: '🇸🇰' },
      { name: 'Slovenia', flag: '🇸🇮' },
      { name: 'Spain', flag: '🇪🇸' },
      { name: 'Sweden', flag: '🇸🇪' },
      { name: 'United Kingdom', flag: '🇬🇧' },
      { name: 'United States', flag: '🇺🇸' },
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    pricePerGB: 0.58,
    currency: 'USD',
    countryCount: 36,
    continent: 'Europe',
    countries: [
      { name: 'Austria', flag: '🇦🇹' },
      { name: 'Belgium', flag: '🇧🇪' },
      { name: 'Bulgaria', flag: '🇧🇬' },
      { name: 'Croatia', flag: '🇭🇷' },
      { name: 'Czech Republic', flag: '🇨🇿' },
      { name: 'Denmark', flag: '🇩🇰' },
      { name: 'Estonia', flag: '🇪🇪' },
      { name: 'Finland', flag: '🇫🇮' },
      { name: 'France', flag: '🇫🇷' },
      { name: 'Germany', flag: '🇩🇪' },
      { name: 'Greece', flag: '🇬🇷' },
      { name: 'Hungary', flag: '🇭🇺' },
      { name: 'Ireland', flag: '🇮🇪' },
      { name: 'Italy', flag: '🇮🇹' },
      { name: 'Latvia', flag: '🇱🇻' },
      { name: 'Lithuania', flag: '🇱🇹' },
      { name: 'Luxembourg', flag: '🇱🇺' },
      { name: 'Netherlands', flag: '🇳🇱' },
      { name: 'Poland', flag: '🇵🇱' },
      { name: 'Portugal', flag: '🇵🇹' },
      { name: 'Romania', flag: '🇷🇴' },
      { name: 'Slovakia', flag: '🇸🇰' },
      { name: 'Slovenia', flag: '🇸🇮' },
      { name: 'Spain', flag: '🇪🇸' },
      { name: 'Sweden', flag: '🇸🇪' },
      { name: 'United Kingdom', flag: '🇬🇧' },
    ]
  },
  {
    id: 'balkans',
    name: 'Balkans',
    pricePerGB: 2.75,
    currency: 'USD',
    countryCount: 13,
    continent: 'Europe',
    countries: [
      { name: 'Albania', flag: '🇦🇱' },
      { name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
      { name: 'Bulgaria', flag: '🇧🇬' },
      { name: 'Croatia', flag: '🇭🇷' },
      { name: 'Greece', flag: '🇬🇷' },
      { name: 'Montenegro', flag: '🇲🇪' },
      { name: 'North Macedonia', flag: '🇲🇰' },
      { name: 'Romania', flag: '🇷🇴' },
      { name: 'Serbia', flag: '🇷🇸' },
      { name: 'Slovenia', flag: '🇸🇮' },
    ]
  },

  // Asia
  {
    id: 'apac',
    name: 'APAC',
    pricePerGB: 1.44,
    currency: 'USD',
    countryCount: 21,
    continent: 'Asia',
    countries: [
      { name: 'Australia', flag: '🇦🇺' },
      { name: 'China', flag: '🇨🇳' },
      { name: 'Hong Kong', flag: '🇭🇰' },
      { name: 'India', flag: '🇮🇳' },
      { name: 'Indonesia', flag: '🇮🇩' },
      { name: 'Japan', flag: '🇯🇵' },
      { name: 'Malaysia', flag: '🇲🇾' },
      { name: 'New Zealand', flag: '🇳🇿' },
      { name: 'Philippines', flag: '🇵🇭' },
      { name: 'Singapore', flag: '🇸🇬' },
      { name: 'South Korea', flag: '🇰🇷' },
      { name: 'Taiwan', flag: '🇹🇼' },
      { name: 'Thailand', flag: '🇹🇭' },
      { name: 'Vietnam', flag: '🇻🇳' },
    ]
  },
  {
    id: 'sg-my-th',
    name: 'SG-MY-TH',
    pricePerGB: 1.10,
    currency: 'USD',
    countryCount: 3,
    continent: 'Asia',
    countries: [
      { name: 'Malaysia', flag: '🇲🇾' },
      { name: 'Singapore', flag: '🇸🇬' },
      { name: 'Thailand', flag: '🇹🇭' },
    ]
  },
  {
    id: 'cn-jp-kr',
    name: 'CN-JP-KR',
    pricePerGB: 1.35,
    currency: 'USD',
    countryCount: 3,
    continent: 'Asia',
    countries: [
      { name: 'China', flag: '🇨🇳' },
      { name: 'Japan', flag: '🇯🇵' },
      { name: 'South Korea', flag: '🇰🇷' },
    ]
  },
  {
    id: 'sea-oceania',
    name: 'SEA-Oceania',
    pricePerGB: 1.20,
    currency: 'USD',
    countryCount: 8,
    continent: 'Asia',
    countries: [
      { name: 'Australia', flag: '🇦🇺' },
      { name: 'Indonesia', flag: '🇮🇩' },
      { name: 'Malaysia', flag: '🇲🇾' },
      { name: 'New Zealand', flag: '🇳🇿' },
      { name: 'Philippines', flag: '🇵🇭' },
      { name: 'Singapore', flag: '🇸🇬' },
      { name: 'Thailand', flag: '🇹🇭' },
      { name: 'Vietnam', flag: '🇻🇳' },
    ]
  },

  // America
  {
    id: 'north-america',
    name: 'North America',
    pricePerGB: 2.05,
    currency: 'USD',
    countryCount: 3,
    continent: 'America',
    countries: [
      { name: 'Canada', flag: '🇨🇦' },
      { name: 'Mexico', flag: '🇲🇽' },
      { name: 'United States', flag: '🇺🇸' },
    ]
  },
  {
    id: 'caribbean',
    name: 'Caribbean',
    pricePerGB: 2.45,
    currency: 'USD',
    countryCount: 15,
    continent: 'America',
    countries: [
      { name: 'Antigua and Barbuda', flag: '🇦🇬' },
      { name: 'Anguilla', flag: '🇦🇮' },
      { name: 'Aruba', flag: '🇦🇼' },
      { name: 'Bahamas', flag: '🇧🇸' },
      { name: 'Barbados', flag: '🇧🇧' },
      { name: 'Cayman Islands', flag: '🇰🇾' },
      { name: 'Dominican Republic', flag: '🇩🇴' },
      { name: 'Jamaica', flag: '🇯🇲' },
      { name: 'Puerto Rico', flag: '🇵🇷' },
      { name: 'Trinidad and Tobago', flag: '🇹🇹' },
    ]
  },
  {
    id: 'latin-america',
    name: 'Latin America',
    pricePerGB: 3.45,
    currency: 'USD',
    countryCount: 17,
    continent: 'America',
    countries: [
      { name: 'Argentina', flag: '🇦🇷' },
      { name: 'Bolivia', flag: '🇧🇴' },
      { name: 'Brazil', flag: '🇧🇷' },
      { name: 'Chile', flag: '🇨🇱' },
      { name: 'Colombia', flag: '🇨🇴' },
      { name: 'Costa Rica', flag: '🇨🇷' },
      { name: 'Ecuador', flag: '🇪🇨' },
      { name: 'Guatemala', flag: '🇬🇹' },
      { name: 'Mexico', flag: '🇲🇽' },
      { name: 'Panama', flag: '🇵🇦' },
      { name: 'Peru', flag: '🇵🇪' },
      { name: 'Uruguay', flag: '🇺🇾' },
      { name: 'Venezuela', flag: '🇻🇪' },
    ]
  },

  // Africa
  {
    id: 'africa',
    name: 'Africa',
    pricePerGB: 4.50,
    currency: 'USD',
    countryCount: 11,
    continent: 'Africa',
    countries: [
      { name: 'Egypt', flag: '🇪🇬' },
      { name: 'Kenya', flag: '🇰🇪' },
      { name: 'Morocco', flag: '🇲🇦' },
      { name: 'South Africa', flag: '🇿🇦' },
      { name: 'Tunisia', flag: '🇹🇳' },
      { name: 'Ghana', flag: '🇬🇭' },
      { name: 'Nigeria', flag: '🇳🇬' },
      { name: 'Tanzania', flag: '🇹🇿' },
      { name: 'Uganda', flag: '🇺🇬' },
    ]
  },

  // Middle East
  {
    id: 'middle-east',
    name: 'Middle East',
    pricePerGB: 3.20,
    currency: 'USD',
    countryCount: 7,
    continent: 'Middle East',
    countries: [
      { name: 'United Arab Emirates', flag: '🇦🇪' },
      { name: 'Egypt', flag: '🇪🇬' },
      { name: 'Israel', flag: '🇮🇱' },
      { name: 'Jordan', flag: '🇯🇴' },
      { name: 'Qatar', flag: '🇶🇦' },
      { name: 'Saudi Arabia', flag: '🇸🇦' },
      { name: 'Turkey', flag: '🇹🇷' },
    ]
  },
]

// Group plans by continent
export const getPlansByContinent = () => {
  const grouped: Record<string, RegionalPlan[]> = {
    'Europe': [],
    'Asia': [],
    'America': [],
    'Africa': [],
    'Middle East': [],
  }

  regionalPlans.forEach(plan => {
    if (grouped[plan.continent]) {
      grouped[plan.continent].push(plan)
    }
  })

  // Return only continents that have plans
  return Object.fromEntries(
    Object.entries(grouped).filter(([_, plans]) => plans.length > 0)
  )
}

// Get plans by continent name
export const getPlansByContinentName = (continent: string) => {
  return regionalPlans.filter(plan => plan.continent === continent)
}

