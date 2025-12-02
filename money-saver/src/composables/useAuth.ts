/**
 * Authentication composable for managing user auth state
 * Production-ready implementation with proper error handling and type safety
 */

import { API_ENDPOINTS, apiRequest } from '@/lib/api'
import { computed, readonly, ref } from 'vue'

// Types
export interface User {
  id: number
  email: string
  name?: string
  // Add other user properties as needed
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

export interface AuthResponse {
  authenticated: boolean
  user?: User
}

// Global auth state
const authState = ref<AuthState>({
  user: null,
  isLoading: false,
  error: null
})

// Track if we've already checked auth status on app load
const hasInitiallyChecked = ref(false)

/**
 * Auth composable providing authentication functionality
 */
export const useAuth = () => {
  // Computed properties
  const isAuthenticated = computed(() => authState.value.user !== null)
  const isLoading = computed(() => authState.value.isLoading)
  const error = computed(() => authState.value.error)
  const user = computed(() => authState.value.user)

  /**
   * Clear error state
   */
  const clearError = () => {
    authState.value.error = null
  }

  /**
   * Set loading state
   */
  const setLoading = (loading: boolean) => {
    authState.value.isLoading = loading
  }

  /**
   * Set error state
   */
  const setError = (errorMessage: string) => {
    authState.value.error = errorMessage
    authState.value.isLoading = false
  }

  /**
   * Set user data
   */
  const setUser = (userData: User | null) => {
    authState.value.user = userData
    authState.value.error = null
    authState.value.isLoading = false
  }

  /**
   * Check authentication status with backend
   * This calls your /auth/status endpoint
   */
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      setLoading(true)
      clearError()

      const response = await apiRequest(API_ENDPOINTS.AUTH_STATUS, {
        method: 'POST'
      })

      if (!response.ok) {
        if (response.status === 401) {
          // User is not authenticated
          setUser(null)
          return false
        }
        throw new Error(`Auth check failed: ${response.status}`)
      }

      const data: AuthResponse = await response.json()
        
      if (data.authenticated && data.user) {
        setUser(data.user)
        return true
      } else {
        setUser(null)
        return false
      }
    } catch (err) {
      // console.error('Auth status check failed:', err)
      // Don't show error to user for auth checks, just set as unauthenticated
      setUser(null)
      return false
    } finally {
      setLoading(false)
      hasInitiallyChecked.value = true
    }
  }

  /**
   * Initialize auth check on app load
   */
  const initializeAuth = async () => {
    if (!hasInitiallyChecked.value) {
      await checkAuthStatus()
    }
  }

  /**
   * Login user (to be called after successful login)
   * This doesn't perform the login, just updates the auth state
   */
  const loginSuccess = (userData: User) => {
    setUser(userData)
  }

  /**
   * Logout user
   * This clears the local auth state and calls backend logout if available
   */
  const logout = async () => {
    try {
      setLoading(true)
      
      // Try to call logout endpoint if you have one implemented
      try {
        await apiRequest(API_ENDPOINTS.LOGOUT, { method: 'POST' })
      } catch (logoutErr) {
        console.warn('Logout endpoint call failed, clearing local state anyway:', logoutErr)
      }
      
      setUser(null)
    } catch (err) {
      // console.error('Logout failed:', err)
      // Even if logout request fails, clear local state
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Refresh auth status
   */
  const refreshAuth = async () => {
    return await checkAuthStatus()
  }

  return {
    // State (readonly to prevent external mutations)
    user: readonly(user),
    isAuthenticated: readonly(isAuthenticated),
    isLoading: readonly(isLoading),
    error: readonly(error),
    hasInitiallyChecked: readonly(hasInitiallyChecked),
    
    // Methods
    checkAuthStatus,
    initializeAuth,
    loginSuccess,
    logout,
    refreshAuth,
    clearError,
    setError
  }
}