// src/components/documents/DocumentCard.tsx (Enhanced)

import React from 'react';
import { Document } from '../../types/document.types';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentActions } from './DocumentActions';
import { FileIcon } from '../common/FileIcon';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { User, Calendar, Tag, ExternalLink } from 'lucide-react';

interface DocumentCardProps {
  document: Document;
  onClick?: (document: Document) => void;
  onDelete: (id: number) => Promise<void>;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onClick,
  onDelete,
}) => {
  const { user, isAdmin } = useAuth();
  const canEdit = user?.id === document.user.id || isAdmin();

  const handleCardClick = () => {
    if (onClick) {
      onClick(document);
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 ${
        onClick ? 'cursor-pointer hover:border-indigo-300' : ''
      }`}
    >
      {/* Card Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <FileIcon fileType={document.fileType} className="h-8 w-8 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-gray-900 truncate mb-1">
                {document.title}
              </h3>
              {document.category && (
                <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {document.category}
                </span>
              )}
            </div>
          </div>
          {canEdit && (
            <div onClick={(e) => e.stopPropagation()}>
              <DocumentActions 
                document={document} 
                onDelete={() => onDelete(document.id)} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 space-y-3" onClick={handleCardClick}>
        {/* Document Info */}
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <User className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{document.user.fullName}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{formatDate(document.createdAt)}</span>
          </div>
          {document.fileSize && (
            <div className="text-gray-500">
              Size: {formatFileSize(document.fileSize)}
            </div>
          )}
        </div>

        {/* Tags */}
        {document.tags && document.tags.length > 0 && (
          <div>
            <div className="flex items-center mb-2">
              <Tag className="h-4 w-4 text-gray-400 mr-1" />
              <span className="text-xs text-gray-500 font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {document.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {document.tags.length > 4 && (
                <span className="px-2 py-1 text-xs text-gray-500 bg-gray-50 rounded-md">
                  +{document.tags.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Click to view indicator */}
        {onClick && (
          <div className="flex items-center justify-center pt-2 text-xs text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <ExternalLink className="h-3 w-3 mr-1" />
            Click to view details
          </div>
        )}
      </div>
    </div>
  );
};