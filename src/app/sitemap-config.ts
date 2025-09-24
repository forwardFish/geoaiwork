/**
 * Sitemap configuration for SheetAlly
 * Only include pages that actually exist
 */

export type RouteInfo = {
  path: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  lastModified?: Date;
};

export const sitemapConfig = {
  // Existing pages - only include pages that are already developed
  existingRoutes: [
    {
      path: '',
      changeFrequency: 'daily' as const,
      priority: 1.0,
      description: 'Homepage - Main product introduction',
    },
    {
      path: '/tool',
      changeFrequency: 'daily' as const,
      priority: 1.0,
      description: 'Tools page - Core functionality showcase',
    },
  ],

  // Planned pages - sorted by development priority
  plannedRoutes: {
    // Phase 1: Conversion-critical pages (highest priority)
    phase1: [
      {
        path: '/pricing',
        changeFrequency: 'weekly' as const,
        priority: 0.9,
        description: 'Pricing page - Conversion critical',
        reason: 'Directly impacts paid conversions, should be prioritized',
      },
      {
        path: '/demo',
        changeFrequency: 'weekly' as const,
        priority: 0.85,
        description: 'Online demo - Lower trial barriers',
        reason: 'Let users experience the product without registration',
      },
      {
        path: '/about',
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        description: 'About us - Build trust',
        reason: 'Establish company credibility, improve conversion rates',
      },
    ],

    // Phase 2: SEO content pages
    phase2: [
      {
        path: '/blog',
        changeFrequency: 'daily' as const,
        priority: 0.9,
        description: 'Blog homepage - Main SEO traffic source',
        reason: 'Generate organic traffic through educational content',
      },
      {
        path: '/features',
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        description: 'Feature details - Product advantages',
        reason: 'Detailed product capabilities, improve conversion',
      },
      {
        path: '/use-cases',
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        description: 'Use cases - Scenario-based marketing',
        reason: 'Prove product value through specific examples',
      },
    ],

    // Phase 3: Support and trust pages
    phase3: [
      {
        path: '/faq',
        changeFrequency: 'weekly' as const,
        priority: 0.75,
        description: 'FAQ - User support',
        reason: 'Reduce customer inquiries, improve user satisfaction',
      },
      {
        path: '/contact',
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        description: 'Contact us - Customer communication',
        reason: 'Provide user feedback channels',
      },
      {
        path: '/privacy',
        changeFrequency: 'monthly' as const,
        priority: 0.5,
        description: 'Privacy policy - Legal requirement',
        reason: 'Meet legal compliance requirements',
      },
      {
        path: '/terms',
        changeFrequency: 'monthly' as const,
        priority: 0.5,
        description: 'Terms of service - Legal protection',
        reason: 'Protect business interests',
      },
    ],

    // Phase 4: Advanced features and differentiation
    phase4: [
      {
        path: '/compare/sheetally-vs-power-query',
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        description: 'Competitor comparison - Differentiation',
        reason: 'Capture comparison search traffic',
      },
      {
        path: '/solutions/financial-reporting',
        changeFrequency: 'monthly' as const,
        priority: 0.8,
        description: 'Industry solutions - Vertical markets',
        reason: 'Target specific industry needs',
      },
      {
        path: '/integrations',
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        description: 'Integration capabilities - Ecosystem',
        reason: 'Showcase product extensibility',
      },
    ],
  },
};

// Only return existing pages for sitemap
export function getAllRoutes(): RouteInfo[] {
  return sitemapConfig.existingRoutes.map(r => ({
    path: r.path,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    lastModified: undefined, // Will be set dynamically in sitemap.ts
  }));
}

// Get development priority recommendations
export function getDevelopmentPriority() {
  return {
    immediate: sitemapConfig.plannedRoutes.phase1,
    short_term: sitemapConfig.plannedRoutes.phase2,
    medium_term: sitemapConfig.plannedRoutes.phase3,
    long_term: sitemapConfig.plannedRoutes.phase4,
  };
}
