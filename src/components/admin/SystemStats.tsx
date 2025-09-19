
// src/components/admin/SystemStats.tsx

import React, { useEffect, useState } from 'react';
import { documentService } from '../../services/document.service';
import { tagService } from '../../services/tag.service';
import { userService } from '../../services/user.service';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { 
  Users, 
  FileText, 
  Tags, 
  TrendingUp, 
  Database, 
  Activity 
} from 'lucide-react';

interface SystemStatsData {
  totalUsers: number;
  totalDocuments: number;
  totalTags: number;
  usedTags: number;
  unusedTags: number;
  recentActivity: {
    newUsersThisWeek: number;
    documentsUploadedThisWeek: number;
  };
}

export const SystemStats: React.FC = () => {
  const [stats, setStats] = useState<SystemStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        const [users, documentStats, tagStats] = await Promise.all([
          userService.getAllUsers(),
          documentService.getDocumentStats(),
          tagService.getTagStats(),
        ]);

        // Calculate recent activity (simplified - in real app, you'd have endpoints for this)
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        const newUsersThisWeek = users.filter(
          user => new Date(user.createdAt) > oneWeekAgo
        ).length;

        setStats({
          totalUsers: users.length,
          totalDocuments: documentStats.totalDocuments,
          totalTags: tagStats.totalTags,
          usedTags: tagStats.usedTags,
          unusedTags: tagStats.unusedTags,
          recentActivity: {
            newUsersThisWeek,
            documentsUploadedThisWeek: 0, // Would need backend support
          },
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch system stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner message="Loading system stats..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Documents',
      value: stats.totalDocuments,
      icon: FileText,
      color: 'bg-green-500',
    },
    {
      title: 'Total Tags',
      value: stats.totalTags,
      icon: Tags,
      color: 'bg-purple-500',
    },
    {
      title: 'Used Tags',
      value: stats.usedTags,
      icon: Database,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">System Overview</h2>
        <p className="text-gray-600">Current system statistics and metrics</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <Activity className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {stats.recentActivity.newUsersThisWeek}
            </div>
            <div className="text-sm text-gray-600">New users this week</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {stats.recentActivity.documentsUploadedThisWeek}
            </div>
            <div className="text-sm text-gray-600">Documents uploaded this week</div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="h-5 w-5 text-gray-500 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">System Health</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Tag Usage Rate</span>
            <div className="flex items-center">
              <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${stats.totalTags > 0 ? (stats.usedTags / stats.totalTags) * 100 : 0}%`,
                  }}
                />
              </div>
              <span className="text-sm font-medium text-gray-900">
                {stats.totalTags > 0 ? Math.round((stats.usedTags / stats.totalTags) * 100) : 0}%
              </span>
            </div>
          </div>
          {stats.unusedTags > 0 && (
            <div className="text-sm text-amber-600">
              {stats.unusedTags} unused tags can be cleaned up
            </div>
          )}
        </div>
      </div>
    </div>
  );
};