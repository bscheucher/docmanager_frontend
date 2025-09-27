// src/components/dashboard/QuickDocumentTagger.tsx

import React, { useState } from 'react';
import { useDocuments } from '../../hooks/useDocuments';
import { useTags } from '../../hooks/useTags';
import { Document } from '../../types/document.types';
import { documentService } from '../../services/document.service';
import { FileText, Tag, Save, X, Search } from 'lucide-react';

interface QuickDocumentTaggerProps {
  onClose: () => void;
}

export const QuickDocumentTagger: React.FC<QuickDocumentTaggerProps> = ({ onClose }) => {
  const { documents, loading: documentsLoading } = useDocuments();
  const { tags } = useTags();
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 10);

  const handleDocumentSelect = (document: Document) => {
    setSelectedDocument(document);
    setSelectedTags(document.tags || []);
    setError('');
    setSuccess('');
  };

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const handleSave = async () => {
    if (!selectedDocument) return;

    try {
      setIsSaving(true);
      setError('');
      await documentService.updateDocument(selectedDocument.id, {
        title: selectedDocument.title,
        category: selectedDocument.category,
        extractedText: selectedDocument.extractedText,
        tags: selectedTags
      });
      setSuccess('Tags updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update tags');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center">
            <Tag className="h-5 w-5 mr-2" />
            Quick Tag Documents
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Document Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Document
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Document List */}
          {searchQuery && (
            <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-md">
              {filteredDocuments.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => handleDocumentSelect(doc)}
                  className={`w-full text-left p-3 border-b border-gray-100 hover:bg-gray-50 flex items-center ${
                    selectedDocument?.id === doc.id ? 'bg-indigo-50 border-indigo-200' : ''
                  }`}
                >
                  <FileText className="h-4 w-4 text-gray-400 mr-3 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{doc.title}</p>
                    <p className="text-xs text-gray-500">
                      {doc.category && `${doc.category} • `}
                      {doc.tags?.length || 0} tags
                    </p>
                  </div>
                </button>
              ))}
              {filteredDocuments.length === 0 && searchQuery && (
                <p className="p-3 text-sm text-gray-500 text-center">No documents found</p>
              )}
            </div>
          )}

          {/* Selected Document Info */}
          {selectedDocument && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Selected Document</h3>
              <p className="text-lg font-medium text-indigo-600">{selectedDocument.title}</p>
              {selectedDocument.category && (
                <p className="text-sm text-gray-600">Category: {selectedDocument.category}</p>
              )}
            </div>
          )}

          {/* Tag Selection */}
          {selectedDocument && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Tags ({selectedTags.length} selected)
              </label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag.name)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedTags.includes(tag.name)
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tag.name}
                    {selectedTags.includes(tag.name) && (
                      <span className="ml-1">✓</span>
                    )}
                  </button>
                ))}
              </div>
              {tags.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  No tags available. Create some tags first.
                </p>
              )}
            </div>
          )}

          {/* Status Messages */}
          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-md border border-green-200">
              {success}
            </div>
          )}
          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!selectedDocument || isSaving}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Tags'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};