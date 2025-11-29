# Modular Architecture Migration Guide

## ✅ **What Has Been Created**

### **Core Infrastructure** (`src/core/`)
- ✅ `constants/routes.ts` - Centralized route definitions
- ✅ `config/app.config.ts` - Application configuration
- ✅ `api/client.ts` - HTTP client for API calls

### **Shared Resources** (`src/shared/`)
- ✅ `types/index.ts` - Shared TypeScript types
- ✅ `utils/index.ts` - Shared utility functions
- ✅ `components/Layout/` - Layout components (Navbar, Footer, Layout)

### **Module Structure** (`src/modules/`)
Created directory structure for:
- ✅ `auth/` - Authentication module
- ✅ `esim/` - eSIM management module
- ✅ `blog/` - Blog module
- ✅ `support/` - Support module (Help Centre, Contact)
- ✅ `marketing/` - Marketing module (Home, About, Download App)

---

## 📋 **Next Steps: Moving Pages to Modules**

### **1. Auth Module** (`src/modules/auth/`)
Move these pages:
- `src/pages/Login.tsx` → `src/modules/auth/pages/Login.tsx`
- `src/pages/SignUp.tsx` → `src/modules/auth/pages/SignUp.tsx`

### **2. eSIM Module** (`src/modules/esim/`)
Move these pages:
- `src/pages/MyeSIM.tsx` → `src/modules/esim/pages/MyeSIM.tsx`
- `src/pages/ShopPlans.tsx` → `src/modules/esim/pages/ShopPlans.tsx`
- `src/pages/Checkout.tsx` → `src/modules/esim/pages/Checkout.tsx`
- `src/pages/GlobalESIMPlans.tsx` → `src/modules/esim/pages/GlobalESIMPlans.tsx`
- `src/pages/RegionCountries.tsx` → `src/modules/esim/pages/RegionCountries.tsx`
- `src/pages/CountryPackages.tsx` → `src/modules/esim/pages/CountryPackages.tsx`

Move these utils:
- `src/utils/mockData.ts` → `src/modules/esim/utils/mockData.ts` (or keep in shared if used elsewhere)
- `src/utils/regionalPlansData.ts` → `src/modules/esim/utils/regionalPlansData.ts`
- `src/utils/countriesData.ts` → `src/modules/esim/utils/countriesData.ts`

### **3. Blog Module** (`src/modules/blog/`)
Move these pages:
- `src/pages/Blog.tsx` → `src/modules/blog/pages/Blog.tsx`
- `src/pages/blog/UltimateGuideESIMTravel.tsx` → `src/modules/blog/pages/UltimateGuideESIMTravel.tsx`
- `src/pages/blog/SaveMoneyESIMvsRoaming.tsx` → `src/modules/blog/pages/SaveMoneyESIMvsRoaming.tsx`
- `src/pages/blog/ESIMSetupGuideBeginners.tsx` → `src/modules/blog/pages/ESIMSetupGuideBeginners.tsx`

### **4. Support Module** (`src/modules/support/`)
Move these pages:
- `src/pages/HelpCentre.tsx` → `src/modules/support/pages/HelpCentre.tsx`
- `src/pages/Contact.tsx` → `src/modules/support/pages/Contact.tsx`

### **5. Marketing Module** (`src/modules/marketing/`)
Move these pages:
- `src/pages/Home.tsx` → `src/modules/marketing/pages/Home.tsx`
- `src/pages/About.tsx` → `src/modules/marketing/pages/About.tsx`
- `src/pages/DownloadApp.tsx` → `src/modules/marketing/pages/DownloadApp.tsx`

---

## 🔄 **Update Imports**

After moving files, update all imports:

### **Old Import:**
```typescript
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
```

### **New Import:**
```typescript
import Layout from '@/shared/components/Layout/Layout'
import Home from '@/modules/marketing/pages/Home'
```

### **Update App.tsx:**
```typescript
import Layout from '@/shared/components/Layout/Layout'
import Home from '@/modules/marketing/pages/Home'
import About from '@/modules/marketing/pages/About'
import DownloadApp from '@/modules/marketing/pages/DownloadApp'
import HelpCentre from '@/modules/support/pages/HelpCentre'
import Contact from '@/modules/support/pages/Contact'
import Blog from '@/modules/blog/pages/Blog'
import MyeSIM from '@/modules/esim/pages/MyeSIM'
import ShopPlans from '@/modules/esim/pages/ShopPlans'
import Checkout from '@/modules/esim/pages/Checkout'
import Login from '@/modules/auth/pages/Login'
import SignUp from '@/modules/auth/pages/SignUp'
// ... etc
```

---

## 📁 **Final Modular Structure**

```
src/
├── core/                    # Core infrastructure
│   ├── api/
│   │   └── client.ts
│   ├── config/
│   │   └── app.config.ts
│   └── constants/
│       └── routes.ts
│
├── shared/                  # Shared across modules
│   ├── components/
│   │   └── Layout/
│   │       ├── Layout.tsx
│   │       ├── Navbar.tsx
│   │       └── Footer.tsx
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       └── index.ts
│
├── modules/                 # Feature modules
│   ├── auth/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   └── SignUp.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── index.ts
│   │
│   ├── esim/
│   │   ├── pages/
│   │   │   ├── MyeSIM.tsx
│   │   │   ├── ShopPlans.tsx
│   │   │   ├── Checkout.tsx
│   │   │   ├── GlobalESIMPlans.tsx
│   │   │   ├── RegionCountries.tsx
│   │   │   └── CountryPackages.tsx
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.ts
│   │
│   ├── blog/
│   │   ├── pages/
│   │   │   ├── Blog.tsx
│   │   │   ├── UltimateGuideESIMTravel.tsx
│   │   │   ├── SaveMoneyESIMvsRoaming.tsx
│   │   │   └── ESIMSetupGuideBeginners.tsx
│   │   ├── components/
│   │   └── index.ts
│   │
│   ├── support/
│   │   ├── pages/
│   │   │   ├── HelpCentre.tsx
│   │   │   └── Contact.tsx
│   │   ├── components/
│   │   └── index.ts
│   │
│   └── marketing/
│       ├── pages/
│       │   ├── Home.tsx
│       │   ├── About.tsx
│       │   └── DownloadApp.tsx
│       ├── components/
│       └── index.ts
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## 🎯 **Benefits of Modular Structure**

1. **Better Organization** - Code grouped by feature/domain
2. **Scalability** - Easy to add new features without cluttering
3. **Maintainability** - Related code lives together
4. **Team Collaboration** - Teams can work on different modules independently
5. **Code Reusability** - Shared code in `shared/`, module-specific in modules
6. **Clear Dependencies** - Easy to see what depends on what
7. **Testing** - Easier to test modules in isolation

---

## ⚠️ **Important Notes**

1. **Path Aliases**: Make sure `@/` alias is configured in `tsconfig.json` (already done ✅)
2. **Import Updates**: All imports need to be updated after moving files
3. **Old Files**: Delete old `src/components/` and `src/pages/` after migration
4. **Types**: Update imports from `@/types` to `@/shared/types`
5. **Utils**: Move module-specific utils to modules, keep shared ones in `shared/utils`

---

## 🚀 **Migration Checklist**

- [x] Create core infrastructure
- [x] Create shared resources
- [x] Create module directories
- [x] Move Layout components to shared
- [ ] Move pages to respective modules
- [ ] Update all imports
- [ ] Update App.tsx with new imports
- [ ] Move utils to appropriate locations
- [ ] Create module index.ts files
- [ ] Test application
- [ ] Delete old directories
- [ ] Update documentation

