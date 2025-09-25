// src/components/documents/SearchAndFilters.tsx

import React from 'react';
import { SearchBar } from '../common/SearchBar';
import { Filter, X } from 'lucide-react';

interface SearchAndFiltersProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  isSearching?: boolean;
}

const CATEGORIES = [
  'Work', 'Personal', 'Finance', 'Legal', 'Medical', 'Education', 'Research'
];

export const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  searchQuery,
  onSearch,
  selectedCategory,
  onCategoryChange,
  isSearching = false,
}) => {
  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="max-w-md">
        <SearchBar
          placeholder="Search documents by title..."
          onSearch={onSearch}
          isLoading={isSearching}
          debounceMs={300}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center text-sm text-gray-600">
          <Filter className="h-4 w-4 mr-1" />
          Filter by category:
        </div>
        
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange('')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === ''
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Clear Filters */}
        {(selectedCategory || searchQuery) && (
          <button
            onClick={() => {
              onCategoryChange('');
              onSearch('');
            }}
            className="flex items-center px-2 py-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
            title="Clear all filters"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};