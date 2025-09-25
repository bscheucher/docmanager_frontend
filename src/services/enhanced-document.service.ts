// src/services/enhanced-document.service.ts

import axios, { AxiosResponse } from 'axios';
import { Document, CreateDocumentRequest, UpdateDocumentRequest, DocumentStats } from '../types/document.types';
import { SearchFilters } from '../components/documents/AdvancedSearch';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class EnhancedDocumentService {
  private readonly ENDPOINTS = {
    DOCUMENTS: `${API_URL}/documents`,
    UPLOAD: `${API_URL}/documents/upload`,
    DOWNLOAD: (id: number) => `${API_URL}/documents/${id}/download`,
    SEARCH: `${API_URL}/documents/search`,
    ADVANCED_SEARCH: `${API_URL}/documents/search/advanced`,
    STATS: `${API_URL}/documents/stats`,
    PREVIEW: (id: number) => `${API_URL}/documents/${id}/preview`,
  };

  async getAllDocuments(category?: string): Promise<Document[]> {
    const params = category ? { category } : {};
    const response: AxiosResponse<Document[]> = await axios.get(this.ENDPOINTS.DOCUMENTS, { params });
    return response.data;
  }

  async getDocumentById(id: number): Promise<Document> {
    const response: AxiosResponse<Document> = await axios.get(`${this.ENDPOINTS.DOCUMENTS}/${id}`);
    return response.data;
  }

  async searchDocuments(query: string): Promise<Document[]> {
    const response: AxiosResponse<Document[]> = await axios.get(this.ENDPOINTS.SEARCH, {
      params: { query }
    });
    return response.data;
  }

  async advancedSearch(filters: SearchFilters): Promise<Document[]> {
    // Convert filters to query parameters
    const params: any = {};
    
    if (filters.query) params.query = filters.query;
    if (filters.category) params.category = filters.category;
    if (filters.fileType) params.fileType = filters.fileType;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.author) params.author = filters.author;
    if (filters.tags.length > 0) params.tags = filters.tags.join(',');

    const response: AxiosResponse<Document[]> = await axios.get(this.ENDPOINTS.ADVANCED_SEARCH, { params });
    return response.data;
  }

  async createDocument(document: CreateDocumentRequest): Promise<Document> {
    const response: AxiosResponse<Document> = await axios.post(this.ENDPOINTS.DOCUMENTS, document);
    return response.data;
  }

  async updateDocument(id: number, document: UpdateDocumentRequest): Promise<Document> {
    const response: AxiosResponse<Document> = await axios.put(`${this.ENDPOINTS.DOCUMENTS}/${id}`, document);
    return response.data;
  }

  async deleteDocument(id: number): Promise<void> {
    await axios.delete(`${this.ENDPOINTS.DOCUMENTS}/${id}`);
  }

  async uploadDocument(file: File, title: string, category?: string, tags?: string[]): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    if (category) formData.append('category', category);
    if (tags && tags.length > 0) formData.append('tags', tags.join(','));

    const response: AxiosResponse<Document> = await axios.post(this.ENDPOINTS.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }

  async downloadDocument(id: number): Promise<Blob> {
    const response: AxiosResponse<Blob> = await axios.get(this.ENDPOINTS.DOWNLOAD(id), {
      responseType: 'blob'
    });
    return response.data;
  }

  async getDocumentPreview(id: number): Promise<string> {
    const response: AxiosResponse<{ preview: string }> = await axios.get(this.ENDPOINTS.PREVIEW(id));
    return response.data.preview;
  }

  async getDocumentStats(): Promise<DocumentStats> {
    const response: AxiosResponse<DocumentStats> = await axios.get(this.ENDPOINTS.STATS);
    return response.data;
  }

  // Utility method for client-side filtering (backup for when backend search is not available)
  filterDocuments(documents: Document[], filters: SearchFilters): Document[] {
    let filtered = [...documents];

    // Text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.user.fullName.toLowerCase().includes(query) ||
        (doc.extractedText && doc.extractedText.toLowerCase().includes(query))
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(doc => doc.category === filters.category);
    }

    // File type filter
    if (filters.fileType) {
      filtered = filtered.filter(doc => 
        doc.fileType && doc.fileType.startsWith(filters.fileType)
      );
    }

    // Date filters
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(doc => new Date(doc.createdAt) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(doc => new Date(doc.createdAt) <= toDate);
    }

    // Tags filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(doc =>
        doc.tags && filters.tags.some(tag => doc.tags!.includes(tag))
      );
    }

    // Author filter
    if (filters.author) {
      const author = filters.author.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.user.fullName.toLowerCase().includes(author) ||
        doc.user.username.toLowerCase().includes(author)
      );
    }

    return filtered;
  }
}

export const enhancedDocumentService = new EnhancedDocumentService();