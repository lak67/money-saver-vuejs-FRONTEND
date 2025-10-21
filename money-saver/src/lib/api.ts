/**
 * API Configuration utility
 * Centralizes API-related configuration and helper functions
 */

// Environment variables with fallbacks
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || "5000"),
  DEV_MODE: import.meta.env.VITE_DEV_MODE === "true",
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === "true",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BUDGET_TYPES: "/budgettypes",
  USERS: "/users",
  EXPENSES: "/expenses",
  BUDGETS: "/budgets",
  REGISTER_USER: "/register",
  LOGIN_USER: "/login",
} as const;

// Helper function to build full URL
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for common headers
export const getDefaultHeaders = (): Record<string, string> => {
  return {
    "Content-Type": "application/json",
    // Add auth headers here when needed
    // 'Authorization': `Bearer ${getAuthToken()}`
  };
};

// Helper function for fetch with default config
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  const defaultOptions: RequestInit = {
    headers: getDefaultHeaders(),
    ...options,
  };

  if (API_CONFIG.ENABLE_LOGGING) {
    console.log(`API Request: ${options.method || "GET"} ${url}`);
  }

  const response = await fetch(url, defaultOptions);

  if (API_CONFIG.ENABLE_LOGGING) {
    console.log(`API Response: ${response.status} ${response.statusText}`);
  }

  return response;
};
