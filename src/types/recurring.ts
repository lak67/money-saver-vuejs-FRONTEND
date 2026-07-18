export interface CreateUserRecurringPayload {
  recurring_name: string;
  amount: number;
  active: boolean;
  recurring_date: string;
}

export interface UpdateUserRecurringPayload {
  id: number;
  recurring_name: string;
  amount: number;
  active: boolean;
  recurring_date: string;
}

export interface GetUserRecurringPayload {
  id: number;
  recurring_name: string;
  amount: number;
  active: boolean;
  recurring_date: string;
  created_at: string;
}

export interface DeleteUserRecurringPayload {
  id: number;
}

export interface GetUserRecurringResponse {
  message: string;
  user_recurring: GetUserRecurringPayload[] | null;
}
