export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  income?: number;
}

export interface UpdateUserPayload {
  first_name: string | null;
  last_name: string | null;
  income: number | null;
}

export interface RegisterUserPayload {
  first_name: string;
  last_name: string;
  password: string;
  email: string;
  income: number | null;
  budget_types: Array<{
    id: number;
    total_amount: number;
  }>;
}

export interface LoginUserPayload {
  email: string;
  password: string;
}
