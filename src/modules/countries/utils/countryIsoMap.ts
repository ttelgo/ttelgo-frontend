/**
 * Country Name to ISO Code Mapping
 * Used for API calls to get bundles by country
 */

/**
 * Country Name to ISO Code Mapping
 * Maps country names to ISO 3166-1 alpha-2 codes for API calls
 */
export const countryIsoMap: Record<string, string> = {
  // Top Destinations
  'United States': 'US',
  'United Kingdom': 'GB',
  'Great Britain': 'GB',
  'Japan': 'JP',
  'France': 'FR',
  'Germany': 'DE',
  'Canada': 'CA',
  'Australia': 'AU',
  'Singapore': 'SG',
  
  // Europe
  'Italy': 'IT',
  'Spain': 'ES',
  'Netherlands': 'NL',
  'Belgium': 'BE',
  'Switzerland': 'CH',
  'Austria': 'AT',
  'Sweden': 'SE',
  'Norway': 'NO',
  'Denmark': 'DK',
  'Finland': 'FI',
  'Poland': 'PL',
  'Portugal': 'PT',
  'Greece': 'GR',
  'Ireland': 'IE',
  'Croatia': 'HR',
  'Czech Republic': 'CZ',
  'Hungary': 'HU',
  'Romania': 'RO',
  'Bulgaria': 'BG',
  
  // Asia
  'China': 'CN',
  'India': 'IN',
  'South Korea': 'KR',
  'Thailand': 'TH',
  'Malaysia': 'MY',
  'Indonesia': 'ID',
  'Philippines': 'PH',
  'Vietnam': 'VN',
  'Taiwan': 'TW',
  'Hong Kong': 'HK',
  
  // Middle East
  'United Arab Emirates': 'AE',
  'Saudi Arabia': 'SA',
  'Turkey': 'TR',
  'Israel': 'IL',
  'Qatar': 'QA',
  'Kuwait': 'KW',
  'Oman': 'OM',
  
  // Americas
  'Mexico': 'MX',
  'Brazil': 'BR',
  'Argentina': 'AR',
  'Chile': 'CL',
  'Colombia': 'CO',
  'Peru': 'PE',
  
  // Africa
  'South Africa': 'ZA',
  'Egypt': 'EG',
  'Morocco': 'MA',
  'Kenya': 'KE',
  'Nigeria': 'NG',
  
  // Oceania
  'New Zealand': 'NZ',
  
  // Additional countries from API
  'Aland Islands': 'AX',
  'Aaland Islands': 'AX', // Alternative spelling
  'Albania': 'AL',
  'Andorra': 'AD',
  'Anguilla': 'AI',
  'Antigua and Barbuda': 'AG',
  'Armenia': 'AM',
  'Aruba': 'AW',
  'Azerbaijan': 'AZ',
  'Bahamas': 'BS',
  'Bahrain': 'BH',
  'Bangladesh': 'BD',
  'Barbados': 'BB',
  'Belarus': 'BY',
  'Benin': 'BJ',
  'Bermuda': 'BM',
  'Bolivia': 'BO',
  'Bonaire, Sint Eustatius And Saba': 'BQ',
  'Bosnia and Herzegovina': 'BA',
  'Botswana': 'BW',
  'Brunei Darussalam': 'BN',
  'Brunei': 'BN',
  'Burkina Faso': 'BF',
  'Cameroon': 'CM',
  'Cape Verde': 'CV',
  'Central African Republic': 'CF',
  'Congo': 'CG',
  'Congo, the Democratic Republic of the': 'CD',
  'Democratic Republic of the Congo': 'CD',
  'Costa Rica': 'CR',
  'Cote d\'Ivoire': 'CI',
  'Ivory Coast': 'CI',
  'Cuba': 'CU',
  'Curacao': 'CW',
  'Cyprus': 'CY',
  'Northern Cyprus': 'CYP',
  'Dominica': 'DM',
  
  // Add more as needed - check your backend for available country codes
}

/**
 * Get ISO code from country name
 */
export const getCountryIso = (countryName: string): string | null => {
  return countryIsoMap[countryName] || null
}

