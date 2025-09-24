import { ArrowRight, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { getFeaturedPosts } from '@/lib/blog/content';

export async function BlogSection() {
  const featuredPosts = await getFeaturedPosts(3);

  // If no posts available, don't render the section
  if (featuredPosts.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Excel Professional Tips & Tricks
          </h2>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Master practical Excel data processing skills to boost work efficiency. Curated tutorials, expert insights, and real-world case studies to help you become an Excel expert.
          </p>
        </div>

        {/* Featured Posts Grid */}
        <div className="mb-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredPosts.map((post, index) => (
            <article
              key={post.slug}
              className={`group overflow-hidden rounded-xl border border-gray-200 bg-white transition-all duration-300 hover:border-blue-300 hover:shadow-xl ${
                index === 0 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="p-6">
                  {/* Category and Reading Time */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {post.category}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      {post.readingTime}
                      {' '}
                      minutes
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className={`mb-3 line-clamp-2 font-semibold text-gray-900 transition-colors group-hover:text-blue-600 ${
                    index === 0 ? 'text-xl' : 'text-lg'
                  }`}
                  >
                    {post.title}
                  </h3>

                  {/* Description */}
                  <p className={`mb-4 line-clamp-3 leading-relaxed text-gray-600 ${
                    index === 0 ? 'text-base' : 'text-sm'
                  }`}
                  >
                    {post.description}
                  </p>

                  {/* Tags */}
                  {post.tags.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {post.tags.slice(0, index === 0 ? 4 : 3).map(tag => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
                        >
                          #
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(post.publishDate)}
                    </div>
                    <div className="flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800">
                      Read More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* View All Articles CTA */}
        <div className="text-center">
          <Link
            href="/blog"
            className="inline-flex items-center rounded-lg bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg transition-colors hover:bg-blue-700 hover:shadow-xl"
          >
            View All Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-blue-600">50+</div>
            <div className="text-sm text-gray-600">Professional Tutorials</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-green-600">100K+</div>
            <div className="text-sm text-gray-600">Users Helped</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-purple-600">24/7</div>
            <div className="text-sm text-gray-600">Online Support</div>
          </div>
          <div className="text-center">
            <div className="mb-2 text-3xl font-bold text-orange-600">Free</div>
            <div className="text-sm text-gray-600">Forever</div>
          </div>
        </div>
      </div>
    </section>
  );
}
