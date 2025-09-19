// src/hooks/useSearch.ts

import { useState, useCallback } from 'react';
import { Document } from '../types/document.types';
import { Tag } from '../types/tag.types';
import { documentService } from '../services/document.service';
import { tagService } from '../services/tag.service';

export const useSearch = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    documents: Document[];
    tags: Tag[];
  }>({ documents: [], tags: [] });

  const searchDocuments = useCallback(async (query: string): Promise<Document[]> => {
    if (!query.trim()) return [];
    setIsSearching(true);
    try {
      const results = await documentService.searchDocuments(query);
      setSearchResults(prev => ({ ...prev, documents: results }));
      return results;
    } finally {
      setIsSearching(false);
    }
  }, []);

  const searchTags = useCallback(async (query: string): Promise<Tag[]> => {
    if (!query.trim()) return [];
    setIsSearching(true);
    try {
      const results = await tagService.searchTags(query);
      setSearchResults(prev => ({ ...prev, tags: results }));
      return results;
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearResults = () => {
    setSearchResults({ documents: [], tags: [] });
  };

  return {
    isSearching,
    searchResults,
    searchDocuments,
    searchTags,
    clearResults,
  };
};