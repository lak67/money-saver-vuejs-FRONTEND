import { API_ENDPOINTS, apiClient } from "@/lib/api";
import type { LoginUserPayload, RegisterUserPayload, UpdateUserPayload, User } from "@/types";

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

  /**
   * Update user profile information
   */
  async updateUser(payload: UpdateUserPayload): Promise<User> {
    return apiClient.post<User>(API_ENDPOINTS.EDIT_USER, payload);
  },

  /**
   * Request a security code for changing password or email
   */
  async requestSecurityCode(type: 'password' | 'email') {
    return apiClient.post(API_ENDPOINTS.REQUEST_SECURITY_CODE, { type });
  },

  /**
   * Verify the security code
   */
  async verifySecurityCode(type: 'password' | 'email', code: string) {
    return apiClient.post(API_ENDPOINTS.VERIFY_SECURITY_CODE, { type, code });
  },

  /**
   * Update the security field (password or email)
   */
  async updateSecurityField(type: 'password' | 'email', value: string, code: string) {
    return apiClient.post(API_ENDPOINTS.UPDATE_SECURITY_FIELD, { type, value, code });
  },
};
