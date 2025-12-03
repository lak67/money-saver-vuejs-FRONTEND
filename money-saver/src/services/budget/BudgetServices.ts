import { API_ENDPOINTS, apiRequest } from "@/lib/api";

export interface UserBudget {
  id: string;
  user_id: string;
  budget_type_id: string;
  budget_type_name: string;
  budget_type_icon: string;
  weekly_amount: number;
  spent_this_week: number;
  created_at: string;
  updated_at: string;
}

export const BudgetServices = () => {
  /**
   * Fetch user's budget allocations with current week spending
   */
  const fetchUserBudgets = async (): Promise<UserBudget[]> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.USER_BUDGET_TYPE_LABELS, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user budgets: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in fetchUserBudgets:", error);
      throw error;
    }
  };

  return {
    fetchUserBudgets,
  };
};
