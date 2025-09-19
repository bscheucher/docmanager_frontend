// src/services/tag.service.ts

import axios, { AxiosResponse } from 'axios';
import { Tag, CreateTagRequest, TagStats } from '../types/tag.types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

class TagService {
  private readonly ENDPOINTS = {
    TAGS: `${API_URL}/tags`,
    MY_TAGS: `${API_URL}/tags/my`,
    SEARCH: `${API_URL}/tags/search`,
    STATS: `${API_URL}/tags/stats`,
    CHECK: (name: string) => `${API_URL}/tags/check/${name}`,
    UNUSED: `${API_URL}/tags/unused`,
  };

  async getAllTags(): Promise<Tag[]> {
    const response: AxiosResponse<Tag[]> = await axios.get(this.ENDPOINTS.TAGS);
    return response.data;
  }

  async getMyTags(): Promise<Tag[]> {
    const response: AxiosResponse<Tag[]> = await axios.get(this.ENDPOINTS.MY_TAGS);
    return response.data;
  }

  async getTagById(id: number): Promise<Tag> {
    const response: AxiosResponse<Tag> = await axios.get(`${this.ENDPOINTS.TAGS}/${id}`);
    return response.data;
  }

  async createTag(tag: CreateTagRequest): Promise<Tag> {
    const response: AxiosResponse<Tag> = await axios.post(this.ENDPOINTS.TAGS, tag);
    return response.data;
  }

  async updateTag(id: number, tag: CreateTagRequest): Promise<Tag> {
    const response: AxiosResponse<Tag> = await axios.put(`${this.ENDPOINTS.TAGS}/${id}`, tag);
    return response.data;
  }

  async deleteTag(id: number): Promise<void> {
    await axios.delete(`${this.ENDPOINTS.TAGS}/${id}`);
  }

  async searchTags(query: string): Promise<Tag[]> {
    const response: AxiosResponse<Tag[]> = await axios.get(this.ENDPOINTS.SEARCH, {
      params: { query }
    });
    return response.data;
  }

  async checkTagExists(name: string): Promise<boolean> {
    const response: AxiosResponse<boolean> = await axios.get(this.ENDPOINTS.CHECK(name));
    return response.data;
  }

  async deleteUnusedTags(): Promise<void> {
    await axios.delete(this.ENDPOINTS.UNUSED);
  }

  async getTagStats(): Promise<TagStats> {
    const response: AxiosResponse<TagStats> = await axios.get(this.ENDPOINTS.STATS);
    return response.data;
  }
}

export const tagService = new TagService();
