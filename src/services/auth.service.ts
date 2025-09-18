// src/services/auth.service.ts

import axios, { AxiosResponse } from 'axios';
import { LoginRequest, RegisterRequest, AuthResponse, User } from '../types/auth.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class AuthService {
  private readonly AUTH_ENDPOINTS = {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    REFRESH: `${API_URL}/auth/refresh`,
    LOGOUT: `${API_URL}/auth/logout`,
    ME: `${API_URL}/auth/me`,
  };

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      this.AUTH_ENDPOINTS.LOGIN,
      credentials
    );
    
    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response.data;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await axios.post(
      this.AUTH_ENDPOINTS.REGISTER,
      userData
    );
    
    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }
    
    return response.data;
  }

  async getCurrentUser(): Promise<User> {
    const response: AxiosResponse<User> = await axios.get(
      this.AUTH_ENDPOINTS.ME,
      {
        headers: { Authorization: `Bearer ${this.getAccessToken()}` }
      }
    );
    return response.data;
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response: AxiosResponse<AuthResponse> = await axios.post(
      this.AUTH_ENDPOINTS.REFRESH,
      { refreshToken }
    );

    if (response.data.accessToken) {
      this.setTokens(response.data.accessToken, response.data.refreshToken);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      await axios.post(
        this.AUTH_ENDPOINTS.LOGOUT,
        {},
        {
          headers: { Authorization: `Bearer ${this.getAccessToken()}` }
        }
      );
    } catch (error) {
      console.error('Logout request failed:', error);
    } finally {
      this.clearTokens();
    }
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const authService = new AuthService();