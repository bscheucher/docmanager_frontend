// src/components/dashboard/Dashboard.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useDocuments } from '../../hooks/useDocuments';
import { useUsers } from '../../hooks/useUsers';
import { useTags } from '../../hooks/useTags';
import { Layout } from '../layout/Layout';
import { DocumentUpload } from '../documents/DocumentUpload';
import { DocumentCard } from '../documents/DocumentCard';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { EmptyState } from '../common/EmptyState';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { 
  FileText, 
  Users, 
  Upload, 
  Search,
  TrendingUp,
  Shield,
  Clock,
  Star,
  Plus,
  Activity,
  Calendar,
  Archive
} from 'lucide-react';

interface DashboardStats {
  totalDocuments: number;
  recentUploads: number;
  storageUsed: number;
  totalUsers?: number;
  totalTags: number;
}

export const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { documents, loading: documentsLoading, deleteDocument, uploadDocument } = useDocuments();
  const { users, loading: usersLoading } = useUsers();
  const { tags, loading: tagsLoading } = useTags();
  
  const [showUpload, setShowUpload] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0,
    recentUploads: 0,
    storageUsed: 0,
    totalUsers: 0,
    totalTags: 0
  });

  // Calculate dashboard statistics
  useEffect(() => {
    if (!documentsLoading && !usersLoading && !tagsLoading) {
      // Calculate recent uploads (last 7 days)
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      const recentUploads = documents.filter(doc => 
        new Date(doc.createdAt) > oneWeekAgo
      ).length;

      // Calculate total storage used
      const storageUsed = documents.reduce((total, doc) => 
        total + (doc.fileSize || 0), 0
      );

      setStats({
        totalDocuments: documents.length,
        recentUploads,
        storageUsed,
        totalUsers: isAdmin() ? users.length : undefined,
        totalTags: tags.length
      });
    }
  }, [documents, users, tags, documentsLoading, usersLoading, tagsLoading, isAdmin]);

  // Get recent documents (last 5)
  const recentDocuments = documents
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleUploadSuccess = () => {
    setShowUpload(false);
    // Documents state will be automatically updated via uploadDocument function
  };

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
      } catch (error: any) {
        alert('Failed to delete document: ' + error.message);
      }
    }
  };

  // Handle upload with the Dashboard's uploadDocument function
  const handleUpload = async (file: File, title: string, category?: string, tags?: string[]) => {
    return await uploadDocument(file, title, category, tags);
  };

  // Create stats array for display
  const statsArray = [
    {
      name: 'Total Documents',
      value: stats.totalDocuments.toString(),
      icon: FileText,
      change: stats.recentUploads > 0 ? `+${stats.recentUploads} this week` : 'No recent uploads',
      changeType: 'neutral' as const,
    },
    {
      name: 'Recent Uploads',
      value: stats.recentUploads.toString(),
      icon: Upload,
      change: 'Last 7 days',
      changeType: 'neutral' as const,
    },
    {
      name: 'Storage Used',
      value: formatFileSize(stats.storageUsed),
      icon: TrendingUp,
      change: `${stats.totalDocuments} files`,
      changeType: 'neutral' as const,
    },
    {
      name: 'Total Tags',
      value: stats.totalTags.toString(),
      icon: Archive,
      change: 'Available',
      changeType: 'neutral' as const,
    },
  ];

  // Add user stats for admin
  if (isAdmin() && stats.totalUsers !== undefined) {
    statsArray.push({
      name: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      change: 'Registered',
      changeType: 'neutral' as const,
    });
  }

  const isLoading = documentsLoading || (isAdmin() && usersLoading) || tagsLoading;

  if (isLoading) {
    return (
      <Layout>
        <LoadingSpinner message="Loading dashboard..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold">Tailwind Test</h1>
          <p className="text-blue-100 mt-2">If you see blue background and white text, Tailwind is working!</p>
        </div>
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
          {statsArray.map((stat) => (
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
                      <div className="ml-2 flex items-baseline text-sm font-medium text-gray-500">
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
              <button 
                onClick={() => setShowUpload(true)}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <Upload className="h-5 w-5 mr-2 text-indigo-600" />
                Upload Document
              </button>
              <button 
                onClick={() => window.location.href = '/documents'}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <Search className="h-5 w-5 mr-2 text-indigo-600" />
                Search Documents
              </button>
              <button 
                onClick={() => window.location.href = '/documents'}
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                <FileText className="h-5 w-5 mr-2 text-indigo-600" />
                View All Documents
              </button>
            </div>
          </div>
        </div>

        {/* Recent Documents */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Recent Documents</h3>
              {documents.length > 5 && (
                <button 
                  onClick={() => window.location.href = '/documents'}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all →
                </button>
              )}
            </div>
          </div>
          
          {recentDocuments.length === 0 ? (
            <div className="p-6">
              <EmptyState
                icon={FileText}
                title="No documents yet"
                description="Upload your first document to get started."
                action={
                  <button
                    onClick={() => setShowUpload(true)}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </button>
                }
              />
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-200">
                {recentDocuments.map((doc) => (
                  <div key={doc.id} className="px-6 py-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-8 w-8 text-gray-400" />
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                          <p className="text-sm text-gray-500">
                            {doc.category && `${doc.category} • `}
                            {doc.fileSize ? formatFileSize(doc.fileSize) : 'Unknown size'}
                            {doc.user.username !== user?.username && ` • by ${doc.user.fullName}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDate(doc.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-3 bg-gray-50">
                <button 
                  onClick={() => window.location.href = '/documents'}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View all documents →
                </button>
              </div>
            </>
          )}
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
              <button 
                onClick={() => window.location.href = '/admin'}
                className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition-colors"
              >
                Access Admin Panel
              </button>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <DocumentUpload
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUpload(false)}
              uploadFunction={handleUpload}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};