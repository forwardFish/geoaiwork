export const ExternalLinkConfig = {
  // 高权威度网站（dofollow）
  highAuthority: [
    'microsoft.com',
    'google.com',
    'apache.org',
    'github.com',
    'stackoverflow.com',
    'support.microsoft.com',
    'docs.microsoft.com',
    'developer.mozilla.org',
    'w3.org',
  ],

  // 中等权威度（selective follow）
  mediumAuthority: [
    'exceljet.net',
    'chandoo.org',
    'mrexcel.com',
    'excelforum.com',
    'contextures.com',
    'xl-central.com',
    'excel-university.com',
  ],

  // 需要nofollow的域名
  nofollow: [
    'reddit.com',
    'quora.com',
    'medium.com',
    'facebook.com',
    'twitter.com',
    'linkedin.com',
  ],

  // 外链属性规则
  linkAttributes: {
    default: {
      rel: 'external',
      target: '_blank',
    },
    highAuthority: {
      'rel': 'external',
      'target': '_blank',
      'data-authority': 'high',
    },
    mediumAuthority: {
      'rel': 'external',
      'target': '_blank',
      'data-authority': 'medium',
    },
    competitor: {
      rel: 'external nofollow',
      target: '_blank',
    },
  },

  // 每篇文章的外链限制
  limits: {
    maxTotal: 10, // 最多10个外链
    maxDofollow: 5, // 最多5个dofollow
    maxSameDomain: 2, // 同域名最多2个
  },
};

// 获取外链属性
export function getRelAttribute(url: string, _authority: 'high' | 'medium' | 'low' = 'medium'): string {
  try {
    const domain = new URL(url).hostname.toLowerCase();

    // 检查是否为高权威度网站
    if (ExternalLinkConfig.highAuthority.some(d => domain.includes(d))) {
      return 'external';
    }

    // 检查是否需要nofollow
    if (ExternalLinkConfig.nofollow.some(d => domain.includes(d))) {
      return 'external nofollow';
    }

    // 检查是否为中等权威度网站
    if (ExternalLinkConfig.mediumAuthority.some(d => domain.includes(d))) {
      return 'external';
    }

    // 默认情况下，未知网站使用nofollow
    return 'external nofollow';
  } catch {
    return 'external nofollow';
  }
}

// 验证外链质量
export function validateExternalLinks(links: Array<{ url: string; authority?: string }>): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查总数限制
  if (links.length > ExternalLinkConfig.limits.maxTotal) {
    errors.push(`Too many external links: ${links.length}. Maximum allowed: ${ExternalLinkConfig.limits.maxTotal}`);
  }

  // 检查dofollow数量
  const dofollowCount = links.filter((link) => {
    const rel = getRelAttribute(link.url, link.authority as any);
    return !rel.includes('nofollow');
  }).length;

  if (dofollowCount > ExternalLinkConfig.limits.maxDofollow) {
    warnings.push(`Too many dofollow links: ${dofollowCount}. Recommended maximum: ${ExternalLinkConfig.limits.maxDofollow}`);
  }

  // 检查同域名数量
  const domainCounts = new Map<string, number>();
  links.forEach((link) => {
    try {
      const domain = new URL(link.url).hostname.toLowerCase();
      domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
    } catch {
      errors.push(`Invalid URL: ${link.url}`);
    }
  });

  domainCounts.forEach((count, domain) => {
    if (count > ExternalLinkConfig.limits.maxSameDomain) {
      warnings.push(`Too many links to ${domain}: ${count}. Recommended maximum: ${ExternalLinkConfig.limits.maxSameDomain}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
