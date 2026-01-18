import { API_ENDPOINTS, apiRequest } from "@/lib/api";

export interface UserBudget {
  authenticated: boolean;
  labels: Labels;
}

export interface Labels {
  first_name: string;
  last_name: string;
  users_budget_type_labels: UserBudgetTypeLabel[];
}

export interface UserBudgetTypeLabel{
  id: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  budget_type_with_labels: BudgetTypeWithLabels;
}

export interface BudgetTypeWithLabels{
  id: number;
  budget_type: string;
  description: string;
  budget_type_labels: BudgetTypeLabel[];
}

export interface BudgetTypeLabel {
  id: number;
  label_name: string;
  budget_type_id: number;
  created_at: string;
  updated_at: string;
}
  

export const BudgetServices = () => {
  /**
   * Fetch user's budget allocations with current week spending
   */
  const fetchUserBudgets = async (): Promise<UserBudget> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.USER_BUDGET_TYPE_LABELS, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user budgets: ${response.statusText}`);
      }

      const data = await response.json();

      console.log(data);
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
