/**
 * API Key Configuration Utility
 * Manages API key storage and retrieval for frontend-backend communication
 */

const API_KEY_STORAGE_KEY = 'api_key'
const API_SECRET_STORAGE_KEY = 'api_secret'

export const apiKeyConfig = {
  /**
   * Set the API key for frontend requests
   */
  setApiKey(key: string, secret?: string): void {
    if (key && key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim())
      if (secret && secret.trim()) {
        localStorage.setItem(API_SECRET_STORAGE_KEY, secret.trim())
      }
    }
  },

  /**
   * Get the current API key
   */
  getApiKey(): string | null {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || import.meta.env.VITE_API_KEY || null
  },

  /**
   * Get the current API secret
   */
  getApiSecret(): string | null {
    return localStorage.getItem(API_SECRET_STORAGE_KEY) || import.meta.env.VITE_API_SECRET || null
  },

  /**
   * Check if API key is configured
   */
  hasApiKey(): boolean {
    return !!this.getApiKey()
  },

  /**
   * Clear the API key
   */
  clearApiKey(): void {
    localStorage.removeItem(API_KEY_STORAGE_KEY)
    localStorage.removeItem(API_SECRET_STORAGE_KEY)
  },

  /**
   * Initialize API key from environment or use default
   * This is the API key provided by the user for ttelgo frontend
   */
  initialize(): void {
    // If no API key is set, try to use the default one
    if (!this.hasApiKey()) {
      const defaultKey = import.meta.env.VITE_API_KEY || 'ttelgo_Vu9gQIlJBTxSXoHwP_SidRYF-BWbX9S-zUox9KmBwSQ'
      if (defaultKey) {
        this.setApiKey(defaultKey)
        console.log('API key initialized from environment/default')
      }
    }
  }
}

// Auto-initialize on import
apiKeyConfig.initialize()

