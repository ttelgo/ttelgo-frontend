# 🧪 End-to-End eSIM Purchase Testing Guide

## ✅ **What's Been Integrated**

I've replaced mock data with actual API calls in the critical pages for end-to-end testing:

### **1. Country Packages Page** (`/country/{countryName}`)
- ✅ **Fetches bundles from API** - `GET /api/plans/bundles/country?countryIso={code}`
- ✅ Shows real bundles from your backend
- ✅ Falls back to mock data if API fails
- ✅ Click bundle → Goes to checkout with bundle ID

### **2. Checkout Page** (`/checkout`)
- ✅ **Form remains unchanged** (no payment gateway integration)
- ✅ **Calls create order API** on form submit - `POST /api/esims/activate`
- ✅ Payment handled automatically by backend
- ✅ Redirects to `/my-esim?orderId={orderId}` after success

### **3. My eSIM Dashboard** (`/my-esim`)
- ✅ **Fetches order details** - `GET /api/esims/orders/{orderId}`
- ✅ **Fetches QR code** - `GET /api/esims/qr/{esimId}`
- ✅ Displays QR code for eSIM activation
- ✅ Shows order information

---

## 🚀 **Complete Test Flow**

### **Step 1: Set Environment Variable**

Create `.env` file in project root:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### **Step 2: Start Your Backend**

Make sure Spring Boot backend is running on `http://localhost:8080`

### **Step 3: Test End-to-End Purchase**

#### **Option A: Test via Country Page (Recommended)**

1. **Go to Shop Plans**
   - Navigate to: `http://localhost:5173/shop`
   - Click on a country (e.g., "Great Britain")

2. **View Country Bundles**
   - Navigate to: `http://localhost:5173/country/Great-Britain`
   - ✅ Page automatically fetches bundles from API: `GET /api/plans/bundles/country?countryIso=GB`
   - You'll see real bundles from your backend
   - If no bundles found, shows fallback mock plans

3. **Select Bundle**
   - Click on any bundle (from API or mock)
   - Navigate to: `/checkout` with bundle data

4. **Complete Checkout**
   - Fill in the form (email, name, billing address, etc.)
   - **Payment form fields are kept as-is** (no payment gateway)
   - Click "Complete Purchase" button
   - ✅ API call: `POST /api/esims/activate` with bundle ID
   - ✅ Backend creates order automatically (payment handled by backend)
   - ✅ Shows success message
   - ✅ Redirects to: `/my-esim?orderId={orderId}`

5. **View QR Code**
   - On `/my-esim` page
   - ✅ Automatically fetches order details: `GET /api/esims/orders/{orderId}`
   - ✅ Gets esimId from order
   - ✅ Fetches QR code: `GET /api/esims/qr/{esimId}`
   - ✅ Displays QR code for scanning

#### **Option B: Test via Global Plans**

1. Go to `/shop` → Click "Shop Now" on Global plans
2. Goes to `/global-esim`
3. Select plan → Click "Buy Now"
4. Goes to `/checkout` → Fill form → Submit
5. Order created → Redirects to `/my-esim` with QR code

---

## 📋 **What Happens at Each Step**

### **Country Packages Page** (`/country/{countryName}`)
```
1. Page loads
2. Extracts country name from URL
3. Maps country name to ISO code (e.g., "Great Britain" → "GB")
4. API Call: GET /api/plans/bundles/country?countryIso=GB
5. Displays bundles from API
6. If API fails → Shows fallback mock plans
7. User clicks bundle → Navigate to /checkout with bundle data
```

### **Checkout Page** (`/checkout`)
```
1. Receives plan/bundle data from previous page
2. User fills form (email, name, address, etc.)
3. User clicks "Complete Purchase"
4. Validates form fields
5. API Call: POST /api/esims/activate
   Body: {
     type: "transaction",
     assign: true,
     order: [{
       type: "bundle",
       item: "bundle-id-from-api",
       quantity: 1,
       allowReassign: false
     }]
   }
6. Backend creates order (payment handled automatically)
7. Returns: { orderId, esimId, qrCode, ... }
8. Shows success message
9. Redirects to: /my-esim?orderId={orderId}
```

### **My eSIM Page** (`/my-esim?orderId={orderId}`)
```
1. Extracts orderId from URL query parameter
2. API Call: GET /api/esims/orders/{orderId}
   Returns: { id, orderId, esimId, status, ... }
3. If esimId exists:
   API Call: GET /api/esims/qr/{esimId}
   Returns: { qrCode: "base64-or-url" }
4. Displays:
   - Order details (ID, status)
   - QR code image for scanning
   - Activation instructions
```

---

## 🎯 **Test Checklist**

- [ ] Backend is running on `http://localhost:8080`
- [ ] `.env` file created with `VITE_API_BASE_URL`
- [ ] Navigate to `/shop` → Click country
- [ ] Country page loads bundles from API
- [ ] Click bundle → Goes to checkout
- [ ] Fill checkout form → Click "Complete Purchase"
- [ ] Order created successfully
- [ ] Redirects to `/my-esim?orderId=xxx`
- [ ] QR code displays correctly
- [ ] Order details show correctly

---

## 🐛 **Troubleshooting**

### **No Bundles Showing on Country Page**
- Check browser console for API errors
- Verify country ISO code mapping in `countryIsoMap.ts`
- Check backend is returning bundles for that country
- Page will show fallback mock plans if API fails

### **Order Creation Fails**
- Check browser console for error message
- Verify bundle ID is correct (should be from API)
- Check backend logs for activation errors
- Ensure backend has eSIMGo token configured

### **QR Code Not Showing**
- Check if order has `esimId` in response
- Verify QR code API endpoint is working
- Check browser console for errors
- QR code might take a moment to generate

---

## 📝 **Important Notes**

1. **Payment Form**: The checkout form fields remain as-is. They're not connected to any payment gateway. The backend handles payment automatically.

2. **Bundle ID**: The system uses:
   - `bundleId` from API bundles (preferred)
   - `plan.id` as fallback

3. **Country ISO Mapping**: Currently mapped for common countries. Add more in `src/modules/countries/utils/countryIsoMap.ts` if needed.

4. **Error Handling**: All API calls have error handling. If API fails, pages show fallback data or error messages.

---

## ✅ **Ready to Test!**

**Start your backend and test the complete flow:**

1. `/shop` → Select country
2. `/country/{name}` → See bundles from API
3. Click bundle → `/checkout`
4. Fill form → Submit → Order created
5. `/my-esim?orderId=xxx` → See QR code

**All API calls are integrated and ready!** 🚀

