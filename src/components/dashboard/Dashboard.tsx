// src/components/dashboard/Dashboard.tsx

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Layout } from '../layout/Layout';
import { 
  FileText, 
  Users, 
  Upload, 
  Search,
  TrendingUp,
  Shield,
  Clock,
  Star
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const stats = [
    {
      name: 'Total Documents',
      value: '12',
      icon: FileText,
      change: '+2.5%',
      changeType: 'increase',
    },
    {
      name: 'Recent Uploads',
      value: '3',
      icon: Upload,
      change: '+12.5%',
      changeType: 'increase',
    },
    {
      name: 'Storage Used',
      value: '2.4 GB',
      icon: TrendingUp,
      change: '+4.5%',
      changeType: 'increase',
    },
  ];

  if (isAdmin()) {
    stats.push({
      name: 'Total Users',
      value: '24',
      icon: Users,
      change: '+8.2%',
      changeType: 'increase',
    });
  }

  const recentDocuments = [
    {
      id: 1,
      title: 'Project Proposal 2024',
      category: 'Work',
      uploadedAt: '2 hours ago',
      size: '2.4 MB',
    },
    {
      id: 2,
      title: 'Invoice #INV-001',
      category: 'Finance',
      uploadedAt: '1 day ago',
      size: '856 KB',
    },
    {
      id: 3,
      title: 'Meeting Notes',
      category: 'Work',
      uploadedAt: '3 days ago',
      size: '124 KB',
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.firstName || user?.username}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your documents today.
              </p>
            </div>
            {isAdmin() && (
              <div className="flex items-center px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-8 w-8 text-indigo-600" />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900">
                        {stat.value}
                      </div>
                      <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                        {stat.change}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                <Upload className="h-5 w-5 mr-2 text-indigo-600" />
                Upload Document
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                <Search className="h-5 w-5 mr-2 text-indigo-600" />
                Search Documents
              </button>
              <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                View All Documents
              </button>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Documents</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentDocuments.map((doc) => (
              <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        {doc.category} • {doc.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {doc.uploadedAt}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50">
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
              View all documents →
            </button>
          </div>
        </div>

        {/* Admin Panel Access */}
        {isAdmin() && (
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-lg font-medium">Admin Panel</h3>
                <p className="text-indigo-100 mt-1">
                  Manage users, documents, and system settings
                </p>
              </div>
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors">
                Access Admin Panel
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};