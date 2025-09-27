// src/components/dashboard/TagCreationWidget.tsx

import React, { useState } from 'react';
import { useTags } from '../../hooks/useTags';
import { Tag, Plus, X } from 'lucide-react';

export const TagCreationWidget: React.FC = () => {
  const { tags, createTag, loading } = useTags();
  const [newTagName, setNewTagName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleCreateTag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    try {
      setIsCreating(true);
      setError('');
      await createTag({ name: newTagName.trim() });
      setNewTagName('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create tag');
    } finally {
      setIsCreating(false);
    }
  };

  const recentTags = tags
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  const popularTags = tags
    .sort((a, b) => b.documentCount - a.documentCount)
    .slice(0, 8);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Tag className="h-5 w-5 mr-2 text-indigo-600" />
          Tag Management
        </h3>
        <span className="text-sm text-gray-500">{tags.length} total tags</span>
      </div>

      {/* Create New Tag */}
      <form onSubmit={handleCreateTag} className="mb-6">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="Create new tag..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={isCreating || !newTagName.trim()}
            className="inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 text-sm"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isCreating ? 'Creating...' : 'Create'}
          </button>
        </div>
        {error && (
          <p className="text-red-600 text-xs mt-1">{error}</p>
        )}
      </form>

      {/* Popular Tags */}
      {popularTags.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Popular Tags</h4>
          <div className="flex flex-wrap gap-1">
            {popularTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
              >
                {tag.name}
                <span className="ml-1 text-green-600">({tag.documentCount})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tags */}
      {recentTags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Tags</h4>
          <div className="flex flex-wrap gap-1">
            {recentTags.map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag.name}
                <span className="ml-1 text-blue-600">({tag.documentCount})</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {tags.length === 0 && !loading && (
        <div className="text-center py-4">
          <Tag className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500">No tags created yet</p>
        </div>
      )}
    </div>
  );
};