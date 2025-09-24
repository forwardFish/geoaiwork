'use client';

import { ChevronRight, List } from 'lucide-react';
import { useEffect, useState } from 'react';

type Heading = {
  id: string;
  text: string;
  level: number;
};

type TOCProps = {
  headings: Heading[];
  className?: string;
};

export function TOC({ headings, className = '' }: TOCProps) {
  const [activeHeading, setActiveHeading] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0,
      },
    );

    // Observe all heading elements
    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Account for fixed header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth',
      });
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className={`rounded-lg border border-gray-200 bg-white shadow-sm ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-4">
        <div className="flex items-center space-x-2">
          <List className="h-4 w-4 text-gray-600" />
          <h3 className="font-medium text-gray-900">Table of Contents</h3>
          <span className="text-sm text-gray-500">
            (
            {headings.length}
            )
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 text-gray-400 transition-colors hover:text-gray-600"
        >
          <ChevronRight
            className={`h-4 w-4 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
          />
        </button>
      </div>

      {/* TOC Content */}
      {!isCollapsed && (
        <div className="p-4">
          <nav>
            <ul className="space-y-1">
              {headings.map((heading) => {
                const isActive = activeHeading === heading.id;
                const paddingLeft = (heading.level - 1) * 16; // 16px per level

                return (
                  <li key={heading.id}>
                    <button
                      onClick={() => scrollToHeading(heading.id)}
                      className={`
                        w-full rounded-md px-3 py-2 text-left text-sm transition-all duration-200 hover:bg-gray-100
                        ${isActive
                    ? 'border-l-3 border-blue-600 bg-blue-50 font-medium text-blue-600'
                    : 'text-gray-700 hover:text-gray-900'
                  }
                      `}
                      style={{ paddingLeft: `${12 + paddingLeft}px` }}
                    >
                      <span className="flex items-center">
                        {/* Level indicator */}
                        {heading.level > 1 && (
                          <span
                            className={`mr-2 ${
                              isActive ? 'text-blue-400' : 'text-gray-400'
                            }`}
                          >
                            {'•'.repeat(heading.level - 1)}
                          </span>
                        )}

                        {/* Heading text */}
                        <span className="line-clamp-2 leading-relaxed">
                          {heading.text}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="px-4 pb-4">
        <div className="h-1 w-full rounded-full bg-gray-200">
          <div
            className="h-1 rounded-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${
                headings.findIndex(h => h.id === activeHeading) >= 0
                  ? ((headings.findIndex(h => h.id === activeHeading) + 1) / headings.length) * 100
                  : 0
              }%`,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Reading Progress</span>
          <span>
            {headings.findIndex(h => h.id === activeHeading) >= 0
              ? headings.findIndex(h => h.id === activeHeading) + 1
              : 0}
            /
            {headings.length}
          </span>
        </div>
      </div>
    </div>
  );
}

// Sticky TOC for desktop
export function StickyTOC({ headings }: { headings: Heading[] }) {
  return (
    <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <TOC headings={headings} />
    </div>
  );
}

// Mobile TOC that can be toggled
export function MobileTOC({ headings }: { headings: Heading[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (headings.length === 0) {
    return null;
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-4 z-40 rounded-full bg-blue-600 p-3 text-white shadow-lg transition-colors hover:bg-blue-700 md:hidden"
      >
        <List className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="bg-opacity-50 absolute inset-0 bg-black"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 bottom-0 left-0 max-h-[70vh] rounded-t-xl bg-white">
            <div className="border-b border-gray-100 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Table of Contents</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <ChevronRight className="h-4 w-4 rotate-90" />
                </button>
              </div>
            </div>
            <div className="max-h-[calc(70vh-4rem)] overflow-y-auto">
              <TOC
                headings={headings}
                className="border-0 bg-transparent shadow-none"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
