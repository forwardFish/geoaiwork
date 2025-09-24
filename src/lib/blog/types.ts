// Shared blog types (client-safe)
export type ExternalLink = {
  title: string;
  url: string;
  type: 'reference' | 'source' | 'tool' | 'related';
  authority: 'high' | 'medium' | 'low';
  nofollow?: boolean;
};

export type Download = {
  title: string;
  file: string;
  size: string;
  description?: string;
};

export type SEOConfig = {
  canonical: string;
  keywords: string[];
  ogImage?: string;
  metaRobots?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  author: string;
  publishDate: string;
  updateDate?: string;
  readingTime: number;
  featured?: boolean;
  isRepost?: boolean;
  originalSource?: {
    title: string;
    author: string;
    url: string;
    publishDate: string;
    authorization: string;
  };
  externalLinks?: ExternalLink[];
  downloads?: Download[];
  seo: SEOConfig;
  schema?: {
    type: string;
    mainEntityOfPage?: boolean;
    wordCount?: number;
    articleSection?: string;
    inLanguage?: string;
    audience?: string;
    difficulty?: string;
  };
};
