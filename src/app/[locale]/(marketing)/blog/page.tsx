import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { getAllCategories, getAllPosts, getAllTags } from '@/lib/blog/content';
import { generateBlogListMetadata } from '@/lib/blog/seo';
import { BlogListClient } from './BlogListClient';

type IBlogProps = {
  params: Promise<{ locale: string }>;
};

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  return generateBlogListMetadata();
}

// Loading component
function BlogListLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-20 bg-white"></div>
      {' '}
      {/* Header placeholder */}

      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto mb-6 h-16 max-w-lg animate-pulse rounded-lg bg-gray-200"></div>
            <div className="mx-auto h-6 max-w-2xl animate-pulse rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>

      {/* Search Section Skeleton */}
      <div className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-2xl px-4">
          <div className="h-14 animate-pulse rounded-2xl bg-gray-200"></div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="space-y-8">
              {[...Array.from({ length: 4 })].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="mb-4 h-6 animate-pulse rounded bg-gray-200"></div>
                  <div className="mb-2 h-4 animate-pulse rounded bg-gray-200"></div>
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200"></div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:col-span-4 lg:block">
            <div className="space-y-8">
              {[...Array.from({ length: 3 })].map((_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-white p-6">
                  <div className="mb-4 h-6 animate-pulse rounded bg-gray-200"></div>
                  <div className="space-y-2">
                    {[...Array.from({ length: 4 })].map((_, j) => (
                      <div key={j} className="h-4 animate-pulse rounded bg-gray-200"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="h-32 bg-gray-900"></div>
      {' '}
      {/* Footer placeholder */}
    </div>
  );
}

// Main blog list page component
export default async function Blog(props: IBlogProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  // Fetch data server-side for better SEO and performance
  const [posts, categories, tags] = await Promise.all([
    getAllPosts(),
    getAllCategories(),
    getAllTags(),
  ]);

  // Generate post counts for categories and tags
  const categoryCounts = categories.reduce((acc, category) => {
    acc[category] = posts.filter(post => post.category === category).length;
    return acc;
  }, {} as Record<string, number>);

  const tagCounts = tags.reduce((acc, tag) => {
    acc[tag] = posts.filter(post => post.tags.includes(tag)).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Suspense fallback={<BlogListLoading />}>
      <BlogListClient
        initialPosts={posts}
        categories={categories}
        tags={tags}
        categoryCounts={categoryCounts}
        tagCounts={tagCounts}
      />
    </Suspense>
  );
}
