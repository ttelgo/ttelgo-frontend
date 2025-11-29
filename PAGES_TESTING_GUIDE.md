# 📄 Pages Testing Guide - Where to Test Each API

## 🎯 **Available Pages for Testing**

Based on your routes, here are the pages you can use to test the backend APIs:

---

## 1. **Shop Plans Page** (`/shop`)
**Route:** `http://localhost:5173/shop`

### **APIs to Test:**
- ✅ `GET /api/plans/bundles` - Get all bundles
- ✅ `GET /api/plans/bundles/country?countryIso={code}` - Get bundles by country
- ✅ `GET /api/plans/bundles/{bundleId}` - Get bundle details

### **How to Test:**

**Option A: Browser Console**
1. Navigate to `/shop`
2. Open browser console (F12)
3. Run:
```javascript
// Import service
const { plansService } = await import('/src/modules/plans/services/plans.service.ts')

// Test 1: Get all bundles
const bundles = await plansService.getBundles()
console.log('All bundles:', bundles)

// Test 2: Get bundles by country (GB)
const gbBundles = await plansService.getBundlesByCountry('GB')
console.log('GB bundles:', gbBundles)

// Test 3: Get specific bundle
const bundle = await plansService.getBundleById('esim_3GB_30D_GB_V2')
console.log('Bundle details:', bundle)
```

**Option B: Update Component**
- Currently uses mock data
- Replace with API calls (see integration example below)

---

## 2. **Checkout Page** (`/checkout`)
**Route:** `http://localhost:5173/checkout`

### **APIs to Test:**
- ✅ `POST /api/esims/activate` - Create order (activate bundle)

### **How to Test:**

**Option A: Browser Console**
1. Navigate to `/checkout`
2. Open browser console (F12)
3. Run:
```javascript
// Import service
const { checkoutService } = await import('/src/modules/checkout/services/checkout.service.ts')

// Test: Create order
const order = await checkoutService.createOrder({
  bundleId: 'esim_1GB_7D_GB_V2', // Use actual bundle ID from your backend
  quantity: 1,
  assign: true,
  allowReassign: false
})
console.log('Order created:', order)
// Save orderId and esimId for next steps!
```

**Option B: Update Component**
- Currently has mock checkout flow
- Replace with `checkoutService.createOrder()`

---

## 3. **My eSIM Dashboard** (`/my-esim`)
**Route:** `http://localhost:5173/my-esim`

### **APIs to Test:**
- ✅ `GET /api/esims/qr/{esimId}` - Get QR code
- ✅ `GET /api/esims/orders/{orderId}` - Get order details

### **How to Test:**

**Option A: Browser Console**
1. Navigate to `/my-esim`
2. Open browser console (F12)
3. Run (use orderId and esimId from checkout):
```javascript
// Import service
const { esimService } = await import('/src/modules/esim/services/esim.service.ts')

// Test 1: Get order details
const orderId = 'your-order-id-from-checkout'
const orderDetails = await esimService.getOrderDetails(orderId)
console.log('Order details:', orderDetails)

// Test 2: Get QR code
const esimId = 'your-esim-id-from-checkout'
const { qrCode } = await esimService.getQRCode(esimId)
console.log('QR Code:', qrCode)
// Display QR code in component
```

**Option B: Update Component**
- Currently shows placeholder QR code
- Replace with API calls to fetch real QR code

---

## 4. **Home Page** (`/`)
**Route:** `http://localhost:5173/`

### **APIs to Test:**
- ✅ `GET /api/plans/bundles` - Get popular bundles for homepage

### **How to Test:**
- Browser console (same as Shop Plans)
- Or update Home component to fetch bundles

---

## 5. **Country Packages Page** (`/country/{countryName}`)
**Route:** `http://localhost:5173/country/Great-Britain`

### **APIs to Test:**
- ✅ `GET /api/plans/bundles/country?countryIso={code}` - Get bundles for specific country

### **How to Test:**
- Browser console:
```javascript
const { plansService } = await import('/src/modules/plans/services/plans.service.ts')
const bundles = await plansService.getBundlesByCountry('GB')
console.log('Country bundles:', bundles)
```

---

## 6. **Global eSIM Plans Page** (`/global-esim`)
**Route:** `http://localhost:5173/global-esim`

### **APIs to Test:**
- ✅ `GET /api/plans/bundles` - Get global bundles

### **How to Test:**
- Browser console (same as Shop Plans)

---

## 🧪 **Complete Testing Flow**

### **Step-by-Step Full Flow Test:**

1. **Start Backend**
   ```bash
   # Make sure Spring Boot is running on http://localhost:8080
   ```

2. **Set Environment Variable**
   Create `.env` file:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Test Flow:**

   **Step 1: Browse Bundles**
   - Go to `/shop`
   - Open console, run:
     ```javascript
     const { plansService } = await import('/src/modules/plans/services/plans.service.ts')
     const bundles = await plansService.getBundles()
     console.log('Bundles:', bundles)
     ```
   - ✅ Should see list of bundles

   **Step 2: View Bundle Details**
   - In console, run:
     ```javascript
     const bundle = await plansService.getBundleById('esim_3GB_30D_GB_V2')
     console.log('Bundle:', bundle)
     ```
   - ✅ Should see bundle details

   **Step 3: Create Order (Purchase)**
   - Go to `/checkout` (or stay on `/shop`)
   - In console, run:
     ```javascript
     const { checkoutService } = await import('/src/modules/checkout/services/checkout.service.ts')
     const order = await checkoutService.createOrder({
       bundleId: 'esim_1GB_7D_GB_V2', // Use actual bundle ID
       quantity: 1,
       assign: true,
       allowReassign: false
     })
     console.log('Order:', order)
     // IMPORTANT: Save order.orderId and order.esimId!
     ```
   - ✅ Should create order and return orderId/esimId

   **Step 4: View QR Code**
   - Go to `/my-esim`
   - In console, run (use esimId from step 3):
     ```javascript
     const { esimService } = await import('/src/modules/esim/services/esim.service.ts')
     const esimId = 'your-esim-id-from-step-3'
     const { qrCode } = await esimService.getQRCode(esimId)
     console.log('QR Code:', qrCode)
     ```
   - ✅ Should return QR code

   **Step 5: Check Order Status**
   - In console, run (use orderId from step 3):
     ```javascript
     const orderId = 'your-order-id-from-step-3'
     const orderDetails = await esimService.getOrderDetails(orderId)
     console.log('Order Details:', orderDetails)
     ```
   - ✅ Should return order information

---

## 📝 **Quick Test Commands (Copy & Paste)**

### **All in One Console Test:**
```javascript
// Run this in browser console on any page
(async () => {
  // Import services
  const { plansService } = await import('/src/modules/plans/services/plans.service.ts')
  const { checkoutService } = await import('/src/modules/checkout/services/checkout.service.ts')
  const { esimService } = await import('/src/modules/esim/services/esim.service.ts')

  console.log('=== Testing Backend APIs ===\n')

  // Test 1: Get bundles
  console.log('1. Getting all bundles...')
  const bundles = await plansService.getBundles()
  console.log('✅ Bundles:', bundles)

  // Test 2: Get bundles by country
  console.log('\n2. Getting GB bundles...')
  const gbBundles = await plansService.getBundlesByCountry('GB')
  console.log('✅ GB Bundles:', gbBundles)

  // Test 3: Get bundle details
  if (bundles.length > 0) {
    console.log('\n3. Getting bundle details...')
    const bundle = await plansService.getBundleById(bundles[0].id)
    console.log('✅ Bundle Details:', bundle)

    // Test 4: Create order
    console.log('\n4. Creating order...')
    const order = await checkoutService.createOrder({
      bundleId: bundles[0].id,
      quantity: 1,
      assign: true,
      allowReassign: false
    })
    console.log('✅ Order Created:', order)

    // Test 5: Get QR code (if esimId exists)
    if (order.esimId) {
      console.log('\n5. Getting QR code...')
      const { qrCode } = await esimService.getQRCode(order.esimId)
      console.log('✅ QR Code:', qrCode)
    }

    // Test 6: Get order details (if orderId exists)
    if (order.orderId) {
      console.log('\n6. Getting order details...')
      const orderDetails = await esimService.getOrderDetails(order.orderId)
      console.log('✅ Order Details:', orderDetails)
    }
  }

  console.log('\n=== Testing Complete ===')
})()
```

---

## 🎯 **Recommended Testing Order**

1. **Start with `/shop`** - Test bundle listing
2. **Then `/checkout`** - Test order creation
3. **Finally `/my-esim`** - Test QR code and order details

---

## ✅ **Summary**

| Page | Route | APIs to Test |
|------|-------|--------------|
| **Shop Plans** | `/shop` | Get bundles, Get bundles by country, Get bundle details |
| **Checkout** | `/checkout` | Create order (activate bundle) |
| **My eSIM** | `/my-esim` | Get QR code, Get order details |
| **Home** | `/` | Get bundles (popular) |
| **Country Packages** | `/country/{name}` | Get bundles by country |
| **Global eSIM** | `/global-esim` | Get all bundles |

**All pages are ready for testing! Use browser console on any page to test the APIs.** 🚀

