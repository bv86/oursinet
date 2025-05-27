import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/layouts/Footer';
import { type Locale } from '@/config';
import { getGlobalSettings } from '@/lib/data/loaders';
import Header from '@/components/layouts/Header';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GA_MEASUREMENT_ID } from '@/lib/analytics';
import { getTranslation } from '@/i18n.utils';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: {
      template: '%s | Oursi.net - Benoit Vannesson',
      default: 'Oursi.net - Benoit Vannesson',
    },
    description: await getTranslation(locale, 'meta.description'),
  };
}

async function loader(locale: Locale) {
  const { data } = await getGlobalSettings(locale);
  if (!data) throw new Error('Failed to fetch global settings');
  return { header: data?.header, footer: data?.footer };
}

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
  }>
) {
  const { locale } = await props.params;
  const { children } = props;
  const { header, footer } = await loader(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased h-screen`}>
        <div className="flex flex-col overflow-x-clip h-full items-center">
          <Header data={header} locale={locale} />
          <main className="container max-w-5xl flex flex-grow flex-col">
            {children}
          </main>
          <Footer data={footer} />
        </div>
        {/* Google Analytics tag */}
        <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
      </body>
    </html>
  );
}
