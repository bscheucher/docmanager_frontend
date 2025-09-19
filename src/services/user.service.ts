// src/services/user.service.ts

import axios, { AxiosResponse } from 'axios';
import { UserProfile, CreateUserRequest, UpdateUserRequest } from '../types/user.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class UserService {
  private readonly ENDPOINTS = {
    USERS: `${API_URL}/users`,
    CHECK_USERNAME: (username: string) => `${API_URL}/users/check-username/${username}`,
    CHECK_EMAIL: (email: string) => `${API_URL}/users/check-email/${email}`,
  };

  async getAllUsers(): Promise<UserProfile[]> {
    const response: AxiosResponse<UserProfile[]> = await axios.get(this.ENDPOINTS.USERS);
    return response.data;
  }

  async getUserById(id: number): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await axios.get(`${this.ENDPOINTS.USERS}/${id}`);
    return response.data;
  }

  async getUserByUsername(username: string): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await axios.get(`${this.ENDPOINTS.USERS}/username/${username}`);
    return response.data;
  }

  async createUser(user: CreateUserRequest): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await axios.post(this.ENDPOINTS.USERS, user);
    return response.data;
  }

  async updateUser(id: number, user: UpdateUserRequest): Promise<UserProfile> {
    const response: AxiosResponse<UserProfile> = await axios.put(`${this.ENDPOINTS.USERS}/${id}`, user);
    return response.data;
  }

  async deleteUser(id: number): Promise<void> {
    await axios.delete(`${this.ENDPOINTS.USERS}/${id}`);
  }

  async checkUsernameExists(username: string): Promise<boolean> {
    const response: AxiosResponse<boolean> = await axios.get(this.ENDPOINTS.CHECK_USERNAME(username));
    return response.data;
  }

  async checkEmailExists(email: string): Promise<boolean> {
    const response: AxiosResponse<boolean> = await axios.get(this.ENDPOINTS.CHECK_EMAIL(email));
    return response.data;
  }
}

export const userService = new UserService();