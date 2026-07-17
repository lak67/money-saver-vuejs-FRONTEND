export interface Transaction {
  id: number;
  amount: number;
  type_name: string;
  label_name?: string;
  created_at: string;
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
