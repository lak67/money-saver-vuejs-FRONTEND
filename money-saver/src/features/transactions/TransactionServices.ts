import { API_ENDPOINTS, apiClient } from "@/lib/api";
import type {
  CreateTransactionPayload,
  Transaction,
  UpdateTransactionPayload,
} from "@/types";

export const TransactionServices = {
  /**
   * Fetch user's transactions with optional filters
   */
  async fetchTransactions(): Promise<Transaction[]> {
    const queryParams = new URLSearchParams();

    const endpoint = `${API_ENDPOINTS.TRANSACTIONS}${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    return apiClient.get<Transaction[]>(endpoint);
  },

  /**
   * Create a new transaction
   */
  async createTransaction(payload: CreateTransactionPayload): Promise<Transaction> {
    return apiClient.post<Transaction>(API_ENDPOINTS.CREATE_TRANSACTION, payload);
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
