// src/hooks/useDocuments.ts

import { useState, useEffect, useCallback } from 'react';
import { Document, CreateDocumentRequest, UpdateDocumentRequest } from '../types/document.types';
import { documentService } from '../services/document.service';

export const useDocuments = (category?: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await documentService.getAllDocuments(category);
      setDocuments(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  }, [category]);

  const createDocument = async (document: CreateDocumentRequest): Promise<Document> => {
    const newDocument = await documentService.createDocument(document);
    setDocuments(prev => [newDocument, ...prev]);
    return newDocument;
  };

  const updateDocument = async (id: number, document: UpdateDocumentRequest): Promise<Document> => {
    const updatedDocument = await documentService.updateDocument(id, document);
    setDocuments(prev => prev.map(doc => doc.id === id ? updatedDocument : doc));
    return updatedDocument;
  };

  const deleteDocument = async (id: number): Promise<void> => {
    await documentService.deleteDocument(id);
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const uploadDocument = async (file: File, title: string, category?: string, tags?: string[]): Promise<Document> => {
    const newDocument = await documentService.uploadDocument(file, title, category, tags);
    setDocuments(prev => [newDocument, ...prev]);
    return newDocument;
  };

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    uploadDocument,
  };
};

export const useDocument = (id: number | null) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setDocument(null);
      setLoading(false);
      return;
    }

    const fetchDocument = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await documentService.getDocumentById(id);
        setDocument(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  return { document, loading, error };
};