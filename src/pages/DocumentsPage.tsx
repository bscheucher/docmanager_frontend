// src/pages/DocumentsPage.tsx

import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { DocumentList } from '../components/documents/DocumentList';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { SearchBar } from '../components/common/SearchBar';
import { useSearch } from '../hooks/useSearch';
import { Upload, Plus } from 'lucide-react';

export const DocumentsPage: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { searchDocuments, searchResults, isSearching } = useSearch();

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchDocuments(query);
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    // Refresh the document list (handled by useDocuments hook)
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with search and upload */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1 max-w-lg">
            <SearchBar
              placeholder="Search documents..."
              onSearch={handleSearch}
              isLoading={isSearching}
            />
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Document
          </button>
        </div>

        {/* Search Results */}
        {searchQuery && searchResults.documents.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Search Results ({searchResults.documents.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.documents.map((document) => (
                <div key={document.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <h3 className="font-medium text-gray-900">{document.title}</h3>
                  <p className="text-sm text-gray-600">{document.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document List */}
        <DocumentList />

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <DocumentUpload
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUpload(false)}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};
