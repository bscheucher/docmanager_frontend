// src/components/documents/DocumentActions.tsx

import React, { useState } from 'react';
import { Document } from '../../types/document.types';
import { documentService } from '../../services/document.service';
import { MoreHorizontal, Download, Edit, Trash2 } from 'lucide-react';

interface DocumentActionsProps {
  document: Document;
  onDelete: (id: number) => void;
}

export const DocumentActions: React.FC<DocumentActionsProps> = ({ document, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!document.filePath) return;
    
    try {
      setIsDownloading(true);
      const blob = await documentService.downloadDocument(document.id);
      const url = window.URL.createObjectURL(blob);
      // Use window.document to access the global DOM document object
      const link = window.document.createElement('a');
      link.href = url;
      link.download = document.title; // This correctly uses the Document prop's title
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download document');
    } finally {
      setIsDownloading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md hover:bg-gray-100"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-10">
          {document.filePath && (
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              {isDownloading ? 'Downloading...' : 'Download'}
            </button>
          )}
          <button
            onClick={() => {/* Navigate to edit */}}
            className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
          <button
            onClick={() => {
              onDelete(document.id);
              setIsOpen(false);
            }}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};