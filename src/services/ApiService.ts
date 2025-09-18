import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth';
import { tokenStorage } from '../utils/tokenStorage';

export class ApiService {
  private baseURL = 'http://localhost:8080/api';

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = tokenStorage.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      // Handle 401 responses by attempting token refresh
      if (response.status === 401 && tokenStorage.getRefreshToken()) {
        const refreshToken = tokenStorage.getRefreshToken();
        if (refreshToken) {
          const refreshed = await this.refreshToken(refreshToken);
          if (refreshed) {
            tokenStorage.setTokens(refreshed.accessToken, refreshed.refreshToken);
            // Retry original request with new token
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${refreshed.accessToken}`,
            };
            const retryResponse = await fetch(url, config);
            if (!retryResponse.ok) {
              throw new Error(`HTTP error! status: ${retryResponse.status}`);
            }
            return await retryResponse.json();
          } else {
            tokenStorage.clearTokens();
            throw new Error('Session expired. Please login again.');
          }
        }
      }

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use the default error message
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      // For non-JSON responses, return empty object
      return {} as T;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred');
    }
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse | null> {
    try {
      return await this.request<AuthResponse>('/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      // Ignore logout errors - user should still be logged out locally
      console.error('Logout request failed:', error);
    }
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/auth/me');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string; success: boolean }> {
    return this.request<{ message: string; success: boolean }>('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Generic method for authenticated API calls
  async authenticatedRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, options);
  }

  // Utility method to check if backend is reachable
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/health`, { method: 'GET' });
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
}

// Singleton instance
export const apiService = new ApiService();