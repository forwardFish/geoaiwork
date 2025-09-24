'use client';

import { Tag } from 'lucide-react';

type TagCloudProps = {
  tags: string[];
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  tagCounts?: Record<string, number>;
  maxTags?: number;
};

export function TagCloud({
  tags,
  selectedTag,
  onTagSelect,
  tagCounts = {},
  maxTags = 20,
}: TagCloudProps) {
  // Sort tags by usage frequency
  const sortedTags = [...tags]
    .map(tag => ({ tag, count: tagCounts[tag] || 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, maxTags);

  // Calculate tag size weights
  const maxCount = Math.max(...Object.values(tagCounts));
  const minCount = Math.min(...Object.values(tagCounts).filter(count => count > 0));

  const getTagSize = (count: number) => {
    if (maxCount === minCount) {
      return 'text-sm';
    }

    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.7) {
      return 'text-lg font-medium';
    }
    if (ratio > 0.4) {
      return 'text-base';
    }
    return 'text-sm';
  };

  const getTagColor = (count: number, isSelected: boolean) => {
    if (isSelected) {
      return 'bg-blue-500 text-white border-blue-500';
    }

    if (maxCount === minCount) {
      return 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600';
    }

    const ratio = (count - minCount) / (maxCount - minCount);
    if (ratio > 0.7) {
      return 'bg-blue-100 text-blue-800 border-blue-300 hover:border-blue-500 hover:bg-blue-200';
    }
    if (ratio > 0.4) {
      return 'bg-gray-100 text-gray-700 border-gray-300 hover:border-blue-500 hover:text-blue-600';
    }
    return 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-500 hover:text-blue-600';
  };

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-4">
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Popular Tags</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(({ tag, count }) => {
            const isSelected = selectedTag === tag;
            const sizeClass = getTagSize(count);
            const colorClass = getTagColor(count, isSelected);

            return (
              <button
                key={tag}
                onClick={() => onTagSelect(isSelected ? null : tag)}
                className={`
                  inline-flex items-center rounded-full border px-3 py-1 transition-all duration-200
                  ${sizeClass} ${colorClass}
                `}
                title={`${count} articles`}
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
                <span className="ml-1 text-xs opacity-75">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {tags.length > maxTags && (
          <div className="mt-3 border-t border-gray-100 pt-3">
            <p className="text-center text-sm text-gray-500">
              Showing top
              {' '}
              {maxTags}
              {' '}
              tags of
              {' '}
              {tags.length}
              {' '}
              total
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
