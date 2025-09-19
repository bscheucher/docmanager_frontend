// src/components/documents/DocumentCard.tsx

import React from 'react';
import { Document } from '../../types/document.types';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentActions } from './DocumentActions';
import { FileIcon } from '../common/FileIcon';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { User, Calendar, Tag } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  onDelete: (id: number) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document, onDelete }) => {
  const { user, isAdmin } = useAuth();
  const canEdit = user?.id === document.user.id || isAdmin();

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <FileIcon fileType={document.fileType} />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">
              {document.title}
            </h3>
            {document.category && (
              <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                {document.category}
              </span>
            )}
          </div>
        </div>
        {canEdit && (
          <DocumentActions document={document} onDelete={onDelete} />
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-2" />
          <span>{document.user.fullName}</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{formatDate(document.createdAt)}</span>
        </div>
        {document.fileSize && (
          <div className="text-gray-500">
            Size: {formatFileSize(document.fileSize)}
          </div>
        )}
      </div>

      {document.tags && document.tags.length > 0 && (
        <div className="mt-3 flex items-center flex-wrap gap-1">
          <Tag className="h-4 w-4 text-gray-400" />
          {document.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
