# 🧪 API Testing Pages - Where to Test Each API

## 📍 **Pages for Testing Actual APIs**

Since payment is handled automatically by backend, here are the pages you can use to test:

---

## 1. **Shop Plans Page** (`/shop`)
**Test APIs:**
- ✅ `GET /api/plans/bundles` - Get all bundles
- ✅ `GET /api/plans/bundles/country?countryIso={code}` - Get bundles by country
- ✅ `GET /api/plans/bundles/{bundleId}` - Get bundle details

**What to test:**
- Browse all available bundles
- View bundle details
- Click "Buy Now" to go to checkout

---

## 2. **Country Packages Page** (`/country/{countryName}`)
**Test APIs:**
- ✅ `GET /api/plans/bundles/country?countryIso={code}` - Get bundles for specific country

**What to test:**
- Navigate from Shop Plans → Select country → See country-specific bundles
- Purchase bundle for that country

---

## 3. **Checkout Page** (`/checkout`)
**Test APIs:**
- ✅ `POST /api/esims/activate` - Create order (payment handled by backend automatically)

**What to test:**
- Select bundle → Go to checkout
- Fill form → Click "Complete Purchase"
- Order created automatically (no payment gateway needed)
- Redirects to My eSIM with orderId

---

## 4. **My eSIM Dashboard** (`/my-esim`)
**Test APIs:**
- ✅ `GET /api/esims/orders/{orderId}` - Get order details
- ✅ `GET /api/esims/qr/{esimId}` - Get QR code

**What to test:**
- View order details
- Display QR code for eSIM activation
- See eSIM status

---

## 🔄 **Complete Testing Flow**

### **Step 1: Browse Bundles**
1. Go to `/shop`
2. Page loads bundles from API automatically
3. ✅ See real bundles from your backend

### **Step 2: View Bundle Details**
1. Click on any bundle in `/shop`
2. ✅ See bundle details from API

### **Step 3: Purchase (Create Order)**
1. Click "Buy Now" on any bundle
2. Go to `/checkout`
3. Fill in form (email, name, etc.)
4. Click "Complete Purchase"
5. ✅ Order created automatically (backend handles payment)
6. ✅ Redirects to `/my-esim?orderId={orderId}`

### **Step 4: View QR Code**
1. On `/my-esim` page
2. ✅ Automatically fetches order details
3. ✅ Displays QR code for eSIM activation
4. ✅ Shows order status

---

## 📝 **Pages I'll Update for You**

I'll integrate the APIs into these pages so you can test the full flow:

1. ✅ **ShopPlans** - Fetch and display bundles from API
2. ✅ **CountryPackages** - Fetch bundles by country
3. ✅ **Checkout** - Create order (no payment gateway)
4. ✅ **MyeSIM** - Display QR code and order details

**After I update them, you can test the complete flow end-to-end!** 🚀

