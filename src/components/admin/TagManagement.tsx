// src/components/admin/TagManagement.tsx

import React, { useState } from 'react';
import { useTags } from '../../hooks/useTags';
import { tagService } from '../../services/tag.service';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { formatDate } from '../../utils/formatters';
import { Plus, Trash2, Tag, AlertTriangle } from 'lucide-react';

export const TagManagement: React.FC = () => {
  const { tags, loading, error, createTag, deleteTag, refetch } = useTags();
  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setIsCreating(true);
      await createTag({ name: newTagName.trim() });
      setNewTagName('');
    } catch (error: any) {
      alert('Failed to create tag: ' + error.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTag = async (id: number) => {
    const tag = tags.find(t => t.id === id);
    if (!tag) return;

    const confirmMessage = tag.documentCount > 0
      ? `This tag is used by ${tag.documentCount} document(s). Are you sure you want to delete it?`
      : 'Are you sure you want to delete this tag?';

    if (window.confirm(confirmMessage)) {
      try {
        await deleteTag(id);
      } catch (error: any) {
        alert('Failed to delete tag: ' + error.message);
      }
    }
  };

  const handleCleanupUnusedTags = async () => {
    if (window.confirm('This will delete all unused tags. Are you sure?')) {
      try {
        setIsCleaningUp(true);
        await tagService.deleteUnusedTags();
        await refetch();
      } catch (error: any) {
        alert('Failed to cleanup tags: ' + error.message);
      } finally {
        setIsCleaningUp(false);
      }
    }
  };

  const unusedTags = tags.filter(tag => tag.documentCount === 0);

  if (loading) return <LoadingSpinner message="Loading tags..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tags ({tags.length})</h2>
          {unusedTags.length > 0 && (
            <p className="text-sm text-amber-600 flex items-center mt-1">
              <AlertTriangle className="h-4 w-4 mr-1" />
              {unusedTags.length} unused tag(s)
            </p>
          )}
        </div>
        <div className="flex space-x-3">
          {unusedTags.length > 0 && (
            <button
              onClick={handleCleanupUnusedTags}
              disabled={isCleaningUp}
              className="px-4 py-2 text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-md disabled:opacity-50"
            >
              {isCleaningUp ? 'Cleaning...' : 'Cleanup Unused'}
            </button>
          )}
        </div>
      </div>

      {/* Create Tag Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-md font-medium text-gray-900 mb-4">Create New Tag</h3>
        <form onSubmit={handleCreateTag} className="flex space-x-3">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Tag name"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={isCreating || !newTagName.trim()}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>

      {/* Tags List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tag
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tags.map((tag) => (
              <tr key={tag.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-400 mr-3" />
                    <div className="text-sm font-medium text-gray-900">
                      {tag.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    tag.documentCount > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {tag.documentCount}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(tag.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
