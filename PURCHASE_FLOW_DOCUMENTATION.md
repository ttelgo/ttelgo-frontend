# 🛒 eSIM Purchase Flow Documentation

## ✅ Complete Purchase Flow

### **Step 1: Select Bundle**
- User navigates to `/country/{countryName}` (e.g., `/country/United-Kingdom`)
- Page fetches bundles from API: `GET /api/plans/bundles/country?countryIso=GB`
- User clicks on a bundle → Navigates to `/checkout`

### **Step 2: Checkout Page**
- User fills in billing information (email, name, address, etc.)
- Payment form fields are kept for UI purposes (payment handled automatically by backend)
- **Button Text**: "Complete Purchase - $X.XX"
- **Info Message**: "Payment will be processed automatically from your eSIMGo account"

### **Step 3: Activate Bundle (Create Order)**
When user clicks "Complete Purchase", the frontend calls:

**API Endpoint:** `POST /api/esims/activate`

**Request Format:**
```json
{
  "type": "transaction",
  "assign": true,
  "order": [
    {
      "type": "bundle",
      "item": "esim_1GB_7D_GB_V2",  // Bundle name from API
      "quantity": 1,
      "allowReassign": false
    }
  ]
}
```

**Response Format:**
```json
{
  "orderId": "2bda1476-a32d-4ad2-8a11-b975b6437fc3",  // Order reference
  "esimId": "2bda1476-a32d-4ad2-8a11-b975b6437fc3",  // eSIM ID (may be same as orderId)
  "qrCode": "...",  // Optional: QR code if available immediately
  ...
}
```

### **Step 4: Redirect to My eSIM**
After successful order creation:
- Redirects to: `/my-esim?orderId={orderId}&esimId={esimId}`
- Shows success message
- Automatically fetches QR code

### **Step 5: Get QR Code**
The My eSIM page automatically fetches the QR code:

**API Endpoint:** `GET /api/esims/qr/{esimId}`

**Example:**
```
GET /api/esims/qr/2bda1476-a32d-4ad2-8a11-b975b6437fc3
```

**Response Format:**
```json
{
  "qrCode": "data:image/png;base64,..."  // QR code image (base64 or URL)
}
```

## 📋 Implementation Details

### **Checkout Service** (`src/modules/checkout/services/checkout.service.ts`)
- `createOrder()` method formats the request correctly
- Uses `bundleId` (bundle name from API) as the `item` field
- Returns `orderId` and `esimId` from response

### **eSIM Service** (`src/modules/esim/services/esim.service.ts`)
- `activateBundle()` - Calls `/api/esims/activate`
- `getQRCode(esimId)` - Calls `/api/esims/qr/{esimId}`
- `getOrderDetails(orderId)` - Calls `/api/esims/orders/{orderId}`

### **My eSIM Page** (`src/modules/dashboard/pages/MyeSIM.tsx`)
- Automatically fetches order details when `orderId` is in URL
- Extracts `esimId` from order response
- Fetches QR code using `esimId`
- Shows "Refresh QR Code" button if QR code not available
- Displays order details and QR code

## 🔄 Flow Diagram

```
User selects bundle
    ↓
/checkout page
    ↓
User fills form → Clicks "Complete Purchase"
    ↓
POST /api/esims/activate
{
  type: "transaction",
  assign: true,
  order: [{
    type: "bundle",
    item: "esim_1GB_7D_GB_V2",  // Bundle name
    quantity: 1,
    allowReassign: false
  }]
}
    ↓
Response: { orderId, esimId, ... }
    ↓
Redirect to /my-esim?orderId={orderId}&esimId={esimId}
    ↓
GET /api/esims/qr/{esimId}
    ↓
Display QR Code
```

## ✅ Key Points

1. **Bundle ID**: Uses bundle `name` from API (e.g., "esim_1GB_7D_GB_V2") as the `item` field
2. **Payment**: Handled automatically by backend (eSIMGo account)
3. **Order ID**: Returned from activation endpoint
4. **eSIM ID**: May be same as orderId or separate field
5. **QR Code**: Fetched using eSIM ID after order creation
6. **Error Handling**: Graceful fallbacks if QR code not immediately available

## 🧪 Testing Checklist

- [ ] Select bundle from country page
- [ ] Navigate to checkout
- [ ] Fill billing information
- [ ] Click "Complete Purchase"
- [ ] Verify API call to `/api/esims/activate` with correct format
- [ ] Verify redirect to `/my-esim` with orderId and esimId
- [ ] Verify QR code is fetched from `/api/esims/qr/{esimId}`
- [ ] Verify QR code displays correctly
- [ ] Test "Refresh QR Code" button if QR not available

## 📝 Notes

- The `item` field in the activation request must be the exact bundle name from the API (e.g., "esim_1GB_7D_GB_V2")
- The backend handles payment automatically, so no payment gateway integration is needed
- QR code may take a moment to generate, so the page includes a refresh button
- Order ID and eSIM ID may be the same value depending on backend implementation

