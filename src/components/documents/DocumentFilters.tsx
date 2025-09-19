// src/components/documents/DocumentFilters.tsx

import React from 'react';
import { Filter } from 'lucide-react';

interface DocumentFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CATEGORIES = ['Work', 'Personal', 'Finance', 'Legal', 'Medical', 'Education'];

export const DocumentFilters: React.FC<DocumentFiltersProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Filter className="h-4 w-4 text-gray-500 mr-2" />
        <span className="text-sm text-gray-700">Filter by category:</span>
      </div>
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">All Categories</option>
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};