export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
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
