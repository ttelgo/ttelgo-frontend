# 🚀 Quick CORS Fix - Two Options

## ⚠️ Current Issue
CORS error blocking API requests from frontend (`http://localhost:5173`) to backend (`http://localhost:8080`).

## ✅ Option 1: Vite Proxy (Temporary - Already Applied)

I've already configured Vite proxy in `vite.config.ts`. This will work immediately:

1. **Restart your Vite dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **The proxy is now active** - All `/api` requests will be proxied to `http://localhost:8080/api`

3. **Test it** - Navigate to `/country/United-Kingdom` and bundles should load!

**Note:** This is a development-only solution. For production, you need to fix CORS on the backend.

## ✅ Option 2: Fix Backend CORS (Proper Solution)

Add this to your Spring Boot backend:

### Create `CorsConfig.java`:

```java
package com.tiktel.config; // Adjust package name

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        config.setAllowCredentials(true);
        config.setAllowedOriginPatterns(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://127.0.0.1:5173"
        ));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setExposedHeaders(Arrays.asList("Authorization", "Content-Type"));
        config.setMaxAge(3600L);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
```

### Then:
1. Restart your Spring Boot backend
2. Remove the Vite proxy (optional, but recommended for production)
3. Update `src/shared/services/api/client.ts` back to:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
   ```

## 🎯 Recommended Approach

1. **For now:** Use Vite proxy (already configured) - works immediately
2. **Later:** Fix CORS on backend - proper solution for production

Both will work, but backend CORS fix is the proper long-term solution.

