import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ToolWorkbench } from '@/components/ToolWorkbench';
import { SEO_KEYWORDS_CORE, SEO_KEYWORDS_CONTENT_OPTIMIZATION } from '@/lib/seo-keywords';

type IToolProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Excel Text Split & Clean Tool - Smart Name & Address Parsing | SheetAlly',
    description: 'Excel name splitting, address parsing, phone number cleaning made easy. Support intelligent Chinese/English name splitting, batch dirty data processing. Skip complex regex and Power Query.',
    keywords: [...SEO_KEYWORDS_CORE, ...SEO_KEYWORDS_CONTENT_OPTIMIZATION],
    openGraph: {
      title: 'Excel Text Split & Clean Tool - Smart Name & Address Parsing',
      description: 'Excel name splitting and address parsing made easy. Support intelligent Chinese/English name splitting. Skip complex text processing.',
      type: 'website',
      url: 'https://sheetally.com/tools/text-clean-split',
      siteName: 'SheetAlly',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Excel Text Split & Clean Tool',
      description: 'Excel name splitting and address parsing made easy.',
    },
    alternates: {
      canonical: 'https://sheetally.com/tools/text-clean-split',
    },
  };
}

export default async function TextCleanSplit(props: IToolProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Excel Text Split & Clean: Smart Name & Address Parsing, Batch Dirty Data Processing
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Skip complex regex and Power Query - one-click Excel text splitting.
            Support intelligent Chinese/English name recognition, address segmentation, phone number formatting and other common text processing needs.
          </p>
        </div>

        {/* Excel Text Processing Pain Points */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Solve Excel Text Processing's 5 Major Pain Points
          </h2>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">1</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Limited Split Functions</h3>
              <p className="text-xs text-gray-600">
                Excel native split only supports simple delimiters, can't handle complex Chinese/English names
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">2</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold">High Regex Learning Curve</h3>
              <p className="text-xs text-gray-600">
                Complex regex syntax has high learning costs, difficult for regular users to master
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">3</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Complex Power Query</h3>
              <p className="text-xs text-gray-600">
                M language learning difficulty is high, text processing functions are complex and hard to understand
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">4</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Difficult Batch Processing</h3>
              <p className="text-xs text-gray-600">
                Manual row-by-row splitting is extremely time-consuming and error-prone
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <span className="font-bold text-red-600">5</span>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Inconsistent Formats</h3>
              <p className="text-xs text-gray-600">
                Diverse data sources with various text formats are difficult to process uniformly
              </p>
            </div>
          </div>
        </div>

        {/* Smart Split Solution */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            AI Smart Text Splitting Solution
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 flex items-center text-lg font-semibold text-green-600">
                <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Intelligent Name Recognition
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  •
                  <strong>Chinese Names:</strong>
                  "Zhang San" → "Zhang" + "San"
                </li>
                <li>
                  •
                  <strong>English Names:</strong>
                  "John Smith" → "John" + "Smith"
                </li>
                <li>
                  •
                  <strong>Compound Names:</strong>
                  "Li Xiaoming" → "Li" + "Xiaoming"
                </li>
                <li>
                  •
                  <strong>With Titles:</strong>
                  "Mr. Zhang" → "Zhang" + "Mister"
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 flex items-center text-lg font-semibold text-green-600">
                <svg className="mr-2 h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                Smart Address Splitting
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>
                  •
                  <strong>Province/City/District:</strong>
                  "Beijing Chaoyang District" → "Beijing" + "Chaoyang District"
                </li>
                <li>
                  •
                  <strong>Detailed Address:</strong>
                  Auto-identify streets, house numbers
                </li>
                <li>
                  •
                  <strong>Postal Code Extraction:</strong>
                  Auto-identify 6-digit postal codes
                </li>
                <li>
                  •
                  <strong>Format Standardization:</strong>
                  Standardize address formats
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Supported Split Modes */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Supported Split Modes
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <span className="font-bold text-blue-600">SEP</span>
                </div>
              </div>
              <h3 className="mb-2 text-center font-semibold">Delimiter Split</h3>
              <p className="mb-2 text-center text-sm text-gray-600">
                Split by comma, space, tab, etc.
              </p>
              <div className="text-xs text-gray-500">
                Example:
                <br />
                "Apple,Banana,Orange" → "Apple" | "Banana" | "Orange"
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                  <span className="font-bold text-green-600">REG</span>
                </div>
              </div>
              <h3 className="mb-2 text-center font-semibold">Regular Expression</h3>
              <p className="mb-2 text-center text-sm text-gray-600">
                Support complex pattern matching
              </p>
              <div className="text-xs text-gray-500">
                Example:
                <br />
                Extract email username and domain
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                  <span className="font-bold text-purple-600">CN</span>
                </div>
              </div>
              <h3 className="mb-2 text-center font-semibold">Chinese Names</h3>
              <p className="mb-2 text-center text-sm text-gray-600">
                Intelligently identify Chinese surnames and given names
              </p>
              <div className="text-xs text-gray-500">
                Example:
                <br />
                "Wang Xiaoming" → "Wang" | "Xiaoming"
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="mb-3 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                  <span className="font-bold text-orange-600">EN</span>
                </div>
              </div>
              <h3 className="mb-2 text-center font-semibold">English Names</h3>
              <p className="mb-2 text-center text-sm text-gray-600">
                Split English names by spaces
              </p>
              <div className="text-xs text-gray-500">
                Example:
                <br />
                "John Smith" → "John" | "Smith"
              </div>
            </div>
          </div>
        </div>

        {/* Common Use Cases */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Common Use Cases
          </h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-lg bg-blue-100 p-3">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">👥 Customer Information Management</h3>
                <p className="mb-2 text-gray-600">
                  Split "Contact" column into "First Name" and "Last Name" for personalized addressing;
                  Split "Contact Info" into "Mobile" and "Email" for categorized management.
                </p>
                <div className="rounded bg-gray-100 p-3 text-sm">
                  <strong>Before:</strong>
                  Contact: "Zhang Xiaoming", Contact Info: "13812345678,zhang@email.com"
                  <br />
                  <strong>After:</strong>
                  Surname: "Zhang", Given Name: "Xiaoming", Mobile: "13812345678", Email: "zhang@email.com"
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-lg bg-green-100 p-3">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">📍 Logistics Address Processing</h3>
                <p className="mb-2 text-gray-600">
                  Split complete addresses into "Province", "City", "District", "Detailed Address"
                  for regional analysis and shipping cost calculation.
                </p>
                <div className="rounded bg-gray-100 p-3 text-sm">
                  <strong>Before:</strong>
                  "Beijing Chaoyang District Jianguomenwai Street No.1 World Trade Center Tower A Room 1001"
                  <br />
                  <strong>After:</strong>
                  Province: "Beijing", District: "Chaoyang District", Detail: "Jianguomenwai Street No.1 World Trade Center Tower A Room 1001"
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 rounded-lg bg-purple-100 p-3">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold">📋 HR Records Organization</h3>
                <p className="mb-2 text-gray-600">
                  Split employee "Name" for sorting purposes, extract birth date and gender from "ID Number",
                  split "University & Major" into separate fields.
                </p>
                <div className="rounded bg-gray-100 p-3 text-sm">
                  <strong>Before:</strong>
                  "Li Xiaohong", "Tsinghua University Computer Science & Technology"
                  <br />
                  <strong>After:</strong>
                  Surname: "Li", Given Name: "Xiaohong", University: "Tsinghua University", Major: "Computer Science & Technology"
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Workbench */}
        <ToolWorkbench />

        {/* Smart Recognition Features */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Smart Recognition Special Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-blue-600">🎯 Automatic Mode Detection</h3>
              <p className="mb-3 text-gray-600">
                System automatically analyzes text content and intelligently recommends the most suitable split mode:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Auto-suggest "Chinese Name" split when Chinese name pattern detected</li>
                <li>• Suggest delimiter split when common separators (comma, space, semicolon) identified</li>
                <li>• Provide specialized split templates when email, phone formats discovered</li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-green-600">🔍 Uncertain Sample Alerts</h3>
              <p className="mb-3 text-gray-600">
                For uncertain split results, system marks and provides manual review:
              </p>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Complex format text marked as "needs review"</li>
                <li>• Provides first 50 uncertain samples for user inspection</li>
                <li>• Support batch adjustment of split rules for uncertain samples</li>
              </ul>
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
              <h3 className="mb-2 font-semibold">Q: What's the accuracy rate for Chinese name splitting?</h3>
              <p className="text-gray-600">
                A: For common 2-3 character names, accuracy exceeds 95%. Complex compound surnames or ethnic minority names are marked as uncertain samples for review.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: Can I customize split rules?</h3>
              <p className="text-gray-600">
                A: Yes. Support custom delimiters, regular expressions, and creating specialized split templates for specific text formats.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: Can column names after splitting be customized?</h3>
              <p className="text-gray-600">
                A: Absolutely. You can specify column names for each split result, such as "Surname", "Given Name", "Province", "City", etc.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: How to handle data that failed to split?</h3>
              <p className="text-gray-600">
                A: System keeps data that can't be split in the original column and notes it in the report. You can export uncertain samples for manual processing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
