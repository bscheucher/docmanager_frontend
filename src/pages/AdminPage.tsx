// src/pages/AdminPage.tsx

import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { AdminRoute } from '../components/auth/ProtectedRoute';
import { UserManagement } from '../components/admin/UserManagement';
import { TagManagement } from '../components/admin/TagManagement';
import { SystemStats } from '../components/admin/SystemStats';
import { Users, Tags, BarChart3 } from 'lucide-react';

type AdminTab = 'users' | 'tags' | 'stats';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('stats');

  const tabs = [
    { id: 'stats' as AdminTab, label: 'System Stats', icon: BarChart3 },
    { id: 'users' as AdminTab, label: 'User Management', icon: Users },
    { id: 'tags' as AdminTab, label: 'Tag Management', icon: Tags },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'users':
        return <UserManagement />;
      case 'tags':
        return <TagManagement />;
      case 'stats':
        return <SystemStats />;
      default:
        return <SystemStats />;
    }
  };

  return (
    <AdminRoute>
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600">Manage users, tags, and system settings</p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div>{renderTabContent()}</div>
        </div>
      </Layout>
    </AdminRoute>
  );
};
