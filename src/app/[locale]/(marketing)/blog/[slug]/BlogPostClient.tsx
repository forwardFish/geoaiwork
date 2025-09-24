'use client';

import type { BlogPost } from '@/lib/blog/types';
import { Calendar, ChevronLeft, Clock, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';
import { ArticleCard, ArticleLayout, MobileTOC, StickyTOC } from '@/components/blog';
import { getRelAttribute } from '@/lib/blog/external-links';
import { MarkdownRenderer } from '@/lib/blog/markdown-fallback';

type BlogPostClientProps = {
  post: BlogPost;
  headings: Array<{ id: string; text: string; level: number }>;
  relatedPosts: BlogPost[];
};

export function BlogPostClient({ post, headings, relatedPosts }: BlogPostClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const sidebar = (
    <div className="space-y-8">
      {/* Table of Contents */}
      {headings.length > 0 && (
        <div className="max-h-[70vh] overflow-y-auto">
          <StickyTOC headings={headings} />
        </div>
      )}

      {/* Article Info */}
      <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
        <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
          <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
          Article Info
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center rounded-lg bg-white p-3 text-gray-700 shadow-sm">
            <Calendar className="mr-3 h-5 w-5 text-blue-600" />
            <span className="font-medium">{formatDate(post.publishDate)}</span>
          </div>
          <div className="flex items-center rounded-lg bg-white p-3 text-gray-700 shadow-sm">
            <Clock className="mr-3 h-5 w-5 text-green-600" />
            <span className="font-medium">
              {post.readingTime}
              {' '}
              minutes read
            </span>
          </div>
          <div className="flex items-center rounded-lg bg-white p-3 text-gray-700 shadow-sm">
            <User className="mr-3 h-5 w-5 text-purple-600" />
            <span className="font-medium">{post.author}</span>
          </div>
          {post.updateDate && (
            <div className="flex items-center border-t border-gray-100 pt-3 text-xs text-gray-500">
              <span className="font-medium">
                Updated:
                {formatDate(post.updateDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
            Article Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="inline-flex items-center rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-2 text-sm font-medium text-blue-700 transition-all duration-200 hover:border-blue-300 hover:from-blue-100 hover:to-blue-200 hover:shadow-sm"
              >
                #
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* External Links */}
      {post.externalLinks && post.externalLinks.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm">
          <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
            <div className="mr-2 h-2 w-2 rounded-full bg-orange-500"></div>
            Related Links
          </h3>
          <div className="space-y-2">
            {post.externalLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel={getRelAttribute(link.url, link.authority)}
                className="group flex items-center rounded-lg bg-white p-3 text-blue-600 shadow-sm transition-all duration-200 hover:bg-blue-50 hover:text-blue-800 hover:shadow-md"
              >
                <ExternalLink className="mr-3 h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110" />
                <span className="truncate font-medium">{link.title}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <ArticleLayout sidebar={sidebar}>
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 px-8 pt-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="font-medium text-gray-500 transition-colors hover:text-blue-600">
                Home
              </Link>
            </li>
            <li><span className="mx-2 text-gray-400">/</span></li>
            <li>
              <Link href="/blog" className="font-medium text-gray-500 transition-colors hover:text-blue-600">
                Blog
              </Link>
            </li>
            <li><span className="mx-2 text-gray-400">/</span></li>
            <li className="truncate font-semibold text-gray-700">{post.title}</li>
          </ol>
        </nav>

        {/* Article Header */}
        <header className="mb-12 px-8">
          <div className="mb-6 flex items-center space-x-3">
            <span className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              {post.category}
            </span>
            {post.featured && (
              <span className="flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 px-3 py-1.5 text-xs font-semibold text-yellow-900 shadow-sm">
                ⭐ Featured
              </span>
            )}
            {post.isRepost && (
              <span className="flex items-center rounded-full bg-gradient-to-r from-green-400 to-green-500 px-3 py-1.5 text-xs font-semibold text-green-900 shadow-sm">
                <ExternalLink className="mr-1 h-3 w-3" />
                Repost
              </span>
            )}
          </div>

          <h1 className="mb-6 text-3xl leading-tight font-black tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mb-8 max-w-4xl text-xl leading-relaxed font-light text-gray-600 md:text-2xl lg:text-2xl">
            {post.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 pb-8 text-sm text-gray-500">
            <div className="flex items-center rounded-lg bg-gray-50 px-3 py-2">
              <Calendar className="mr-2 h-4 w-4 text-blue-600" />
              <span className="font-medium">{formatDate(post.publishDate)}</span>
            </div>
            <div className="flex items-center rounded-lg bg-gray-50 px-3 py-2">
              <Clock className="mr-2 h-4 w-4 text-green-600" />
              <span className="font-medium">
                {post.readingTime}
                {' '}
                min read
              </span>
            </div>
            <div className="flex items-center rounded-lg bg-gray-50 px-3 py-2">
              <User className="mr-2 h-4 w-4 text-purple-600" />
              <span className="font-medium">{post.author}</span>
            </div>
          </div>

          {/* Repost Attribution */}
          {post.isRepost && post.originalSource && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <h3 className="mb-2 text-sm font-medium text-gray-900">Original Article Info</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  Title:
                  {' '}
                  {post.originalSource.title}
                </p>
                <p>
                  Author:
                  {' '}
                  {post.originalSource.author}
                </p>
                <p>
                  Published:
                  {' '}
                  {formatDate(post.originalSource.publishDate)}
                </p>
                <p>
                  Repost Authorization:
                  {' '}
                  {post.originalSource.authorization}
                </p>
                {post.originalSource.url && (
                  <p>
                    Original Link:
                    {' '}
                    <a
                      href={post.originalSource.url}
                      target="_blank"
                      rel="external nofollow"
                      className="text-blue-600 transition-colors hover:text-blue-800"
                    >
                      {post.originalSource.url}
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Article Content */}
        <div className="px-8 pb-12">
          <article className="prose prose-gray prose-headings:font-bold prose-h1:text-3xl prose-h1:font-black prose-h1:tracking-tight prose-h1:text-gray-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-gray-800 prose-h3:text-xl prose-h3:font-semibold prose-h3:text-gray-700 prose-p:text-base prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-red-600 prose-code:font-medium prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:italic prose-ul:pl-6 prose-ol:pl-6 prose-li:my-2 prose-table:border-collapse prose-th:bg-gray-50 prose-th:font-semibold prose-td:border prose-th:border max-w-none">
            <MarkdownRenderer content={post.content} />
          </article>
        </div>

        {/* Downloads Section */}
        {/*         {post.downloads && post.downloads.length > 0 && (
          <div className="px-8 pb-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-900">Download Resources</h2>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <div className="space-y-3">
                {post.downloads.map((download, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{download.title}</h3>
                      {download.description && (
                        <p className="text-sm text-gray-600">{download.description}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">{download.size}</span>
                      <a
                        href={download.file}
                        download
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )} */}

        {/* Back to Blog Link */}
        <div className="px-8 pb-12">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg"
          >
            <ChevronLeft className="mr-2 h-5 w-5" />
            Return to Blog List
          </Link>
        </div>
      </ArticleLayout>

      {/* Mobile TOC */}
      <MobileTOC headings={headings} />

      {/* Related Articles */}
      {relatedPosts.length > 0 && (
        <section className="bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900">Related Articles</h2>
              <p className="mx-auto max-w-2xl text-lg text-gray-600">
                Discover more helpful content to boost your Excel productivity
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map(relatedPost => (
                <div key={relatedPost.slug} className="group">
                  <ArticleCard
                    post={relatedPost}
                    variant="compact"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
