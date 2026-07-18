import { API_ENDPOINTS, apiClient } from "@/lib/api";
import type {
  CreateUserRecurringPayload,
  UpdateUserRecurringPayload,
  GetUserRecurringResponse,
} from "@/types";

export const RecurringServices = {
  async getUserRecurring(): Promise<GetUserRecurringResponse> {
    return apiClient.post<GetUserRecurringResponse>(API_ENDPOINTS.RECURRING_ALL);
  },

  async createUserRecurring(payload: CreateUserRecurringPayload): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.RECURRING_CREATE, payload);
  },

  async updateUserRecurring(payload: UpdateUserRecurringPayload): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.RECURRING_UPDATE, payload);
  },

  async deleteUserRecurring(id: number): Promise<void> {
    return apiClient.post<void>(API_ENDPOINTS.RECURRING_DELETE, { id });
  },
};
