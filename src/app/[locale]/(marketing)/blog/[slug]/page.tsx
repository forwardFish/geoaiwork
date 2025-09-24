import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/blog/content';
import { extractHeadings } from '@/lib/blog/mdx';
import { generateArticleJsonLd, generateBlogPostMetadata, generateBreadcrumbJsonLd, generateFAQJsonLd, generateHowToJsonLd } from '@/lib/blog/seo';
import { BlogPostClient } from './BlogPostClient';

type IBlogPostProps = {
  params: Promise<{ locale: string; slug: string }>;
};

// Generate static params for better performance
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map(post => ({
    slug: post.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata(props: IBlogPostProps): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Article Not Found | SheetAlly Blog',
      description: 'The requested article could not be found.',
    };
  }

  return generateBlogPostMetadata(post);
}

// Loading component
function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <article className="lg:col-span-8">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="p-8">
                  {/* Header skeleton */}
                  <div className="mb-4 h-8 w-1/4 animate-pulse rounded bg-gray-200"></div>
                  <div className="mb-4 h-12 animate-pulse rounded bg-gray-200"></div>
                  <div className="mb-8 h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>

                  {/* Content skeleton */}
                  <div className="space-y-4">
                    {[...Array.from({ length: 8 })].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 animate-pulse rounded bg-gray-200"></div>
                        <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </article>
            <aside className="hidden lg:col-span-4 lg:block">
              <div className="sticky top-24">
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <div className="mb-4 h-6 animate-pulse rounded bg-gray-200"></div>
                  <div className="space-y-2">
                    {[...Array.from({ length: 5 })].map((_, i) => (
                      <div key={i} className="h-4 animate-pulse rounded bg-gray-200"></div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main blog post component
export default async function BlogPost(props: IBlogPostProps) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  // Fetch the blog post
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Extract headings for TOC
  const headings = extractHeadings(post.content);

  // Get related posts
  const relatedPosts = await getRelatedPosts(slug, 3);

  // Generate structured data
  const articleJsonLd = generateArticleJsonLd(post);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd(post);
  const howToJsonLd = generateHowToJsonLd(post);
  const faqJsonLd = generateFAQJsonLd(post);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      {howToJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(howToJsonLd),
          }}
        />
      )}
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqJsonLd),
          }}
        />
      )}

      <Suspense fallback={<BlogPostLoading />}>
        <BlogPostClient
          post={post}
          headings={headings}
          relatedPosts={relatedPosts}
        />
      </Suspense>
    </>
  );
}
