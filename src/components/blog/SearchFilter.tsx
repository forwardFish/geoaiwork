'use client';

import { Filter, Search, Tag, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type SearchFilterProps = {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string | null) => void;
  onTagFilter: (tag: string | null) => void;
  onSortChange: (sort: 'date' | 'title' | 'readingTime') => void;
  categories: string[];
  tags: string[];
  currentQuery: string;
  currentCategory: string | null;
  currentTag: string | null;
  currentSort: string;
  resultsCount?: number;
};

export function SearchFilter({
  onSearch,
  onCategoryFilter,
  onTagFilter,
  onSortChange,
  categories,
  tags,
  currentQuery,
  currentCategory,
  currentTag,
  currentSort,
  resultsCount,
}: SearchFilterProps) {
  const [searchInput, setSearchInput] = useState(currentQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    setSearchInput(currentQuery);
  }, [currentQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    onSearch('');
  };

  const handleClearFilters = () => {
    onCategoryFilter(null);
    onTagFilter(null);
    onSortChange('date');
    setSearchInput('');
    onSearch('');
  };

  const hasActiveFilters = currentCategory || currentTag || currentQuery;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Search Bar */}
      <div className="border-b border-gray-100 p-4">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by title, content, or tags..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-3 pr-12 pl-10 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </form>

        {/* Results Count */}
        {resultsCount !== undefined && (
          <div className="mt-3 text-sm text-gray-600">
            {resultsCount > 0
              ? (
                  <>
                    Found
                    <span className="font-semibold text-gray-900">{resultsCount}</span>
                    {' '}
                    articles
                  </>
                )
              : (
                  <span className="text-gray-500">No related articles found</span>
                )}
          </div>
        )}
      </div>

      {/* Filter Controls */}
      <div className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 transition-colors hover:bg-gray-200"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-blue-500 text-xs text-white"></span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-500 transition-colors hover:text-gray-700"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Active Filters */}
        {hasActiveFilters && (
          <div className="mb-4 flex flex-wrap gap-2">
            {currentQuery && (
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
                Search:
                {' '}
                {currentQuery}
                <button
                  onClick={handleClearSearch}
                  className="ml-2 hover:text-blue-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentCategory && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm text-green-800">
                Category:
                {' '}
                {currentCategory}
                <button
                  onClick={() => onCategoryFilter(null)}
                  className="ml-2 hover:text-green-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {currentTag && (
              <span className="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm text-purple-800">
                Tag:
                {' '}
                {currentTag}
                <button
                  onClick={() => onTagFilter(null)}
                  className="ml-2 hover:text-purple-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Filter Options */}
        {isFilterOpen && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            {/* Categories */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Filter by Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => onCategoryFilter(currentCategory === category ? null : category)}
                    className={`rounded-lg border px-3 py-1 text-sm transition-colors ${
                      currentCategory === category
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Filter by Tags
              </label>
              <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                {tags.slice(0, showAdvanced ? tags.length : 15).map(tag => (
                  <button
                    key={tag}
                    onClick={() => onTagFilter(currentTag === tag ? null : tag)}
                    className={`inline-flex items-center rounded-md border px-2 py-1 text-xs transition-colors ${
                      currentTag === tag
                        ? 'border-purple-500 bg-purple-500 text-white'
                        : 'border-gray-300 bg-white text-gray-600 hover:border-purple-500 hover:text-purple-600'
                    }`}
                  >
                    <Tag className="mr-1 h-3 w-3" />
                    {tag}
                  </button>
                ))}
              </div>
              {tags.length > 15 && (
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  {showAdvanced ? 'Show Less' : `Show More (+${tags.length - 15})`}
                </button>
              )}
            </div>

            {/* Sort Options */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={currentSort}
                onChange={e => onSortChange(e.target.value as 'date' | 'title' | 'readingTime')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Publish Date (Latest)</option>
                <option value="title">Title (A-Z)</option>
                <option value="readingTime">Reading Time (Short to Long)</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
