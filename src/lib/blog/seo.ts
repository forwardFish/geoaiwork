import type { Metadata } from 'next';
import type { BlogPost } from './types';

// 生成文章的元数据
export function generateBlogPostMetadata(post: BlogPost): Metadata {
  const baseUrl = 'https://sheetally.com';

  return {
    title: `${post.title} | SheetAlly Blog`,
    description: post.description,
    keywords: post.seo.keywords,
    authors: [{ name: post.author }],
    creator: post.author,
    publisher: 'SheetAlly',
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: `${baseUrl}/blog/${post.slug}`,
      siteName: 'SheetAlly',
      publishedTime: post.publishDate,
      modifiedTime: post.updateDate || post.publishDate,
      authors: [post.author],
      images: post.seo.ogImage
        ? [
            {
              url: `${baseUrl}${post.seo.ogImage}`,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.seo.ogImage ? [`${baseUrl}${post.seo.ogImage}`] : undefined,
      creator: '@SheetAlly',
    },
    alternates: {
      canonical: post.seo.canonical,
    },
    robots: post.seo.metaRobots || 'index, follow',
  };
}

// 生成博客列表页的元数据
export function generateBlogListMetadata(): Metadata {
  return {
    title: 'Excel Data Processing Tips & Tutorials - SheetAlly Blog',
    description: 'Master Excel data cleaning, deduplication, sheet merging, text splitting, and format standardization. Practical tutorials and expert tips to boost your productivity.',
    keywords: [
      'Excel tutorials',
      'Excel data processing',
      'Excel tips',
      'Excel deduplication',
      'Excel merge',
      'Excel cleaning',
      'Excel automation',
      'Excel AI',
      'data processing tutorials',
      'excel vlookup',
      'excel pivot table',
      'excel formulas',
    ],
    openGraph: {
      title: 'Excel Data Processing Tips & Tutorials - SheetAlly Blog',
      description: 'Professional Excel data processing tutorials to eliminate Excel pain points and boost work efficiency.',
      type: 'website',
      url: 'https://sheetally.com/blog',
      siteName: 'SheetAlly',
      locale: 'zh_CN',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Excel Tips & Tutorials - SheetAlly Blog',
      description: 'Master Excel data processing with expert guides and tutorials.',
    },
    alternates: {
      canonical: 'https://sheetally.com/blog',
    },
  };
}

// 生成结构化数据 (JSON-LD)
export function generateArticleJsonLd(post: BlogPost) {
  const baseUrl = 'https://sheetally.com';

  return {
    '@context': 'https://schema.org',
    '@type': post.schema?.type || 'Article',
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    'headline': post.title,
    'description': post.description,
    'image': post.seo.ogImage ? [`${baseUrl}${post.seo.ogImage}`] : undefined,
    'datePublished': post.publishDate,
    'dateModified': post.updateDate || post.publishDate,
    'author': {
      '@type': 'Organization',
      'name': post.author,
      'url': baseUrl,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'SheetAlly',
      'url': baseUrl,
      'logo': {
        '@type': 'ImageObject',
        'url': `${baseUrl}/logo.png`,
      },
    },
    'articleBody': post.content,
    'wordCount': post.schema?.wordCount || estimateWordCount(post.content),
    'keywords': post.seo.keywords.join(', '),
    'articleSection': post.schema?.articleSection || post.category,
    'inLanguage': post.schema?.inLanguage || 'en-US',
    'audience': post.schema?.audience || 'Business professionals, analysts, students',
    'educationalLevel': post.schema?.difficulty || 'beginner-to-advanced',
    'potentialAction': {
      '@type': 'ReadAction',
      'target': [`${baseUrl}/blog/${post.slug}`],
    },
    'about': [
      {
        '@type': 'Thing',
        'name': 'Microsoft Excel',
        'description': 'Spreadsheet software for data analysis',
      },
      {
        '@type': 'Thing',
        'name': 'Data Analysis',
        'description': 'Process of inspecting and analyzing datasets',
      },
    ],
    'teaches': post.seo.keywords.slice(0, 3).map(keyword => ({
      '@type': 'Thing',
      'name': keyword,
    })),
    'timeRequired': `PT${estimateReadingTime(post.content)}M`,
    'isAccessibleForFree': true,
  };
}

// 生成面包屑结构化数据
export function generateBreadcrumbJsonLd(post: BlogPost) {
  const baseUrl = 'https://sheetally.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': baseUrl,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Blog',
        'item': `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': post.title,
        'item': `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };
}

// 生成HowTo Schema结构化数据
export function generateHowToJsonLd(post: BlogPost) {
  const baseUrl = 'https://sheetally.com';

  // 从文章内容中提取步骤
  const steps = extractStepsFromContent(post.content);

  if (steps.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': post.title,
    'description': post.description,
    'image': post.seo.ogImage ? [`${baseUrl}${post.seo.ogImage}`] : undefined,
    'totalTime': `PT${estimateReadingTime(post.content)}M`,
    'estimatedCost': {
      '@type': 'MonetaryAmount',
      'currency': 'USD',
      'value': '0',
    },
    'supply': [
      {
        '@type': 'HowToSupply',
        'name': 'Microsoft Excel',
      },
    ],
    'tool': [
      {
        '@type': 'HowToTool',
        'name': 'Computer or Mobile Device',
      },
    ],
    'step': steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.title,
      'text': step.description,
      'url': `${baseUrl}/blog/${post.slug}#step-${index + 1}`,
    })),
  };
}

// 生成FAQ Schema结构化数据
export function generateFAQJsonLd(post: BlogPost) {
  // 从文章内容中提取FAQ
  const faqs = extractFAQsFromContent(post.content);

  if (faqs.length === 0) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };
}

// 辅助函数：估算阅读时间
export function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = estimateWordCount(content);
  return Math.ceil(wordCount / wordsPerMinute);
}

// 辅助函数：估算字数
export function estimateWordCount(content: string): number {
  // Remove markdown syntax and count words
  const cleanContent = content
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]*`/g, '') // Remove inline code
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // Replace links with text
    .replace(/[#*_~`]/g, '') // Remove markdown symbols
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  return cleanContent.split(' ').filter(word => word.length > 0).length;
}

// 生成SEO分析报告
export function analyzeSEO(post: BlogPost) {
  const checks = [
    {
      name: 'Title Length',
      passed: post.title.length >= 30 && post.title.length <= 60,
      message: post.title.length < 30
        ? 'Title too short (< 30 chars)'
        : post.title.length > 60 ? 'Title too long (> 60 chars)' : 'Title length is good',
    },
    {
      name: 'Description Length',
      passed: post.description.length >= 120 && post.description.length <= 155,
      message: post.description.length < 120
        ? 'Description too short (< 120 chars)'
        : post.description.length > 155 ? 'Description too long (> 155 chars)' : 'Description length is good',
    },
    {
      name: 'Keywords Count',
      passed: post.seo.keywords.length >= 3 && post.seo.keywords.length <= 10,
      message: post.seo.keywords.length < 3
        ? 'Too few keywords (< 3)'
        : post.seo.keywords.length > 10 ? 'Too many keywords (> 10)' : 'Keywords count is good',
    },
    {
      name: 'Has External Links',
      passed: (post.externalLinks?.length || 0) >= 3,
      message: (post.externalLinks?.length || 0) < 3 ? 'Add more external links (< 3)' : 'External links count is good',
    },
    {
      name: 'Content Length',
      passed: estimateWordCount(post.content) >= 1500,
      message: estimateWordCount(post.content) < 1500 ? 'Content too short (< 1500 words)' : 'Content length is good',
    },
    {
      name: 'Has Tags',
      passed: post.tags.length >= 3 && post.tags.length <= 8,
      message: post.tags.length < 3
        ? 'Add more tags (< 3)'
        : post.tags.length > 8 ? 'Too many tags (> 8)' : 'Tags count is good',
    },
  ];

  const passedChecks = checks.filter(check => check.passed).length;
  const score = Math.round((passedChecks / checks.length) * 100);

  return { score, checks };
}

// 辅助函数：从内容中提取步骤
function extractStepsFromContent(content: string): Array<{ title: string; description: string }> {
  const steps: Array<{ title: string; description: string }> = [];
  const lines = content.split('\n');

  let currentStep: { title: string; description: string } | null = null;

  for (const line of lines) {
    // 检测步骤标题（### 开头）
    if (line.startsWith('### ') && (line.includes('Step') || line.includes('步骤') || line.includes('Example'))) {
      if (currentStep) {
        steps.push(currentStep);
      }
      currentStep = {
        title: line.replace('### ', '').trim(),
        description: '',
      };
    }
    // 检测编号列表作为步骤
    else if (/^\d+\.\s/.test(line.trim())) {
      if (currentStep) {
        steps.push(currentStep);
      }
      currentStep = {
        title: line.trim(),
        description: '',
      };
    }
    // 添加描述内容
    else if (currentStep && line.trim() && !line.startsWith('#') && !line.startsWith('```')) {
      currentStep.description += `${line.trim()} `;
    }
  }

  if (currentStep) {
    steps.push(currentStep);
  }

  return steps.slice(0, 10); // 限制步骤数量
}

// 辅助函数：从内容中提取FAQ
function extractFAQsFromContent(content: string): Array<{ question: string; answer: string }> {
  const faqs: Array<{ question: string; answer: string }> = [];
  const lines = content.split('\n');

  let currentFAQ: { question: string; answer: string } | null = null;
  let inFAQSection = false;

  for (const line of lines) {
    // 检测FAQ部分开始
    if (line.includes('FAQ') || line.includes('Frequently Asked Questions')) {
      inFAQSection = true;
      continue;
    }

    if (!inFAQSection) {
      continue;
    }

    // 检测问题（### Q: 或 **Q: 格式）
    if (line.includes('### Q:') || line.includes('**Q:')) {
      if (currentFAQ && currentFAQ.answer) {
        faqs.push(currentFAQ);
      }
      currentFAQ = {
        question: line.replace(/###\s*Q:\s*|^\*\*Q:\s*|\*\*/g, '').trim(),
        answer: '',
      };
    }
    // 检测答案（**A**: 格式）
    else if (line.includes('**A**:') && currentFAQ) {
      currentFAQ.answer = line.replace(/^\*\*A\*\*:\s*/g, '').trim();
    }
    // 继续添加答案内容
    else if (currentFAQ && currentFAQ.answer && line.trim() && !line.startsWith('#')) {
      currentFAQ.answer += ` ${line.trim()}`;
    }
  }

  if (currentFAQ && currentFAQ.answer) {
    faqs.push(currentFAQ);
  }

  return faqs.slice(0, 10); // 限制FAQ数量
}
