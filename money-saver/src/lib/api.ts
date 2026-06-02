/**
 * API Configuration utility
 * Centralizes API-related configuration and helper functions
 */

// Environment variables with fallbacks
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "/api/v1",
  TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || "5000"),
  DEV_MODE: import.meta.env.VITE_DEV_MODE === "true",
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === "true",
} as const;

// API endpoints
export const API_ENDPOINTS = {
  BUDGET_TYPES: "/budgettypes",
  USER_BUDGET_TYPE_LABELS: "/budgettypes/labels",
  USERS: "/users",
  EXPENSES: "/expenses",
  BUDGETS: "/budgets",
  USER_BUDGETS: "/user/budgets",
  TRANSACTIONS: "/get/budget-entries",
  CREATE_TRANSACTION: "/create-budget-entry",
  REGISTER_USER: "/register",
  LOGIN_USER: "/login",
  CHECK_EMAIL: "/email/exists",
  AUTH_STATUS: "/auth/status",
  LOGOUT: "/logout",
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
  options: RequestInit = {},
): Promise<Response> => {
  const url = buildApiUrl(endpoint);
  const defaultOptions: RequestInit = {
    headers: getDefaultHeaders(),
    credentials: "include",
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

/**
 * Custom error class for API-related errors
 */
export class ApiError extends Error {
  constructor(
    public message: string,
    public status?: number,
    public data?: any,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Robust API client wrapper
 */
export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await apiRequest(endpoint, options);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      throw new ApiError(
        errorData.message || `API request failed: ${response.statusText}`,
        response.status,
        errorData,
      );
    }

    if (response.status === 204) {
      return {} as T;
    }

    try {
      return await response.json();
    } catch (e) {
      if (response.status === 200 || response.status === 201) {
        // Some APIs might return empty body on 200/201 which fetch.json() fails on
        return {} as T;
      }
      throw new ApiError("Failed to parse API response");
    }
  },

  get<T>(endpoint: string, options?: Omit<RequestInit, "method">) {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  },

  post<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestInit, "method" | "body">,
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestInit, "method" | "body">,
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(
    endpoint: string,
    body?: any,
    options?: Omit<RequestInit, "method" | "body">,
  ) {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string, options?: Omit<RequestInit, "method">) {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  },
};
