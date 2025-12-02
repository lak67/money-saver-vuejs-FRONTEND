import { API_ENDPOINTS, apiRequest } from "@/lib/api";

export interface Transaction {
  id: string;
  user_id: string;
  budget_type_id: string;
  budget_type_name: string;
  budget_type_icon: string;
  amount: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTransactionPayload {
  budget_type_id: string;
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

export const TransactionServices = () => {
  /**
   * Fetch user's transactions with optional filters
   */
  const fetchTransactions = async (
    params?: FetchTransactionsParams
  ): Promise<Transaction[]> => {
    try {
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

      const response = await apiRequest(endpoint, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch transactions: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in fetchTransactions:", error);
      throw error;
    }
  };

  /**
   * Create a new transaction
   */
  const createTransaction = async (
    payload: CreateTransactionPayload
  ): Promise<Transaction> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.TRANSACTIONS, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to create transaction: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in createTransaction:", error);
      throw error;
    }
  };

  /**
   * Update an existing transaction
   */
  const updateTransaction = async (
    transactionId: string,
    payload: UpdateTransactionPayload
  ): Promise<Transaction> => {
    try {
      const response = await apiRequest(
        `${API_ENDPOINTS.TRANSACTIONS}/${transactionId}`,
        {
          method: "PUT",
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update transaction: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error in updateTransaction:", error);
      throw error;
    }
  };

  /**
   * Delete a transaction
   */
  const deleteTransaction = async (transactionId: string): Promise<void> => {
    try {
      const response = await apiRequest(
        `${API_ENDPOINTS.TRANSACTIONS}/${transactionId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete transaction: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error in deleteTransaction:", error);
      throw error;
    }
  };

  return {
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
};
