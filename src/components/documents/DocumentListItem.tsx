// src/components/documents/DocumentListItem.tsx

import React from 'react';
import { Document } from '../../types/document.types';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentActions } from './DocumentActions';
import { FileIcon } from '../common/FileIcon';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { User, Calendar, Tag } from 'lucide-react';

interface DocumentListItemProps {
  document: Document;
  onClick?: (document: Document) => void;
  onDelete: (id: number) => Promise<void>;
}

export const DocumentListItem: React.FC<DocumentListItemProps> = ({
  document,
  onClick,
  onDelete,
}) => {
  const { user, isAdmin } = useAuth();
  const canEdit = user?.id === document.user.id || isAdmin();

  const handleClick = () => {
    if (onClick) {
      onClick(document);
    }
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 transition-colors ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        {/* Main Content */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <FileIcon fileType={document.fileType} className="h-10 w-10 flex-shrink-0" />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="text-lg font-medium text-gray-900 truncate">
                {document.title}
              </h3>
              {document.category && (
                <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full flex-shrink-0">
                  {document.category}
                </span>
              )}
            </div>
            
            {/* Document Info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <User className="h-3 w-3 mr-1" />
                {document.user.fullName}
              </div>
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(document.createdAt)}
              </div>
              {document.fileSize && (
                <div>
                  {formatFileSize(document.fileSize)}
                </div>
              )}
            </div>

            {/* Tags */}
            {document.tags && document.tags.length > 0 && (
              <div className="flex items-center mt-2 space-x-2">
                <Tag className="h-3 w-3 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {document.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {document.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 text-xs text-gray-500">
                      +{document.tags.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {canEdit && (
          <div className="flex-shrink-0 ml-4" onClick={(e) => e.stopPropagation()}>
            <DocumentActions document={document} onDelete={() => onDelete(document.id)} />
          </div>
        )}
      </div>
    </div>
  );
};