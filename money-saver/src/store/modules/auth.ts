import type { Module } from "vuex";
import type { RootState } from "../index";
import { AuthTokenManager } from "@/utils/auth";

// Auth state interface
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// User interface
export interface User {
  id: string | number;
  firstName: string;
  lastName: string;
  email: string;
}

// Login/Register payload interfaces
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  yearlyIncome?: number;
  budgetTypes?: any[];
}

// API Response interfaces
export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message?: string;
}

const state: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

const mutations = {
  SET_LOADING(state: AuthState, loading: boolean) {
    state.loading = loading;
  },

  SET_ERROR(state: AuthState, error: string | null) {
    state.error = error;
  },

  SET_AUTH_SUCCESS(state: AuthState, payload: { user: User; token: string }) {
    state.isAuthenticated = true;
    state.user = payload.user;
    state.token = payload.token;
    state.error = null;
    state.loading = false;
  },

  CLEAR_AUTH(state: AuthState) {
    state.isAuthenticated = false;
    state.user = null;
    state.token = null;
    state.error = null;
    state.loading = false;
  },

  UPDATE_USER(state: AuthState, user: User) {
    state.user = user;
  },
};

const actions = {
  async login({ commit }: any, loginPayload: LoginPayload) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      // Import UserServices dynamically to avoid circular imports
      const { UserServices } = await import("@/services/user/UserServices");
      const userService = UserServices();

      const response = await userService.loginUser(loginPayload);

      if (response && response.success) {
        const { user, token } = response.data;

        // Store JWT token in cookie
        AuthTokenManager.setToken(token);

        commit("SET_AUTH_SUCCESS", { user, token });
        return { success: true, user };
      } else {
        const errorMsg = response?.message || "Login failed";
        commit("SET_ERROR", errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      const errorMsg = error.message || "An error occurred during login";
      commit("SET_ERROR", errorMsg);
      commit("SET_LOADING", false);
      return { success: false, error: errorMsg };
    }
  },

  async register({ commit }: any, registerPayload: RegisterPayload) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      const { UserServices } = await import("@/services/user/UserServices");
      const userService = UserServices();

      const response = await userService.registerUser(registerPayload);

      if (response && response.success) {
        // Auto-login after successful registration
        return await actions.login(
          { commit },
          {
            email: registerPayload.email,
            password: registerPayload.password,
          }
        );
      } else {
        const errorMsg = response?.message || "Registration failed";
        commit("SET_ERROR", errorMsg);
        return { success: false, error: errorMsg };
      }
    } catch (error: any) {
      const errorMsg = error.message || "An error occurred during registration";
      commit("SET_ERROR", errorMsg);
      commit("SET_LOADING", false);
      return { success: false, error: errorMsg };
    }
  },

  async logout({ commit }: any) {
    // Remove auth token cookie
    AuthTokenManager.removeToken();

    // Clear auth state
    commit("CLEAR_AUTH");

    return { success: true };
  },

  async checkAuth({ commit }: any) {
    const token = AuthTokenManager.getValidToken();

    if (!token) {
      commit("CLEAR_AUTH");
      return { success: false };
    }

    try {
      // You might want to verify the token with your backend here
      // For now, we'll assume the token is valid if it exists
      // This should be replaced with actual token validation

      // Mock user data - replace with actual API call to get user info
      const user = {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      commit("SET_AUTH_SUCCESS", { user, token });
      return { success: true, user };
    } catch (error) {
      AuthTokenManager.removeToken();
      commit("CLEAR_AUTH");
      return { success: false };
    }
  },

  async updateProfile({ commit }: any, userData: Partial<User>) {
    commit("SET_LOADING", true);
    commit("SET_ERROR", null);

    try {
      // Call your API to update user profile
      // This is a placeholder - implement your actual API call

      // For now, just update the local state
      const currentUser = state.user;
      if (currentUser) {
        const updatedUser = { ...currentUser, ...userData };
        commit("UPDATE_USER", updatedUser);
        commit("SET_LOADING", false);
        return { success: true, user: updatedUser };
      }

      throw new Error("No user found");
    } catch (error: any) {
      const errorMsg = error.message || "Failed to update profile";
      commit("SET_ERROR", errorMsg);
      commit("SET_LOADING", false);
      return { success: false, error: errorMsg };
    }
  },
};

const getters = {
  isAuthenticated: (state: AuthState) => state.isAuthenticated,
  user: (state: AuthState) => state.user,
  userFullName: (state: AuthState) => {
    if (state.user) {
      return `${state.user.firstName} ${state.user.lastName}`.trim();
    }
    return null;
  },
  userFirstName: (state: AuthState) => state.user?.firstName || null,
  userLastName: (state: AuthState) => state.user?.lastName || null,
  userEmail: (state: AuthState) => state.user?.email || null,
  token: (state: AuthState) => state.token,
  loading: (state: AuthState) => state.loading,
  error: (state: AuthState) => state.error,
};

export const authModule: Module<AuthState, RootState> = {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
