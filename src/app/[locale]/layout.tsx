import type { Metadata } from 'next';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { PostHogProvider } from '@/components/analytics/PostHogProvider';
import { SEO_KEYWORDS_ALL } from '@/lib/seo-keywords';
import { routing } from '@/libs/I18nRouting';
import '@/styles/global.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sheetally.com'),
  title: {
    default: 'SheetAlly – AI-Powered Excel Data Processing',
    template: '%s | SheetAlly',
  },
  description:
    'AI Excel workbench for duplicate removal (keep latest), sheet merging with AI column mapping, text split/clean, date/currency normalization, and Excel diff with preview and audit trail.',
  keywords: SEO_KEYWORDS_ALL,
  icons: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/favicon-16x16.png',
    },
    {
      rel: 'icon',
      url: '/favicon.ico',
    },
    {
      rel: 'icon',
      type: 'image/svg+xml',
      url: '/favicon.svg',
    },
  ],
  openGraph: {
    siteName: 'SheetAlly',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@sheetally_com',
  },
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-VS02Z7P0EE"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-VS02Z7P0EE');
          `,
        }}
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <PostHogProvider>
            {props.children}
          </PostHogProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
