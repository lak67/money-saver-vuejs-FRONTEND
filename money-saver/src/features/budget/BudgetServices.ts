import { API_ENDPOINTS, apiClient } from "@/lib/api";
import type { UserBudget } from "@/types";

export const BudgetServices = {
  /**
   * Fetch user's budget allocations with current week spending
   */
  async fetchUserBudgets(): Promise<UserBudget> {
    return apiClient.post<UserBudget>(API_ENDPOINTS.USER_BUDGET_TYPE_LABELS);
  },
};
