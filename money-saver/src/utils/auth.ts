import Cookies from "js-cookie";

export class AuthTokenManager {
  private static readonly TOKEN_KEY = "authToken";
  private static readonly EXPIRES_DAYS = 7;

  /**
   * Store JWT token in cookie
   */
  static setToken(token: string): void {
    Cookies.set(AuthTokenManager.TOKEN_KEY, token, {
      expires: AuthTokenManager.EXPIRES_DAYS,
      secure: process.env.NODE_ENV === "production", // Only secure in production
      sameSite: "strict",
    });
  }

  /**
   * Get JWT token from cookie
   */
  static getToken(): string | undefined {
    return Cookies.get(AuthTokenManager.TOKEN_KEY);
  }

  /**
   * Remove JWT token from cookie
   */
  static removeToken(): void {
    Cookies.remove(AuthTokenManager.TOKEN_KEY);
  }

  /**
   * Check if user has a valid token (basic check - not cryptographic validation)
   */
  static hasToken(): boolean {
    const token = AuthTokenManager.getToken();
    return !!token && token.length > 0;
  }

  /**
   * Decode JWT payload without validation (for display purposes only)
   * Note: This should NOT be used for security decisions
   */
  static decodeTokenPayload(token?: string): any | null {
    try {
      const tokenToUse = token || AuthTokenManager.getToken();
      if (!tokenToUse) return null;

      const payload = tokenToUse.split(".")[1];
      if (!payload) return null;

      const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      return JSON.parse(decoded);
    } catch (error) {
      console.warn("Error decoding token payload:", error);
      return null;
    }
  }

  /**
   * Check if token is expired (basic check)
   */
  static isTokenExpired(token?: string): boolean {
    try {
      const payload = AuthTokenManager.decodeTokenPayload(token);
      if (!payload || !payload.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Get token with validation
   */
  static getValidToken(): string | null {
    const token = AuthTokenManager.getToken();
    if (!token) return null;

    if (AuthTokenManager.isTokenExpired(token)) {
      AuthTokenManager.removeToken();
      return null;
    }

    return token;
  }
}

/**
 * HTTP interceptor utility for adding auth headers
 */
export class AuthHttpInterceptor {
  /**
   * Add Authorization header to fetch request options
   */
  static addAuthHeader(options: RequestInit = {}): RequestInit {
    const token = AuthTokenManager.getValidToken();
    if (!token) return options;

    return {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    };
  }

  /**
   * Create an authenticated fetch wrapper
   */
  static createAuthenticatedFetch() {
    return (url: string, options?: RequestInit) => {
      const authOptions = AuthHttpInterceptor.addAuthHeader(options);
      return fetch(url, authOptions);
    };
  }
}
