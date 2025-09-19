// src/services/document.service.ts

import axios, { AxiosResponse } from 'axios';
import { Document, CreateDocumentRequest, UpdateDocumentRequest, DocumentStats } from '../types/document.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class DocumentService {
  private readonly ENDPOINTS = {
    DOCUMENTS: `${API_URL}/documents`,
    UPLOAD: `${API_URL}/documents/upload`,
    DOWNLOAD: (id: number) => `${API_URL}/documents/${id}/download`,
    SEARCH: `${API_URL}/documents/search`,
    STATS: `${API_URL}/documents/stats`,
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

  async searchDocuments(query: string): Promise<Document[]> {
    const response: AxiosResponse<Document[]> = await axios.get(this.ENDPOINTS.SEARCH, {
      params: { query }
    });
    return response.data;
  }

  async getDocumentStats(): Promise<DocumentStats> {
    const response: AxiosResponse<DocumentStats> = await axios.get(this.ENDPOINTS.STATS);
    return response.data;
  }
}

export const documentService = new DocumentService();