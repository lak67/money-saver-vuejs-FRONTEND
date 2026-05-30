export interface BudgetType {
  id: string;
  type_name: string;
  icon: string;
  description: string;
}

export interface UserBudget {
  authenticated: boolean;
  labels: Labels;
}

export interface Labels {
  first_name: string;
  last_name: string;
  users_budget_type_labels: UserBudgetTypeLabel[];
}

export interface UserBudgetTypeLabel {
  id: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  budget_type_with_labels: BudgetTypeWithLabels;
}

export interface BudgetTypeWithLabels {
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

export interface SelectedBudgetType {
  id: string;
  total_amount: number;
}
