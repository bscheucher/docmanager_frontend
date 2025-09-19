// src/components/admin/UserManagement.tsx

import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { Plus } from 'lucide-react';

export const UserManagement: React.FC = () => {
  const { users, loading, error, createUser, updateUser, deleteUser } = useUsers();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const handleCreateUser = async (userData: any) => {
    try {
      await createUser(userData);
      setShowCreateForm(false);
    } catch (error: any) {
      throw error;
    }
  };

  const handleUpdateUser = async (userData: any) => {
    if (!editingUser) return;
    try {
      await updateUser(editingUser.id, userData);
      setEditingUser(null);
    } catch (error: any) {
      throw error;
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
      } catch (error: any) {
        alert('Failed to delete user: ' + error.message);
      }
    }
  };

  if (loading) return <LoadingSpinner message="Loading users..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Users ({users.length})</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </button>
      </div>

      <UserList
        users={users}
        onEdit={setEditingUser}
        onDelete={handleDeleteUser}
      />

      {/* Create User Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <UserForm
            title="Create User"
            onSubmit={handleCreateUser}
            onCancel={() => setShowCreateForm(false)}
          />
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <UserForm
            title="Edit User"
            initialData={editingUser}
            onSubmit={handleUpdateUser}
            onCancel={() => setEditingUser(null)}
          />
        </div>
      )}
    </div>
  );
};
