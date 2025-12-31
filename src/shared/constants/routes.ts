/**
 * Application Routes
 * Centralized route definitions based on project scope
 */

export const ROUTES = {
  // Marketing routes
  HOME: '/',
  ABOUT: '/about',
  DOWNLOAD_APP: '/download',
  HOW_IT_WORKS: '/how-it-works',
  
  // Auth routes
  LOGIN: '/login',
  SIGNUP: '/signup',
  REGISTER: '/register',
  
  // Countries & Destinations
  COUNTRIES: '/countries',
  COUNTRY_DETAIL: (countryCode: string) => `/countries/${countryCode}`,
  
  // Plans & Pricing
  PLANS: '/plans',
  PLAN_DETAIL: (planId: string) => `/plans/${planId}`,
  GLOBAL_ESIM: '/global-esim',
  REGION: (regionName: string) => `/region/${regionName}`,
  COUNTRY_PACKAGES: (countryName: string) => `/country/${countryName}`,
  
  // Checkout
  CHECKOUT: '/checkout',
  
  // eSIM Management
  MY_ESIM: '/my-esim',
  ESIM_DETAIL: (esimId: string) => `/my-esim/${esimId}`,
  
  // Dashboard
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ORDERS: '/orders',
  INVOICES: '/invoices',
  
  // KYC
  KYC: '/kyc',
  KYC_UPLOAD: '/kyc/upload',
  
  // Support
  HELP: '/help',
  HELP_CENTER: '/help-center',
  CONTACT: '/contact',
  FAQ: '/faq',
  
  // Blog
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
} as const

