import { API_ENDPOINTS, apiClient } from "@/lib/api";
import type {
  CreateTransactionPayload,
  FetchTransactionsParams,
  Transaction,
  UpdateTransactionPayload,
} from "@/types";

export const TransactionServices = {
  /**
   * Fetch user's transactions with optional filters
   */
  async fetchTransactions(params?: FetchTransactionsParams): Promise<Transaction[]> {
    const queryParams = new URLSearchParams();
    
    if (params?.budget_type_id) {
      queryParams.append("budget_type_id", params.budget_type_id);
    }
    if (params?.start_date) {
      queryParams.append("start_date", params.start_date);
    }
    if (params?.end_date) {
      queryParams.append("end_date", params.end_date);
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }

    const endpoint = `${API_ENDPOINTS.TRANSACTIONS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    return apiClient.get<Transaction[]>(endpoint);
  },

  /**
   * Create a new transaction
   */
  async createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
    return apiClient.post<Transaction>(API_ENDPOINTS.TRANSACTIONS, payload);
  },

  /**
   * Update an existing transaction
   */
  async updateTransaction(
    transactionId: string,
    payload: UpdateTransactionPayload
  ): Promise<Transaction> {
    return apiClient.put<Transaction>(
      `${API_ENDPOINTS.TRANSACTIONS}/${transactionId}`,
      payload
    );
  },

  /**
   * Delete a transaction
   */
  async deleteTransaction(transactionId: string): Promise<void> {
    return apiClient.delete(`${API_ENDPOINTS.TRANSACTIONS}/${transactionId}`);
  },
};
