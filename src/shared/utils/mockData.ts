import { eSIMPlan, eSIMProfile, FAQ } from '@/shared/types'

// Mock eSIM Plans
export const mockPlans: eSIMPlan[] = [
  {
    id: '1',
    name: 'Global Basic',
    description: 'Perfect for light travelers',
    price: 9.99,
    currency: 'USD',
    data: '1GB',
    validity: '7 days',
    regions: ['Global'],
    features: ['1GB Data', '7 Days Validity', 'Global Coverage', '24/7 Support'],
  },
  {
    id: '2',
    name: 'Global Plus',
    description: 'Best value for frequent travelers',
    price: 19.99,
    currency: 'USD',
    data: '5GB',
    validity: '30 days',
    regions: ['Global'],
    features: ['5GB Data', '30 Days Validity', 'Global Coverage', 'High Speed', '24/7 Support'],
    popular: true,
  },
  {
    id: '3',
    name: 'Global Premium',
    description: 'Unlimited data for heavy users',
    price: 39.99,
    currency: 'USD',
    data: 'Unlimited',
    validity: '30 days',
    regions: ['Global'],
    features: ['Unlimited Data', '30 Days Validity', 'Global Coverage', 'Highest Speed', 'Priority Support', 'Hotspot Included'],
  },
  {
    id: '4',
    name: 'Regional Europe',
    description: 'Europe-specific plan',
    price: 14.99,
    currency: 'USD',
    data: '3GB',
    validity: '14 days',
    regions: ['Europe'],
    features: ['3GB Data', '14 Days Validity', 'Europe Coverage', 'High Speed'],
  },
  {
    id: '5',
    name: 'Regional Asia',
    description: 'Asia-Pacific coverage',
    price: 12.99,
    currency: 'USD',
    data: '3GB',
    validity: '14 days',
    regions: ['Asia'],
    features: ['3GB Data', '14 Days Validity', 'Asia Coverage', 'High Speed'],
  },
  {
    id: '6',
    name: 'Regional Americas',
    description: 'North & South America',
    price: 16.99,
    currency: 'USD',
    data: '4GB',
    validity: '14 days',
    regions: ['Americas'],
    features: ['4GB Data', '14 Days Validity', 'Americas Coverage', 'High Speed'],
  },
]

// Mock eSIM Profile
export const mockeSIMProfile: eSIMProfile = {
  id: 'esim-001',
  orderId: 'order-001',
  planId: 'plan-002',
  planName: 'Global Plus',
  status: 'active',
  dataRemaining: '3.2GB',
  dataTotal: '5GB',
  validity: '15 days remaining',
  qrCode: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5RUiBDb2RlPC90ZXh0Pjwvc3ZnPg==',
  activationDate: '2024-01-15',
  expirationDate: '2024-02-14',
}

// Mock FAQs
export const mockFAQs: FAQ[] = [
  {
    id: '1',
    category: 'Getting Started',
    question: 'What is an eSIM?',
    answer: 'An eSIM (embedded SIM) is a digital SIM card that allows you to activate a cellular plan from your carrier without having to use a physical SIM card. It\'s built into your device and can be activated remotely.',
  },
  {
    id: '2',
    category: 'Getting Started',
    question: 'Which devices support eSIM?',
    answer: 'Most modern smartphones support eSIM, including iPhone XS and newer, Google Pixel 3 and newer, Samsung Galaxy S20 and newer, and many other devices. Check your device specifications to confirm eSIM compatibility.',
  },
  {
    id: '3',
    category: 'Getting Started',
    question: 'How do I activate my eSIM?',
    answer: 'After purchasing a plan, you\'ll receive a QR code via email. Go to your device settings, select "Add Cellular Plan" or "Add Mobile Plan", scan the QR code, and follow the on-screen instructions.',
  },
  {
    id: '4',
    category: 'Billing',
    question: 'How does billing work?',
    answer: 'You can pay for your eSIM plan using credit card, debit card, or PayPal. All plans are prepaid, so you pay upfront before activation. Prices are displayed in USD, but we accept payments from most countries.',
  },
  {
    id: '5',
    category: 'Billing',
    question: 'Can I get a refund?',
    answer: 'Yes, we offer a 30-day money-back guarantee if you\'re not satisfied with our service. However, refunds are not available for activated plans that have been used. Contact our support team for refund requests.',
  },
  {
    id: '6',
    category: 'Usage',
    question: 'What happens when I run out of data?',
    answer: 'When you exhaust your data allowance, your internet connection will be paused. You can purchase additional data packs or upgrade to a higher plan through your account dashboard.',
  },
  {
    id: '7',
    category: 'Usage',
    question: 'Can I use my eSIM for hotspot/tethering?',
    answer: 'Yes, most of our plans support hotspot and tethering. Check your plan details to confirm. Premium plans include hotspot functionality by default.',
  },
  {
    id: '8',
    category: 'Technical',
    question: 'Why is my eSIM not working?',
    answer: 'Common issues include: device not eSIM compatible, incorrect installation, network settings not configured properly, or the plan hasn\'t been activated. Contact our support team for assistance.',
  },
  {
    id: '9',
    category: 'Technical',
    question: 'Can I use multiple eSIMs on one device?',
    answer: 'Yes, most modern devices support multiple eSIM profiles. You can store several eSIMs and switch between them as needed. However, you can typically only use one eSIM at a time (unless your device supports dual eSIM).',
  },
  {
    id: '10',
    category: 'Support',
    question: 'How can I contact support?',
    answer: 'You can contact our 24/7 support team via email at support@telgo.com, through our live chat on the website, or by submitting a ticket through your account dashboard. We typically respond within 24 hours.',
  },
]

// Mock user (for demonstration)
export const mockUser: { email: string; name: string } | null = null

