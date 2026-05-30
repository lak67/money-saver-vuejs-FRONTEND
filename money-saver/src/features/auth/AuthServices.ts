import { API_ENDPOINTS, apiClient } from "@/lib/api";
import type { LoginUserPayload, RegisterUserPayload } from "@/types";

export const AuthServices = {
  /**
   * Register a new user
   */
  async registerUser(payload: RegisterUserPayload) {
    return apiClient.post(API_ENDPOINTS.REGISTER_USER, payload);
  },

  /**
   * Check if an email exists
   */
  async checkEmailExists(email: string): Promise<boolean> {
    const data = await apiClient.post<{ exists: boolean } | boolean>(
      API_ENDPOINTS.CHECK_EMAIL,
      { email }
    );
    return typeof data === "boolean" ? data : Boolean(data?.exists ?? data);
  },

  /**
   * Login a user
   */
  async loginUser(payload: LoginUserPayload) {
    return apiClient.post(API_ENDPOINTS.LOGIN_USER, payload);
  },
};
