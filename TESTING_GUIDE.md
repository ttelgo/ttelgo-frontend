# 🧪 Testing Guide - Backend API Integration

## ✅ **Service Files Updated**

All service files have been updated to match your working backend APIs:

1. ✅ **Plans Service** - `/api/plans/bundles` endpoints
2. ✅ **eSIM Service** - `/api/esims/activate`, `/api/esims/qr`, `/api/esims/orders`
3. ✅ **Checkout Service** - Uses eSIM activation for order creation
4. ✅ **Dashboard Service** - Uses eSIM and order endpoints

---

## 🚀 **Quick Test Steps**

### **Step 1: Set Environment Variable**

Create `.env` file in project root:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

### **Step 2: Start Your Backend**

Make sure your Spring Boot backend is running on `http://localhost:8080`

### **Step 3: Test in Browser Console**

Open your app in browser and test in console:

```javascript
// Test 1: Get all bundles
import { plansService } from '@/modules/plans/services/plans.service'
const bundles = await plansService.getBundles()
console.log('All bundles:', bundles)

// Test 2: Get bundles by country
const gbBundles = await plansService.getBundlesByCountry('GB')
console.log('GB bundles:', gbBundles)

// Test 3: Get bundle details
const bundle = await plansService.getBundleById('esim_3GB_30D_GB_V2')
console.log('Bundle details:', bundle)

// Test 4: Create order (activate bundle)
import { checkoutService } from '@/modules/checkout/services/checkout.service'
const order = await checkoutService.createOrder({
  bundleId: 'esim_1GB_7D_GB_V2',
  quantity: 1,
  assign: true,
  allowReassign: false
})
console.log('Order created:', order)
// Save the orderId and esimId from response

// Test 5: Get QR code (use esimId from step 4)
import { esimService } from '@/modules/esim/services/esim.service'
const { qrCode } = await esimService.getQRCode('your-esim-id-here')
console.log('QR Code:', qrCode)

// Test 6: Get order details (use orderId from step 4)
const orderDetails = await esimService.getOrderDetails('your-order-id-here')
console.log('Order details:', orderDetails)
```

---

## 📝 **Integration Examples**

### **Example 1: Update ShopPlans Page**

```typescript
// src/modules/plans/pages/ShopPlans.tsx
import { useState, useEffect } from 'react'
import { plansService, type Bundle } from '../services/plans.service'

const ShopPlans = () => {
  const [bundles, setBundles] = useState<Bundle[]>([])
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

  // Use bundles instead of mock data
  // ...
}
```

### **Example 2: Update Checkout Page**

```typescript
// src/modules/checkout/pages/Checkout.tsx
import { checkoutService } from '../services/checkout.service'
import { useNavigate } from 'react-router-dom'

const Checkout = () => {
  const navigate = useNavigate()

  const handleCheckout = async (bundleId: string) => {
    try {
      const order = await checkoutService.createOrder({
        bundleId,
        quantity: 1,
        assign: true,
        allowReassign: false
      })
      
      // Redirect to dashboard with order ID
      navigate(`/my-esim?orderId=${order.orderId}`)
    } catch (error) {
      console.error('Checkout failed:', error)
      alert('Checkout failed. Please try again.')
    }
  }

  // ...
}
```

### **Example 3: Update MyeSIM Dashboard**

```typescript
// src/modules/dashboard/pages/MyeSIM.tsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { esimService } from '@/modules/esim/services/esim.service'

const MyeSIM = () => {
  const [searchParams] = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [qrCode, setQrCode] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQR = async () => {
      if (!orderId) return
      
      try {
        // Get order details first
        const order = await esimService.getOrderDetails(orderId)
        
        // Get QR code if esimId exists
        if (order.esimId) {
          const { qrCode } = await esimService.getQRCode(order.esimId)
          setQrCode(qrCode)
        }
      } catch (error) {
        console.error('Failed to fetch QR code:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQR()
  }, [orderId])

  // Display QR code
  // ...
}
```

---

## 🔍 **Testing Checklist**

- [ ] Backend is running on `http://localhost:8080`
- [ ] `.env` file created with `VITE_API_BASE_URL`
- [ ] Test `getBundles()` - Should return array of bundles
- [ ] Test `getBundlesByCountry('GB')` - Should return GB bundles
- [ ] Test `getBundleById()` - Should return single bundle
- [ ] Test `createOrder()` - Should create order and return orderId/esimId
- [ ] Test `getQRCode()` - Should return QR code for esimId
- [ ] Test `getOrderDetails()` - Should return order information

---

## 🐛 **Troubleshooting**

### **CORS Issues**
If you get CORS errors, make sure your backend has CORS enabled:
```java
@CrossOrigin(origins = "http://localhost:5173")
```

### **404 Errors**
- Check that backend is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check API endpoint paths match exactly

### **401/403 Errors**
- Check if authentication is required
- Verify token is being sent in headers
- Check backend authentication configuration

---

## ✅ **Ready to Test!**

All service files are ready. Start integrating them into your components and test the full flow:

1. Browse bundles → `getBundles()`
2. View bundle details → `getBundleById()`
3. Create order → `createOrder()`
4. View QR code → `getQRCode()`
5. Check order status → `getOrderDetails()`

**Happy Testing!** 🚀

