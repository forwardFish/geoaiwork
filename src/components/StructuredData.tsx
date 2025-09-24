import React from 'react';

type StructuredDataProps = {
  type: 'organization' | 'software' | 'article' | 'faq' | 'breadcrumb';
  data: any;
};

export function StructuredData({ type, data }: StructuredDataProps) {
  const generateStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': 'SheetAlly',
          'description': 'AI-powered Excel data processing workspace. Say goodbye to tedious data processing.',
          'url': 'https://sheetally.com',
          'logo': 'https://sheetally.com/logo.png',
          'sameAs': [
            'https://github.com/sheetally',
            'https://twitter.com/sheetally_com',
          ],
          'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'customer service',
            'email': 'support@sheetally.com',
          },
        };

      case 'software':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          'name': data.name || 'SheetAlly',
          'description': data.description,
          'url': data.url,
          'keywords': data.keywords,
          'category': 'BusinessApplication',
          'operatingSystem': 'Web Browser',
          'applicationCategory': 'Data Processing Tool',
          'offers': {
            '@type': 'Offer',
            'price': '0',
            'priceCurrency': 'USD',
            'description': 'Free Excel data processing tool',
          },
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': '4.8',
            'ratingCount': '156',
            'bestRating': '5',
            'worstRating': '1',
          },
          'featureList': [
            'Excel duplicate removal with keep latest',
            'Excel intelligent sheet merging',
            'Excel text splitting and cleaning',
            'Excel format standardization',
            'Excel version comparison',
          ],
        };

      case 'article':
        return {
          '@context': 'https://schema.org',
          '@type': 'Article',
          'headline': data.title,
          'description': data.description,
          'author': {
            '@type': 'Organization',
            'name': 'SheetAlly Team',
          },
          'publisher': {
            '@type': 'Organization',
            'name': 'SheetAlly',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://sheetally.com/logo.png',
            },
          },
          'datePublished': data.publishDate,
          'dateModified': data.modifiedDate || data.publishDate,
          'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': data.url,
          },
          'articleSection': data.category,
          'keywords': data.keywords,
          'wordCount': data.wordCount || 2000,
          'timeRequired': data.readTime || 'PT5M',
        };

      case 'faq':
        return {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': data.questions?.map((q: any) => ({
            '@type': 'Question',
            'name': q.question,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': q.answer,
            },
          })) || [],
        };

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': data.items?.map((item: any, index: number) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.url,
          })) || [],
        };

      default:
        return null;
    }
  };

  const structuredData = generateStructuredData();

  if (!structuredData) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
