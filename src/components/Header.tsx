'use client';

import { FileSpreadsheet, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home first
    if (window.location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <FileSpreadsheet className="h-5 w-5 text-white" />
            </div>
            <Link href="/" className="text-2xl font-bold">
              <span className="text-blue-600">Sheet</span>
              <span className="text-gray-900">Ally</span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden flex-1 items-center justify-center space-x-16 md:flex">
            <button
              onClick={() => scrollToSection('features')}
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('testimonials')}
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Success Stories
            </button>
            <button
              onClick={() => scrollToSection('faq')}
              className="font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              FAQ
            </button>
            <Link
              href="/blog"
              className="flex items-center font-medium text-gray-600 transition-colors hover:text-blue-600"
            >
              Blog
              <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                New
              </span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="ml-auto md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-600 transition-colors hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-gray-100 bg-white/95 py-4 backdrop-blur-lg md:hidden">
            <nav className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('features')}
                className="text-left font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('testimonials')}
                className="text-left font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                Success Stories
              </button>
              <button
                onClick={() => scrollToSection('faq')}
                className="text-left font-medium text-gray-600 transition-colors hover:text-blue-600"
              >
                FAQ
              </button>
              <Link
                href="/blog"
                className="flex items-center text-left font-medium text-gray-600 transition-colors hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
                <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-600">
                  New
                </span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
