# 🔧 CORS Error Fix Instructions

## Problem
The frontend (running on `http://localhost:5173`) is being blocked by CORS policy when trying to access the backend API (`http://localhost:8080`).

**Error Message:**
```
Access to fetch at 'http://localhost:8080/api/plans/bundles/country?countryIso=GB' 
from origin 'http://localhost:5173' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## ✅ Solution 1: Fix CORS on Backend (Recommended)

You need to configure CORS on your Spring Boot backend to allow requests from the frontend origin.

### Option A: Global CORS Configuration (Recommended)

Add this configuration class to your Spring Boot backend:

**File: `src/main/java/com/tiktel/config/CorsConfig.java`** (or similar path)

```java
package com.tiktel.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // Allow all origins for development (change in production)
        config.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000",  // React dev server (if used)
            "http://localhost:5174",  // Alternative Vite port
            "http://127.0.0.1:5173"   // Alternative localhost
        ));
        
        // Allow all headers
        config.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow all methods
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // Expose headers
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        
        // Cache preflight for 1 hour
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### Option B: Controller-Level CORS (Alternative)

If you prefer to add CORS per controller, add `@CrossOrigin` annotation:

```java
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class PlansController {
    // Your endpoints
}
```

### Option C: WebMvcConfigurer (Alternative)

```java
@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

## ✅ Solution 2: Vite Proxy (Temporary Workaround)

If you can't modify the backend immediately, you can use Vite's proxy feature as a temporary workaround.

**File: `vite.config.ts`** (update existing or create new)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/api/, '/api'), // Keep /api prefix
      },
    },
  },
})
```

Then update your API client to use relative URLs:

**File: `src/shared/services/api/client.ts`**

```typescript
// Change from:
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// To (for proxy):
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
```

**Note:** With proxy, you don't need the full URL, just `/api` since Vite will proxy it to `http://localhost:8080/api`.

## 🔍 Verification

After applying the backend CORS fix:

1. **Restart your Spring Boot backend**
2. **Check browser console** - CORS errors should be gone
3. **Test the API call** - Bundles should load successfully

## 🚨 Important Notes

1. **Development vs Production:**
   - In development: Allow `http://localhost:5173`
   - In production: Only allow your actual frontend domain (e.g., `https://ttelgo.com`)

2. **Security:**
   - Never use `allowedOrigins: ["*"]` in production
   - Always specify exact origins
   - Use environment variables for different environments

3. **Preflight Requests:**
   - OPTIONS requests are sent automatically by browsers for CORS
   - Make sure your backend handles OPTIONS requests properly

## 📝 Quick Test

After fixing CORS, test in browser console:

```javascript
fetch('http://localhost:8080/api/plans/bundles/country?countryIso=GB')
  .then(r => r.json())
  .then(data => console.log('Success:', data))
  .catch(err => console.error('Error:', err))
```

If this works without CORS errors, your backend CORS is configured correctly!

