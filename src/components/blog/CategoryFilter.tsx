'use client';

import { Folder, Hash } from 'lucide-react';

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
  postCounts?: Record<string, number>;
};

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategorySelect,
  postCounts = {},
}: CategoryFilterProps) {
  const totalPosts = Object.values(postCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center space-x-2">
          <Folder className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Article Categories</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-1">
          {/* All Categories */}
          <button
            onClick={() => onCategorySelect(null)}
            className={`
              flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors
              ${selectedCategory === null
      ? 'border border-blue-200 bg-blue-50 text-blue-700'
      : 'text-gray-700 hover:bg-gray-50'
    }
            `}
          >
            <span className="flex items-center">
              <Hash className="mr-2 h-4 w-4" />
              All Articles
            </span>
            <span className={`text-sm ${selectedCategory === null ? 'text-blue-600' : 'text-gray-500'}`}>
              {totalPosts}
            </span>
          </button>

          {/* Individual Categories */}
          {categories.map((category) => {
            const count = postCounts[category] || 0;
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                onClick={() => onCategorySelect(category)}
                className={`
                  flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors
                  ${isSelected
                ? 'border border-blue-200 bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
              }
                `}
              >
                <span className="flex items-center">
                  <Folder className="mr-2 h-4 w-4" />
                  {category}
                </span>
                <span className={`text-sm ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
