import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

interface GeoAnalysisResult {
  url: string;
  overallScore: number;
  aiReadiness: number;
  contentStructure: number;
  technicalSeo: number;
  structuredData: number;
  recommendations: string[];
  keyFindings: {
    title: string;
    status: 'good' | 'warning' | 'error';
    description: string;
  }[];
  generatedFiles: {
    faqJsonLd: string;
    llmTxt: string;
    aiDatasetJson: string;
  };
  aiEngineCompatibility: {
    chatgpt: 'high' | 'medium' | 'low';
    perplexity: 'high' | 'medium' | 'low';
    googleSge: 'high' | 'medium' | 'low';
    claude: 'high' | 'medium' | 'low';
  };
}

async function fetchWebsiteContent(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; GeoAIWork-Bot/1.0; +https://geoaiwork.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
      },
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    return html;
  } catch (error) {
    throw new Error(`Failed to fetch website: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

function analyzeWebsiteContent(html: string, url: string): GeoAnalysisResult {
  const $ = cheerio.load(html);

  // Extract key elements
  const title = $('title').text().trim();
  const metaDescription = $('meta[name="description"]').attr('content') || '';
  const headings = {
    h1: $('h1').length,
    h2: $('h2').length,
    h3: $('h3').length,
  };
  const paragraphs = $('p').length;
  const images = $('img').length;

  // Check for structured data
  const jsonLdScripts = $('script[type="application/ld+json"]').length;
  const faqSchema = $('script[type="application/ld+json"]').text().includes('FAQPage');
  const articleSchema = $('script[type="application/ld+json"]').text().includes('Article');

  // Check for AI-friendly elements
  const hasFaqSection = $('*:contains("FAQ"), *:contains("Frequently Asked"), *:contains("Questions")').length > 0;
  const hasTableOfContents = $('*:contains("Table of Contents"), .toc, #toc').length > 0;
  const hasReadableContent = paragraphs > 5;
  const hasProperHeadingStructure = headings.h1 > 0 && headings.h2 > 0;

  // Calculate scores
  const contentStructureScore = Math.min(100,
    (hasProperHeadingStructure ? 30 : 0) +
    (hasReadableContent ? 25 : 0) +
    (hasFaqSection ? 20 : 0) +
    (hasTableOfContents ? 15 : 0) +
    (title.length > 10 ? 10 : 0)
  );

  const structuredDataScore = Math.min(100,
    (jsonLdScripts * 20) +
    (faqSchema ? 30 : 0) +
    (articleSchema ? 20 : 0) +
    (metaDescription.length > 100 ? 15 : 0) +
    ($('meta[property^="og:"]').length > 0 ? 15 : 0)
  );

  const technicalSeoScore = Math.min(100,
    (title.length > 0 ? 20 : 0) +
    (metaDescription.length > 0 ? 20 : 0) +
    (headings.h1 > 0 ? 15 : 0) +
    (images > 0 ? 10 : 0) +
    ($('meta[name="robots"]').length > 0 ? 15 : 0) +
    ($('link[rel="canonical"]').length > 0 ? 10 : 0) +
    ($('meta[name="viewport"]').length > 0 ? 10 : 0)
  );

  const aiReadinessScore = Math.min(100,
    (hasFaqSection ? 25 : 0) +
    (hasReadableContent ? 20 : 0) +
    (hasProperHeadingStructure ? 20 : 0) +
    (structuredDataScore > 50 ? 20 : 0) +
    (hasTableOfContents ? 15 : 0)
  );

  const overallScore = Math.round((contentStructureScore + structuredDataScore + technicalSeoScore + aiReadinessScore) / 4);

  // Generate recommendations
  const recommendations: string[] = [];
  if (!hasFaqSection) recommendations.push('Add a FAQ section to improve AI citation potential');
  if (!hasTableOfContents) recommendations.push('Include a table of contents for better content structure');
  if (!faqSchema) recommendations.push('Implement FAQ Schema markup for better AI understanding');
  if (jsonLdScripts === 0) recommendations.push('Add structured data markup (JSON-LD) for AI engines');
  if (!hasProperHeadingStructure) recommendations.push('Improve heading hierarchy (H1, H2, H3) for better content structure');
  if (metaDescription.length < 120) recommendations.push('Optimize meta description length (120-160 characters)');
  if (paragraphs < 10) recommendations.push('Increase content depth with more comprehensive paragraphs');

  // Generate key findings
  const keyFindings: Array<{title: string, status: 'good' | 'warning' | 'error', description: string}> = [
    {
      title: 'Content Structure',
      status: hasProperHeadingStructure ? 'good' : 'warning',
      description: hasProperHeadingStructure
        ? 'Well-structured content with proper heading hierarchy'
        : 'Content lacks proper heading structure (H1, H2, H3)',
    },
    {
      title: 'FAQ Content',
      status: hasFaqSection ? 'good' : 'error',
      description: hasFaqSection
        ? 'FAQ content found - excellent for AI citations'
        : 'No FAQ section detected - missing citation opportunities',
    },
    {
      title: 'Structured Data',
      status: jsonLdScripts > 0 ? 'good' : 'warning',
      description: jsonLdScripts > 0
        ? `${jsonLdScripts} structured data blocks found`
        : 'No structured data markup detected',
    },
  ];

  // Generate AI compatibility scores
  const aiEngineCompatibility: {
    chatgpt: 'high' | 'medium' | 'low';
    perplexity: 'high' | 'medium' | 'low';
    googleSge: 'high' | 'medium' | 'low';
    claude: 'high' | 'medium' | 'low';
  } = {
    chatgpt: faqSchema && hasFaqSection ? 'high' : hasReadableContent ? 'medium' : 'low',
    perplexity: structuredDataScore > 60 ? 'high' : structuredDataScore > 30 ? 'medium' : 'low',
    googleSge: technicalSeoScore > 70 ? 'high' : technicalSeoScore > 50 ? 'medium' : 'low',
    claude: hasProperHeadingStructure && hasReadableContent ? 'high' : 'medium',
  };

  // Generate optimized files
  const generatedFiles = {
    faqJsonLd: generateFaqJsonLd(title, url, $),
    llmTxt: generateLlmTxt(title, metaDescription, url),
    aiDatasetJson: generateAiDatasetJson(title, metaDescription, url, $),
  };

  return {
    url,
    overallScore,
    aiReadiness: aiReadinessScore,
    contentStructure: contentStructureScore,
    technicalSeo: technicalSeoScore,
    structuredData: structuredDataScore,
    recommendations,
    keyFindings,
    generatedFiles,
    aiEngineCompatibility,
  };
}

function generateFaqJsonLd(_title: string, _url: string, $: cheerio.CheerioAPI): string {
  // Extract potential FAQ content
  const faqItems: Array<{question: string, answer: string}> = [];

  // Look for common FAQ patterns
  $('*:contains("?")').each((_, element) => {
    const text = $(element).text().trim();
    if (text.includes('?') && text.length < 200) {
      const parts = text.split('?');
      if (parts.length >= 2) {
        faqItems.push({
          question: (parts[0] || '').trim() + '?',
          answer: (parts[1] || '').trim() || 'Please visit our website for more information.',
        });
      }
    }
  });

  // Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.slice(0, 5).map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };

  return JSON.stringify(faqSchema, null, 2);
}

function generateLlmTxt(title: string, description: string, url: string): string {
  return `# ${title}

${description}

## Site Information
- URL: ${url}
- Type: Website
- Language: English
- Last Updated: ${new Date().toISOString().split('T')[0]}

## Content Overview
This website contains information and services related to the content found on the main page.
The site is optimized for AI search engines and provides structured information for better discoverability.

## Crawling Instructions
- This site allows crawling by AI bots
- Content is regularly updated
- Structured data is available in JSON-LD format
- FAQ sections provide direct answers to common questions

## Contact Information
For questions about this content, please visit the website directly.

---
Generated by GeoAIWork - GEO Optimization Platform
`;
}

function generateAiDatasetJson(title: string, description: string, url: string, $: cheerio.CheerioAPI): string {
  const headings = $('h1, h2, h3').map((_, el) => $(el).text().trim()).get();
  const keyContent = $('p').first().text().trim().substring(0, 500);

  const dataset = {
    name: title,
    description: description,
    url: url,
    dateCreated: new Date().toISOString().split('T')[0],
    publisher: {
      "@type": "Organization",
      "name": "Website Owner",
    },
    keywords: headings.slice(0, 10),
    about: keyContent,
    inLanguage: "en",
    license: "https://creativecommons.org/licenses/by/4.0/",
    version: "1.0",
  };

  return JSON.stringify(dataset, null, 2);
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { error: 'Valid URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Fetch and analyze website
    const html = await fetchWebsiteContent(url);
    const analysisResult = analyzeWebsiteContent(html, url);

    return NextResponse.json(analysisResult);

  } catch (error) {
    console.error('GEO Analysis error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Analysis failed',
        details: 'Please check the URL and try again',
      },
      { status: 500 }
    );
  }
}