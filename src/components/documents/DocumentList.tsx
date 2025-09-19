// src/components/documents/DocumentList.tsx

import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { DocumentCard } from './DocumentCard';
import { DocumentFilters } from './DocumentFilters';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ErrorMessage } from '../common/ErrorMessage';
import { EmptyState } from '../common/EmptyState';
import { FileText } from 'lucide-react';

export const DocumentList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const { documents, loading, error, deleteDocument } = useDocuments(selectedCategory || undefined);

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
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents found"
          description="Upload your first document to get started."
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