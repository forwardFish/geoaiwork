import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ToolWorkbench } from '@/components/ToolWorkbench';
import { SEO_KEYWORDS_CORE, SEO_KEYWORDS_PLATFORMS } from '@/lib/seo-keywords';

type IToolProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Excel Smart Sheet Merger - AI Column Mapping Tool | SheetAlly',
    description: 'Merge Excel sheets with mismatched column names using AI-powered intelligent column mapping. Automatically suggests column relationships and supports various join types. Perfect VLOOKUP alternative.',
    keywords: [...SEO_KEYWORDS_CORE, ...SEO_KEYWORDS_PLATFORMS],
    openGraph: {
      title: 'Excel Smart Sheet Merger - AI Column Mapping Tool',
      description: 'AI-powered Excel sheet merger that intelligently maps similar column names automatically. Say goodbye to VLOOKUP headaches when column names don\'t match.',
      type: 'website',
      url: 'https://sheetally.com/tools/merge-sheets-mapping',
      siteName: 'SheetAlly',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Excel Smart Sheet Merger Tool',
      description: 'AI-powered column mapping makes Excel sheet merging effortless.',
    },
    alternates: {
      canonical: 'https://sheetally.com/tools/merge-sheets-mapping',
    },
  };
}

export default async function MergeSheetsMapping(props: IToolProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Excel Smart Sheet Merger: AI Column Mapping Makes VLOOKUP Obsolete
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Solve Excel sheet merging challenges when column names don't match. AI intelligently identifies similar column names and suggests mapping relationships.
            Supports multiple join types and perfectly replaces complex VLOOKUP operations.
          </p>
        </div>

        {/* VLOOKUP Pain Points */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Solve VLOOKUP's 4 Major Pain Points
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <span className="text-sm font-bold text-red-600">1</span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Column Name Mismatch Failure</h3>
                <p className="text-sm text-gray-600">
                  Column differences like "Customer Name" vs "Name", "Product ID" vs "Product Code" cause VLOOKUP to fail
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <span className="text-sm font-bold text-red-600">2</span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Manual Column Reordering Required</h3>
                <p className="text-sm text-gray-600">
                  VLOOKUP requires lookup column on the left, return column on the right - often need to restructure tables
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <span className="text-sm font-bold text-red-600">3</span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">Complex Error-Prone Formulas</h3>
                <p className="text-sm text-gray-600">
                  INDEX+MATCH combinations are complex, absolute references easily forgotten, array formulas hard to understand
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                <span className="text-sm font-bold text-red-600">4</span>
              </div>
              <div>
                <h3 className="mb-1 font-semibold">No Batch Processing for Multiple Tables</h3>
                <p className="text-sm text-gray-600">
                  Multiple vendor or department Excel sheets need individual processing - repetitive and time-consuming
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AI Smart Solution */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            AI Smart Merging Solution
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Intelligent Column Recognition</h3>
              <p className="text-sm text-gray-600">
                AI automatically identifies similar columns like "Customer Name"="Name", "Product ID"="Product Code"
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">One-Click Mapping Confirmation</h3>
              <p className="text-sm text-gray-600">
                System automatically suggests column mapping relationships, users confirm and execute merge instantly
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.57 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.57 4 8 4s8-1.79 8-4M4 7c0-2.21 3.57-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="mb-2 font-semibold">Multiple Join Types</h3>
              <p className="text-sm text-gray-600">
                Support left join, inner join, right join - preserve or filter unmatched data as needed
              </p>
            </div>
          </div>
        </div>

        {/* Use Case Examples */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Common Use Cases
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="mb-2 text-lg font-semibold">📊 Financial Data Integration</h3>
              <p className="mb-2 text-gray-600">
                Merge expense reports from multiple departments, automatically matching "Expense Category" with "Cost Type", "Reimbursee" with "Applicant", etc.
              </p>
              <div className="text-sm text-gray-500">
                Common column differences: Reimbursement Amount ↔ Expense Amount, Department Name ↔ Department
              </div>
            </div>
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="mb-2 text-lg font-semibold">🛒 Vendor Data Consolidation</h3>
              <p className="mb-2 text-gray-600">
                Integrate product catalogs from different vendors, intelligently matching "Product Name" with "Item Name", "Unit Price" with "Price", etc.
              </p>
              <div className="text-sm text-gray-500">
                Common column differences: Vendor Code ↔ Vendor ID, Delivery Time ↔ Shipping Period
              </div>
            </div>
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="mb-2 text-lg font-semibold">👥 Customer Information Management</h3>
              <p className="mb-2 text-gray-600">
                Merge customer data from sales and customer service teams, automatically recognizing "Customer Name" vs "Company Name", "Contact" vs "Phone".
              </p>
              <div className="text-sm text-gray-500">
                Common column differences: Contact Person ↔ Representative, Registered Address ↔ Company Address
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Simple 4-Step Smart Merging Process
          </h2>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-blue-600">1</span>
              </div>
              <h4 className="mb-1 font-semibold">Upload Two Sheets</h4>
              <p className="text-xs text-gray-600">Select Excel files to merge</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-blue-600">2</span>
              </div>
              <h4 className="mb-1 font-semibold">Confirm Column Mapping</h4>
              <p className="text-xs text-gray-600">AI suggests mapping, manually adjust</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-blue-600">3</span>
              </div>
              <h4 className="mb-1 font-semibold">Preview Merge Results</h4>
              <p className="text-xs text-gray-600">Review merge effects and statistics</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <span className="font-bold text-blue-600">4</span>
              </div>
              <h4 className="mb-1 font-semibold">Export Excel File</h4>
              <p className="text-xs text-gray-600">Get complete merged results</p>
            </div>
          </div>
        </div>

        {/* Tool Workbench */}
        <ToolWorkbench />

        {/* Comparison Table */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            vs Traditional VLOOKUP Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left">Comparison Item</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">Traditional VLOOKUP</th>
                  <th className="border border-gray-300 px-4 py-2 text-center">SheetAlly Smart Merger</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Column Name Mismatch Handling</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-red-600">❌ Manual column name editing required</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-600">✅ AI automatically recognizes matches</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Operation Complexity</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-red-600">❌ Need to learn formula syntax</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-600">✅ Visual operation interface</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Error Rate</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-red-600">❌ Formulas prone to errors</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-600">✅ Preview confirmation reduces risk</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 font-medium">Batch Processing</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-red-600">❌ Need to process each file individually</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-600">✅ Support recipe reuse</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 font-medium">Processing Time</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-red-600">❌ 30-60 minutes</td>
                  <td className="border border-gray-300 px-4 py-2 text-center text-green-600">✅ 3-5 minutes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-6 text-2xl font-semibold text-gray-800">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold">Q: How does AI identify similar column names?</h3>
              <p className="text-gray-600">
                A: The system uses string similarity algorithms and semantic analysis to recognize common column correspondences like "Customer Name"="Name", "Product ID"="Product Code".
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: What if AI's suggested mapping relationships are incorrect?</h3>
              <p className="text-gray-600">
                A: You can manually adjust mapping relationships. The system provides an intuitive drag-and-drop interface for easy column correspondence modifications.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: What join types are supported?</h3>
              <p className="text-gray-600">
                A: Supports left join (keep all left table data), inner join (keep only matched data), right join (keep all right table data).
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: How are duplicate column names handled after merging?</h3>
              <p className="text-gray-600">
                A: Right table duplicate column names automatically get "_r" suffix, like "Amount" and "Amount_r", avoiding column name conflicts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
