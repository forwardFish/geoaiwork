import type { BlogPost } from '@/lib/blog/types';
import { Calendar, Clock, ExternalLink, Tag } from 'lucide-react';
import Link from 'next/link';

type ArticleCardProps = {
  post: BlogPost;
  variant?: 'default' | 'featured' | 'compact';
};

export function ArticleCard({ post, variant = 'default' }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const cardClasses = {
    default: 'group bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg overflow-hidden',
    featured: 'group bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 hover:border-blue-300 transition-all duration-300 hover:shadow-xl overflow-hidden',
    compact: 'group bg-white rounded-lg border border-gray-100 hover:border-gray-300 transition-all duration-200 overflow-hidden',
  };

  const titleClasses = {
    default: 'text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2',
    featured: 'text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2',
    compact: 'text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1',
  };

  const descriptionClasses = {
    default: 'text-gray-600 line-clamp-3 leading-relaxed',
    featured: 'text-gray-700 line-clamp-4 leading-relaxed text-lg',
    compact: 'text-gray-600 line-clamp-2 text-sm',
  };

  return (
    <article className={cardClasses[variant]}>
      <Link href={`/blog/${post.slug}`} className="block p-6">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              {post.category}
            </span>
            {post.featured && variant !== 'compact' && (
              <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                Featured
              </span>
            )}
            {post.isRepost && (
              <span className="flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                <ExternalLink className="mr-1 h-3 w-3" />
                Repost
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className={titleClasses[variant]}>
          {post.title}
        </h3>

        {/* Description */}
        {variant !== 'compact' && (
          <p className={`mt-3 ${descriptionClasses[variant]}`}>
            {post.description}
          </p>
        )}

        {/* Tags */}
        {post.tags.length > 0 && variant !== 'compact' && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.slice(0, variant === 'featured' ? 5 : 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                <Tag className="mr-1 h-3 w-3" />
                {tag}
              </span>
            ))}
            {post.tags.length > (variant === 'featured' ? 5 : 3) && (
              <span className="text-xs text-gray-500">
                +
                {post.tags.length - (variant === 'featured' ? 5 : 3)}
                {' '}
                more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="mr-1 h-4 w-4" />
              {formatDate(post.publishDate)}
            </div>
            <div className="flex items-center">
              <Clock className="mr-1 h-4 w-4" />
              {post.readingTime}
              {' '}
              minutes read
            </div>
          </div>

          {variant === 'featured' && (
            <div className="text-sm font-medium text-blue-600">
              Read More →
            </div>
          )}
        </div>

        {/* Repost Attribution */}
        {post.isRepost && post.originalSource && variant !== 'compact' && (
          <div className="mt-3 rounded-lg bg-gray-50 p-3 text-sm">
            <p className="text-gray-600">
              Original Author:
              {' '}
              {post.originalSource.author}
              {' '}
              |
              {' '}
              <span className="ml-1 text-gray-500">
                {formatDate(post.originalSource.publishDate)}
              </span>
            </p>
          </div>
        )}
      </Link>
    </article>
  );
}
