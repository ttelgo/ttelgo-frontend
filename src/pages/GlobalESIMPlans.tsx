import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

// Country lists for each plan
const countries54 = [
  'Albania', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 'Bulgaria', 'China', 'Croatia',
  'Cyprus', 'Denmark', 'Estonia', 'Finland', 'France', 'French Guiana', 'Germany', 'Greece',
  'Guadeloupe', 'Guernsey', 'Hong Kong', 'Hungary', 'Iceland', 'Indonesia', 'Ireland', 'Isle of Man',
  'Israel', 'Italy', 'Jersey', 'Latvia', 'Luxembourg', 'Malaysia', 'Malta', 'Martinique', 'Monaco',
  'Netherlands', 'Norway', 'Philippines', 'Poland', 'Portugal', 'Romania', 'Saint Barthelemy',
  'Saint Martin (French)', 'Singapore', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'Switzerland',
  'Taiwan', 'Thailand', 'Turkey', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam'
]

const countries82 = [
  'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria', 'Bangladesh', 'Belgium', 'Brazil',
  'Bulgaria', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica', 'Croatia', 'Cyprus', 'Denmark',
  'Ecuador', 'El Salvador', 'Estonia', 'Finland', 'France', 'French Guiana', 'Germany', 'Greece',
  'Guadeloupe', 'Guernsey', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland',
  'Isle of Man', 'Israel', 'Italy', 'Japan', 'Jersey', 'Kazakhstan', 'Kuwait', 'Latvia', 'Luxembourg',
  'Malaysia', 'Malta', 'Martinique', 'Mexico', 'Monaco', 'Netherlands', 'New Zealand', 'Norway', 'Oman',
  'Peru', 'Philippines', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Romania', 'Saint Barthelemy',
  'Saint Martin (French)', 'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa',
  'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Thailand', 'Tunisia', 'Turkey',
  'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Vietnam'
]

const countries106 = [
  'Aaland Islands', 'Albania', 'Andorra', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Bolivia',
  'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia',
  'Costa Rica', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'El Salvador',
  'Estonia', 'Finland', 'France', 'Germany', 'Gibraltar', 'Greece', 'Guam', 'Guatemala', 'Guernsey',
  'Guyana', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man',
  'Israel', 'Italy', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Macao', 'Madagascar', 'Malaysia', 'Malta', 'Mauritius', 'Mexico', 'Moldova',
  'Montenegro', 'Morocco', 'Netherlands', 'New Zealand', 'Nicaragua', 'Nigeria', 'North Macedonia', 'Norway',
  'Oman', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Poland', 'Portugal', 'Qatar', 'Réunion', 'Romania',
  'Russian Federation', 'Saudi Arabia', 'Serbia', 'Seychelles', 'Singapore', 'Slovakia', 'Slovenia',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Tanzania',
  'Thailand', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vietnam', 'Zambia'
]

const countries112 = [
  'Aaland Islands', 'Albania', 'Andorra', 'Argentina', 'Australia', 'Austria', 'Belgium', 'Bolivia',
  'Bosnia and Herzegovina', 'Brazil', 'Bulgaria', 'Cameroon', 'Canada', 'Chile', 'China', 'Colombia',
  'Costa Rica', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'El Salvador',
  'Estonia', 'Finland', 'France', 'Germany', 'Gibraltar', 'Greece', 'Guam', 'Guatemala', 'Guernsey',
  'Guyana', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man',
  'Israel', 'Italy', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Latvia', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Macao', 'Madagascar', 'Malaysia', 'Malta', 'Mauritius', 'Mexico', 'Moldova',
  'Montenegro', 'Morocco', 'Netherlands', 'New Zealand', 'Nicaragua', 'Nigeria', 'North Macedonia', 'Norway',
  'Oman', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Poland', 'Portugal', 'Qatar', 'Réunion', 'Romania',
  'Russian Federation', 'Saudi Arabia', 'Serbia', 'Seychelles', 'Singapore', 'Slovakia', 'Slovenia',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Tanzania',
  'Thailand', 'Tunisia', 'Turkey', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom',
  'United States', 'Uruguay', 'Uzbekistan', 'Vietnam', 'Zambia'
]

// Plan configurations
const planConfigs = {
  54: {
    name: 'Global',
    countries: countries54,
    plans: [
      { data: '10GB', validity: '180 days', price: 30 },
      { data: '20GB', validity: '365 days', price: 50 },
      { data: '30GB', validity: '365 days', price: 65 },
      { data: '50GB', validity: '365 days', price: 125 },
    ],
    pricePerGB: 2.17,
  },
  82: {
    name: 'Global',
    countries: countries82,
    plans: [
      { data: '10GB', validity: '180 days', price: 35 },
      { data: '20GB', validity: '365 days', price: 60 },
      { data: '30GB', validity: '365 days', price: 80 },
      { data: '50GB', validity: '365 days', price: 150 },
    ],
    pricePerGB: 2.50,
  },
  106: {
    name: 'Global-EX',
    countries: countries106,
    plans: [
      { data: '1GB', validity: '7 days', price: 8 },
      { data: '3GB', validity: '30 days', price: 20 },
      { data: '5GB', validity: '30 days', price: 30 },
    ],
    pricePerGB: 7.20,
  },
  112: {
    name: 'Global-EX',
    countries: countries112,
    plans: [
      { data: '1GB', validity: '7 days', price: 9 },
      { data: '3GB', validity: '30 days', price: 22 },
      { data: '5GB', validity: '30 days', price: 35 },
    ],
    pricePerGB: 7.50,
  },
}

const GlobalESIMPlans = () => {
  const navigate = useNavigate()
  const [selectedPlanType, setSelectedPlanType] = useState<54 | 82 | 106 | 112>(54)
  const [selectedPlan, setSelectedPlan] = useState<number>(0)
  
  // Determine which plan group we're in (Global or Global-EX)
  const isGlobalEX = selectedPlanType === 106 || selectedPlanType === 112

  const currentConfig = planConfigs[selectedPlanType]
  const selectedPlanData = currentConfig.plans[selectedPlan]

  const handleCheckout = () => {
    const plan = {
      id: `${currentConfig.name.toLowerCase()}-${selectedPlanType}-${selectedPlanData.data}`,
      name: `${currentConfig.name} - ${selectedPlanType} Countries`,
      description: `${selectedPlanData.data} ${currentConfig.name} eSIM plan covering ${selectedPlanType} countries`,
      price: selectedPlanData.price,
      currency: 'USD',
      data: selectedPlanData.data,
      validity: selectedPlanData.validity,
      regions: [`${selectedPlanType} Countries`],
      features: [
        `${selectedPlanData.data} Data`,
        selectedPlanData.validity,
        `${selectedPlanType} Countries Coverage`,
        'High Speed',
        '24/7 Support'
      ],
      popular: false,
      countryCount: selectedPlanType,
    }
    navigate('/checkout', { state: { plan } })
  }

  return (
    <div className="w-full min-h-screen">
      {/* Breadcrumb */}
      <section className="bg-white py-4 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/shop?tab=global')}
            className="flex items-center gap-2 text-gray-600 hover:text-telgo-red transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Shop Plans
          </button>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Images */}
          <div className="lg:col-span-1 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              <img
                src="/IMAGES/Cities/Rome.jpg"
                alt="Rome, Italy"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/IMAGES/Cities/London.jpg'
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              <img
                src="/IMAGES/Cities/Paris.jpg"
                alt="Paris, France"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/IMAGES/Cities/Barcelona.jpg'
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              <img
                src="/IMAGES/Cities/Dubai.jpg"
                alt="Dubai, UAE"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/IMAGES/Cities/Singapore.jpg'
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              <img
                src="/IMAGES/Cities/London.jpg"
                alt="London, UK"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/IMAGES/Cities/Sydney.jpg'
                }}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-lg overflow-hidden shadow-md"
            >
              <img
                src="/IMAGES/Cities/NewYork.jpg"
                alt="New York, USA"
                className="w-full h-64 object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/IMAGES/Cities/London.jpg'
                }}
              />
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-purple-600"></div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{currentConfig.name}</h1>
                  <p className="text-gray-600">Travel eSIM</p>
                </div>
              </div>
              {/* Plan Group Selector */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPlanType(54)
                      setSelectedPlan(0)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      !isGlobalEX
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Global (54/82 Countries)
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlanType(106)
                      setSelectedPlan(0)
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isGlobalEX
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Global-EX (106/112 Countries)
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Plan Type Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6"
            >
              <div className="flex gap-2 border-b border-gray-200">
                {!isGlobalEX ? (
                  <>
                    <button
                      onClick={() => setSelectedPlanType(54)}
                      className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                        selectedPlanType === 54
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      54 Countries Plan
                    </button>
                    <button
                      onClick={() => setSelectedPlanType(82)}
                      className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                        selectedPlanType === 82
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      82 Countries Plan
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedPlanType(106)}
                      className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                        selectedPlanType === 106
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      106 Countries Plan
                    </button>
                    <button
                      onClick={() => setSelectedPlanType(112)}
                      className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                        selectedPlanType === 112
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      112 Countries Plan
                    </button>
                  </>
                )}
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <p className="text-gray-700">
                Explore {currentConfig.name} with flexibility using our eSIM data plans. Whether you're visiting for a short stay or an extended trip, our plans keep you connected without the hassle.
              </p>
            </motion.div>

            {/* Pricing Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Available Data Plans</h2>
              <div className="space-y-3">
                {currentConfig.plans.map((plan, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPlan(index)}
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedPlan === index
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPlan === index
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedPlan === index && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{plan.data}</div>
                        <div className="text-sm text-gray-600">For {plan.validity}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">USD {plan.price}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Checkout Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mb-8"
            >
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg"
              >
                Proceed to Checkout - USD {selectedPlanData.price}
              </button>
            </motion.div>

            {/* Coverage Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Coverage</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2">
                {currentConfig.countries.map((country, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    {country}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GlobalESIMPlans

