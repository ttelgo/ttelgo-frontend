# 🔌 Backend API Integration Guide

## ✅ **Integrated APIs**

Based on your working backend, I've updated the service files to match your actual endpoints:

### **1. Plans/Bundles APIs**

| Endpoint | Method | Service Method | Description |
|----------|--------|---------------|-------------|
| `/api/plans/bundles` | GET | `plansService.getBundles()` | Get all bundles |
| `/api/plans/bundles/country?countryIso={code}` | GET | `plansService.getBundlesByCountry(countryIso)` | Get bundles by country |
| `/api/plans/bundles/{bundleId}` | GET | `plansService.getBundleById(bundleId)` | Get bundle details |

### **2. eSIM Activation APIs**

| Endpoint | Method | Service Method | Description |
|----------|--------|---------------|-------------|
| `/api/esims/activate` | POST | `esimService.activateBundle(data)` | Activate bundle (create order) |
| `/api/esims/qr/{esimId}` | GET | `esimService.getQRCode(esimId)` | Get QR code |
| `/api/esims/orders/{orderId}` | GET | `esimService.getOrderDetails(orderId)` | Get order details |

---

## 📝 **Request/Response Examples**

### **Activate Bundle (Create Order)**
```typescript
// Request
const request = {
  type: "transaction",
  assign: true,
  order: [
    {
      type: "bundle",
      item: "esim_1GB_7D_GB_V2",
      quantity: 1,
      allowReassign: false
    }
  ]
}

// Usage
const response = await esimService.activateBundle(request)
// Returns: { esimId, orderId, qrCode, ... }
```

### **Get Bundles by Country**
```typescript
// Usage
const bundles = await plansService.getBundlesByCountry('GB')
// Returns: Array of bundles for Great Britain
```

### **Get QR Code**
```typescript
// Usage
const { qrCode } = await esimService.getQRCode('esim-id-here')
// Returns: { qrCode: "base64 or url" }
```

---

## 🧪 **Testing Instructions**

### **1. Set Environment Variable**

Create `.env` file in project root:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### **2. Test Plans Service**

```typescript
import { plansService } from '@/modules/plans/services/plans.service'

// Test: Get all bundles
const bundles = await plansService.getBundles()
console.log('All bundles:', bundles)

// Test: Get bundles by country
const gbBundles = await plansService.getBundlesByCountry('GB')
console.log('GB bundles:', gbBundles)

// Test: Get bundle details
const bundle = await plansService.getBundleById('esim_3GB_30D_GB_V2')
console.log('Bundle details:', bundle)
```

### **3. Test Checkout/Order Creation**

```typescript
import { checkoutService } from '@/modules/checkout/services/checkout.service'

// Test: Create order
const order = await checkoutService.createOrder({
  bundleId: 'esim_1GB_7D_GB_V2',
  quantity: 1,
  assign: true,
  allowReassign: false
})
console.log('Order created:', order)
// Save orderId and esimId for next steps
```

### **4. Test eSIM Service**

```typescript
import { esimService } from '@/modules/esim/services/esim.service'

// Test: Get QR code (use esimId from order creation)
const { qrCode } = await esimService.getQRCode('esim-id-from-order')
console.log('QR Code:', qrCode)

// Test: Get order details (use orderId from order creation)
const orderDetails = await esimService.getOrderDetails('order-id-from-order')
console.log('Order details:', orderDetails)
```

---

## 🔄 **Next Steps: Integrate into Components**

### **Update ShopPlans Component**

Replace mock data with API call:
```typescript
import { plansService } from '@/modules/plans/services/plans.service'
import { useState, useEffect } from 'react'

const ShopPlans = () => {
  const [bundles, setBundles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const data = await plansService.getBundles()
        setBundles(data)
      } catch (error) {
        console.error('Failed to fetch bundles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBundles()
  }, [])

  // ... rest of component
}
```

### **Update Checkout Component**

Use checkout service:
```typescript
import { checkoutService } from '@/modules/checkout/services/checkout.service'

const handleCheckout = async () => {
  try {
    const order = await checkoutService.createOrder({
      bundleId: selectedBundle.id,
      quantity: 1,
    })
    
    // Redirect to success page or show QR code
    navigate(`/my-esim?orderId=${order.orderId}`)
  } catch (error) {
    console.error('Checkout failed:', error)
  }
}
```

### **Update MyeSIM Component**

Fetch and display QR code:
```typescript
import { esimService } from '@/modules/esim/services/esim.service'
import { useSearchParams } from 'react-router-dom'

const MyeSIM = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [qrCode, setQrCode] = useState('')

  useEffect(() => {
    const fetchQR = async () => {
      if (orderId) {
        const order = await esimService.getOrderDetails(orderId)
        if (order.esimId) {
          const { qrCode } = await esimService.getQRCode(order.esimId)
          setQrCode(qrCode)
        }
      }
    }
    fetchQR()
  }, [orderId])

  // ... display QR code
}
```

---

## ✅ **Ready to Test!**

1. ✅ Service files updated to match your backend
2. ✅ All endpoints configured correctly
3. ✅ Request/response types defined
4. ⏳ Ready for component integration

**Start testing by calling the service methods in your components!** 🚀

