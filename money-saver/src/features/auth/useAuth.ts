/**
 * Authentication composable for managing user auth state
 */

import { API_ENDPOINTS, apiClient } from '@/lib/api';
import type { AuthResponse, AuthState, User } from '@/types';
import { computed, readonly, ref } from 'vue';

// Global auth state
const authState = ref<AuthState>({
  user: null,
  isLoading: false,
  error: null
});

// Track if we've already checked auth status on app load
const hasInitiallyChecked = ref(false);

/**
 * Auth composable providing authentication functionality
 */
export const useAuth = () => {
  // Computed properties
  const isAuthenticated = computed(() => authState.value.user !== null);
  const isLoading = computed(() => authState.value.isLoading);
  const error = computed(() => authState.value.error);
  const user = computed(() => authState.value.user);

  /**
   * Clear error state
   */
  const clearError = () => {
    authState.value.error = null;
  };

  /**
   * Set loading state
   */
  const setLoading = (loading: boolean) => {
    authState.value.isLoading = loading;
  };

  /**
   * Set error state
   */
  const setError = (errorMessage: string) => {
    authState.value.error = errorMessage;
    authState.value.isLoading = false;
  };

  /**
   * Set user data
   */
  const setUser = (userData: User | null) => {
    authState.value.user = userData;
    authState.value.error = null;
    authState.value.isLoading = false;
  };

  /**
   * Check authentication status with backend
   */
  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();

      const data = await apiClient.post<AuthResponse>(API_ENDPOINTS.AUTH_STATUS);
        
      if (data.authenticated && data.user) {
        setUser(data.user);
        return true;
      } else {
        setUser(null);
        return false;
      }
    } catch (err: any) {
      // Don't show error to user for auth checks, just set as unauthenticated
      setUser(null);
      return false;
    } finally {
      setLoading(false);
      hasInitiallyChecked.value = true;
    }
  };

  /**
   * Initialize auth check on app load
   */
  const initializeAuth = async () => {
    if (!hasInitiallyChecked.value) {
      await checkAuthStatus();
    }
  };

  /**
   * Login user (to be called after successful login)
   */
  const loginSuccess = (userData: User) => {
    setUser(userData);
  };

  /**
   * Logout user
   */
  const logout = async () => {
    try {
      setLoading(true);
      
      try {
        await apiClient.post(API_ENDPOINTS.LOGOUT);
      } catch (logoutErr) {
        console.warn('Logout endpoint call failed, clearing local state anyway:', logoutErr);
      }
      
      setUser(null);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh auth status
   */
  const refreshAuth = async () => {
    return await checkAuthStatus();
  };

  return {
    // State
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
  };
};
