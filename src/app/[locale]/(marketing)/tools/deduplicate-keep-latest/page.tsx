import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ToolWorkbench } from '@/components/ToolWorkbench';
import { SEO_KEYWORDS_CORE, SEO_KEYWORDS_PRIMARY } from '@/lib/seo-keywords';

type IToolProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Excel Deduplication: Keep Latest Records with AI Smart Aggregation | SheetAlly',
    description: 'Remove Excel duplicates while keeping the latest records. Support intelligent deduplication by date, version, score fields with automatic data aggregation. Overcome Excel\'s native remove duplicates limitations.',
    keywords: [...SEO_KEYWORDS_CORE, ...SEO_KEYWORDS_PRIMARY],
    openGraph: {
      title: 'Excel Deduplication Tool - Keep Latest Records with Smart Aggregation',
      description: 'Advanced Excel deduplication that keeps latest records while aggregating data. Solve Excel\'s native remove duplicates limitations with AI-powered retention strategies.',
      type: 'website',
      url: 'https://sheetally.com/tools/deduplicate-keep-latest',
      siteName: 'SheetAlly',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Excel Deduplication Tool - Keep Latest Records',
      description: 'Remove Excel duplicates while keeping latest records with intelligent data aggregation.',
    },
    alternates: {
      canonical: 'https://sheetally.com/tools/deduplicate-keep-latest',
    },
  };
}

export default async function DeduplicateKeepLatest(props: IToolProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* SEO-optimized page title and description */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Excel Deduplication: Keep Latest Records & Auto-Aggregate Data
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Overcome Excel's native "Remove Duplicates" limitations. Intelligently keep the latest records while automatically aggregating data from other columns.
            Perfect for sales data deduplication, customer record management, and order processing.
          </p>
        </div>

        {/* Pain Points Section */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Solve Excel's 3 Major Deduplication Pain Points
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">1</span>
              </div>
              <h3 className="mb-2 font-semibold">No Retention Strategy Control</h3>
              <p className="text-sm text-gray-600">
                Excel's native remove duplicates randomly keeps one record - can't specify keeping latest by date, version, or other fields
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">2</span>
              </div>
              <h3 className="mb-2 font-semibold">No Simultaneous Data Aggregation</h3>
              <p className="text-sm text-gray-600">
                After removing duplicate rows, can't automatically calculate sum totals, count statistics, or other aggregations from duplicate data
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">3</span>
              </div>
              <h3 className="mb-2 font-semibold">Complex Multi-Step Process</h3>
              <p className="text-sm text-gray-600">
                Requires sorting first, then removing duplicates, then manual aggregation calculations - time-consuming and error-prone
              </p>
            </div>
          </div>
        </div>

        {/* Solution Showcase */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            SheetAlly Smart Deduplication Solution
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-green-600">
                ✓ Intelligent Retention Strategies
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Keep latest records by date fields</li>
                <li>• Keep highest version by version numbers</li>
                <li>• Keep best records by score values</li>
                <li>• Support multi-field combination deduplication</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-green-600">
                ✓ Automatic Data Aggregation
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Auto-sum amount totals</li>
                <li>• Auto-count quantity statistics</li>
                <li>• Support max, min value calculations</li>
                <li>• One-click aggregation column generation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Common Use Cases
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <h4 className="mb-2 font-semibold">Sales Data</h4>
              <p className="text-sm text-gray-600">
                Keep latest customer orders, aggregate historical transaction amounts
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <h4 className="mb-2 font-semibold">Customer Records</h4>
              <p className="text-sm text-gray-600">
                Keep latest customer info, merge contact details
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <h4 className="mb-2 font-semibold">Inventory Management</h4>
              <p className="text-sm text-gray-600">
                Keep latest product entries, aggregate total inventory quantities
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4 text-center">
              <h4 className="mb-2 font-semibold">Employee Records</h4>
              <p className="text-sm text-gray-600">
                Keep latest employee updates, calculate total service years
              </p>
            </div>
          </div>
        </div>

        {/* Tool Workbench */}
        <ToolWorkbench />

        {/* FAQ Section */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Q: What's the difference between Excel's native remove duplicates and SheetAlly?</h3>
              <p className="text-gray-600">
                A: Excel's native feature randomly keeps one record, while SheetAlly lets you specify keeping the latest record by date, version, or other fields, plus supports data aggregation.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: Can I deduplicate by multiple fields simultaneously?</h3>
              <p className="text-gray-600">
                A: Yes. You can select multiple columns as deduplication keys, for example, deduplicate by both "Customer ID" and "Product Code" combinations.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: What aggregation methods are supported?</h3>
              <p className="text-gray-600">
                A: Supports SUM, COUNT, MAX, MIN, and other common aggregation functions for numerical data.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: Can I export the processed data?</h3>
              <p className="text-gray-600">
                A: Yes. You can export as standard Excel files, including processing results, operation recipes, and detailed reports.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
