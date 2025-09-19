// src/types/document.types.ts

export interface Document {
  uploadedAt: string | number | Date;
  id: number;
  title: string;
  category?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  extractedText?: string;
  documentDate?: string;
  user: UserInfo;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: number;
  username: string;
  fullName: string;
}

export interface CreateDocumentRequest {
  title: string;
  category?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  extractedText?: string;
  documentDate?: string;
  tags?: string[];
}

export interface UpdateDocumentRequest {
  title: string;
  category?: string;
  filePath?: string;
  fileType?: string;
  fileSize?: number;
  extractedText?: string;
  documentDate?: string;
  tags?: string[];
}

export interface DocumentStats {
  totalDocuments: number;
}