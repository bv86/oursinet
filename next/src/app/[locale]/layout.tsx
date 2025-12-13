import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Footer from '@/components/layouts/Footer';
import { type Locale } from '@/config';
import { getGlobalSettings } from '@/lib/data/loaders';
import Header from '@/components/layouts/Header';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getTranslation } from '@/i18n.utils';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const revalidate = 3600; // Cache for 1 hour (in seconds)
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: {
      template: '%s',
      default: 'Oursi.net - Benoit Vannesson',
    },
    description: await getTranslation(locale as Locale, 'meta.description'),
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
    params: Promise<{ locale: string }>;
  }>
) {
  const { locale } = await props.params;
  const { children } = props;
  const { header, footer } = await loader(locale as Locale);

  return (
    <html lang={locale}>
      <body className={`${inter.className} antialiased h-screen`}>
        <div className="flex flex-col overflow-x-clip h-full items-center">
          <Header data={header} locale={locale as Locale} />
          <main className="container max-w-5xl flex flex-grow flex-col">
            {children}
          </main>
          <Footer data={footer} />
        </div>
        {/* Google Analytics tag */}
        {process.env.GA_MEASUREMENT_ID && (
          <GoogleAnalytics gaId={process.env.GA_MEASUREMENT_ID} />
        )}
        {/* Gorgias Chat */}

        {/* Gorgias Chat Widget Start */}
        {process.env.GORGIAS_BUNDLE_ID && (
          <script
            id="gorgias-chat-widget-install-v3"
            src={`https://config.gorgias.chat/bundle-loader/${process.env.GORGIAS_BUNDLE_ID}`}
          ></script>
        )}
        {/* Gorgias Chat Widget End */}

        {/* Bundle Start */}
        {process.env.GORGIAS_CVT_ID && (
          <script
            src={`https://cdn.9gtb.com/loader.js?g_cvt_id=${process.env.GORGIAS_CVT_ID}`}
            async
          ></script>
        )}
        {/* Bundle End */}
      </body>
    </html>
  );
}
