'use client';

import { Github, Linkedin, Mail, Twitter } from 'lucide-react';

export function Footer() {
  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'API Documentation', href: '/docs' },
      { label: 'Integrations', href: '/integrations' },
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    blog: [
      { label: 'All Articles', href: '/blog' },
      { label: 'Excel Tips', href: '/blog?category=Excel+Tips' },
      { label: 'Data Processing', href: '/blog?category=Data+Deduplication' },
      { label: 'Sheet Merging', href: '/blog?category=Sheet+Merging' },
    ],
    resources: [
      { label: 'Help Center', href: '/help' },
      { label: 'Tutorials', href: '/tutorials' },
      { label: 'Templates', href: '/templates' },
      { label: 'Community', href: '/community' },
    ],
    legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'GDPR', href: '/gdpr' },
    ],
  };

  const socialLinks = [
    { icon: Twitter, href: 'https://twitter.com/sheetally_com', label: 'Twitter' },
    { icon: Github, href: 'https://https://github.com/forwardfish/sheetally', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/company/sheetally', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@sheetally.com', label: 'Email' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center">
              <div className="text-2xl font-bold">
                <span className="text-blue-400">Sheet</span>
                Ally
              </div>
            </div>
            <p className="mb-6 max-w-sm text-gray-300">
              Transform your Excel workflows into auditable, repeatable data operations.
              See the difference before execution, export with complete audit trails.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition-colors hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="mb-4 font-semibold">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Blog Links */}
          <div>
            <h3 className="mb-4 font-semibold">Blog & Tips</h3>
            <ul className="space-y-3">
              {footerLinks.blog.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="mb-4 font-semibold">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="mb-4 font-semibold">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="mb-4 font-semibold">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map(link => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="mb-2 text-lg font-semibold">Stay Updated</h3>
              <p className="max-w-md text-gray-300">
                Get the latest updates on new features, tutorials, and data processing tips.
              </p>
            </div>

            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 md:w-64"
              />
              <button className="rounded-lg bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-gray-800 pt-8 md:flex-row">
          <div className="mb-4 text-gray-400 md:mb-0">
            ©
            {' '}
            {new Date().getFullYear()}
            {' '}
            SheetAlly. All rights reserved.
          </div>

          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Made with ❤️ for Excel users worldwide</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
