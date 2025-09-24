import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ToolWorkbench } from '@/components/ToolWorkbench';

type IToolProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'SheetAlly Tool - Excel AI Data Processing',
    description: 'Process your Excel files with natural language commands. Upload, describe, preview, and export with confidence.',
    keywords: 'Excel tool, data processing, AI workbench, spreadsheet automation',
    robots: 'noindex', // Don't index tool page
  };
}

export default async function Tool(props: IToolProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return <ToolWorkbench />;
}
