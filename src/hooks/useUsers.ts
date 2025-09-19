// src/hooks/useUsers.ts

import { useState, useEffect, useCallback } from 'react';
import { UserProfile, CreateUserRequest, UpdateUserRequest } from '../types/user.types';
import { userService } from '../services/user.service';

export const useUsers = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const createUser = async (user: CreateUserRequest): Promise<UserProfile> => {
    const newUser = await userService.createUser(user);
    setUsers(prev => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = async (id: number, user: UpdateUserRequest): Promise<UserProfile> => {
    const updatedUser = await userService.updateUser(id, user);
    setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
    return updatedUser;
  };

  const deleteUser = async (id: number): Promise<void> => {
    await userService.deleteUser(id);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
};