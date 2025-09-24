import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';

type BlogLayoutProps = {
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
  showSidebar?: boolean;
};

export function BlogLayout({
  children,
  sidebar,
  className = '',
  showSidebar = true,
}: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        {/* Hero Section for Blog Pages */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
                Excel Professional Tips
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-xl text-gray-600">
                Master Excel data processing skills to boost work efficiency. Curated tutorials, practical tips, and expert insights.
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className={`${showSidebar ? 'lg:grid lg:grid-cols-12 lg:gap-8' : ''} ${className}`}>
            {/* Main Content */}
            <div className={showSidebar ? 'lg:col-span-8' : 'w-full'}>
              {children}
            </div>

            {/* Sidebar */}
            {showSidebar && sidebar && (
              <aside className="hidden lg:col-span-4 lg:block">
                <div className="sticky top-24 space-y-6">
                  {sidebar}
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Article Layout - for individual blog posts
type ArticleLayoutProps = {
  children: ReactNode;
  sidebar?: ReactNode;
  showTOC?: boolean;
};

export function ArticleLayout({
  children,
  sidebar,
  showTOC = true,
}: ArticleLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Article Content */}
            <article className="lg:col-span-8">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                {children}
              </div>
            </article>

            {/* Sidebar with TOC and other widgets */}
            {showTOC && (
              <aside className="hidden lg:col-span-4 lg:block">
                <div className="sticky top-24 space-y-6">
                  {sidebar}
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Compact Layout - for simpler pages
export function CompactBlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="pt-20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}
