import type { User } from './user';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResponse {
  authenticated: boolean;
  user?: User;
}

export type SecurityActionType = 'password' | 'email';

export interface RequestCodeResponse {
  message: string;
}

export interface VerifyCodeResponse {
  valid: boolean;
  message?: string;
}

export interface UpdateFieldResponse {
  success: boolean;
  message?: string;
}
