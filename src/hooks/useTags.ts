// src/hooks/useTags.ts

import { useState, useEffect, useCallback } from 'react';
import { Tag, CreateTagRequest } from '../types/tag.types';
import { tagService } from '../services/tag.service';

export const useTags = (userTagsOnly = false) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = userTagsOnly ? await tagService.getMyTags() : await tagService.getAllTags();
      setTags(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch tags');
    } finally {
      setLoading(false);
    }
  }, [userTagsOnly]);

  const createTag = async (tag: CreateTagRequest): Promise<Tag> => {
    const newTag = await tagService.createTag(tag);
    setTags(prev => [newTag, ...prev]);
    return newTag;
  };

  const updateTag = async (id: number, tag: CreateTagRequest): Promise<Tag> => {
    const updatedTag = await tagService.updateTag(id, tag);
    setTags(prev => prev.map(t => t.id === id ? updatedTag : t));
    return updatedTag;
  };

  const deleteTag = async (id: number): Promise<void> => {
    await tagService.deleteTag(id);
    setTags(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    loading,
    error,
    refetch: fetchTags,
    createTag,
    updateTag,
    deleteTag,
  };
};