export interface Transaction {
  id: string;
  user_id: string;
  budget_type_id: number;
  budget_type_label_id?: number;
  budget_type_name: string;
  budget_type_icon: string;
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionPayload {
  budget_type_id?: number | null;
  budget_type_label_id?: number | null;
  amount: number;
  description?: string;
}

export interface UpdateTransactionPayload {
  amount?: number;
  description?: string;
}

export interface FetchTransactionsParams {
  budget_type_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
}
