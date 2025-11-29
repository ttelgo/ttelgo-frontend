# 📍 Where to Test Actual APIs - Complete Guide

## 🎯 **Pages for Testing (Payment Handled by Backend)**

Since payment is automatically handled by your backend, here are the exact pages where you can test each API:

---

## **1. Shop Plans Page** - `/shop`
**What it does:** Browse all available bundles

**APIs to Test:**
- ✅ `GET /api/plans/bundles` - Get all bundles
- ✅ `GET /api/plans/bundles/country?countryIso={code}` - Get bundles by country

**Current Status:** Uses mock data
**To Test:** I'll update it to fetch from API

**Test Flow:**
1. Go to `/shop`
2. See real bundles from your backend
3. Click on country → Goes to `/country/{name}`
4. Click on global plan → Goes to `/global-esim`

---

## **2. Country Packages Page** - `/country/{countryName}`
**What it does:** Show bundles for a specific country

**APIs to Test:**
- ✅ `GET /api/plans/bundles/country?countryIso={code}` - Get bundles for country

**Current Status:** Uses mock data
**To Test:** I'll update it to fetch from API

**Test Flow:**
1. Navigate from `/shop` → Click country (e.g., Great Britain)
2. Goes to `/country/Great-Britain`
3. See real bundles for that country from API
4. Click "Buy Now" → Goes to `/checkout` with bundle data

---

## **3. Global eSIM Plans Page** - `/global-esim`
**What it does:** Show global/regional bundles

**APIs to Test:**
- ✅ `GET /api/plans/bundles` - Get all bundles (filter for global)

**Current Status:** Uses mock data, has checkout button
**To Test:** I'll update it to fetch from API

**Test Flow:**
1. Navigate from `/shop` → Click "Shop Now" on Global plans
2. Goes to `/global-esim`
3. See real global bundles from API
4. Click "Buy Now" → Goes to `/checkout` with bundle data

---

## **4. Checkout Page** - `/checkout`
**What it does:** Create order (payment handled by backend)

**APIs to Test:**
- ✅ `POST /api/esims/activate` - Create order automatically

**Current Status:** Has form but doesn't call API
**To Test:** I'll update it to create order on form submit

**Test Flow:**
1. Navigate from bundle page → `/checkout` (with bundle in state)
2. Fill form (email, name, etc.)
3. Click "Complete Purchase"
4. ✅ Order created via API (backend handles payment automatically)
5. ✅ Redirects to `/my-esim?orderId={orderId}`

---

## **5. My eSIM Dashboard** - `/my-esim`
**What it does:** Show QR code and order details

**APIs to Test:**
- ✅ `GET /api/esims/orders/{orderId}` - Get order details
- ✅ `GET /api/esims/qr/{esimId}` - Get QR code

**Current Status:** Shows placeholder, no API calls
**To Test:** I'll update it to fetch order and QR code

**Test Flow:**
1. Arrive from checkout → `/my-esim?orderId={orderId}`
2. ✅ Automatically fetches order details from API
3. ✅ Gets esimId from order
4. ✅ Fetches QR code using esimId
5. ✅ Displays QR code for eSIM activation

---

## 🔄 **Complete End-to-End Test Flow**

### **Test Scenario: Purchase eSIM for Great Britain**

1. **Start:** Go to `/shop`
   - ✅ Page loads bundles from API
   - See all available bundles

2. **Browse:** Click on "Great Britain" country
   - ✅ Navigate to `/country/Great-Britain`
   - ✅ Page loads GB bundles from API: `GET /api/plans/bundles/country?countryIso=GB`

3. **Select:** Click "Buy Now" on a bundle
   - ✅ Navigate to `/checkout` with bundle data

4. **Purchase:** Fill checkout form and click "Complete Purchase"
   - ✅ API call: `POST /api/esims/activate` with bundle ID
   - ✅ Backend creates order (payment handled automatically)
   - ✅ Returns: `{ orderId, esimId, ... }`
   - ✅ Redirect to `/my-esim?orderId={orderId}`

5. **Activate:** View QR code on My eSIM page
   - ✅ API call: `GET /api/esims/orders/{orderId}` - Get order details
   - ✅ Extract esimId from order
   - ✅ API call: `GET /api/esims/qr/{esimId}` - Get QR code
   - ✅ Display QR code for scanning

---

## 📝 **Pages I'll Update for You**

To enable full testing, I'll integrate APIs into:

1. ✅ **ShopPlans** (`/shop`) - Fetch bundles from API
2. ✅ **CountryPackages** (`/country/{name}`) - Fetch bundles by country
3. ✅ **GlobalESIMPlans** (`/global-esim`) - Fetch global bundles
4. ✅ **Checkout** (`/checkout`) - Create order on submit
5. ✅ **MyeSIM** (`/my-esim`) - Fetch and display QR code

---

## ✅ **After Integration, You Can Test:**

| Page | What You'll See | API Tested |
|------|----------------|------------|
| `/shop` | Real bundles from backend | `GET /api/plans/bundles` |
| `/country/Great-Britain` | GB bundles from backend | `GET /api/plans/bundles/country?countryIso=GB` |
| `/global-esim` | Global bundles from backend | `GET /api/plans/bundles` |
| `/checkout` | Form → Submit → Order created | `POST /api/esims/activate` |
| `/my-esim?orderId=xxx` | Real QR code from backend | `GET /api/esims/qr/{esimId}` |

---

## 🚀 **Ready to Integrate?**

I'll update these 5 pages to use your actual APIs. After that, you can test the complete flow:

**Browse → Select → Purchase → View QR Code**

All without any payment gateway - backend handles everything! 🎉

