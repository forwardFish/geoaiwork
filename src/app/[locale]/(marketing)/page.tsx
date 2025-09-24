import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { BlogSection } from '@/components/BlogSection';
import { FAQSection } from '@/components/FAQSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { StructuredData } from '@/components/StructuredData';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { SEO_KEYWORDS_ALL } from '@/lib/seo-keywords';

type IIndexProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'GeoAIWork - Professional GEO Optimization Platform | AI Search Engine Optimization for ChatGPT, Perplexity & More',
    description: 'Optimize your website for AI search engines with GeoAIWork. Comprehensive GEO analysis, AI-friendly structured data generation, FAQ JSON-LD, llm.txt files, and ChatGPT optimization. Increase AI citations and visibility.',
    keywords: SEO_KEYWORDS_ALL,
    openGraph: {
      title: 'GeoAIWork - Professional GEO Optimization Platform',
      description: 'The leading GEO (Generative Engine Optimization) platform. Analyze AI-friendliness, generate structured data, optimize for ChatGPT, Perplexity, and Google SGE. Increase your website\'s AI search visibility and citations.',
      type: 'website',
      url: 'https://geoaiwork.com',
      siteName: 'GeoAIWork',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'GeoAIWork - GEO Optimization for AI Search Engines',
      description: 'Professional GEO optimization platform. Analyze, optimize, and dominate AI search results. ChatGPT, Perplexity, Google SGE optimization made easy.',
    },
    alternates: {
      canonical: 'https://geoaiwork.com',
    },
  };
}

export default async function Index(props: IIndexProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen">
      <StructuredData
        type="organization"
        data={{
          name: 'GeoAIWork',
          url: 'https://geoaiwork.com',
          description: 'Professional GEO (Generative Engine Optimization) platform for AI search engines',
        }}
      />
      <StructuredData
        type="software"
        data={{
          name: 'GeoAIWork',
          description: 'Professional GEO optimization platform. Comprehensive website analysis for AI search engines, structured data generation (FAQ JSON-LD, llm.txt, ai-dataset.json), and optimization for ChatGPT, Perplexity, Google SGE, and other generative AI engines.',
          url: 'https://geoaiwork.com',
          keywords: SEO_KEYWORDS_ALL,
          applicationCategory: 'SEO Tools',
          operatingSystem: 'Web Browser',
          offers: {
            price: '0',
            priceCurrency: 'USD',
            description: 'Free GEO analysis with premium features available',
          },
        }}
      />
      <Header />
      <div className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <BlogSection />
        <TestimonialsSection />
        <FAQSection />
        <Footer />
      </div>
    </div>
  );
};
