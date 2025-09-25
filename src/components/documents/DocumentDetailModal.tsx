// src/components/documents/DocumentDetailModal.tsx

import React, { useState } from 'react';
import { Document } from '../../types/document.types';
import { useAuth } from '../../contexts/AuthContext';
import { documentService } from '../../services/document.service';
import { FileIcon } from '../common/FileIcon';
import { formatFileSize, formatDate } from '../../utils/formatters';
import { 
  X, 
  Download, 
  Edit, 
  Trash2, 
  User, 
  Calendar, 
  Tag, 
  FileText,
  Info
} from 'lucide-react';

interface DocumentDetailModalProps {
  document: Document;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
}

export const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({
  document,
  onClose,
  onDelete,
}) => {
  const { user, isAdmin } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const canEdit = user?.id === document.user.id || isAdmin();

  const handleDownload = async () => {
    if (!document.filePath) return;
    
    try {
      setIsDownloading(true);
      const blob = await documentService.downloadDocument(document.id);
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.title;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        setIsDeleting(true);
        await onDelete(document.id);
        onClose();
      } catch (error) {
        console.error('Delete failed:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <FileIcon fileType={document.fileType} className="h-8 w-8" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900 truncate">
                {document.title}
              </h2>
              {document.category && (
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full mt-1">
                  {document.category}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Document Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <div>
                <span className="font-medium">Owner: </span>
                {document.user.fullName}
              </div>
            </div>

            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <div>
                <span className="font-medium">Created: </span>
                {formatDate(document.createdAt)}
              </div>
            </div>

            {document.fileType && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <div>
                  <span className="font-medium">Type: </span>
                  {document.fileType}
                </div>
              </div>
            )}

            {document.fileSize && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Info className="h-4 w-4" />
                <div>
                  <span className="font-medium">Size: </span>
                  {formatFileSize(document.fileSize)}
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          {document.tags && document.tags.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Tag className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {document.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extracted Text Preview */}
          {document.extractedText && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Text Content Preview
              </h3>
              <div className="bg-gray-50 border rounded-md p-3 max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {document.extractedText.length > 500
                    ? `${document.extractedText.substring(0, 500)}...`
                    : document.extractedText
                  }
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {canEdit && (
          <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
            {document.filePath && (
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <Download className="h-4 w-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download'}
              </button>
            )}
            
            <button
              onClick={() => {/* TODO: Implement edit functionality */}}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
            
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};