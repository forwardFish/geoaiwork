import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AnalyzeWorkbench } from '@/components/AnalyzeWorkbench';

type IAnalyzeProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'GEO Analysis Tool - AI Search Engine Optimization Analysis | GeoAIWork',
    description: 'Analyze your website\'s AI-friendliness and optimization for ChatGPT, Perplexity, and other generative AI search engines. Get comprehensive GEO analysis, structured data generation, and optimization recommendations.',
    keywords: 'GEO analysis, AI search optimization, ChatGPT SEO, website analysis, AI-friendliness score, structured data generation, generative engine optimization',
    openGraph: {
      title: 'GEO Analysis Tool - Professional AI Search Optimization',
      description: 'Comprehensive GEO analysis for ChatGPT, Perplexity, Google SGE and other AI search engines. Analyze AI-friendliness, generate structured data, optimize for citations.',
      type: 'website',
    },
  };
}

export default async function Analyze(props: IAnalyzeProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <AnalyzeWorkbench />;
}