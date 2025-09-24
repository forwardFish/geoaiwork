import type { BlogPost } from '@/lib/blog/types';
import { ArrowRight, Clock, Tag } from 'lucide-react';
import Link from 'next/link';
import { ThumbnailImage } from './SEOImage';

type RelatedPostsProps = {
  posts: BlogPost[];
  currentSlug: string;
  title?: string;
};

export function RelatedPosts({ posts, currentSlug, title = 'Related Articles' }: RelatedPostsProps) {
  // Filter out current post and limit to 3 posts
  const filteredPosts = posts.filter(post => post.slug !== currentSlug).slice(0, 3);

  if (filteredPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 border-t border-gray-200 pt-8">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.map(post => (
          <RelatedPostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

type RelatedPostCardProps = {
  post: BlogPost;
};

function RelatedPostCard({ post }: RelatedPostCardProps) {
  return (
    <article
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md"
      itemScope
      itemType="https://schema.org/BlogPosting"
    >
      {/* Image */}
      {post.seo.ogImage && (
        <div className="aspect-[16/9] overflow-hidden">
          <ThumbnailImage
            src={post.seo.ogImage}
            alt={post.title}
            className="transition-transform duration-300 group-hover:scale-105"
            priority={false}
          />
        </div>
      )}

      <div className="p-4">
        {/* Category & Reading Time */}
        <div className="mb-2 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Tag className="h-3 w-3" />
            <span className="capitalize" itemProp="articleSection">
              {post.category}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {post.readingTime}
              {' '}
              min read
            </span>
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600">
          <Link
            href={`/blog/${post.slug}`}
            className="transition-colors duration-200"
            itemProp="url"
          >
            <span itemProp="headline">{post.title}</span>
          </Link>
        </h3>

        {/* Description */}
        <p
          className="mb-3 line-clamp-2 text-sm text-gray-600"
          itemProp="description"
        >
          {post.description}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                itemProp="keywords"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Read More Link */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
        >
          Read More
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </Link>

        {/* Schema.org metadata */}
        <meta itemProp="datePublished" content={post.publishDate} />
        <meta itemProp="dateModified" content={post.updateDate || post.publishDate} />
        <meta itemProp="author" content={post.author} />
        <meta itemProp="publisher" content="SheetAlly" />
      </div>
    </article>
  );
}

// Internal link component for better SEO
type InternalLinkProps = {
  'href': string;
  'children': React.ReactNode;
  'className'?: string;
  'title'?: string;
  'aria-label'?: string;
};

export function InternalLink({
  href,
  children,
  className = 'text-blue-600 hover:text-blue-700 underline transition-colors duration-200',
  title,
  'aria-label': ariaLabel,
}: InternalLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      title={title}
      aria-label={ariaLabel}
      rel="noopener"
    >
      {children}
    </Link>
  );
}

// Contextual link suggestions based on keywords
type ContextualLinksProps = {
  keywords: string[];
  currentSlug: string;
  allPosts: BlogPost[];
};

export function ContextualLinks({ keywords, currentSlug, allPosts }: ContextualLinksProps) {
  // Find posts that share keywords with current post
  const relatedPosts = allPosts
    .filter(post => post.slug !== currentSlug)
    .map((post) => {
      const sharedKeywords = keywords.filter(keyword =>
        post.seo.keywords.some(postKeyword =>
          postKeyword.toLowerCase().includes(keyword.toLowerCase())
          || keyword.toLowerCase().includes(postKeyword.toLowerCase()),
        ),
      );
      return { post, relevance: sharedKeywords.length };
    })
    .filter(item => item.relevance > 0)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, 5);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="my-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
      <h4 className="mb-3 font-semibold text-blue-900">
        📚 You might also find these helpful:
      </h4>
      <ul className="space-y-2">
        {relatedPosts.map(({ post }) => (
          <li key={post.slug}>
            <InternalLink
              href={`/blog/${post.slug}`}
              className="text-blue-700 hover:text-blue-800"
              title={post.description}
            >
              {post.title}
            </InternalLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
