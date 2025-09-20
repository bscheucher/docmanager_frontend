// src/components/documents/DocumentList.tsx

import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { Document } from '../../types/document.types';
import { DocumentCard } from './DocumentCard';
import { DocumentFilters } from './DocumentFilters';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { FileText } from 'lucide-react';

interface DocumentListProps {
  // Optional props - if provided, use these instead of the hook
  documents?: Document[];
  loading?: boolean;
  error?: string | null;
  selectedCategory?: string;
  onCategoryChange?: (category: string) => void;
  onDeleteDocument?: (id: number) => Promise<void>;
  onUploadClick?: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ 
  documents: propDocuments,
  loading: propLoading,
  error: propError,
  selectedCategory: propSelectedCategory,
  onCategoryChange: propOnCategoryChange,
  onDeleteDocument: propOnDeleteDocument,
  onUploadClick 
}) => {
  // Local state for when props are not provided
  const [localSelectedCategory, setLocalSelectedCategory] = useState<string>('');
  
  // Use hook only if props are not provided
  const { 
    documents: hookDocuments, 
    loading: hookLoading, 
    error: hookError, 
    deleteDocument: hookDeleteDocument 
  } = useDocuments(
    propDocuments !== undefined ? undefined : (localSelectedCategory || undefined)
  );

  // Determine which values to use
  const documents = propDocuments ?? hookDocuments;
  const loading = propLoading ?? hookLoading;
  const error = propError ?? hookError;
  const selectedCategory = propSelectedCategory ?? localSelectedCategory;
  const onCategoryChange = propOnCategoryChange ?? setLocalSelectedCategory;
  const deleteDocument = propOnDeleteDocument ?? hookDeleteDocument;

  const handleDeleteDocument = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await deleteDocument(id);
      } catch (error: any) {
        alert('Failed to delete document: ' + error.message);
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
        <DocumentFilters
          selectedCategory={selectedCategory}
          onCategoryChange={onCategoryChange}
        />
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description={selectedCategory 
            ? `No documents found in the "${selectedCategory}" category.`
            : "Upload your first document to get started."
          }
          action={
            onUploadClick && !selectedCategory ? (
              <button
                onClick={onUploadClick}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Upload Document
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onDelete={handleDeleteDocument}
            />
          ))}
        </div>
      )}
    </div>
  );
};