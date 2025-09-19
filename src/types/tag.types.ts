// src/types/tag.types.ts

export interface Tag {
  id: number;
  name: string;
  documentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface TagStats {
  totalTags: number;
  usedTags: number;
  unusedTags: number;
}