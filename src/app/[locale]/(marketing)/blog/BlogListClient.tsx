'use client';

import type { BlogPost } from '@/lib/blog/types';
import { ArrowRight, Calendar, Clock, Search, Tag, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

type BlogListClientProps = {
  initialPosts: BlogPost[];
  categories: string[];
  tags: string[];
  categoryCounts: Record<string, number>;
  tagCounts: Record<string, number>;
};

export function BlogListClient({
  initialPosts,
  categories,
  tags,
  categoryCounts,
}: BlogListClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'readingTime'>('date');

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = [...initialPosts];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query)
        || post.description.toLowerCase().includes(query)
        || post.content.toLowerCase().includes(query)
        || post.tags.some(tag => tag.toLowerCase().includes(query))
        || post.category.toLowerCase().includes(query),
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'readingTime':
          return a.readingTime - b.readingTime;
        case 'date':
        default:
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      }
    });

    return filtered;
  }, [initialPosts, searchQuery, selectedCategory, selectedTag, sortBy]);

  const featuredPosts = initialPosts.filter(post => post.featured).slice(0, 2);
  const recentPosts = initialPosts.slice(0, 6);
  const popularTags = tags.slice(0, 8);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedTag(null);
  };

  const hasFilters = searchQuery || selectedCategory || selectedTag;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pt-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAyMCAwIEwgMCAwIDAgMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2YxZjVmOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiAvPjwvc3ZnPg==')] opacity-50" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              <span className="block">Excel</span>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Professional Tips
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-gray-600">
              Master Excel data processing with curated tutorials, practical tips, and expert insights.
              Boost your productivity with proven techniques.
            </p>

            {/* Stats */}
            <div className="mx-auto mt-10 grid max-w-lg grid-cols-3 gap-6 sm:max-w-xl sm:gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {initialPosts.length}
                  +
                </div>
                <div className="mt-1 text-sm text-gray-600">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">{categories.length}</div>
                <div className="mt-1 text-sm text-gray-600">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900">
                  {Math.floor(Math.random() * 50 + 100)}
                  K+
                </div>
                <div className="mt-1 text-sm text-gray-600">Readers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Filter Section */}
      <section className="border-b border-gray-100 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles by title, content, or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-4 pr-4 pl-12 text-lg transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Quick Filters */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              {categories.slice(0, 6).map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                  <span className="ml-1 text-xs opacity-75">
                    (
                    {categoryCounts[category] || 0}
                    )
                  </span>
                </button>
              ))}

              {hasFilters && (
                <button
                  onClick={clearFilters}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Results Count */}
            {hasFilters && (
              <div className="mt-4 text-center text-sm text-gray-600">
                Found
                {' '}
                <span className="font-semibold text-gray-900">{filteredPosts.length}</span>
                {' '}
                articles
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Main Content */}
          <main className="lg:col-span-8">
            {/* Featured Articles - Only show when no filters */}
            {!hasFilters && featuredPosts.length > 0 && (
              <section className="mb-12">
                <div className="mb-8 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Featured Articles</h2>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  {featuredPosts.map(post => (
                    <div key={post.slug} className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 transition-all hover:shadow-xl">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 transition-opacity group-hover:opacity-80" />
                      <div className="relative">
                        <div className="mb-4 flex items-center">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                            {post.category}
                          </span>
                          <span className="ml-2 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                            Featured
                          </span>
                        </div>

                        <h3 className="mb-3 text-xl font-bold text-gray-900 group-hover:text-blue-600">
                          <Link href={`/blog/${post.slug}`} className="stretched-link">
                            {post.title}
                          </Link>
                        </h3>

                        <p className="mb-4 line-clamp-3 text-gray-600">
                          {post.description}
                        </p>

                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="mr-1 h-4 w-4" />
                          <span className="mr-4">{new Date(post.publishDate).toLocaleDateString()}</span>
                          <Clock className="mr-1 h-4 w-4" />
                          <span>
                            {post.readingTime}
                            {' '}
                            min read
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Articles List */}
            <section>
              <div className="mb-8 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {hasFilters ? 'Search Results' : 'Latest Articles'}
                </h2>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="date">Latest First</option>
                  <option value="title">Title A-Z</option>
                  <option value="readingTime">Quick Read</option>
                </select>
              </div>

              {filteredPosts.length > 0
                ? (
                    <div className="space-y-8">
                      {filteredPosts.map(post => (
                        <article key={post.slug} className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:border-blue-200 hover:shadow-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-3 flex items-center">
                                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
                                  {post.category}
                                </span>
                                {post.featured && (
                                  <span className="ml-2 rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-700">
                                    Featured
                                  </span>
                                )}
                              </div>

                              <h3 className="mb-3 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                                <Link href={`/blog/${post.slug}`}>
                                  {post.title}
                                </Link>
                              </h3>

                              <p className="mb-4 line-clamp-2 text-gray-600">
                                {post.description}
                              </p>

                              <div className="mb-4 flex flex-wrap gap-2">
                                {post.tags.slice(0, 3).map(tag => (
                                  <button
                                    key={tag}
                                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                                    className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium transition-colors ${
                                      selectedTag === tag
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                  >
                                    <Tag className="mr-1 h-3 w-3" />
                                    {tag}
                                  </button>
                                ))}
                              </div>

                              <div className="flex items-center text-sm text-gray-500">
                                <Calendar className="mr-1 h-4 w-4" />
                                <span className="mr-4">{new Date(post.publishDate).toLocaleDateString()}</span>
                                <Clock className="mr-1 h-4 w-4" />
                                <span className="mr-4">
                                  {post.readingTime}
                                  {' '}
                                  min read
                                </span>
                                <span>
                                  By
                                  {post.author}
                                </span>
                              </div>
                            </div>

                            <Link
                              href={`/blog/${post.slug}`}
                              className="ml-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all group-hover:bg-blue-100 group-hover:text-blue-600"
                            >
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  )
                : (
                    <div className="py-16 text-center">
                      <div className="mb-4 text-6xl">📝</div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">No articles found</h3>
                      <p className="mb-6 text-gray-600">Try adjusting your search criteria</p>
                      <button
                        onClick={clearFilters}
                        className="rounded-lg bg-blue-600 px-6 py-3 text-white transition-colors hover:bg-blue-700"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
            </section>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-8">
              {/* Popular Tags */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6">
                <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                  <Tag className="mr-2 h-5 w-5 text-blue-600" />
                  Popular Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`rounded-full px-3 py-1 text-sm transition-all ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Articles */}
              {!hasFilters && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6">
                  <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900">
                    <Clock className="mr-2 h-5 w-5 text-blue-600" />
                    Recent Articles
                  </h3>
                  <div className="space-y-4">
                    {recentPosts.slice(0, 4).map(post => (
                      <Link
                        key={post.slug}
                        href={`/blog/${post.slug}`}
                        className="group block rounded-lg p-3 transition-colors hover:bg-gray-50"
                      >
                        <h4 className="mb-1 line-clamp-2 font-medium text-gray-900 group-hover:text-blue-600">
                          {post.title}
                        </h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{new Date(post.publishDate).toLocaleDateString()}</span>
                          <span className="mx-2">•</span>
                          <span>
                            {post.readingTime}
                            {' '}
                            min
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">Stay Updated</h3>
                <p className="mb-4 text-sm text-gray-600">
                  Get the latest Excel tips and tutorials delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  />
                  <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
