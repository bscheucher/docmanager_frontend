// src/components/documents/DocumentViewer.tsx

import React from 'react';
import { Document } from '../../types/document.types';
import { X, Download, ExternalLink } from 'lucide-react';
import { formatFileSize, formatDate } from '../../utils/formatters';

interface DocumentViewerProps {
  document: Document;
  onClose: () => void;
  onDownload: () => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onClose,
  onDownload,
}) => {
  const renderPreview = () => {
    if (!document.fileType) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No preview available</p>
        </div>
      );
    }

    // Image preview
    if (document.fileType.startsWith('image/')) {
      return (
        <div className="flex justify-center bg-gray-50 rounded-lg p-4">
          <img
            src={`/api/documents/${document.id}/download`}
            alt={document.title}
            className="max-h-96 max-w-full object-contain rounded"
          />
        </div>
      );
    }

    // PDF preview
    if (document.fileType === 'application/pdf') {
      return (
        <div className="h-96 bg-gray-50 rounded-lg">
          <iframe
            src={`/api/documents/${document.id}/download`}
            className="w-full h-full rounded-lg"
            title={document.title}
          />
        </div>
      );
    }

    // Text preview
    if (document.extractedText) {
      return (
        <div className="h-96 bg-gray-50 rounded-lg p-4 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {document.extractedText.slice(0, 2000)}
            {document.extractedText.length > 2000 && '...'}
          </pre>
        </div>
      );
    }

    // Default preview
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-lg">
        <ExternalLink className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-gray-500">Preview not available</p>
        <p className="text-sm text-gray-400">Click download to view file</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-gray-900 truncate">
              {document.title}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
              <span>{document.user.fullName}</span>
              <span>{formatDate(document.createdAt)}</span>
              {document.fileSize && <span>{formatFileSize(document.fileSize)}</span>}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onDownload}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderPreview()}
          
          {/* Document metadata */}
          <div className="mt-6 border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {document.category && (
                <div>
                  <span className="font-medium text-gray-700">Category:</span>
                  <span className="ml-2 text-gray-600">{document.category}</span>
                </div>
              )}
              {document.tags && document.tags.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Tags:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {document.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};