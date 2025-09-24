import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ToolWorkbench } from '@/components/ToolWorkbench';
import { SEO_KEYWORDS_CORE, SEO_KEYWORDS_TECHNICAL } from '@/lib/seo-keywords';

type IToolProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Excel Date & Currency Format Standardization Tool - Batch Format Unifier | SheetAlly',
    description: 'Excel date formats inconsistent? Currency formats all over the place? One-click standardization to uniform formats. Support multiple date format recognition, currency symbol cleanup, thousand separator handling.',
    keywords: [...SEO_KEYWORDS_CORE, ...SEO_KEYWORDS_TECHNICAL],
    openGraph: {
      title: 'Excel Date & Currency Format Standardization Tool - Batch Format Unifier',
      description: 'Excel date and currency formats inconsistent? One-click standardization processing. Support multiple format recognition, skip manual adjustment hassles.',
      type: 'website',
      url: 'https://sheetally.com/tools/date-currency-normalize',
      siteName: 'SheetAlly',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Excel Date & Currency Format Standardization Tool',
      description: 'Excel date and currency format one-click standardization.',
    },
    alternates: {
      canonical: 'https://sheetally.com/tools/date-currency-normalize',
    },
  };
}

export default async function DateCurrencyNormalize(props: IToolProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Excel Date & Currency Format Standardization: One-Click Format Unification, Skip Manual Adjustments
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Solve Excel's chaotic date formats and inconsistent currency symbols.
            Intelligently recognize multiple formats and batch convert to standard formats, making data neat and organized for subsequent analysis and calculations.
          </p>
        </div>

        {/* Format Chaos Pain Points */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Solve Excel Format Chaos's 6 Major Pain Points
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 flex items-center text-lg font-semibold text-red-600">
                📅 Chaotic Date Formats
              </h3>
              <div className="space-y-3">
                <div className="border-l-4 border-red-400 bg-red-50 p-3">
                  <p className="mb-1 text-sm font-medium text-red-800">Common Problems:</p>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• "May 1, 2023" vs "05/01/2023" vs "May 1, 2023"</li>
                    <li>• Text format dates can't participate in calculations and sorting</li>
                    <li>• Different regional date format standards are inconsistent</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-400 bg-green-50 p-3">
                  <p className="mb-1 text-sm font-medium text-green-800">Solutions:</p>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Intelligently recognize various date formats</li>
                    <li>• Uniformly convert to YYYY-MM-DD format</li>
                    <li>• Set as Excel date type for easy calculations</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 flex items-center text-lg font-semibold text-red-600">
                💰 Messy Currency Formats
              </h3>
              <div className="space-y-3">
                <div className="border-l-4 border-red-400 bg-red-50 p-3">
                  <p className="mb-1 text-sm font-medium text-red-800">Common Problems:</p>
                  <ul className="space-y-1 text-sm text-red-700">
                    <li>• "$1,234.00" vs "€5.6K" vs "¥100"</li>
                    <li>• Thousand separators affect numerical calculations</li>
                    <li>• Currency symbols prevent sum statistics</li>
                  </ul>
                </div>
                <div className="border-l-4 border-green-400 bg-green-50 p-3">
                  <p className="mb-1 text-sm font-medium text-green-800">Solutions:</p>
                  <ul className="space-y-1 text-sm text-green-700">
                    <li>• Auto-identify and remove currency symbols</li>
                    <li>• Handle thousand separators and unit abbreviations</li>
                    <li>• Convert to pure numerical values for calculations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supported Format Types */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Supported Format Types
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 flex items-center text-lg font-semibold text-blue-600">
                📅 Date Format Recognition
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">International Formats:</h4>
                  <div className="rounded bg-gray-100 p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span>May 1st, 2023</span>
                      <span className="text-green-600">→ 2023-05-01</span>
                      <span>1 May 2023</span>
                      <span className="text-green-600">→ 2023-05-01</span>
                      <span>01/05/2023</span>
                      <span className="text-green-600">→ 2023-05-01</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">English Formats:</h4>
                  <div className="rounded bg-gray-100 p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span>May 1, 2023</span>
                      <span className="text-green-600">→ 2023-05-01</span>
                      <span>01 May 2023</span>
                      <span className="text-green-600">→ 2023-05-01</span>
                      <span>1-May-23</span>
                      <span className="text-green-600">→ 2023-05-01</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Numeric Formats:</h4>
                  <div className="rounded bg-gray-100 p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span>05/01/2023</span>
                      <span className="text-green-600">→ 2023-05-01</span>
                      <span>2023-5-1</span>
                      <span className="text-green-600">→ 2023-05-01</span>
                      <span>20230501</span>
                      <span className="text-green-600">→ 2023-05-01</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-4 flex items-center text-lg font-semibold text-green-600">
                💰 Currency Format Processing
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 font-medium">Currency Symbols:</h4>
                  <div className="rounded bg-gray-100 p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span>$1,234.00</span>
                      <span className="text-green-600">→ 1234.00</span>
                      <span>€5,678.90</span>
                      <span className="text-green-600">→ 5678.90</span>
                      <span>¥999.99</span>
                      <span className="text-green-600">→ 999.99</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Unit Abbreviations:</h4>
                  <div className="rounded bg-gray-100 p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span>5.6K</span>
                      <span className="text-green-600">→ 5600</span>
                      <span>1.2M</span>
                      <span className="text-green-600">→ 1200000</span>
                      <span>3.5B</span>
                      <span className="text-green-600">→ 3500000000</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 font-medium">Special Formats:</h4>
                  <div className="rounded bg-gray-100 p-3 text-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <span>(1,000)</span>
                      <span className="text-green-600">→ -1000</span>
                      <span>100%</span>
                      <span className="text-green-600">→ 1.00</span>
                      <span>1,000,000</span>
                      <span className="text-green-600">→ 1000000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Case Examples */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Common Use Cases
          </h2>
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3">
                  <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold">📊 Financial Report Standardization</h3>
                  <p className="mb-3 text-gray-600">
                    Financial data submitted by different departments has inconsistent formats and needs standardization before summary analysis.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium text-red-600">Before Processing (Chaotic Formats):</h4>
                        <ul className="space-y-1 text-sm">
                          <li>Date: May 1, 2023, 05/01/2023, 2023-05-01</li>
                          <li>Amount: $1,234, €5.6K, ¥100.00</li>
                          <li>Status: Completed, In Progress, Not Started</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium text-green-600">After Processing (Standard Formats):</h4>
                        <ul className="space-y-1 text-sm">
                          <li>Date: 2023-05-01, 2023-05-01, 2023-05-01</li>
                          <li>Amount: 1234, 5600, 100.00</li>
                          <li>Ready for pivot table and chart analysis</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 rounded-lg bg-green-100 p-3">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold">🛍️ E-commerce Data Cleaning</h3>
                  <p className="mb-3 text-gray-600">
                    Sales data exported from different platforms has varying formats and needs unification for data analysis.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium text-red-600">Multi-Platform Format Differences:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>Amazon: 2023-05-01 15:30:45</li>
                          <li>eBay: May 1, 2023</li>
                          <li>Shopify: 05/01/2023</li>
                          <li>Price: $99.9, €99.90, £100</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium text-green-600">After Unification for Analysis:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>Date: Unified to 2023-05-01</li>
                          <li>Amount: Unified to numeric format</li>
                          <li>Easy analysis by date, price range</li>
                          <li>Support pivot table statistics</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 rounded-lg bg-purple-100 p-3">
                  <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold">🏢 Enterprise Data Integration</h3>
                  <p className="mb-3 text-gray-600">
                    Integrate enterprise data from different systems and time periods, preparing for BI analysis.
                  </p>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="mb-2 font-medium text-red-600">System Differences:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>ERP System: 20230501, 1234.56</li>
                          <li>CRM System: 2023/5/1, $1,234.56</li>
                          <li>Excel Manual: May 1, 2023, 1,234</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="mb-2 font-medium text-green-600">Standardization Benefits:</h4>
                        <ul className="space-y-1 text-sm">
                          <li>Smooth data warehouse import</li>
                          <li>Accurate BI tool recognition</li>
                          <li>Correct report calculations</li>
                          <li>Improved data quality</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Workbench */}
        <ToolWorkbench />

        {/* Smart Recognition Rules */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Smart Recognition Rules Explanation
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-blue-600">📅 Date Recognition Logic</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="mb-1 font-medium">1. Format Detection:</h4>
                  <p className="text-sm text-gray-600">
                    Auto-identify ISO format, international format, English format, numeric format and other common date representations
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium">2. Ambiguity Handling:</h4>
                  <p className="text-sm text-gray-600">
                    For potentially ambiguous formats like 01/03/04, intelligently determine based on overall data characteristics
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium">3. Failed Samples:</h4>
                  <p className="text-sm text-gray-600">
                    Unrecognizable date formats retain original values and marked as "uncertain samples"
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-green-600">💰 Currency Recognition Logic</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="mb-1 font-medium">1. Symbol Recognition:</h4>
                  <p className="text-sm text-gray-600">
                    Identify $, €, ¥, £ and other common currency symbols, as well as units like "dollars", "thousands"
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium">2. Format Cleaning:</h4>
                  <p className="text-sm text-gray-600">
                    Auto-remove thousand separators, parentheses for negative numbers, percentage signs and other format markers
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium">3. Unit Conversion:</h4>
                  <p className="text-sm text-gray-600">
                    Auto-handle K(thousand), M(million), B(billion) and other unit abbreviation numerical conversions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Q: How to handle unrecognizable date formats?</h3>
              <p className="text-gray-600">
                A: System will retain original values for unrecognizable dates and list them in "uncertain samples". You can review these samples, manually adjust formats or provide examples for system learning.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: How are negative numbers represented in currency?</h3>
              <p className="text-gray-600">
                A: Support multiple negative number representations: -1000, (1000), 1000-, etc., all correctly recognized as negative numbers.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: Can I customize output formats?</h3>
              <p className="text-gray-600">
                A: Yes. Dates can choose YYYY-MM-DD, DD/MM/YYYY and other formats; currency can choose decimal places, whether to add thousand separators, etc.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: How is performance when processing large amounts of data?</h3>
              <p className="text-gray-600">
                A: System is optimized for large data volumes and can quickly process tens of thousands of rows. Super large files show processing progress and support background processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
