// src/components/documents/DocumentList.tsx (Enhanced)

import React from 'react';
import { Document } from '../../types/document.types';
import { DocumentCard } from './DocumentCard';
import { DocumentListItem } from './DocumentListItem';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { FileText, Plus } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  loading: boolean;
  error: string | null;
  viewMode?: 'grid' | 'list';
  onDocumentClick?: (document: Document) => void;
  onDeleteDocument: (id: number) => Promise<void>;
  onUploadClick?: () => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  loading,
  error,
  viewMode = 'grid',
  onDocumentClick,
  onDeleteDocument,
  onUploadClick
}) => {
  if (loading) return <LoadingSpinner message="Loading documents..." />;
  if (error) return <ErrorMessage message={error} />;

  if (documents.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No documents found"
        description="Upload your first document to get started."
        action={
          onUploadClick && (
            <button
              onClick={onUploadClick}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Upload Document
            </button>
          )
        }
      />
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="divide-y divide-gray-200">
          {documents.map((document) => (
            <DocumentListItem
              key={document.id}
              document={document}
              onClick={onDocumentClick}
              onDelete={onDeleteDocument}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onClick={onDocumentClick}
          onDelete={onDeleteDocument}
        />
      ))}
    </div>
  );
};