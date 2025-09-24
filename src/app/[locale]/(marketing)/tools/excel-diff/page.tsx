import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ToolWorkbench } from '@/components/ToolWorkbench';
import { SEO_KEYWORDS_CORE, SEO_KEYWORDS_ANALYSIS } from '@/lib/seo-keywords';

type IToolProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Excel File Version Comparison Tool - Fast Data Difference Detection | SheetAlly',
    description: 'Excel version comparison without manual checking! Intelligently compare two Excel files for differences, automatically generate added, deleted, modified three-category difference reports. Essential for team collaboration and audit accountability.',
    keywords: [...SEO_KEYWORDS_CORE, ...SEO_KEYWORDS_ANALYSIS],
    openGraph: {
      title: 'Excel File Version Comparison Tool - Fast Data Difference Detection',
      description: 'Excel version comparison without manual checking! Intelligently compare two Excel files for differences, automatically generate detailed difference reports.',
      type: 'website',
      url: 'https://sheetally.com/tools/excel-diff',
      siteName: 'SheetAlly',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Excel File Version Comparison Tool',
      description: 'Excel version comparison without manual checking!',
    },
    alternates: {
      canonical: 'https://sheetally.com/tools/excel-diff',
    },
  };
}

export default async function ExcelDiff(props: IToolProps) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Excel Version Comparison: Intelligently Find Data Differences, Skip Manual Checking
          </h1>
          <p className="mx-auto max-w-3xl text-xl text-gray-600">
            Excel files frequently modified in team collaboration? Worried about data being accidentally changed?
            One-click comparison of differences between two versions, automatically generating detailed reports for added, deleted, and modified data, making every change clearly visible.
          </p>
        </div>

        {/* Version Comparison Pain Points */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Solve Excel Version Management's 5 Major Pain Points
          </h2>
          <div className="grid gap-4 md:grid-cols-5">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Time-consuming Manual Comparison</h3>
              <p className="text-xs text-gray-600">
                Row-by-row, column-by-column data change checking, easy to miss critical modifications
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Difficult Error Detection</h3>
              <p className="text-xs text-gray-600">
                Subtle value changes and deleted rows are easily overlooked
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mb-2 text-sm font-semibold">No Record Keeping</h3>
              <p className="text-xs text-gray-600">
                Comparison results cannot be saved, difficult to trace historical changes
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Chaotic Team Collaboration</h3>
              <p className="text-xs text-gray-600">
                Multiple people modify the same file, don't know who changed what
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mb-2 text-sm font-semibold">Difficult Audit Accountability</h3>
              <p className="text-xs text-gray-600">
                Difficult to quickly locate issues and responsible parties when data anomalies occur
              </p>
            </div>
          </div>
        </div>

        {/* Smart Comparison Solution */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Smart Comparison Solution
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-green-600">⚡ Second-level Smart Comparison</h3>
              <p className="text-sm text-gray-600">
                Upload two Excel files, system automatically aligns data by primary key and intelligently identifies all differences,
                over 100x faster than manual checking.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-10 w-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-blue-600">📊 Three Detailed Reports</h3>
              <p className="text-sm text-gray-600">
                Automatically generate three detailed report tables for added, deleted, and modified data,
                each change has old→new comparison, clear at a glance.
              </p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100">
                <svg className="h-10 w-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="mb-3 text-lg font-semibold text-purple-600">📈 Statistical Overview</h3>
              <p className="text-sm text-gray-600">
                Provide change statistics overview: Added X rows, Deleted Y rows, Modified Z cells,
                helping quickly assess change impact scope.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison Reports */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Comparison Report Details
          </h2>
          <div className="space-y-6">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="mb-3 flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                  <span className="text-sm font-bold">+</span>
                </div>
                <h3 className="text-lg font-semibold text-green-700">Added Data Report</h3>
              </div>
              <p className="mb-3 text-gray-700">
                Shows data rows present in new version but not in old version, helping identify newly added records.
              </p>
              <div className="rounded border bg-white p-3">
                <div className="text-sm">
                  <div className="mb-2 grid grid-cols-4 gap-2 font-medium">
                    <span>Customer ID</span>
                    <span>Customer Name</span>
                    <span>Phone</span>
                    <span>Created Date</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-green-600">
                    <span>C001</span>
                    <span>New Customer A</span>
                    <span>138****1234</span>
                    <span>2023-05-15</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-green-600">
                    <span>C002</span>
                    <span>New Customer B</span>
                    <span>139****5678</span>
                    <span>2023-05-16</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="mb-3 flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white">
                  <span className="text-sm font-bold">−</span>
                </div>
                <h3 className="text-lg font-semibold text-red-700">Removed Data Report</h3>
              </div>
              <p className="mb-3 text-gray-700">
                Shows data rows present in old version but not in new version, helping identify deleted records.
              </p>
              <div className="rounded border bg-white p-3">
                <div className="text-sm">
                  <div className="mb-2 grid grid-cols-4 gap-2 font-medium">
                    <span>Customer ID</span>
                    <span>Customer Name</span>
                    <span>Phone</span>
                    <span>Status</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-red-600 line-through">
                    <span>C999</span>
                    <span>Deleted Customer</span>
                    <span>138****0000</span>
                    <span>Deactivated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <div className="mb-3 flex items-center">
                <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500 text-white">
                  <span className="text-sm font-bold">~</span>
                </div>
                <h3 className="text-lg font-semibold text-yellow-700">Modified Data Report</h3>
              </div>
              <p className="mb-3 text-gray-700">
                Shows data rows present in both versions but with content changes, detailing old→new changes.
              </p>
              <div className="rounded border bg-white p-3">
                <div className="text-sm">
                  <div className="mb-2 grid grid-cols-5 gap-2 font-medium">
                    <span>Customer ID</span>
                    <span>Field Name</span>
                    <span>Old Value</span>
                    <span>→</span>
                    <span>New Value</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <span>C100</span>
                    <span>Phone</span>
                    <span className="text-red-600">138****1111</span>
                    <span>→</span>
                    <span className="text-green-600">139****2222</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <span>C100</span>
                    <span>Credit Rating</span>
                    <span className="text-red-600">B</span>
                    <span>→</span>
                    <span className="text-green-600">A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Common Use Cases
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="mb-2 text-lg font-semibold">🤝 Team Collaboration Management</h3>
                <p className="text-gray-600">
                  After multiple people edit the same Excel file, quickly identify each person's modifications with version comparison,
                  prevent important data from being accidentally deleted or modified.
                </p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="mb-2 text-lg font-semibold">📊 Data Quality Monitoring</h3>
                <p className="text-gray-600">
                  Regularly compare historical versions of business data, monitor trends in key indicators,
                  timely discover data anomalies and quality issues.
                </p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="mb-2 text-lg font-semibold">⚖️ Audit Compliance Checking</h3>
                <p className="text-gray-600">
                  During financial audits and compliance checks, quickly compare data versions from different periods,
                  generate detailed change reports as audit evidence.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="mb-2 text-lg font-semibold">🔒 Security Incident Investigation</h3>
                <p className="text-gray-600">
                  When malicious data tampering is discovered, quickly locate specific modified content through version comparison,
                  providing detailed clues for security incident investigation.
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="mb-2 text-lg font-semibold">🔄 Change Management Process</h3>
                <p className="text-gray-600">
                  Before and after important changes like system upgrades and data migrations, compare data differences,
                  verify whether changes were executed as expected.
                </p>
              </div>
              <div className="border-l-4 border-teal-500 pl-4">
                <h3 className="mb-2 text-lg font-semibold">📈 Business Analysis Support</h3>
                <p className="text-gray-600">
                  Compare business data from different time points, analyze business trends like customer churn and product changes,
                  provide data support for decision making.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tool Workbench */}
        <ToolWorkbench />

        {/* Comparison Algorithm */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800">
            Smart Comparison Algorithm
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-3 text-lg font-semibold text-blue-600">🔗 Smart Primary Key Recognition</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="mb-1 font-medium">Auto Recognition:</h4>
                  <p className="text-sm text-gray-600">
                    System automatically identifies possible primary key columns like "ID", "Code", "Number",
                    and analyzes data uniqueness to determine the best primary key combination.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Manual Specification:</h4>
                  <p className="text-sm text-gray-600">
                    If auto recognition is inaccurate, you can manually select one or more columns as primary keys,
                    ensuring data alignment accuracy.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Composite Keys:</h4>
                  <p className="text-sm text-gray-600">
                    Support multi-column combinations as primary keys, like "Customer ID + Product Code" composite keys,
                    adapting to complex business scenarios.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-lg font-semibold text-green-600">🎯 Difference Detection Precision</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="mb-1 font-medium">Numeric Comparison:</h4>
                  <p className="text-sm text-gray-600">
                    Auto-identify numeric type fields, support floating-point precision settings,
                    avoid false positives due to rounding errors.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Text Comparison:</h4>
                  <p className="text-sm text-gray-600">
                    Support case sensitive/insensitive comparison, auto-handle leading/trailing spaces,
                    ensure text comparison accuracy.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 font-medium">Date Comparison:</h4>
                  <p className="text-sm text-gray-600">
                    Intelligently recognize date formats, convert uniformly before comparison,
                    avoid misjudgment due to format differences.
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
              <h3 className="mb-2 font-semibold">Q: What if the two files have different column structures?</h3>
              <p className="text-gray-600">
                A: System automatically handles column structure differences. Added columns appear in "Added" report, deleted columns appear in "Removed" report, common columns undergo content comparison.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: Can multiple worksheets be compared?</h3>
              <p className="text-gray-600">
                A: Current version supports single worksheet comparison. If files contain multiple worksheets, you can select specific worksheets to compare, or compare multiple worksheets separately.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: Can comparison results be exported?</h3>
              <p className="text-gray-600">
                A: Yes. System generates Excel files containing three worksheets (Added/Removed/Modified), plus JSON format detailed reports for programmatic processing.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold">Q: Are large file comparisons supported?</h3>
              <p className="text-gray-600">
                A: Supported, but recommend individual files not exceed 25MB. For very large files, system provides progress display ensuring comparison process visibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
