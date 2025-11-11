import { API_ENDPOINTS, apiRequest } from "@/lib/api";

// Interfaces for type safety
export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  yearlyIncome?: number;
  budgetTypes?: any[];
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: any;
}

export function UserServices() {
  const registerUser = async (
    registerUserPayload: RegisterPayload
  ): Promise<AuthResponse | ApiError> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.REGISTER_USER, {
        method: "POST",
        body: JSON.stringify(registerUserPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // email sent confirmation logic

      // return the response data
      return data as AuthResponse;
    } catch (error) {
      console.error("Error registering user:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
        error,
      };
    }
  };

  const loginUser = async (
    loginUserPayload: LoginPayload
  ): Promise<AuthResponse | ApiError> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.LOGIN_USER, {
        method: "POST",
        body: JSON.stringify(loginUserPayload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // console.log('Login response data:', data);

      return data as AuthResponse;
    } catch (error) {
      console.error("Error logging in user:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
        error,
      };
    }
  };

  return {
    registerUser,
    loginUser,
  };
}
