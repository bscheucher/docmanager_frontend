// src/pages/DocumentsPage.tsx

import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { DocumentList } from '../components/documents/DocumentList';
import { DocumentUpload } from '../components/documents/DocumentUpload';
import { DocumentDetailModal } from '../components/documents/DocumentDetailModal';
import { SearchAndFilters } from '../components/documents/SearchAndFilters';
import { useSearch } from '../hooks/useSearch';
import { useDocuments } from '../hooks/useDocuments';
import { Document } from '../types/document.types';
import { Upload, Plus, Grid, List } from 'lucide-react';

type ViewMode = 'grid' | 'list';

export const DocumentsPage: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  
  const { searchDocuments, searchResults, isSearching, clearResults } = useSearch();
  const { 
    documents, 
    loading, 
    error, 
    uploadDocument, 
    deleteDocument,
    refetch 
  } = useDocuments(selectedCategory || undefined);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      await searchDocuments(query);
    } else {
      clearResults();
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (searchQuery) {
      setSearchQuery('');
      clearResults();
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    refetch();
  };

  const handleDocumentClick = (document: Document) => {
    setSelectedDocument(document);
  };

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
        // Close detail modal if the deleted document was selected
        if (selectedDocument?.id === id) {
          setSelectedDocument(null);
        }
      } catch (error: any) {
        alert('Failed to delete document: ' + error.message);
      }
    }
  };

  const displayDocuments = searchQuery.trim() 
    ? searchResults.documents 
    : documents;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with search, filters, and actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Documents ({displayDocuments.length})
            </h1>
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearch={handleSearch}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              isSearching={isSearching}
            />
          </div>
          
          <div className="flex items-center space-x-3">
            {/* View Mode Toggle */}
            <div className="flex rounded-md border border-gray-300">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="Grid view"
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Upload Button */}
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </button>
          </div>
        </div>

        {/* Search Results Info */}
        {searchQuery && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-blue-800">
              Found {searchResults.documents.length} documents matching "{searchQuery}"
              <button
                onClick={() => handleSearch('')}
                className="ml-2 text-blue-600 hover:text-blue-800 underline"
              >
                Clear search
              </button>
            </p>
          </div>
        )}

        {/* Document List */}
        <DocumentList
          documents={displayDocuments}
          loading={loading}
          error={error}
          viewMode={viewMode}
          onDocumentClick={handleDocumentClick}
          onDeleteDocument={handleDeleteDocument}
          onUploadClick={() => setShowUpload(true)}
        />

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <DocumentUpload
              onSuccess={handleUploadSuccess}
              onCancel={() => setShowUpload(false)}
              uploadFunction={uploadDocument}
            />
          </div>
        )}

        {/* Document Detail Modal */}
        {selectedDocument && (
          <DocumentDetailModal
            document={selectedDocument}
            onClose={() => setSelectedDocument(null)}
            onDelete={handleDeleteDocument}
          />
        )}
      </div>
    </Layout>
  );
};